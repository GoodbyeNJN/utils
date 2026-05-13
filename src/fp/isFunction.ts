// oxlint-disable typescript/no-unsafe-function-type

type DefinitelyFunction<T> = Extract<T, Function> extends never ? Function : Extract<T, Function>;

/**
 * A function that checks if the passed parameter is a Function and narrows its type accordingly.
 *
 * @category Guard
 * @example
 *     R.isFunction(() => {}); //=> true
 *     R.isFunction("somethingElse"); //=> false
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Function, false otherwise.
 * @signature R.isFunction(data)
 */

/* #__NO_SIDE_EFFECTS__ */
export function isFunction<T>(data: Function | T): data is DefinitelyFunction<T> {
    return typeof data === "function";
}
