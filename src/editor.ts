/**
 * The card's visual editor: the players, the layout, the title and the game
 * picture. Home Assistant provides ha-form and the selectors.
 *
 * `name_overrides` is left to YAML; the form would be a poor place for a list of pairs.
 */
import { LitElement, html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { HomeAssistant } from './hass';
import { steamPlayers } from './friends';
import { browserLanguage, translate } from './localize';
import type { SteamCardCompactConfig } from './types';

interface SchemaEntry {
  name: string;
}

const DEFAULTS: Record<string, unknown> = { layout: 'auto', game_background: true, auto_populate: false };

/** The Steam players there are, so the picker offers them and nothing else. */
export function steamEntities(hass: HomeAssistant): string[] {
  return steamPlayers(hass.states);
}

function schema(hass: HomeAssistant, text: (key: string) => string, autoPopulate: boolean) {
  return [
    ...(autoPopulate
      ? []
      : [
          {
            name: 'entity',
            required: true,
            selector: {
              entity: { multiple: true, domain: 'sensor', include_entities: steamEntities(hass) },
            },
          },
        ]),
    { name: 'auto_populate', selector: { boolean: {} } },
    {
      name: 'layout',
      selector: {
        select: {
          mode: 'dropdown',
          options: [
            { value: 'auto', label: text('editor.layout_auto') },
            { value: 'list', label: text('editor.layout_list') },
            { value: 'player', label: text('editor.layout_player') },
          ],
        },
      },
    },
    { name: 'title', selector: { text: {} } },
    { name: 'game_background', selector: { boolean: {} } },
  ];
}

@customElement('steam-card-compact-editor')
export class SteamCardCompactEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: SteamCardCompactConfig = { type: 'custom:steam-card-compact' };

  public setConfig(config: SteamCardCompactConfig): void {
    this.config = { ...config };
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass) {
      return nothing;
    }
    // One player named in YAML is a string; the picker works with a list.
    const entity = typeof this.config.entity === 'string' ? [this.config.entity] : this.config.entity;
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

    // One player is kept as a string, as it always was, and the list card keeps a list.
    if (Array.isArray(config.entity)) {
      if (config.entity.length === 0) {
        delete config.entity;
      } else if (config.entity.length === 1 && (config.layout ?? 'auto') !== 'list') {
        config.entity = config.entity[0];
      }
    }
    if (config.auto_populate) {
      delete config.entity;
    }
    if (!config.title) {
      delete config.title;
    }
    // The defaults are shown in the form but left out of the configuration, so it stays short.
    for (const [key, value] of Object.entries(DEFAULTS)) {
      if (config[key] === value) {
        delete config[key];
      }
    }

    this.dispatchEvent(
      new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }),
    );
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
    return this.hass?.locale?.language ?? this.hass?.language ?? browserLanguage();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'steam-card-compact-editor': SteamCardCompactEditor;
  }
}
