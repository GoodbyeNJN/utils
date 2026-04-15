/* eslint-disable @typescript-eslint/unified-signatures */

import { normalizeError } from "@/common";
import { isFunction, isPromiseLike } from "@/remeda";

import { ResultError } from "./error";

import type { InferErrType, InferOkType, ResultAll } from "./types";
import type { AsyncFn, Fn, NonEmptyTuple, SyncFn } from "@/types";

const never = undefined as never;

const transformError = (error: unknown, onThrow: Fn | undefined) => {
    if (!onThrow) return error;
    if (onThrow === Error) return normalizeError(error, transformError);

    return onThrow(error);
};

export type Ok<T = unknown> = Result<T, never>;
export type Err<E = unknown> = Result<never, E>;

export class Result<T = unknown, E = unknown> {
    static is(value: unknown): value is Result {
        return value instanceof Result;
    }

    static ok(): Ok<void>;
    static ok<T>(value: T): Ok<T>;
    static ok(value?: unknown): Ok {
        return new Result(true, never, value);
    }

    static err(): Err<void>;
    static err<E>(error: E): Err<E>;
    static err(error?: unknown): Err {
        return new Result(false, error, never);
    }

    /**
     * Creates a `Result` from a function or a promise, catching any thrown errors or rejected promises.
     */
    static try<T, E = unknown>(fn: SyncFn<T>): Result<T, E>;
    static try<T>(fn: SyncFn<T>, onThrow: ErrorConstructor): Result<T, Error>;
    static try<T, E>(fn: SyncFn<T>, onThrow: (error: unknown) => E): Result<T, E>;

    static try<T, E = unknown>(fn: AsyncFn<T>): Promise<Result<Awaited<T>, E>>;
    static try<T>(
        fn: AsyncFn<T>,
        onThrowOrReject: ErrorConstructor,
    ): Promise<Result<Awaited<T>, Error>>;
    static try<T, E>(
        fn: AsyncFn<T>,
        onThrowOrReject: (error: unknown) => E,
    ): Promise<Result<Awaited<T>, E>>;

    static try<T, E = unknown>(promise: PromiseLike<T>): Promise<Result<Awaited<T>, E>>;
    static try<T>(
        promise: PromiseLike<T>,
        onReject: ErrorConstructor,
    ): Promise<Result<Awaited<T>, Error>>;
    static try<T, E>(
        promise: PromiseLike<T>,
        onReject: (error: unknown) => E,
    ): Promise<Result<Awaited<T>, E>>;

    static try(fnOrPromise: unknown, onThrow?: Fn): any {
        if (!isFunction(fnOrPromise) && !isPromiseLike(fnOrPromise)) {
            const error = new TypeError("Argument must be a function or a promise");

            return this.err(transformError(error, onThrow));
        }

        if (isPromiseLike(fnOrPromise)) {
            return fnOrPromise.then(
                value => this.ok(value),
                error => this.err(transformError(error, onThrow)),
            );
        }

        try {
            const data = fnOrPromise();
            if (!isPromiseLike(data)) {
                return this.ok(data);
            }

            return data.then(
                value => this.ok(value),
                error => this.err(transformError(error, onThrow)),
            );
        } catch (error) {
            return this.err(transformError(error, onThrow));
        }
    }

    /**
     * Wraps a function and returns a new function that always returns a `Result`, catching any thrown errors or rejected promises.
     */
    static wrap<A extends any[], T, E = unknown>(fn: SyncFn<T, A>): SyncFn<Result<T, E>, A>;
    static wrap<A extends any[], T>(
        fn: SyncFn<T, A>,
        onThrow: ErrorConstructor,
    ): SyncFn<Result<T, Error>, A>;
    static wrap<A extends any[], T, E>(
        fn: SyncFn<T, A>,
        onThrow: (error: unknown) => E,
    ): SyncFn<Result<T, E>, A>;

    static wrap<A extends any[], T, E = unknown>(
        fn: AsyncFn<T, A>,
    ): AsyncFn<Result<Awaited<T>, E>, A>;
    static wrap<A extends any[], T>(
        fn: AsyncFn<T, A>,
        onThrowOrReject: ErrorConstructor,
    ): AsyncFn<Result<Awaited<T>, Error>, A>;
    static wrap<A extends any[], T, E>(
        fn: AsyncFn<T, A>,
        onThrowOrReject: (error: unknown) => E,
    ): AsyncFn<Result<Awaited<T>, E>, A>;

    static wrap(fn: unknown, onThrow?: Fn): Fn {
        return (...args) => {
            return this.try(() => (fn as Fn)(...args), onThrow as Fn);
        };
    }

    /**
     * Combines multiple `Result` instances into one `Result` containing an array of all `Ok` values,
     * or the first `Err` encountered
     */
    static all<T extends NonEmptyTuple<Result>>(results: T): ResultAll<T>;
    static all<T extends readonly Result[]>(results: T): ResultAll<T>;
    static all(results: Result[]): ResultAll<Result[]> {
        const values: unknown[] = [];

        for (const result of results) {
            if (result.isErr()) {
                return this.err(result.error);
            }

            values.push(result.value);
        }

        return this.ok(values);
    }

    /**
     * Wraps a generator function where `yield` can return `Err` values early.
     * If the generator completes, the returned value is wrapped in `Ok`.
     */
    static gen<T, E, This>(
        body: (this: This) => Iterator<Err<E>, Result<T, E> | T>,
        self?: This,
    ): Result<T, E>;
    static gen<YieldErr extends Err, ReturnResult extends Result | any, This>(
        body: (this: This) => Iterator<YieldErr, ReturnResult>,
        self?: This,
    ): Result<
        ReturnResult extends Result ? InferOkType<ReturnResult> : ReturnResult,
        InferErrType<YieldErr> | (ReturnResult extends Result ? InferErrType<ReturnResult> : never)
    >;

    static gen<T, E, This>(
        body: (this: This) => AsyncIterator<Err<E>, Result<T, E> | T>,
        self?: This,
    ): Promise<Result<T, E>>;
    static gen<YieldErr extends Err, ReturnResult extends Result | any, This>(
        body: (this: This) => AsyncIterator<YieldErr, ReturnResult>,
        self?: This,
    ): Promise<
        Result<
            ReturnResult extends Result ? InferOkType<ReturnResult> : ReturnResult,
            | InferErrType<YieldErr>
            | (ReturnResult extends Result ? InferErrType<ReturnResult> : never)
        >
    >;

    static gen(body: Fn<Iterator<any> | AsyncIterator<any>>, self?: any): any {
        const iter = body.call(self);
        const next = iter.next();

        const handle = (result: IteratorResult<any, any>): any => {
            if (!result.done) return result.value;

            return result.value instanceof Result ? result.value : this.ok(result.value);
        };

        if (isPromiseLike(next)) {
            return next.then(handle);
        }

        return handle(next);
    }

    private ok: boolean;

    private value: T;

    private error: E;

    #contexts: string[] = [];

    private get contexts(): string[] {
        return this.#contexts;
    }

    private constructor(ok: boolean, error: E, value: T) {
        this.ok = ok;
        this.error = error;
        this.value = value;
    }

    /**
     * Check if `Result` is `OK`
     */
    isOk(): this is Ok<T> {
        return this.ok;
    }

    /**
     * Check if `Result` is `OK` and the value matches the predicate
     */
    isOkAnd(predicate: (value: T) => boolean): this is Ok<T> {
        return this.isOk() && predicate(this.value);
    }

    /**
     * Check if `Result` is `Err`
     */
    isErr(): this is Err<E> {
        return !this.ok;
    }

    /**
     * Check if `Result` is `Err` and the error matches the predicate
     */
    isErrAnd(predicate: (error: E) => boolean): this is Err<E> {
        return this.isErr() && predicate(this.error);
    }

    /**
     * Maps `Result<T, E>` to `Result<U, E>` or `Promise<Result<U, E>>`
     */
    map<U>(fn: (value: T) => U): Result<U, E>;
    map<U>(fn: (value: T) => Promise<U>): Promise<Result<U, E>>;
    map<U>(fn: SyncFn<U> | AsyncFn<U>): any {
        if (this.isErr()) return this;

        const result = fn(this.value);

        return isPromiseLike(result) ? result.then(Result.ok) : Result.ok(result);
    }

    /**
     * Maps `Result<T, E>` to `Result<T, F>` or `Promise<Result<T, F>>`
     */
    mapErr<F>(fn: (error: E) => F): Result<T, F>;
    mapErr<F>(fn: (error: E) => Promise<F>): Promise<Result<T, F>>;
    mapErr<F>(fn: SyncFn<F> | AsyncFn<F>): any {
        if (this.isOk()) return this;

        const result = fn(this.error);

        return isPromiseLike(result) ? result.then(Result.err) : Result.err(result);
    }

    /**
     * Returns given `result` if `Result` is `Ok`, otherwise returns `Result` directly
     */
    and<R extends Result<unknown, E>>(result: R): Result<InferOkType<R>, E>;
    and<U>(result: Result<U, E>): Result<U, E>;
    and<R extends Promise<Result<unknown, E>>>(result: R): Promise<Result<InferOkType<R>, E>>;
    and<U>(result: Promise<Result<U, E>>): Promise<Result<U, E>>;
    and(result: Result | Promise<Result>): Result | Promise<Result> {
        return this.isErr() ? this : result;
    }

    /**
     * Maps `Result<T, E>` to `Result<U, E | F>` or `Promise<Result<U, E | F>>` with a function
     */
    andThen<R extends Result>(fn: (value: T) => R): Result<InferOkType<R>, InferErrType<R> | E>;
    andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;
    andThen<R extends Promise<Result>>(
        fn: (value: T) => R,
    ): Promise<Result<InferOkType<R>, InferErrType<R> | E>>;
    andThen<U, F>(fn: (value: T) => Promise<Result<U, F>>): Promise<Result<U, E | F>>;
    andThen(fn: SyncFn | AsyncFn): Result | Promise<Result> {
        return this.isErr() ? this : fn(this.value);
    }

    /**
     * Returns given `result` if `Result` is `Err`, otherwise returns `Result` directly
     */
    or<R extends Result<T, unknown>>(result: R): Result<T, InferErrType<R>>;
    or<F>(result: Result<T, F>): Result<T, F>;
    or<R extends Promise<Result<T, unknown>>>(result: R): Promise<Result<T, InferErrType<R>>>;
    or<F>(result: Promise<Result<T, F>>): Promise<Result<T, F>>;
    or(result: Result | Promise<Result>): Result | Promise<Result> {
        return this.isOk() ? this : result;
    }

    /**
     * Maps `Result<T, E>` to `Result<T | U, F>` or `Promise<Result<U, E | F>>` with a function
     */
    orElse<R extends Result>(fn: (error: E) => R): Result<InferOkType<R> | T, InferErrType<R>>;
    orElse<U, F>(fn: (error: E) => Result<U, F>): Result<T | U, F>;
    orElse<R extends Promise<Result>>(
        fn: (error: E) => R,
    ): Promise<Result<InferOkType<R> | T, InferErrType<R>>>;
    orElse<U, F>(fn: (error: E) => Promise<Result<U, F>>): Promise<Result<T | U, F>>;
    orElse(fn: SyncFn | AsyncFn): Result | Promise<Result> {
        return this.isOk() ? this : fn(this.error);
    }

    /**
     * Calls the function with the value if `Result` is `Ok` and returns the result unchanged
     */
    inspect(fn: (value: T) => unknown): Result<T, E> {
        try {
            this.isOk() && fn(this.value);
        } catch {}

        return this;
    }

    /**
     * Calls the function with the error if `Result` is `Err` and returns the result unchanged
     */
    inspectErr(fn: (error: E) => unknown): Result<T, E> {
        try {
            this.isErr() && fn(this.error);
        } catch {}

        return this;
    }

    /**
     * Unwrap the `Ok` value, or throw an error if `Result` is `Err`
     */
    unwrap(message?: string | null): T {
        if (this.isErr()) {
            throw new ResultError(
                this,
                message !== null ? (message ?? "Called `unwrap` on an `Err` value") : undefined,
                this.unwrap,
            );
        }

        return this.value;
    }

    /**
     * Unwrap the `Err` value, or throw an error if `Result` is `Ok`
     */
    unwrapErr(message?: string | null): E {
        if (this.isOk()) {
            throw new ResultError(
                this,
                message !== null ? (message ?? "Called `unwrapErr` on an `Ok` value") : undefined,
                this.unwrapErr,
            );
        }

        return this.error;
    }

    /**
     * Unwrap the `Ok` value, or return the provided value if `Result` is `Err`
     */
    unwrapOr(defaultValue: T): T {
        return this.isOk() ? this.value : defaultValue;
    }

    /**
     * Unwrap the `Ok` value, or compute it from a function if `Result` is `Err`
     */
    unwrapOrElse(defaultValueGetter: (error: E) => T): T {
        return this.isOk() ? this.value : defaultValueGetter(this.error);
    }

    /**
     * Matches the `Result` variant and executes the corresponding function
     */
    match<U, F = U>(ok: (value: T) => U, err: (error: E) => F): U | F {
        return this.isOk() ? ok(this.value) : err(this.error);
    }

    /**
     * Returns an iterable object that yields the `Ok` value and `Err` value
     */
    iter(): [ok: true, error: never, value: T] | [ok: false, error: E, value: never] {
        if (this.isOk()) {
            return [true, never, this.value];
        } else {
            return [false, this.error, never];
        }
    }

    *[Symbol.iterator](): Iterator<Err<E>, T> {
        if (this.isOk()) {
            return this.value;
        }

        yield this as unknown as Err<E>;

        return this as unknown as T;
    }

    context(context: string): this {
        this.#contexts.push(context);

        return this;
    }
}

export const ok = Result.ok;
export const err = Result.err;

export const isResult = Result.is;
