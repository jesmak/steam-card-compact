import { describe, expect, it } from 'vitest';

import { translate } from '../src/localize';

describe('texts', () => {
  it('are in the viewer’s language', () => {
    expect(translate('fi', 'statuses.online')).toBe('Paikalla');
    expect(translate('en', 'statuses.online')).toBe('Online');
  });

  it('cover every unit of time the card can show', () => {
    for (const unit of ['seconds', 'minutes', 'hours', 'days', 'weeks']) {
      expect(translate('en', `time_units.${unit}`), unit).not.toBe(`time_units.${unit}`);
      expect(translate('fi', `time_units.${unit}`), unit).not.toBe(`time_units.${unit}`);
    }
  });

  it('fall back to English for a language that has no translation', () => {
    expect(translate('sv', 'statuses.away')).toBe('Away');
  });

  it('give back the key when there is no such text', () => {
    expect(translate('en', 'common.nothing_here')).toBe('common.nothing_here');
  });
});
