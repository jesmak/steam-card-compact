/** Replaced at build time with the version in package.json. */
declare const __CARD_VERSION__: string;

export const CARD_VERSION = __CARD_VERSION__;

/** Players are grouped in this order: those in a game first, then by the state Steam reports. */
export const STATUSES = [
    "ingame",
    "online",
    "busy",
    "looking_to_play",
    "looking_to_trade",
    "away",
    "snooze",
    "offline",
    "unavailable",
] as const;

export const STEAM_PREFIX = "sensor.steam_";

/** A game's page in the Steam store, opened from the game's name. */
export const STORE_URL = "https://store.steampowered.com/app/";
