import { isError, isString } from "@/fp";
import { concatTemplateStrings, createPromiseWithResolvers } from "@/tools";

import { isAbortError } from "./error";
import { defaultOptions, getExecParamsKind, parseCommandString } from "./params";
import { spawnProcess } from "./spawn";

import type {
    BaseExec,
    BaseProcessInstance,
    BaseProcessOptions,
    ExecParams,
    KillSignal,
} from "./types";
import type { Nullable } from "@/types";
import type { ChildProcess } from "node:child_process";
import type { Readable } from "node:stream";

export abstract class BaseProcess<P, I> implements BaseProcessInstance<P, I> {
    protected _process: ChildProcess | undefined;
    protected _aborted = false;
    protected _cmd: string | undefined;
    protected _args: string[] | undefined;
    protected options: Partial<BaseProcessOptions> = { ...defaultOptions };
    protected streamOut: Nullable<Readable>;
    protected streamErr: Nullable<Readable>;
    protected thrownError?: Error;
    protected closeProcess: () => void;
    protected processClosed: Promise<void>;

    get process(): ChildProcess | undefined {
        return this._process;
    }

    get cmd(): string | undefined {
        return this._cmd;
    }

    get args(): string[] | undefined {
        return this._args;
    }

    get aborted(): boolean {
        return this._aborted;
    }

    get killed(): boolean {
        return this.process?.killed === true;
    }

    get pid(): number | undefined {
        return this.process?.pid;
    }

    get exitCode(): number | undefined {
        return this.process?.exitCode ?? undefined;
    }

    get signalCode(): string | undefined {
        return this.process?.signalCode ?? undefined;
    }

    constructor(options?: Partial<BaseProcessOptions>) {
        this.options = { ...this.options, ...options };
        ({ promise: this.processClosed, resolve: this.closeProcess } =
            createPromiseWithResolvers<void>());
    }

    protected abstract createChildProcess(): BaseProcess<P, I>;
    protected abstract readProcessOutput(): Promise<P>;
    abstract [Symbol.asyncIterator](): AsyncIterator<I>;

    exec: BaseExec<BaseProcessInstance<P, I>> = (...params: ExecParams): any => {
        return baseExec(this, params);
    };

    pipe: BaseExec<BaseProcessInstance<P, I>> = (...params: ExecParams): any => {
        const self = this.createChildProcess();

        return baseExec(self, params);
    };

    kill(signal?: KillSignal): boolean {
        return this.process?.kill(signal) === true;
    }

    async then<TResult1 = P, TResult2 = never>(
        onfulfilled?: ((value: P) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
    ): Promise<TResult1 | TResult2> {
        return this.readProcessOutput().then(onfulfilled, onrejected);
    }

    protected run(command: string, args: string[]): this {
        this._cmd = command;
        this._args = args;

        const proc = spawnProcess(command, args, this.options)
            .once("error", err => {
                if (isAbortError(err)) {
                    this._aborted = true;
                } else {
                    this.thrownError = err;
                }
            })
            .once("close", () => {
                this.closeProcess();
            });

        this._process = proc;
        this.streamOut = proc.stdout;
        this.streamErr = proc.stderr;

        if (!proc.stdin) return this;

        const { stdin } = this.options;
        if (isString(stdin)) {
            proc.stdin.end(stdin);
        } else if (stdin?.process?.stdout) {
            const { stdout } = stdin.process;
            stdout.pipe(proc.stdin);
            // Close stdin manually if the source has already ended
            if (stdout.readableEnded) {
                proc.stdin.end();
            }
        }

        return this;
    }

    protected async cleanup(): Promise<void> {
        await this.processClosed;

        const { stdin } = this.options;
        if (stdin && !isString(stdin)) {
            await stdin;
        }

        this.process?.removeAllListeners();
    }
}

export const baseExec = <P, I>(self: BaseProcess<P, I>, params: ExecParams) => {
    const [a, b, c] = params;
    const kind = getExecParamsKind(params);

    let input;
    switch (kind) {
        case "command-template": {
            input = concatTemplateStrings(a as any, params.slice(1));

            break;
        }
        case "command-string": {
            input = a as string;

            break;
        }
        case "spawn-array": {
            // For spawn-array, we directly spawn the command with the provided arguments and options.
            self["options"] = { ...self["options"], ...c };

            return self["run"](a as any, b ?? []);
        }
        case "spawn-string": {
            self["options"] = { ...self["options"], ...c };
            input = a as string;

            break;
        }
        default: {
            self["thrownError"] = kind;

            return self;
        }
    }

    const cmd = parseCommandString(input);
    if (isError(cmd)) {
        self["thrownError"] = cmd;

        // Return current instance if command parsing failed, error will be thrown later when waiting for output
        return self;
    }

    return self["run"](cmd.cmd, cmd.args);
};
