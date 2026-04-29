import type { BaseProcessInstance, Output } from "./types";

export const isAbortError = (err: Error) => {
    const { name, cause } = err;
    if (name !== "AbortError") return false;
    if (cause instanceof Error && cause.name === "TimeoutError") return false;

    return true;
};

export class NonZeroExitError extends Error {
    public static is(value: unknown): value is NonZeroExitError {
        return value instanceof NonZeroExitError;
    }

    public readonly result: BaseProcessInstance;
    public readonly output?: Output;

    public get exitCode(): number | undefined {
        if (this.result.exitCode !== undefined) {
            return this.result.exitCode;
        }

        return undefined;
    }

    public constructor(result: BaseProcessInstance, output?: Output) {
        super(`Process exited with non-zero status (${result.exitCode})`);

        this.result = result;
        this.output = output;
    }
}
