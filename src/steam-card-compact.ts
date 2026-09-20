/**
 * A dashboard card for Home Assistant's Steam integration: who is online, what
 * they are playing, and how long ago the rest were last seen. Several players
 * are listed two to a row; a single player can be given a bigger card of their own.
 */
import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { CARD_VERSION, STATUSES, STORE_URL } from './const';
import './editor';
import { avatarUrl, displayName, elapsed, groupByStatus, pairs, sortByName, steamPlayers } from './friends';
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

  public static getConfigElement(): HTMLElement {
    return document.createElement('steam-card-compact-editor');
  }

  /** Offers every Steam player there is when the card is added from the picker. */
  public static getStubConfig(hass?: HomeAssistant): Record<string, unknown> {
    const players = steamPlayers(hass?.states ?? {});
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

  public getGridOptions(): Record<string, unknown> {
    // A whole row either way: the big card's picture needs the width, and the list holds two players a row.
    return { columns: 12, rows: 'auto', min_columns: 6 };
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
      return steamPlayers(this.hass.states);
    }
    const { entity } = this.config;
    return entity === undefined ? [] : typeof entity === 'string' ? [entity] : entity;
  }

  /** Whether one player gets the big card: asked for, or one named player with the automatic layout. */
  private single(): boolean {
    const layout = this.config?.layout ?? 'auto';
    if (layout !== 'auto') {
      return layout === 'player';
    }
    return !this.config?.auto_populate && typeof this.config?.entity === 'string';
  }

  private get gameBackground(): boolean {
    return this.config?.game_background !== false;
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
      return html`<ha-card class="big-card">
        ${players.length > 0 ? this.bigCard(players[0]) : this.notFound(missing[0])}
      </ha-card>`;
    }

    return html`<ha-card>${this.listCard(players, missing)}</ha-card>`;
  }

  private listCard(players: HassEntity[], missing: string[]): TemplateResult[] {
    const groups = groupByStatus(sortByName(players, this.config?.name_overrides));

    const rows: TemplateResult[] = [
      html`<div class="card-header">${this.config?.title || 'Steam Friends'}</div>`,
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
    const header = entity.attributes.game_image_header;
    return html`
      <div class="player clickable ${this.mood(entity)}" @click=${() => this.openMoreInfo(entity)}>
        ${
          game && this.gameBackground && header
            ? html`<img src="${String(header)}" class="row-picture" alt="" />`
            : nothing
        }
        ${this.avatar(entity)}
        <div class="details">
          <div class="name">${displayName(entity, this.config?.name_overrides)}</div>
          ${game ? this.gameLine(entity) : nothing}
          ${entity.state === 'offline' ? html`<div class="seen">${this.lastSeen(entity)}</div>` : nothing}
        </div>
      </div>
    `;
  }

  private bigCard(entity: HassEntity): TemplateResult {
    const game = entity.attributes.game;
    const picture = entity.attributes.game_image_main ?? entity.attributes.game_image_header;
    return html`
      <div class="player big clickable ${this.mood(entity)}" @click=${() => this.openMoreInfo(entity)}>
        ${
          this.gameBackground
            ? game && picture
              ? html`<img src="${String(picture)}" class="big-picture" alt="" />`
              : STEAM_LOGO
            : nothing
        }
        ${this.avatar(entity)}
        <div class="details">
          <div class="name">${displayName(entity, this.config?.name_overrides)}</div>
          <div class="seen">${this.inState(entity)}</div>
          ${game ? this.gameLine(entity) : nothing}
        </div>
      </div>
    `;
  }

  /** The game, with its icon. Clicking it opens the game in the Steam store. */
  private gameLine(entity: HassEntity): TemplateResult {
    const icon = entity.attributes.game_icon;
    const id = entity.attributes.game_id;
    return html`
      <div
        class="game ${id ? 'clickable' : ''}"
        @click=${(event: Event) => this.openStore(event, id)}
        title="${String(entity.attributes.game ?? '')}"
      >
        ${icon ? html`<img src="${String(icon)}" class="game-icon" alt="" />` : nothing}
        <span class="game-name">${entity.attributes.game}</span>
      </div>
    `;
  }

  /** The avatar, ringed in the colour of the player's state, with their Steam level in the corner. */
  private avatar(entity: HassEntity): TemplateResult {
    const picture = avatarUrl(entity);
    const level = entity.attributes.level;
    return html`
      <div class="avatar-wrap">
        ${
          picture
            ? html`<img src="${picture}" class="avatar" alt="" />`
            : html`<div class="avatar avatar-blank"></div>`
        }
        ${
          level === undefined || level === null
            ? nothing
            : html`<span class="level" title="${this.text('common.level').replace('{level}', String(level))}">
                ${level}
              </span>`
        }
      </div>
    `;
  }

  /** The state the card draws a player in: in a game, or whatever Steam says. */
  private mood(entity: HassEntity): string {
    return entity.attributes.game && entity.state !== 'offline' ? `${entity.state} ingame` : entity.state;
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

  private openStore(event: Event, gameId: unknown): void {
    if (gameId === undefined || gameId === null || gameId === '') {
      return;
    }
    // The player under the game opens more-info; the game opens the store instead.
    event.stopPropagation();
    window.open(`${STORE_URL}${String(gameId)}`, '_blank', 'noopener');
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
      return this.text(`statuses.${entity.state}`);
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
      /* The colour of each state, used for the ring around an avatar and its level. */
      :host {
        --steam-online: #57cbde;
        --steam-ingame: #90ba3c;
        --steam-busy: #d9544e;
        --steam-away: #d6ca1c;
        --steam-snooze: #4081e4;
        --steam-looking: #c58ade;
        --steam-offline: #8f98a0;
      }

      ha-card {
        padding: 16px;
        overflow: hidden;
      }

      /* The big card is all one player, so its picture reaches the edges. */
      ha-card.big-card {
        padding: 0;
      }

      .card-header {
        padding: 0 0 8px 0;
        font-size: var(--ha-card-header-font-size, 24px);
        line-height: 1.2;
      }

      .clickable {
        cursor: pointer;
      }

      .status-category {
        margin: 10px 0 5px 0;
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .user-row {
        display: flex;
        gap: 8px;
      }

      /* A row of the list holds half of it; the big card fills its own. */
      .player {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        width: calc(50% - 4px);
        min-width: 0;
        /* Room below for the level, which hangs off the corner of the avatar. */
        padding: 6px 4px 8px 4px;
        border-radius: 8px;
        overflow: hidden;
      }

      .player.big {
        width: 100%;
        min-height: 88px;
        gap: 12px;
        padding: 12px 16px 14px 16px;
        border-radius: var(--ha-card-border-radius, 12px);
      }

      /* Everything but the pictures sits above them. */
      .avatar-wrap,
      .details {
        position: relative;
        z-index: 1;
      }

      .avatar-wrap {
        position: relative;
        flex: 0 0 auto;
        line-height: 0;
      }

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        object-fit: cover;
        display: block;
        box-shadow: 0 0 0 2px var(--ring, var(--steam-offline));
      }

      .avatar-blank {
        background: var(--secondary-background-color);
      }

      .big .avatar {
        width: 64px;
        height: 64px;
        border-radius: 10px;
      }

      /* The level sits in the corner of the avatar and grows with the number. */
      .level {
        position: absolute;
        right: -4px;
        bottom: -6px;
        min-width: 14px;
        height: 16px;
        padding: 0 4px;
        box-sizing: border-box;
        border-radius: 8px;
        border: 1px solid var(--ring, var(--steam-offline));
        background: var(--card-background-color, var(--ha-card-background, #fff));
        color: var(--primary-text-color);
        font-size: 10px;
        line-height: 14px;
        text-align: center;
        font-variant-numeric: tabular-nums;
      }

      .big .level {
        height: 18px;
        min-width: 18px;
        border-radius: 9px;
        font-size: 11px;
        line-height: 16px;
      }

      .details {
        min-width: 0;
        flex: 1 1 auto;
      }

      .name {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .big .name {
        font-size: 18px;
      }

      .seen {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .game {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
        font-size: 12px;
        width: fit-content;
        max-width: 100%;
      }

      .big .game {
        font-size: 14px;
        margin-top: 2px;
      }

      .game-icon {
        width: 16px;
        height: 16px;
        border-radius: 3px;
        flex: 0 0 auto;
      }

      .big .game-icon {
        width: 20px;
        height: 20px;
      }

      .game-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .game.clickable:hover .game-name {
        text-decoration: underline;
      }

      /* The game's picture lies behind the row, fading out towards the names. */
      .row-picture {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 60%;
        object-fit: cover;
        opacity: 0.35;
        z-index: 0;
        mask-image: linear-gradient(to right, transparent, black 85%);
        -webkit-mask-image: linear-gradient(to right, transparent, black 85%);
      }

      .big-picture {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.28;
        z-index: 0;
        mask-image: linear-gradient(to right, transparent, black 60%);
        -webkit-mask-image: linear-gradient(to right, transparent, black 60%);
      }

      /* The Steam logo stands in for the picture when a player is in no game. */
      /* The box is a div, because an inline svg has no size of its own to position by. */
      .steam-game-default-bg {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        /* Wider and taller than the drawing needs, with room at the right, so it never touches the edges. */
        height: 50%;
        width: min(50%, 190px);
        padding-right: 25px;
        box-sizing: border-box;
        opacity: 0.15;
        z-index: 0;
        pointer-events: none;
      }

      .steam-logo {
        display: block;
        width: 100%;
        height: 100%;
        fill: var(--primary-text-color);
      }

      /* Each state colours the ring, and the offline players are greyed out. */
      .online {
        --ring: var(--steam-online);
      }

      .ingame {
        --ring: var(--steam-ingame);
      }

      .busy {
        --ring: var(--steam-busy);
      }

      .away {
        --ring: var(--steam-away);
      }

      .snooze {
        --ring: var(--steam-snooze);
      }

      .looking_to_play,
      .looking_to_trade {
        --ring: var(--steam-looking);
      }

      .offline,
      .unavailable {
        --ring: var(--steam-offline);
      }

      .offline .avatar,
      .unavailable .avatar {
        filter: grayscale(1);
        opacity: 0.65;
      }

      .offline .name,
      .unavailable .name {
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .not-found {
        background-color: var(--warning-color, #ffa726);
        color: var(--text-primary-color, #fff);
        border-radius: 8px;
        font-size: 14px;
        padding: 8px;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'steam-card-compact': SteamCardCompact;
  }
}
