import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { rm, rmSync as unsafeRmSync } from "@/fs/unsafe/rm";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-unsafe-rm-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("rm", () => {
    it("should remove an existing file", async () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "hello");

        await expect(rm(file)).resolves.toBeUndefined();
    });

    it("should remove a directory recursively", async () => {
        const dir = join(tmpDir, "subdir");
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "file.txt"), "hello");

        await expect(rm(dir)).resolves.toBeUndefined();
    });

    it("should not throw for a non-existing path when force is true (default)", async () => {
        await expect(rm(join(tmpDir, "nonexistent.txt"))).resolves.toBeUndefined();
    });
});

describe("rmSync", () => {
    it("should remove an existing file", () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "hello");

        expect(() => unsafeRmSync(file)).not.toThrow();
    });

    it("should remove a directory recursively", () => {
        const dir = join(tmpDir, "subdir");
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "file.txt"), "hello");

        expect(() => unsafeRmSync(dir)).not.toThrow();
    });

    it("should not throw for a non-existing path when force is true (default)", () => {
        expect(() => unsafeRmSync(join(tmpDir, "nonexistent.txt"))).not.toThrow();
    });
});
