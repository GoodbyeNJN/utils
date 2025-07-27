import { ResultAsync } from "./async";
import { err, ok } from "./sync";

import type { Err } from "./sync";
import type { InferErrType, InferOkType, Result } from "./types";
import type { AsyncFn, Fn } from "@/types";

export class IterableResult<T, E> {
    ok: boolean;
    value: T;
    error: E;

    constructor(result: Result<T, E>) {
        this.ok = result.isOk();
        this.value = result.ok();
        this.error = result.err();
    }

    *[Symbol.iterator]() {
        yield this.ok;
        yield this.value;
        yield this.error;
    }
}

export function fromPromise<T, E = unknown>(promise: Promise<T>): ResultAsync<T, E>;
export function fromPromise<T, E>(
    promise: Promise<T>,
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    onReject: (error: unknown) => E,
): ResultAsync<T, E>;
export function fromPromise(promise: Promise<unknown>, onReject?: Fn) {
    const newPromise = promise
        .then(value => ok(value))
        .catch(error => err(onReject ? onReject(error) : error));

    return new ResultAsync(newPromise);
}

export function fromThrowable<Args extends readonly any[], T, E = unknown>(
    fn: Fn<T, Args>,
): Fn<Result<T, E>, Args>;
export function fromThrowable<Args extends readonly any[], T, E>(
    fn: Fn<T, Args>,
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    onThrow: (error: unknown) => E,
): Fn<Result<T, E>, Args>;
export function fromThrowable(fn: Fn, onThrow?: Fn) {
    return (...args: any[]) => {
        try {
            return ok(fn(...args));
        } catch (error) {
            return err(onThrow ? onThrow(error) : error);
        }
    };
}

export function fromAsyncThrowable<Args extends readonly any[], T, E = unknown>(
    fn: AsyncFn<T, Args>,
): Fn<ResultAsync<T, E>, Args>;
export function fromAsyncThrowable<Args extends readonly any[], T, E>(
    fn: AsyncFn<T, Args>,
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    onThrow: (error: unknown) => E,
): Fn<ResultAsync<T, E>, Args>;
export function fromAsyncThrowable(fn: AsyncFn, onThrow?: Fn) {
    return (...args: any[]) => {
        const wrapper = async () => {
            try {
                return ok(await fn(...args));
            } catch (error) {
                return err(onThrow ? onThrow(error) : error);
            }
        };

        return new ResultAsync(wrapper());
    };
}

export function safeTry<T, E>(body: () => Generator<Err<never, E>, Result<T, E>>): Result<T, E>;
export function safeTry<YieldErr extends Err<never, unknown>, GeneratorReturnResult extends Result>(
    body: () => Generator<YieldErr, GeneratorReturnResult>,
): Result<
    InferOkType<GeneratorReturnResult>,
    InferErrType<YieldErr> | InferErrType<GeneratorReturnResult>
>;
export function safeTry<T, E>(
    body: () => AsyncGenerator<Err<never, E>, Result<T, E>>,
): ResultAsync<T, E>;
export function safeTry<YieldErr extends Err<never, unknown>, GeneratorReturnResult extends Result>(
    body: () => AsyncGenerator<YieldErr, GeneratorReturnResult>,
): ResultAsync<
    InferOkType<GeneratorReturnResult>,
    InferErrType<YieldErr> | InferErrType<GeneratorReturnResult>
>;
export function safeTry(body: Fn<Generator | AsyncGenerator>) {
    const next = body().next();
    if (next instanceof Promise) {
        return new ResultAsync(next.then(res => res.value));
    }

    return next.value;
}
