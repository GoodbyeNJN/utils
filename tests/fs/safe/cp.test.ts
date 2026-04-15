import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { cp, cpSync } from "@/fs/safe/cp";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-safe-cp-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("cp", () => {
    it("should copy a file and return Ok", async () => {
        const src = join(tmpDir, "source.txt");
        const dest = join(tmpDir, "dest.txt");
        writeFileSync(src, "hello");

        const result = await cp(src, dest);

        expect(result.isOk()).toBe(true);
    });

    it("should copy a directory recursively and return Ok", async () => {
        const srcDir = join(tmpDir, "src");
        const destDir = join(tmpDir, "dest");
        mkdirSync(srcDir);
        writeFileSync(join(srcDir, "file.txt"), "content");

        const result = await cp(srcDir, destDir);

        expect(result.isOk()).toBe(true);
    });

    it("should return Err when source does not exist", async () => {
        const result = await cp(join(tmpDir, "nonexistent.txt"), join(tmpDir, "dest.txt"));

        expect(result.isErr()).toBe(true);
    });
});

describe("cpSync", () => {
    it("should copy a file and return Ok", () => {
        const src = join(tmpDir, "source.txt");
        const dest = join(tmpDir, "dest.txt");
        writeFileSync(src, "hello");

        const result = cpSync(src, dest);

        expect(result.isOk()).toBe(true);
    });

    it("should copy a directory recursively and return Ok", () => {
        const srcDir = join(tmpDir, "src-sync");
        const destDir = join(tmpDir, "dest-sync");
        mkdirSync(srcDir);
        writeFileSync(join(srcDir, "file.txt"), "content");

        const result = cpSync(srcDir, destDir);

        expect(result.isOk()).toBe(true);
    });

    it("should return Err when source does not exist", () => {
        const result = cpSync(join(tmpDir, "nonexistent.txt"), join(tmpDir, "dest.txt"));

        expect(result.isErr()).toBe(true);
    });
});
