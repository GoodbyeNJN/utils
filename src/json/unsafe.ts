/* eslint-disable @typescript-eslint/unified-signatures */

import { nil } from "@/common";

import type { Nil } from "@/common";

export function stringify(
    value: any,
    replacer?: (this: any, key: string, value: any) => any,
    space?: string | number,
): string | Nil;
export function stringify(
    value: any,
    replacer?: (number | string)[] | null,
    space?: string | number,
): string | Nil;
export function stringify(value: any, replacer?: any, space?: any): string | Nil {
    const text = JSON.stringify(value, replacer, space);

    return text === undefined ? nil : text;
}

export const parse = <T = any>(
    text: string,
    reviver?: (this: any, key: string, value: any) => any,
): T | Nil => {
    try {
        return JSON.parse(text, reviver);
    } catch {
        return nil;
    }
};
