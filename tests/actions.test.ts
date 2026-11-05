import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GestureDetector } from "../src/actions";
import type { Gesture } from "../src/actions";
import type { SteamCardCompactConfig } from "../src/types";

const LEFT = { button: 0 } as PointerEvent;

function detector(config: Partial<SteamCardCompactConfig>): { gestures: Gesture[]; detect: GestureDetector } {
    const gestures: Gesture[] = [];
    const detect = new GestureDetector(
        () => ({ type: "custom:steam-card-compact", ...config }),
        (gesture) => gestures.push(gesture),
    );
    return { gestures, detect };
}

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
});

describe("gestures", () => {
    it("answer a tap at once when there is no double tap to wait for", () => {
        const { gestures, detect } = detector({});
        detect.click();
        expect(gestures).toEqual(["tap"]);
    });

    it("wait 250 ms for a second tap when a double tap does something", () => {
        const { gestures, detect } = detector({ double_tap_action: { action: "toggle" } });
        detect.click();
        vi.advanceTimersByTime(249);
        expect(gestures).toEqual([]);
        vi.advanceTimersByTime(1);
        expect(gestures).toEqual(["tap"]);
    });

    it("make two quick taps one double tap, and no tap", () => {
        const { gestures, detect } = detector({ double_tap_action: { action: "toggle" } });
        detect.click();
        vi.advanceTimersByTime(200);
        detect.click();
        vi.runAllTimers();
        expect(gestures).toEqual(["double_tap"]);
    });

    it("hold after 500 ms, and the click that ends the hold taps nothing", () => {
        const { gestures, detect } = detector({ hold_action: { action: "toggle" } });
        detect.pointerDown(LEFT);
        vi.advanceTimersByTime(500);
        detect.pointerUp();
        detect.click();
        expect(gestures).toEqual(["hold"]);
        detect.click();
        expect(gestures).toEqual(["hold", "tap"]);
    });

    it("tap when let go before the hold", () => {
        const { gestures, detect } = detector({ hold_action: { action: "toggle" } });
        detect.pointerDown(LEFT);
        vi.advanceTimersByTime(499);
        detect.pointerUp();
        detect.click();
        vi.runAllTimers();
        expect(gestures).toEqual(["tap"]);
    });

    it("wait for nothing once disposed", () => {
        const { gestures, detect } = detector({ hold_action: { action: "toggle" }, double_tap_action: { action: "toggle" } });
        detect.pointerDown(LEFT);
        detect.click();
        detect.dispose();
        vi.runAllTimers();
        expect(gestures).toEqual([]);
    });
});
