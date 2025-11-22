/* eslint-disable max-params */

import { stringify } from "@/common";
import { isBigInt, isBoolean, isError, isNumber, isString, isSymbol } from "@/remeda";

const prepare = (message: string | undefined, error: unknown, contexts: string[]) => {
    let cause: unknown;
    let emsg: string;

    // 1. Determine error message and cause from the provided error
    if (isError(error)) {
        cause = error;
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

    // 7. Format the remaining contexts
    const ctx = ctxs.map((line, index) => `    ${index}: ${line}`).join("\n");

    return { cause, msg, ctx };
};

const format = (msg: string, ctx: string) => `
Message:
    ${msg || "<empty message>"}

Context:
    ${ctx.trim() || "<empty context>"}
`;

export class ResultError extends Error {
    #msg: string;
    #ctx: string;

    constructor(
        message: string | undefined,
        error: unknown,
        contexts: string[],
        caller: Function = ResultError,
    ) {
        const { cause, msg, ctx } = prepare(message, error, contexts);
        const str = `
${format(msg, ctx)}
Stack trace:
        `.trimEnd();

        super(str, cause ? { cause } : undefined);

        Error.captureStackTrace(this, caller || this.constructor);

        this.#msg = msg;
        this.#ctx = ctx;
    }

    override toString(): string {
        const str = format(this.#msg, this.#ctx).trim();

        return str;
    }
}
