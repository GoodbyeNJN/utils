/* eslint-disable @typescript-eslint/unified-signatures */

import { isFunction } from "@/fp";

import { _try } from "./try";

import type { Result } from "../result";
import type { AsyncFn, Fn, SyncFn } from "@/types";

export interface Wrap {
    <A extends any[], T, E = unknown>(fn: SyncFn<T, A>): SyncFn<Result<T, E>, A>;
    <A extends any[], T>(fn: SyncFn<T, A>, onThrow: ErrorConstructor): SyncFn<Result<T, Error>, A>;
    <A extends any[], T, E>(
        fn: SyncFn<T, A>,
        onThrow: (error: unknown) => E,
    ): SyncFn<Result<T, E>, A>;

    <A extends any[], T, E = unknown>(fn: AsyncFn<T, A>): AsyncFn<Result<Awaited<T>, E>, A>;
    <A extends any[], T>(
        fn: AsyncFn<T, A>,
        onThrowOrReject: ErrorConstructor,
    ): AsyncFn<Result<Awaited<T>, Error>, A>;
    <A extends any[], T, E>(
        fn: AsyncFn<T, A>,
        onThrowOrReject: (error: unknown) => E,
    ): AsyncFn<Result<Awaited<T>, E>, A>;
}

/* #__NO_SIDE_EFFECTS__ */
export const wrap: Wrap = (fn: unknown, onThrow?: Fn): Fn => {
    if (!isFunction(fn)) {
        const error = new TypeError("Argument must be a function");

        return () => {
            return _try(() => {
                throw error;
            }, onThrow as Fn);
        };
    }

    return (...args) => {
        return _try(() => (fn as Fn)(...args), onThrow as Fn);
    };
};
