import fs, { promises as fsp } from "node:fs";

import { Result } from "@/result";

import type { CpOptions, PathLike } from "../types";

const safeCp = /* #__PURE__ */ Result.wrap(fsp.cp, Error);
export const cp = async (
    source: PathLike,
    destination: PathLike,
    options?: CpOptions,
): Promise<Result<void, Error>> => {
    const { recursive = true } = options || {};

    const result = await safeCp(source, destination, { recursive });

    return result.context(`Failed to copy path: ${source} to ${destination}`);
};

const safeCpSync = /* #__PURE__ */ Result.wrap(fs.cpSync, Error);
export const cpSync = (
    source: PathLike,
    destination: PathLike,
    options?: CpOptions,
): Result<void, Error> => {
    const { recursive = true } = options || {};

    const result = safeCpSync(source, destination, { recursive });

    return result.context(`Failed to copy path: ${source} to ${destination}`);
};
