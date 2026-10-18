/** The little of Home Assistant a card needs, so custom-card-helpers isn't a dependency. */

export interface HassEntity {
    entity_id: string;
    state: string;
    attributes: Record<string, unknown>;
    last_changed?: string;
}

/** What the frontend knows of an entity's registry entry: enough to find the entities of the same device. */
export interface EntityRegistryEntry {
    entity_id: string;
    device_id?: string | null;
    platform?: string;
    translation_key?: string | null;
}

export interface HomeAssistant {
    states: Record<string, HassEntity | undefined>;
    entities?: Record<string, EntityRegistryEntry | undefined>;
    language?: string;
    locale?: { language?: string };
}

export interface LovelaceCardConfig {
    type: string;
    [key: string]: unknown;
}

export interface ActionConfig {
    action: string;
    [key: string]: unknown;
}
