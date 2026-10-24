import { createTry } from "../../shared/try";
import { Err } from "./err";
import { Ok } from "./ok";

import type { Result } from "../result";
import type { AsyncFn, SyncFn } from "@/types";

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

/* #__NO_SIDE_EFFECTS__ */
export const _try: Try = createTry(Ok, Err);
