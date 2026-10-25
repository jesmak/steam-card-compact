/**
 * A dashboard card for Home Assistant's Steam integration: who is in a game and for how long, who is online,
 * and how long ago the rest were last seen. Several players are listed two to a row; a single player can be
 * given a bigger card of their own, with their game's picture and logo behind them.
 */
import { LitElement, css, html, nothing } from "lit";
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { GestureDetector, isTappable } from "./actions";
import type { Gesture } from "./actions";
import { CARD_VERSION, STATUSES, STORE_URL } from "./const";
import "./editor";
import {
    avatarUrl,
    deviceEntityIds,
    displayName,
    elapsed,
    groupByStatus,
    inGame,
    pairs,
    playTime,
    readPlayer,
    sortByName,
    statusOf,
    steamPlayers,
} from "./friends";
import type { Player } from "./friends";
import type { HassEntity, HomeAssistant } from "./hass";
import { browserLanguage, languageOf, translate } from "./localize/localize";
import { STEAM_LOGO } from "./logo";
import type { SteamCardCompactConfig } from "./types";

console.info(
    `%c  STEAM-CARD-COMPACT \n%c  ${CARD_VERSION}   `,
    "color: orange; font-weight: bold; background: black",
    "color: white; font-weight: bold; background: dimgray",
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
    type: "steam-card-compact",
    name: translate(browserLanguage(), "common.name"),
    description: translate(browserLanguage(), "common.description"),
    documentationURL: "https://github.com/jesmak/steam-card-compact",
    preview: true,
});

@customElement("steam-card-compact")
export class SteamCardCompact extends LitElement {
    @property({ attribute: false }) public hass?: HomeAssistant;
    @state() private config?: SteamCardCompactConfig;
    // Pictures that didn't load, so the card falls back instead of showing a broken one
    @state() private failed = new Set<string>();
    private readonly gestures = new Map<string, GestureDetector>();
    private timer?: ReturnType<typeof setInterval>;

    public static getConfigElement(): HTMLElement {
        return document.createElement("steam-card-compact-editor");
    }

    /** Offers every Steam player there is when the card is added from the picker. */
    public static getStubConfig(hass?: HomeAssistant): Record<string, unknown> {
        const players = steamPlayers({ states: hass?.states ?? {}, entities: hass?.entities });
        return players.length > 0 ? { entity: players } : { auto_populate: true };
    }

    public setConfig(config: SteamCardCompactConfig): void {
        if (!config || (config.auto_populate === undefined && config.entity === undefined)) {
            throw new Error(translate(browserLanguage(), "common.invalid_configuration"));
        }
        this.config = { ...config };
    }

    public getCardSize(): number {
        const shown = this.wanted().length;
        return this.single() ? 2 : 1 + Math.ceil(shown / 2);
    }

    public getGridOptions(): Record<string, unknown> {
        // A whole row by default: the big card's picture needs the width, and the list holds two players a row.
        return { columns: 12, rows: "auto", min_columns: 6 };
    }

    // The times ("1 h 20 min", "seen 5 min ago") age while the sensors stay the same, so the card is drawn
    // again every minute
    public connectedCallback(): void {
        super.connectedCallback();
        this.timer = setInterval(() => this.requestUpdate(), 60_000);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        clearInterval(this.timer);
        this.gestures.forEach((detector) => detector.dispose());
        this.gestures.clear();
    }

    protected shouldUpdate(changed: PropertyValues): boolean {
        if (!changed.has("hass") || changed.size > 1 || !this.config) {
            return true;
        }
        const previous = changed.get("hass") as HomeAssistant | undefined;
        if (!previous || !this.hass || previous.entities !== this.hass.entities || languageOf(previous) !== languageOf(this.hass)) {
            return true;
        }
        // With every player listed, a player who appears or goes away counts as a change too
        if (this.config.auto_populate && steamPlayers(previous).join() !== steamPlayers(this.hass).join()) {
            return true;
        }
        return this.watched().some((id) => previous.states[id] !== this.hass?.states[id]);
    }

    /** The entity ids the card is meant to show. */
    private wanted(): string[] {
        if (!this.hass || !this.config) {
            return [];
        }
        if (this.config.auto_populate) {
            return steamPlayers(this.hass);
        }
        const { entity } = this.config;
        return entity === undefined ? [] : typeof entity === "string" ? [entity] : entity;
    }

    /** The players and the entities of their devices that the card reads: now playing, level and the pictures. */
    private watched(): string[] {
        const hass = this.hass;
        return hass ? this.wanted().flatMap((id) => deviceEntityIds(hass, id)) : [];
    }

    /** Whether one player gets the big card: asked for, or one named player with the automatic layout. */
    private single(): boolean {
        const layout = this.config?.layout ?? "auto";
        if (layout !== "auto") {
            return layout === "player";
        }
        return !this.config?.auto_populate && typeof this.config?.entity === "string";
    }

    private get gameBackground(): boolean {
        return this.config?.game_background !== false;
    }

    protected render(): TemplateResult | typeof nothing {
        if (!this.hass || !this.config) {
            return nothing;
        }
        const hass = this.hass;
        const wanted = this.wanted();
        const players = wanted
            .map((id) => hass.states[id])
            .filter((entity): entity is HassEntity => entity !== undefined)
            .map((entity) => readPlayer(hass, entity));
        const missing = wanted.filter((id) => hass.states[id] === undefined);

        if (this.single()) {
            return html`<ha-card class="big-card">${players.length > 0 ? this.bigCard(players[0]) : this.notFound(missing[0])}</ha-card>`;
        }
        return html`<ha-card>${this.listCard(players, missing)}</ha-card>`;
    }

    private listCard(players: Player[], missing: string[]): TemplateResult[] {
        const groups = groupByStatus(sortByName(players, this.config?.name_overrides));
        const rows: TemplateResult[] = [html`<div class="card-header">${this.config?.title || this.text("common.title")}</div>`];
        for (const status of STATUSES) {
            const group = groups[status];
            if (!group || group.length === 0) {
                continue;
            }
            rows.push(html`<div class="status-category">${this.text(`statuses.${status}`)}</div>`);
            rows.push(...pairs(group).map((pair) => html`<div class="user-row">${pair.map((player) => this.listPlayer(player))}</div>`));
        }
        rows.push(...missing.map((id) => this.notFound(id)));
        return rows;
    }

    private listPlayer(player: Player): TemplateResult {
        const playing = inGame(player);
        const header = player.header;
        return this.target(
            player,
            "",
            html`
                ${
                    playing && this.gameBackground && header && !this.failed.has(header)
                        ? html`<img src=${header} class="row-picture" alt="" @error=${() => this.fail(header)} />`
                        : nothing
                }
                ${this.avatar(player)}
                <div class="details">
                    <div class="name">${displayName(player.entity, this.config?.name_overrides)}</div>
                    ${playing ? this.gameLine(player) : nothing}
                    ${player.entity.state === "offline" ? html`<div class="seen">${this.lastSeen(player)}</div>` : nothing}
                </div>
            `,
        );
    }

    private bigCard(player: Player): TemplateResult {
        const playing = inGame(player);
        const state = player.entity.state === "offline" ? this.lastSeen(player) : this.text(`statuses.${statusOf(player)}`);
        const logo =
            playing && this.gameBackground && player.hero && player.logo && !this.failed.has(player.hero) && !this.failed.has(player.logo);
        return this.target(
            player,
            logo ? "big with-logo" : "big",
            html`
                ${this.gameBackground ? (playing ? this.gameArt(player) : STEAM_LOGO) : nothing} ${this.avatar(player)}
                <div class="details">
                    <div class="name">${displayName(player.entity, this.config?.name_overrides)}</div>
                    <div class="seen">${state}</div>
                    ${playing ? this.gameLine(player) : nothing}
                </div>
            `,
        );
    }

    /**
     * A player's box, answering a tap, a hold and a double tap through Home Assistant's own action handler with
     * the player as the entity. A player that does nothing on a tap isn't offered as a button.
     */
    private target(player: Player, kind: string, body: TemplateResult): TemplateResult {
        const tappable = this.config !== undefined && isTappable(this.config);
        const gestures = this.gesturesFor(player.entity.entity_id);
        return html`<div
            class="player ${kind} ${this.mood(player)}"
            role=${tappable ? "button" : nothing}
            tabindex=${tappable ? "0" : nothing}
            @pointerdown=${(event: PointerEvent) => gestures.pointerDown(event)}
            @pointerup=${() => gestures.pointerUp()}
            @pointercancel=${() => gestures.pointerUp()}
            @pointerleave=${() => gestures.pointerUp()}
            @click=${() => gestures.click()}
            @keydown=${(event: KeyboardEvent) => gestures.key(event)}
        >
            ${body}
        </div>`;
    }

    private gesturesFor(entity: string): GestureDetector {
        let detector = this.gestures.get(entity);
        if (!detector) {
            detector = new GestureDetector(
                () => this.config,
                (gesture) => this.act(entity, gesture),
            );
            this.gestures.set(entity, detector);
        }
        return detector;
    }

    /**
     * The game behind the big card: its wide hero picture, shaded under the text, with its logo at the right.
     * A game without a hero picture gets its own picture dimmed, as before there were any.
     */
    private gameArt(player: Player): TemplateResult | typeof nothing {
        const { hero, logo } = player;
        if (hero && !this.failed.has(hero)) {
            return html`
                <img src=${hero} class="hero" alt="" @error=${() => this.fail(hero)} />
                <div class="shade"></div>
                ${logo && !this.failed.has(logo) ? html`<img src=${logo} class="logo" alt="" @error=${() => this.fail(logo)} />` : nothing}
            `;
        }
        const picture = player.main ?? player.header;
        return picture && !this.failed.has(picture)
            ? html`<img src=${picture} class="big-picture" alt="" @error=${() => this.fail(picture)} />`
            : nothing;
    }

    /** The game with its icon and how long it has been played. Its name opens the game in the Steam store. */
    private gameLine(player: Player): TemplateResult {
        const time = playTime(player.gameSince);
        // The link keeps its own clicks and keys, so opening the store doesn't also fire the player's action
        const name = player.gameId
            ? html`<a
                  class="game-name"
                  href="${STORE_URL}${player.gameId}"
                  target="_blank"
                  rel="noreferrer"
                  @click=${(event: Event) => event.stopPropagation()}
                  @pointerdown=${(event: Event) => event.stopPropagation()}
                  @keydown=${(event: Event) => event.stopPropagation()}
                  >${player.game}</a
              >`
            : html`<span class="game-name">${player.game}</span>`;
        return html`<div class="game">
            ${player.gameIcon ? html`<img src=${player.gameIcon} class="game-icon" alt="" />` : nothing}${name}
            ${time ? html`<span class="play-time">· ${this.duration(time)}</span>` : nothing}
        </div>`;
    }

    /** The avatar, ringed in the colour of the player's state, with their Steam level in the corner. */
    private avatar(player: Player): TemplateResult {
        const picture = avatarUrl(player.entity);
        return html`
            <div class="avatar-wrap">
                ${picture ? html`<img src=${picture} class="avatar" alt="" />` : html`<div class="avatar avatar-blank"></div>`}
                ${
                    player.level === undefined
                        ? nothing
                        : html`<span class="level" title=${this.text("common.level", { level: player.level })}>${player.level}</span>`
                }
            </div>
        `;
    }

    /** The state the card draws a player in: in a game, or whatever Steam says. */
    private mood(player: Player): string {
        return inGame(player) ? `${player.entity.state} ingame` : player.entity.state;
    }

    private notFound(entityId: string | undefined): TemplateResult {
        return html`<div class="not-found">${this.text("common.entity_not_found", { entity: entityId ?? "" })}</div>`;
    }

    private fail(url: string): void {
        this.failed = new Set(this.failed).add(url);
    }

    private act(entity: string, gesture: Gesture): void {
        const { tap_action, hold_action, double_tap_action } = this.config ?? {};
        this.dispatchEvent(
            new CustomEvent("hass-action", {
                detail: { config: { entity, tap_action, hold_action, double_tap_action }, action: gesture },
                bubbles: true,
                composed: true,
            }),
        );
    }

    /** "Seen 5 min ago", or nothing when the player has no such time. */
    private lastSeen(player: Player): string {
        const since = elapsed(player.lastOnline);
        if (!since) {
            return "";
        }
        // "1 day", not "1 days": the units of one have texts of their own
        const unit = since.amount === 1 ? `time_units.one_${since.unit}` : `time_units.${since.unit}`;
        return this.text("common.last_seen", { amount: String(since.amount), unit: this.text(unit) });
    }

    private duration(time: { hours: number; minutes: number }): string {
        if (time.hours === 0) {
            return this.text("common.minutes", { minutes: String(time.minutes) });
        }
        // "2 h", not "2 h 0 min"
        return time.minutes === 0
            ? this.text("common.hours", { hours: String(time.hours) })
            : this.text("common.hours_minutes", { hours: String(time.hours), minutes: String(time.minutes) });
    }

    private text(key: string, values: Record<string, string> = {}): string {
        return Object.entries(values).reduce(
            (text, [name, value]) => text.replace(`{${name}}`, value),
            translate(languageOf(this.hass), key),
        );
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
                container-type: inline-size;
            }

            /* The big card is all one player, so its picture reaches the edges. */
            ha-card.big-card {
                padding: 0;
            }

            .card-header {
                padding: 0 0 8px 0;
                font-size: var(--ha-card-header-font-size, 24px);
                line-height: 1.2;
                overflow-wrap: anywhere;
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
                box-sizing: border-box;
                /* Room below for the level, which hangs off the corner of the avatar. */
                padding: 6px 4px 8px 4px;
                border-radius: 8px;
                overflow: hidden;
            }

            .player[role="button"] {
                cursor: pointer;
            }

            .player:focus-visible {
                outline: 2px solid var(--primary-color);
                outline-offset: -2px;
            }

            /* Narrow: one player a row, so a name and a game get the card's width instead of half of it */
            @container (max-width: 400px) {
                .user-row {
                    flex-direction: column;
                    gap: 0;
                }
                .user-row .player {
                    width: 100%;
                }
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
                z-index: 2;
            }

            .avatar-wrap {
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
                text-align: center;
                font-variant-numeric: tabular-nums;
                /* The digits are centred by their own height, not the line's, with the baseline on a whole pixel */
                text-box: trim-both cap alphabetic;
                padding-top: calc(11px - 1cap);
            }

            .big .level {
                height: 18px;
                min-width: 18px;
                border-radius: 9px;
                font-size: 11px;
                padding-top: calc(12px - 1cap);
            }

            .details {
                min-width: 0;
                flex: 1 1 auto;
            }

            /* Names and games wrap rather than end in an ellipsis */
            .name {
                font-weight: 600;
                overflow-wrap: anywhere;
            }

            .big .name {
                font-size: 18px;
            }

            .seen {
                font-size: 12px;
                color: var(--secondary-text-color);
            }

            /* Inline, so the icon stays with the game's name and only the time wraps to a line of its own */
            .game {
                font-size: 12px;
                overflow-wrap: anywhere;
            }

            .big .game {
                font-size: 14px;
                margin-top: 2px;
            }

            .game-icon {
                width: 16px;
                height: 16px;
                border-radius: 3px;
                margin-right: 4px;
                vertical-align: -3px;
            }

            .big .game-icon {
                width: 20px;
                height: 20px;
                margin-right: 5px;
                vertical-align: -5px;
            }

            a.game-name {
                color: inherit;
                text-decoration: none;
            }

            a.game-name:hover,
            a.game-name:focus-visible {
                text-decoration: underline;
            }

            .play-time {
                white-space: nowrap;
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
            }

            /* A glow in the card's colour keeps the text readable over the picture's own lettering */
            .row-picture ~ .details {
                --halo: var(--card-background-color, var(--ha-card-background, #fff));
                text-shadow:
                    0 0 2px var(--halo),
                    0 0 4px var(--halo),
                    0 0 8px var(--halo);
            }

            /* A game without a hero picture: its own picture, dimmed and faded from the right */
            .big-picture {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0.28;
                z-index: 0;
                mask-image: linear-gradient(to right, transparent, black 60%);
            }

            /* The hero picture across the card. The shade goes by pixels, not percent, so the text is always on
               the card's own colour and the picture shows where the text ends */
            .hero {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: 70% 40%;
                z-index: 0;
            }

            .shade {
                --shade-colour: var(--card-background-color, var(--ha-card-background, #fff));
                position: absolute;
                inset: 0;
                z-index: 1;
                background: linear-gradient(
                    to right,
                    var(--shade-colour) 0,
                    var(--shade-colour) 200px,
                    color-mix(in srgb, var(--shade-colour) 70%, transparent) 290px,
                    transparent 400px
                );
            }

            .logo {
                position: absolute;
                z-index: 1;
                right: 14px;
                top: 50%;
                transform: translateY(-50%);
                height: 72%;
                max-width: 38%;
                object-fit: contain;
                filter: drop-shadow(0 2px 6px rgb(0 0 0 / 0.6));
                pointer-events: none;
            }

            /* The text keeps clear of the logo, which may take up to 38% of the card */
            .big.with-logo .details {
                padding-right: calc(38cqw + 8px);
            }

            /* Narrow: the logo would sit on the name, which says the same */
            @container (max-width: 360px) {
                .logo {
                    display: none;
                }
                .big.with-logo .details {
                    padding-right: 0;
                }
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

            /* Last, so a player in a game is green whatever else Steam says they are, as in their group */
            .ingame {
                --ring: var(--steam-ingame);
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
                overflow-wrap: anywhere;
            }
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "steam-card-compact": SteamCardCompact;
    }
}
