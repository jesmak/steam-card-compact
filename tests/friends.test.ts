import { describe, expect, it } from 'vitest';

import {
  avatarUrl,
  displayName,
  elapsed,
  groupByStatus,
  isSteamPlayer,
  pairs,
  sortByName,
  steamPlayers,
} from '../src/friends';
import type { HassEntity } from '../src/hass';

function player(values: Partial<HassEntity> & { name?: string } = {}): HassEntity {
  const { name, ...rest } = values;
  return {
    entity_id: 'sensor.steam_one',
    state: 'online',
    attributes: { friendly_name: name ?? 'One' },
    ...rest,
  } as HassEntity;
}

describe('what a player is called', () => {
  it('is the name the configuration gives', () => {
    const entity = player({ entity_id: 'sensor.steam_abc', name: 'Friendly' });
    expect(displayName(entity, [{ entity: 'sensor.steam_abc', name: 'ABC-MAN' }])).toBe('ABC-MAN');
  });

  it('is the entity’s own name when the configuration says nothing', () => {
    expect(displayName(player({ name: 'Friendly' }), [])).toBe('Friendly');
    expect(displayName(player({ name: 'Friendly' }), undefined)).toBe('Friendly');
  });

  it('falls back to the entity id when there is no name at all', () => {
    const entity = { entity_id: 'sensor.steam_x', state: 'online', attributes: {} } as HassEntity;
    expect(displayName(entity, undefined)).toBe('sensor.steam_x');
  });

  it('orders players by the name that is shown', () => {
    const one = player({ entity_id: 'sensor.steam_a', name: 'Zeta' });
    const other = player({ entity_id: 'sensor.steam_b', name: 'Alpha' });
    const overrides = [{ entity: 'sensor.steam_a', name: 'Aaa' }];
    expect(sortByName([one, other], overrides).map((entity) => entity.entity_id)).toEqual([
      'sensor.steam_a',
      'sensor.steam_b',
    ]);
  });

  it('leaves the given list alone', () => {
    const list = [player({ entity_id: 'b', name: 'B' }), player({ entity_id: 'a', name: 'A' })];
    sortByName(list, undefined);
    expect(list[0].entity_id).toBe('b');
  });
});

describe('grouping players', () => {
  it('puts each player under their state', () => {
    const groups = groupByStatus([player(), player({ entity_id: 'x', state: 'offline' })]);
    expect(Object.keys(groups).sort()).toEqual(['offline', 'online']);
  });

  it('treats a state the card does not know as unavailable', () => {
    expect(groupByStatus([player({ state: 'confused' })])).toHaveProperty('unavailable');
  });

  it('lists two players per row', () => {
    const list = [player(), player(), player()];
    expect(pairs(list).map((row) => row.length)).toEqual([2, 1]);
    expect(pairs(undefined)).toEqual([]);
  });
});

describe('how long ago something was', () => {
  const now = Date.parse('2026-09-16T12:00:00Z');

  it.each([
    ['2026-09-16T11:59:30Z', 30, 'seconds'],
    ['2026-09-16T11:30:00Z', 30, 'minutes'],
    ['2026-09-16T06:00:00Z', 6, 'hours'],
    ['2026-09-13T12:00:00Z', 3, 'days'],
    ['2026-08-16T12:00:00Z', 4, 'weeks'],
  ])('reads %s as %i %s', (time, amount, unit) => {
    expect(elapsed(time, now)).toEqual({ amount, unit });
  });

  it('reads a unix timestamp too, as the Steam integration sends', () => {
    expect(elapsed(Date.parse('2026-09-16T11:00:00Z') / 1000, now)).toEqual({ amount: 1, unit: 'hours' });
  });

  it('gives nothing when there is no usable time', () => {
    expect(elapsed(undefined, now)).toBeUndefined();
    expect(elapsed('', now)).toBeUndefined();
    expect(elapsed('not a date', now)).toBeUndefined();
  });

  it('never counts backwards', () => {
    expect(elapsed('2026-09-16T12:30:00Z', now)).toEqual({ amount: 0, unit: 'seconds' });
  });
});

describe('the picture of a player', () => {
  it('is asked for at full size', () => {
    const entity = player({
      attributes: { entity_picture: '/api/image/steam_medium.jpg' },
    } as Partial<HassEntity>);
    expect(avatarUrl(entity)).toBe('/api/image/steam_full.jpg');
  });

  it('is nothing when the player has none', () => {
    expect(avatarUrl(player())).toBeUndefined();
  });
});

describe('finding the Steam players', () => {
  const steam = (id: string, attributes: Record<string, unknown> = {}) => ({
    entity_id: id,
    state: 'online',
    attributes,
  });

  it('knows a player named sensor.steam_*', () => {
    expect(isSteamPlayer(steam('sensor.steam_abc'))).toBe(true);
  });

  it('knows a player the integration named after them, by what Steam reports', () => {
    // The integration names a player added later sensor.<name>, with no steam_ in it.
    expect(isSteamPlayer(steam('sensor.pok25', { options: ['offline', 'online', 'looking_to_trade'] }))).toBe(
      true,
    );
    expect(
      isSteamPlayer(steam('sensor.leetify', { level: 12, last_online: '2026-09-18T19:47:44+00:00' })),
    ).toBe(true);
  });

  it('leaves everything else alone', () => {
    expect(isSteamPlayer(steam('sensor.kitchen_temperature', { level: 3 }))).toBe(false);
    expect(isSteamPlayer(steam('light.steam_room'))).toBe(false);
    expect(isSteamPlayer(undefined)).toBe(false);
  });

  it('lists them in order', () => {
    const states = {
      'sensor.steam_abc': steam('sensor.steam_abc'),
      'sensor.pok25': steam('sensor.pok25', { level: 12, last_online: '2026-09-18T19:47:44+00:00' }),
      'sensor.kitchen': steam('sensor.kitchen'),
    };
    expect(steamPlayers(states)).toEqual(['sensor.pok25', 'sensor.steam_abc']);
  });
});
