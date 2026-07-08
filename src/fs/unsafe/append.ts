import fs, { promises as fsp } from "node:fs";
import { dirname } from "node:path";

import { parseEncodingOptions, pathLikeToPath } from "../shared/utils";
import { mkdir, mkdirSync } from "./mkdir";

import type { AppendFileOptions, BufferEncodingOptions, PathLike } from "../shared/types";
import type { SetReturnType } from "@/types";

type AppendFile = {
    (path: PathLike, data: Buffer, options?: BufferEncodingOptions): Promise<void>;
    (path: PathLike, data: string, options?: AppendFileOptions): Promise<void>;
};

type AppendFileSync = SetReturnType<AppendFile, void>;

export const appendFile: AppendFile = async (
    path: any,
    data: any,
    options?: any,
): Promise<void> => {
    const newline = options?.newline ?? true;

    await mkdir(dirname(pathLikeToPath(path).toString()));

    await fsp.appendFile(path, newline ? `\n${data}` : data, parseEncodingOptions(options));
};

export const appendFileSync: AppendFileSync = (path: any, data: any, options?: any): void => {
    const newline = options?.newline ?? true;

    mkdirSync(dirname(pathLikeToPath(path).toString()));

    fs.appendFileSync(path, newline ? `\n${data}` : data, parseEncodingOptions(options));
};
