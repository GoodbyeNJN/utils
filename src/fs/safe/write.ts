import fs, { promises as fsp } from "node:fs";
import { dirname } from "node:path";

import { stringify } from "@/json/safe";
import { Result } from "@/result";

import { parseEncodingOptions, parseWriteJsonOptions, pathLikeToPath } from "../utils";

import { mkdir, mkdirSync } from "./mkdir";

import type { PathLike, StringEncodingOptions, WriteJsonOptions } from "../types";

const safeWriteFile = Result.wrap(fsp.writeFile, Error);
export const writeFile = async (
    path: PathLike,
    data: string,
    options?: StringEncodingOptions,
): Promise<Result<void, Error>> =>
    Result.gen(async function* () {
        yield* await mkdir(dirname(pathLikeToPath(path).toString()));

        const result = await safeWriteFile(path, data, parseEncodingOptions(options));

        return result.context(`Failed to write file: ${path}`);
    });

const safeWriteFileSync = Result.wrap(fs.writeFileSync, Error);
export const writeFileSync = (
    path: PathLike,
    data: string,
    options?: StringEncodingOptions,
): Result<void, Error> =>
    Result.gen(function* () {
        yield* mkdirSync(dirname(pathLikeToPath(path).toString()));

        const result = safeWriteFileSync(path, data, parseEncodingOptions(options));

        return result.context(`Failed to write file: ${path}`);
    });

export const writeJson = async (
    path: PathLike,
    data: any,
    indentOrOptions?: WriteJsonOptions,
): Promise<Result<void, Error>> =>
    Result.gen(async function* () {
        const { indent, encoding } = parseWriteJsonOptions(indentOrOptions);

        const content = yield* stringify(data, null, indent);

        return writeFile(path, content, encoding);
    });

export const writeJsonSync = (
    path: PathLike,
    data: any,
    indentOrOptions?: WriteJsonOptions,
): Result<void, Error> =>
    Result.gen(function* () {
        const { indent, encoding } = parseWriteJsonOptions(indentOrOptions);

        const content = yield* stringify(data, null, indent);

        return writeFileSync(path, content, encoding);
    });
