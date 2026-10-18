import { beforeEach, describe, expect, it, vi } from "vitest";

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

async function card(state: HomeAssistant, config: Partial<SteamCardCompactConfig>): Promise<SteamCardCompact> {
    const element = document.createElement("steam-card-compact") as SteamCardCompact;
    element.setConfig({ type: "custom:steam-card-compact", ...config } as never);
    element.hass = state;
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
        expect(root.querySelector(".seen")?.textContent?.trim()).toBe("Last seen 30 s ago");
    });

    it("says one day, not one days", async () => {
        const day = new Date(Date.now() - 30 * 3600_000).toISOString();
        const state = hass(player("sensor.steam_abc", { state: "offline", last_online: day }));
        const root = shadow(await card(state, { entity: "sensor.steam_abc" }));
        expect(root.querySelector(".seen")?.textContent?.trim()).toBe("Last seen 1 day ago");
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
