import type { ActionConfig, LovelaceCardConfig } from "./hass";
import type { HeightConfig } from "./height";

/** `player` is the big card of one player, `list` the list, `auto` the list unless one player is named. */
export type Layout = "auto" | "list" | "player";

export interface SteamCardCompactConfig extends LovelaceCardConfig, HeightConfig {
    /** One player for the big card, or several for the list. Left out when auto_populate is on. */
    entity?: string | string[];
    layout?: Layout;
    title?: string;
    /** Draws the game's picture behind the player. */
    game_background?: boolean;
    /** Lists every Steam player there is. */
    auto_populate?: boolean;
    name_overrides?: NameOverride[];
    tap_action?: ActionConfig;
    hold_action?: ActionConfig;
    double_tap_action?: ActionConfig;
}

export interface NameOverride {
    entity: string;
    name: string;
}
