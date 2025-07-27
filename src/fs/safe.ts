import fs, { promises as fsp } from "node:fs";
import path, { dirname } from "node:path";

import { errorToMessage } from "@/common";
import { isNumber } from "@/remeda";
import { err, fromAsyncThrowable, fromThrowable, ok, safeTry } from "@/result";

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
import type { Result, ResultAsync } from "@/result";

const pathLikeToPath = (pathLike: PathLike) =>
    path.resolve(pathLike instanceof URL ? pathLike.pathname : pathLike);

const parseEncodingOptions = (
    options?: BufferEncodingOptions | StringEncodingOptions,
): StringEncodingOptions => {
    const encoding = options?.encoding || "utf-8";

    return encoding === "buffer" ? {} : { encoding };
};

const parseWriteJsonOptions = (options?: WriteJsonOptions) => {
    if (isNumber(options)) {
        return { indent: options, encoding: parseEncodingOptions() };
    }

    return { indent: options?.indent ?? 2, encoding: parseEncodingOptions(options) };
};

export const appendFile = (
    path: PathLike,
    data: string,
    options?: AppendFileOptions,
): ResultAsync<void, string> =>
    safeTry(async function* () {
        const newline = options?.newline ?? true;

        yield* mkdir(dirname(pathLikeToPath(path).toString()));

        const fn = fromAsyncThrowable(
            fsp.appendFile,
            errorToMessage(`Failed to append file: ${path}`),
        );
        const result = fn(path, newline ? `\n${data}` : data, parseEncodingOptions(options));

        return result;
    });

export const appendFileSync = (
    path: PathLike,
    data: string,
    options?: AppendFileOptions,
): Result<void, string> =>
    safeTry(function* () {
        const newline = options?.newline ?? true;

        yield* mkdirSync(dirname(pathLikeToPath(path).toString()));

        const fn = fromThrowable(
            fs.appendFileSync,
            errorToMessage(`Failed to append file: ${path}`),
        );
        const result = fn(path, newline ? `\n${data}` : data, parseEncodingOptions(options));

        return result;
    });

export const cp = (
    source: PathLike,
    destination: PathLike,
    options?: CpOptions,
): ResultAsync<void, string> => {
    const { recursive = true } = options || {};

    const fn = fromAsyncThrowable(
        fsp.cp,
        errorToMessage(`Failed to copy path: ${source} to ${destination}`),
    );
    const result = fn(source, destination, { recursive });

    return result;
};

export const cpSync = (
    source: PathLike,
    destination: PathLike,
    options?: CpOptions,
): Result<void, string> => {
    const { recursive = true } = options || {};

    const fn = fromThrowable(
        fs.cpSync,
        errorToMessage(`Failed to copy path: ${source} to ${destination}`),
    );
    const result = fn(source, destination, { recursive });

    return result;
};

export const exists = (path: PathLike): ResultAsync<true, string> => {
    const fn = fromAsyncThrowable(
        fsp.access,
        errorToMessage(`Failed to check exists of path: ${path}`),
    );
    const result = fn(path);

    return result.map(() => true as const);
};

export const existsSync = (path: PathLike): Result<true, string> => {
    const fn = fromThrowable(
        fs.accessSync,
        errorToMessage(`Failed to check exists of path: ${path}`),
    );
    const result = fn(path);

    return result.map(() => true as const);
};

export const mkdir = (path: PathLike, options?: MkdirOptions): ResultAsync<void, string> => {
    const { recursive = true } = options || {};

    const fn = fromAsyncThrowable(
        () => fsp.mkdir(path, { recursive }) as Promise<void>,
        errorToMessage(`Failed to create directory: ${path}`),
    );

    return exists(path).and(ok()).or(fn());
};

export const mkdirSync = (path: PathLike, options?: MkdirOptions): Result<void, string> => {
    const { recursive = true } = options || {};

    const fn = fromThrowable(
        () => fs.mkdirSync(path, { recursive }) as void,
        errorToMessage(`Failed to create directory: ${path}`),
    );

    return existsSync(path).and(ok()).or(fn());
};

export function readFile(
    path: PathLike,
    options: BufferEncodingOptions,
): ResultAsync<Buffer, string>;
export function readFile(
    path: PathLike,
    options?: StringEncodingOptions,
): ResultAsync<string, string>;
export function readFile(path: any, options?: any): ResultAsync<any, string> {
    const fn = fromAsyncThrowable(
        (): Promise<any> => fsp.readFile(path, parseEncodingOptions(options)),
        errorToMessage(`Failed to read file: ${path}`),
    );

    return exists(path).and(fn());
}

export function readFileSync(
    path: PathLike,
    options: BufferEncodingOptions,
): Result<Buffer, string>;
export function readFileSync(
    path: PathLike,
    options?: StringEncodingOptions,
): Result<string, string>;
export function readFileSync(path: any, options?: any): Result<any, string> {
    const fn = fromThrowable(
        (): any => fs.readFileSync(path, parseEncodingOptions(options)),
        errorToMessage(`Failed to read file: ${path}`),
    );

    return existsSync(path).and(fn());
}

export const readFileByLine = (
    path: PathLike,
    options?: StringEncodingOptions,
): ResultAsync<AsyncIterator<string>, string> => {
    const reader = async () => {
        const { createInterface } = await import("node:readline");

        const stream = fs.createReadStream(path, {
            ...parseEncodingOptions(options),
            autoClose: true,
        });
        stream.on("error", error => {
            throw error;
        });

        const reader = createInterface({
            input: stream,
            crlfDelay: Infinity,
        });

        return reader[Symbol.asyncIterator]();
    };
    const fn = fromAsyncThrowable(reader, errorToMessage(`Failed to read file: ${path}`));

    return exists(path).and(fn());
};

export const readJson = <T = any>(
    path: PathLike,
    options?: StringEncodingOptions,
): ResultAsync<T, string> => {
    const fn = fromThrowable(JSON.parse, errorToMessage(`Failed to parse JSON file: ${path}`));

    return readFile(path, options).andThen(content => {
        if (!content) return err(`JSON file is empty: ${path}`);

        const result = fn(content);

        return result;
    });
};

export const readJsonSync = <T = any>(
    path: PathLike,
    options?: StringEncodingOptions,
): Result<T, string> => {
    const fn = fromThrowable(JSON.parse, errorToMessage(`Failed to parse JSON file: ${path}`));

    return readFileSync(path, options).andThen(content => {
        if (!content) return err(`JSON file is empty: ${path}`);

        const result = fn(content);

        return result;
    });
};

export const rm = (path: PathLike, options?: RmOptions): ResultAsync<void, string> => {
    const { force = true, recursive = true } = options || {};

    const fn = fromAsyncThrowable(fsp.rm, errorToMessage(`Failed to remove path: ${path}`));
    const result = fn(path, { force, recursive });

    return result;
};

export const rmSync = (path: PathLike, options?: RmOptions): Result<void, string> => {
    const { force = true, recursive = true } = options || {};

    const fn = fromThrowable(fs.rmSync, errorToMessage(`Failed to remove path: ${path}`));
    const result = fn(path, { force, recursive });

    return result;
};

export const writeFile = (
    path: PathLike,
    data: string,
    options?: StringEncodingOptions,
): ResultAsync<void, string> => {
    const fn = fromAsyncThrowable(fsp.writeFile, errorToMessage(`Failed to write file: ${path}`));

    return mkdir(dirname(pathLikeToPath(path).toString())).and(
        fn(path, data, parseEncodingOptions(options)),
    );
};

export const writeFileSync = (
    path: PathLike,
    data: string,
    options?: StringEncodingOptions,
): Result<void, string> => {
    const fn = fromThrowable(fs.writeFileSync, errorToMessage(`Failed to write file: ${path}`));

    return mkdirSync(dirname(pathLikeToPath(path).toString())).and(
        fn(path, data, parseEncodingOptions(options)),
    );
};

export const writeJson = (
    path: PathLike,
    data: any,
    indentOrOptions?: WriteJsonOptions,
): ResultAsync<void, string> => {
    const { indent, encoding } = parseWriteJsonOptions(indentOrOptions);

    const content = JSON.stringify(data, null, indent);

    return writeFile(path, content, encoding);
};

export const writeJsonSync = (
    path: PathLike,
    data: any,
    indentOrOptions?: WriteJsonOptions,
): Result<void, string> => {
    const { indent, encoding } = parseWriteJsonOptions(indentOrOptions);

    const content = JSON.stringify(data, null, indent);

    return writeFileSync(path, content, encoding);
};
