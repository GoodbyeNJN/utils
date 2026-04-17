import { isString } from "remeda";

import { concatTemplateStrings, createPromiseWithResolvers } from "@/common";

import { isAbortError } from "./error";
import {
    defaultOptions,
    isCommandStringParams,
    isCommandTemplateParams,
    isFactoryParams,
    isSpawnParams,
    parseCommandString,
} from "./params";
import { spawnProcess } from "./spawn";

import type {
    BaseExec,
    BaseProcessInstance,
    BaseProcessOptions,
    ExecCommandStringParams,
    ExecCommandTemplateParams,
    ExecParams,
    KillSignal,
} from "./types";
import type { Nullable } from "@/types";
import type { ChildProcess } from "node:child_process";
import type { Readable } from "node:stream";

export abstract class BaseProcess<P, I> implements BaseProcessInstance<P, I> {
    protected static execImpl<P, I>(self: BaseProcess<P, I>, params: ExecParams) {
        const execCommandTemplateOrString = (
            ...params: ExecCommandTemplateParams | ExecCommandStringParams
        ) => {
            const input = isCommandTemplateParams(params)
                ? concatTemplateStrings(params[0], params.slice(1))
                : params[0];

            let cmd;
            try {
                cmd = parseCommandString(input);
            } catch (error) {
                self.thrownError = error as Error;
            }

            // Return current instance if command parsing failed, error will be thrown later when waiting for output
            return cmd ? self.spawn(cmd.command, cmd.args) : self;
        };

        if (isCommandTemplateParams(params) || isCommandStringParams(params)) {
            return execCommandTemplateOrString(...params);
        } else if (isSpawnParams(params)) {
            self.options = { ...self.options, ...params[2] };

            return self.spawn(params[0], params[1] || []);
        } else if (isFactoryParams(params)) {
            self.options = { ...self.options, ...params[0] };

            return execCommandTemplateOrString;
        } else {
            self.thrownError = new Error(
                `Invalid parameters passed to exec: ${JSON.stringify(params)}`,
            );

            return self;
        }
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

    exec: BaseExec<BaseProcessInstance<P, I>> = (...params: ExecParams): any => {
        return BaseProcess.execImpl(this, params);
    };

    pipe: BaseExec<BaseProcessInstance<P, I>> = (...params: ExecParams): any => {
        const self = this.child();

        return BaseProcess.execImpl(self, params);
    };

    kill(signal?: KillSignal): boolean {
        return this.process?.kill(signal) === true;
    }

    then<TResult1 = P, TResult2 = never>(
        onfulfilled?: ((value: P) => TResult1 | PromiseLike<TResult1>) | null,
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

    abstract [Symbol.asyncIterator](): AsyncIterator<I>;

    protected abstract thenImpl(): Promise<P>;

    protected abstract child(): BaseProcess<P, I>;
}
