import { spawn } from "node:child_process";

import { beforeEach, describe, expect, test, vi } from "vitest";

import { exec } from "@/exec/safe";
import { NonZeroExitError } from "@/exec/shared/error";

vi.mock("node:child_process", { spy: true });

beforeEach(() => {
    vi.mocked(spawn).mockReset();
});

const getSpawnParams = () => {
    const [command, args, options] = vi.mocked(spawn).mock.calls[0] || [];
    const params = { command, args, options };

    return params;
};

describe("invocation styles", () => {
    test("should accept a command string", async () => {
        const result = await exec("echo hello");

        expect(result.isOk()).toBe(true);
        const { command, args } = getSpawnParams();
        expect(command).toBe("echo");
        expect(args).toStrictEqual(["hello"]);
    });

    test("should accept a command with an explicit args array", async () => {
        const result = await exec("echo", ["hello", "world"]);

        expect(result.isOk()).toBe(true);
        const { command, args } = getSpawnParams();
        expect(command).toBe("echo");
        expect(args).toStrictEqual(["hello", "world"]);
    });

    test("should accept a template string", async () => {
        const word = "safe";
        const result = await exec`echo ${word}`;

        expect(result.isOk()).toBe(true);
        const { command, args } = getSpawnParams();
        expect(command).toBe("echo");
        expect(args).toStrictEqual([word]);
    });

    test("should accept a factory options object and return a runner", async () => {
        const run = exec({ throwOnError: false });
        const result = await run("echo factory");

        expect(result.isOk()).toBe(true);
        const { command, args } = getSpawnParams();
        expect(command).toBe("echo");
        expect(args).toStrictEqual(["factory"]);
    });
});

describe("output", () => {
    test("should capture stdout in the Ok value", async () => {
        const result = await exec("echo out");
        expect(result.unwrap().stdout.trim()).toBe("out");
    });

    test("should capture stderr in the Ok value", async () => {
        const result = await exec("sh -c 'echo err >&2'");
        expect(result.unwrap().stderr.trim()).toBe("err");
    });

    test("should include the exit code in the Ok value", async () => {
        const result = await exec("sh -c 'exit 0'");
        expect(result.unwrap().exitCode).toBe(0);
    });

    test("should return Ok with a non-zero exit code when throwOnError is false", async () => {
        const result = await exec("sh -c 'exit 3'");
        expect(result.isOk()).toBe(true);
        expect(result.unwrap().exitCode).toBe(3);
    });
});

describe("throwOnError", () => {
    test("should return Err with NonZeroExitError when throwOnError is true and exit code is non-zero", async () => {
        const result = await exec({ throwOnError: true })("sh -c 'exit 1'");
        expect(result.isErr()).toBe(true);
        expect(NonZeroExitError.is(result.unwrapErr())).toBe(true);
    });

    test("should return Ok when throwOnError is true but exit code is 0", async () => {
        const result = await exec({ throwOnError: true })("echo ok");
        expect(result.isOk()).toBe(true);
        expect(result.unwrap().exitCode).toBe(0);
    });
});

describe("abort / timeout", () => {
    test("should return Ok when aborted mid-run", async () => {
        const controller = new AbortController();
        const p = exec({ signal: controller.signal })("sleep 10");
        controller.abort();
        const result = await p;
        expect(result.isOk()).toBe(true);
    });

    test("should return Ok when an already-aborted signal is provided", async () => {
        const controller = new AbortController();
        controller.abort();
        const result = await exec({ signal: controller.signal })("echo hi");
        expect(result.isOk()).toBe(true);
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
        for await (const result of exec("printf 'line1\\\\nline2\\\\nline3'")) {
            lines.push(result.unwrap());
        }
        expect(lines).toStrictEqual(["line1", "line2", "line3"]);
    });
});

describe("pipe", () => {
    test("should pipe stdout to the next process and return Ok", async () => {
        const result = await exec("echo piped").pipe`cat`;
        expect(result.isOk()).toBe(true);
        expect(result.unwrap().stdout.trim()).toBe("piped");
    });
});

describe("exec on Process instance", () => {
    test("should start a new command on the same instance", async () => {
        const result = await exec("echo first").exec("echo second");
        expect(result.unwrap().stdout.trim()).toBe("second");
    });
});
