import { spawn } from "node:child_process";

import { beforeEach, describe, expect, test, vi } from "vitest";

import { NonZeroExitError } from "@/exec/error";
import { exec } from "@/exec/unsafe";

import type { SpawnOptions } from "child_process";

vi.mock("node:child_process", { spy: true });

beforeEach(() => {
    vi.mocked(spawn).mockReset();
});

const getSpawnParams = () => {
    const [command, args, options] = vi.mocked(spawn).mock.calls[0] || [];
    const params = {
        command: command as string | undefined,
        args: args as readonly string[] | undefined,
        options: options as SpawnOptions | undefined,
    };

    return params;
};

describe("invocation styles", () => {
    test("should accept a command string", async () => {
        await exec("echo hello");

        const { command, args } = getSpawnParams();
        expect(command).toBe("echo");
        expect(args).toStrictEqual(["hello"]);
    });

    test("should accept a command with an explicit args array", async () => {
        await exec("echo", ["hello", "world"]);

        const { command, args } = getSpawnParams();
        expect(command).toBe("echo");
        expect(args).toStrictEqual(["hello", "world"]);
    });

    test("should accept a template string", async () => {
        const word = "world";
        await exec`echo ${word}`;

        const { command, args } = getSpawnParams();
        expect(command).toBe("echo");
        expect(args).toStrictEqual([word]);
    });

    test("should accept a factory options object and return a runner", async () => {
        const run = exec({ spawnOptions: { cwd: "/" } });
        await run("echo factory");

        const { command, args, options } = getSpawnParams();
        expect(command).toBe("echo");
        expect(args).toStrictEqual(["factory"]);
        expect(options).toMatchObject({ cwd: "/" });
    });
});

describe("output", () => {
    test("should capture stdout", async () => {
        const { stdout } = await exec("echo out");
        expect(stdout.trim()).toBe("out");
    });

    test("should capture stderr", async () => {
        const { stderr } = await exec("sh -c 'echo err >&2'");
        expect(stderr.trim()).toBe("err");
    });

    test("should include the exit code in the output", async () => {
        const { exitCode } = await exec("sh -c 'exit 0'");
        expect(exitCode).toBe(0);
    });

    test("should capture a non-zero exit code without throwing by default", async () => {
        const { exitCode } = await exec("sh -c 'exit 42'");
        expect(exitCode).toBe(42);
    });
});

describe("throwOnError", () => {
    test("should throw NonZeroExitError when throwOnError is true and exit code is non-zero", async () => {
        await expect(exec({ throwOnError: true })("sh -c 'exit 1'")).rejects.toBeInstanceOf(
            NonZeroExitError,
        );
    });

    test("should not throw when throwOnError is true but exit code is 0", async () => {
        const output = await exec({ throwOnError: true })("echo ok");
        expect(output.exitCode).toBe(0);
    });
});

describe("abort / timeout", () => {
    test("should not throw when an already-aborted signal is provided", async () => {
        const controller = new AbortController();
        controller.abort();
        await expect(exec({ signal: controller.signal })("echo hi")).resolves.not.toThrow();
    });

    test("should not throw when aborted mid-run", async () => {
        const controller = new AbortController();
        const p = exec({ signal: controller.signal })("sleep 10");
        controller.abort();
        await expect(p).resolves.not.toThrow();
    });
});

describe("process instance properties", () => {
    test("should expose a numeric pid after spawning", () => {
        const p = exec("sleep 1");
        expect(typeof p.pid).toBe("number");
        p.kill();
    });

    test("should report killed === true after kill()", async () => {
        const p = exec("sleep 10");
        p.kill();
        await p.then(null, () => {});
        expect(p.killed).toBe(true);
    });
});

describe("async iterator", () => {
    test("should yield all output lines via async iteration", async () => {
        const lines: string[] = [];
        for await (const line of exec("printf 'line1\\\\nline2\\\\nline3'")) {
            lines.push(line);
        }
        expect(lines).toStrictEqual(["line1", "line2", "line3"]);
    });
});

describe("pipe", () => {
    test("should pipe stdout to the next process", async () => {
        const output = await exec("printf 'a.js\\\\nb.ts\\\\nc.json'").pipe`grep '.json'`;
        expect(output.stdout.trim()).toBe("c.json");
    });
});

describe("exec on Process instance", () => {
    test("should start a new command on the same instance", async () => {
        const output = await exec("echo first").exec("echo second");
        expect(output.stdout.trim()).toBe("second");
    });
});
