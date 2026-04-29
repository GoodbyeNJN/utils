/* eslint-disable @typescript-eslint/unified-signatures */

import { Err, Result } from "@/result";

const safeStringify = /* #__PURE__ */ Result.wrap(JSON.stringify);
/* #__NO_SIDE_EFFECTS__ */
export const stringify: {
    (
        value: any,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number,
    ): Result<string, TypeError>;
    (
        value: any,
        replacer?: (number | string)[] | null,
        space?: string | number,
    ): Result<string, TypeError>;
} = (value: any, replacer?: any, space?: any): Result<string, TypeError> =>
    Result.gen(function* () {
        const text = yield* (
            safeStringify(value, replacer, space) as Result<string | undefined, TypeError>
        ).context(`Failed to stringify value: ${String(value)}`);
        if (text === undefined) {
            return Err(new TypeError(`Value cannot be stringified: ${String(value)}`));
        }

        return text;
    });

const safeParse = /* #__PURE__ */ Result.wrap(JSON.parse);
/* #__NO_SIDE_EFFECTS__ */
export const parse = <T = any>(
    text: string,
    reviver?: (this: any, key: string, value: any) => any,
): Result<T, SyntaxError> =>
    (safeParse(text, reviver) as Result<T, SyntaxError>).context(
        `Failed to parse JSON string: ${text.length > 100 ? text.slice(0, 100) + "..." : text}`,
    );
