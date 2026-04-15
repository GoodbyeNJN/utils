import fs, { promises as fsp } from "node:fs";

import type { CpOptions, PathLike } from "../types";

export const cp = async (
    source: PathLike,
    destination: PathLike,
    options?: CpOptions,
): Promise<void> => {
    const { recursive = true } = options || {};

    await fsp.cp(source, destination, { recursive });
};

export const cpSync = (source: PathLike, destination: PathLike, options?: CpOptions): void => {
    const { recursive = true } = options || {};

    fs.cpSync(source, destination, { recursive });
};
