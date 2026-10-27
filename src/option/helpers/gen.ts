import { isPromiseLike } from "@/fp";

import { isOption } from "./isOption";
import { Some } from "./some";

import type { Option } from "../option";
import type { InferSomeType } from "../types";
import type { Fn } from "@/types";

export interface Gen {
    <T, This>(body: (this: This) => Generator<Option, Option<T> | T>, self?: This): Option<T>;
    <YieldNone extends Option, ReturnOption extends Option, This>(
        body: (this: This) => Generator<YieldNone, ReturnOption>,
        self?: This,
    ): Option<ReturnOption extends Option ? InferSomeType<ReturnOption> : ReturnOption>;

    <T, This>(
        body: (this: This) => AsyncGenerator<Option, Option<T> | T>,
        self?: This,
    ): Promise<Option<T>>;
    <YieldNone extends Option, ReturnOption extends Option, This>(
        body: (this: This) => AsyncGenerator<YieldNone, ReturnOption>,
        self?: This,
    ): Promise<Option<ReturnOption extends Option ? InferSomeType<ReturnOption> : ReturnOption>>;
}

const handleIteratorResult = (result: IteratorResult<any, any>): any => {
    const { done, value } = result;

    if (!done) return value;

    return isOption(value) ? value : Some(value);
};

/* #__NO_SIDE_EFFECTS__ */
export const gen: Gen = (body: Fn<Generator<any> | AsyncGenerator<any>>, self?: any): any => {
    const next = body.call(self).next();
    if (isPromiseLike(next)) {
        return next.then(handleIteratorResult);
    }

    return handleIteratorResult(next);
};
