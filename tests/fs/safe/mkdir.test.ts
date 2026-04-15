import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { mkdir, mkdirSync } from "@/fs/safe/mkdir";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-safe-mkdir-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("mkdir", () => {
    it("should create a directory and return Ok", async () => {
        const dir = join(tmpDir, "newdir");
        const result = await mkdir(dir);

        expect(result.isOk()).toBe(true);
    });

    it("should create nested directories recursively", async () => {
        const dir = join(tmpDir, "a", "b", "c");
        const result = await mkdir(dir);

        expect(result.isOk()).toBe(true);
    });

    it("should return Ok when directory already exists (idempotent)", async () => {
        const result = await mkdir(tmpDir);

        expect(result.isOk()).toBe(true);
    });
});

describe("mkdirSync", () => {
    it("should create a directory and return Ok", () => {
        const dir = join(tmpDir, "newdir");
        const result = mkdirSync(dir);

        expect(result.isOk()).toBe(true);
    });

    it("should create nested directories recursively", () => {
        const dir = join(tmpDir, "a", "b", "c");
        const result = mkdirSync(dir);

        expect(result.isOk()).toBe(true);
    });

    it("should return Ok when directory already exists (idempotent)", () => {
        const result = mkdirSync(tmpDir);

        expect(result.isOk()).toBe(true);
    });
});
