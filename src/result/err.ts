/* eslint-disable @typescript-eslint/unified-signatures */

import { isFunction, isObjectType, isString } from "@/remeda";

import { never } from "./common";
import { Result } from "./result";

import type { PrintOptions, PrintPresets } from "./types";

export class Err<E = unknown> extends Result<never, E> {
    readonly ok = false;
    private readonly _error: E;
    private stack: string | undefined;

    constructor(error: E) {
        super();
        this._error = error;
    }

    get value(): never {
        return never;
    }

    get error(): E {
        return this._error;
    }

    print(): void;
    print(preset: PrintPresets): void;
    print(options: PrintOptions): void;
    print(presetOrOptions?: PrintPresets | PrintOptions): void {
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

        const output = this.format(options.context, options.stack);

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

    private format(context: boolean, stack: boolean): string {
        const contexts = this.ctxs
            .slice()
            .toReversed()
            .map(ctx => (isFunction(ctx) ? ctx() : ctx));
        const stacks = this.stack
            ?.split("\n")
            .map(line => line.trim())
            .filter(Boolean) || ["<no stack trace>"];

        let message: string;
        try {
            message =
                this._error instanceof Error ? this._error.message : JSON.stringify(this._error);
        } catch {
            message = String(this._error);
        }

        const lines: (string | string[])[] = [
            `Error: ${contexts.length > 0 ? contexts.at(0) : message}`,
        ];

        if (context) {
            lines.push(
                "",
                "Caused by:",
                contexts
                    .slice(1)
                    .concat(message)
                    .map((line, index) => `    ${index}: ${line}`),
            );
        }

        if (stack) {
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
}
