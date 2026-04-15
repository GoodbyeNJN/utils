import { describe, expect, it } from "vitest";

import { NonZeroExitError } from "@/exec/error";
import { exec as safeExec } from "@/exec/safe";

describe("invocation styles", () => {
    it("should accept a command string", async () => {
        const result = await safeExec("echo hello");
        expect(result.isOk()).toBe(true);
        expect(result.unwrap().stdout.trim()).toBe("hello");
    });

    it("should accept a command with an explicit args array", async () => {
        const result = await safeExec("echo", ["hello", "world"]);
        expect(result.isOk()).toBe(true);
        expect(result.unwrap().stdout.trim()).toBe("hello world");
    });

    it("should accept a template string", async () => {
        const word = "safe";
        const result = await safeExec`echo ${word}`;
        expect(result.isOk()).toBe(true);
        expect(result.unwrap().stdout.trim()).toBe("safe");
    });

    it("should accept a factory options object and return a runner", async () => {
        const run = safeExec({ throwOnError: false });
        const result = await run("echo factory");
        expect(result.isOk()).toBe(true);
        expect(result.unwrap().stdout.trim()).toBe("factory");
    });
});

describe("output", () => {
    it("should capture stdout in the Ok value", async () => {
        const result = await safeExec("echo out");
        expect(result.unwrap().stdout.trim()).toBe("out");
    });

    it("should capture stderr in the Ok value", async () => {
        const result = await safeExec("sh -c 'echo err >&2'");
        expect(result.unwrap().stderr.trim()).toBe("err");
    });

    it("should include the exit code in the Ok value", async () => {
        const result = await safeExec("sh -c 'exit 0'");
        expect(result.unwrap().exitCode).toBe(0);
    });

    it("should return Ok with a non-zero exit code when throwOnError is false", async () => {
        const result = await safeExec("sh -c 'exit 3'");
        expect(result.isOk()).toBe(true);
        expect(result.unwrap().exitCode).toBe(3);
    });
});

describe("throwOnError", () => {
    it("should return Err with NonZeroExitError when throwOnError is true and exit code is non-zero", async () => {
        const result = await safeExec({ throwOnError: true })("sh -c 'exit 1'");
        expect(result.isErr()).toBe(true);
        expect(NonZeroExitError.is(result.unwrapErr())).toBe(true);
    });

    it("should return Ok when throwOnError is true but exit code is 0", async () => {
        const result = await safeExec({ throwOnError: true })("echo ok");
        expect(result.isOk()).toBe(true);
        expect(result.unwrap().exitCode).toBe(0);
    });
});

describe("abort / timeout", () => {
    it("should return Ok when aborted mid-run", async () => {
        const controller = new AbortController();
        const p = safeExec({ signal: controller.signal })("sleep 10");
        controller.abort();
        const result = await p;
        expect(result.isOk()).toBe(true);
    });

    it("should return Ok when an already-aborted signal is provided", async () => {
        const controller = new AbortController();
        controller.abort();
        const result = await safeExec({ signal: controller.signal })("echo hi");
        expect(result.isOk()).toBe(true);
    });
});

describe("process instance properties", () => {
    it("should expose a numeric pid after spawning", () => {
        const p = safeExec("sleep 1");
        expect(typeof p.pid).toBe("number");
        p.kill();
    });

    it("should report killed === true after kill()", async () => {
        const p = safeExec("sleep 10");
        p.kill();
        await p.then(null, () => {});
        expect(p.killed).toBe(true);
    });
});

describe("async iterator", () => {
    it("should yield all output lines via async iteration", async () => {
        const lines: string[] = [];
        for await (const result of safeExec("printf 'line1\\\\nline2\\\\nline3'")) {
            lines.push(result.unwrap());
        }
        expect(lines).toStrictEqual(["line1", "line2", "line3"]);
    });
});

describe("pipe", () => {
    it("should pipe stdout to the next process and return Ok", async () => {
        const result = await safeExec("echo piped").pipe`cat`;
        expect(result.isOk()).toBe(true);
        expect(result.unwrap().stdout.trim()).toBe("piped");
    });
});

describe("exec on Process instance", () => {
    it("should start a new command on the same instance", async () => {
        const result = await safeExec("echo first").exec("echo second");
        expect(result.unwrap().stdout.trim()).toBe("second");
    });
});
