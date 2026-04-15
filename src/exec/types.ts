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

export interface BaseProcessOptions {
    stdin: BaseProcessInstance | string;
    signal: AbortSignal;
    spawnOptions: SpawnOptions;
    timeout: number;
    persist: boolean;
    throwOnError: boolean;
}

export interface BaseProcessInstance extends PromiseLike<any>, AsyncIterable<any> {
    get process(): ChildProcess | undefined;
    get aborted(): boolean;
    get killed(): boolean;
    get pid(): number | undefined;
    get exitCode(): number | undefined;

    exec: (...params: any[]) => any;
    pipe: (...params: any[]) => any;
    kill: (signal?: KillSignal) => boolean;
}

export type ExecParams =
    | ExecSpawnParams
    | ExecCommandTemplateParams
    | ExecCommandStringParams
    | ExecFactoryParams;
export type BaseExec = BaseExecSpawn &
    BaseExecCommandTemplate &
    BaseExecCommandString &
    BaseExecFactory;

export type ExecSpawnParams = [
    command: string,
    args?: string[],
    options?: Partial<BaseProcessOptions>,
];
export type BaseExecSpawn = (...params: ExecSpawnParams) => unknown;

export type ExecCommandTemplateParams = Parameters<TemplateFn>;
export type BaseExecCommandTemplate = (...params: ExecCommandTemplateParams) => unknown;

export type ExecCommandStringParams = [command: string];
export type BaseExecCommandString = (...params: ExecCommandStringParams) => unknown;

export type ExecFactoryParams = [options: Partial<BaseProcessOptions>];
export type BaseExecFactory = (
    ...params: ExecFactoryParams
) => BaseExecCommandTemplate & BaseExecCommandString;
