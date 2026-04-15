import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { mkdir, mkdirSync } from "@/fs/unsafe/mkdir";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-unsafe-mkdir-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("mkdir", () => {
    it("should create a directory without throwing", async () => {
        const dir = join(tmpDir, "newdir");
        await expect(mkdir(dir)).resolves.toBeUndefined();
    });

    it("should create nested directories recursively", async () => {
        const dir = join(tmpDir, "a", "b", "c");
        await expect(mkdir(dir)).resolves.toBeUndefined();
    });

    it("should not throw when directory already exists (idempotent)", async () => {
        await expect(mkdir(tmpDir)).resolves.toBeUndefined();
    });
});

describe("mkdirSync", () => {
    it("should create a directory without throwing", () => {
        const dir = join(tmpDir, "newdir");
        expect(() => mkdirSync(dir)).not.toThrow();
    });

    it("should create nested directories recursively", () => {
        const dir = join(tmpDir, "a", "b", "c");
        expect(() => mkdirSync(dir)).not.toThrow();
    });

    it("should not throw when directory already exists (idempotent)", () => {
        expect(() => mkdirSync(tmpDir)).not.toThrow();
    });
});
