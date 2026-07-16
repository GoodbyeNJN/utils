import fs, { promises as fsp } from "node:fs";
import os from "node:os";
import path from "node:path";

import { pathLikeToPath } from "../shared/utils";

import type {
    MkdtempDisposableOptions,
    MkdtempNonDisposableOptions,
    MkdtempOptions,
} from "../shared/types";
import type { DisposableTempDir } from "node:fs";
import type { DisposableTempDir as AsyncDisposableTempDir } from "node:fs/promises";

export async function mkdtemp(
    prefix: string,
    options: MkdtempDisposableOptions,
): Promise<AsyncDisposableTempDir>;
export async function mkdtemp(
    prefix: string,
    options?: MkdtempNonDisposableOptions,
): Promise<string>;
export async function mkdtemp(
    prefix: string,
    options?: MkdtempOptions,
): Promise<AsyncDisposableTempDir | string> {
    const { cwd = os.tmpdir(), disposable } = options || {};

    const temp = path.join(pathLikeToPath(cwd), prefix);
    const dir = disposable ? await fsp.mkdtempDisposable(temp) : await fsp.mkdtemp(temp);

    return dir;
}

export function mkdtempSync(prefix: string, options: MkdtempDisposableOptions): DisposableTempDir;
export function mkdtempSync(prefix: string, options?: MkdtempNonDisposableOptions): string;
export function mkdtempSync(prefix: string, options?: MkdtempOptions): DisposableTempDir | string {
    const { cwd = os.tmpdir(), disposable } = options || {};

    const temp = path.join(pathLikeToPath(cwd), prefix);
    const dir = disposable ? fs.mkdtempDisposableSync(temp) : fs.mkdtempSync(temp);

    return dir;
}
