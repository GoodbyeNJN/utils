import { tokenizeArgs } from "args-tokenizer";

import { getErrorMessage } from "@/common";
import { isArray, isPlainObject, isString } from "@/remeda";

import type {
    BaseProcessOptions,
    ExecCommandStringParams,
    ExecCommandTemplateParams,
    ExecFactoryParams,
    ExecParams,
    ExecSpawnParams,
    SpawnCommand,
    SpawnOptions,
} from "./types";

export const defaultOptions: Partial<BaseProcessOptions> = {
    timeout: undefined,
    persist: false,
};

export const defaultSpawnOptions: SpawnOptions = {
    windowsHide: true,
};

export const parseCommandString = (input: string): SpawnCommand => {
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

export const isSpawnParams = (params: ExecParams): params is ExecSpawnParams => {
    const [a, b, c] = params;

    return isString(a) && (b === undefined || isArray(b)) && (c === undefined || isPlainObject(c));
};

export const isCommandTemplateParams = (
    params: ExecParams,
): params is ExecCommandTemplateParams => {
    const [a] = params;

    return isArray(a);
};

export const isCommandStringParams = (params: ExecParams): params is ExecCommandStringParams => {
    const [a, b, c] = params;

    return isString(a) && b === undefined && c === undefined;
};

export const isFactoryParams = (params: ExecParams): params is ExecFactoryParams => {
    const [a, b, c] = params;

    return isPlainObject(a) && b === undefined && c === undefined;
};
