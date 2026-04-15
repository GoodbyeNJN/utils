import fs, { promises as fsp } from "node:fs";

import { exists, existsSync } from "./exists";

import type { MkdirOptions, PathLike } from "../types";

export const mkdir = async (path: PathLike, options?: MkdirOptions): Promise<void> => {
    const { recursive = true } = options || {};

    if (await exists(path)) return;

    await fsp.mkdir(path, { recursive });
};

export const mkdirSync = (path: PathLike, options?: MkdirOptions): void => {
    const { recursive = true } = options || {};

    if (existsSync(path)) return;

    fs.mkdirSync(path, { recursive });
};
