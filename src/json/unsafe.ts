/* eslint-disable @typescript-eslint/unified-signatures */

import { None, Some } from "@/option";

import type { Option } from "@/option";

export function stringify(
    value: any,
    replacer?: (this: any, key: string, value: any) => any,
    space?: string | number,
): Option<string>;
export function stringify(
    value: any,
    replacer?: (number | string)[] | null,
    space?: string | number,
): Option<string>;
/* #__NO_SIDE_EFFECTS__ */
export function stringify(value: any, replacer?: any, space?: any): Option<string> {
    const text = JSON.stringify(value, replacer, space);

    return text === undefined ? None() : Some(text);
}

/* #__NO_SIDE_EFFECTS__ */
export const parse = <T = any>(
    text: string,
    reviver?: (this: any, key: string, value: any) => any,
): Option<T> => {
    try {
        return Some(JSON.parse(text, reviver));
    } catch {
        return None();
    }
};
