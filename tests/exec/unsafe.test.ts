import { describe, expect, it } from "vitest";

import { NonZeroExitError } from "@/exec/error";
import { exec } from "@/exec/unsafe";

describe("invocation styles", () => {
    it("should accept a command string", async () => {
        const output = await exec("echo hello");
        expect(output.stdout.trim()).toBe("hello");
    });

    it("should accept a command with an explicit args array", async () => {
        const output = await exec("echo", ["hello", "world"]);
        expect(output.stdout.trim()).toBe("hello world");
    });

    it("should accept a template string", async () => {
        const word = "world";
        const output = await exec`echo ${word}`;
        expect(output.stdout.trim()).toBe("world");
    });

    it("should accept a factory options object and return a runner", async () => {
        const run = exec({ throwOnError: false });
        const output = await run("echo factory");
        expect(output.stdout.trim()).toBe("factory");
    });
});

describe("output", () => {
    it("should capture stdout", async () => {
        const { stdout } = await exec("echo out");
        expect(stdout.trim()).toBe("out");
    });

    it("should capture stderr", async () => {
        const { stderr } = await exec("sh -c 'echo err >&2'");
        expect(stderr.trim()).toBe("err");
    });

    it("should include the exit code in the output", async () => {
        const { exitCode } = await exec("sh -c 'exit 0'");
        expect(exitCode).toBe(0);
    });

    it("should capture a non-zero exit code without throwing by default", async () => {
        const { exitCode } = await exec("sh -c 'exit 42'");
        expect(exitCode).toBe(42);
    });
});

describe("throwOnError", () => {
    it("should throw NonZeroExitError when throwOnError is true and exit code is non-zero", async () => {
        await expect(exec({ throwOnError: true })("sh -c 'exit 1'")).rejects.toBeInstanceOf(
            NonZeroExitError,
        );
    });

    it("should not throw when throwOnError is true but exit code is 0", async () => {
        const output = await exec({ throwOnError: true })("echo ok");
        expect(output.exitCode).toBe(0);
    });
});

describe("abort / timeout", () => {
    it("should not throw when an already-aborted signal is provided", async () => {
        const controller = new AbortController();
        controller.abort();
        await expect(exec({ signal: controller.signal })("echo hi")).resolves.not.toThrow();
    });

    it("should not throw when aborted mid-run", async () => {
        const controller = new AbortController();
        const p = exec({ signal: controller.signal })("sleep 10");
        controller.abort();
        await expect(p).resolves.not.toThrow();
    });
});

describe("process instance properties", () => {
    it("should expose a numeric pid after spawning", () => {
        const p = exec("sleep 1");
        expect(typeof p.pid).toBe("number");
        p.kill();
    });

    it("should report killed === true after kill()", async () => {
        const p = exec("sleep 10");
        p.kill();
        await p.then(null, () => {});
        expect(p.killed).toBe(true);
    });
});

describe("async iterator", () => {
    it("should yield all output lines via async iteration", async () => {
        const lines: string[] = [];
        for await (const line of exec("printf 'line1\\\\nline2\\\\nline3'")) {
            lines.push(line);
        }
        expect(lines).toStrictEqual(["line1", "line2", "line3"]);
    });
});

describe("pipe", () => {
    it("should pipe stdout to the next process", async () => {
        const output = await exec("printf 'a.js\\\\nb.ts\\\\nc.json'").pipe`grep '.json'`;
        expect(output.stdout.trim()).toBe("c.json");
    });
});

describe("exec on Process instance", () => {
    it("should start a new command on the same instance", async () => {
        const output = await exec("echo first").exec("echo second");
        expect(output.stdout.trim()).toBe("second");
    });
});
