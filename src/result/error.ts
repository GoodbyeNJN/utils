/* eslint-disable max-params */

import { stringify } from "@/common";
import { isBigInt, isBoolean, isError, isNumber, isString, isSymbol } from "@/remeda";

const prepare = (message: string | undefined, error: unknown, contexts: string[]) => {
    let cause: unknown;
    let msg: string;
    if (isError(error)) {
        cause = error;
        msg = error.message;
    } else if (
        isString(error) ||
        isNumber(error) ||
        isBigInt(error) ||
        isBoolean(error) ||
        isSymbol(error)
    ) {
        msg = error.toString();
    } else if (error === undefined) {
        msg = "";
    } else if (error === null) {
        msg = "null";
    } else {
        msg = stringify(error);
    }

    // Show most recent context first
    const ctxs = contexts.reverse().concat(msg || []);
    if (message) {
        // If an additional message is provided, use it as the main reason
        msg = message;
    } else {
        // If no additional message, use the first context as the main reason
        while (ctxs.length > 0) {
            msg = ctxs.shift()!;
            if (msg) break;
        }
    }
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
