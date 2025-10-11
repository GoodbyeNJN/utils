import fs, { promises as fsp } from "node:fs";
import path, { dirname } from "node:path";

import { safeParse, stringify } from "@/common";
import { isNumber } from "@/remeda";
import { err, ok, Result, safeTry } from "@/result";

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

export const appendFile = async (
    path: PathLike,
    data: string,
    options?: AppendFileOptions,
): Promise<Result<void, Error>> =>
    safeTry(async function* () {
        const newline = options?.newline ?? true;

        yield* await mkdir(dirname(pathLikeToPath(path).toString()));

        const fn = async () => {
            await fsp.appendFile(path, newline ? `\n${data}` : data, parseEncodingOptions(options));
        };
        const result = (await Result.try(fn, Error)).context(`Failed to append file: ${path}`);

        return result;
    });

export const appendFileSync = (
    path: PathLike,
    data: string,
    options?: AppendFileOptions,
): Result<void, Error> =>
    safeTry(function* () {
        const newline = options?.newline ?? true;

        yield* mkdirSync(dirname(pathLikeToPath(path).toString()));

        const fn = () => {
            fs.appendFileSync(path, newline ? `\n${data}` : data, parseEncodingOptions(options));
        };
        const result = Result.try(fn, Error).context(`Failed to append file: ${path}`);

        return result;
    });

export const cp = async (
    source: PathLike,
    destination: PathLike,
    options?: CpOptions,
): Promise<Result<void, Error>> => {
    const { recursive = true } = options || {};

    const fn = async () => {
        await fsp.cp(source, destination, { recursive });
    };
    const result = (await Result.try(fn, Error)).context(
        `Failed to copy path: ${source} to ${destination}`,
    );

    return result;
};

export const cpSync = (
    source: PathLike,
    destination: PathLike,
    options?: CpOptions,
): Result<void, Error> => {
    const { recursive = true } = options || {};

    const fn = () => {
        fs.cpSync(source, destination, { recursive });
    };
    const result = Result.try(fn, Error).context(
        `Failed to copy path: ${source} to ${destination}`,
    );

    return result;
};

export const exists = async (path: PathLike): Promise<Result<true, Error>> => {
    const fn = async () => {
        await fsp.access(path);

        return true as const;
    };
    const result = (await Result.try(fn, Error)).context(
        `Failed to check exists for path: ${path}`,
    );

    return result;
};

export const existsSync = (path: PathLike): Result<true, Error> => {
    const fn = () => {
        fs.accessSync(path);

        return true as const;
    };
    const result = Result.try(fn, Error).context(`Failed to check exists for path: ${path}`);

    return result;
};

export const mkdir = async (
    path: PathLike,
    options?: MkdirOptions,
): Promise<Result<void, Error>> => {
    const { recursive = true } = options || {};

    if ((await exists(path)).isOk()) return ok();

    const fn = async () => {
        await fsp.mkdir(path, { recursive });
    };
    const result = (await Result.try(fn, Error)).context(`Failed to create directory: ${path}`);

    return result;
};

export const mkdirSync = (path: PathLike, options?: MkdirOptions): Result<void, Error> => {
    const { recursive = true } = options || {};

    if (existsSync(path).isOk()) return ok();

    const fn = () => {
        fs.mkdirSync(path, { recursive });
    };
    const result = Result.try(fn, Error).context(`Failed to create directory: ${path}`);

    return result;
};

export async function readFile(
    path: PathLike,
    options: BufferEncodingOptions,
): Promise<Result<Buffer, Error>>;
export async function readFile(
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<Result<string, Error>>;
export async function readFile(path: any, options?: any): Promise<Result<any, Error>> {
    return safeTry(async function* () {
        yield* await exists(path);

        const fn = async () => {
            return await fsp.readFile(path, parseEncodingOptions(options));
        };
        const result = (await Result.try(fn, Error)).context(`Failed to read file: ${path}`);

        return result;
    });
}

export function readFileSync(path: PathLike, options: BufferEncodingOptions): Result<Buffer, Error>;
export function readFileSync(
    path: PathLike,
    options?: StringEncodingOptions,
): Result<string, Error>;
export function readFileSync(path: any, options?: any): Result<any, Error> {
    return safeTry(function* () {
        yield* existsSync(path);

        const fn = () => {
            return fs.readFileSync(path, parseEncodingOptions(options));
        };
        const result = Result.try(fn, Error).context(`Failed to read file: ${path}`);

        return result;
    });
}

export const readFileByLine = async (
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<Result<AsyncIterator<string>, Error>> =>
    safeTry(async function* () {
        yield* await exists(path);

        const { createInterface } = await import("node:readline");

        const fn = () => {
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
        const result = Result.try(fn, Error).context(`Failed to read file: ${path}`);

        return result;
    });

export const readJson = async <T = any>(
    path: PathLike,
    options?: StringEncodingOptions,
): Promise<Result<T, Error>> =>
    safeTry(async function* () {
        const content = yield* await readFile(path, options);
        if (!content) return err(new Error(`JSON file is empty: ${path}`));

        const result = safeParse<T>(content).context(`Failed to parse JSON file: ${path}`);

        return result;
    });

export const readJsonSync = <T = any>(
    path: PathLike,
    options?: StringEncodingOptions,
): Result<T, Error> =>
    safeTry(function* () {
        const content = yield* readFileSync(path, options);
        if (!content) return err(new Error(`JSON file is empty: ${path}`));

        const result = safeParse<T>(content).context(`Failed to parse JSON file: ${path}`);

        return result;
    });

export const rm = async (path: PathLike, options?: RmOptions): Promise<Result<void, Error>> => {
    const { force = true, recursive = true } = options || {};

    const fn = async () => {
        await fsp.rm(path, { force, recursive });
    };
    const result = (await Result.try(fn, Error)).context(`Failed to remove path: ${path}`);

    return result;
};

export const rmSync = (path: PathLike, options?: RmOptions): Result<void, Error> => {
    const { force = true, recursive = true } = options || {};

    const fn = () => {
        fs.rmSync(path, { force, recursive });
    };
    const result = Result.try(fn, Error).context(`Failed to remove path: ${path}`);

    return result;
};

export const writeFile = async (
    path: PathLike,
    data: string,
    options?: StringEncodingOptions,
): Promise<Result<void, Error>> =>
    safeTry(async function* () {
        yield* await mkdir(dirname(pathLikeToPath(path).toString()));

        const fn = async () => {
            await fsp.writeFile(path, data, parseEncodingOptions(options));
        };
        const result = (await Result.try(fn, Error)).context(`Failed to write file: ${path}`);

        return result;
    });

export const writeFileSync = (
    path: PathLike,
    data: string,
    options?: StringEncodingOptions,
): Result<void, Error> => {
    const fn = () => {
        fs.writeFileSync(path, data, parseEncodingOptions(options));
    };
    const result = Result.try(fn, Error).context(`Failed to write file: ${path}`);

    return result;
};

export const writeJson = async (
    path: PathLike,
    data: any,
    indentOrOptions?: WriteJsonOptions,
): Promise<Result<void, Error>> => {
    const { indent, encoding } = parseWriteJsonOptions(indentOrOptions);

    const content = stringify(data, null, indent) ?? "";

    return writeFile(path, content, encoding);
};

export const writeJsonSync = (
    path: PathLike,
    data: any,
    indentOrOptions?: WriteJsonOptions,
): Result<void, Error> => {
    const { indent, encoding } = parseWriteJsonOptions(indentOrOptions);

    const content = stringify(data, null, indent) ?? "";

    return writeFileSync(path, content, encoding);
};
