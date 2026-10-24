import { tokenizeArgs } from "args-tokenizer";

import { isArray, isPlainObject, isString } from "@/fp";

import type { BaseProcessOptions, ExecParams, SpawnCommand } from "./types";

export const defaultOptions: Partial<BaseProcessOptions> = {
    timeout: undefined,
    useNodeModulesBin: true,
    windowsHide: true,
};

export const parseCommandString = (input: string): SpawnCommand | Error => {
    let tokens;
    try {
        tokens = tokenizeArgs(input);
    } catch (error) {
        return new Error(`Failed to parse command string: "${input}".`, {
            cause: error,
        });
    }

    if (!tokens[0]) {
        return new Error(`Failed to extract command from string: "${input}".`);
    }

    return { cmd: tokens[0], args: tokens.slice(1) };
};

export const getExecParamsKind = (
    params: ExecParams,
): "command-template" | "command-string" | "spawn-array" | "spawn-string" | Error => {
    const [a, b, c] = params;

    if (isArray(a)) return "command-template";

    if (isString(a)) {
        if (b === undefined && c === undefined) return "command-string";

        if (c === undefined || isPlainObject(c)) {
            if (b === undefined || isArray(b)) {
                return "spawn-array";
            } else if (b === null) {
                return "spawn-string";
            }
        }
    }

    return new Error(`Invalid parameters passed to exec: ${JSON.stringify(params)}`);
};
