import type { ResultAsync } from "./async";
import type { Err, Ok } from "./sync";
import type { IterableResult } from "./utils";

export type InferOkType<R> = R extends Result<infer T, unknown> ? T : never;
export type InferErrType<R> = R extends Result<unknown, infer E> ? E : never;

export type InferAsyncOkType<R> = R extends ResultAsync<infer T, unknown> ? T : never;
export type InferAsyncErrType<R> = R extends ResultAsync<unknown, infer E> ? E : never;

export type Result<T = unknown, E = unknown> = Ok<T, E> | Err<T, E>;

export interface IResult<T = unknown, E = unknown> {
    /**
     * Check if `Result` is `OK`
     */
    isOk: () => this is Ok<T, E>;

    /**
     * Check if `Result` is `OK` and the value matches the predicate
     */
    isOkAnd: (predicate: (value: T) => boolean) => this is Ok<T, E>;

    /**
     * Check if `Result` is `Err`
     */
    isErr: () => this is Err<T, E>;

    /**
     * Check if `Result` is `Err` and the error matches the predicate
     */
    isErrAnd: (predicate: (error: E) => boolean) => this is Err<T, E>;

    /**
     * Maps `Result<T, E>` to `Result<U, E>`
     */
    map: <U>(fn: (value: T) => U) => Result<U, E>;

    /**
     * Maps `Result<T, E>` to `ResultAsync<U, E>`
     */
    mapAsync: <U>(fn: (value: T) => Promise<U>) => ResultAsync<U, E>;

    /**
     * Maps `Result<T, E>` to `Result<T, F>`
     */
    mapErr: <F>(fn: (error: E) => F) => Result<T, F>;

    /**
     * Returns a new `Result` by combining the current `Result` with another `Result`
     */
    and: (<R extends Result<unknown, E>>(result: R) => Result<InferOkType<R>, E>) &
        (<U>(result: Result<U, E>) => Result<U, E>);

    /**
     * Maps `Result<T, E>` to `Result<U, E | F>` with a function that returns a `Result`
     */
    andThen: (<R extends Result>(
        fn: (value: T) => R,
    ) => Result<InferOkType<R>, InferErrType<R> | E>) &
        (<U, F>(fn: (value: T) => Result<U, F>) => Result<U, E | F>);

    /**
     * Maps `Result<T, E>` to `ResultAsync<U, E | F>`
     */
    andThenAsync: <U, F>(fn: (value: T) => ResultAsync<U, F>) => ResultAsync<U, E | F>;

    /**
     * Returns a new `Result` by combining the current `Result` with another `Result`
     */
    or: (<R extends Result<T, unknown>>(result: R) => Result<T, InferErrType<R>>) &
        (<F>(result: Result<T, F>) => Result<T, F>);

    /**
     * Maps `Result<T, E>` to `Result<T | U, F>` with a function that returns a `Result`
     */
    orElse: (<R extends Result>(
        fn: (error: E) => R,
    ) => Result<InferOkType<R> | T, InferErrType<R>>) &
        (<U, F>(f: (error: E) => Result<U, F>) => Result<T | U, F>);

    /**
     * Calls the function with the value if `Result` is `Ok` and returns the result unchanged
     */
    inspect: (fn: (value: T) => unknown) => Result<T, E>;

    /**
     * Calls the function with the error if `Result` is `Err` and returns the result unchanged
     */
    inspectErr: (fn: (error: E) => unknown) => Result<T, E>;

    /**
     * Unwrap the `Ok` value, or return the provided value if `Result` is `Err`
     */
    unwrapOr: <U>(defaultValue: U) => T | U;

    /**
     * Matches the `Result` variant and executes the corresponding function
     */
    match: <U, F = U>(ok: (value: T) => U, err: (error: E) => F) => U | F;

    /**
     * Returns the `Ok` value
     */
    ok: () => T;

    /**
     * Returns the `Err` value
     */
    err: () => E;

    /**
     * Returns an iterable object that yields the `Ok` value and `Err` value
     */
    toIter: () => IterableResult<T, E>;
}
