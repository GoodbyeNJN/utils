import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
    writeFileSync as safeWriteFileSync,
    writeFile,
    writeJson,
    writeJsonSync,
} from "@/fs/safe/write";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-safe-write-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("writeFile", () => {
    it("should write content and return Ok", async () => {
        const file = join(tmpDir, "hello.txt");
        const result = await writeFile(file, "hello world");

        expect(result.isOk()).toBe(true);
        expect(readFileSync(file, "utf-8")).toBe("hello world");
    });

    it("should create parent directories automatically", async () => {
        const file = join(tmpDir, "a", "b", "hello.txt");
        const result = await writeFile(file, "nested");

        expect(result.isOk()).toBe(true);
    });

    it("should overwrite existing file content", async () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "old");
        const result = await writeFile(file, "new");

        expect(result.isOk()).toBe(true);
        expect(readFileSync(file, "utf-8")).toBe("new");
    });
});

describe("writeFileSync", () => {
    it("should write content and return Ok", () => {
        const file = join(tmpDir, "hello.txt");
        const result = safeWriteFileSync(file, "hello world");

        expect(result.isOk()).toBe(true);
        expect(readFileSync(file, "utf-8")).toBe("hello world");
    });

    it("should create parent directories automatically", () => {
        const file = join(tmpDir, "a", "b", "hello.txt");
        const result = safeWriteFileSync(file, "nested");

        expect(result.isOk()).toBe(true);
    });

    it("should overwrite existing file content", () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "old");
        const result = safeWriteFileSync(file, "new");

        expect(result.isOk()).toBe(true);
        expect(readFileSync(file, "utf-8")).toBe("new");
    });
});

describe("writeJson", () => {
    it("should write a JSON object and return Ok", async () => {
        const file = join(tmpDir, "data.json");
        const result = await writeJson(file, { key: "value" });

        expect(result.isOk()).toBe(true);
        expect(JSON.parse(readFileSync(file, "utf-8"))).toEqual({ key: "value" });
    });

    it("should write with a custom indent", async () => {
        const file = join(tmpDir, "data.json");
        const result = await writeJson(file, { a: 1 }, 4);

        expect(result.isOk()).toBe(true);
        expect(readFileSync(file, "utf-8")).toContain("    ");
    });

    it("should write an array", async () => {
        const file = join(tmpDir, "arr.json");
        const result = await writeJson(file, [1, 2, 3]);

        expect(result.isOk()).toBe(true);
        expect(JSON.parse(readFileSync(file, "utf-8"))).toEqual([1, 2, 3]);
    });

    it("should return Err for a non-serializable value", async () => {
        const file = join(tmpDir, "bad.json");
        const result = await writeJson(file, undefined);

        expect(result.isErr()).toBe(true);
    });
});

describe("writeJsonSync", () => {
    it("should write a JSON object and return Ok", () => {
        const file = join(tmpDir, "data.json");
        const result = writeJsonSync(file, { key: "value" });

        expect(result.isOk()).toBe(true);
        expect(JSON.parse(readFileSync(file, "utf-8"))).toEqual({ key: "value" });
    });

    it("should write an array", () => {
        const file = join(tmpDir, "arr.json");
        const result = writeJsonSync(file, [1, 2, 3]);

        expect(result.isOk()).toBe(true);
        expect(JSON.parse(readFileSync(file, "utf-8"))).toEqual([1, 2, 3]);
    });

    it("should write with a custom indent", () => {
        const file = join(tmpDir, "data.json");
        const result = writeJsonSync(file, { a: 1 }, 4);

        expect(result.isOk()).toBe(true);
        expect(readFileSync(file, "utf-8")).toContain("    ");
    });

    it("should return Err for a non-serializable value", () => {
        const file = join(tmpDir, "bad.json");
        const result = writeJsonSync(file, undefined);

        expect(result.isErr()).toBe(true);
    });
});
