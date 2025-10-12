/* eslint-disable @typescript-eslint/unified-signatures */

import { normalizeError, stringify } from "@/common";
import { isFunction, isObjectType, isPromiseLike, isString } from "@/remeda";

import type {
    FormatPresets,
    InferErrType,
    InferOkType,
    PrintOptions,
    ResultAll,
    ResultAllSettled,
} from "./types";
import type { AsyncFn, Fn, NonEmptyTuple, SyncFn } from "@/types";

const never = null as never;

export function ok(): Ok<void>;
export function ok<T>(value: T): Ok<T>;
export function ok(value?: unknown): Ok {
    return new Ok(value);
}

export function err(): Err<void>;
export function err<E>(error: E): Err<E>;
export function err(error?: unknown): Err {
    return Err.fromError(error, err);
}

export abstract class Result<T = unknown, E = unknown> {
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
    static try<T, E = unknown>(data: Promise<T>): Promise<Result<Awaited<T>, E>>;
    static try<T>(data: Promise<T>, onThrow: ErrorConstructor): Promise<Result<Awaited<T>, Error>>;
    static try<T, E>(
        data: Promise<T>,
        onThrow: (error: unknown) => E,
    ): Promise<Result<Awaited<T>, E>>;
    static try<T, E = unknown>(data: T): Result<T, E>;
    static try<T>(data: T, onThrow: ErrorConstructor): Result<T, Error>;
    static try<T, E>(data: T, onThrow: (error: unknown) => E): Result<T, E>;
    static try(fnOrData: unknown, onThrow?: Fn): any {
        const transformError = (error: unknown) => {
            if (!onThrow) return error;
            if (onThrow === Error) return normalizeError(error);

            return onThrow(error);
        };

        try {
            let data = fnOrData;

            if (isFunction(fnOrData)) {
                data = fnOrData();
            }

            if (!isPromiseLike(data)) return ok(data);

            return data.then(
                value => ok(value),
                error => Err.fromError(transformError(error), Result.try),
            );
        } catch (error) {
            return Err.fromError(transformError(error), Result.try);
        }
    }

    static all<T extends NonEmptyTuple<Result>>(results: T): ResultAll<T>;
    static all<T extends readonly Result[]>(results: T): ResultAll<T>;
    static all(results: Result[]) {
        let acc: Result<unknown[]> = ok([]);

        for (const result of results) {
            if (!result.isOk()) {
                acc = Err.fromError(result.error, Result.all);
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
                acc = Err.fromError([result.error], Result.allSettled);
            }
        }

        return acc;
    }

    protected readonly contexts: (string | Fn<string>)[] = [];

    private readonly ok: boolean;

    private readonly value: T;

    private readonly error: E;

    protected constructor(ok: boolean, error: E, value: T) {
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
     * Maps `Result<T, E>` to `Result<U, E>`
     */
    map<U>(fn: (value: T) => U): Result<U, E> {
        return this.isErr() ? this : ok(fn(this.value));
    }

    /**
     * Maps `Result<T, E>` to `Result<T, F>`
     */
    mapErr<F>(fn: (error: E) => F): Result<T, F> {
        return this.isOk() ? this : Err.fromError(fn(this.error), this.mapErr);
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
     * Unwrap the `Ok` value, or throw an error if `Result` is `Err`
     */
    unwrap(): T {
        if (this.isErr()) {
            throw this.unwrapErr();
        }

        return this.value;
    }

    /**
     * Unwrap the `Err` value, or throw an error if `Result` is `Ok`
     */
    unwrapErr(): E {
        if (this.isOk()) {
            throw this.unwrap();
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
    iter(): [ok: boolean, error: E, value: T] {
        if (this.isOk()) {
            return [true, never, this.value];
        } else {
            return [false, this.error, never];
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

    context(context: string): this {
        this.contexts.push(context);

        return this;
    }

    withContext(contextGetter: Fn<string>): this {
        this.contexts.push(contextGetter);

        return this;
    }

    abstract toString(): string;

    abstract toJSON(): string;
}

export class Ok<T = unknown> extends Result<T, never> {
    constructor(value: T) {
        super(true, never, value);
    }

    override toString(): string {
        const value = stringify(this["value"]);

        return `Ok(${value})`;
    }

    override toJSON(): string {
        return this.toString();
    }
}

export class Err<E = unknown> extends Result<never, E> {
    static fromError<E = unknown>(error: E, caller: Function): Err<E> {
        const err = new Err(error);

        if (error instanceof Error) {
            err.stack = error.stack;
        } else if ("captureStackTrace" in Error) {
            const dummy = {} as unknown as Error;
            Error.captureStackTrace(dummy, caller);
            err.stack = dummy.stack;
        }

        return err;
    }

    private stack: string | undefined;

    constructor(error: E) {
        super(false, error, never);
    }

    toError(): Error {
        return normalizeError(this["error"]);
    }

    format(): string;
    format(preset: FormatPresets): string;
    format(options: PrintOptions): string;
    format(presetOrOptions?: FormatPresets | PrintOptions): string {
        const options = this.normalize(presetOrOptions);

        const message = this.toError().message;
        const contexts = this["contexts"]
            .slice()
            .toReversed()
            .map(ctx => (isFunction(ctx) ? ctx() : ctx));
        const stacks = this.stack
            ?.split("\n")
            .map(line => line.trim())
            .filter(Boolean) || ["<no stack trace>"];

        const lines: (string | string[])[] = [
            `Error: ${contexts.length > 0 ? contexts.at(0) : message}`,
        ];

        if (options.context) {
            lines.push(
                "",
                "Caused by:",
                contexts
                    .slice(1)
                    .concat(message)
                    .map((line, index) => `    ${index}: ${line}`),
            );
        }

        if (options.stack) {
            const top = stacks.at(0) || "";
            const hasErrorMessage =
                new RegExp(`^\\w+:\\s+${message}$`).test(top) || /^\w+$/.test(top);

            lines.push(
                "",
                "Stack trace:",
                stacks.slice(hasErrorMessage ? 1 : 0).map(line => `    ${line}`),
            );
        }

        const output = lines.flat().join("\n");

        return output;
    }

    print(): void;
    print(preset: FormatPresets): void;
    print(options: PrintOptions): void;
    print(presetOrOptions?: FormatPresets | PrintOptions): void {
        const options = this.normalize(presetOrOptions);

        const output = this.format(options);

        switch (options.level) {
            case "error":
                console.error(output);
                break;
            case "warn":
                console.warn(output);
                break;
            case "info":
                console.info(output);
                break;
        }
    }

    override toString(): string {
        return this.format();
    }

    override toJSON(): string {
        return this.toString();
    }

    private normalize(presetOrOptions?: FormatPresets | PrintOptions): Required<PrintOptions> {
        // Default options, equitable to "standard"
        const options: Required<PrintOptions> = {
            level: "error",
            context: true,
            stack: false,
        };

        if (isString(presetOrOptions)) {
            options.context = presetOrOptions === "full" || presetOrOptions === "standard";
            options.stack = presetOrOptions === "full";
        } else if (isObjectType(presetOrOptions)) {
            options.level = presetOrOptions.level ?? options.level;
            options.context = presetOrOptions.context ?? options.context;
            options.stack = presetOrOptions.stack ?? options.stack;
        }

        return options;
    }
}
