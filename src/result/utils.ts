import { isPromiseLike } from "@/remeda";

import type { Err, Result } from "./result";
import type { InferErrType, InferOkType } from "./types";
import type { Fn } from "@/types";

export function safeTry<T, E>(body: () => Generator<Err<E>, Result<T, E>>): Result<T, E>;
export function safeTry<YieldErr extends Err, GeneratorReturnResult extends Result>(
    body: () => Generator<YieldErr, GeneratorReturnResult>,
): Result<
    InferOkType<GeneratorReturnResult>,
    InferErrType<YieldErr> | InferErrType<GeneratorReturnResult>
>;
export function safeTry<T, E>(
    body: () => AsyncGenerator<Err<E>, Result<T, E>>,
): Promise<Result<T, E>>;
export function safeTry<YieldErr extends Err, GeneratorReturnResult extends Result>(
    body: () => AsyncGenerator<YieldErr, GeneratorReturnResult>,
): Promise<
    Result<
        InferOkType<GeneratorReturnResult>,
        InferErrType<YieldErr> | InferErrType<GeneratorReturnResult>
    >
>;
export function safeTry(body: Fn<Generator | AsyncGenerator>) {
    const next = body().next();
    if (isPromiseLike(next)) {
        return next.then(res => res.value);
    }

    return next.value;
}
