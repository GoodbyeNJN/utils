import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { exists, existsSync } from "@/fs/safe/exists";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-safe-exists-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("exists", () => {
    it("should return true for an existing file", async () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "hello");

        expect(await exists(file)).toBe(true);
    });

    it("should return true for an existing directory", async () => {
        const dir = join(tmpDir, "subdir");
        mkdirSync(dir);

        expect(await exists(dir)).toBe(true);
    });

    it("should return false for a non-existing path", async () => {
        expect(await exists(join(tmpDir, "nonexistent.txt"))).toBe(false);
    });

    it("should accept a URL", async () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "hello");

        expect(await exists(new URL(`file://${file}`))).toBe(true);
    });
});

describe("existsSync", () => {
    it("should return true for an existing file", () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "hello");

        expect(existsSync(file)).toBe(true);
    });

    it("should return true for an existing directory", () => {
        const dir = join(tmpDir, "subdir");
        mkdirSync(dir);

        expect(existsSync(dir)).toBe(true);
    });

    it("should return false for a non-existing path", () => {
        expect(existsSync(join(tmpDir, "nonexistent.txt"))).toBe(false);
    });
});
