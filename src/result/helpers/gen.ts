import { isPromiseLike } from "@/fp";

import { isResult } from "./isResult";
import { Ok } from "./ok";

import type { Result } from "../result";
import type { InferErrType, InferOkType } from "../types";
import type { Fn } from "@/types";

export interface Gen {
    <T, E, This>(
        body: (this: This) => Iterator<Result<never, E>, Result<T, E> | T>,
        self?: This,
    ): Result<T, E>;
    <YieldErr extends Result<never>, ReturnResult extends Result | any, This>(
        body: (this: This) => Iterator<YieldErr, ReturnResult>,
        self?: This,
    ): Result<
        ReturnResult extends Result ? InferOkType<ReturnResult> : ReturnResult,
        InferErrType<YieldErr> | (ReturnResult extends Result ? InferErrType<ReturnResult> : never)
    >;

    <T, E, This>(
        body: (this: This) => AsyncIterator<Result<never, E>, Result<T, E> | T>,
        self?: This,
    ): Promise<Result<T, E>>;
    <YieldErr extends Result<never>, ReturnResult extends Result | any, This>(
        body: (this: This) => AsyncIterator<YieldErr, ReturnResult>,
        self?: This,
    ): Promise<
        Result<
            ReturnResult extends Result ? InferOkType<ReturnResult> : ReturnResult,
            | InferErrType<YieldErr>
            | (ReturnResult extends Result ? InferErrType<ReturnResult> : never)
        >
    >;
}

/* #__NO_SIDE_EFFECTS__ */
export const gen: Gen = (body: Fn<Iterator<any> | AsyncIterator<any>>, self?: any): any => {
    const iter = body.call(self);
    const next = iter.next();

    const handle = (result: IteratorResult<any, any>): any => {
        if (!result.done) return result.value;

        return isResult(result.value) ? result.value : Ok(result.value);
    };

    if (isPromiseLike(next)) {
        return next.then(handle);
    }

    return handle(next);
};
