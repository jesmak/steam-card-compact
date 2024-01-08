import { html, css, LitElement, CSSResult, TemplateResult, PropertyDeclarations } from 'lit-element';
import { customElement } from 'lit-element/decorators.js';

import * as packageDetails from '../package.json';

declare global {
  interface Window {
    customCards: {
      type: string;
      name: string;
      description: string;
    }[];
  }
}

const statuses = { 'offline': 4, 'online': 1, 'away': 2, 'snooze': 3 };

console.info(
  `%c  STEAM-CARD-COMPACT \n%c  ${packageDetails.version}   `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'steam-card-compact',
  name: 'Steam card compact',
  description: 'A compact card to show Steam integrations',
});

@customElement('steam-card-compact')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SteamCardCompact extends LitElement {

  hass;
  config;

  static get properties(): PropertyDeclarations {
    return {
      hass: {},
      config: {},
    };
  }

  render(): TemplateResult {
    return html`
      <ha-card>
        ${
          this.config.entity
            ? this.createEntityCard(this.hass.states[this.config.entity])
            : this.createEntitiesCard(this.config.entities)
        }
      </ha-card>
    `;
  }

  setConfig(config): void {
    if (!config.entities && !config.entity) {
      throw new Error('You need to define either a single entity or an entities field');
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize(): number {
    return this.config.entities ? this.config.entities.length + 1 : 2;
  }

  _toggle(state): void {
    this.hass.callService('homeassistant', 'toggle', {
      entity_id: state.entity_id,
    });
  }

  sortEntities(a, b) {
    const aStatus = statuses[a.state];
    const bStatus = statuses[b.state]
    const value = aStatus - bStatus;
    return value === 0 ? a.attributes.friendly_name.localeCompare(b.attributes.friendly_name) : value;
  }

  createEntitiesCard(entities): TemplateResult[] {
    if (typeof entities === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newEntities = [] as any[];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.values(this.hass.states).forEach((entity: any) => {
        if (entity.entity_id.startsWith(entities)) {
          newEntities.push(entity);
        }
      });

      newEntities.sort(this.sortEntities);
      entities = newEntities.map((entity) => entity.entity_id);
    }

    if (this.config.online_only) {
      const newEntities = [] as string[];

      entities.forEach((entity: string) => {
        const entityObj = this.hass.states[entity];
        if (entityObj && entityObj.state && entityObj.state !== 'offline') {
          newEntities.push(entity);
        }
      });

      entities = newEntities;
    }

    const pairs: string[] = [].concat(...entities.map(function(_, i) {
        return i % 2 ? [] : [entities.slice(i, i + 2)];
      })
    );

    return [
      html` <div class="card-header"><div class="name">${this.config.title || 'Steam Friends'}</div></div> `,
      ...pairs.map((pair) => {
        const entity1 = this.hass.states[pair[0]];
        const entity2 = pair.length > 1 ? this.hass.states[pair[1]] : undefined;
        return html`
          <div class="user-row">
            ${entity1 ? html`
              <div
                class="steam-multi clickable ${entity1.state}"
                @click=${() => this.handlePopup(entity1)}
              >
                <div class="steam-user">
                  ${this.renderUserAvatar(entity1, `steam-avatar ${entity1.state}`)}
                  <div class="user-container ${entity1.attributes.game ? '' : 'no-game'}">
                    <div class="steam-username ${entity1.state}">${entity1.attributes.friendly_name}</div>
                    ${entity1.attributes.game ? html`<div class="steam-value ${entity1.state}">${entity1.attributes.game}</div>` : ''}
                  </div>
                </div>
                ${entity1.attributes.game && this.config.game_background 
                  ? html`<img src="${entity1.attributes.game_image_header}" class="steam-game-bg" /> `
                  : ''
                }
              </div>
            ` : html`<div class="not-found">Entity ${pair[0]} not found.</div>`}
            ${entity2 ? html`
              <div
                class="steam-multi clickable ${entity2.state}"
                @click=${() => this.handlePopup(entity2)}
              >
                <div class="steam-user">
                  ${this.renderUserAvatar(entity2, `steam-avatar ${entity2.state}`)}
                  <div class="user-container ${entity2.attributes.game ? '' : 'no-game'}">
                    <div class="steam-username ${entity2.state}">${entity2.attributes.friendly_name}</div>
                    ${entity2.attributes.game ? html`<div class="steam-value ${entity2.state}">${entity2.attributes.game}</div>` : ''}
                  </div>
                </div>
                ${entity2.attributes.game && this.config.game_background 
                  ? html`<img src="${entity2.attributes.game_image_header}" class="steam-game-bg" /> `
                  : ''
                }
              </div>
            ` : pair.length == 2 ? html`<div class="not-found">Entity ${pair[1]} not found.</div>` : ''}
          </div>
        `
      }),
    ];
  }

  handlePopup(entity) {
    const entityId = entity.entity_id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = new Event('hass-more-info', { composed: true });
    e.detail = { entityId };
    this.dispatchEvent(e);
  }

  createEntityCard(entity): TemplateResult {
    return html`
      <div class="single-card-container clickable" @click=${() => this.handlePopup(entity)}>
        <div class="steam-avatar-container">
          ${this.renderUserAvatar(entity, `steam-avatar single ${this.getState(entity, 'unknown')}`)}
          <div class="steam-level single">
            <span class="steam-level-text-container single">
              <span class="steam-level-text single">${this.getAttr(entity, 'level', '?')}</span>
            </span>
            <ha-icon icon="mdi:shield"></ha-icon>
          </div>
        </div>
        <div class="user-data-container single">
          <div class="steam-username ${entity.state}">${entity.attributes.friendly_name}</div>
          <div class="steam-last-online ${entity.state}">
            <span>
              <ha-icon icon="mdi:cloud-${entity.state === 'online' ? 'check' : (isNaN(parseInt(entity.state)) ? 'question' : 'remove')}-outline"></ha-icon>
            </span>
            <span class="steam-last-online-text">${this.formatLastOnline(entity.attributes.last_online)}</span>
          </div>
        </div>
        ${this.config.game_background ? (entity.attributes.game 
            ? html`<img src="${entity.attributes.game_image_header}" class="steam-game-bg single" />`
            : html`<svg class="steam-game-default-bg single" version="1.0"viewBox="0 0 467 143">
              <g id="g6" transform="translate(-66.97417,-43.726937)">
                <path class="st0" d="m 137.9,45.1 c -36.7,0 -66.8,28.3 -69.7,64.3 l 37.5,15.5 c 3.2,-2.2 7,-3.4 11.1,-3.4 0.4,0 0.7,0 1.1,0 l 16.7,-24.2 c 0,-0.1 0,-0.2 0,-0.3 0,-14.5 11.8,-26.4 26.4,-26.4 14.5,0 26.4,11.8 26.4,26.4 0,14.6 -11.8,26.4 -26.4,26.4 -0.2,0 -0.4,0 -0.6,0 l -23.8,17 c 0,0.3 0,0.6 0,0.9 0,10.9 -8.9,19.8 -19.8,19.8 -9.6,0 -17.6,-6.8 -19.4,-15.9 L 70.6,134.1 c 8.3,29.4 35.3,50.9 67.3,50.9 38.6,0 69.9,-31.3 69.9,-69.9 0,-38.7 -31.3,-70 -69.9,-70" id="path1" />
                <path class="st0" d="m 112,151.2 -8.6,-3.5 c 1.5,3.2 4.2,5.8 7.7,7.3 7.6,3.1 16.3,-0.4 19.4,-8 1.5,-3.7 1.5,-7.7 0,-11.4 -1.5,-3.7 -4.4,-6.5 -8,-8.1 -3.6,-1.5 -7.5,-1.5 -10.9,-0.2 l 8.9,3.7 c 5.6,2.3 8.2,8.7 5.9,14.3 -2.4,5.6 -8.8,8.3 -14.4,5.9" id="path2" />
                <path class="st0" d="m 178.5,97 c 0,-9.7 -7.9,-17.6 -17.6,-17.6 -9.7,0 -17.6,7.9 -17.6,17.6 0,9.7 7.9,17.6 17.6,17.6 9.7,0 17.6,-7.9 17.6,-17.6 m -30.7,0 c 0,-7.3 5.9,-13.2 13.2,-13.2 7.3,0 13.2,5.9 13.2,13.2 0,7.3 -5.9,13.2 -13.2,13.2 -7.3,0 -13.2,-5.9 -13.2,-13.2" id="path3" />
                <path class="st0" d="m 282.5,93 -4.7,8.2 c -3.6,-2.5 -8.5,-4 -12.8,-4 -4.9,0 -7.9,2 -7.9,5.6 0,4.4 5.4,5.4 13.3,8.3 8.6,3 13.5,6.6 13.5,14.4 0,10.7 -8.4,16.8 -20.6,16.8 -5.9,0 -13.1,-1.5 -18.5,-4.9 l 3.4,-9.1 c 4.5,2.4 9.8,3.7 14.5,3.7 6.4,0 9.5,-2.4 9.5,-5.9 0,-4 -4.6,-5.2 -12.1,-7.7 -8.5,-2.9 -14.5,-6.6 -14.5,-15.3 0,-9.8 7.8,-15.4 19.1,-15.4 7.9,0.1 14.3,2.6 17.8,5.3" id="path4" />
                <polygon class="st0" points="335.1,98.2 319.1,98.2 319.1,141.4 308.1,141.4 308.1,98.2 292.1,98.2 292.1,88.7 335.1,88.7 " id="polygon4" />
                <polygon class="st0" points="382.8,141.4 347.3,141.4 347.3,88.7 382.8,88.7 382.8,98.2 358.3,98.2 358.3,110 379.4,110 379.4,119.5 358.3,119.5 358.3,131.9 382.8,131.9 " id="polygon5" />
                <path class="st0" d="m 407.4,131.2 -3.5,10.2 h -11.6 l 19.8,-52.7 h 11.1 l 20.3,52.7 h -12 l -3.6,-10.2 z m 10.2,-29.9 -7.2,21.1 H 425 Z" id="path5" />
                <polygon class="st0" points="485.8,139.9 479.5,139.9 465.4,109.4 465.4,141.4 454.8,141.4 454.8,88.7 465.3,88.7 483,126.8 500.1,88.7 510.8,88.7 510.8,141.4 500.2,141.4 500.2,109.1 " id="polygon6" />
                <path class="st0" d="m 532.1,95.4 c 0,4.5 -3.4,7.3 -7.3,7.3 -3.9,0 -7.3,-2.8 -7.3,-7.3 0,-4.5 3.4,-7.3 7.3,-7.3 3.9,-0.1 7.3,2.7 7.3,7.3 m -13.4,0 c 0,3.8 2.7,6.2 6.1,6.2 3.3,0 6.1,-2.4 6.1,-6.2 0,-3.8 -2.7,-6.1 -6.1,-6.1 -3.3,-0.1 -6.1,2.3 -6.1,6.1 m 6.2,-3.8 c 1.9,0 2.5,1 2.5,2.1 0,1 -0.6,1.7 -1.3,2 l 1.7,3.2 h -1.4 L 525,96.1 h -1.5 v 2.8 h -1.2 v -7.2 h 2.6 z m -1.4,3.4 h 1.3 c 0.8,0 1.3,-0.5 1.3,-1.2 0,-0.7 -0.4,-1.1 -1.3,-1.1 h -1.3 z" id="path6" />
              </g>
            </svg>`) 
          : ''}
        ${entity.attributes.game ? html`<div class="steam-game">${entity.attributes.game}</div>` : ''}
      </div>
    `;
  }

  getState(entity, defaultValue: string) {
    return entity && entity.state ? entity.state : defaultValue;
  }

  getAttr(entity, attribute: string, defaultValue: string) {
    return entity && entity.attributes ? entity.attributes[attribute] : defaultValue;
  }

  formatLastOnline(lastOnline: string): string {
    if (isNaN(parseInt(lastOnline))) return '';

    const seconds = (new Date().getTime() - new Date(lastOnline).getTime()) / 1000;
    return seconds < 60 ? `${seconds} sec` :
      seconds < 3600 ? `${Math.floor(seconds/60)} min` :
      seconds < 86400 ? `${Math.floor(seconds/60/60)} h` :
      seconds < 86400 ? `${Math.floor(seconds/60/60/24)} ${this.translation("ui.components.calendar.event.repeat.interval.daily", "days")}` :
      `${Math.floor(seconds/60/60/24/7)} ${this.translation("ui.components.calendar.event.repeat.interval.weekly", "weeks")}`;
  }

  translation(resource, fallback) {
    const lang = this.hass.selectedLanguage || this.hass.language;
    const resources = this.hass.resources[lang];
    return resources && resources[resource] ? resources[resource] : fallback;
  }

  renderUserAvatar(entity, class_name): TemplateResult {
    return entity.attributes.entity_picture
      ? html` <img src="${entity.attributes.entity_picture.replace('_medium', '_full')}" class="${class_name}" /> `
      : html` <ha-icon icon="${entity.attributes.icon}" class="${class_name}"></ha-icon> `;
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
        width: 40px;
        height: 36px;
        border-style: solid;
        border-width: 1px 1px 4px 1px;
        object-fit: cover;
        margin-bottom: 3px;
      }

      .steam-avatar.single {
        width: 50px;
        height: 50px;
        border-width: 1px 1px 5px 1px;
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
        font-weight: 600;
        width: 99%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .steam-username.offline, .steam-value.offline {
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
      }

      .user-data-container.single {
        display: inline-block;
        width: calc(100% - 76px);
        vertical-align: top;
        padding-left: 10px;        
      }

      .no-game {
        display: flex;
        align-items: center;
      }

      .steam-level.single {
        position: absolute;
        top: 56px;
        left: 56px;
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
        margin-top: 5px;
      }

      .steam-last-online-text {
        margin-left: 5px;
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

      .steam-multi:last-child {
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
