import { isFunction } from "@/remeda";

import type { AsyncFn, Fn } from "@/types";

export interface PromiseWithResolvers<T> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}

export const sleep = (ms: number, callback?: Fn) =>
    new Promise<void>(resolve => {
        setTimeout(async () => {
            await callback?.();

            resolve();
        }, ms);
    });

export const createSingleton = <T>(fn: AsyncFn<T>) => {
    let p: Promise<T> | undefined;

    const wrapper = () => {
        if (!p) {
            p = fn();
        }

        return p;
    };

    wrapper.reset = async () => {
        const prev = p;
        p = undefined;

        if (prev) {
            await prev;
        }
    };

    return wrapper;
};

/**
 * @example
 * ```
 * const lock = createLock()
 *
 * lock.run(async () => {
 *   await doSomething()
 * })
 *
 * // in anther context:
 * await lock.wait() // it will wait all tasking finished
 * ```
 */
export const createLock = () => {
    const locks: Promise<any>[] = [];

    return {
        async run<T = void>(fn: AsyncFn<T>): Promise<T> {
            const p = fn();
            locks.push(p);

            try {
                return await p;
            } finally {
                const index = locks.indexOf(p);
                if (index >= 0) {
                    locks.splice(index, 1);
                }
            }
        },

        async wait(): Promise<void> {
            await Promise.allSettled(locks);
        },

        isWaiting() {
            return locks.length > 0;
        },

        clear() {
            locks.length = 0;
        },
    };
};

export const PromiseWithResolvers = <T>(): PromiseWithResolvers<T> => {
    if (isFunction(Promise.withResolvers)) {
        return Promise.withResolvers<T>();
    }

    let resolve: PromiseWithResolvers<T>["resolve"];
    let reject: PromiseWithResolvers<T>["reject"];
    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });

    return { promise, resolve: resolve!, reject: reject! };
};
