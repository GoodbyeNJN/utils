import fs, { promises as fsp } from "node:fs";

import type { PathLike } from "../types";

export const exists = async (path: PathLike): Promise<boolean> => {
    try {
        await fsp.access(path);

        return true;
    } catch {
        return false;
    }
};

export const existsSync = (path: PathLike): boolean => {
    try {
        fs.accessSync(path);

        return true;
    } catch {
        return false;
    }
};
