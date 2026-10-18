import { STATUSES, STEAM_PREFIX } from "./const";
import type { EntityRegistryEntry, HassEntity, HomeAssistant } from "./hass";
import type { NameOverride } from "./types";

const PLATFORM = "steam_online";

/** A player as the card draws them. */
export interface Player {
    entity: HassEntity;
    game?: string;
    gameId?: string;
    gameIcon?: string;
    /** When Home Assistant saw the game start, so a restart makes it later than the truth. */
    gameSince?: string;
    header?: string;
    main?: string;
    hero?: string;
    logo?: string;
    level?: string;
    lastOnline?: string;
}

/**
 * Whether an entity is a Steam player.
 *
 * The registry says so when the frontend has it: the integration's account sensor. Without it, as on a Home
 * Assistant from before the frontend had it, the entity id or Steam's own list of states tells, since a player
 * added later is `sensor.<name>`, not `sensor.steam_<name>`.
 */
export function isSteamPlayer(entity: HassEntity | undefined, entities?: HomeAssistant["entities"]): boolean {
    if (entity === undefined || !entity.entity_id.startsWith("sensor.")) {
        return false;
    }
    // Every player is in the registry, so a sensor that isn't, such as a template sensor called steam_deck, is no player
    if (entities !== undefined) {
        const entry = entities[entity.entity_id];
        return entry?.platform === PLATFORM && entry.translation_key === "account";
    }
    if (entity.entity_id.startsWith(STEAM_PREFIX)) {
        return true;
    }
    const options = entity.attributes.options;
    return Array.isArray(options) && options.includes("looking_to_trade");
}

/** The Steam players of an instance, by entity id. */
export function steamPlayers(hass: Pick<HomeAssistant, "states" | "entities">): string[] {
    return Object.keys(hass.states)
        .filter((id) => isSteamPlayer(hass.states[id], hass.entities))
        .sort();
}

// The registry is the same object until it changes, so it is indexed by device once, not once per player.
const byDevice = new WeakMap<object, Map<string, EntityRegistryEntry[]>>();

function deviceEntries(entities: NonNullable<HomeAssistant["entities"]>, device: string): EntityRegistryEntry[] {
    let index = byDevice.get(entities);
    if (index === undefined) {
        index = new Map();
        for (const entry of Object.values(entities)) {
            if (entry?.device_id && entry.platform === PLATFORM) {
                const entries = index.get(entry.device_id) ?? [];
                entries.push(entry);
                index.set(entry.device_id, entries);
            }
        }
        byDevice.set(entities, index);
    }
    return index.get(device) ?? [];
}

/** The integration's entities of a player's device, the player's own sensor included. */
export function deviceEntityIds(hass: HomeAssistant, entityId: string): string[] {
    const device = hass.entities?.[entityId]?.device_id;
    return hass.entities && device ? deviceEntries(hass.entities, device).map((entry) => entry.entity_id) : [entityId];
}

/** The integration's other entities of a player's device, by what they are: `now_playing`, `level`, `library_hero`. */
function siblings(hass: HomeAssistant, entityId: string): Map<string, HassEntity> {
    const found = new Map<string, HassEntity>();
    const device = hass.entities?.[entityId]?.device_id;
    if (!hass.entities || !device) {
        return found;
    }
    for (const entry of deviceEntries(hass.entities, device)) {
        const state = hass.states[entry.entity_id];
        if (entry.translation_key && entry.entity_id !== entityId && state) {
            found.set(entry.translation_key, state);
        }
    }
    return found;
}

function known(value: unknown): string | undefined {
    if (value === undefined || value === null || value === "" || value === "unknown" || value === "unavailable") {
        return undefined;
    }
    return String(value);
}

/** An image entity's picture, while it has one: it is unavailable when the player is in no game. */
function pictureOf(entity: HassEntity): string | undefined {
    return entity.state !== "unavailable" ? known(entity.attributes.entity_picture) : undefined;
}

/**
 * A player, read from the integration's own entities of their device: now playing, level, last online and the
 * game's pictures. The same values as attributes of the player's sensor are deprecated and go in Home Assistant
 * 2027.2, so they are read only when the device has no such entity, as on a Home Assistant from before them.
 */
export function readPlayer(hass: HomeAssistant, entity: HassEntity): Player {
    const own = siblings(hass, entity.entity_id);
    const attributes = entity.attributes;
    const playing = own.get("now_playing");
    const levelSensor = own.get("level");
    const lastOnlineSensor = own.get("last_online");

    const game = playing ? known(playing.state) : known(attributes.game);
    // A picture comes from its image entity when the device has one, even while it has no picture yet
    const image = (key: string, attribute?: string) => {
        const entity = own.get(key);
        return entity ? pictureOf(entity) : attribute ? known(attributes[attribute]) : undefined;
    };
    const player: Player = {
        entity,
        level: levelSensor ? known(levelSensor.state) : known(attributes.level),
        lastOnline: lastOnlineSensor ? known(lastOnlineSensor.state) : known(attributes.last_online),
    };
    if (game === undefined) {
        return player;
    }
    return {
        ...player,
        game,
        gameId: playing ? known(playing.attributes.app_id) : known(attributes.game_id),
        gameIcon: playing ? known(playing.attributes.entity_picture) : known(attributes.game_icon),
        gameSince: playing ? known(playing.last_changed) : undefined,
        header: image("header_capsule", "game_image_header"),
        main: image("main_capsule", "game_image_main"),
        hero: image("library_hero"),
        logo: image("library_logo"),
    };
}

/** What a player is called: the name the configuration gives, else the entity's own. */
export function displayName(entity: HassEntity, overrides: NameOverride[] | undefined): string {
    const override = overrides?.find((item) => item?.entity === entity.entity_id)?.name;
    return override || String(entity.attributes.friendly_name ?? entity.entity_id);
}

export function sortByName(players: Player[], overrides: NameOverride[] | undefined): Player[] {
    return [...players].sort((one, other) => displayName(one.entity, overrides).localeCompare(displayName(other.entity, overrides)));
}

/** Whether a player is in a game now: Steam keeps the last game of a player who went offline. */
export function inGame(player: Player): boolean {
    return player.game !== undefined && player.entity.state !== "offline" && player.entity.state !== "unavailable";
}

/** What Steam says a player is doing, with a state it doesn't report, such as unknown after a restart, as unavailable. */
export function statusOf(player: Player): string {
    const state = player.entity.state;
    return STATUSES.includes(state as (typeof STATUSES)[number]) && state !== "ingame" ? state : "unavailable";
}

/** The players of each group, in the order the card lists them: those in a game, then by state. */
export function groupByStatus(players: Player[]): Record<string, Player[]> {
    const groups: Record<string, Player[]> = {};
    for (const player of players) {
        (groups[inGame(player) ? "ingame" : statusOf(player)] ??= []).push(player);
    }
    return groups;
}

/** The list card shows two players per row when it is wide enough. */
export function pairs<T>(items: T[]): T[][] {
    const rows: T[][] = [];
    for (let index = 0; index < items.length; index += 2) {
        rows.push(items.slice(index, index + 2));
    }
    return rows;
}

export interface Elapsed {
    amount: number;
    unit: "seconds" | "minutes" | "hours" | "days" | "weeks";
}

function moment(time: string | undefined): number | undefined {
    const value = time ? Date.parse(time) : NaN;
    return Number.isNaN(value) ? undefined : value;
}

/** How long ago something was, in the largest unit that still counts. */
export function elapsed(time: string | undefined, now: number = Date.now()): Elapsed | undefined {
    const since = moment(time);
    if (since === undefined) {
        return undefined;
    }
    const seconds = Math.max(0, Math.floor((now - since) / 1000));
    if (seconds < 60) {
        return { amount: seconds, unit: "seconds" };
    }
    if (seconds < 3600) {
        return { amount: Math.floor(seconds / 60), unit: "minutes" };
    }
    if (seconds < 86400) {
        return { amount: Math.floor(seconds / 3600), unit: "hours" };
    }
    if (seconds < 604800) {
        return { amount: Math.floor(seconds / 86400), unit: "days" };
    }
    return { amount: Math.floor(seconds / 604800), unit: "weeks" };
}

/** How long a game has been played, in whole hours and minutes. */
export function playTime(since: string | undefined, now: number = Date.now()): { hours: number; minutes: number } | undefined {
    const start = moment(since);
    if (start === undefined) {
        return undefined;
    }
    const minutes = Math.max(0, Math.floor((now - start) / 60000));
    return { hours: Math.floor(minutes / 60), minutes: minutes % 60 };
}

/** The full size picture of a player, when they have one. */
export function avatarUrl(entity: HassEntity): string | undefined {
    const picture = entity.attributes.entity_picture;
    return typeof picture === "string" ? picture.replace("_medium", "_full") : undefined;
}
