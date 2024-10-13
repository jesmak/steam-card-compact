import * as en from './languages/en.json';
import * as fi from './languages/fi.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const languages: any = {
  en: en,
  fi: fi,
};

export function localize(string: string, search = '', replace = ''): string {
  let lang = localStorage.getItem('selectedLanguage')?.replace(/['"]+/g, '').replace('-', '_');
  if (!lang || lang === 'null') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hass = (document.querySelector('home-assistant') as any).hass;
    lang = hass.selectedLanguage || hass.language || 'en';
  }

  let translated: string;

  try {
    translated = string.split('.').reduce((o, i) => o[i], languages[lang as string]);
  } catch (e) {
    translated = string.split('.').reduce((o, i) => o[i], languages['en']);
  }

  if (translated === undefined) translated = string.split('.').reduce((o, i) => o[i], languages['en']);

  if (search !== '' && replace !== '') {
    translated = translated.replace(search, replace);
  }
  return translated;
}
