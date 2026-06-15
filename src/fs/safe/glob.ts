import { Result } from "@/result";

import { glob as unsafeGlob, globSync as unsafeGlobSync } from "../unsafe/glob";

import type { Glob as UnsafeGlob, GlobSync as UnsafeGlobSync } from "../unsafe/glob";
import type { SetReturnType } from "@/types";

export type {
    GlobOptions,
    GlobOptionsWithFileTypes,
    GlobOptionsWithoutFileTypes,
} from "../unsafe/glob";

export type Glob = SetReturnType<UnsafeGlob, Promise<Result<Awaited<ReturnType<UnsafeGlob>>>>>;
export type GlobSync = SetReturnType<UnsafeGlobSync, Result<ReturnType<UnsafeGlobSync>>>;

const safeGlob = /* #__PURE__ */ Result.wrap(unsafeGlob, Error);
export const glob: Glob = async (...args: [any]) =>
    (await safeGlob(...args)).context("Failed to perform glob operation");

const safeGlobSync = /* #__PURE__ */ Result.wrap(unsafeGlobSync, Error);
export const globSync: GlobSync = (...args: [any]) =>
    safeGlobSync(...args).context("Failed to perform glob operation");
