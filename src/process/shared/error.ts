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

    public get exitCode(): number {
        return this.result.exitCode ?? 1;
    }

    public get signalCode(): string | undefined {
        return this.result.signalCode;
    }

    public constructor(result: BaseProcessInstance, output?: Output) {
        let target = "Process";
        if (result.cmd) {
            let full = result.cmd;
            if (result.args?.length) {
                const argsString = result.args
                    .map(a => (/[ "'`()]/.test(a) ? JSON.stringify(a) : a))
                    .join(" ");
                full += ` ${argsString}`;
            }

            target = `Command \`${full}\``;
        }

        super(
            result.signalCode !== undefined
                ? `${target} was killed by the signal ${result.signalCode}`
                : `${target} exited with a non-zero status ${result.exitCode ?? 1}`,
        );

        this.result = result;
        this.output = output;

        // `result` is usually passed the entire instance of the exec process
        // depending on the exec API so that handlers can interact with it fully.
        // As such, its log can be very large so we hide it by making it non-enumerable.
        Object.defineProperty(this, "result", {
            enumerable: false,
            writable: false,
            configurable: false,
        });
    }
}
