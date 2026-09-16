/** Replaced at build time with the version in package.json. */
declare const __CARD_VERSION__: string;

export const CARD_VERSION = __CARD_VERSION__;

/** Players are grouped by state, in this order. */
export const STATUSES = ['online', 'away', 'snooze', 'offline', 'unavailable'] as const;

export const STEAM_PREFIX = 'sensor.steam_';
