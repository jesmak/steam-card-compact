import { beforeEach, describe, expect, it, vi } from "vitest";

import { browserLanguage, translate } from "../src/localize/localize";
import "../src/steam-card-compact";
import type { SteamCardCompact } from "../src/steam-card-compact";
import type { EntityRegistryEntry, HassEntity, HomeAssistant } from "../src/hass";
import type { SteamCardCompactConfig } from "../src/types";

function player(id: string, values: Partial<HassEntity["attributes"]> & { state?: string } = {}): HassEntity {
    const { state = "online", ...attributes } = values;
    return {
        entity_id: id,
        state,
        attributes: { friendly_name: id.replace("sensor.steam_", ""), ...attributes },
    };
}

function hass(...players: HassEntity[]): HomeAssistant {
    return {
        locale: { language: "en" },
        states: Object.fromEntries(players.map((entity) => [entity.entity_id, entity])),
    };
}

/**
 * A player as the integration makes them now: the account sensor, and the now playing, level and picture
 * entities of the same device. `game` is what the now playing sensor says.
 */
function device(name: string, game?: string, extra: { hero?: string; logo?: string; since?: string; state?: string } = {}): HomeAssistant {
    const id = `sensor.steam_${name}`;
    const states: HassEntity[] = [
        player(id, { state: extra.state ?? "online" }),
        {
            entity_id: `sensor.${name}_now_playing`,
            state: game ?? "unknown",
            attributes: { app_id: game ? "427520" : null, entity_picture: game ? "/icon.jpg" : undefined },
            last_changed: extra.since,
        },
        { entity_id: `sensor.${name}_level`, state: "42", attributes: {} },
        {
            entity_id: `image.${name}_library_hero`,
            state: extra.hero ? "2026-09-16T10:00:00" : "unavailable",
            attributes: { entity_picture: extra.hero },
        },
        {
            entity_id: `image.${name}_library_logo`,
            state: extra.logo ? "2026-09-16T10:00:00" : "unavailable",
            attributes: { entity_picture: extra.logo },
        },
        {
            entity_id: `image.${name}_header_capsule`,
            state: game ? "2026-09-16T10:00:00" : "unavailable",
            attributes: { entity_picture: "/header" },
        },
    ];
    const keys = ["account", "now_playing", "level", "library_hero", "library_logo", "header_capsule"];
    const entities: Record<string, EntityRegistryEntry> = Object.fromEntries(
        states.map((entity, index) => [
            entity.entity_id,
            { entity_id: entity.entity_id, device_id: name, platform: "steam_online", translation_key: keys[index] },
        ]),
    );
    return { locale: { language: "en" }, states: Object.fromEntries(states.map((entity) => [entity.entity_id, entity])), entities };
}

function merge(...parts: HomeAssistant[]): HomeAssistant {
    return {
        locale: { language: "en" },
        states: Object.assign({}, ...parts.map((part) => part.states)),
        entities: Object.assign({}, ...parts.map((part) => part.entities)),
    };
}

async function card(state: HomeAssistant, config: Partial<SteamCardCompactConfig>, layout?: string): Promise<SteamCardCompact> {
    const element = document.createElement("steam-card-compact") as SteamCardCompact;
    element.setConfig({ type: "custom:steam-card-compact", ...config } as never);
    element.hass = state;
    element.layout = layout;
    document.body.append(element);
    await element.updateComplete;
    return element;
}

function shadow(element: SteamCardCompact): ShadowRoot {
    const root = element.shadowRoot;
    if (!root) {
        throw new Error("the card rendered nothing");
    }
    return root;
}

function groupsOf(root: ShadowRoot): (string | undefined)[] {
    return [...root.querySelectorAll(".status-category")].map((node) => node.textContent?.trim());
}

function actionsOf(element: SteamCardCompact): Array<{ config: Record<string, unknown>; action: string }> {
    const fired: Array<{ config: Record<string, unknown>; action: string }> = [];
    element.addEventListener("hass-action", (event) => fired.push((event as CustomEvent).detail));
    return fired;
}

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("the list card", () => {
    it("lists the players it was given, those in a game first, then by what they are doing", async () => {
        const state = hass(
            player("sensor.steam_abc", { game: "Factorio" }),
            player("sensor.steam_ghi"),
            player("sensor.steam_def", { state: "offline", last_online: "2026-09-15T12:00:00Z" }),
        );
        const root = shadow(await card(state, { entity: ["sensor.steam_abc", "sensor.steam_def", "sensor.steam_ghi"] }));

        expect(groupsOf(root)).toEqual(["In game", "Online", "Offline"]);
        expect(root.querySelectorAll(".player")).toHaveLength(3);
        expect(root.textContent).toContain("Factorio");
    });

    it("has a title of its own in the viewer's language, or the one it was given", async () => {
        const plain = shadow(await card(hass(player("sensor.steam_abc")), { entity: ["sensor.steam_abc"] }));
        expect(plain.querySelector(".card-header")?.textContent).toContain("Steam friends");
        const given = shadow(await card(hass(player("sensor.steam_abc")), { entity: ["sensor.steam_abc"], title: "Steam buddies" }));
        expect(given.querySelector(".card-header")?.textContent).toContain("Steam buddies");
    });

    it("uses the names the configuration gives", async () => {
        const root = shadow(
            await card(hass(player("sensor.steam_abc")), {
                entity: ["sensor.steam_abc"],
                name_overrides: [{ entity: "sensor.steam_abc", name: "ABC-MAN" }],
            }),
        );
        expect(root.querySelector(".name")?.textContent).toContain("ABC-MAN");
    });

    it("finds every Steam player by itself when asked to", async () => {
        const state = hass(
            player("sensor.steam_abc"),
            player("sensor.steam_def"),
            // A player the integration named after them, and something else entirely.
            player("sensor.pok25", { options: ["offline", "online", "looking_to_trade"] }),
            player("sensor.other"),
        );
        const root = shadow(await card(state, { auto_populate: true }));
        expect(root.querySelectorAll(".player")).toHaveLength(3);
    });

    it("leaves out the game picture when it is turned off", async () => {
        const state = hass(player("sensor.steam_abc", { game: "Factorio", game_image_header: "/game.jpg" }));
        const root = shadow(await card(state, { entity: ["sensor.steam_abc"], game_background: false }));
        expect(root.querySelector("img.row-picture")).toBeNull();
        expect(root.textContent).toContain("Factorio");
    });
});

describe("the new entities of the integration", () => {
    it("tell the game, its icon and the level, and how long the game has been played", async () => {
        const since = new Date(Date.now() - 80 * 60_000 - 5_000).toISOString();
        const root = shadow(await card(device("abc", "Factorio", { since }), { entity: ["sensor.steam_abc"] }));
        expect(groupsOf(root)).toEqual(["In game"]);
        expect(root.querySelector(".game")?.textContent).toContain("Factorio");
        expect(root.querySelector("img.game-icon")?.getAttribute("src")).toBe("/icon.jpg");
        expect(root.querySelector(".play-time")?.textContent).toContain("1 h 20 min");
        expect(root.querySelector(".level")?.textContent?.trim()).toBe("42");
    });

    it("leave out zero minutes from a game played for whole hours", async () => {
        const since = new Date(Date.now() - 2 * 3600_000 - 5_000).toISOString();
        const root = shadow(await card(device("abc", "Factorio", { since }), { entity: ["sensor.steam_abc"] }));
        expect(root.querySelector(".play-time")?.textContent).toContain("· 2 h");
        expect(root.querySelector(".play-time")?.textContent).not.toContain("min");
    });

    it("are watched, so the card changes when a game starts", async () => {
        const state = device("abc");
        const element = await card(state, { entity: ["sensor.steam_abc"] });
        expect(groupsOf(shadow(element))).toEqual(["Online"]);

        const playing: HassEntity = { entity_id: "sensor.abc_now_playing", state: "Factorio", attributes: { app_id: "427520" } };
        element.hass = { ...state, states: { ...state.states, [playing.entity_id]: playing } };
        await element.updateComplete;
        expect(groupsOf(shadow(element))).toEqual(["In game"]);
    });
});

describe("the single player card", () => {
    it("is drawn for one named player", async () => {
        const state = hass(player("sensor.steam_abc", { state: "offline", level: 42, last_online: "2026-09-15T12:00:00Z" }));
        const root = shadow(await card(state, { entity: "sensor.steam_abc" }));

        expect(root.querySelector(".player.big")).not.toBeNull();
        expect(root.querySelector(".level")?.textContent).toContain("42");
        expect(root.querySelector(".seen")?.textContent).toContain("Last seen");
    });

    it("names the state of a player who is on, without a time Steam doesn't give", async () => {
        const state = hass(player("sensor.steam_abc", { state: "snooze", last_online: "2026-09-15T12:00:00Z" }));
        const root = shadow(await card(state, { entity: "sensor.steam_abc" }));
        expect(root.querySelector(".seen")?.textContent?.trim()).toBe("Snoozing");
    });

    it("says how long ago a player was seen, in a unit that has a translation", async () => {
        const seconds = new Date(Date.now() - 30_000).toISOString();
        const state = hass(player("sensor.steam_abc", { state: "offline", last_online: seconds }));
        const root = shadow(await card(state, { entity: "sensor.steam_abc" }));
        expect(root.querySelector(".seen")?.textContent?.trim()).toBe("Last seen 30\u00a0s ago");
    });

    it("says one day, not one days", async () => {
        const day = new Date(Date.now() - 30 * 3600_000).toISOString();
        const state = hass(player("sensor.steam_abc", { state: "offline", last_online: day }));
        const root = shadow(await card(state, { entity: "sensor.steam_abc" }));
        expect(root.querySelector(".seen")?.textContent?.trim()).toBe("Last seen 1\u00a0day ago");
    });

    it("calls a state Steam doesn't report unavailable, rather than showing a key", async () => {
        const root = shadow(await card(hass(player("sensor.steam_abc", { state: "unknown" })), { entity: "sensor.steam_abc" }));
        expect(root.querySelector(".seen")?.textContent?.trim()).toBe("Unavailable");
    });

    it("is drawn again in the viewer's new language when it changes", async () => {
        const state = hass(player("sensor.steam_abc", { state: "snooze" }));
        const element = await card(state, { entity: "sensor.steam_abc" });
        element.hass = { ...state, locale: { language: "fi" } };
        await element.updateComplete;
        expect(shadow(element).querySelector(".seen")?.textContent?.trim()).toBe("Toimeton");
    });
});

describe("when a player is missing", () => {
    it("names the entity instead of breaking the card", async () => {
        const root = shadow(await card(hass(), { entity: "sensor.steam_gone" }));
        expect(root.querySelector(".not-found")?.textContent).toContain("sensor.steam_gone");
    });

    it("still lists the players that are there", async () => {
        const root = shadow(await card(hass(player("sensor.steam_abc")), { entity: ["sensor.steam_abc", "sensor.steam_gone"] }));
        expect(root.querySelectorAll(".player")).toHaveLength(1);
        expect(root.querySelector(".not-found")?.textContent).toContain("sensor.steam_gone");
    });
});

describe("every state Steam reports", () => {
    it("has a group of its own", async () => {
        const state = hass(
            player("sensor.steam_a", { state: "busy" }),
            player("sensor.steam_b", { state: "looking_to_play" }),
            player("sensor.steam_c", { state: "looking_to_trade" }),
            player("sensor.steam_d", { state: "snooze" }),
        );
        const root = shadow(await card(state, { auto_populate: true }));
        expect(groupsOf(root)).toEqual(["Busy", "Looking to play", "Looking to trade", "Snoozing"]);
        expect(root.querySelectorAll(".player")).toHaveLength(4);
    });
});

describe("the game", () => {
    it("links to the store, and a click on it isn't a tap on the player", async () => {
        const state = hass(player("sensor.steam_abc", { game: "Factorio", game_id: "427520", game_icon: "/icon.jpg" }));
        const element = await card(state, { entity: ["sensor.steam_abc"] });
        const fired = actionsOf(element);
        const link = shadow(element).querySelector("a.game-name") as HTMLAnchorElement;

        expect(link.getAttribute("href")).toBe("https://store.steampowered.com/app/427520");
        expect(link.getAttribute("target")).toBe("_blank");
        link.addEventListener("click", (event) => event.preventDefault());
        link.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
        expect(fired).toHaveLength(0);
    });

    it("is plain text when the game has no id", async () => {
        const root = shadow(await card(hass(player("sensor.steam_abc", { game: "Factorio" })), { entity: ["sensor.steam_abc"] }));
        expect(root.querySelector("a.game-name")).toBeNull();
        expect(root.querySelector(".game-name")?.textContent).toBe("Factorio");
    });
});

describe("tapping a player", () => {
    it("hands Home Assistant that player as the entity, more-info by default", async () => {
        const state = hass(player("sensor.steam_abc"), player("sensor.steam_def"));
        const element = await card(state, { entity: ["sensor.steam_abc", "sensor.steam_def"] });
        const fired = actionsOf(element);
        const second = shadow(element).querySelectorAll<HTMLElement>(".player")[1];

        expect(second.getAttribute("role")).toBe("button");
        second.click();
        expect(fired).toEqual([
            {
                config: { entity: "sensor.steam_def", tap_action: undefined, hold_action: undefined, double_tap_action: undefined },
                action: "tap",
            },
        ]);
    });

    it("passes the configured actions along, and Enter taps too", async () => {
        const tap = { action: "navigate", navigation_path: "/steam" };
        const element = await card(hass(player("sensor.steam_abc")), { entity: "sensor.steam_abc", tap_action: tap });
        const fired = actionsOf(element);
        shadow(element)
            .querySelector(".player")
            ?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        expect(fired[0].config.tap_action).toEqual(tap);
    });

    it("doesn't take a right-click held down for a hold", async () => {
        vi.useFakeTimers();
        try {
            const element = await card(hass(player("sensor.steam_abc")), { entity: "sensor.steam_abc", hold_action: { action: "toggle" } });
            const fired = actionsOf(element);
            const box = shadow(element).querySelector(".player") as HTMLElement;
            box.dispatchEvent(new PointerEvent("pointerdown", { button: 2, bubbles: true }));
            vi.advanceTimersByTime(600);
            expect(fired).toHaveLength(0);
            box.dispatchEvent(new PointerEvent("pointerdown", { button: 0, bubbles: true }));
            vi.advanceTimersByTime(600);
            expect(fired.map((item) => item.action)).toEqual(["hold"]);
        } finally {
            vi.useRealTimers();
        }
    });

    it("isn't offered when a tap does nothing", async () => {
        const root = shadow(await card(hass(player("sensor.steam_abc")), { entity: "sensor.steam_abc", tap_action: { action: "none" } }));
        expect(root.querySelector(".player")?.hasAttribute("role")).toBe(false);
    });
});

describe("the layout", () => {
    it("draws the big card for one named player, as it always did", async () => {
        const root = shadow(await card(hass(player("sensor.steam_abc")), { entity: "sensor.steam_abc" }));
        expect(root.querySelector(".player.big")).not.toBeNull();
    });

    it("lists a single player when the list is asked for", async () => {
        const root = shadow(await card(hass(player("sensor.steam_abc")), { entity: "sensor.steam_abc", layout: "list" }));
        expect(root.querySelector(".player.big")).toBeNull();
        expect(root.querySelectorAll(".player")).toHaveLength(1);
    });

    it("draws the big card of the first player when one player is asked for", async () => {
        const state = hass(player("sensor.steam_abc"), player("sensor.steam_def"));
        const root = shadow(await card(state, { entity: ["sensor.steam_abc", "sensor.steam_def"], layout: "player" }));
        expect(root.querySelector(".player.big .name")?.textContent).toBe("abc");
        expect(root.querySelectorAll(".player")).toHaveLength(1);
    });

    it.each([
        ["its content", undefined, {}, ""],
        ["a fixed height", undefined, { height_mode: "fixed" as const, height: 240, max_height: 400 }, "height: 240px"],
        ["a maximum height", undefined, { max_height: 400 }, "max-height: 400px"],
        ["grid rows in a sections view", "grid", { height: 240, grid_options: { rows: 6 } }, "height: 100%"],
        ["the mode when the grid rows are automatic", "grid", { height: 240, grid_options: { rows: "auto" } }, "height: 240px"],
    ])("sizes itself by %s", async (_name, layout, extra, style) => {
        const state = hass(player("sensor.steam_abc"), player("sensor.steam_def"));
        const root = shadow(await card(state, { entity: ["sensor.steam_abc", "sensor.steam_def"], ...extra }, layout));
        expect(root.querySelector("ha-card")?.getAttribute("style") ?? "").toBe(style);
    });

    const TWO = { entity: ["sensor.steam_abc", "sensor.steam_def"] };

    /** The card's list, taller than the room it has, as happy-dom lays nothing out. */
    async function overflowing(element: SteamCardCompact): Promise<HTMLElement> {
        const list = shadow(element).querySelector(".list") as HTMLElement;
        Object.defineProperty(list, "scrollHeight", { value: 600, configurable: true });
        Object.defineProperty(list, "clientHeight", { value: 200, configurable: true });
        element.requestUpdate();
        await element.updateComplete;
        return list;
    }

    it.each([
        ["held to a height", undefined, { height: 300 }, ["fade-bottom"]],
        ["held up to a limit", undefined, { max_height: 300 }, ["fade-bottom"]],
        ["held by rows in a sections view", "grid", { grid_options: { rows: 4 } }, ["fade-bottom"]],
        [
            "held to a height with automatic rows in a sections view",
            "grid",
            { height: 300, grid_options: { rows: "auto" } },
            ["fade-bottom"],
        ],
        ["held by the older layout options' rows in a sections view", "grid", { layout_options: { grid_rows: 4 } }, ["fade-bottom"]],
        ["never in auto", undefined, {}, []],
        ["never in auto with automatic rows in a sections view", "grid", { grid_options: { rows: "auto" } }, []],
        ["never by grid rows outside a sections view", undefined, { grid_options: { rows: 4 } }, []],
    ])("fades the bottom edge of the list that runs past it when %s", async (_name, layout, extra, expected) => {
        const state = hass(player("sensor.steam_abc"), player("sensor.steam_def"));
        const list = await overflowing(await card(state, { ...TWO, ...extra }, layout));
        expect(["fade-top", "fade-bottom"].filter((name) => list.classList.contains(name))).toEqual(expected);
    });

    it("lets go of the list's fade when the card goes from held to auto, and fades it again when held again", async () => {
        const element = await card(hass(player("sensor.steam_abc"), player("sensor.steam_def")), { ...TWO, height: 300 });
        const list = await overflowing(element);
        expect([...list.classList].filter((name) => name.startsWith("fade"))).toEqual(["fades", "fade-bottom"]);
        element.setConfig({ type: "custom:steam-card-compact", ...TWO } as never);
        await element.updateComplete;
        expect([...list.classList].filter((name) => name.startsWith("fade"))).toEqual([]);
        element.setConfig({ type: "custom:steam-card-compact", ...TWO, height: 300 } as never);
        await element.updateComplete;
        expect([...list.classList].filter((name) => name.startsWith("fade"))).toEqual(["fades", "fade-bottom"]);
    });

    it.each([
        ["the list, never lower than its title and one row of players", { entity: ["sensor.steam_abc", "sensor.steam_def"] }, 3, 156],
        ["the big card, never lower than its player", { entity: "sensor.steam_abc" }, 2, 88],
    ])("holds %s", async (_name, config, rows, minimum) => {
        const state = hass(player("sensor.steam_abc"), player("sensor.steam_def"));
        const element = await card(state, { ...config, height_mode: "fixed", height: 50 });
        expect(element.getGridOptions().min_rows).toBe(rows);
        expect(shadow(element).querySelector("ha-card")?.getAttribute("style")).toBe(`height: ${minimum}px`);
    });

    it("puts the title before the list, which holds the status headings and the rows of players", async () => {
        const state = hass(player("sensor.steam_abc"), player("sensor.steam_def"));
        const root = shadow(await card(state, { entity: ["sensor.steam_abc", "sensor.steam_def"], height_mode: "fixed", height: 200 }));
        const haCard = root.querySelector("ha-card")!;
        expect([...haCard.children].map((child) => child.classList[0])).toEqual(["card-header", "list"]);
        expect([...haCard.querySelector(".list")!.children].map((child) => child.className)).toEqual(["status-category", "user-row"]);
    });
});

describe("the game behind the big card", () => {
    it("is its hero picture with its logo, when the integration has them", async () => {
        const root = shadow(await card(device("abc", "Factorio", { hero: "/hero", logo: "/logo" }), { entity: "sensor.steam_abc" }));
        expect(root.querySelector("img.hero")?.getAttribute("src")).toBe("/hero");
        expect(root.querySelector(".shade")).not.toBeNull();
        expect(root.querySelector("img.logo")?.getAttribute("src")).toBe("/logo");
        expect(root.querySelector("img.big-picture")).toBeNull();
    });

    it("is the game's own picture, dimmed, when it has no hero picture", async () => {
        const state = hass(player("sensor.steam_abc", { game: "Factorio", game_image_main: "/main.jpg", game_image_header: "/h.jpg" }));
        const root = shadow(await card(state, { entity: "sensor.steam_abc" }));
        // The sharper of the two pictures the integration gives.
        expect(root.querySelector("img.big-picture")?.getAttribute("src")).toBe("/main.jpg");
        expect(root.querySelector("img.hero")).toBeNull();
    });

    it("falls back to the game's own picture when the hero picture doesn't load", async () => {
        const element = await card(device("abc", "Factorio", { hero: "/hero", logo: "/logo" }), { entity: "sensor.steam_abc" });
        shadow(element).querySelector("img.hero")?.dispatchEvent(new Event("error"));
        await element.updateComplete;
        const root = shadow(element);
        expect(root.querySelector("img.hero")).toBeNull();
        expect(root.querySelector("img.logo")).toBeNull();
        expect(root.querySelector("img.big-picture")?.getAttribute("src")).toBe("/header");
    });

    it("is the Steam logo when a player is in no game", async () => {
        const root = shadow(await card(hass(player("sensor.steam_abc")), { entity: "sensor.steam_abc" }));
        expect(root.querySelector("img.big-picture")).toBeNull();
        const logo = root.querySelector(".steam-game-default-bg svg.steam-logo");
        expect(logo).not.toBeNull();
        // Kept whole inside its box, so the word is never cut off at the card's edge.
        expect(logo?.getAttribute("preserveAspectRatio")).toBe("xMidYMid meet");
    });

    it("is left out when it is turned off", async () => {
        const root = shadow(
            await card(device("abc", "Factorio", { hero: "/hero" }), { entity: "sensor.steam_abc", game_background: false }),
        );
        expect(root.querySelector("img.hero")).toBeNull();
        expect(root.querySelector("img.big-picture")).toBeNull();
        expect(root.querySelector(".steam-game-default-bg")).toBeNull();
    });
});

describe("the level", () => {
    it("shows three digits", async () => {
        const root = shadow(await card(hass(player("sensor.steam_abc", { level: 123 })), { entity: "sensor.steam_abc" }));
        expect(root.querySelector(".level")?.textContent?.trim()).toBe("123");
    });

    it("is left out for a player who has none", async () => {
        const root = shadow(await card(hass(player("sensor.steam_abc")), { entity: "sensor.steam_abc" }));
        expect(root.querySelector(".level")).toBeNull();
    });
});

describe("the configuration", () => {
    it("needs either players or auto_populate", () => {
        const element = document.createElement("steam-card-compact") as SteamCardCompact;
        expect(() => element.setConfig({ type: "custom:steam-card-compact" } as never)).toThrow();
    });

    it("is happy with auto_populate alone", () => {
        const element = document.createElement("steam-card-compact") as SteamCardCompact;
        expect(() => element.setConfig({ type: "custom:steam-card-compact", auto_populate: true } as never)).not.toThrow();
    });

    it("refuses a height that isn't a positive number of pixels, and an unknown height mode, with an error about the height", () => {
        const element = document.createElement("steam-card-compact") as SteamCardCompact;
        const config = (extra: Record<string, unknown>) => ({ type: "custom:steam-card-compact", auto_populate: true, ...extra }) as never;
        const error = translate(browserLanguage(), "common.invalid_height");
        expect(error).toMatch(/^Invalid height\./);
        for (const value of ["300px", 0, -10]) {
            expect(() => element.setConfig(config({ max_height: value }))).toThrow(error);
            expect(() => element.setConfig(config({ height: value }))).toThrow(error);
        }
        expect(() => element.setConfig(config({ height_mode: "tall" }))).toThrow(error);
        // Left empty in YAML, each is unset.
        expect(() => element.setConfig(config({ height_mode: null, height: null, max_height: null }))).not.toThrow();
    });

    it("offers the players of the picker's Home Assistant, by the registry", () => {
        // A player whose sensor isn't called steam_ anything, which only the registry tells apart.
        const state = merge(device("abc"), device("def"));
        const renamed = { ...state.states["sensor.steam_def"], entity_id: "sensor.def" } as HassEntity;
        state.states = { ...state.states, "sensor.def": renamed };
        delete state.states["sensor.steam_def"];
        state.entities = { ...state.entities, "sensor.def": { ...state.entities!["sensor.steam_def"]!, entity_id: "sensor.def" } };
        delete state.entities["sensor.steam_def"];
        const stub = (customElements.get("steam-card-compact") as unknown as typeof SteamCardCompact).getStubConfig(state);
        expect(stub).toEqual({ entity: ["sensor.def", "sensor.steam_abc"] });
    });
});

describe("filling the rows of a sections view", () => {
    type Layout = { end?: number; spare?: number; empty?: boolean; details?: number; padding?: number };

    /**
     * Lays the card out as a browser would, as happy-dom lays nothing out: 500 px wide with its top at 0, `padding` under
     * its content and a 1 px border. The list's last row ends at `end`, or an empty list starts there, with `spare` drawn
     * under the title. The big card's player has 10 and 12 px of padding around its 64 px avatar and its texts,
     * `details` tall.
     */
    function laidOut(element: SteamCardCompact, { end = 0, spare = 0, empty = false, details = 50, padding = 16 }: Layout): void {
        const root = shadow(element);
        const haCard = root.querySelector<HTMLElement>("ha-card")!;
        Object.defineProperty(haCard, "clientWidth", { value: 500, configurable: true });
        haCard.getBoundingClientRect = () => ({ top: 0 }) as DOMRect;
        const list = root.querySelector<HTMLElement>(".list");
        if (list && empty) {
            list.getBoundingClientRect = () => ({ top: end, bottom: 900 }) as DOMRect;
        } else if (list) {
            list.lastElementChild!.getBoundingClientRect = () => ({ bottom: end }) as DOMRect;
        } else if (!root.querySelector(".player.big")) {
            haCard.lastElementChild!.getBoundingClientRect = () => ({ bottom: end }) as DOMRect;
        }
        const avatar = root.querySelector<HTMLElement>(".big > .avatar-wrap");
        if (avatar) avatar.getBoundingClientRect = () => ({ height: 64 }) as DOMRect;
        const texts = root.querySelector<HTMLElement>(".big > .details");
        if (texts) texts.getBoundingClientRect = () => ({ height: details }) as DOMRect;
        const styles = new Map<Element | null, Record<string, string>>([
            [haCard, { paddingBottom: `${padding}px`, borderTopWidth: "1px", borderBottomWidth: "1px" }],
            [root.querySelector(".card-header"), { paddingBottom: `${8 + spare}px` }],
            [root.querySelector(".player.big"), { paddingTop: "10px", paddingBottom: "12px" }],
        ]);
        vi.spyOn(window, "getComputedStyle").mockImplementation((target) => (styles.get(target) ?? {}) as unknown as CSSStyleDeclaration);
    }

    const filled = (height: number, spare: number) => `min-height: ${height}px; --steam-spare: ${spare}px`;
    const two = hass(player("sensor.steam_abc"), player("sensor.steam_def"));
    const list = { entity: ["sensor.steam_abc", "sensor.steam_def"] };
    const one = { entity: "sensor.steam_abc" };

    // The list's content is its last row's end, the padding and border under it, less the room drawn under the title. The
    // big card's is its border, its player's padding and the taller of the avatar and the texts. Either ends on the next
    // whole row (64k − 8 px), or half row with `row_step: half`. What that leaves goes under the list's title, and in the
    // big card to its player, which grows to take it.
    it.each<[string, Partial<SteamCardCompactConfig>, string | undefined, Layout, string]>([
        ["a list already on a whole row", list, "grid", { end: 103 }, filled(120, 0)],
        ["a list over a whole row", list, "grid", { end: 107 }, filled(184, 60)],
        ["a list over a whole row, on half rows", { ...list, row_step: "half" }, "grid", { end: 107 }, filled(152, 28)],
        ["a list with the room under its title already drawn", list, "grid", { end: 167, spare: 60 }, filled(184, 60)],
        ["an empty list, measured to its top", { entity: [] }, "grid", { end: 50, empty: true }, filled(120, 53)],
        ["the big card", one, "grid", {}, filled(120, 0)],
        ["the big card on half rows, one and a half rows", { ...one, row_step: "half" }, "grid", {}, filled(88, 0)],
        ["the big card with taller texts, on half rows", { ...one, row_step: "half" }, "grid", { details: 70 }, filled(120, 0)],
        ["the big card whose border puts it over a half row", { ...one, row_step: "half" }, "grid", { details: 66 }, filled(120, 0)],
        ["a missing player's big card", { entity: "sensor.steam_gone" }, "grid", { end: 40, padding: 0 }, filled(56, 0)],
        ["a list held to a height", { ...list, height_mode: "fixed", height: 300 }, "grid", { end: 107 }, "height: 300px"],
        ["a list up to a limit, under it", { ...list, max_height: 400 }, "grid", { end: 107 }, `max-height: 376px; ${filled(184, 60)}`],
        ["a list up to a limit, over it", { ...list, max_height: 400 }, "grid", { end: 500 }, `max-height: 376px; ${filled(376, 0)}`],
        ["a list up to a limit outside a sections view", { ...list, max_height: 400 }, undefined, { end: 107 }, "max-height: 400px"],
        ["a list outside a sections view", list, undefined, { end: 107 }, ""],
    ])("%s", async (_name, config, layout, laid, style) => {
        const element = await card(two, config, layout);
        laidOut(element, laid);
        (element as unknown as { fillRows(): void }).fillRows();
        await element.updateComplete;
        expect(shadow(element).querySelector("ha-card")?.getAttribute("style") ?? "").toBe(style);
        vi.restoreAllMocks();
    });

    it("lets go of the filled rows while held, so none are left over when it is let go", async () => {
        const element = await card(two, list, "grid");
        const fill = async () => {
            (element as unknown as { fillRows(): void }).fillRows();
            await element.updateComplete;
        };
        const style = () => shadow(element).querySelector("ha-card")?.getAttribute("style") ?? "";
        laidOut(element, { end: 107 });
        await fill();
        expect(style()).toBe(filled(184, 60));
        element.setConfig({ type: "custom:steam-card-compact", ...list, height_mode: "fixed", height: 300 } as never);
        await element.updateComplete;
        await fill();
        expect(style()).toBe("height: 300px");
        element.setConfig({ type: "custom:steam-card-compact", ...list } as never);
        await element.updateComplete;
        expect(style()).toBe("");
        vi.restoreAllMocks();
    });
});

describe("held to a height", () => {
    const game = "Warhammer 40,000: Space Marine 2 – Ultra Edition";

    it.each<[string, Partial<SteamCardCompactConfig>]>([
        ["the big card", { entity: "sensor.steam_abc" }],
        ["the list", { entity: ["sensor.steam_abc"], layout: "list" }],
    ])("marks %s as held only while it is held", async (_name, config) => {
        const state = device("abc", game, { since: "2026-09-16T10:00:00Z" });
        const root = shadow(await card(state, { ...config, height_mode: "fixed", height: 200 }));
        expect(root.querySelector("ha-card")?.classList.contains("held")).toBe(true);
        const auto = shadow(await card(state, config));
        expect(auto.querySelector("ha-card")?.classList.contains("held")).toBe(false);
    });

    // Every text that a held card cuts short carries its whole as a tooltip, held or not
    const offline = () =>
        hass(player("sensor.steam_abc", { state: "offline", last_online: new Date(Date.now() - 5 * 60_000).toISOString() }));
    const title = "Steam friends playing tonight, all of them";
    const renamed = [{ entity: "sensor.steam_abc", name: "Matti Meikäläinen" }];
    // The whole line, as the ellipsis takes the play time first; nothing when the card shows no play time
    const withTime = (root: ShadowRoot) => {
        const time = root.querySelector(".play-time")?.textContent?.trim() ?? "";
        return /^· \d/.test(time) ? `${game} ${time}` : "";
    };
    const cases: [string, () => HomeAssistant, Partial<SteamCardCompactConfig>, string, (root: ShadowRoot) => string][] = [
        ["the list's title", () => hass(player("sensor.steam_abc")), { entity: ["sensor.steam_abc"], title }, ".card-header", () => title],
        [
            "the list's own title, translated",
            () => hass(player("sensor.steam_abc")),
            { entity: ["sensor.steam_abc"] },
            ".card-header",
            () => translate("en", "common.title"),
        ],
        [
            "a name given in its place, on the big card",
            () => hass(player("sensor.steam_abc")),
            { entity: "sensor.steam_abc", name_overrides: renamed },
            ".name",
            () => "Matti Meikäläinen",
        ],
        [
            "a name given in its place, in the list",
            () => hass(player("sensor.steam_abc")),
            { entity: ["sensor.steam_abc"], name_overrides: renamed },
            ".name",
            () => "Matti Meikäläinen",
        ],
        [
            "the player's own name, on the big card",
            () => hass(player("sensor.steam_abc")),
            { entity: "sensor.steam_abc" },
            ".name",
            () => "abc",
        ],
        [
            "the player's own name, in the list",
            () => hass(player("sensor.steam_abc")),
            { entity: ["sensor.steam_abc"] },
            ".name",
            () => "abc",
        ],
        [
            "a game with its play time, on the big card",
            () => device("abc", game, { since: "2026-09-16T10:00:00Z" }),
            { entity: "sensor.steam_abc" },
            ".game",
            (root) => withTime(root),
        ],
        [
            "a game with its play time, in the list",
            () => device("abc", game, { since: "2026-09-16T10:00:00Z" }),
            { entity: ["sensor.steam_abc"] },
            ".game",
            (root) => withTime(root),
        ],
        ["a game with no play time, on the big card", () => device("abc", game), { entity: "sensor.steam_abc" }, ".game", () => game],
        ["a game with no play time, in the list", () => device("abc", game), { entity: ["sensor.steam_abc"] }, ".game", () => game],
        [
            "the time the big card's player was last seen",
            offline,
            { entity: "sensor.steam_abc" },
            ".seen",
            (root) => root.querySelector(".seen")!.textContent!.trim(),
        ],
        [
            "the time a listed player was last seen",
            offline,
            { entity: ["sensor.steam_abc"] },
            ".seen",
            (root) => root.querySelector(".seen")!.textContent!.trim(),
        ],
    ];
    describe.each<[string, Partial<SteamCardCompactConfig>]>([
        ["held", { height_mode: "fixed", height: 200 }],
        ["not held", {}],
    ])("%s", (_held, height) => {
        it.each(cases)("gives %s its whole text as a tooltip", async (_name, state, config, selector, expected) => {
            const root = shadow(await card(state(), { ...config, ...height }));
            const text = expected(root);
            expect(text).not.toBe("");
            expect(root.querySelector(selector)?.getAttribute("title")).toBe(text);
        });
    });

    // happy-dom lays nothing out, so the rule itself is read from the card's styles: each text on one line, cut short
    it.each([".card-header", ".name", ".seen", ".game"])("keeps %s to one line with an ellipsis when held", (part) => {
        const styles = [(customElements.get("steam-card-compact") as unknown as { styles: unknown }).styles].flat(Infinity);
        const css = styles
            .map((style) => (style as { cssText: string }).cssText)
            .join("\n")
            .replace(/\/\*[\s\S]*?\*\//g, "");
        const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selectors, body]) => ({
            selectors: selectors.split(",").map((selector) => selector.trim()),
            body,
        }));
        const held = rules.filter((rule) => rule.selectors.includes(`ha-card.held ${part}`));
        // Without hidden overflow the ellipsis never shows, and a long text runs over whatever is beside it
        const oneLine = (body: string) =>
            /white-space:\s*nowrap/.test(body) && /overflow:\s*hidden/.test(body) && /text-overflow:\s*ellipsis/.test(body);
        expect(held.some((rule) => oneLine(rule.body))).toBe(true);
    });
});

describe("the rounding", () => {
    it("refuses a step that is neither whole nor half rows", () => {
        const element = document.createElement("steam-card-compact") as SteamCardCompact;
        expect(() =>
            element.setConfig({ type: "custom:steam-card-compact", entity: "sensor.steam_abc", row_step: "quarter" } as never),
        ).toThrow(translate(browserLanguage(), "common.invalid_row_step"));
        expect(() => element.setConfig({ type: "custom:steam-card-compact", entity: "sensor.steam_abc", row_step: "half" })).not.toThrow();
    });
});
