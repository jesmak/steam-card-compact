import { html, css, LitElement, CSSResult, TemplateResult, PropertyDeclarations } from 'lit-element';
import { customElement, property, state } from 'lit-element/decorators.js';

import * as packageDetails from '../package.json';
import { HomeAssistant } from 'custom-card-helpers';
import { SteamCardCompactConfig } from './types';
import { localize } from './localize';
import { HassEntity } from 'home-assistant-js-websocket';

declare global {
  interface Window {
    customCards: {
      type: string;
      name: string;
      description: string;
    }[];
  }
}

console.info(
  `%c  STEAM-CARD-COMPACT \n%c  ${packageDetails.version}   `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'steam-card-compact',
  name: localize('common.name'),
  description: localize('common.description'),
});

@customElement('steam-card-compact')
export class SteamCardCompact extends LitElement {
  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  @property() public hass!: HomeAssistant;
  @state() private config!: SteamCardCompactConfig;

  static get properties(): PropertyDeclarations {
    return {
      hass: {},
      config: {},
    };
  }

  public setConfig(config: SteamCardCompactConfig): void {
    if (!config || (config.auto_populate === undefined && config.entity === undefined)) {
      throw new Error(localize('common.invalid_configuration'));
    }

    this.config = {
      name: localize('common.name'),
      ...config,
    };
  }

  protected render(): TemplateResult {
    const steamEntities = Object.keys(this.hass.states).filter((id) => id.startsWith('sensor.steam_'));

    return html`
      <ha-card>
        ${this.config.auto_populate
          ? this.createEntitiesCard(steamEntities.map((entity_id) => this.hass.states[entity_id]))
          : typeof this.config.entity === 'string'
            ? this.createEntityCard(this.hass.states[this.config.entity])
            : this.createEntitiesCard(this.config.entity!.map((entity_id) => this.hass.states[entity_id]))}
      </ha-card>
    `;
  }

  protected getCardSize(): number {
    return this.config.entities ? this.config.entities.length + 1 : 2;
  }

  _toggle(state): void {
    this.hass.callService('homeassistant', 'toggle', {
      entity_id: state.entity_id,
    });
  }

  createEntitiesCard(entities: HassEntity[]): TemplateResult[] {
    const groupByKey = (list: HassEntity[], key: string) => {
      return list.reduce(
        (previous: HassEntity, current: HassEntity) => ({
          ...previous,
          [current[key]]: (previous[current[key]] || []).concat(current),
        }),
        {} as HassEntity,
      );
    };

    const splitToPairs = (entities: HassEntity[]) =>
      entities?.reduce(function (result, _, index, array) {
        if (index % 2 === 0) result.push(array.slice(index, index + 2));
        return result;
      }, [] as HassEntity[][]);

    entities.sort((a: HassEntity, b: HassEntity) =>
      (
        (this.config.name_overrides &&
          this.config.name_overrides.find((override) => override?.entity === a.entity_id)?.name) ||
        a.attributes.friendly_name ||
        ''
      ).localeCompare(
        (this.config.name_overrides &&
          this.config.name_overrides.find((override) => override?.entity === b.entity_id)?.name) ||
          b.attributes.friendly_name ||
          '',
      ),
    );

    const groups = groupByKey(entities, 'state');

    const online = splitToPairs(groups['online']);
    const away = splitToPairs(groups['away']);
    const snooze = splitToPairs(groups['snooze']);
    const offline = splitToPairs(groups['offline']);
    const unavailable = splitToPairs(groups['unavailable']);

    return [
      html`<div class="card-header"><div class="name">${this.config.title || 'Steam Friends'}</div></div> `,
      online && online.length ? html`<div class="status-category">${localize('statuses.online')}</div>` : html``,
      ...(online?.map((pair) => this.createPairRow(pair)) || []),
      away && away.length ? html`<div class="status-category">${localize('statuses.away')}</div>` : html``,
      ...(away?.map((pair) => this.createPairRow(pair)) || []),
      snooze && snooze.length ? html`<div class="status-category">${localize('statuses.snooze')}</div>` : html``,
      ...(snooze?.map((pair) => this.createPairRow(pair)) || []),
      offline && offline.length ? html`<div class="status-category">${localize('statuses.offline')}</div>` : html``,
      ...(offline?.map((pair) => this.createPairRow(pair)) || []),
      unavailable && unavailable.length
        ? html`<div class="status-category">${localize('statuses.unavailable')}</div>`
        : html``,
      ...(unavailable?.map((pair) => this.createPairRow(pair)) || []),
    ];
  }

  createPairRow(pair: HassEntity[]) {
    const entity1 = pair[0];
    const entity2 = pair.length > 1 ? pair[1] : undefined;

    return html`
      <div class="user-row">
        ${entity1
          ? this.createPairItem(entity1)
          : html`<div class="not-found">${localize('common.entity_not_found')}</div>`}
        ${entity2
          ? this.createPairItem(entity2)
          : pair.length == 2
            ? html`<div class="not-found">${localize('common.entity_not_found')}</div>`
            : ''}
      </div>
    `;
  }

  createPairItem(entity: HassEntity) {
    const name = entity
      ? (this.config.name_overrides &&
          this.config.name_overrides.find((override) => override?.entity === entity.entity_id)?.name) ||
        entity.attributes.friendly_name
      : undefined;

    return html`
      <div class="steam-multi clickable ${entity.state}" @click=${() => this.handlePopup(entity)}>
        <div class="steam-user">
          ${entity.state !== 'unavailable' ? this.renderUserAvatar(entity, `steam-avatar ${entity.state}`) : ''}
          <div class="user-container ${entity.attributes.game ? '' : 'no-game'}">
            <div class="steam-username ${entity.state}">${name}</div>
            ${entity.attributes.game
              ? html`<div class="steam-value ${entity.state}">${entity.attributes.game}</div>`
              : ''}
            ${entity.state == 'offline'
              ? html`<div class="steam-last-online ${entity.state}">
                  <span class="steam-last-online-text ${entity.state}"
                    >${this.formatLastSeen(entity.attributes.last_online)}</span
                  >
                </div>`
              : ''}
          </div>
        </div>
        ${entity.attributes.game && this.config.game_background !== false
          ? html`<img src="${entity.attributes.game_image_header}" class="steam-game-bg" /> `
          : ''}
      </div>
    `;
  }

  handlePopup(entity: HassEntity) {
    const entityId = entity.entity_id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = new Event('hass-more-info', { composed: true });
    e.detail = { entityId };
    this.dispatchEvent(e);
  }

  createEntityCard(entity: HassEntity): TemplateResult {
    const name =
      (this.config.name_overrides &&
        this.config.name_overrides.find((override) => override?.entity === entity.entity_id)?.name) ||
      entity.attributes.friendly_name;

    return html`
      <div class="single-card-container clickable" @click=${() => this.handlePopup(entity)}>
        <div class="steam-avatar-container ${this.getState(entity, 'unknown')}">
          ${this.renderUserAvatar(entity, `steam-avatar single ${this.getState(entity, 'unknown')}`)}
          <div class="steam-level single ${this.getState(entity, 'unknown')}">
            <span class="steam-level-text-container single">
              <span class="steam-level-text single">${this.getAttr(entity, 'level', '?')}</span>
            </span>
            <ha-icon icon="mdi:shield"></ha-icon>
          </div>
        </div>
        <div class="user-data-container single">
          <div class="steam-username ${entity.state}">${name}</div>
          <div class="steam-last-online ${entity.state}">
            <span class="steam-last-online-text ${entity.state}"
              >${this.formatLastOnline(entity.attributes.last_online, entity.state)}</span
            >
          </div>
        </div>
        ${this.config.game_background
          ? entity.attributes.game
            ? html`<img src="${entity.attributes.game_image_header}" class="steam-game-bg single" />`
            : html`<svg class="steam-game-default-bg single" version="1.0" viewBox="0 0 467 143">
                <g id="g6" transform="translate(-66.97417,-43.726937)">
                  <path
                    class="st0"
                    d="m 137.9,45.1 c -36.7,0 -66.8,28.3 -69.7,64.3 l 37.5,15.5 c 3.2,-2.2 7,-3.4 11.1,-3.4 0.4,0 0.7,0 1.1,0 l 16.7,-24.2 c 0,-0.1 0,-0.2 0,-0.3 0,-14.5 11.8,-26.4 26.4,-26.4 14.5,0 26.4,11.8 26.4,26.4 0,14.6 -11.8,26.4 -26.4,26.4 -0.2,0 -0.4,0 -0.6,0 l -23.8,17 c 0,0.3 0,0.6 0,0.9 0,10.9 -8.9,19.8 -19.8,19.8 -9.6,0 -17.6,-6.8 -19.4,-15.9 L 70.6,134.1 c 8.3,29.4 35.3,50.9 67.3,50.9 38.6,0 69.9,-31.3 69.9,-69.9 0,-38.7 -31.3,-70 -69.9,-70"
                    id="path1"
                  />
                  <path
                    class="st0"
                    d="m 112,151.2 -8.6,-3.5 c 1.5,3.2 4.2,5.8 7.7,7.3 7.6,3.1 16.3,-0.4 19.4,-8 1.5,-3.7 1.5,-7.7 0,-11.4 -1.5,-3.7 -4.4,-6.5 -8,-8.1 -3.6,-1.5 -7.5,-1.5 -10.9,-0.2 l 8.9,3.7 c 5.6,2.3 8.2,8.7 5.9,14.3 -2.4,5.6 -8.8,8.3 -14.4,5.9"
                    id="path2"
                  />
                  <path
                    class="st0"
                    d="m 178.5,97 c 0,-9.7 -7.9,-17.6 -17.6,-17.6 -9.7,0 -17.6,7.9 -17.6,17.6 0,9.7 7.9,17.6 17.6,17.6 9.7,0 17.6,-7.9 17.6,-17.6 m -30.7,0 c 0,-7.3 5.9,-13.2 13.2,-13.2 7.3,0 13.2,5.9 13.2,13.2 0,7.3 -5.9,13.2 -13.2,13.2 -7.3,0 -13.2,-5.9 -13.2,-13.2"
                    id="path3"
                  />
                  <path
                    class="st0"
                    d="m 282.5,93 -4.7,8.2 c -3.6,-2.5 -8.5,-4 -12.8,-4 -4.9,0 -7.9,2 -7.9,5.6 0,4.4 5.4,5.4 13.3,8.3 8.6,3 13.5,6.6 13.5,14.4 0,10.7 -8.4,16.8 -20.6,16.8 -5.9,0 -13.1,-1.5 -18.5,-4.9 l 3.4,-9.1 c 4.5,2.4 9.8,3.7 14.5,3.7 6.4,0 9.5,-2.4 9.5,-5.9 0,-4 -4.6,-5.2 -12.1,-7.7 -8.5,-2.9 -14.5,-6.6 -14.5,-15.3 0,-9.8 7.8,-15.4 19.1,-15.4 7.9,0.1 14.3,2.6 17.8,5.3"
                    id="path4"
                  />
                  <polygon
                    class="st0"
                    points="335.1,98.2 319.1,98.2 319.1,141.4 308.1,141.4 308.1,98.2 292.1,98.2 292.1,88.7 335.1,88.7 "
                    id="polygon4"
                  />
                  <polygon
                    class="st0"
                    points="382.8,141.4 347.3,141.4 347.3,88.7 382.8,88.7 382.8,98.2 358.3,98.2 358.3,110 379.4,110 379.4,119.5 358.3,119.5 358.3,131.9 382.8,131.9 "
                    id="polygon5"
                  />
                  <path
                    class="st0"
                    d="m 407.4,131.2 -3.5,10.2 h -11.6 l 19.8,-52.7 h 11.1 l 20.3,52.7 h -12 l -3.6,-10.2 z m 10.2,-29.9 -7.2,21.1 H 425 Z"
                    id="path5"
                  />
                  <polygon
                    class="st0"
                    points="485.8,139.9 479.5,139.9 465.4,109.4 465.4,141.4 454.8,141.4 454.8,88.7 465.3,88.7 483,126.8 500.1,88.7 510.8,88.7 510.8,141.4 500.2,141.4 500.2,109.1 "
                    id="polygon6"
                  />
                  <path
                    class="st0"
                    d="m 532.1,95.4 c 0,4.5 -3.4,7.3 -7.3,7.3 -3.9,0 -7.3,-2.8 -7.3,-7.3 0,-4.5 3.4,-7.3 7.3,-7.3 3.9,-0.1 7.3,2.7 7.3,7.3 m -13.4,0 c 0,3.8 2.7,6.2 6.1,6.2 3.3,0 6.1,-2.4 6.1,-6.2 0,-3.8 -2.7,-6.1 -6.1,-6.1 -3.3,-0.1 -6.1,2.3 -6.1,6.1 m 6.2,-3.8 c 1.9,0 2.5,1 2.5,2.1 0,1 -0.6,1.7 -1.3,2 l 1.7,3.2 h -1.4 L 525,96.1 h -1.5 v 2.8 h -1.2 v -7.2 h 2.6 z m -1.4,3.4 h 1.3 c 0.8,0 1.3,-0.5 1.3,-1.2 0,-0.7 -0.4,-1.1 -1.3,-1.1 h -1.3 z"
                    id="path6"
                  />
                </g>
              </svg>`
          : ''}
        ${entity.attributes.game ? html`<div class="steam-game">${entity.attributes.game}</div>` : ''}
      </div>
    `;
  }

  getState(entity: HassEntity, defaultValue: string) {
    return entity && entity.state ? entity.state : defaultValue;
  }

  getAttr(entity: HassEntity, attribute: string, defaultValue: string) {
    return entity && entity.attributes ? entity.attributes[attribute] : defaultValue;
  }

  formatLastOnline(lastOnline: string, state: string): string {
    return this.setAmountAndUnit(lastOnline, localize('common.in_state')).replace(
      '{state}',
      localize(`statuses.${state}`),
    );
  }

  formatLastSeen(lastSeen: string) {
    return this.setAmountAndUnit(lastSeen, localize('common.last_seen'));
  }

  setAmountAndUnit(time: string, text: string) {
    if (isNaN(parseInt(time))) return '';

    const seconds = (new Date().getTime() - new Date(time).getTime()) / 1000;

    const amount =
      seconds < 60
        ? seconds
        : seconds < 3600
          ? Math.floor(seconds / 60)
          : seconds < 86400
            ? Math.floor(seconds / 60 / 60)
            : seconds < 604800
              ? Math.floor(seconds / 60 / 60 / 24)
              : Math.floor(seconds / 60 / 60 / 24 / 7);

    const unit =
      seconds < 60
        ? 'time_units.seconds'
        : seconds < 3600
          ? 'time_units.minutes'
          : seconds < 86400
            ? 'time_units.hours'
            : seconds < 604800
              ? 'time_units.days'
              : 'time_units.weeks';

    return text.replace('{amount}', amount.toString()).replace('{unit}', localize(unit));
  }

  renderUserAvatar(entity: HassEntity, class_name: string): TemplateResult {
    return entity.attributes.entity_picture
      ? html`<img src="${entity.attributes.entity_picture.replace('_medium', '_full')}" class="${class_name}" />`
      : html`<div class="${class_name}"></div>`;
  }

  static get styles(): CSSResult {
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
