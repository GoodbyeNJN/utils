export { exec as $, exec, ShellExecProcess, exec as x } from "./exec";
export { ShellNonZeroExitError } from "./error";

export { tokenizeArgs as splitShellCommand } from "args-tokenizer";

export type { ShellExec, ShellOutputApi, ShellResult } from "./types";

export type {
    KillSignal as ShellKillSignal,
    Options as ShellOptions,
    Output as ShellOutput,
    PipeOptions as ShellPipeOptions,
} from "tinyexec";
