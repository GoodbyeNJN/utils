import { isObjectType, purry } from "remeda";

import type { NarrowedTo } from "./types";

/**
 * @category Guard
 * @example
 *     R.hasOwnProperty({ a: 1, b: 2, c: 3 }, ["a", "b"]); //=> true
 *     R.hasOwnProperty({ a: 1, b: 2, c: 3 }, ["d"]); //=> false
 *
 * @param data - The object to test.
 * @param properties - The properties to test against.
 * @signature R.hasOwnProperty(data, properties)
 * @dataFirst
 */
export function hasOwnProperty<T extends object, P extends readonly PropertyKey[]>(
    data: Record<PropertyKey, unknown> | T,
    properties: P,
): data is NarrowedTo<T, { [K in P[number]]: unknown }>;

/**
 * @category Guard
 * @example
 *     R.hasOwnProperty(["a", "b"])({ a: 1, b: 2, c: 3 }); //=> true
 *     R.hasOwnProperty(["d"])({ a: 1, b: 2, c: 3 }); //=> false
 *
 * @param properties - The properties to test against.
 * @signature R.hasOwnProperty(properties)(data)
 * @dataLast
 */
export function hasOwnProperty<P extends readonly PropertyKey[]>(
    properties: P,
): <T extends object>(
    data: Record<PropertyKey, unknown> | T,
) => data is NarrowedTo<T, { [K in P[number]]: unknown }>;

export function hasOwnProperty(...args: readonly unknown[]): unknown {
    return purry(hasOwnPropertyImplementation, args);
}

/* #__NO_SIDE_EFFECTS__ */
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
