import { isString } from "remeda";

import { createPromiseWithResolvers } from "@/common";

import { isAbortError } from "./error";
import { defaultOptions, getProcessOptions, getSpawnCommand } from "./params";
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

export abstract class BaseProcess implements BaseProcessInstance {
    protected static execImpl(self: BaseProcess, params: ExecParams): BaseExec {
        const exec = (...params: ExecParams): any => {
            let cmd;
            try {
                cmd = getSpawnCommand(params);
            } catch (error) {
                self.thrownError = error as Error;
            }

            // Return current instance if command parsing failed, error will be thrown later when waiting for output
            return cmd ? self.spawn(cmd.command, cmd.args) : self;
        };

        // Factory case
        const options = getProcessOptions(params);
        if (options) {
            self.options = { ...self.options, ...options };

            return exec;
        }

        // Command string or template case
        return exec(...params);
    }

    protected _process: ChildProcess | undefined;
    protected _aborted = false;
    protected options: Partial<BaseProcessOptions> = { ...defaultOptions };
    protected streamOut: Nullable<Readable>;
    protected streamErr: Nullable<Readable>;
    protected thrownError?: Error;
    protected closeProcess: () => void;
    protected processClosed: Promise<void>;

    get process(): ChildProcess | undefined {
        return this._process;
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
        if (this.process && this.process.exitCode !== null) {
            return this.process.exitCode;
        }

        return undefined;
    }

    constructor(options?: Partial<BaseProcessOptions>) {
        this.options = { ...this.options, ...options };
        ({ promise: this.processClosed, resolve: this.closeProcess } =
            createPromiseWithResolvers<void>());
    }

    exec: any = (...params: ExecParams) => {
        return BaseProcess.execImpl(this, params);
    };

    pipe: any = (...params: ExecParams) => {
        const self = this.construct();

        return BaseProcess.execImpl(self, params);
    };

    kill(signal?: KillSignal): boolean {
        return this.process?.kill(signal) === true;
    }

    then<TResult1 = any, TResult2 = never>(
        onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
    ): Promise<TResult1 | TResult2> {
        return this.thenImpl().then(onfulfilled, onrejected);
    }

    protected spawn(command: string, args: string[]): this {
        const p = spawnProcess(command, args, this.options)
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

        this._process = p;
        this.streamOut = p.stdout;
        this.streamErr = p.stderr;

        if (!p.stdin) return this;

        const { stdin } = this.options;
        if (isString(stdin)) {
            p.stdin.end(stdin);
        } else if (stdin?.process?.stdout) {
            const { stdout } = stdin.process;
            stdout.pipe(p.stdin);
            // Close stdin manually if the source has already ended
            if (stdout.readableEnded) {
                p.stdin.end();
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

    abstract [Symbol.asyncIterator](): AsyncIterator<any>;

    protected abstract thenImpl(): Promise<any>;

    protected abstract construct(): BaseProcess;
}
