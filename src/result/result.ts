import { isPromiseLike } from "@/fp";

import { all } from "./helpers/all";
import { Err } from "./helpers/err";
import { ResultError } from "./helpers/error";
import { fromOption } from "./helpers/fromOption";
import { gen } from "./helpers/gen";
import { isResult } from "./helpers/isResult";
import { Ok } from "./helpers/ok";
import { _try } from "./helpers/try";
import { wrap } from "./helpers/wrap";

import type { InferErrType, InferOkType } from "./types";
import type { AsyncFn, SyncFn } from "@/types";

export class Result<T = unknown, E = unknown> {
    static is = isResult;
    static fromOption = fromOption;

    /**
     * Creates a `Result` from a function or a promise, catching any thrown errors or rejected promises.
     */
    static try = _try;

    /**
     * Wraps a function and returns a new function that always returns a `Result`, catching any thrown errors or rejected promises.
     */
    static wrap = wrap;

    /**
     * Combines multiple `Result` instances into one `Result` containing an array of all `Ok` values,
     * or the first `Err` encountered
     */
    static all = all;

    /**
     * Wraps a generator function where `yield` can return `Err` values early.
     * If the generator completes, the returned value is wrapped in `Ok`.
     */
    static gen = gen;

    private readonly ok: boolean;

    private readonly value: T;

    private readonly error: E;

    readonly #contexts: string[] = [];

    private get contexts(): string[] {
        return this.#contexts;
    }

    private constructor(ok: boolean, error: E, value: T) {
        this.ok = ok;
        this.error = error;
        this.value = value;
    }

    /**
     * Check if `Result` is `Ok`
     */
    isOk(): this is Result<T, never> {
        return this.ok;
    }

    /**
     * Check if `Result` is `Ok` and the value matches the predicate
     */
    isOkAnd(predicate: (value: T) => boolean): this is Result<T, never> {
        return this.isOk() && predicate(this.value);
    }

    /**
     * Check if `Result` is `Err`
     */
    isErr(): this is Result<never, E> {
        return !this.ok;
    }

    /**
     * Check if `Result` is `Err` and the error matches the predicate
     */
    isErrAnd(predicate: (error: E) => boolean): this is Result<never, E> {
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

        return isPromiseLike(result) ? result.then(Ok) : Ok(result);
    }

    /**
     * Maps `Result<T, E>` to `Result<T, F>` or `Promise<Result<T, F>>`
     */
    mapErr<F>(fn: (error: E) => F): Result<T, F>;
    mapErr<F>(fn: (error: E) => Promise<F>): Promise<Result<T, F>>;
    mapErr<F>(fn: SyncFn<F> | AsyncFn<F>): any {
        if (this.isOk()) return this;

        const result = fn(this.error);

        return isPromiseLike(result) ? result.then(Err) : Err(result);
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
                // oxlint-disable-next-line typescript/unbound-method
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
                // oxlint-disable-next-line typescript/unbound-method
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
    iter():
        | readonly [ok: true, error: never, value: T]
        | readonly [ok: false, error: E, value: never] {
        if (this.isOk()) {
            return [true, undefined as never, this.value];
        } else {
            return [false, this.error, undefined as never];
        }
    }

    *[Symbol.iterator](): Iterator<Result<never, E>, T> {
        if (this.isOk()) {
            return this.value;
        }

        yield this as unknown as Result<never, E>;

        return this as unknown as T;
    }

    context(context: string): this {
        this.#contexts.push(context);

        return this;
    }
}
