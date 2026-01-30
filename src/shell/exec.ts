import { tokenizeArgs } from "args-tokenizer";
import { ExecProcess, NonZeroExitError } from "tinyexec";

import { concatTemplateStrings, getErrorMessage } from "@/common";
import { isArray, isPlainObject, isString } from "@/remeda";

import { ShellNonZeroExitError } from "./error";

import type { ShellExec, ShellResult, StringOrTemplateFunction } from "./types";
import type { Options, Output, PipeOptions } from "tinyexec";

export const normalizeParams = (
    ...params: [string | TemplateStringsArray | Partial<Options>, ...any[]]
) => {
    const [commandOrTemplateOrOptions, argsOrTemplateValue, optionsOrTemplateValue, ...rest] =
        params;

    let command: string;
    let args: string[] | undefined;
    let options: Partial<Options> | undefined;
    let factory = false;

    if (isString(commandOrTemplateOrOptions)) {
        // Simple command string case
        command = commandOrTemplateOrOptions;

        // Args array provided
        if (argsOrTemplateValue) {
            args = argsOrTemplateValue;
        } else {
            // No args provided, should parse input string into command and args
            let tokens;
            try {
                tokens = tokenizeArgs(commandOrTemplateOrOptions);
            } catch (error) {
                throw new Error(
                    `Failed to parse command string: "${commandOrTemplateOrOptions}". ${getErrorMessage(error)}`,
                );
            }
            if (!tokens[0]) {
                throw new Error(
                    `Failed to extract command from string: "${commandOrTemplateOrOptions}"`,
                );
            }

            command = tokens[0];
            args = tokens.slice(1);
        }

        // Options provided
        if (optionsOrTemplateValue) {
            options = optionsOrTemplateValue;
        }
    } else if (isArray(commandOrTemplateOrOptions)) {
        // Template string case, should parse input string into command and args
        const input = concatTemplateStrings(commandOrTemplateOrOptions, [
            argsOrTemplateValue,
            optionsOrTemplateValue,
            ...rest,
        ]);
        let tokens;
        try {
            tokens = tokenizeArgs(input);
        } catch (error) {
            throw new Error(
                `Failed to parse input template string: "${input}". ${getErrorMessage(error)}`,
            );
        }
        if (!tokens[0]) {
            throw new Error(`Failed to extract command from template string: "${input}"`);
        }

        command = tokens[0];
        args = tokens.slice(1);
    } else if (isPlainObject(commandOrTemplateOrOptions)) {
        // Options object case, should return factory function
        command = "";
        options = commandOrTemplateOrOptions;
        factory = true;
    } else {
        throw new TypeError(
            `First parameter has an invalid type: "${typeof commandOrTemplateOrOptions}"`,
        );
    }

    return { command, args, options, factory };
};

export class ShellExecProcess extends ExecProcess implements ShellResult {
    constructor(command: string, args?: string[], options?: Partial<Options>) {
        const normalized = normalizeParams(command, args, options);

        super(normalized.command, normalized.args, normalized.options);
    }

    override pipe(command: string, args?: string[], options?: Partial<PipeOptions>): ShellResult;
    override pipe(template: TemplateStringsArray, ...values: any[]): ShellResult;
    override pipe(options: Partial<Options>): StringOrTemplateFunction;
    override pipe(...params: [any, any?, any?, ...any[]]): any {
        const { command, args, options, factory } = normalizeParams(...params);
        const pipeOptions = { ...options, stdin: this };

        if (!factory) return execImpl(command, args, pipeOptions);

        return (...params: [any, any?]) => {
            const normalized = normalizeParams(...params, undefined);

            return execImpl(normalized.command, normalized.args, pipeOptions);
        };
    }

    override async *[Symbol.asyncIterator](): AsyncIterator<string> {
        try {
            yield* super[Symbol.asyncIterator]() as unknown as AsyncIterable<string>;
        } catch (error) {
            if (error instanceof NonZeroExitError) {
                throw new ShellNonZeroExitError(this);
            }

            throw error;
        }
    }

    protected override async _waitForOutput(): Promise<Output> {
        try {
            return await super._waitForOutput();
        } catch (error) {
            if (error instanceof NonZeroExitError) {
                throw new ShellNonZeroExitError(this);
            }

            throw error;
        }
    }
}

export const exec: ShellExec = (...params): any => {
    const { command, args, options, factory } = normalizeParams(...params);
    if (!factory) return execImpl(command, args, options);

    return (...params: [any, any?]) => {
        const normalized = normalizeParams(...params, undefined);

        return execImpl(normalized.command, normalized.args, options);
    };
};

const execImpl = (...params: ConstructorParameters<typeof ShellExecProcess>) => {
    const p = new ShellExecProcess(...params);
    p.spawn();

    return p;
};
