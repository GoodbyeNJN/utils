import { isFunction, isPromiseLike } from "@/fp";
import { normalizeError } from "@/tools";

import { Err } from "./err";
import { Ok } from "./ok";

import type { Result } from "../result";
import type { AsyncFn, Fn, SyncFn } from "@/types";

export interface Try {
    <T, E = unknown>(fn: SyncFn<T>): Result<T, E>;
    <T>(fn: SyncFn<T>, onThrow: ErrorConstructor): Result<T, Error>;
    <T, E>(fn: SyncFn<T>, onThrow: (error: unknown) => E): Result<T, E>;

    <T, E = unknown>(fn: AsyncFn<T>): Promise<Result<Awaited<T>, E>>;
    <T>(fn: AsyncFn<T>, onThrowOrReject: ErrorConstructor): Promise<Result<Awaited<T>, Error>>;
    <T, E>(fn: AsyncFn<T>, onThrowOrReject: (error: unknown) => E): Promise<Result<Awaited<T>, E>>;

    <T, E = unknown>(promise: PromiseLike<T>): Promise<Result<Awaited<T>, E>>;
    <T>(promise: PromiseLike<T>, onReject: ErrorConstructor): Promise<Result<Awaited<T>, Error>>;
    <T, E>(
        promise: PromiseLike<T>,
        onReject: (error: unknown) => E,
    ): Promise<Result<Awaited<T>, E>>;
}

const transformError = (error: unknown, onThrow: Fn | undefined) => {
    if (!onThrow) return error;
    if (onThrow === Error) return normalizeError(error, transformError);

    return onThrow(error);
};

/* #__NO_SIDE_EFFECTS__ */
export const _try: Try = (fnOrPromise: unknown, onThrow?: Fn): any => {
    if (!isFunction(fnOrPromise) && !isPromiseLike(fnOrPromise)) {
        const error = new TypeError("Argument must be a function or a promise");

        return Err(transformError(error, onThrow));
    }

    if (isPromiseLike(fnOrPromise)) {
        return fnOrPromise.then(
            value => Ok(value),
            (error: unknown) => Err(transformError(error, onThrow)),
        );
    }

    try {
        const data = fnOrPromise();
        if (!isPromiseLike(data)) {
            return Ok(data);
        }

        return data.then(
            value => Ok(value),
            (error: unknown) => Err(transformError(error, onThrow)),
        );
    } catch (error) {
        return Err(transformError(error, onThrow));
    }
};
