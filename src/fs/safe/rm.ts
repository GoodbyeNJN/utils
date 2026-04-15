import fs, { promises as fsp } from "node:fs";

import { Result } from "@/result";

import type { PathLike, RmOptions } from "../types";

const safeRm = Result.wrap(fsp.rm, Error);
export const rm = async (path: PathLike, options?: RmOptions): Promise<Result<void, Error>> => {
    const { force = true, recursive = true } = options || {};

    const result = await safeRm(path, { force, recursive });

    return result.context(`Failed to remove path: ${path}`);
};

const safeRmSync = Result.wrap(fs.rmSync, Error);
export const rmSync = (path: PathLike, options?: RmOptions): Result<void, Error> => {
    const { force = true, recursive = true } = options || {};

    const result = safeRmSync(path, { force, recursive });

    return result.context(`Failed to remove path: ${path}`);
};
