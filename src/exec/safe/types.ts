import type {
    BaseExecCommandString,
    BaseExecCommandTemplate,
    BaseExecFactory,
    BaseExecSpawn,
    BaseProcessInstance,
    BaseProcessOptions,
    Output,
} from "../types";
import type { Result } from "@/result";

export type ProcessOptions = BaseProcessOptions<ProcessInstance>;

export type ProcessInstance = BaseProcessInstance<Result<Output, Error>, Result<string, Error>>;

export type Exec = BaseExecSpawn<ProcessInstance> &
    BaseExecCommandTemplate<ProcessInstance> &
    BaseExecCommandString<ProcessInstance> &
    BaseExecFactory<ProcessInstance>;
