import fs, { promises as fsp } from "node:fs";

import type { PathLike, RmOptions } from "../types";

export const rm = async (path: PathLike, options?: RmOptions): Promise<void> => {
    const { force = true, recursive = true } = options || {};

    await fsp.rm(path, { force, recursive });
};

export const rmSync = (path: PathLike, options?: RmOptions): void => {
    const { force = true, recursive = true } = options || {};

    fs.rmSync(path, { force, recursive });
};
