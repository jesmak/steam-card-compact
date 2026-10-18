import { describe, expect, it } from "vitest";

import {
    avatarUrl,
    displayName,
    elapsed,
    groupByStatus,
    inGame,
    isSteamPlayer,
    pairs,
    playTime,
    readPlayer,
    sortByName,
    steamPlayers,
} from "../src/friends";
import type { Player } from "../src/friends";
import type { EntityRegistryEntry, HassEntity, HomeAssistant } from "../src/hass";

function entity(values: Partial<HassEntity> & { name?: string } = {}): HassEntity {
    const { name, ...rest } = values;
    return {
        entity_id: "sensor.steam_one",
        state: "online",
        attributes: { friendly_name: name ?? "One" },
        ...rest,
    } as HassEntity;
}

function player(values: Partial<HassEntity> & { name?: string; game?: string } = {}): Player {
    const { game, ...rest } = values;
    return { entity: entity(rest), game };
}

describe("what a player is called", () => {
    it("is the name the configuration gives", () => {
        const one = entity({ entity_id: "sensor.steam_abc", name: "Friendly" });
        expect(displayName(one, [{ entity: "sensor.steam_abc", name: "ABC-MAN" }])).toBe("ABC-MAN");
    });

    it("is the entity’s own name when the configuration says nothing", () => {
        expect(displayName(entity({ name: "Friendly" }), [])).toBe("Friendly");
        expect(displayName(entity({ name: "Friendly" }), undefined)).toBe("Friendly");
    });

    it("falls back to the entity id when there is no name at all", () => {
        const one = { entity_id: "sensor.steam_x", state: "online", attributes: {} } as HassEntity;
        expect(displayName(one, undefined)).toBe("sensor.steam_x");
    });

    it("orders players by the name that is shown", () => {
        const one = player({ entity_id: "sensor.steam_a", name: "Zeta" });
        const other = player({ entity_id: "sensor.steam_b", name: "Alpha" });
        const overrides = [{ entity: "sensor.steam_a", name: "Aaa" }];
        expect(sortByName([one, other], overrides).map((item) => item.entity.entity_id)).toEqual(["sensor.steam_a", "sensor.steam_b"]);
    });

    it("leaves the given list alone", () => {
        const list = [player({ entity_id: "b", name: "B" }), player({ entity_id: "a", name: "A" })];
        sortByName(list, undefined);
        expect(list[0].entity.entity_id).toBe("b");
    });
});

describe("grouping players", () => {
    it("puts each player under their state", () => {
        const groups = groupByStatus([player(), player({ entity_id: "x", state: "offline" })]);
        expect(Object.keys(groups).sort()).toEqual(["offline", "online"]);
    });

    it("puts the players in a game in a group of their own, whatever their state", () => {
        const groups = groupByStatus([player({ game: "Factorio" }), player({ state: "away", game: "Valheim" }), player()]);
        expect(groups.ingame).toHaveLength(2);
        expect(groups.online).toHaveLength(1);
    });

    it("doesn't count the last game of a player who went offline", () => {
        const offline = player({ state: "offline", game: "Factorio" });
        expect(inGame(offline)).toBe(false);
        expect(groupByStatus([offline])).toHaveProperty("offline");
    });

    it("treats a state the card does not know as unavailable", () => {
        expect(groupByStatus([player({ state: "confused" })])).toHaveProperty("unavailable");
    });

    it("lists two players per row", () => {
        const list = [player(), player(), player()];
        expect(pairs(list).map((row) => row.length)).toEqual([2, 1]);
        expect(pairs([])).toEqual([]);
    });
});

describe("how long ago something was", () => {
    const now = Date.parse("2026-09-16T12:00:00Z");

    it.each([
        ["2026-09-16T11:59:30Z", 30, "seconds"],
        ["2026-09-16T11:30:00Z", 30, "minutes"],
        ["2026-09-16T06:00:00Z", 6, "hours"],
        ["2026-09-13T12:00:00Z", 3, "days"],
        ["2026-08-16T12:00:00Z", 4, "weeks"],
    ])("reads %s as %i %s", (time, amount, unit) => {
        expect(elapsed(time, now)).toEqual({ amount, unit });
    });

    it("gives nothing when there is no usable time", () => {
        expect(elapsed(undefined, now)).toBeUndefined();
        expect(elapsed("", now)).toBeUndefined();
        expect(elapsed("not a date", now)).toBeUndefined();
    });

    it("never counts backwards", () => {
        expect(elapsed("2026-09-16T12:30:00Z", now)).toEqual({ amount: 0, unit: "seconds" });
    });
});

describe("how long a game has been played", () => {
    const now = Date.parse("2026-09-16T12:00:00Z");

    it("is whole hours and minutes", () => {
        expect(playTime("2026-09-16T10:39:30Z", now)).toEqual({ hours: 1, minutes: 20 });
        expect(playTime("2026-09-16T11:48:00Z", now)).toEqual({ hours: 0, minutes: 12 });
        expect(playTime("2026-09-15T09:00:00Z", now)).toEqual({ hours: 27, minutes: 0 });
    });

    it("is nothing without a start, and never negative", () => {
        expect(playTime(undefined, now)).toBeUndefined();
        expect(playTime("2026-09-16T12:05:00Z", now)).toEqual({ hours: 0, minutes: 0 });
    });
});

describe("the picture of a player", () => {
    it("is asked for at full size", () => {
        const one = entity({ attributes: { entity_picture: "/api/image/steam_medium.jpg" } } as Partial<HassEntity>);
        expect(avatarUrl(one)).toBe("/api/image/steam_full.jpg");
    });

    it("is nothing when the player has none", () => {
        expect(avatarUrl(entity())).toBeUndefined();
    });
});

describe("finding the Steam players", () => {
    const steam = (id: string, attributes: Record<string, unknown> = {}) => ({ entity_id: id, state: "online", attributes });
    const entry = (id: string, translation_key: string, platform = "steam_online"): EntityRegistryEntry => ({
        entity_id: id,
        device_id: "d1",
        platform,
        translation_key,
    });

    it("goes by the registry when the frontend has it", () => {
        const entities = {
            "sensor.steam_abc": entry("sensor.steam_abc", "account"),
            // A player called Steam Abc gets sensors whose ids look like a player's.
            "sensor.steam_abc_level": entry("sensor.steam_abc_level", "level"),
            "sensor.steam_thing": entry("sensor.steam_thing", "temperature", "other"),
        };
        expect(isSteamPlayer(steam("sensor.steam_abc"), entities)).toBe(true);
        expect(isSteamPlayer(steam("sensor.steam_abc_level"), entities)).toBe(false);
        expect(isSteamPlayer(steam("sensor.steam_thing"), entities)).toBe(false);
    });

    it("knows a player named sensor.steam_* without the registry", () => {
        expect(isSteamPlayer(steam("sensor.steam_abc"))).toBe(true);
    });

    it("knows a player the integration named after them, by Steam's own states", () => {
        // The integration names a player added later sensor.<name>, with no steam_ in it.
        expect(isSteamPlayer(steam("sensor.pok25", { options: ["offline", "online", "looking_to_trade"] }))).toBe(true);
    });

    it("isn't a sensor the registry doesn't know, whatever it is called", () => {
        // A template sensor without a unique id, say, has no registry entry; every player has one.
        expect(isSteamPlayer(steam("sensor.steam_deck_battery"), {})).toBe(false);
    });

    it("leaves everything else alone", () => {
        expect(isSteamPlayer(steam("sensor.kitchen_temperature", { level: 3 }))).toBe(false);
        expect(isSteamPlayer(steam("light.steam_room"))).toBe(false);
        expect(isSteamPlayer(undefined)).toBe(false);
    });

    it("lists them in order", () => {
        const states = {
            "sensor.steam_abc": steam("sensor.steam_abc"),
            "sensor.pok25": steam("sensor.pok25", { options: ["looking_to_trade"] }),
            "sensor.kitchen": steam("sensor.kitchen"),
        };
        expect(steamPlayers({ states })).toEqual(["sensor.pok25", "sensor.steam_abc"]);
    });
});

describe("reading a player", () => {
    const account = entity({
        entity_id: "sensor.steam_abc",
        attributes: {
            friendly_name: "Abc",
            game: "Old attribute game",
            game_id: "1",
            level: 1,
            last_online: "2026-01-01T00:00:00+00:00",
            game_image_header: "/attribute-header.jpg",
        },
    });

    function device(states: HassEntity[], keys: Record<string, string>): HomeAssistant {
        const entities: Record<string, EntityRegistryEntry> = {
            [account.entity_id]: { entity_id: account.entity_id, device_id: "d1", platform: "steam_online", translation_key: "account" },
        };
        for (const [id, key] of Object.entries(keys)) {
            entities[id] = { entity_id: id, device_id: "d1", platform: "steam_online", translation_key: key };
        }
        // Another player's device, which must not be mixed in.
        entities["sensor.other_level"] = {
            entity_id: "sensor.other_level",
            device_id: "d2",
            platform: "steam_online",
            translation_key: "level",
        };
        return {
            states: Object.fromEntries(
                [account, ...states, entity({ entity_id: "sensor.other_level", state: "99" })].map((item) => [item.entity_id, item]),
            ),
            entities,
        };
    }

    it("reads the integration's own entities of the player's device", () => {
        const hass = device(
            [
                entity({
                    entity_id: "sensor.abc_now_playing",
                    state: "Factorio",
                    attributes: { app_id: "427520", entity_picture: "/icon.jpg" },
                    last_changed: "2026-09-16T10:40:00Z",
                }),
                entity({ entity_id: "sensor.abc_level", state: "42" }),
                entity({ entity_id: "sensor.abc_last_online", state: "2026-09-16T08:00:00+00:00" }),
                entity({ entity_id: "image.abc_library_hero", state: "2026-09-16T10:40:00", attributes: { entity_picture: "/hero" } }),
                entity({ entity_id: "image.abc_library_logo", state: "2026-09-16T10:40:00", attributes: { entity_picture: "/logo" } }),
                entity({ entity_id: "image.abc_header_capsule", state: "2026-09-16T10:40:00", attributes: { entity_picture: "/header" } }),
            ],
            {
                "sensor.abc_now_playing": "now_playing",
                "sensor.abc_level": "level",
                "sensor.abc_last_online": "last_online",
                "image.abc_library_hero": "library_hero",
                "image.abc_library_logo": "library_logo",
                "image.abc_header_capsule": "header_capsule",
            },
        );
        expect(readPlayer(hass, account)).toEqual({
            entity: account,
            game: "Factorio",
            gameId: "427520",
            gameIcon: "/icon.jpg",
            gameSince: "2026-09-16T10:40:00Z",
            header: "/header",
            main: undefined,
            hero: "/hero",
            logo: "/logo",
            level: "42",
            lastOnline: "2026-09-16T08:00:00+00:00",
        });
    });

    it("isn't in a game when the now playing sensor says unknown, whatever the old attributes say", () => {
        const hass = device([entity({ entity_id: "sensor.abc_now_playing", state: "unknown", attributes: { app_id: null } })], {
            "sensor.abc_now_playing": "now_playing",
        });
        expect(readPlayer(hass, account).game).toBeUndefined();
    });

    it("takes no picture from the old attributes while the device's image entity has none", () => {
        const hass = device(
            [
                entity({ entity_id: "sensor.abc_now_playing", state: "Factorio", attributes: {} }),
                entity({ entity_id: "image.abc_header_capsule", state: "unavailable", attributes: {} }),
            ],
            { "sensor.abc_now_playing": "now_playing", "image.abc_header_capsule": "header_capsule" },
        );
        expect(readPlayer(hass, account).header).toBeUndefined();
    });

    it("leaves out an image while its entity is unavailable", () => {
        const hass = device(
            [
                entity({ entity_id: "sensor.abc_now_playing", state: "Factorio", attributes: {} }),
                entity({ entity_id: "image.abc_library_hero", state: "unavailable", attributes: { entity_picture: "/hero" } }),
            ],
            { "sensor.abc_now_playing": "now_playing", "image.abc_library_hero": "library_hero" },
        );
        expect(readPlayer(hass, account).hero).toBeUndefined();
    });

    it("falls back to the deprecated attributes on a Home Assistant without the entities", () => {
        const read = readPlayer({ states: { [account.entity_id]: account } }, account);
        expect(read).toMatchObject({
            game: "Old attribute game",
            gameId: "1",
            level: "1",
            lastOnline: "2026-01-01T00:00:00+00:00",
            header: "/attribute-header.jpg",
            hero: undefined,
        });
        // The account sensor changes with the player's state too, so it can't tell when the game started.
        expect(read.gameSince).toBeUndefined();
    });
});
