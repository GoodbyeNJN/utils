import fsp from "node:fs/promises";
import path from "node:path";

import { omit } from "remeda";
import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";

import type { PreRenderedChunk } from "rolldown";

const input = {
    index: "src/common/index.ts",
    fs: "src/fs/index.ts",
    result: "src/result/index.ts",
    remeda: "src/remeda/index.ts",
    types: "src/types/index.ts",
    globalTypes: "src/types/global-types.d.ts",
};
const output = "dist";

const genChunkName = (chunk: PreRenderedChunk) => {
    const entry = chunk.moduleIds.at(-1);
    if (!entry) {
        console.warn("⚠️", "Could not determine chunk name for:", chunk);
        return "[name]-[hash].js";
    }

    const isDependency = entry.includes("/node_modules/");
    const isSourceCode = entry.includes("/src/");

    let name;
    for (const dirname of entry.split("/").toReversed().slice(1)) {
        if ((isDependency && dirname === "node_modules") || (isSourceCode && dirname === "src")) {
            break;
        }

        name = dirname;
    }

    if (!name) {
        console.warn("⚠️", "Could not determine chunk name for:", chunk);
        return "[name]-[hash].js";
    }

    return `libs/${name}-[hash].js`;
};

export default defineConfig([
    {
        input: omit(input, ["types", "globalTypes"]),

        output: {
            dir: output,
            format: "esm",
            hashCharacters: "hex",
            chunkFileNames: genChunkName,
        },

        platform: "node",
        resolve: { tsconfigFilename: "tsconfig.json" },
    },

    {
        input: omit(input, ["globalTypes"]),

        output: {
            dir: output,
            format: "esm",
            hashCharacters: "hex",
            chunkFileNames: genChunkName,
        },

        platform: "node",
        resolve: { tsconfigFilename: "tsconfig.json" },

        plugins: [
            dts({
                resolve: true,
                emitDtsOnly: true,
            }),
            {
                name: "emit-globals-types",
                async generateBundle() {
                    this.emitFile({
                        type: "asset",
                        fileName: path.basename(input.globalTypes),
                        originalFileName: path.resolve(input.globalTypes),
                        source: await fsp.readFile(input.globalTypes, "utf-8"),
                    });
                },
            },
        ],
    },
]);
