import { STATUSES } from './const';
import type { HassEntity } from './hass';
import type { NameOverride } from './types';

/** What a player is called: the name the configuration gives, else the entity's own. */
export function displayName(entity: HassEntity, overrides: NameOverride[] | undefined): string {
  const override = overrides?.find((item) => item?.entity === entity.entity_id)?.name;
  return override || String(entity.attributes.friendly_name ?? entity.entity_id);
}

export function sortByName(entities: HassEntity[], overrides: NameOverride[] | undefined): HassEntity[] {
  return [...entities].sort((one, other) =>
    displayName(one, overrides).localeCompare(displayName(other, overrides)),
  );
}

/** The players of each state, in the order the card lists them. */
export function groupByStatus(entities: HassEntity[]): Record<string, HassEntity[]> {
  const groups: Record<string, HassEntity[]> = {};
  for (const entity of entities) {
    const status = STATUSES.includes(entity.state as (typeof STATUSES)[number])
      ? entity.state
      : 'unavailable';
    (groups[status] ??= []).push(entity);
  }
  return groups;
}

/** The list card shows two players per row. */
export function pairs(entities: HassEntity[] | undefined): HassEntity[][] {
  const rows: HassEntity[][] = [];
  for (let index = 0; index < (entities?.length ?? 0); index += 2) {
    rows.push((entities as HassEntity[]).slice(index, index + 2));
  }
  return rows;
}

export interface Elapsed {
  amount: number;
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks';
}

/** How long ago something was, in the largest unit that still counts. */
export function elapsed(time: string | number | undefined, now: number = Date.now()): Elapsed | undefined {
  if (time === undefined || time === null || time === '') {
    return undefined;
  }
  const moment = typeof time === 'number' ? time * 1000 : Date.parse(String(time));
  if (Number.isNaN(moment)) {
    return undefined;
  }

  const seconds = Math.max(0, Math.floor((now - moment) / 1000));
  if (seconds < 60) {
    return { amount: seconds, unit: 'seconds' };
  }
  if (seconds < 3600) {
    return { amount: Math.floor(seconds / 60), unit: 'minutes' };
  }
  if (seconds < 86400) {
    return { amount: Math.floor(seconds / 3600), unit: 'hours' };
  }
  if (seconds < 604800) {
    return { amount: Math.floor(seconds / 86400), unit: 'days' };
  }
  return { amount: Math.floor(seconds / 604800), unit: 'weeks' };
}

/** The full size picture of a player, when they have one. */
export function avatarUrl(entity: HassEntity): string | undefined {
  const picture = entity.attributes.entity_picture;
  return typeof picture === 'string' ? picture.replace('_medium', '_full') : undefined;
}
