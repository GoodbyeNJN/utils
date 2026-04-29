import { funnel } from "remeda";

import type { Fn } from "@/types";

export interface Debounced<T extends Fn> {
    (...args: Parameters<T>): ReturnType<T> | undefined;
    readonly cancel: Fn<void>;
    readonly flush: Fn<ReturnType<T> | undefined>;
    readonly isPending: boolean;
    readonly cachedReturnValue: ReturnType<T> | undefined;
}

/* #__NO_SIDE_EFFECTS__ */
export const debounce = <T extends Fn>(fn: T, wait = 0): Debounced<T> => {
    let cache: ReturnType<T> | undefined;

    const funneled = funnel(
        (args: Parameters<T>) => {
            cache = fn(...args);
        },
        {
            reducer: (_, ...args: Parameters<T>) => args,
            minQuietPeriodMs: wait,
            triggerAt: "end",
        },
    );

    const debounced = (...args: Parameters<T>) => {
        funneled.call(...args);

        return cache;
    };

    Object.assign(debounced, {
        cancel: () => {
            funneled.cancel();
        },
        flush: () => {
            funneled.flush();

            return cache;
        },
        get isPending() {
            return !funneled.isIdle;
        },
        get cachedReturnValue() {
            return cache;
        },
    });

    return debounced as Debounced<T>;
};
