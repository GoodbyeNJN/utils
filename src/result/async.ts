import { err, ok } from "./sync";
import { IterableResult } from "./utils";

import type { Err } from "./sync";
import type {
    InferAsyncErrType,
    InferAsyncOkType,
    InferErrType,
    InferOkType,
    Result,
} from "./types";
import type { Fn, Promisable } from "@/types";

export function okAsync(): ResultAsync<void, never>;
export function okAsync<T>(value: T): ResultAsync<T, never>;
export function okAsync(value?: unknown) {
    return new ResultAsync(Promise.resolve(ok(value)));
}

export function errAsync(): ResultAsync<never, void>;
export function errAsync<E>(error: E): ResultAsync<never, E>;
export function errAsync(error?: unknown) {
    return new ResultAsync(Promise.resolve(err(error)));
}

export class ResultAsync<T = unknown, E = unknown> implements PromiseLike<Result<T, E>> {
    constructor(private promise: PromiseLike<Result<T, E>>) {}

    map<U>(fn: (value: T) => Promisable<U>): ResultAsync<U, E> {
        return this.deriveFrom(async res => {
            if (res.isErr()) {
                return err(res.err());
            }

            return ok(await fn(res.ok()));
        });
    }

    mapErr<F>(fn: (error: E) => Promisable<F>): ResultAsync<T, F> {
        return this.deriveFrom(async res => {
            if (res.isOk()) {
                return ok(res.ok());
            }

            return err(await fn(res.err()));
        });
    }

    and<R extends Result<unknown, E>>(result: R): ResultAsync<InferOkType<R>, E>;
    and<R extends ResultAsync<unknown, E>>(result: R): ResultAsync<InferAsyncOkType<R>, E>;
    and<U>(result: Result<U, E> | ResultAsync<U, E>): ResultAsync<U, E>;
    and(result: Result | ResultAsync) {
        return this.deriveFrom(res => {
            if (res.isErr()) {
                return result;
            }

            return ok(res.ok());
        });
    }

    andThen<R extends Result>(
        fn: (value: T) => R,
    ): ResultAsync<InferOkType<R>, InferErrType<R> | E>;
    andThen<R extends ResultAsync>(
        fn: (value: T) => R,
    ): ResultAsync<InferAsyncOkType<R>, InferAsyncErrType<R> | E>;
    andThen<U, F>(fn: (value: T) => Result<U, F> | ResultAsync<U, F>): ResultAsync<U, E | F>;
    andThen(fn: Fn) {
        return this.deriveFrom(res => {
            if (res.isErr()) {
                return err(res.err());
            }

            const value = fn(res.ok());
            return value instanceof ResultAsync ? value.promise : value;
        });
    }

    or<R extends Result<T, unknown>>(result: R): ResultAsync<T, InferErrType<R>>;
    or<R extends ResultAsync<T, unknown>>(result: R): ResultAsync<T, InferAsyncErrType<R>>;
    or<F>(result: Result<T, F> | ResultAsync<T, F>): ResultAsync<T, F>;
    or(result: Result | ResultAsync) {
        return this.deriveFrom(res => {
            if (res.isOk()) {
                return result;
            }

            return err(res.err());
        });
    }

    orElse<R extends Result>(fn: (error: E) => R): ResultAsync<InferOkType<R> | T, InferErrType<R>>;
    orElse<R extends ResultAsync>(
        fn: (error: E) => R,
    ): ResultAsync<InferAsyncOkType<R> | T, InferAsyncErrType<R>>;
    orElse<U, F>(fn: (error: E) => Result<U, F> | ResultAsync<U, F>): ResultAsync<T | U, F>;
    orElse(fn: Fn) {
        return this.deriveFrom(async res => {
            if (res.isOk()) {
                return ok(res.ok());
            }

            const error = fn(res.err());
            return error instanceof ResultAsync ? error.promise : error;
        });
    }

    inspect(fn: (value: T) => unknown): ResultAsync<T, E> {
        return this.deriveFrom(async res => {
            if (res.isErr()) {
                return err(res.err());
            }
            try {
                await fn(res.ok());
            } catch {}

            return ok(res.ok());
        });
    }

    inspectErr(fn: (error: E) => unknown): ResultAsync<T, E> {
        return this.deriveFrom(async res => {
            if (res.isOk()) {
                return ok(res.ok());
            }
            try {
                await fn(res.err());
            } catch {}

            return err(res.err());
        });
    }

    async unwrapOr<U>(defaultValue: U): Promise<T | U> {
        const res = await this.promise;

        return res.unwrapOr(defaultValue);
    }

    async match<U, F = U>(ok: (value: T) => U, err: (error: E) => F): Promise<U | F> {
        const res = await this.promise;

        return res.match(ok, err);
    }

    async ok(): Promise<T> {
        const res = await this.promise;

        return res.ok();
    }

    async err(): Promise<E> {
        const res = await this.promise;

        return res.err();
    }

    async toIter(): Promise<IterableResult<T, E>> {
        return new IterableResult(await this.promise);
    }

    then<TResult1 = Result<T, E>, TResult2 = never>(
        onfulfilled?:
            | ((value: Result<T, E>) => TResult1 | PromiseLike<TResult1>)
            | undefined
            | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): PromiseLike<TResult1 | TResult2> {
        return this.promise.then(onfulfilled, onrejected);
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<Err<never, E>, T> {
        const res = await this.promise;
        if (res.isErr()) {
            yield err(res.err());
        }

        return res.ok();
    }

    private deriveFrom<U, F>(
        fn: (result: Result<T, E>) => Result<U, F> | PromiseLike<Result<U, F>>,
    ): ResultAsync<U, F> {
        return new ResultAsync(this.then(fn));
    }
}
