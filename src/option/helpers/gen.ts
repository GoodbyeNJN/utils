import { isPromiseLike } from "@/fp";

import { isOption } from "./isOption";
import { Some } from "./some";

import type { Option } from "../option";
import type { InferSomeType } from "../types";
import type { Fn } from "@/types";

export interface Gen {
    <T, This>(body: (this: This) => Iterator<Option<never>, Option<T> | T>, self?: This): Option<T>;
    <YieldNone extends Option<never>, ReturnOption extends Option, This>(
        body: (this: This) => Iterator<YieldNone, ReturnOption>,
        self?: This,
    ): Option<ReturnOption extends Option ? InferSomeType<ReturnOption> : ReturnOption>;

    <T, This>(
        body: (this: This) => AsyncIterator<Option<never>, Option<T> | T>,
        self?: This,
    ): Promise<Option<T>>;
    <YieldNone extends Option<never>, ReturnOption extends Option, This>(
        body: (this: This) => AsyncIterator<YieldNone, ReturnOption>,
        self?: This,
    ): Promise<Option<ReturnOption extends Option ? InferSomeType<ReturnOption> : ReturnOption>>;
}

/* #__NO_SIDE_EFFECTS__ */
export const gen: Gen = (body: Fn<Iterator<any> | AsyncIterator<any>>, self?: any): any => {
    const iter = body.call(self);
    const next = iter.next();

    const handle = (option: IteratorResult<any, any>): any => {
        if (!option.done) return option.value;

        return isOption(option.value) ? option.value : Some(option.value);
    };

    if (isPromiseLike(next)) {
        return next.then(handle);
    }

    return handle(next);
};
