/* eslint-disable @typescript-eslint/unified-signatures */

import { normalizeError, stringify } from "@/common";
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
     * Creates a `Result` from a callable that may throw or return a promise that may reject
     */
    static fromCallable<T, E = unknown>(callable: SyncFn<T>): Result<T, E>;
    static fromCallable<T>(callable: SyncFn<T>, onThrow: ErrorConstructor): Result<T, Error>;
    static fromCallable<T, E>(callable: SyncFn<T>, onThrow: (error: unknown) => E): Result<T, E>;

    static fromCallable<T, E = unknown>(callable: AsyncFn<T>): Promise<Result<Awaited<T>, E>>;
    static fromCallable<T>(
        callable: AsyncFn<T>,
        onThrowOrReject: ErrorConstructor,
    ): Promise<Result<Awaited<T>, Error>>;
    static fromCallable<T, E>(
        callable: AsyncFn<T>,
        onThrowOrReject: (error: unknown) => E,
    ): Promise<Result<Awaited<T>, E>>;

    static fromCallable(callable: unknown, onThrow?: Fn): any {
        try {
            if (!isFunction(callable)) {
                const error = new TypeError("Provided argument is not callable");

                return this.err(transformError(error, onThrow));
            }

            const data = callable();
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
     * Creates a safe callable that always returns a `Result`, catching any thrown errors or rejected promises
     */
    static toSafeCallable<A extends any[], T, E = unknown>(
        callable: SyncFn<T, A>,
    ): SyncFn<Result<T, E>, A>;
    static toSafeCallable<A extends any[], T>(
        callable: SyncFn<T, A>,
        onThrow: ErrorConstructor,
    ): SyncFn<Result<T, Error>, A>;
    static toSafeCallable<A extends any[], T, E>(
        callable: SyncFn<T, A>,
        onThrow: (error: unknown) => E,
    ): SyncFn<Result<T, E>, A>;

    static toSafeCallable<A extends any[], T, E = unknown>(
        callable: AsyncFn<T, A>,
    ): AsyncFn<Result<Awaited<T>, E>, A>;
    static toSafeCallable<A extends any[], T>(
        callable: AsyncFn<T, A>,
        onThrowOrReject: ErrorConstructor,
    ): AsyncFn<Result<Awaited<T>, Error>, A>;
    static toSafeCallable<A extends any[], T, E>(
        callable: AsyncFn<T, A>,
        onThrowOrReject: (error: unknown) => E,
    ): AsyncFn<Result<Awaited<T>, E>, A>;

    static toSafeCallable(callable: unknown, onThrow?: Fn): Fn {
        return (...args) => {
            return this.fromCallable(() => (callable as Fn)(...args), onThrow as Fn);
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
                return this.err(result.#error);
            }

            values.push(result.#value);
        }

        return this.ok(values);
    }

    readonly #ok: boolean;

    readonly #value: T;

    readonly #error: E;

    readonly #contexts: string[] = [];

    private constructor(ok: boolean, error: E, value: T) {
        this.#ok = ok;
        this.#error = error;
        this.#value = value;
    }

    /**
     * Check if `Result` is `OK`
     */
    isOk(): this is Ok<T> {
        return this.#ok;
    }

    /**
     * Check if `Result` is `OK` and the value matches the predicate
     */
    isOkAnd(predicate: (value: T) => boolean): this is Ok<T> {
        return this.isOk() && predicate(this.#value);
    }

    /**
     * Check if `Result` is `Err`
     */
    isErr(): this is Err<E> {
        return !this.#ok;
    }

    /**
     * Check if `Result` is `Err` and the error matches the predicate
     */
    isErrAnd(predicate: (error: E) => boolean): this is Err<E> {
        return this.isErr() && predicate(this.#error);
    }

    /**
     * Maps `Result<T, E>` to `Result<U, E>`
     */
    map<U>(fn: (value: T) => U): Result<U, E> {
        return this.isErr() ? this : Result.ok(fn(this.#value));
    }

    /**
     * Maps `Result<T, E>` to `Result<T, F>`
     */
    mapErr<F>(fn: (error: E) => F): Result<T, F> {
        return this.isOk() ? this : Result.err(fn(this.#error));
    }

    /**
     * Returns a new `Result` by combining the current `Result` with another `Result`
     */
    and<R extends Result<unknown, E>>(result: R): Result<InferOkType<R>, E>;
    and<U>(result: Result<U, E>): Result<U, E>;
    and(result: Result): Result {
        return this.isErr() ? this : result;
    }

    /**
     * Maps `Result<T, E>` to `Result<U, E | F>` with a function that returns a `Result`
     */
    andThen<R extends Result>(fn: (value: T) => R): Result<InferOkType<R>, InferErrType<R> | E>;
    andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;
    andThen(fn: Fn): Result {
        return this.isErr() ? this : fn(this.#value);
    }

    /**
     * Returns a new `Result` by combining the current `Result` with another `Result`
     */
    or<R extends Result<T, unknown>>(result: R): Result<T, InferErrType<R>>;
    or<F>(result: Result<T, F>): Result<T, F>;
    or(result: Result): Result {
        return this.isOk() ? this : result;
    }

    /**
     * Maps `Result<T, E>` to `Result<T | U, F>` with a function that returns a `Result`
     */
    orElse<R extends Result>(fn: (error: E) => R): Result<InferOkType<R> | T, InferErrType<R>>;
    orElse<U, F>(fn: (error: E) => Result<U, F>): Result<T | U, F>;
    orElse(fn: Fn): Result {
        return this.isOk() ? this : fn(this.#error);
    }

    /**
     * Calls the function with the value if `Result` is `Ok` and returns the result unchanged
     */
    inspect(fn: (value: T) => unknown): Result<T, E> {
        try {
            this.isOk() && fn(this.#value);
        } catch {}

        return this;
    }

    /**
     * Calls the function with the error if `Result` is `Err` and returns the result unchanged
     */
    inspectErr(fn: (error: E) => unknown): Result<T, E> {
        try {
            this.isErr() && fn(this.#error);
        } catch {}

        return this;
    }

    /**
     * Unwrap the `Ok` value, or throw an error if `Result` is `Err`
     */
    unwrap(message?: string | null): T {
        if (this.isErr()) {
            throw new ResultError(
                message !== null ? (message ?? "Called unwrap on an Err value") : undefined,
                this.#error,
                this.#contexts,
                this.unwrap,
            );
        }

        return this.#value;
    }

    /**
     * Unwrap the `Err` value, or throw an error if `Result` is `Ok`
     */
    unwrapErr(message?: string | null): E {
        if (this.isOk()) {
            throw new ResultError(
                message !== null ? (message ?? "Called unwrapErr on an Ok value") : undefined,
                this.#error,
                this.#contexts,
                this.unwrapErr,
            );
        }

        return this.#error;
    }

    /**
     * Unwrap the `Ok` value, or return the provided value if `Result` is `Err`
     */
    unwrapOr(defaultValue: T): T {
        return this.isOk() ? this.#value : defaultValue;
    }

    /**
     * Unwrap the `Ok` value, or compute it from a function if `Result` is `Err`
     */
    unwrapOrElse(defaultValueGetter: (error: E) => T): T {
        return this.isOk() ? this.#value : defaultValueGetter(this.#error);
    }

    /**
     * Matches the `Result` variant and executes the corresponding function
     */
    match<U, F = U>(ok: (value: T) => U, err: (error: E) => F): U | F {
        return this.isOk() ? ok(this.#value) : err(this.#error);
    }

    /**
     * Returns an iterable object that yields the `Ok` value and `Err` value
     */
    iter(): [ok: boolean, error: E, value: T] {
        if (this.isOk()) {
            return [true, never, this.#value];
        } else {
            return [false, this.#error, never];
        }
    }

    *[Symbol.iterator](): Generator<Err<E>, T> {
        if (this.isOk()) {
            return this.#value;
        }

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        yield self as unknown as Err<E>;

        return self as unknown as T;
    }

    context(context: string): this {
        this.#contexts.push(context);

        return this;
    }

    toString(): string {
        if (this.isErr()) {
            return new ResultError(undefined, this.#error, this.#contexts).toString();
        }

        return `Ok(${stringify(this.#value)})`;
    }
}

export const ok = Result.ok;
export const err = Result.err;
