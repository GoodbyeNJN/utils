import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { appendFile, appendFileSync } from "@/fs/safe/append";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-safe-append-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("appendFile", () => {
    it("should append data to an existing file with a leading newline by default", async () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "first");

        const result = await appendFile(file, "second");

        expect(result.isOk()).toBe(true);
        expect(readFileSync(file, "utf-8")).toBe("first\nsecond");
    });

    it("should append data without a newline when newline is false", async () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "first");

        const result = await appendFile(file, "second", { newline: false });

        expect(result.isOk()).toBe(true);
        expect(readFileSync(file, "utf-8")).toBe("firstsecond");
    });

    it("should create parent directories automatically", async () => {
        const file = join(tmpDir, "sub", "file.txt");
        const result = await appendFile(file, "data");

        expect(result.isOk()).toBe(true);
    });
});

describe("appendFileSync", () => {
    it("should append data to an existing file with a leading newline by default", () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "first");

        const result = appendFileSync(file, "second");

        expect(result.isOk()).toBe(true);
        expect(readFileSync(file, "utf-8")).toBe("first\nsecond");
    });

    it("should append data without a newline when newline is false", () => {
        const file = join(tmpDir, "file.txt");
        writeFileSync(file, "first");

        const result = appendFileSync(file, "second", { newline: false });

        expect(result.isOk()).toBe(true);
        expect(readFileSync(file, "utf-8")).toBe("firstsecond");
    });

    it("should create parent directories automatically", () => {
        const file = join(tmpDir, "sub", "file.txt");
        const result = appendFileSync(file, "data");

        expect(result.isOk()).toBe(true);
    });
});
