/**
 * A dashboard card for Home Assistant's Steam integration: who is online, what
 * they are playing, and how long ago the rest were last seen. Several players
 * are listed two to a row; a single player gets a bigger card of their own.
 */
import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { CARD_VERSION, STATUSES, STEAM_PREFIX } from './const';
import { avatarUrl, displayName, elapsed, groupByStatus, pairs, sortByName } from './friends';
import type { HassEntity, HomeAssistant } from './hass';
import { browserLanguage, translate } from './localize';
import { STEAM_LOGO } from './logo';
import type { SteamCardCompactConfig } from './types';

console.info(
  `%c  STEAM-CARD-COMPACT \n%c  ${CARD_VERSION}   `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

interface CardRegistration {
  type: string;
  name: string;
  description: string;
  documentationURL?: string;
  preview?: boolean;
}

const registry = window as unknown as { customCards?: CardRegistration[] };
registry.customCards = registry.customCards ?? [];
registry.customCards.push({
  type: 'steam-card-compact',
  name: translate(browserLanguage(), 'common.name'),
  description: translate(browserLanguage(), 'common.description'),
  documentationURL: 'https://github.com/jesmak/steam-card-compact',
  preview: true,
});

@customElement('steam-card-compact')
export class SteamCardCompact extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: SteamCardCompactConfig;

  /** Offers every Steam player there is when the card is added from the picker. */
  public static getStubConfig(hass?: HomeAssistant): Record<string, unknown> {
    const players = Object.keys(hass?.states ?? {}).filter((id) => id.startsWith(STEAM_PREFIX));
    return players.length > 0 ? { entity: players } : { auto_populate: true };
  }

  public setConfig(config: SteamCardCompactConfig): void {
    if (!config || (config.auto_populate === undefined && config.entity === undefined)) {
      throw new Error(translate(browserLanguage(), 'common.invalid_configuration'));
    }
    this.config = { ...config };
  }

  public getCardSize(): number {
    const shown = this.wanted().length;
    return this.single() ? 2 : 1 + Math.ceil(shown / 2);
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.has('config') || !this.config) {
      return true;
    }
    const previous = changed.get('hass') as HomeAssistant | undefined;
    if (!previous || this.config.auto_populate) {
      return true;
    }
    return this.wanted().some((id) => previous.states[id] !== this.hass?.states[id]);
  }

  /** The entity ids the card is meant to show. */
  private wanted(): string[] {
    if (!this.hass || !this.config) {
      return [];
    }
    if (this.config.auto_populate) {
      return Object.keys(this.hass.states).filter((id) => id.startsWith(STEAM_PREFIX));
    }
    const { entity } = this.config;
    return entity === undefined ? [] : typeof entity === 'string' ? [entity] : entity;
  }

  /** One named player, and not the automatic list, means the big card. */
  private single(): boolean {
    return !this.config?.auto_populate && typeof this.config?.entity === 'string';
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.config) {
      return nothing;
    }

    const wanted = this.wanted();
    const players = wanted
      .map((id) => this.hass?.states[id])
      .filter((entity): entity is HassEntity => entity !== undefined);
    const missing = wanted.filter((id) => this.hass?.states[id] === undefined);

    if (this.single()) {
      return html`<ha-card>
        ${players.length > 0 ? this.bigCard(players[0]) : this.notFound(missing[0])}
      </ha-card>`;
    }

    return html`<ha-card>${this.listCard(players, missing)}</ha-card>`;
  }

  private listCard(players: HassEntity[], missing: string[]): TemplateResult[] {
    const groups = groupByStatus(sortByName(players, this.config?.name_overrides));

    const rows: TemplateResult[] = [
      html`<div class="card-header"><div class="name">${this.config?.title || 'Steam Friends'}</div></div>`,
    ];
    for (const status of STATUSES) {
      const group = groups[status];
      if (!group || group.length === 0) {
        continue;
      }
      rows.push(html`<div class="status-category">${this.text(`statuses.${status}`)}</div>`);
      rows.push(...pairs(group).map((pair) => this.pairRow(pair)));
    }
    rows.push(...missing.map((id) => this.notFound(id)));
    return rows;
  }

  private pairRow(pair: HassEntity[]): TemplateResult {
    return html`<div class="user-row">${pair.map((entity) => this.listPlayer(entity))}</div>`;
  }

  private listPlayer(entity: HassEntity): TemplateResult {
    const game = entity.attributes.game;
    return html`
      <div class="steam-multi clickable ${entity.state}" @click=${() => this.openMoreInfo(entity)}>
        <div class="steam-user">
          ${entity.state !== 'unavailable' ? this.avatar(entity, `steam-avatar ${entity.state}`) : nothing}
          <div class="user-container ${game ? '' : 'no-game'}">
            <div class="steam-username ${entity.state}">
              ${displayName(entity, this.config?.name_overrides)}
            </div>
            ${game ? html`<div class="steam-value ${entity.state}">${game}</div>` : nothing}
            ${
              entity.state === 'offline'
                ? html`<div class="steam-last-online ${entity.state}">
                    <span class="steam-last-online-text ${entity.state}">${this.lastSeen(entity)}</span>
                  </div>`
                : nothing
            }
          </div>
        </div>
        ${
          game && this.config?.game_background !== false
            ? html`<img src="${String(entity.attributes.game_image_header ?? '')}" class="steam-game-bg" />`
            : nothing
        }
      </div>
    `;
  }

  private bigCard(entity: HassEntity): TemplateResult {
    const game = entity.attributes.game;
    return html`
      <div class="single-card-container clickable" @click=${() => this.openMoreInfo(entity)}>
        <div class="steam-avatar-container ${entity.state}">
          ${this.avatar(entity, `steam-avatar single ${entity.state}`)}
          <div class="steam-level single ${entity.state}">
            <span class="steam-level-text-container single">
              <span class="steam-level-text single">${entity.attributes.level ?? '?'}</span>
            </span>
            <ha-icon icon="mdi:shield"></ha-icon>
          </div>
        </div>
        <div class="user-data-container single">
          <div class="steam-username ${entity.state}">
            ${displayName(entity, this.config?.name_overrides)}
          </div>
          <div class="steam-last-online ${entity.state}">
            <span class="steam-last-online-text ${entity.state}">${this.inState(entity)}</span>
          </div>
        </div>
        ${
          this.config?.game_background
            ? game
              ? html`<img
                  src="${String(entity.attributes.game_image_header ?? '')}"
                  class="steam-game-bg single"
                />`
              : STEAM_LOGO
            : nothing
        }
        ${game ? html`<div class="steam-game">${game}</div>` : nothing}
      </div>
    `;
  }

  private avatar(entity: HassEntity, className: string): TemplateResult {
    const picture = avatarUrl(entity);
    return picture
      ? html`<img src="${picture}" class="${className}" />`
      : html`<div class="${className}"></div>`;
  }

  private notFound(entityId: string | undefined): TemplateResult {
    return html`<div class="not-found">
      ${this.text('common.entity_not_found').replace('{entity}', entityId ?? '')}
    </div>`;
  }

  private openMoreInfo(entity: HassEntity): void {
    const event = new Event('hass-more-info', { bubbles: true, composed: true }) as Event & {
      detail?: { entityId: string };
    };
    event.detail = { entityId: entity.entity_id };
    this.dispatchEvent(event);
  }

  /** "Last seen 5 min ago", or nothing when the player has no such time. */
  private lastSeen(entity: HassEntity): string {
    const since = elapsed(entity.attributes.last_online as string | number | undefined);
    if (!since) {
      return '';
    }
    return this.text('common.last_seen')
      .replace('{amount}', String(since.amount))
      .replace('{unit}', this.text(`time_units.${since.unit}`));
  }

  /** "Offline for 3 days", or nothing when the player has no such time. */
  private inState(entity: HassEntity): string {
    const since = elapsed(entity.attributes.last_online as string | number | undefined);
    if (!since) {
      return '';
    }
    return this.text('common.in_state')
      .replace('{state}', this.text(`statuses.${entity.state}`))
      .replace('{amount}', String(since.amount))
      .replace('{unit}', this.text(`time_units.${since.unit}`));
  }

  private text(key: string): string {
    const language = this.hass?.locale?.language ?? this.hass?.language ?? browserLanguage();
    return translate(language, key);
  }

  static get styles(): CSSResultGroup {
    return css`
      .card-header {
        width: 100%;
        padding-top: 0;
        padding-bottom: 8px;
      }

      .clickable {
        cursor: pointer;
      }

      .status-category {
        text-align: left;
        width: 100%;
        margin: 10px 0 5px 0;
      }

      .steam-game-bg {
        z-index: 0;
        position: absolute;
        top: 0;
        right: 0;
        height: 41px;
        width: auto;
        opacity: 0.5;
        mask-image: linear-gradient(to right, transparent 1%, black 90%);
      }

      .steam-game-default-bg.single {
        position: absolute;
        top: 5px;
        left: 135px;
        height: 90%;
        opacity: 0.3;
        mask-image: linear-gradient(to right, transparent 1%, black 90%);
      }

      .steam-game-bg.single {
        height: 100%;
        width: 130%;
        opacity: 0.3;
        object-fit: cover;
        border-radius: var(--ha-card-border-radius);
      }

      .steam-game {
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .not-found {
        background-color: yellow;
        font-family: sans-serif;
        font-size: 14px;
        padding: 8px;
      }

      ha-card {
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
      }

      .single-card-container {
        width: 100%;
        height: 80px;
      }

      .steam-avatar-container {
        display: inline-block;
      }

      .steam-avatar {
        min-width: 36px;
        min-height: 36px;
        max-width: 36px;
        max-height: 36px;
        border-style: solid;
        border-width: 1px 1px 4px 1px;
        object-fit: cover;
        margin-bottom: 3px;
        display: block;
      }

      .steam-avatar.single {
        min-width: 50px;
        min-height: 50px;
        max-width: 50px;
        max-height: 50px;
        border-width: 1px 1px 5px 1px;
        display: block;
      }

      .steam-avatar.online {
        border-color: #6cff4f9d;
        box-shadow: 1px 0.5px 3px #6cff4f88;
      }

      .steam-avatar.away {
        border-color: #d6ca1c9d;
        box-shadow: 1px 0.5px 3px #d6ca1c88;
      }

      .steam-avatar.snooze {
        border-color: #4081e49d;
        box-shadow: 1px 0.5px 3px #4081e488;
      }

      .steam-avatar.offline {
        border-color: #aaaaaa9d;
        opacity: 0.2;
        box-shadow: 1px 0.5px 3px #aaaaaa88;
      }

      .steam-username {
        width: 99%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-weight: 600;
      }

      .steam-username.offline,
      .steam-value.offline,
      .steam-level.single.offline,
      .steam-last-online-text.offline,
      .online-status-icon.offline {
        opacity: 0.5;
      }

      .steam-value {
        font-size: 10px;
        width: 99%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .user-container {
        margin-left: 0.5em;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        align-content: center;
      }

      .user-data-container.single {
        display: inline-block;
        width: calc(100% - 76px);
        vertical-align: top;
        padding-left: 10px;
      }

      .no-game {
        align-items: center;
      }

      .steam-level.single {
        position: absolute;
        top: 56px;
        left: 56px;
      }

      .steam-avatar-container.unavailable {
        display: none;
      }

      .steam-level > .steam-level-text-container {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        color: var(--card-background-color);
        z-index: 2;
      }

      .steam-last-online {
        width: 100%;
        display: flex;
        font-size: smaller;
      }

      .steam-last-online-text {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .steam-multi {
        width: calc(50% - 5px);
        display: inline-block;
        align-items: center;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
      }

      .steam-multi:first-child {
        margin-right: 3px;
      }

      .steam-multi:nth-child(2) {
        margin-left: 3px;
      }

      .user-row {
        width: 100%;
      }

      .steam-multi .steam-user {
        display: flex;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'steam-card-compact': SteamCardCompact;
  }
}
