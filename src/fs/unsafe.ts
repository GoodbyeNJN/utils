import {
    appendFile as safeAppendFile,
    appendFileSync as safeAppendFileSync,
    cp as safeCp,
    cpSync as safeCpSync,
    exists as safeExists,
    existsSync as safeExistsSync,
    mkdir as safeMkdir,
    mkdirSync as safeMkdirSync,
    readFile as safeReadFile,
    readFileByLine as safeReadFileByLine,
    readFileSync as safeReadFileSync,
    readJson as safeReadJson,
    readJsonSync as safeReadJsonSync,
    rm as safeRm,
    rmSync as safeRmSync,
    writeFile as safeWriteFile,
    writeFileSync as safeWriteFileSync,
    writeJson as safeWriteJson,
    writeJsonSync as safeWriteJsonSync,
} from "./safe";

import type {
    AppendFileOptions,
    BufferEncodingOptions,
    CpOptions,
    MkdirOptions,
    PathLike,
    RmOptions,
    StringEncodingOptions,
    WriteJsonOptions,
} from "./types";

export const appendFile = async (
    path: PathLike,
    data: string,
    options?: AppendFileOptions,
): Promise<void> => {
    await safeAppendFile(path, data, options);
};

export const appendFileSync = (path: PathLike, data: string, options?: AppendFileOptions): void => {
    safeAppendFileSync(path, data, options);
};

export const cp = async (
    source: PathLike,
    destination: PathLike,
    options?: CpOptions,
): Promise<void> => {
    await safeCp(source, destination, options);
};

export const cpSync = (source: PathLike, destination: PathLike, options?: CpOptions): void => {
    safeCpSync(source, destination, options);
};

export const exists = async (path: PathLike): Promise<boolean> => {
    const result = await safeExists(path);

    return result.isOk();
};

export const existsSync = (path: PathLike): boolean => {
    const result = safeExistsSync(path);

    return result.isOk();
};

export const mkdir = async (path: PathLike, options?: MkdirOptions): Promise<void> => {
    await safeMkdir(path, options);
};

export const mkdirSync = (path: PathLike, options?: MkdirOptions): void => {
    safeMkdirSync(path, options);
};

export async function readFile(
    path: PathLike,
    options: BufferEncodingOptions,
): Promise<Buffer | undefined>;
export async function readFile(
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<string | undefined>;
export async function readFile(path: any, options?: any): Promise<any> {
    const result = await safeReadFile(path, options);
    if (result.isErr()) return undefined;

    return result.unwrap();
}

export function readFileSync(path: PathLike, options: BufferEncodingOptions): Buffer | undefined;
export function readFileSync(path: PathLike, options?: StringEncodingOptions): string | undefined;
export function readFileSync(path: any, options?: any): any {
    const result = safeReadFileSync(path, options);
    if (result.isErr()) return undefined;

    return result.unwrap();
}

export const readFileByLine = async (
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<AsyncIterable<string> | undefined> => {
    const result = await safeReadFileByLine(path, options);
    if (result.isErr()) return undefined;

    return result.unwrap();
};

export const readJson = async <T = any>(
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<T | undefined> => {
    const result = await safeReadJson(path, options);
    if (result.isErr()) return undefined;

    return result.unwrap();
};

export const readJsonSync = <T = any>(
    path: PathLike,
    options?: StringEncodingOptions,
): T | undefined => {
    const result = safeReadJsonSync(path, options);
    if (result.isErr()) return undefined;

    return result.unwrap();
};

export const rm = async (path: PathLike, options?: RmOptions): Promise<void> => {
    await safeRm(path, options);
};

export const rmSync = (path: PathLike, options?: RmOptions): void => {
    safeRmSync(path, options);
};

export const writeFile = async (
    path: PathLike,
    data: string,
    options?: StringEncodingOptions,
): Promise<void> => {
    await safeWriteFile(path, data, options);
};

export const writeFileSync = (
    path: PathLike,
    data: string,
    options?: StringEncodingOptions,
): void => {
    safeWriteFileSync(path, data, options);
};

export const writeJson = async (
    path: PathLike,
    data: any,
    indentOrOptions?: WriteJsonOptions,
): Promise<void> => {
    await safeWriteJson(path, data, indentOrOptions);
};

export const writeJsonSync = (
    path: PathLike,
    data: any,
    indentOrOptions?: WriteJsonOptions,
): void => {
    safeWriteJsonSync(path, data, indentOrOptions);
};
