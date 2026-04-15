import fs, { promises as fsp } from "node:fs";
import { dirname } from "node:path";

import { isNil } from "@/common";
import { stringify } from "@/json/unsafe";

import { parseEncodingOptions, parseWriteJsonOptions, pathLikeToPath } from "../utils";

import { mkdir, mkdirSync } from "./mkdir";

import type { PathLike, StringEncodingOptions, WriteJsonOptions } from "../types";

export const writeFile = async (
    path: PathLike,
    data: string,
    options?: StringEncodingOptions,
): Promise<void> => {
    await mkdir(dirname(pathLikeToPath(path).toString()));

    await fsp.writeFile(path, data, parseEncodingOptions(options));
};

export const writeFileSync = (
    path: PathLike,
    data: string,
    options?: StringEncodingOptions,
): void => {
    mkdirSync(dirname(pathLikeToPath(path).toString()));

    fs.writeFileSync(path, data, parseEncodingOptions(options));
};

export const writeJson = async (
    path: PathLike,
    data: any,
    indentOrOptions?: WriteJsonOptions,
): Promise<void> => {
    const { indent, encoding } = parseWriteJsonOptions(indentOrOptions);

    const content = stringify(data, null, indent);
    if (isNil(content)) throw new TypeError(`Value cannot be stringified: ${String(data)}`);

    return writeFile(path, content, encoding);
};

export const writeJsonSync = (
    path: PathLike,
    data: any,
    indentOrOptions?: WriteJsonOptions,
): void => {
    const { indent, encoding } = parseWriteJsonOptions(indentOrOptions);

    const content = stringify(data, null, indent);
    if (isNil(content)) throw new TypeError(`Value cannot be stringified: ${String(data)}`);

    return writeFileSync(path, content, encoding);
};
