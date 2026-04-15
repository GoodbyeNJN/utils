import fs, { promises as fsp } from "node:fs";

import { isNil, nil } from "@/common";
import { parse } from "@/json/unsafe";

import { parseEncodingOptions } from "../utils";

import { exists, existsSync } from "./exists";

import type { BufferEncodingOptions, PathLike, StringEncodingOptions } from "../types";
import type { Nil } from "@/common";

export async function readFile(
    path: PathLike,
    options: BufferEncodingOptions,
): Promise<Buffer | Nil>;
export async function readFile(
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<string | Nil>;
export async function readFile(path: any, options?: any): Promise<any> {
    if (!(await exists(path))) return nil;

    try {
        return await fsp.readFile(path, parseEncodingOptions(options));
    } catch {
        return nil;
    }
}

export function readFileSync(path: PathLike, options: BufferEncodingOptions): Buffer | Nil;
export function readFileSync(path: PathLike, options?: StringEncodingOptions): string | Nil;
export function readFileSync(path: any, options?: any): any {
    if (!existsSync(path)) return nil;

    try {
        return fs.readFileSync(path, parseEncodingOptions(options));
    } catch {
        return nil;
    }
}

export const readJson = async <T = any>(
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<T | Nil> => {
    const content = await readFile(path, options);
    if (isNil(content)) return nil;

    return parse<T>(content);
};

export const readJsonSync = <T = any>(path: PathLike, options?: StringEncodingOptions): T | Nil => {
    const content = readFileSync(path, options);
    if (isNil(content)) return nil;

    return parse<T>(content);
};

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
