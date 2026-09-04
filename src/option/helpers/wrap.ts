import { _try } from "./try";

import type { Option } from "../option";
import type { AsyncFn, Fn, SyncFn } from "@/types";

export interface Wrap {
    <A extends any[], T>(fn: SyncFn<T, A>): SyncFn<Option<T>, A>;

    <A extends any[], T>(fn: AsyncFn<T, A>): AsyncFn<Option<Awaited<T>>, A>;
}

/* #__NO_SIDE_EFFECTS__ */
export const wrap: Wrap = (fn: unknown): Fn => {
    return (...args) => {
        return _try(() => (fn as Fn)(...args));
    };
};
