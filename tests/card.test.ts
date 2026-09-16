import { beforeEach, describe, expect, it } from 'vitest';

import '../src/steam-card-compact';
import type { SteamCardCompact } from '../src/steam-card-compact';
import type { HassEntity, HomeAssistant } from '../src/hass';
import type { SteamCardCompactConfig } from '../src/types';

function player(id: string, values: Partial<HassEntity['attributes']> & { state?: string } = {}): HassEntity {
  const { state = 'online', ...attributes } = values;
  return {
    entity_id: id,
    state,
    attributes: { friendly_name: id.replace('sensor.steam_', ''), ...attributes },
  };
}

function hass(...players: HassEntity[]): HomeAssistant {
  return {
    locale: { language: 'en' },
    states: Object.fromEntries(players.map((entity) => [entity.entity_id, entity])),
  };
}

async function card(
  state: HomeAssistant,
  config: Partial<SteamCardCompactConfig>,
): Promise<SteamCardCompact> {
  const element = document.createElement('steam-card-compact') as SteamCardCompact;
  element.setConfig({ type: 'custom:steam-card-compact', ...config } as never);
  element.hass = state;
  document.body.append(element);
  await element.updateComplete;
  return element;
}

function shadow(element: SteamCardCompact): ShadowRoot {
  const root = element.shadowRoot;
  if (!root) {
    throw new Error('the card rendered nothing');
  }
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('the list card', () => {
  it('lists the players it was given, grouped by what they are doing', async () => {
    const state = hass(
      player('sensor.steam_abc', { game: 'Factorio' }),
      player('sensor.steam_def', { state: 'offline', last_online: '2026-09-15T12:00:00Z' }),
    );
    const root = shadow(await card(state, { entity: ['sensor.steam_abc', 'sensor.steam_def'] }));

    const groups = [...root.querySelectorAll('.status-category')].map((node) => node.textContent?.trim());
    expect(groups).toEqual(['Online', 'Offline']);
    expect(root.querySelectorAll('.steam-multi')).toHaveLength(2);
    expect(root.textContent).toContain('Factorio');
  });

  it('shows the title it was given', async () => {
    const root = shadow(
      await card(hass(player('sensor.steam_abc')), { entity: ['sensor.steam_abc'], title: 'Steam buddies' }),
    );
    expect(root.querySelector('.card-header')?.textContent).toContain('Steam buddies');
  });

  it('uses the names the configuration gives', async () => {
    const root = shadow(
      await card(hass(player('sensor.steam_abc')), {
        entity: ['sensor.steam_abc'],
        name_overrides: [{ entity: 'sensor.steam_abc', name: 'ABC-MAN' }],
      }),
    );
    expect(root.querySelector('.steam-username')?.textContent).toContain('ABC-MAN');
  });

  it('finds every Steam player by itself when asked to', async () => {
    const state = hass(player('sensor.steam_abc'), player('sensor.steam_def'), player('sensor.other'));
    const root = shadow(await card(state, { auto_populate: true }));
    expect(root.querySelectorAll('.steam-multi')).toHaveLength(2);
  });

  it('leaves out the game picture when it is turned off', async () => {
    const state = hass(player('sensor.steam_abc', { game: 'Factorio', game_image_header: '/game.jpg' }));
    const root = shadow(await card(state, { entity: ['sensor.steam_abc'], game_background: false }));
    expect(root.querySelector('img.steam-game-bg')).toBeNull();
    expect(root.textContent).toContain('Factorio');
  });
});

describe('the single player card', () => {
  it('is drawn for one named player', async () => {
    const state = hass(player('sensor.steam_abc', { state: 'offline', level: 42, last_online: 1789430400 }));
    const root = shadow(await card(state, { entity: 'sensor.steam_abc' }));

    expect(root.querySelector('.single-card-container')).not.toBeNull();
    expect(root.querySelector('.steam-level-text')?.textContent).toContain('42');
    expect(root.textContent).toContain('Offline for');
  });

  it('says how long ago a player was seen, in a unit that has a translation', async () => {
    const seconds = new Date(Date.now() - 30_000).toISOString();
    const state = hass(player('sensor.steam_abc', { state: 'offline', last_online: seconds }));
    const root = shadow(await card(state, { entity: 'sensor.steam_abc' }));
    expect(root.textContent).not.toContain('time_units');
  });
});

describe('when a player is missing', () => {
  it('names the entity instead of breaking the card', async () => {
    const root = shadow(await card(hass(), { entity: 'sensor.steam_gone' }));
    expect(root.querySelector('.not-found')?.textContent).toContain('sensor.steam_gone');
  });

  it('still lists the players that are there', async () => {
    const root = shadow(
      await card(hass(player('sensor.steam_abc')), { entity: ['sensor.steam_abc', 'sensor.steam_gone'] }),
    );
    expect(root.querySelectorAll('.steam-multi')).toHaveLength(1);
    expect(root.querySelector('.not-found')?.textContent).toContain('sensor.steam_gone');
  });
});

describe('the configuration', () => {
  it('needs either players or auto_populate', () => {
    const element = document.createElement('steam-card-compact') as SteamCardCompact;
    expect(() => element.setConfig({ type: 'custom:steam-card-compact' } as never)).toThrow();
  });

  it('is happy with auto_populate alone', () => {
    const element = document.createElement('steam-card-compact') as SteamCardCompact;
    expect(() =>
      element.setConfig({ type: 'custom:steam-card-compact', auto_populate: true } as never),
    ).not.toThrow();
  });
});
