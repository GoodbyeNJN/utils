import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { rm, rmSync as safeRmSync } from "@/fs/safe/rm";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-safe-rm-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("rm", () => {
    it("should remove an existing file and return Ok", async () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "hello");

        const result = await rm(file);

        expect(result.isOk()).toBe(true);
    });

    it("should remove a directory recursively and return Ok", async () => {
        const dir = join(tmpDir, "subdir");
        rmSync(dir, { recursive: true, force: true });
        // create the dir
        const { mkdirSync } = await import("node:fs");
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "file.txt"), "hello");

        const result = await rm(dir);

        expect(result.isOk()).toBe(true);
    });

    it("should return Ok for a non-existing path when force is true (default)", async () => {
        const result = await rm(join(tmpDir, "nonexistent.txt"));

        expect(result.isOk()).toBe(true);
    });
});

describe("rmSync", () => {
    it("should remove an existing file and return Ok", () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "hello");

        const result = safeRmSync(file);

        expect(result.isOk()).toBe(true);
    });

    it("should remove a directory recursively and return Ok", () => {
        const dir = join(tmpDir, "subdir");
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "file.txt"), "hello");

        const result = safeRmSync(dir);

        expect(result.isOk()).toBe(true);
    });

    it("should return Ok for a non-existing path when force is true (default)", () => {
        const result = safeRmSync(join(tmpDir, "nonexistent.txt"));

        expect(result.isOk()).toBe(true);
    });
});
