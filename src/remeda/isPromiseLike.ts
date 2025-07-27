import { isFunction, isObjectType } from "remeda";

import type { NarrowedTo } from "./types";

/**
 * A function that checks if the passed parameter is a isPromiseLike and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a isPromiseLike, false otherwise.
 * @signature
 *    R.isPromiseLike(data)
 * @example
 *    R.isPromiseLike(Promise.resolve(5)) //=> true
 *    R.isPromiseLike(Promise.reject(5)) //=> true
 *    R.isPromiseLike({ then: () => {} }) //=> true
 *    R.isPromiseLike('somethingElse') //=> false
 * @category Guard
 */
export function isPromiseLike<T>(
    data: Readonly<PromiseLike<unknown>> | T,
): data is NarrowedTo<T, PromiseLike<unknown>> {
    return (
        isObjectType(data) &&
        isFunction((data as PromiseLike<unknown>).then) &&
        // Ensure that the `then` method is not a getter or something else
        Object.getOwnPropertyDescriptor(data, "then")?.get === undefined
    );
}
