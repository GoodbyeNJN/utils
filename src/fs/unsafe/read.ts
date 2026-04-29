import fs, { promises as fsp } from "node:fs";

import { parse } from "@/json/unsafe";
import { None, Option, Some } from "@/option";

import { parseEncodingOptions } from "../shared/utils";

import { exists, existsSync } from "./exists";

import type { BufferEncodingOptions, PathLike, StringEncodingOptions } from "../shared/types";

export async function readFile(
    path: PathLike,
    options: BufferEncodingOptions,
): Promise<Option<Buffer>>;
export async function readFile(
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<Option<string>>;
/* #__NO_SIDE_EFFECTS__ */
export async function readFile(path: any, options?: any): Promise<any> {
    if (!(await exists(path))) return None();

    try {
        return Some(await fsp.readFile(path, parseEncodingOptions(options)));
    } catch {
        return None();
    }
}

export function readFileSync(path: PathLike, options: BufferEncodingOptions): Option<Buffer>;
export function readFileSync(path: PathLike, options?: StringEncodingOptions): Option<string>;
/* #__NO_SIDE_EFFECTS__ */
export function readFileSync(path: any, options?: any): any {
    if (!existsSync(path)) return None();

    try {
        return Some(fs.readFileSync(path, parseEncodingOptions(options)));
    } catch {
        return None();
    }
}

/* #__NO_SIDE_EFFECTS__ */
export const readJson = async <T = any>(
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<Option<T>> =>
    Option.gen(async function* () {
        const content = yield* await readFile(path, options);
        if (!content) return None();

        return parse<T>(content);
    });

/* #__NO_SIDE_EFFECTS__ */
export const readJsonSync = <T = any>(path: PathLike, options?: StringEncodingOptions): Option<T> =>
    Option.gen(function* () {
        const content = yield* readFileSync(path, options);
        if (!content) return None();

        return parse<T>(content);
    });

/* #__NO_SIDE_EFFECTS__ */
export const readFileByLine = async (
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<AsyncIterable<string> | null> => {
    if (!(await exists(path))) return null;

    const { createInterface } = await import("node:readline");

    try {
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
    } catch {
        return null;
    }
};
