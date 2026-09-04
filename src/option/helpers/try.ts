import { isFunction, isPromiseLike } from "@/fp";

import { None } from "./none";
import { Some } from "./some";

import type { Option } from "../option";
import type { AsyncFn, SyncFn } from "@/types";

export interface Try {
    <T>(fn: SyncFn<T>): Option<T>;

    <T>(fn: AsyncFn<T>): Promise<Option<Awaited<T>>>;

    <T>(promise: PromiseLike<T>): Promise<Option<Awaited<T>>>;
}

/* #__NO_SIDE_EFFECTS__ */
export const _try: Try = (fnOrPromise: unknown): any => {
    if (!isFunction(fnOrPromise) && !isPromiseLike(fnOrPromise)) {
        return None();
    }

    if (isPromiseLike(fnOrPromise)) {
        return fnOrPromise.then(
            value => Some(value),
            () => None(),
        );
    }

    try {
        const data = fnOrPromise();
        if (!isPromiseLike(data)) {
            return Some(data);
        }

        return data.then(
            value => Some(value),
            () => None(),
        );
    } catch (error) {
        return None();
    }
};
