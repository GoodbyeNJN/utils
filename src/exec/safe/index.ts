import { err, ok } from "@/result";

import { NonZeroExitError } from "../error";
import { BaseProcess } from "../process";
import { readStreamLines, readStreams } from "../stream";

import type { Exec, ProcessInstance, ProcessOptions } from "./types";
import type { Output } from "../types";
import type { Result } from "@/result";

export class Process extends BaseProcess implements ProcessInstance {
    declare exec: Exec;
    declare pipe: Exec;

    declare protected options: Partial<ProcessOptions>;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(options?: Partial<ProcessOptions>) {
        super(options);
    }

    override async *[Symbol.asyncIterator](): AsyncIterator<Result<string, Error>> {
        const p = this.process;
        if (!p) return err(new Error("No process was started"));

        for await (const line of readStreamLines([this.streamOut, this.streamErr])) {
            yield ok(line);
        }

        await this.cleanup();

        const result = this.maybeThrow();
        if (result.isErr()) return result;
    }

    protected override async thenImpl(): Promise<Result<Output, Error>> {
        const p = this.process;
        if (!p) return err(new Error("No process was started"));

        const [stdout, stderr] = await readStreams([this.streamOut, this.streamErr]);

        await this.cleanup();

        const output: Output = {
            stdout,
            stderr,
            exitCode: this.exitCode,
        };
        const result = this.maybeThrow(output);
        if (result.isErr()) return result;

        return ok(output);
    }

    protected maybeThrow(output?: Output): Result<void, Error> {
        if (this.thrownError) return err(this.thrownError);

        const shouldThrowOnError =
            this.options.throwOnError && this.exitCode !== 0 && this.exitCode !== undefined;
        if (!shouldThrowOnError) return ok();

        return err(new NonZeroExitError(this, output));
    }

    protected override construct(): Process {
        return new Process({ stdin: this });
    }
}

export const exec: Exec = (...params: [any, ...any[]]): any => {
    const self = new Process();

    return BaseProcess["execImpl"](self, params);
};
