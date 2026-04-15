import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
    writeFileSync as unsafeWriteFileSync,
    writeFile,
    writeJson,
    writeJsonSync,
} from "@/fs/unsafe/write";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-unsafe-write-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("writeFile", () => {
    it("should write content to a file", async () => {
        const file = join(tmpDir, "hello.txt");
        await writeFile(file, "hello world");

        expect(readFileSync(file, "utf-8")).toBe("hello world");
    });

    it("should create parent directories automatically", async () => {
        const file = join(tmpDir, "a", "b", "hello.txt");

        await expect(writeFile(file, "nested")).resolves.toBeUndefined();
    });

    it("should overwrite existing file content", async () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "old");
        await writeFile(file, "new");

        expect(readFileSync(file, "utf-8")).toBe("new");
    });
});

describe("writeFileSync", () => {
    it("should write content to a file", () => {
        const file = join(tmpDir, "hello.txt");
        unsafeWriteFileSync(file, "sync content");

        expect(readFileSync(file, "utf-8")).toBe("sync content");
    });

    it("should create parent directories automatically", () => {
        const file = join(tmpDir, "a", "b", "hello.txt");
        unsafeWriteFileSync(file, "nested");

        expect(readFileSync(file, "utf-8")).toBe("nested");
    });

    it("should overwrite existing file content", () => {
        const file = join(tmpDir, "hello.txt");
        writeFileSync(file, "old");
        unsafeWriteFileSync(file, "new");

        expect(readFileSync(file, "utf-8")).toBe("new");
    });
});

describe("writeJson", () => {
    it("should write a JSON object to a file", async () => {
        const file = join(tmpDir, "data.json");
        await writeJson(file, { key: "value" });

        const content = JSON.parse(readFileSync(file, "utf-8"));
        expect(content).toEqual({ key: "value" });
    });

    it("should write with a custom indent", async () => {
        const file = join(tmpDir, "data.json");
        await writeJson(file, { a: 1 }, 4);

        const raw = readFileSync(file, "utf-8");
        expect(raw).toContain("    ");
    });

    it("should write an array", async () => {
        const file = join(tmpDir, "arr.json");
        await writeJson(file, [1, 2, 3]);

        const content = JSON.parse(readFileSync(file, "utf-8"));
        expect(content).toEqual([1, 2, 3]);
    });

    it("should throw for a non-serializable value", async () => {
        const file = join(tmpDir, "bad.json");

        await expect(writeJson(file, undefined)).rejects.toThrow(TypeError);
    });
});

describe("writeJsonSync", () => {
    it("should write a JSON object to a file", () => {
        const file = join(tmpDir, "data.json");
        writeJsonSync(file, { key: "value" });

        const content = JSON.parse(readFileSync(file, "utf-8"));
        expect(content).toEqual({ key: "value" });
    });

    it("should write an array", () => {
        const file = join(tmpDir, "arr.json");
        writeJsonSync(file, [1, 2, 3]);

        const content = JSON.parse(readFileSync(file, "utf-8"));
        expect(content).toEqual([1, 2, 3]);
    });

    it("should write with a custom indent", () => {
        const file = join(tmpDir, "data.json");
        writeJsonSync(file, { a: 1 }, 4);

        const raw = readFileSync(file, "utf-8");
        expect(raw).toContain("    ");
    });

    it("should throw for a non-serializable value", () => {
        const file = join(tmpDir, "bad.json");

        expect(() => writeJsonSync(file, undefined)).toThrow(TypeError);
    });
});
