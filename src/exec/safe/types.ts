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
import type { SetReturnType } from "@/types";

export type ProcessOptions = BaseProcessOptions & ExtendProcessOptions;

export interface ExtendProcessOptions {
    stdin: ProcessInstance | string;
}

export type ProcessInstance = BaseProcessInstance & ExtendProcessInstance;

export interface ExtendProcessInstance
    extends PromiseLike<Result<Output, Error>>, AsyncIterable<Result<string, Error>> {
    exec: Exec;
    pipe: Exec;
}

export type Exec = SetReturnType<BaseExecSpawn, ProcessInstance> &
    SetReturnType<BaseExecCommandTemplate, ProcessInstance> &
    SetReturnType<BaseExecCommandString, ProcessInstance> &
    SetReturnType<
        BaseExecFactory,
        SetReturnType<BaseExecCommandTemplate, ProcessInstance> &
            SetReturnType<BaseExecCommandString, ProcessInstance>
    >;
