import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { cp, cpSync } from "@/fs/unsafe/cp";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-unsafe-cp-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("cp", () => {
    it("should copy a file", async () => {
        const src = join(tmpDir, "source.txt");
        const dest = join(tmpDir, "dest.txt");
        writeFileSync(src, "hello");

        await expect(cp(src, dest)).resolves.toBeUndefined();
    });

    it("should copy a directory recursively", async () => {
        const srcDir = join(tmpDir, "src");
        const destDir = join(tmpDir, "dest");
        mkdirSync(srcDir);
        writeFileSync(join(srcDir, "file.txt"), "content");

        await expect(cp(srcDir, destDir)).resolves.toBeUndefined();
    });

    it("should throw when source does not exist", async () => {
        await expect(
            cp(join(tmpDir, "nonexistent.txt"), join(tmpDir, "dest.txt")),
        ).rejects.toThrow();
    });
});

describe("cpSync", () => {
    it("should copy a file", () => {
        const src = join(tmpDir, "source.txt");
        const dest = join(tmpDir, "dest.txt");
        writeFileSync(src, "hello");

        expect(() => cpSync(src, dest)).not.toThrow();
    });

    it("should copy a directory recursively", () => {
        const srcDir = join(tmpDir, "src-sync");
        const destDir = join(tmpDir, "dest-sync");
        mkdirSync(srcDir);
        writeFileSync(join(srcDir, "file.txt"), "content");

        expect(() => cpSync(srcDir, destDir)).not.toThrow();
    });

    it("should throw when source does not exist", () => {
        expect(() => cpSync(join(tmpDir, "nonexistent.txt"), join(tmpDir, "dest.txt"))).toThrow();
    });
});
