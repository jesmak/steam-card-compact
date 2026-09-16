import { defineConfig } from 'vitest/config';

export default defineConfig({
  // The build replaces this with the version from package.json; the tests don't care which.
  define: { __CARD_VERSION__: '"0.0.0-test"' },
  // The card is a custom element, so the tests need a DOM to render into.
  test: { environment: 'happy-dom' },
});
