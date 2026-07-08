import fs, { promises as fsp } from "node:fs";
import { dirname } from "node:path";

import { Result } from "@/result";

import { parseEncodingOptions, pathLikeToPath } from "../shared/utils";
import { mkdir, mkdirSync } from "./mkdir";

import type { AppendFileOptions, BufferEncodingOptions, PathLike } from "../shared/types";

type AppendFile = {
    (path: PathLike, data: Buffer, options?: BufferEncodingOptions): Promise<Result<void, Error>>;
    (path: PathLike, data: string, options?: AppendFileOptions): Promise<Result<void, Error>>;
    (
        path: PathLike,
        data: string | Buffer,
        options?: AppendFileOptions | BufferEncodingOptions,
    ): Promise<Result<void, Error>>;
};

type AppendFileSync = {
    (path: PathLike, data: Buffer, options?: BufferEncodingOptions): Result<void, Error>;
    (path: PathLike, data: string, options?: AppendFileOptions): Result<void, Error>;
    (
        path: PathLike,
        data: string | Buffer,
        options?: AppendFileOptions | BufferEncodingOptions,
    ): Result<void, Error>;
};

const safeAppendFile = /* #__PURE__ */ Result.wrap(fsp.appendFile, Error);
export const appendFile: AppendFile = async (
    path: any,
    data: any,
    options?: any,
): Promise<Result<void, Error>> =>
    Result.gen(async function* () {
        const newline = options?.newline ?? true;

        yield* await mkdir(dirname(pathLikeToPath(path).toString()));

        const result = await safeAppendFile(
            path,
            newline ? `\n${data}` : data,
            parseEncodingOptions(options),
        );

        return result.context(`Failed to append file: ${path.toString()}`);
    });

const safeAppendFileSync = /* #__PURE__ */ Result.wrap(fs.appendFileSync, Error);
export const appendFileSync: AppendFileSync = (
    path: any,
    data: any,
    options?: any,
): Result<void, Error> =>
    Result.gen(function* () {
        const newline = options?.newline ?? true;

        yield* mkdirSync(dirname(pathLikeToPath(path).toString()));

        const result = safeAppendFileSync(
            path,
            newline ? `\n${data}` : data,
            parseEncodingOptions(options),
        );

        return result.context(`Failed to append file: ${path.toString()}`);
    });
