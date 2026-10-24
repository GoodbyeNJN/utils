import { isFunction, isPromiseLike } from "@/fp";
import { normalizeError } from "@/tools";

import type { Fn } from "@/types";

const transformError = (error: unknown, onThrow: Fn | undefined) => {
    if (!onThrow) return error;
    if (onThrow === Error) return normalizeError(error, transformError);

    return onThrow(error);
};

export const createTry =
    (Ok: Fn, Err: Fn) =>
    (fnOrPromise: unknown, onThrow?: Fn): any => {
        if (!isFunction(fnOrPromise) && !isPromiseLike(fnOrPromise)) {
            const error = new TypeError("Argument must be a function or a promise");

            return Err(transformError(error, onThrow));
        }

        if (isPromiseLike(fnOrPromise)) {
            return fnOrPromise.then(
                value => Ok(value),
                (error: unknown) => Err(transformError(error, onThrow)),
            );
        }

        try {
            const data = fnOrPromise();
            if (!isPromiseLike(data)) {
                return Ok(data);
            }

            return data.then(
                value => Ok(value),
                (error: unknown) => Err(transformError(error, onThrow)),
            );
        } catch (error) {
            return Err(transformError(error, onThrow));
        }
    };
