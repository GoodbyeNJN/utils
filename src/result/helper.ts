import { isPromiseLike } from "@/remeda";

import type { Err, Result } from "./result";
import type { InferErrType, InferOkType } from "./types";
import type { Fn } from "@/types";

export function safeTry<T, E, This>(
    body: (this: This) => Generator<Err<E>, Result<T, E>>,
    self?: This,
): Result<T, E>;
export function safeTry<YieldErr extends Err, GeneratorReturnResult extends Result, This>(
    body: (this: This) => Generator<YieldErr, GeneratorReturnResult>,
    self?: This,
): Result<
    InferOkType<GeneratorReturnResult>,
    InferErrType<YieldErr> | InferErrType<GeneratorReturnResult>
>;

export function safeTry<T, E, This>(
    body: (this: This) => AsyncGenerator<Err<E>, Result<T, E>>,
    self?: This,
): Promise<Result<T, E>>;
export function safeTry<YieldErr extends Err, GeneratorReturnResult extends Result, This>(
    body: (this: This) => AsyncGenerator<YieldErr, GeneratorReturnResult>,
    self?: This,
): Promise<
    Result<
        InferOkType<GeneratorReturnResult>,
        InferErrType<YieldErr> | InferErrType<GeneratorReturnResult>
    >
>;
export function safeTry(body: Fn<Generator | AsyncGenerator>, self?: any): any {
    const next = body.call(self).next();
    if (isPromiseLike(next)) {
        return next.then(res => res.value);
    }

    return next.value;
}
