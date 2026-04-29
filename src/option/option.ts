import { isPromiseLike } from "@/fp";

import { all } from "./helpers/all";
import { fromResult } from "./helpers/fromResult";
import { gen } from "./helpers/gen";
import { isOption } from "./helpers/isOption";
import { Some } from "./helpers/some";

import type { InferSomeType } from "./types";
import type { AsyncFn, SyncFn } from "@/types";

export const NONE = Symbol.for("[@goodbyenjn/option]: None") as never;

export class Option<T = unknown> {
    static is = isOption;
    static fromResult = fromResult;

    /**
     * Combines multiple `Option` instances into one `Option` containing an array of all `Some` values,
     * or `None` if any `Option` is `None`
     */
    static all = all;

    /**
     * Wraps a generator function where `yield` can return `None` values early.
     * If the generator completes, the returned value is wrapped in `Some`.
     */
    static gen = gen;

    private readonly value: T;

    private constructor(value: T) {
        this.value = value;
    }

    /**
     * Check if `Option` is `Some`
     */
    isSome(): this is Option<T> {
        return this.value !== NONE;
    }

    /**
     * Check if `Option` is `Some` and the value matches the predicate
     */
    isSomeAnd(predicate: (value: T) => boolean): this is Option<T> {
        return this.isSome() && predicate(this.value);
    }

    /**
     * Check if `Option` is `None`
     */
    isNone(): this is Option<never> {
        return this.value === NONE;
    }

    /**
     * Check if `Option` is `None` and the value matches the predicate
     */
    isNoneAnd(predicate: (value: never) => boolean): this is Option<never> {
        return this.isNone() && predicate(NONE);
    }

    /**
     * Map an `Option<T>` to `Option<U>` or `Promise<Option<U>>`
     */
    map<U>(fn: (value: T) => U): Option<U>;
    map<U>(fn: (value: T) => Promise<U>): Promise<Option<U>>;
    map<U>(fn: SyncFn<U> | AsyncFn<U>): any {
        if (this.isNone()) return this;

        const result = fn(this.value);

        return isPromiseLike(result) ? result.then(Some) : Some(result);
    }

    /**
     * Returns given `option` if `Option` is `Some`, otherwise returns `Option` directly
     */
    and<O extends Option>(option: O): Option<InferSomeType<O>>;
    and<U>(option: Option<U>): Option<U>;
    and<O extends Promise<Option>>(option: O): Promise<Option<InferSomeType<O>>>;
    and<U>(option: Promise<Option<U>>): Promise<Option<U>>;
    and(option: Option | Promise<Option>): Option | Promise<Option> {
        return this.isNone() ? this : option;
    }

    /**
     * Maps an `Option<T>` to `Option<U>` or `Promise<Option<U>>` with a function
     */
    andThen<O extends Option>(fn: (value: T) => O): Option<InferSomeType<O>>;
    andThen<U>(fn: (value: T) => Option<U>): Option<U>;
    andThen<O extends Promise<Option>>(fn: (value: T) => O): Promise<Option<InferSomeType<O>>>;
    andThen<U>(fn: (value: T) => Promise<Option<U>>): Promise<Option<U>>;
    andThen(fn: SyncFn | AsyncFn): Option | Promise<Option> {
        return this.isNone() ? this : fn(this.value);
    }

    /**
     * Returns given `option` if `Option` is `None`, otherwise returns `Option` directly
     */
    or<O extends Option<T>>(option: O): Option<T>;
    or<U>(option: Option<U>): Option<U>;
    or<O extends Promise<Option<T>>>(option: O): Promise<Option<T>>;
    or<U>(option: Promise<Option<U>>): Promise<Option<U>>;
    or(option: Option | Promise<Option>): Option | Promise<Option> {
        return this.isSome() ? this : option;
    }

    /**
     * Maps an `Option<T>` to `Option<U>` or `Promise<Option<U>>` with a function
     */
    orElse<O extends Option>(fn: (value: never) => O): Option<InferSomeType<O>>;
    orElse<U>(fn: (value: never) => Option<U>): Option<U>;
    orElse<O extends Promise<Option>>(fn: (value: never) => O): Promise<Option<InferSomeType<O>>>;
    orElse<U>(fn: (value: never) => Promise<Option<U>>): Promise<Option<U>>;
    orElse(fn: SyncFn | AsyncFn): Option | Promise<Option> {
        return this.isSome() ? this : fn(NONE);
    }

    /**
     * Calls the function with the value if `Option` is `Some` and returns the result unchanged
     */
    inspect(fn: (value: T) => unknown): Option<T> {
        try {
            this.isSome() && fn(this.value);
        } catch {}

        return this;
    }

    /**
     * Unwrap the `Some` value, or throw an error if `Option` is `None`
     */
    unwrap(message?: string | null): T {
        if (this.isNone()) {
            throw new Error(
                message !== null ? (message ?? "Called `unwrap` on a `None` value") : undefined,
            );
        }

        return this.value;
    }

    /**
     * Unwrap the `Some` value, or return a default value if `Option` is `None`
     */
    unwrapOr(defaultValue: T): T {
        return this.isSome() ? this.value : defaultValue;
    }

    /**
     * Unwrap the `Some` value, or compute it from a function if `Option` is `None`
     */
    unwrapOrElse(defaultValueGetter: (value: never) => T): T {
        return this.isSome() ? this.value : defaultValueGetter(NONE);
    }

    /**
     * Matches the `Option` variant and executes the corresponding function
     */
    match<U, F = U>(some: (value: T) => U, none: (value: never) => F): U | F {
        return this.isSome() ? some(this.value) : none(NONE);
    }

    /**
     * Returns an iterable object that yields the `Some` value
     */
    iter(): readonly [some: true, value: T] | readonly [some: false, value: never] {
        if (this.isSome()) {
            return [true, this.value];
        } else {
            return [false, NONE as never];
        }
    }

    *[Symbol.iterator](): Iterator<Option<never>, T> {
        if (this.isSome()) {
            return this.value;
        }

        yield this as unknown as Option<never>;

        return this as unknown as T;
    }
}
