import type { TemplateFn } from "@/types";
import type { ChildProcess, SpawnOptions } from "node:child_process";

export type KillSignal = Parameters<ChildProcess["kill"]>[0];

export interface Output {
    stdout: string;
    stderr: string;
    exitCode: number | undefined;
}

export interface SpawnCommand {
    command: string;
    args: string[];
}
export type { SpawnOptions } from "node:child_process";

export interface BaseProcessOptions<T extends BaseProcessInstance = BaseProcessInstance> {
    stdin: T | string;
    signal: AbortSignal;
    spawnOptions: SpawnOptions;
    timeout: number;
    persist: boolean;
    throwOnError: boolean;
}

export interface BaseProcessInstance<P = any, I = any> extends PromiseLike<P>, AsyncIterable<I> {
    get process(): ChildProcess | undefined;
    get aborted(): boolean;
    get killed(): boolean;
    get pid(): number | undefined;
    get exitCode(): number | undefined;

    exec: BaseExec<BaseProcessInstance<P, I>>;
    pipe: BaseExec<BaseProcessInstance<P, I>>;
    kill: (signal?: KillSignal) => boolean;
}

export type ExecParams =
    | ExecSpawnParams
    | ExecCommandTemplateParams
    | ExecCommandStringParams
    | ExecFactoryParams;

export type ExecSpawnParams = [
    command: string,
    args?: string[],
    options?: Partial<BaseProcessOptions>,
];
export type ExecCommandTemplateParams = Parameters<TemplateFn>;
export type ExecCommandStringParams = [command: string];
export type ExecFactoryParams = [options: Partial<BaseProcessOptions>];

export type BaseExec<T> = BaseExecSpawn<T> &
    BaseExecCommandTemplate<T> &
    BaseExecCommandString<T> &
    BaseExecFactory<T>;

export type BaseExecSpawn<T> = (...params: ExecSpawnParams) => T;
export type BaseExecCommandTemplate<T> = (...params: ExecCommandTemplateParams) => T;
export type BaseExecCommandString<T> = (...params: ExecCommandStringParams) => T;
export type BaseExecFactory<T> = (
    ...params: ExecFactoryParams
) => BaseExecCommandTemplate<T> & BaseExecCommandString<T>;
