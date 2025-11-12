import { isString } from "@/remeda";
import { Result } from "@/result";

import { createPromiseWithResolvers } from "./promise";
import { concatTemplateStrings } from "./string";

export interface ShellExecOptions {
    onStdout?: "ignore" | "print" | ((chunk: string) => void);
    onStderr?: "ignore" | "print" | ((chunk: string) => void);
}

export interface ShellExecResult {
    stdout: string;
    stderr: string;
}

const REGEXP_NULL_CHAR = /\x00+/g;
const REGEXP_SAFE_CHARS = /^[A-Za-z0-9,:=_./-]+$/;
const REGEXP_SINGLE_QUOTES = /'+/g;

const noop = () => {};
const pipeToStdout = (chunk: string) => process.stdout.write(chunk);
const pipeToStderr = (chunk: string) => process.stderr.write(chunk);

export async function $(
    cmd: string,
    options?: ShellExecOptions,
): Promise<Result<ShellExecResult, Error>>;
export async function $(
    cmd: TemplateStringsArray,
    ...values: any[]
): Promise<Result<ShellExecResult, Error>>;
export async function $(
    cmd: string | TemplateStringsArray,
    ...values: any[]
): Promise<Result<ShellExecResult, Error>> {
    const { spawn } = await import("node:child_process");

    const [command, options] = isString(cmd)
        ? [cmd, (values[0] || {}) as ShellExecOptions]
        : [concatTemplateStrings(cmd, values), {}];
    const onStdout =
        options.onStdout === "ignore"
            ? noop
            : options.onStdout === "print"
              ? pipeToStdout
              : options.onStdout || noop;
    const onStderr =
        options.onStderr === "ignore"
            ? noop
            : options.onStderr === "print"
              ? pipeToStderr
              : options.onStderr || noop;

    const fn = async () => {
        const { promise, reject, resolve } = createPromiseWithResolvers<ShellExecResult>();

        const child = spawn(command, {
            shell: true,
            stdio: ["inherit", "pipe", "pipe"],
        });

        let stdout = "";
        let stderr = "";
        child.stdout?.on("data", data => {
            const chunk = data.toString();
            stdout += chunk;
            onStdout(chunk);
        });
        child.stderr?.on("data", data => {
            const chunk = data.toString();
            stderr += chunk;
            onStderr(chunk);
        });

        child.on("error", reject);
        child.on("close", code => {
            if (code === 0) {
                resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
            } else {
                reject(new Error(`Command exited with code ${code}`));
            }
        });

        return await promise;
    };
    const result = (await Result.fromCallable(fn, Error)).context(
        `Failed to execute command: ${cmd}`,
    );

    return result;
}

export const quoteShellArg = (arg: string): string => {
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
