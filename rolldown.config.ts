import path from "node:path";

import { omit } from "remeda";
import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";

const input = {
    common: "src/common/index.ts",
    fs: "src/fs/index.ts",
    result: "src/result/index.ts",
    remeda: "src/remeda/index.ts",
    types: "src/types/index.ts",
    globalTypes: "src/types/global-types.d.ts",
};

export default defineConfig([
    {
        input: omit(input, ["globalTypes"]),

        output: {
            dir: "dist",
            format: "esm",
            hashCharacters: "hex",
            chunkFileNames: "chunks/chunk-[hash].js",
        },

        platform: "node",
        tsconfig: "./tsconfig.json",

        plugins: [
            dts({
                resolve: true,
            }),
            {
                name: "emit-globals-types",
                async buildStart() {
                    this.emitFile({
                        type: "chunk",
                        id: path.resolve(input.globalTypes),
                    });
                },
            },
        ],
    },
]);
