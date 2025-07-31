import { isString } from "@/remeda";
import { ResultAsync } from "@/result";

import { errorToMessage } from "./error";
import { PromiseWithResolvers } from "./promise";

export function $(cmd: string): ResultAsync<{ stdout: string; stderr: string }, string>;
export function $(
    cmd: TemplateStringsArray,
    ...values: any[]
): ResultAsync<{ stdout: string; stderr: string }, string>;
export function $(cmd: string | TemplateStringsArray, ...values: any[]) {
    const command = isString(cmd)
        ? cmd
        : cmd.reduce((acc, part, index) => acc + part + (values[index] ?? ""), "");

    const promise = import("node:child_process").then(({ exec }) => {
        const { promise, reject, resolve } = PromiseWithResolvers();

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });

        return promise;
    });

    return ResultAsync.fromPromise(promise, errorToMessage(`Failed to execute command: ${cmd}`));
}

const REGEXP_NULL_CHAR = /\x00+/g;
const REGEXP_SAFE_CHARS = /^[A-Za-z0-9,:=_./-]+$/;
const REGEXP_SINGLE_QUOTES = /'+/g;

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
