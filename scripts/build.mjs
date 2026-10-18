/**
 * Bundles src/ into the single file HACS installs: dist/steam-card-compact.js
 *
 * lit is bundled; Home Assistant doesn't hand cards a copy of it. The output is
 * not minified, so anyone can read what runs in their browser.
 */
import { build } from "esbuild";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * esbuild's stand-in for the `import.meta.glob` of vite, which the tests run on: an eager glob of the
 * files in one folder, such as `import.meta.glob('./languages/*.json', { eager: true, import: 'default' })`,
 * becomes an import of each file. This is what lets a language be added by adding its file alone.
 */
const importGlob = {
    name: "import-glob",
    setup(build) {
        build.onLoad({ filter: /\.ts$/ }, async ({ path }) => {
            const source = await readFile(path, "utf8");
            const call = /import\.meta\.glob(?:<[^(]*>)?\(\s*["']\.\/([\w/-]+)\/\*(\.\w+)["'][^)]*\)/g;
            if (!call.test(source)) {
                return undefined;
            }
            const imports = [];
            const contents = await replaceAsync(source, call, async (_match, folder, extension) => {
                const files = (await readdir(join(dirname(path), folder))).filter((file) => file.endsWith(extension)).sort();
                const entries = files.map((file) => {
                    const name = `__glob${imports.length}`;
                    imports.push(`import ${name} from './${folder}/${file}';`);
                    return `'./${folder}/${file}': ${name}`;
                });
                return `{ ${entries.join(", ")} }`;
            });
            return { contents: `${imports.join("\n")}\n${contents}`, loader: "ts" };
        });
    },
};

async function replaceAsync(text, pattern, replacer) {
    const parts = [];
    let last = 0;
    for (const match of text.matchAll(new RegExp(pattern.source, "g"))) {
        parts.push(text.slice(last, match.index), await replacer(...match));
        last = match.index + match[0].length;
    }
    return parts.join("") + text.slice(last);
}

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

await build({
    entryPoints: ["src/steam-card-compact.ts"],
    outfile: "dist/steam-card-compact.js",
    bundle: true,
    format: "esm",
    target: "es2020",
    minify: false,
    legalComments: "none",
    banner: {
        js: `/*! ${packageJson.name} ${packageJson.version} | MIT License */`,
    },
    define: {
        __CARD_VERSION__: JSON.stringify(packageJson.version),
    },
    plugins: [importGlob],
    logLevel: "info",
});

// A glob the plugin missed would leave the card without its languages, and only a browser would notice.
if ((await readFile("dist/steam-card-compact.js", "utf8")).includes("import.meta.glob")) {
    throw new Error("import.meta.glob was left in the bundle: the import-glob plugin did not match it");
}
