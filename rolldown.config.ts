import { readFile } from "node:fs/promises";

import { omit } from "remeda";
import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";

import { dependencies } from "./package.json";

const input = {
    common: "src/common/index.ts",
    exec: "src/exec/index.ts",
    fs: "src/fs/index.ts",
    glob: "src/glob/index.ts",
    json: "src/json/index.ts",
    remeda: "src/remeda/index.ts",
    result: "src/result/index.ts",
    types: "src/types/index.ts",
    globalTypes: "src/types/global-types.d.ts",
};

export default defineConfig([
    {
        input: omit(input, ["globalTypes"]),

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
            dts(),
            {
                name: "emit-globals-types",
                async buildEnd() {
                    this.emitFile({
                        type: "prebuilt-chunk",
                        fileName: "global-types.d.ts",
                        code: await readFile(input.globalTypes, "utf-8"),
                    });
                },
            },
        ],
    },
]);
