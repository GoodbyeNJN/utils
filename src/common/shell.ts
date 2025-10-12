import { isString } from "@/remeda";
import { Result } from "@/result";

import { PromiseWithResolvers } from "./promise";

export interface ShellExecResult {
    stdout: string;
    stderr: string;
}

const REGEXP_NULL_CHAR = /\x00+/g;
const REGEXP_SAFE_CHARS = /^[A-Za-z0-9,:=_./-]+$/;
const REGEXP_SINGLE_QUOTES = /'+/g;

export async function $(cmd: string): Promise<Result<ShellExecResult, Error>>;
export async function $(
    cmd: TemplateStringsArray,
    ...values: any[]
): Promise<Result<ShellExecResult, Error>>;
export async function $(cmd: string | TemplateStringsArray, ...values: any[]) {
    const { exec } = await import("node:child_process");

    const command = isString(cmd)
        ? cmd
        : cmd.reduce((acc, part, index) => acc + part + (values[index] ?? ""), "");

    const fn = async () => {
        const { promise, reject, resolve } = PromiseWithResolvers<ShellExecResult>();

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
            }
        });

        return await promise;
    };
    const result = (await Result.fromCallable(fn, Error)).context(
        `Failed to execute command: ${cmd}`,
    );

    return result;
}

export const quoteShellArg = (arg: string) => {
    if (!arg) return "''";

    const cleaned = String(arg).replace(REGEXP_NULL_CHAR, "");

    const matches = REGEXP_SAFE_CHARS.exec(cleaned);
    if (matches?.[0].length === cleaned.length) return cleaned;

    const quoted = cleaned.replace(REGEXP_SINGLE_QUOTES, matched =>
        matched.length === 1 ? `'\\''` : `'"${matched}"'`,
    );
    const trimmed = `'${quoted}'`.replace(/^''/, "").replace(/''$/, "");

    return trimmed;
};
