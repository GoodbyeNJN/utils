import { glob as tinyGlob, globSync as tinyGlobSync } from "tinyglobby";

import { isArray, isString, omit } from "@/remeda";

import type { GlobOptions as TinyGlobOptions } from "tinyglobby";

export type { FileSystemAdapter } from "tinyglobby";

export interface GlobOptions extends Omit<TinyGlobOptions, "patterns"> {
    /**
     * Provide patterns as the first argument instead.
     */
    patterns: string | string[];
}

export { convertPathToPattern, escapePath, isDynamicPattern } from "tinyglobby";

const normalizeArgs = (
    patternsOrOptions: string | string[] | GlobOptions,
    maybeOptions?: Omit<GlobOptions, "patterns">,
) => {
    const patternsAsArgument = isString(patternsOrOptions) || isArray(patternsOrOptions);

    const patterns = patternsAsArgument ? patternsOrOptions : patternsOrOptions.patterns;
    const options = patternsAsArgument ? maybeOptions || {} : omit(patternsOrOptions, ["patterns"]);

    return { patterns, options };
};

export function glob(
    patterns: string | string[],
    options?: Omit<GlobOptions, "patterns">,
): Promise<string[]>;
export function glob(options: GlobOptions): Promise<string[]>;
export function glob(...args: [any, any?]): Promise<string[]> {
    const { patterns, options } = normalizeArgs(...args);

    return tinyGlob(patterns, {
        expandDirectories: false,
        ...options,
    });
}

export function globSync(
    patterns: string | string[],
    options?: Omit<GlobOptions, "patterns">,
): string[];
export function globSync(options: GlobOptions): string[];
export function globSync(...args: [any, any?]): string[] {
    const { patterns, options } = normalizeArgs(...args);

    return tinyGlobSync(patterns, {
        expandDirectories: false,
        ...options,
    });
}
