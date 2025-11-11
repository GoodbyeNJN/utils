import { glob as tinyGlob, globSync as tinyGlobSync } from "tinyglobby";

import type { GlobOptions } from "tinyglobby";

export const glob = (
    patterns: string | readonly string[],
    options?: Omit<GlobOptions, "patterns">,
): Promise<string[]> =>
    tinyGlob(patterns, {
        expandDirectories: false,
        ...options,
    });

export const globSync = (
    patterns: string | readonly string[],
    options: Omit<GlobOptions, "patterns"> = {},
): string[] =>
    tinyGlobSync(patterns, {
        expandDirectories: false,
        ...options,
    });

export { convertPathToPattern, escapePath, isDynamicPattern } from "tinyglobby";

export type { FileSystemAdapter, GlobOptions } from "tinyglobby";
