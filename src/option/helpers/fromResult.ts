import { None } from "./none";
import { Some } from "./some";

import type { Option } from "../option";
import type { InferOkType, Result } from "@/result";

export interface FromResult {
    <R extends Result>(result: R): Option<InferOkType<R>>;
    <T>(result: Result<T>): Option<T>;
}

/* #__NO_SIDE_EFFECTS__ */
export const fromResult: FromResult = (result: Result) => {
    if (result.isOk()) {
        return Some(result.unwrap());
    } else {
        return None();
    }
};
