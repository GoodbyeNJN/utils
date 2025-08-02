/* eslint-disable @typescript-eslint/unified-signatures */

import { isFunction, isPromiseLike } from "@/remeda";

import type { InferErrType, InferOkType, ResultAll, ResultAllSettled } from "./types";
import type { AsyncFn, Fn, NonEmptyTuple, SyncFn } from "@/types";

export abstract class Result<T = unknown, E = unknown> {
    static ok(): Ok<void>;
    static ok<T>(value: T): Ok<T>;
    static ok(value?: unknown): Ok {
        return new Ok(value);
    }

    static err(): Err<void>;
    static err<E>(error: E): Err<E>;
    static err(error?: unknown): Err {
        return new Err(error);
    }

    static try<T, E = unknown>(fn: SyncFn<T>): Result<T, E>;
    static try<T, E>(fn: SyncFn<T>, onThrow: (error: unknown) => E): Result<T, E>;
    static try<T, E = unknown>(fn: AsyncFn<T>): Promise<Result<Awaited<T>, E>>;
    static try<T, E>(
        fn: AsyncFn<T>,
        onThrowOrReject: (error: unknown) => E,
    ): Promise<Result<Awaited<T>, E>>;
    static try<T, E = unknown>(data: Promise<T>): Promise<Result<Awaited<T>, E>>;
    static try<T, E>(
        data: Promise<T>,
        onThrow: (error: unknown) => E,
    ): Promise<Result<Awaited<T>, E>>;
    static try<T, E = unknown>(data: T): Result<T, E>;
    static try<T, E>(data: T, onThrow: (error: unknown) => E): Result<T, E>;
    static try(fnOrData: unknown, onThrow?: Fn): any {
        try {
            let data = fnOrData;

            if (isFunction(fnOrData)) {
                data = fnOrData();
            }

            if (!isPromiseLike(data)) return ok(data);

            return data.then(
                value => ok(value),
                error => err(onThrow ? onThrow(error) : error),
            );
        } catch (error) {
            return err(onThrow ? onThrow(error) : error);
        }
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
    iter(): [ok: boolean, error: E, value: T] {
        if (this.isOk()) {
            return [true, null as never, this.value];
        } else {
            return [false, this.error, null as never];
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

export const ok = Result.ok;
export const err = Result.err;
