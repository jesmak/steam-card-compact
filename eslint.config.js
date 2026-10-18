import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import tseslint from "typescript-eslint";

export default defineConfig([
    // What git ignores (caches, downloads, scratch scripts) is no code of the repo's. dist/ is ignored on top, as a card
    // keeps its build in git.
    includeIgnoreFile(path.join(import.meta.dirname, ".gitignore")),
    globalIgnores(["dist/", "node_modules/"]),
    js.configs.recommended,
    tseslint.configs.recommended,
    {
        files: ["scripts/**/*.mjs"],
        languageOptions: { globals: { console: "readonly", URL: "readonly" } },
    },
]);
