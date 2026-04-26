import fs, { promises as fsp } from "node:fs";
import { dirname } from "node:path";

import { Result } from "@/result";

import { parseEncodingOptions, pathLikeToPath } from "../utils";

import { mkdir, mkdirSync } from "./mkdir";

import type { AppendFileOptions, PathLike } from "../types";

const safeAppendFile = /* #__PURE__ */ Result.wrap(fsp.appendFile, Error);
export const appendFile = async (
    path: PathLike,
    data: string,
    options?: AppendFileOptions,
): Promise<Result<void, Error>> =>
    Result.gen(async function* () {
        const newline = options?.newline ?? true;

        yield* await mkdir(dirname(pathLikeToPath(path).toString()));

        const result = await safeAppendFile(
            path,
            newline ? `\n${data}` : data,
            parseEncodingOptions(options),
        );

        return result.context(`Failed to append file: ${path}`);
    });

const safeAppendFileSync = /* #__PURE__ */ Result.wrap(fs.appendFileSync, Error);
export const appendFileSync = (
    path: PathLike,
    data: string,
    options?: AppendFileOptions,
): Result<void, Error> =>
    Result.gen(function* () {
        const newline = options?.newline ?? true;

        yield* mkdirSync(dirname(pathLikeToPath(path).toString()));

        const result = safeAppendFileSync(
            path,
            newline ? `\n${data}` : data,
            parseEncodingOptions(options),
        );

        return result.context(`Failed to append file: ${path}`);
    });
