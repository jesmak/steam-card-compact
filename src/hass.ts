/** The little of Home Assistant a card needs, so custom-card-helpers isn't a dependency. */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, string | number | boolean | undefined>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  language?: string;
  locale?: { language?: string };
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}
