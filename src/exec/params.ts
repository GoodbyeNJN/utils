import { tokenizeArgs } from "args-tokenizer";

import { concatTemplateStrings, getErrorMessage } from "@/common";
import { isArray, isPlainObject, isString } from "@/remeda";

import type { BaseProcessOptions, ExecParams, SpawnCommand, SpawnOptions } from "./types";

export const defaultOptions: Partial<BaseProcessOptions> = {
    timeout: undefined,
    persist: false,
};

export const defaultSpawnOptions: SpawnOptions = {
    windowsHide: true,
};

const parseCommandString = (input: string): SpawnCommand => {
    let tokens;
    try {
        tokens = tokenizeArgs(input);
    } catch (error) {
        throw new Error(`Failed to parse command string: "${input}". ${getErrorMessage(error)}`);
    }

    if (!tokens[0]) {
        throw new Error(`Failed to extract command from string: "${input}".`);
    }

    return { command: tokens[0], args: tokens.slice(1) };
};

export const getSpawnCommand = (params: ExecParams): SpawnCommand => {
    const [templateOrString, ...rest] = params;

    let cmd;

    if (isArray(templateOrString)) {
        // Template string case, should parse input string into command and args
        const input = concatTemplateStrings(templateOrString, rest);
        cmd = parseCommandString(input);
    } else if (isString(templateOrString)) {
        // Simple command string case
        cmd = isArray(rest[0])
            ? { command: templateOrString, args: rest[0] as string[] } // Args array provided
            : parseCommandString(templateOrString); // No args provided, should parse string into command and args
    } else {
        throw new Error(
            `Invalid first parameter for exec: expected string or template string, got ${typeof templateOrString}.`,
        );
    }

    return cmd;
};

export const getProcessOptions = (params: ExecParams): Partial<BaseProcessOptions> | undefined => {
    const [maybeOptions] = params;
    if (isPlainObject(maybeOptions)) return maybeOptions;

    return undefined;
};
