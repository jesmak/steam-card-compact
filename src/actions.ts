/**
 * Tap, hold and double tap. The card only tells which one happened; Home Assistant's own action handler,
 * listening for `hass-action`, reads the configuration and does the rest, with more-info as its default.
 */
import type { ActionConfig } from "./hass";
import type { SteamCardCompactConfig } from "./types";

export type Gesture = "tap" | "hold" | "double_tap";

const HOLD_MS = 500;
const DOUBLE_TAP_MS = 250;

/** An action that does something: one that is missing or `none` does nothing. */
export function hasAction(action: ActionConfig | undefined): boolean {
    return action !== undefined && action.action !== "none";
}

/** Whether tapping does anything: it opens more-info unless told otherwise. */
export function isTappable(config: SteamCardCompactConfig): boolean {
    return config.tap_action === undefined || hasAction(config.tap_action);
}

/**
 * Turns pointer and key events into gestures. A hold or double tap is only waited for when the card has an
 * action for it, so a plain tap answers at once.
 */
export class GestureDetector {
    private holdTimer?: ReturnType<typeof setTimeout>;
    private tapTimer?: ReturnType<typeof setTimeout>;
    private held = false;

    constructor(
        private readonly config: () => SteamCardCompactConfig | undefined,
        private readonly fire: (gesture: Gesture) => void,
    ) {}

    public pointerDown(event: PointerEvent): void {
        this.held = false;
        clearTimeout(this.holdTimer);
        // A right-click opens the context menu, which takes the pointerup, so it would end up as a hold
        if (event.button === 0 && hasAction(this.config()?.hold_action)) {
            this.holdTimer = setTimeout(() => {
                this.held = true;
                this.fire("hold");
            }, HOLD_MS);
        }
    }

    public pointerUp(): void {
        clearTimeout(this.holdTimer);
    }

    public click(): void {
        if (this.held) {
            this.held = false;
            return;
        }
        if (!hasAction(this.config()?.double_tap_action)) {
            this.fire("tap");
            return;
        }
        if (this.tapTimer !== undefined) {
            clearTimeout(this.tapTimer);
            this.tapTimer = undefined;
            this.fire("double_tap");
            return;
        }
        this.tapTimer = setTimeout(() => {
            this.tapTimer = undefined;
            this.fire("tap");
        }, DOUBLE_TAP_MS);
    }

    public key(event: KeyboardEvent): void {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            this.fire("tap");
        }
    }

    public dispose(): void {
        clearTimeout(this.holdTimer);
        clearTimeout(this.tapTimer);
        this.tapTimer = undefined;
    }
}
