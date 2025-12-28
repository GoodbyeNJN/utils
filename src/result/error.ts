/* eslint-disable max-params */

import { stringify } from "@/common";
import { isBigInt, isBoolean, isError, isNumber, isString, isSymbol } from "@/remeda";

const prepare = (message: string | undefined, contexts: string[], error: unknown) => {
    let e: unknown;
    let emsg: string;

    // 1. Determine error message and cause from the provided error
    if (isError(error)) {
        e = error;
        emsg = error.message;
    } else if (
        isString(error) ||
        isNumber(error) ||
        isBigInt(error) ||
        isBoolean(error) ||
        isSymbol(error)
    ) {
        emsg = error.toString();
    } else if (error === undefined) {
        emsg = "";
    } else if (error === null) {
        emsg = "null";
    } else {
        emsg = stringify(error);
    }

    // 2. Concat error message to contexts as the innermost context
    const ctxs = contexts.reverse().concat(emsg || []);

    let msg = "";
    // 3. Use provided message as the main message if available
    if (message) {
        msg = message;
    } else {
        // 4. Otherwise, use the first non-empty context as the main message
        while (ctxs.length > 0) {
            // 5. The main message is removed from contexts
            msg = ctxs.shift()!;
            if (msg) break;
        }
        // 6. Them main message may still be empty, that's okay
    }

    // 7. Format the display string
    const ctx = ctxs.map((line, index) => `    ${index}: ${line}`).join("\n");
    const display = `
Message:
    ${msg || "<empty message>"}

Context:
    ${ctx.trim() || "<empty context>"}
`.trim();

    // 8. Prepare the error constructor options
    const options: ErrorOptions | undefined = e ? { cause: e } : undefined;

    return { message: msg, contexts: ctxs, error: e, display, options };
};

export class ResultError extends Error {
    static isResultError(value: unknown): value is ResultError {
        return value instanceof ResultError;
    }

    #message: string;
    #contexts: string[];
    #display: string;

    constructor(
        message: string | undefined,
        error: unknown,
        contexts: string[],
        caller: Function = ResultError,
    ) {
        const prepared = prepare(message, contexts, error);

        super(
            `

${prepared.display}

Stack trace:`,
            prepared.options,
        );
        Error.captureStackTrace(this, caller || this.constructor);

        this.#message = prepared.message;
        this.#contexts = prepared.contexts;
        this.#display = prepared.display;
    }

    get msg(): string {
        return this.#message;
    }

    get ctx(): string[] {
        return this.#contexts.slice();
    }

    override toString(): string {
        return this.#display;
    }
}
