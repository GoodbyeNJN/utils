import fs, { promises as fsp } from "node:fs";
import { dirname } from "node:path";

import { parseEncodingOptions, pathLikeToPath } from "../utils";

import { mkdir, mkdirSync } from "./mkdir";

import type { AppendFileOptions, PathLike } from "../types";

export const appendFile = async (
    path: PathLike,
    data: string,
    options?: AppendFileOptions,
): Promise<void> => {
    const newline = options?.newline ?? true;

    await mkdir(dirname(pathLikeToPath(path).toString()));

    await fsp.appendFile(path, newline ? `\n${data}` : data, parseEncodingOptions(options));
};

export const appendFileSync = (path: PathLike, data: string, options?: AppendFileOptions): void => {
    const newline = options?.newline ?? true;

    mkdirSync(dirname(pathLikeToPath(path).toString()));

    fs.appendFileSync(path, newline ? `\n${data}` : data, parseEncodingOptions(options));
};
