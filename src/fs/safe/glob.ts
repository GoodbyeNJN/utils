import { Result } from "@/result/full";

import { glob as unsafeGlob, globSync as unsafeGlobSync } from "../unsafe/glob";

import type {
    GlobOptions,
    GlobOptionsWithFileTypes,
    GlobOptionsWithoutFileTypes,
} from "../shared/types";
import type { Dirent } from "node:fs";

type Glob = {
    (patterns: GlobOptions["patterns"]): Promise<Result<string[], Error>>;
    (
        patterns: GlobOptionsWithFileTypes["patterns"],
        options?: Omit<GlobOptionsWithFileTypes, "patterns">,
    ): Promise<Result<Dirent[], Error>>;
    (
        patterns: GlobOptionsWithoutFileTypes["patterns"],
        options?: Omit<GlobOptionsWithoutFileTypes, "patterns">,
    ): Promise<Result<string[], Error>>;
    (
        patterns: GlobOptions["patterns"],
        options?: Omit<GlobOptions, "patterns">,
    ): Promise<Result<(Dirent | string)[], Error>>;
    (): Promise<Result<string[], Error>>;
    (options: GlobOptionsWithFileTypes): Promise<Result<Dirent[], Error>>;
    (options: GlobOptionsWithoutFileTypes): Promise<Result<string[], Error>>;
    (options: GlobOptions): Promise<Result<(Dirent | string)[], Error>>;
};

type GlobSync = {
    (patterns: GlobOptions["patterns"]): Result<string[], Error>;
    (
        patterns: GlobOptionsWithFileTypes["patterns"],
        options?: Omit<GlobOptionsWithFileTypes, "patterns">,
    ): Result<Dirent[], Error>;
    (
        patterns: GlobOptionsWithoutFileTypes["patterns"],
        options?: Omit<GlobOptionsWithoutFileTypes, "patterns">,
    ): Result<string[], Error>;
    (
        patterns: GlobOptions["patterns"],
        options?: Omit<GlobOptions, "patterns">,
    ): Result<(Dirent | string)[], Error>;
    (): Result<string[], Error>;
    (options: GlobOptionsWithFileTypes): Result<Dirent[], Error>;
    (options: GlobOptionsWithoutFileTypes): Result<string[], Error>;
    (options: GlobOptions): Result<(Dirent | string)[], Error>;
};

const safeGlob = /* #__PURE__ */ Result.wrap(unsafeGlob, Error);
export const glob: Glob = async (...args: [any?]): Promise<Result<any[], Error>> =>
    (await safeGlob(...args)).context("Failed to perform glob operation");

const safeGlobSync = /* #__PURE__ */ Result.wrap(unsafeGlobSync, Error);
export const globSync: GlobSync = (...args: [any?]): Result<any[], Error> =>
    safeGlobSync(...args).context("Failed to perform glob operation");
