import { beforeEach, describe, expect, it } from 'vitest';

import { steamEntities } from '../src/editor';
import type { SteamCardCompactEditor } from '../src/editor';
import type { HassEntity, HomeAssistant } from '../src/hass';
import type { SteamCardCompactConfig } from '../src/types';

function player(id: string): HassEntity {
  return { entity_id: id, state: 'online', attributes: {} };
}

const hass: HomeAssistant = {
  locale: { language: 'en' },
  states: {
    'sensor.steam_abc': player('sensor.steam_abc'),
    'sensor.steam_def': player('sensor.steam_def'),
    'sensor.kitchen': player('sensor.kitchen'),
  },
};

async function editor(config: Partial<SteamCardCompactConfig> = {}): Promise<SteamCardCompactEditor> {
  const element = document.createElement('steam-card-compact-editor') as SteamCardCompactEditor;
  element.setConfig({ type: 'custom:steam-card-compact', entity: ['sensor.steam_abc'], ...config } as never);
  element.hass = hass;
  document.body.append(element);
  await element.updateComplete;
  return element;
}

function form(
  element: SteamCardCompactEditor,
): HTMLElement & { schema: Array<Record<string, unknown>>; data: Record<string, unknown> } {
  const found = element.shadowRoot?.querySelector('ha-form');
  if (!found) {
    throw new Error('the editor rendered no form');
  }
  return found as HTMLElement & { schema: Array<Record<string, unknown>>; data: Record<string, unknown> };
}

function changesOf(element: SteamCardCompactEditor): SteamCardCompactConfig[] {
  const changes: SteamCardCompactConfig[] = [];
  element.addEventListener('config-changed', (event) => {
    changes.push((event as CustomEvent<{ config: SteamCardCompactConfig }>).detail.config);
  });
  return changes;
}

function change(element: SteamCardCompactEditor, value: Record<string, unknown>): void {
  form(element).dispatchEvent(new CustomEvent('value-changed', { detail: { value } }));
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('the visual editor', () => {
  it('asks for the players, the layout, a title and the game picture', async () => {
    const names = form(await editor()).schema.map((entry) => entry.name);
    expect(names).toEqual(['entity', 'auto_populate', 'layout', 'title', 'game_background']);
  });

  it('offers the Steam players and nothing else', async () => {
    expect(steamEntities(hass)).toEqual(['sensor.steam_abc', 'sensor.steam_def']);
    const [entity] = form(await editor()).schema;
    expect(entity.selector).toEqual({
      entity: {
        multiple: true,
        domain: 'sensor',
        include_entities: ['sensor.steam_abc', 'sensor.steam_def'],
      },
    });
  });

  it('leaves the players out when every player is listed by itself', async () => {
    const names = form(await editor({ auto_populate: true, entity: undefined })).schema.map(
      (entry) => entry.name,
    );
    expect(names).not.toContain('entity');
  });

  it('shows one player as a list, the way the picker works', async () => {
    expect(form(await editor({ entity: 'sensor.steam_abc' })).data.entity).toEqual(['sensor.steam_abc']);
  });

  it('keeps one player as one player', async () => {
    const element = await editor();
    const changes = changesOf(element);
    change(element, { type: 'custom:steam-card-compact', entity: ['sensor.steam_abc'] });
    expect(changes[0].entity).toBe('sensor.steam_abc');
  });

  it('keeps a list a list when the list layout is chosen', async () => {
    const element = await editor({ layout: 'list' });
    const changes = changesOf(element);
    change(element, { type: 'custom:steam-card-compact', entity: ['sensor.steam_abc'], layout: 'list' });
    expect(changes[0].entity).toEqual(['sensor.steam_abc']);
  });

  it('keeps the defaults and an empty title out of the configuration', async () => {
    const element = await editor();
    const changes = changesOf(element);
    change(element, {
      type: 'custom:steam-card-compact',
      entity: ['sensor.steam_abc', 'sensor.steam_def'],
      layout: 'auto',
      game_background: true,
      auto_populate: false,
      title: '',
    });
    expect(changes[0]).toEqual({
      type: 'custom:steam-card-compact',
      entity: ['sensor.steam_abc', 'sensor.steam_def'],
    });
  });

  it('drops the players when every player is listed by itself', async () => {
    const element = await editor();
    const changes = changesOf(element);
    change(element, {
      type: 'custom:steam-card-compact',
      entity: ['sensor.steam_abc'],
      auto_populate: true,
    });
    expect(changes[0]).toEqual({ type: 'custom:steam-card-compact', auto_populate: true });
  });
});
