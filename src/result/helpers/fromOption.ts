import { Err } from "./err";
import { Ok } from "./ok";

import type { Result } from "../result";
import type { InferSomeType, Option } from "@/option";

export interface FromOption {
    <O extends Option, E = unknown>(option: O, error: E): Result<InferSomeType<O>, E>;
    <T, E = unknown>(option: Option<T>, error: E): Result<T, E>;
}

/* #__NO_SIDE_EFFECTS__ */
export const fromOption: FromOption = (option: Option, error: unknown) => {
    if (option.isSome()) {
        return Ok(option.unwrap());
    } else {
        return Err(error);
    }
};
