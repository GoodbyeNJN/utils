import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import type { BaseProcessOptions, SpawnOptions } from "./types";

export interface NormalizedSpawnCommand {
    command: string;
    args: readonly string[];
    options: SpawnOptions;
}

const pathLikeRegexp = /^path$/i;
const shebangRegExp = /^#!\s*(.+)/;
const windowsExecutableRegExp = /\.(?:com|exe)$/i;
const nodeModulesCmdRegExp = /node_modules[\\/]\.bin[\\/][^\\/]+\.cmd$/i;
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

const getEnvPaths = (env: NodeJS.ProcessEnv) => {
    let key = "PATH";
    let paths: string[] = [];
    for (const [k, v] of Object.entries(env)) {
        if (pathLikeRegexp.test(k)) {
            key = k;
            paths = v ? v.split(path.delimiter) : [];
            break;
        }
    }

    return { key, paths };
};

const combineEnv = (cwd: string, env?: NodeJS.ProcessEnv, useNodeModulesBin?: boolean) => {
    const combined: Record<string, string | undefined> = {
        ...process.env,
        ...env,
    };
    if (!useNodeModulesBin) return combined;

    const { key, paths } = getEnvPaths(combined);

    let currentPath = cwd;
    let lastPath: string;
    do {
        paths.push(path.resolve(currentPath, "node_modules", ".bin"));

        lastPath = currentPath;
        currentPath = path.dirname(currentPath);
    } while (currentPath !== lastPath);

    combined[key] = paths.join(path.delimiter);

    return combined;
};

const combineSignals = (signals: Iterable<AbortSignal>) => {
    const controller = new AbortController();

    for (const signal of signals) {
        if (signal.aborted) {
            controller.abort();

            return signal;
        }

        const onAbort = () => {
            controller.abort(signal.reason);
        };
        signal.addEventListener("abort", onAbort, {
            signal: controller.signal,
        });
    }

    return controller.signal;
};

const resolveCommandFile = (command: string, options: SpawnOptions) => {
    const cwd = options.cwd?.toString() ?? process.cwd();
    const env = options.env ?? process.env;

    const paths =
        command.includes("/") || command.includes("\\") ? [""] : [cwd, ...getEnvPaths(env).paths];
    const pathExts = env.PATHEXT
        ? env.PATHEXT.split(path.delimiter)
        : [".EXE", ".CMD", ".BAT", ".COM"];

    if (command.includes(".") && pathExts[0] !== "") {
        pathExts.unshift("");
    }

    for (const envPath of paths) {
        const unquoted =
            envPath.startsWith('"') && envPath.endsWith('"') && envPath.length > 1
                ? envPath.slice(1, -1)
                : envPath;
        const resolvedPath = path.resolve(cwd, unquoted, command);

        for (const ext of pathExts) {
            const filepath = resolvedPath + ext;

            try {
                if (fs.statSync(filepath).isFile()) {
                    return filepath;
                }
            } catch {}
        }
    }

    return null;
};

export const normalizeSpawnCommand = (
    command: string,
    args: readonly string[] = [],
    options: SpawnOptions = {},
): NormalizedSpawnCommand => {
    // Early return if use `shell` option or not on Windows.
    if (options.shell === true || process.platform !== "win32") {
        return { command, args, options };
    }

    let normalizedCommand = command;
    let normalizedArgs = [...args];
    let normalizedOptions = { ...options };

    // Detect & add support for shebangs
    let file = resolveCommandFile(command, options);
    let shebang: string | null = null;

    if (file !== null) {
        // Read the first 150 bytes from the file
        const size = 150;
        const buffer = Buffer.alloc(size);

        let fd: number | null = null;
        try {
            fd = fs.openSync(file, "r");
            fs.readSync(fd, buffer, 0, size, 0);
        } catch {
        } finally {
            fd && fs.closeSync(fd);
        }

        const match = buffer.toString().match(shebangRegExp);
        if (match) {
            const line = match[1]!.trim();
            const separatorIndex = line.indexOf(" ");
            const filepath = separatorIndex !== -1 ? line.slice(0, separatorIndex) : line;
            const args = separatorIndex !== -1 ? line.slice(separatorIndex + 1) : "";
            const binary = path.basename(filepath);

            shebang = binary === "env" ? args || null : binary;
        }
    }

    if (file !== null && shebang !== null) {
        normalizedCommand = shebang;
        normalizedArgs.unshift(file);

        file = resolveCommandFile(command, options);
    }

    // We don't need a shell if the command filename is resolved and an executable
    if (file === null || !windowsExecutableRegExp.test(file)) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = file !== null && nodeModulesCmdRegExp.test(file);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        // Escape command & arguments
        normalizedCommand = path.normalize(normalizedCommand).replace(metaCharsRegExp, "^$1");
        normalizedArgs = normalizedArgs.map(arg => {
            let normalized = arg
                // Algorithm below is based on https://qntm.org/cmd
                // It's slightly altered to disable JS backtracking to avoid hanging on specially crafted input
                // Please see https://github.com/moxystudio/node-cross-spawn/pull/160 for more information

                // Sequence of backslashes followed by a double quote:
                // double up all the backslashes and escape the double quote
                .replace(/(?=(\\+?)?)\1"/g, '$1$1\\"')

                // Sequence of backslashes followed by the end of the string
                // (which will become a double quote later):
                // double up all the backslashes
                .replace(/(?=(\\+?)?)\1$/, "$1$1");

            // All other backslashes occur literally

            // Quote the whole thing:
            normalized = `"${normalized}"`
                // Escape meta chars
                .replace(metaCharsRegExp, "^$1");

            // Double escape meta chars if necessary
            if (needsDoubleEscapeMetaChars) {
                normalized = normalized.replace(metaCharsRegExp, "^$1");
            }

            return normalized;
        });

        normalizedArgs = [
            "/d",
            "/s",
            "/c",
            `"${[normalizedCommand, ...normalizedArgs].join(" ")}"`,
        ];
        normalizedCommand = normalizedOptions.env?.comspec ?? "cmd.exe";
        // Tell node's spawn that the arguments are already escaped
        normalizedOptions = { ...normalizedOptions, windowsVerbatimArguments: true };
    }

    return { command: normalizedCommand, args: normalizedArgs, options: normalizedOptions };
};

export const spawnProcess = (
    command: string,
    args: string[],
    options: Partial<BaseProcessOptions>,
) => {
    const { stdin, signal, timeout, throwOnError, useNodeModulesBin, ...rest } = options;
    const spawnOptions: SpawnOptions = {
        ...rest,
    };

    const signals: AbortSignal[] = [];
    if (timeout !== undefined) {
        signals.push(AbortSignal.timeout(timeout));
    }
    if (signal !== undefined) {
        signals.push(signal);
    }

    if (signals.length > 0) {
        spawnOptions.signal = combineSignals(signals);
    }
    spawnOptions.env = combineEnv(process.cwd(), spawnOptions.env, useNodeModulesBin);

    const result = normalizeSpawnCommand(command, args, spawnOptions);

    return spawn(result.command, result.args, result.options);
};
