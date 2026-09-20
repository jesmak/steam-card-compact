import { beforeEach, describe, expect, it, vi } from 'vitest';

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
    expect(root.querySelectorAll('.player')).toHaveLength(2);
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
    expect(root.querySelector('.name')?.textContent).toContain('ABC-MAN');
  });

  it('finds every Steam player by itself when asked to', async () => {
    const state = hass(
      player('sensor.steam_abc'),
      player('sensor.steam_def'),
      // A player the integration named after them, and something else entirely.
      player('sensor.pok25', { level: 12, last_online: '2026-09-18T19:47:44+00:00' }),
      player('sensor.other'),
    );
    const root = shadow(await card(state, { auto_populate: true }));
    expect(root.querySelectorAll('.player')).toHaveLength(3);
  });

  it('leaves out the game picture when it is turned off', async () => {
    const state = hass(player('sensor.steam_abc', { game: 'Factorio', game_image_header: '/game.jpg' }));
    const root = shadow(await card(state, { entity: ['sensor.steam_abc'], game_background: false }));
    expect(root.querySelector('img.row-picture')).toBeNull();
    expect(root.textContent).toContain('Factorio');
  });
});

describe('the single player card', () => {
  it('is drawn for one named player', async () => {
    const state = hass(player('sensor.steam_abc', { state: 'offline', level: 42, last_online: 1789430400 }));
    const root = shadow(await card(state, { entity: 'sensor.steam_abc' }));

    expect(root.querySelector('.player.big')).not.toBeNull();
    expect(root.querySelector('.level')?.textContent).toContain('42');
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
    expect(root.querySelectorAll('.player')).toHaveLength(1);
    expect(root.querySelector('.not-found')?.textContent).toContain('sensor.steam_gone');
  });
});

describe('every state Steam reports', () => {
  it('has a group of its own', async () => {
    const state = hass(
      player('sensor.steam_a', { state: 'busy' }),
      player('sensor.steam_b', { state: 'looking_to_play' }),
      player('sensor.steam_c', { state: 'looking_to_trade' }),
      player('sensor.steam_d', { state: 'snooze' }),
    );
    const root = shadow(await card(state, { auto_populate: true }));
    const groups = [...root.querySelectorAll('.status-category')].map((node) => node.textContent?.trim());
    expect(groups).toEqual(['Busy', 'Looking to play', 'Looking to trade', 'Snoozing']);
    expect(root.querySelectorAll('.player')).toHaveLength(4);
  });
});

describe('the game', () => {
  it('is shown with its icon, and opens the store without opening more-info', async () => {
    const opened: string[] = [];
    const openWindow = vi.spyOn(window, 'open').mockImplementation((url) => {
      opened.push(String(url));
      return null;
    });
    const moreInfo: string[] = [];
    const state = hass(
      player('sensor.steam_abc', { game: 'Factorio', game_id: '427520', game_icon: '/icon.jpg' }),
    );
    const element = await card(state, { entity: ['sensor.steam_abc'] });
    element.addEventListener('hass-more-info', () => moreInfo.push('opened'));
    const root = shadow(element);

    expect(root.querySelector('img.game-icon')?.getAttribute('src')).toBe('/icon.jpg');
    (root.querySelector('.game') as HTMLElement).dispatchEvent(new Event('click', { bubbles: true }));

    expect(opened).toEqual(['https://store.steampowered.com/app/427520']);
    // The click on the game must not reach the player under it.
    expect(moreInfo).toHaveLength(0);
    openWindow.mockRestore();
  });

  it('stays quiet when the game has no id', async () => {
    const openWindow = vi.spyOn(window, 'open').mockImplementation(() => null);
    const state = hass(player('sensor.steam_abc', { game: 'Factorio' }));
    const root = shadow(await card(state, { entity: ['sensor.steam_abc'] }));
    (root.querySelector('.game') as HTMLElement).dispatchEvent(new Event('click', { bubbles: true }));
    expect(openWindow).not.toHaveBeenCalled();
    openWindow.mockRestore();
  });
});

describe('the layout', () => {
  it('draws the big card for one named player, as it always did', async () => {
    const root = shadow(await card(hass(player('sensor.steam_abc')), { entity: 'sensor.steam_abc' }));
    expect(root.querySelector('.player.big')).not.toBeNull();
  });

  it('lists a single player when the list is asked for', async () => {
    const root = shadow(
      await card(hass(player('sensor.steam_abc')), { entity: 'sensor.steam_abc', layout: 'list' }),
    );
    expect(root.querySelector('.player.big')).toBeNull();
    expect(root.querySelectorAll('.player')).toHaveLength(1);
  });

  it('draws the big card of the first player when one player is asked for', async () => {
    const state = hass(player('sensor.steam_abc'), player('sensor.steam_def'));
    const root = shadow(
      await card(state, { entity: ['sensor.steam_abc', 'sensor.steam_def'], layout: 'player' }),
    );
    expect(root.querySelector('.player.big')).not.toBeNull();
    expect(root.querySelectorAll('.player')).toHaveLength(1);
  });
});

describe('the game picture', () => {
  it('is drawn behind the big card without being asked for', async () => {
    const state = hass(
      player('sensor.steam_abc', {
        game: 'Factorio',
        game_image_main: '/main.jpg',
        game_image_header: '/h.jpg',
      }),
    );
    const root = shadow(await card(state, { entity: 'sensor.steam_abc' }));
    // The sharper of the two pictures the integration gives.
    expect(root.querySelector('img.big-picture')?.getAttribute('src')).toBe('/main.jpg');
  });

  it('falls back to the Steam logo when a player is in no game', async () => {
    const root = shadow(await card(hass(player('sensor.steam_abc')), { entity: 'sensor.steam_abc' }));
    expect(root.querySelector('img.big-picture')).toBeNull();
    const logo = root.querySelector('.steam-game-default-bg svg.steam-logo');
    expect(logo).not.toBeNull();
    // Kept whole inside its box, so the word is never cut off at the card's edge.
    expect(logo?.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet');
  });

  it('is left out of the big card when it is turned off', async () => {
    const state = hass(player('sensor.steam_abc', { game: 'Factorio', game_image_main: '/main.jpg' }));
    const root = shadow(await card(state, { entity: 'sensor.steam_abc', game_background: false }));
    expect(root.querySelector('img.big-picture')).toBeNull();
    expect(root.querySelector('.steam-game-default-bg')).toBeNull();
  });
});

describe('the level', () => {
  it('fits three digits', async () => {
    const root = shadow(
      await card(hass(player('sensor.steam_abc', { level: 123 })), { entity: 'sensor.steam_abc' }),
    );
    expect(root.querySelector('.level')?.textContent?.trim()).toBe('123');
  });

  it('is left out for a player who has none', async () => {
    const root = shadow(await card(hass(player('sensor.steam_abc')), { entity: 'sensor.steam_abc' }));
    expect(root.querySelector('.level')).toBeNull();
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
