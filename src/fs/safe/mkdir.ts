import fs, { promises as fsp } from "node:fs";

import { ok, Result } from "@/result";

import { exists, existsSync } from "./exists";

import type { MkdirOptions, PathLike } from "../types";

const safeMkdir = Result.wrap(fsp.mkdir, Error);
export const mkdir = async (
    path: PathLike,
    options?: MkdirOptions,
): Promise<Result<void, Error>> => {
    const { recursive = true } = options || {};

    if (await exists(path)) return ok();

    const result = await safeMkdir(path, { recursive });

    return result.and(ok()).context(`Failed to create directory: ${path}`);
};

const safeMkdirSync = Result.wrap(fs.mkdirSync, Error);
export const mkdirSync = (path: PathLike, options?: MkdirOptions): Result<void, Error> => {
    const { recursive = true } = options || {};

    if (existsSync(path)) return ok();

    const result = safeMkdirSync(path, { recursive });

    return result.and(ok()).context(`Failed to create directory: ${path}`);
};
