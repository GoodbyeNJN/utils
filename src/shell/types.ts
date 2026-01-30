import type { Options, Output, OutputApi, PipeOptions } from "tinyexec";

export interface StringOrTemplateFunction {
    (command: string): ShellResult;
    (template: TemplateStringsArray, ...values: any[]): ShellResult;
}

export interface ShellExec {
    (command: string, args?: string[], options?: Partial<PipeOptions>): ShellResult;
    (template: TemplateStringsArray, ...values: any[]): ShellResult;
    (options: Partial<Options>): StringOrTemplateFunction;
}

export interface ShellOutputApi extends OutputApi {
    pipe: ShellExec;
}

export type ShellResult = PromiseLike<Output> & ShellOutputApi;
