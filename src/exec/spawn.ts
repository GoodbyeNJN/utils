import { spawn } from "node:child_process";
import path from "node:path";

import { _parse } from "cross-spawn";

import { defaultSpawnOptions } from "./params";

import type { BaseProcessOptions } from "./types";
import type { SpawnOptions } from "child_process";

declare module "cross-spawn" {
    export function _parse(
        file: string,
        args: string[],
        options?: SpawnOptions,
    ): { command: string; args: string[]; options: SpawnOptions };
}

const pathLikeRegexp = /^path$/i;

const combineEnv = (cwd: string, env?: NodeJS.ProcessEnv) => {
    const combined: NodeJS.ProcessEnv = {
        ...process.env,
        ...env,
    };

    let key = "PATH";
    let value = "";
    for (const [k, v] of Object.entries(combined)) {
        if (pathLikeRegexp.test(k) && v) {
            key = k;
            value = v;
            break;
        }
    }

    const parts = value ? value.split(path.delimiter) : [];

    let currentPath = cwd;
    let lastPath: string;
    do {
        parts.push(path.resolve(currentPath, "node_modules", ".bin"));

        lastPath = currentPath;
        currentPath = path.dirname(currentPath);
    } while (currentPath !== lastPath);

    combined[key] = parts.join(path.delimiter);

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

export const spawnProcess = (
    command: string,
    args: string[],
    options: Partial<BaseProcessOptions>,
) => {
    const { timeout, signal, persist } = options;
    const spawnOptions = {
        ...defaultSpawnOptions,
        ...options.spawnOptions,
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
    if (persist === true) {
        spawnOptions.detached = true;
    }
    spawnOptions.env = combineEnv(process.cwd(), spawnOptions.env);

    const result = _parse(path.normalize(command), args, spawnOptions);

    return spawn(result.command, result.args, result.options);
};
