import type { TemplateFn } from "@/types";
import type { Options, Output, OutputApi, PipeOptions } from "tinyexec";

export type ShellExec = TemplateFn<ShellResult> &
    ((command: string, args?: string[], options?: Partial<PipeOptions>) => ShellResult) &
    ((options: Partial<Options>) => TemplateFn<ShellResult> & ((command: string) => ShellResult));

export interface ShellOutputApi extends OutputApi {
    pipe: ShellExec;
}

export type ShellResult = PromiseLike<Output> & ShellOutputApi;
