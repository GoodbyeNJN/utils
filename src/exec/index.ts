export { NonZeroExitError } from "./error";
export { Process as SafeProcess, exec as safeExec } from "./safe";
export { Process, exec } from "./unsafe";

export type {
    Exec as SafeExec,
    ProcessInstance as SafeProcessInstance,
    ProcessOptions as SafeProcessOptions,
} from "./safe/types";
export type { Output } from "./types";
export type { Exec, ProcessInstance, ProcessOptions } from "./unsafe/types";
