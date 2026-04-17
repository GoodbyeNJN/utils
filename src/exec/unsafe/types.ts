import type {
    BaseExecCommandString,
    BaseExecCommandTemplate,
    BaseExecFactory,
    BaseExecSpawn,
    BaseProcessInstance,
    BaseProcessOptions,
    Output,
} from "../types";

export type ProcessOptions = BaseProcessOptions<ProcessInstance>;

export type ProcessInstance = BaseProcessInstance<Output, string>;

export type Exec = BaseExecSpawn<ProcessInstance> &
    BaseExecCommandTemplate<ProcessInstance> &
    BaseExecCommandString<ProcessInstance> &
    BaseExecFactory<ProcessInstance>;
