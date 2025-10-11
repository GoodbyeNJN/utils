/* eslint-disable @typescript-eslint/unified-signatures */

import { normalizeError } from "@/common";
import { isFunction, isObjectType, isString } from "@/remeda";

import { never } from "./common";
import { Result } from "./result";

import type { FormatPresets, PrintOptions } from "./types";

export class Err<E = unknown> extends Result<never, E> {
    static fromError<E = unknown>(error: E, caller: Function): Err<E> {
        const err = new Err(error);

        if (error instanceof Error) {
            err.stack = error.stack;
        } else if ("captureStackTrace" in Error) {
            const dummy = {} as unknown as Error;
            Error.captureStackTrace(dummy, caller);
            err.stack = dummy.stack;
        }

        return err;
    }

    private stack: string | undefined;

    constructor(error: E) {
        super(false, error, never);
    }

    toError(): Error {
        return normalizeError(this["error"]);
    }

    format(): string;
    format(preset: FormatPresets): string;
    format(options: PrintOptions): string;
    format(presetOrOptions?: FormatPresets | PrintOptions): string {
        const options = this.normalize(presetOrOptions);

        const message = this.toError().message;
        const contexts = this["contexts"]
            .slice()
            .toReversed()
            .map(ctx => (isFunction(ctx) ? ctx() : ctx));
        const stacks = this.stack
            ?.split("\n")
            .map(line => line.trim())
            .filter(Boolean) || ["<no stack trace>"];

        const lines: (string | string[])[] = [
            `Error: ${contexts.length > 0 ? contexts.at(0) : message}`,
        ];

        if (options.context) {
            lines.push(
                "",
                "Caused by:",
                contexts
                    .slice(1)
                    .concat(message)
                    .map((line, index) => `    ${index}: ${line}`),
            );
        }

        if (options.stack) {
            const top = stacks.at(0) || "";
            const hasErrorMessage =
                new RegExp(`^\\w+:\\s+${message}$`).test(top) || /^\w+$/.test(top);

            lines.push(
                "",
                "Stack trace:",
                stacks.slice(hasErrorMessage ? 1 : 0).map(line => `    ${line}`),
            );
        }

        const output = lines.flat().join("\n");

        return output;
    }

    print(): void;
    print(preset: FormatPresets): void;
    print(options: PrintOptions): void;
    print(presetOrOptions?: FormatPresets | PrintOptions): void {
        const options = this.normalize(presetOrOptions);

        const output = this.format(options);

        switch (options.level) {
            case "error":
                console.error(output);
                break;
            case "warn":
                console.warn(output);
                break;
            case "info":
                console.info(output);
                break;
        }
    }

    private normalize(presetOrOptions?: FormatPresets | PrintOptions): Required<PrintOptions> {
        // Default options, equitable to "standard"
        const options: Required<PrintOptions> = {
            level: "error",
            context: true,
            stack: false,
        };

        if (isString(presetOrOptions)) {
            options.context = presetOrOptions === "full" || presetOrOptions === "standard";
            options.stack = presetOrOptions === "full";
        } else if (isObjectType(presetOrOptions)) {
            options.level = presetOrOptions.level ?? options.level;
            options.context = presetOrOptions.context ?? options.context;
            options.stack = presetOrOptions.stack ?? options.stack;
        }

        return options;
    }
}
