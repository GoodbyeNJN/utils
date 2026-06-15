import { readFile } from "node:fs/promises";

import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";

import { dependencies } from "./package.json";

export default defineConfig({
    input: {
        "exec/index": "src/exec/unsafe/index.ts",
        "exec/safe": "src/exec/safe/index.ts",
        "fp/index": "src/fp/index.ts",
        "fs/index": "src/fs/unsafe/index.ts",
        "fs/safe": "src/fs/safe/index.ts",
        "json/index": "src/json/unsafe.ts",
        "json/safe": "src/json/safe.ts",
        "option/index": "src/option/index.ts",
        "result/index": "src/result/index.ts",
        index: "src/tools/index.ts",
        types: "src/types/index.ts",
    },

    output: {
        dir: "dist",
        cleanDir: true,
        format: "esm",
        hashCharacters: "hex",
        chunkFileNames: "chunks/chunk-[hash].js",
        comments: {
            annotation: true,
            jsdoc: false,
            legal: false,
        },
    },

    external: Object.keys(dependencies),
    platform: "node",

    plugins: [
        dts({
            tsgo: true,
            tsconfig: "tsconfig.build.json",
        }),
        {
            name: "emit-globals-types",
            async buildEnd() {
                this.emitFile({
                    type: "prebuilt-chunk",
                    fileName: "global-types.d.ts",
                    code: await readFile("src/types/global-types.d.ts", "utf-8"),
                });
            },
        },
        {
            name: "delete-types-js",
            generateBundle(_, bundle) {
                for (const fileName of Object.keys(bundle)) {
                    if (fileName === "types.js") {
                        delete bundle[fileName];
                    }
                }
            },
        },
    ],
});
