import { isObjectType, purry } from "remeda";

import type { NarrowedTo } from "./types";

/**
 *
 * @param data - The object to test.
 * @param properties - The properties to test against.
 * @signature
 *    R.hasOwnProperty(data, properties)
 * @example
 *    R.hasOwnProperty({ a: 1, b: 2, c: 3 }, ["a", "b"]) //=> true
 *    R.hasOwnProperty({ a: 1, b: 2, c: 3 }, ["d"]) //=> false
 * @dataFirst
 * @category Guard
 */
export function hasOwnProperty<T extends object, P extends readonly PropertyKey[]>(
    data: Record<PropertyKey, unknown> | T,
    properties: P,
): data is NarrowedTo<T, { [K in P[number]]: unknown }>;

/**
 *
 * @param properties - The properties to test against.
 * @signature
 *    R.hasOwnProperty(properties)(data)
 * @example
 *    R.hasOwnProperty(["a", "b"])({ a: 1, b: 2, c: 3 }) //=> true
 *    R.hasOwnProperty(["d"])({ a: 1, b: 2, c: 3 }) //=> false
 * @dataLast
 * @category Guard
 */
export function hasOwnProperty<P extends readonly PropertyKey[]>(
    properties: P,
): <T extends object>(
    data: Record<PropertyKey, unknown> | T,
) => data is NarrowedTo<T, { [K in P[number]]: unknown }>;

export function hasOwnProperty(...args: ReadonlyArray<unknown>): unknown {
    return purry(hasOwnPropertyImplementation, args);
}

function hasOwnPropertyImplementation<T extends object, P extends readonly PropertyKey[]>(
    data: Record<PropertyKey, unknown> | T,
    properties: P,
): data is NarrowedTo<T, { [K in P[number]]: unknown }> {
    if (!isObjectType(data)) return false;

    for (const property of properties) {
        if (!Object.hasOwn(data, property)) {
            return false;
        }
    }

    return true;
}
