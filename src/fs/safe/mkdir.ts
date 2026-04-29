import fs, { promises as fsp } from "node:fs";

import { Ok, Result } from "@/result";

import { exists, existsSync } from "./exists";

import type { MkdirOptions, PathLike } from "../shared/types";

const safeMkdir = /* #__PURE__ */ Result.wrap(fsp.mkdir, Error);
export const mkdir = async (
    path: PathLike,
    options?: MkdirOptions,
): Promise<Result<void, Error>> => {
    const { recursive = true } = options || {};

    if (await exists(path)) return Ok();

    const result = await safeMkdir(path, { recursive });

    return result.and(Ok()).context(`Failed to create directory: ${path}`);
};

const safeMkdirSync = /* #__PURE__ */ Result.wrap(fs.mkdirSync, Error);
export const mkdirSync = (path: PathLike, options?: MkdirOptions): Result<void, Error> => {
    const { recursive = true } = options || {};

    if (existsSync(path)) return Ok();

    const result = safeMkdirSync(path, { recursive });

    return result.and(Ok()).context(`Failed to create directory: ${path}`);
};
