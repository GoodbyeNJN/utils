import { NonZeroExitError } from "../shared/error";
import { BaseProcess } from "../shared/process";
import { readStreamLines, readStreams } from "../shared/stream";

import type { ExecParams, Output } from "../shared/types";
import type { Exec, ProcessInstance, ProcessOptions } from "./types";

export class Process extends BaseProcess<Output, string> implements ProcessInstance {
    declare exec: Exec;
    declare pipe: Exec;

    declare protected options: Partial<ProcessOptions>;

    constructor(options?: Partial<ProcessOptions>) {
        super(options);
    }

    override async *[Symbol.asyncIterator](): AsyncIterator<string> {
        const p = this.process;
        if (!p) throw new Error("No process was started");

        yield* readStreamLines([this.streamOut, this.streamErr]);

        await this.cleanup();

        this.maybeThrow();
    }

    protected override async thenImpl(): Promise<Output> {
        const p = this.process;
        if (!p) throw new Error("No process was started");

        const [stdout, stderr] = await readStreams([this.streamOut, this.streamErr]);

        await this.cleanup();

        const output: Output = {
            stdout,
            stderr,
            exitCode: this.exitCode,
        };

        this.maybeThrow(output);

        return output;
    }

    protected maybeThrow(output?: Output) {
        if (this.thrownError) throw this.thrownError;

        const isNonZeroExit = this.exitCode !== undefined && this.exitCode !== 0;
        const isSignalAbort = this.signalCode !== undefined;
        const shouldThrowOnError = this.options.throwOnError && (isNonZeroExit || isSignalAbort);
        if (!shouldThrowOnError) return;

        throw new NonZeroExitError(this, output);
    }

    protected override child() {
        return new Process({ stdin: this });
    }
}

export const exec: Exec = (...params: ExecParams): any => {
    const self = new Process();

    return BaseProcess["execImpl"](self, params);
};
