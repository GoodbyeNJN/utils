import { configure } from "safe-stable-stringify";

import { Result } from "@/result";

import type { stringify as safeStringify } from "safe-stable-stringify";

export type Stringify = typeof safeStringify;

export const stringify: Stringify = configure({
    bigint: true,
});

const safeParse = <T = any>(
    text: string,
    reviver?: (this: any, key: string, value: any) => any,
): Result<T, Error> => {
    const fn = () => {
        return JSON.parse(text, reviver);
    };
    const result = Result.fromCallable<T>(fn, Error).context(
        `Failed to parse JSON string: ${text.length > 100 ? text.slice(0, 100) + "..." : text}`,
    );

    return result;
};

const unsafeParse = <T = any>(
    text: string,
    reviver?: (this: any, key: string, value: any) => any,
): T | undefined => {
    const result = safeParse<T>(text, reviver);
    if (result.isErr()) return undefined;

    return result.unwrap(null);
};

export { safeParse, unsafeParse as parse };
