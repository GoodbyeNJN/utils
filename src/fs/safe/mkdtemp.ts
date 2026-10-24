import fs, { promises as fsp } from "node:fs";
import os from "node:os";
import path from "node:path";

import { Result } from "@/result/full";

import { pathLikeToPath } from "../shared/utils";

import type {
    MkdtempDisposableOptions,
    MkdtempNonDisposableOptions,
    MkdtempOptions,
} from "../shared/types";
import type { DisposableTempDir } from "node:fs";
import type { DisposableTempDir as AsyncDisposableTempDir } from "node:fs/promises";

const safeMkdtemp = /* #__PURE__ */ Result.wrap(fsp.mkdtemp, Error);
const safeMkdtempDisposable = /* #__PURE__ */ Result.wrap(fsp.mkdtempDisposable, Error);
export async function mkdtemp(
    prefix: string,
    options: MkdtempDisposableOptions,
): Promise<Result<AsyncDisposableTempDir, Error>>;
export async function mkdtemp(
    prefix: string,
    options?: MkdtempNonDisposableOptions,
): Promise<Result<string, Error>>;
export async function mkdtemp(
    prefix: string,
    options?: MkdtempOptions,
): Promise<Result<AsyncDisposableTempDir, Error> | Result<string, Error>> {
    const { cwd = os.tmpdir(), disposable } = options || {};

    const temp = path.join(pathLikeToPath(cwd), prefix);
    const dir = disposable ? await safeMkdtempDisposable(temp) : await safeMkdtemp(temp);

    return dir as any;
}

const safeMkdtempSync = /* #__PURE__ */ Result.wrap(fs.mkdtempSync, Error);
const safeMkdtempDisposableSync = /* #__PURE__ */ Result.wrap(fs.mkdtempDisposableSync, Error);
export function mkdtempSync(
    prefix: string,
    options: MkdtempDisposableOptions,
): Result<DisposableTempDir, Error>;
export function mkdtempSync(
    prefix: string,
    options?: MkdtempNonDisposableOptions,
): Result<string, Error>;
export function mkdtempSync(
    prefix: string,
    options?: MkdtempOptions,
): Result<DisposableTempDir, Error> | Result<string, Error> {
    const { cwd = os.tmpdir(), disposable } = options || {};

    const temp = path.join(pathLikeToPath(cwd), prefix);
    const dir = disposable ? safeMkdtempDisposableSync(temp) : safeMkdtempSync(temp);

    return dir as any;
}
