import path from "node:path";
import url from "node:url";

import { isNumber } from "@/remeda";

import type { EncodingOptions, PathLike, StringEncodingOptions, WriteJsonOptions } from "./types";

export const pathLikeToPath = (pathLike: PathLike) =>
    path.resolve(pathLike instanceof URL ? url.fileURLToPath(pathLike) : pathLike);

export const parseEncodingOptions = (options?: EncodingOptions): StringEncodingOptions => {
    const encoding = options?.encoding || "utf-8";

    return encoding === "buffer" ? {} : { encoding };
};

export const parseWriteJsonOptions = (options?: WriteJsonOptions) => {
    if (isNumber(options)) {
        return { indent: options, encoding: parseEncodingOptions() };
    }

    return { indent: options?.indent ?? 2, encoding: parseEncodingOptions(options) };
};
