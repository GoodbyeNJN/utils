import { errAsync } from "./async";
import { fromPromise, IterableResult } from "./utils";

import type { ResultAsync } from "./async";
import type { InferErrType, InferOkType, IResult, Result } from "./types";
import type { Fn } from "@/types";

export function ok(): Ok<void, never>;
export function ok<T>(value: T): Ok<T, never>;
export function ok(value?: unknown) {
    return new Ok(value);
}

export function err(): Err<never, void>;
export function err<E>(error: E): Err<never, E>;
export function err(error?: unknown) {
    return new Err(error);
}

export class Ok<T = unknown, E = unknown> implements IResult<T, E> {
    constructor(private readonly value: T) {}

    isOk(): this is Ok<T, E> {
        return true;
    }

    isOkAnd(predicate: (value: T) => boolean): this is Ok<T, E> {
        return predicate(this.value);
    }

    isErr(): this is Err<T, E> {
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isErrAnd(predicate: (error: E) => boolean): this is Err<T, E> {
        return false;
    }

    map<U>(fn: (value: T) => U): Result<U, E> {
        return ok(fn(this.value));
    }

    mapAsync<U>(fn: (value: T) => Promise<U>): ResultAsync<U, E> {
        return fromPromise(fn(this.value));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mapErr<F>(fn: (error: E) => F): Result<T, F> {
        return ok(this.value);
    }

    and<R extends Result<unknown, E>>(result: R): Result<InferOkType<R>, E>;
    and<U>(result: Result<U, E>): Result<U, E>;
    and(result: Result) {
        return result;
    }

    andThen<R extends Result>(fn: (value: T) => R): Result<InferOkType<R>, InferErrType<R> | E>;
    andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;
    andThen(fn: Fn) {
        return fn(this.value);
    }

    andThenAsync<U, F>(fn: (value: T) => ResultAsync<U, F>): ResultAsync<U, E | F> {
        return fn(this.value);
    }

    or<R extends Result<T, unknown>>(result: R): Result<T, InferErrType<R>>;
    or<F>(result: Result<T, F>): Result<T, F>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    or(result: Result) {
        return ok(this.value);
    }

    orElse<R extends Result>(fn: (error: E) => R): Result<InferOkType<R> | T, InferErrType<R>>;
    orElse<U, F>(fn: (error: E) => Result<U, F>): Result<T | U, F>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    orElse(fn: Fn) {
        return ok(this.value);
    }

    inspect(fn: (value: T) => unknown): Result<T, E> {
        try {
            fn(this.value);
        } catch {}

        return ok(this.value);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inspectErr(fn: (error: E) => unknown): Result<T, E> {
        return ok(this.value);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unwrapOr<U>(defaultValue: U): T | U {
        return this.value;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    match<U, F = U>(ok: (value: T) => U, err: (error: E) => F): U | F {
        return ok(this.value);
    }

    ok(): T {
        return this.value;
    }

    err(): E {
        return null as E;
    }

    toIter(): IterableResult<T, E> {
        return new IterableResult(this);
    }

    // eslint-disable-next-line require-yield
    *[Symbol.iterator](): Generator<Err<never, E>, T> {
        return this.value;
    }
}

export class Err<T = unknown, E = unknown> implements IResult<T, E> {
    constructor(private readonly error: E) {}

    isOk(): this is Ok<T, E> {
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOkAnd(predicate: (value: T) => boolean): this is Ok<T, E> {
        return false;
    }

    isErr(): this is Err<T, E> {
        return true;
    }

    isErrAnd(predicate: (error: E) => boolean): this is Err<T, E> {
        return predicate(this.error);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map<U>(fn: (value: T) => U): Result<U, E> {
        return err(this.error);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mapAsync<U>(fn: (value: T) => Promise<U>): ResultAsync<U, E> {
        return errAsync(this.error);
    }

    mapErr<F>(fn: (error: E) => F): Result<T, F> {
        return err(fn(this.error));
    }

    and<R extends Result<unknown, E>>(result: R): Result<InferOkType<R>, E>;
    and<U>(result: Result<U, E>): Result<U, E>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    and(result: unknown) {
        return err(this.error);
    }

    andThen<R extends Result>(fn: (value: T) => R): Result<InferOkType<R>, InferErrType<R> | E>;
    andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    andThen(fn: Fn) {
        return err(this.error);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    andThenAsync<U, F>(fn: (value: T) => ResultAsync<U, F>): ResultAsync<U, E | F> {
        return errAsync(this.error);
    }

    or<R extends Result<T, unknown>>(result: R): Result<T, InferErrType<R>>;
    or<F>(result: Result<T, F>): Result<T, F>;
    or(result: unknown) {
        return result;
    }

    orElse<R extends Result>(fn: (error: E) => R): Result<InferOkType<R> | T, InferErrType<R>>;
    orElse<U, F>(fn: (error: E) => Result<U, F>): Result<T | U, F>;
    orElse(fn: Fn) {
        return fn(this.error);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inspect(fn: (value: T) => unknown): Result<T, E> {
        return err(this.error);
    }

    inspectErr(fn: (error: E) => unknown): Result<T, E> {
        try {
            fn(this.error);
        } catch {}

        return err(this.error);
    }

    unwrapOr<U>(defaultValue: U): T | U {
        return defaultValue;
    }

    match<U, F = U>(ok: (value: T) => U, err: (error: E) => F): U | F {
        return err(this.error);
    }

    ok(): T {
        return null as T;
    }

    err(): E {
        return this.error;
    }

    toIter(): IterableResult<T, E> {
        return new IterableResult(this);
    }

    *[Symbol.iterator](): Generator<Err<never, E>, T> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        yield self as unknown as Err<never, E>;

        return self as unknown as T;
    }
}
