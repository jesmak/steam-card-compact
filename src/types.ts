import { LovelaceCardConfig } from 'custom-card-helpers';

export interface SteamCardCompactConfig extends LovelaceCardConfig {
  type: string;
  entity?: string | string[];
  title?: string;
  game_background?: boolean;
  auto_populate?: boolean;
  name_overrides?: NameOverrideConfig[];
}

export interface NameOverrideConfig extends LovelaceCardConfig {
  entity: string;
  name: string;
}
