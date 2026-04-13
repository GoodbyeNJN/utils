import { getErrorMessage } from "@/common";
import { isError } from "@/remeda";

import type { Result } from "./result";

const prepare = (result: Result, msg?: string) => {
    // 1. Determine error message and cause from the provided error
    const cause = result["error"];
    const reason = cause === undefined ? "" : getErrorMessage(cause);

    // 2. Concat error message to contexts as the innermost context
    const contexts = result["contexts"].reverse().concat(reason || []);

    let message = "";
    // 3. Use provided message as the main message if available
    if (msg) {
        message = msg;
    } else {
        // 4. Otherwise, use the first non-empty context as the main message
        while (contexts.length > 0) {
            // 5. The main message is removed from contexts
            message = contexts.shift()!;
            if (message) break;
        }
        // 6. The main message may still be empty, that's okay
    }

    // 7. Format into a string with message and contexts
    const ctx = contexts.map((line, index) => `    ${index}: ${line}`).join("\n");
    const formatted = `
Message:
    ${message || "<empty message>"}
Context:
    ${ctx.trim() || "<empty context>"}
`.trim();

    // 8. Prepare the error constructor options
    const options: ErrorOptions | undefined = isError(cause) ? { cause } : undefined;

    return { message, contexts, formatted, options };
};

export class ResultError extends Error {
    static is(value: unknown): value is ResultError {
        return value instanceof ResultError;
    }

    static fmt(result: Result, message?: string): string {
        return prepare(result, message).formatted;
    }

    #msg: string;
    #ctx: string[];
    #formatted: string;

    constructor(result: Result, message?: string, caller: Function = ResultError) {
        const prepared = prepare(result, message);

        super(
            `
--------------------
${prepared.formatted}
Stack trace:`,
            prepared.options,
        );
        Error.captureStackTrace(this, caller || this.constructor);

        this.#msg = prepared.message;
        this.#ctx = prepared.contexts;
        this.#formatted = prepared.formatted;
    }

    get msg(): string {
        return this.#msg;
    }

    get contexts(): string[] {
        return this.#ctx;
    }

    override toString(): string {
        return this.#formatted;
    }
}
