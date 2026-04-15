import { NonZeroExitError } from "../error";
import { BaseProcess } from "../process";
import { readStreamLines, readStreams } from "../stream";

import type { Exec, ProcessInstance, ProcessOptions } from "./types";
import type { Output } from "../types";

export class Process extends BaseProcess implements ProcessInstance {
    declare exec: Exec;
    declare pipe: Exec;

    declare protected options: Partial<ProcessOptions>;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
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

        const shouldThrowOnError =
            this.options.throwOnError && this.exitCode !== 0 && this.exitCode !== undefined;
        if (!shouldThrowOnError) return;

        throw new NonZeroExitError(this, output);
    }

    protected override construct(): Process {
        return new Process({ stdin: this });
    }
}

export const exec: Exec = (...params: [any, ...any[]]): any => {
    const self = new Process();

    return BaseProcess["execImpl"](self, params);
};
