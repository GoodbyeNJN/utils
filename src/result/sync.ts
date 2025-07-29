import { errAsync, ResultAsync } from "./async";

import type { InferErrType, InferOkType, ResultAll, ResultAllSettled } from "./types";
import type { Fn, NonEmptyTuple } from "@/types";

export function ok(): Ok<void>;
export function ok<T>(value: T): Ok<T>;
export function ok(value?: unknown): Ok {
    return new Ok(value);
}

export function err(): Err<void>;
export function err<E>(error: E): Err<E>;
export function err(error?: unknown): Err {
    return new Err(error);
}

export abstract class Result<T = unknown, E = unknown> {
    static fromThrowable<Args extends readonly any[], T, E = unknown>(
        fn: Fn<T, Args>,
    ): Fn<Result<T, E>, Args>;
    static fromThrowable<Args extends readonly any[], T, E>(
        fn: Fn<T, Args>,
        // eslint-disable-next-line @typescript-eslint/unified-signatures
        onThrow: (error: unknown) => E,
    ): Fn<Result<T, E>, Args>;
    static fromThrowable(fn: Fn, onThrow?: Fn) {
        return (...args: any[]) => {
            try {
                return ok(fn(...args));
            } catch (error) {
                return err(onThrow ? onThrow(error) : error);
            }
        };
    }

    static all<T extends NonEmptyTuple<Result>>(results: T): ResultAll<T>;
    static all<T extends readonly Result[]>(results: T): ResultAll<T>;
    static all(results: Result[]) {
        let acc: Result<unknown[]> = ok([]);

        for (const result of results) {
            if (!result.isOk()) {
                acc = err(result.error);
                break;
            }

            acc = acc.map(values => [...values, result.value]);
        }

        return acc;
    }

    static allSettled<T extends NonEmptyTuple<Result>>(results: T): ResultAllSettled<T>;
    static allSettled<T extends readonly Result[]>(results: T): ResultAllSettled<T>;
    static allSettled(results: Result[]) {
        let acc: Result<unknown[], unknown[]> = ok([]);

        for (const result of results) {
            if (result.isErr() && acc.isErr()) {
                acc = acc.mapErr(errors => [...errors, result.error]);
            } else if (result.isOk() && acc.isOk()) {
                acc = acc.map(values => [...values, result.value]);
            } else if (result.isErr() && acc.isOk()) {
                acc = err([result.error]);
            }
        }

        return acc;
    }

    abstract readonly ok: boolean;

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
     * Maps `Result<T, E>` to `Result<U, E>`
     */
    map<U>(fn: (value: T) => U): Result<U, E> {
        return this.isErr() ? this : ok(fn(this.value));
    }

    /**
     * Maps `Result<T, E>` to `ResultAsync<U, E>`
     */
    mapAsync<U>(fn: (value: T) => Promise<U>): ResultAsync<U, E> {
        return this.isErr() ? errAsync(this.error) : ResultAsync.fromPromise(fn(this.value));
    }

    /**
     * Maps `Result<T, E>` to `Result<T, F>`
     */
    mapErr<F>(fn: (error: E) => F): Result<T, F> {
        return this.isOk() ? this : err(fn(this.error));
    }

    /**
     * Returns a new `Result` by combining the current `Result` with another `Result`
     */
    and<R extends Result<unknown, E>>(result: R): Result<InferOkType<R>, E>;
    and<U>(result: Result<U, E>): Result<U, E>;
    and(result: Result) {
        return this.isErr() ? this : result;
    }

    /**
     * Maps `Result<T, E>` to `Result<U, E | F>` with a function that returns a `Result`
     */
    andThen<R extends Result>(fn: (value: T) => R): Result<InferOkType<R>, InferErrType<R> | E>;
    andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;
    andThen(fn: Fn) {
        return this.isErr() ? this : fn(this.value);
    }

    /**
     * Maps `Result<T, E>` to `ResultAsync<U, E | F>`
     */
    andThenAsync<U, F>(fn: (value: T) => ResultAsync<U, F>): ResultAsync<U, E | F> {
        return this.isErr() ? errAsync(this.error) : fn(this.value);
    }

    /**
     * Returns a new `Result` by combining the current `Result` with another `Result`
     */
    or<R extends Result<T, unknown>>(result: R): Result<T, InferErrType<R>>;
    or<F>(result: Result<T, F>): Result<T, F>;
    or(result: Result) {
        return this.isOk() ? this : result;
    }

    /**
     * Maps `Result<T, E>` to `Result<T | U, F>` with a function that returns a `Result`
     */
    orElse<R extends Result>(fn: (error: E) => R): Result<InferOkType<R> | T, InferErrType<R>>;
    orElse<U, F>(fn: (error: E) => Result<U, F>): Result<T | U, F>;
    orElse(fn: Fn) {
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
     * Unwrap the `Ok` value, or return the provided value if `Result` is `Err`
     */
    unwrapOr<U>(defaultValue: U): T | U {
        return this.isOk() ? this.value : defaultValue;
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
    toIter(): [ok: boolean, value: T, error: E] {
        if (this.isOk()) {
            return [true, this.value, null as never];
        } else {
            return [false, null as never, this.error];
        }
    }

    *[Symbol.iterator](): Generator<Err<E>, T> {
        if (this.isOk()) {
            return this.value;
        }

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        yield self as unknown as Err<E>;

        return self as unknown as T;
    }

    abstract get value(): T;

    abstract get error(): E;
}

export class Ok<T = unknown> extends Result<T, never> {
    readonly ok = true;
    private _value: T;

    constructor(value: T) {
        super();
        this._value = value;
    }

    get value(): T {
        return this._value;
    }

    get error(): never {
        return null as never;
    }
}

export class Err<E = unknown> extends Result<never, E> {
    readonly ok = false;
    private _error: E;

    constructor(error: E) {
        super();
        this._error = error;
    }

    get value(): never {
        return null as never;
    }

    get error(): E {
        return this._error;
    }
}
