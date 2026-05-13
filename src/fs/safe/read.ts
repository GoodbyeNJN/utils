import fs, { promises as fsp } from "node:fs";

import { parse } from "@/json/safe";
import { Err, Result } from "@/result";

import { parseEncodingOptions } from "../shared/utils";

import { exists, existsSync } from "./exists";

import type { BufferEncodingOptions, PathLike, StringEncodingOptions } from "../shared/types";

const safeReadFile = /* #__PURE__ */ Result.wrap(fsp.readFile, Error);
export async function readFile(
    path: PathLike,
    options: BufferEncodingOptions,
): Promise<Result<Buffer, Error>>;
export async function readFile(
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<Result<string, Error>>;
/* #__NO_SIDE_EFFECTS__ */
export async function readFile(path: any, options?: any): Promise<Result<any, Error>> {
    if (!(await exists(path))) {
        return Err(new Error(`File does not exist: ${path}`));
    }

    const result = await safeReadFile(path, parseEncodingOptions(options));

    return result.context(`Failed to read file: ${path}`);
}

const safeReadFileSync = /* #__PURE__ */ Result.wrap(fs.readFileSync, Error);
export function readFileSync(path: PathLike, options: BufferEncodingOptions): Result<Buffer, Error>;
export function readFileSync(
    path: PathLike,
    options?: StringEncodingOptions,
): Result<string, Error>;
/* #__NO_SIDE_EFFECTS__ */
export function readFileSync(path: any, options?: any): Result<any, Error> {
    if (!existsSync(path)) {
        return Err(new Error(`File does not exist: ${path}`));
    }

    const result = safeReadFileSync(path, parseEncodingOptions(options));

    return result.context(`Failed to read file: ${path}`);
}

/* #__NO_SIDE_EFFECTS__ */
export const readJson = async <T = any>(
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<Result<T, Error>> =>
    Result.gen(async function* () {
        const content = yield* await readFile(path, options);
        if (!content) return Err(new Error(`JSON file is empty: ${path.toString()}`));

        const result = parse<T>(content);

        return result.context(`Failed to parse JSON file: ${path.toString()}`);
    });

/* #__NO_SIDE_EFFECTS__ */
export const readJsonSync = <T = any>(
    path: PathLike,
    options?: StringEncodingOptions,
): Result<T, Error> =>
    Result.gen(function* () {
        const content = yield* readFileSync(path, options);
        if (!content) return Err(new Error(`JSON file is empty: ${path.toString()}`));

        const result = parse<T>(content);

        return result.context(`Failed to parse JSON file: ${path.toString()}`);
    });

/* #__NO_SIDE_EFFECTS__ */
export const readFileByLine = async (
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<Result<AsyncIterable<string>, Error>> => {
    if (!(await exists(path))) {
        return Err(new Error(`File does not exist: ${path.toString()}`));
    }

    const { createInterface } = await import("node:readline");

    const fn = () => {
        const stream = fs.createReadStream(path, {
            ...parseEncodingOptions(options),
            autoClose: true,
        });
        stream.on("error", error => {
            throw error;
        });

        const reader = createInterface({
            input: stream,
            crlfDelay: Infinity,
        });

        return reader;
    };
    const result = Result.try(fn, Error);

    return result.context(`Failed to read file: ${path.toString()}`);
};
