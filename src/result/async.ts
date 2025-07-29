import { err, ok, Result } from "./sync";

import type { Err } from "./sync";
import type {
    InferAsyncErrType,
    InferAsyncOkType,
    InferErrType,
    InferOkType,
    ResultAsyncAll,
    ResultAsyncAllSettled,
} from "./types";
import type { AsyncFn, Fn, NonEmptyTuple, Promisable } from "@/types";

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
    static fromPromise<T, E = unknown>(promise: Promise<T>): ResultAsync<T, E>;
    static fromPromise<T, E>(
        promise: Promise<T>,
        // eslint-disable-next-line @typescript-eslint/unified-signatures
        onReject: (error: unknown) => E,
    ): ResultAsync<T, E>;
    static fromPromise(promise: Promise<unknown>, onReject?: Fn) {
        const newPromise = promise
            .then(value => ok(value))
            .catch(error => err(onReject ? onReject(error) : error));

        return new ResultAsync(newPromise);
    }

    static fromThrowable<Args extends readonly any[], T, E = unknown>(
        fn: AsyncFn<T, Args>,
    ): Fn<ResultAsync<T, E>, Args>;
    static fromThrowable<Args extends readonly any[], T, E>(
        fn: AsyncFn<T, Args>,
        // eslint-disable-next-line @typescript-eslint/unified-signatures
        onThrow: (error: unknown) => E,
    ): Fn<ResultAsync<T, E>, Args>;
    static fromThrowable(fn: AsyncFn, onThrow?: Fn) {
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

    static all<T extends NonEmptyTuple<ResultAsync>>(results: T): ResultAsyncAll<T>;
    static all<T extends readonly ResultAsync[]>(results: T): ResultAsyncAll<T>;
    static all<T extends ResultAsync[]>(results: T) {
        return this.fromPromise(Promise.all(results)).andThen(Result.all);
    }

    static allSettled<T extends NonEmptyTuple<ResultAsync>>(results: T): ResultAsyncAllSettled<T>;
    static allSettled<T extends readonly ResultAsync[]>(results: T): ResultAsyncAllSettled<T>;
    static allSettled<T extends ResultAsync[]>(results: T) {
        return this.fromPromise(Promise.all(results)).andThen(Result.allSettled);
    }

    constructor(private promise: PromiseLike<Result<T, E>>) {}

    get ok(): Promise<boolean> {
        return this.promise.then(res => res.ok) as Promise<boolean>;
    }

    get value(): Promise<T> {
        return this.promise.then(res => res.unwrapOr(null)) as Promise<T>;
    }

    get error(): Promise<E> {
        return this.promise.then(res => res.unwrapOr(null)) as Promise<E>;
    }

    map<U>(fn: (value: T) => Promisable<U>): ResultAsync<U, E> {
        return this.deriveFrom(async res => (res.isErr() ? res : ok(await fn(res.value))));
    }

    mapErr<F>(fn: (error: E) => Promisable<F>): ResultAsync<T, F> {
        return this.deriveFrom(async res => (res.isOk() ? res : err(await fn(res.error))));
    }

    and<R extends Result<unknown, E>>(result: R): ResultAsync<InferOkType<R>, E>;
    and<R extends ResultAsync<unknown, E>>(result: R): ResultAsync<InferAsyncOkType<R>, E>;
    and<U>(result: Result<U, E> | ResultAsync<U, E>): ResultAsync<U, E>;
    and(result: Result | ResultAsync) {
        return this.deriveFrom(res => {
            if (res.isErr()) return res;

            return result instanceof ResultAsync ? result.promise : result;
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
            if (res.isErr()) return res;

            const value = fn(res.value);
            return value instanceof ResultAsync ? value.promise : value;
        });
    }

    or<R extends Result<T, unknown>>(result: R): ResultAsync<T, InferErrType<R>>;
    or<R extends ResultAsync<T, unknown>>(result: R): ResultAsync<T, InferAsyncErrType<R>>;
    or<F>(result: Result<T, F> | ResultAsync<T, F>): ResultAsync<T, F>;
    or(result: Result | ResultAsync) {
        return this.deriveFrom(res => {
            if (res.isOk()) return res;

            return result instanceof ResultAsync ? result.promise : result;
        });
    }

    orElse<R extends Result>(fn: (error: E) => R): ResultAsync<InferOkType<R> | T, InferErrType<R>>;
    orElse<R extends ResultAsync>(
        fn: (error: E) => R,
    ): ResultAsync<InferAsyncOkType<R> | T, InferAsyncErrType<R>>;
    orElse<U, F>(fn: (error: E) => Result<U, F> | ResultAsync<U, F>): ResultAsync<T | U, F>;
    orElse(fn: Fn) {
        return this.deriveFrom(async res => {
            if (res.isOk()) return res;

            const error = fn(res.error);
            return error instanceof ResultAsync ? error.promise : error;
        });
    }

    inspect(fn: (value: T) => unknown): ResultAsync<T, E> {
        return this.deriveFrom(async res => {
            try {
                res.isOk() && (await fn(res.value));
            } catch {}

            return res;
        });
    }

    inspectErr(fn: (error: E) => unknown): ResultAsync<T, E> {
        return this.deriveFrom(async res => {
            try {
                res.isErr() && (await fn(res.error));
            } catch {}

            return res;
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

    async toIter() {
        const res = await this.promise;

        return res.toIter();
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

    async *[Symbol.asyncIterator](): AsyncGenerator<Err<E>, T> {
        const res = await this.promise;
        if (res.isErr()) {
            yield res;
        }

        return res.value;
    }

    private deriveFrom<U, F>(
        fn: (result: Result<T, E>) => Result<U, F> | PromiseLike<Result<U, F>>,
    ): ResultAsync<U, F> {
        return new ResultAsync(this.then(fn));
    }
}
