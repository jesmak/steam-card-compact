import type { LovelaceCardConfig } from './hass';

/** `player` is the big card of one player, `list` the list, `auto` the list unless one player is named. */
export type Layout = 'auto' | 'list' | 'player';

export interface SteamCardCompactConfig extends LovelaceCardConfig {
  /** One player for the big card, or several for the list. Left out when auto_populate is on. */
  entity?: string | string[];
  layout?: Layout;
  title?: string;
  /** Draws the header picture of the game behind the player. */
  game_background?: boolean;
  /** Lists every sensor.steam_* entity there is. */
  auto_populate?: boolean;
  name_overrides?: NameOverride[];
}

export interface NameOverride {
  entity: string;
  name: string;
}
