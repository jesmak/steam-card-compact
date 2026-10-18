/**
 * The card's visual editor: the players, the layout, the title, the game picture, the names to show instead of
 * the players' own, and what a tap, a hold and a double tap do. Home Assistant provides ha-form and the selectors.
 */
import { LitElement, html, nothing } from "lit";
import type { TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HomeAssistant } from "./hass";
import { steamPlayers } from "./friends";
import { languageOf, translate } from "./localize/localize";
import type { SteamCardCompactConfig } from "./types";

interface SchemaEntry {
    name: string;
}

const DEFAULTS: Record<string, unknown> = { layout: "auto", game_background: true, auto_populate: false };

function schema(hass: HomeAssistant, text: (key: string) => string, autoPopulate: boolean) {
    // The Steam players there are, so the pickers offer them and nothing else
    const players = steamPlayers(hass);
    return [
        ...(autoPopulate
            ? []
            : [
                  {
                      name: "entity",
                      required: true,
                      selector: {
                          entity: { multiple: true, domain: "sensor", include_entities: players },
                      },
                  },
              ]),
        { name: "auto_populate", selector: { boolean: {} } },
        {
            name: "layout",
            selector: {
                select: {
                    mode: "dropdown",
                    options: [
                        { value: "auto", label: text("editor.layout_auto") },
                        { value: "list", label: text("editor.layout_list") },
                        { value: "player", label: text("editor.layout_player") },
                    ],
                },
            },
        },
        { name: "title", selector: { text: {} } },
        { name: "game_background", selector: { boolean: {} } },
        {
            name: "name_overrides",
            selector: {
                object: {
                    multiple: true,
                    label_field: "name",
                    description_field: "entity",
                    fields: {
                        entity: {
                            label: text("editor.override_entity"),
                            required: true,
                            selector: { entity: { domain: "sensor", include_entities: players } },
                        },
                        name: { label: text("editor.override_name"), required: true, selector: { text: {} } },
                    },
                },
            },
        },
        {
            type: "expandable",
            name: "interactions",
            flatten: true,
            schema: [
                { name: "tap_action", selector: { ui_action: { default_action: "more-info" } } },
                { name: "hold_action", selector: { ui_action: { default_action: "none" } } },
                { name: "double_tap_action", selector: { ui_action: { default_action: "none" } } },
            ],
        },
    ];
}

@customElement("steam-card-compact-editor")
export class SteamCardCompactEditor extends LitElement {
    @property({ attribute: false }) public hass?: HomeAssistant;
    @state() private config: SteamCardCompactConfig = { type: "custom:steam-card-compact" };

    public setConfig(config: SteamCardCompactConfig): void {
        this.config = { ...config };
    }

    protected render(): TemplateResult | typeof nothing {
        if (!this.hass) {
            return nothing;
        }
        // One player named in YAML is a string; the picker works with a list.
        const entity = typeof this.config.entity === "string" ? [this.config.entity] : this.config.entity;
        return html`
            <ha-form
                .hass=${this.hass}
                .data=${{ ...DEFAULTS, ...this.config, entity }}
                .schema=${schema(this.hass, (key) => this.text(key), this.config.auto_populate === true)}
                .computeLabel=${(entry: SchemaEntry) => this.text(`editor.${entry.name}`)}
                .computeHelper=${(entry: SchemaEntry) => this.helper(entry.name)}
                @value-changed=${this.valueChanged}
            ></ha-form>
        `;
    }

    private valueChanged(event: CustomEvent<{ value: SteamCardCompactConfig }>): void {
        const config: SteamCardCompactConfig = { ...event.detail.value };

        // One player is kept as a string, as it always was, for the big card. A configuration that was a list stays
        // one, so a list of one player isn't turned into the big card by an edit of something else.
        if (Array.isArray(config.entity)) {
            if (config.entity.length === 0) {
                delete config.entity;
            } else if (config.entity.length === 1 && !Array.isArray(this.config.entity) && (config.layout ?? "auto") !== "list") {
                config.entity = config.entity[0];
            }
        }
        if (config.auto_populate) {
            delete config.entity;
        }
        if (!config.title) {
            delete config.title;
        }
        if (Array.isArray(config.name_overrides) && config.name_overrides.length === 0) {
            delete config.name_overrides;
        }
        // The defaults are shown in the form but left out of the configuration, so it stays short.
        for (const [key, value] of Object.entries(DEFAULTS)) {
            if (config[key] === value) {
                delete config[key];
            }
        }

        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
    }

    private text(key: string): string {
        return translate(this.language(), key);
    }

    private helper(name: string): string | undefined {
        const key = `editor.${name}_helper`;
        const helper = translate(this.language(), key);
        return helper === key ? undefined : helper;
    }

    private language(): string {
        return languageOf(this.hass);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "steam-card-compact-editor": SteamCardCompactEditor;
    }
}
