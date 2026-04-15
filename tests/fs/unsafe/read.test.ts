import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { isNil } from "@/common";
import { readFile, readFileByLine, readFileSync, readJson, readJsonSync } from "@/fs/unsafe/read";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-unsafe-read-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("readFile", () => {
    it("should return file content as a string", async () => {
        const file = join(tmpDir, "hello.txt");
        writeFileSync(file, "hello world");

        const content = await readFile(file);

        expect(content).toBe("hello world");
    });

    it("should return Buffer when encoding is 'buffer'", async () => {
        const file = join(tmpDir, "hello.txt");
        writeFileSync(file, "hello");

        const content = await readFile(file, { encoding: "buffer" });

        expect(content).toBeInstanceOf(Buffer);
    });

    it("should return nil for a non-existing file", async () => {
        const content = await readFile(join(tmpDir, "nonexistent.txt"));

        expect(isNil(content)).toBe(true);
    });
});

describe("readFileSync", () => {
    it("should return file content as a string", () => {
        const file = join(tmpDir, "hello.txt");
        writeFileSync(file, "hello world");

        const content = readFileSync(file);

        expect(content).toBe("hello world");
    });

    it("should return Buffer when encoding is 'buffer'", () => {
        const file = join(tmpDir, "hello.txt");
        writeFileSync(file, "hello");

        const content = readFileSync(file, { encoding: "buffer" });

        expect(content).toBeInstanceOf(Buffer);
    });

    it("should return nil for a non-existing file", () => {
        const content = readFileSync(join(tmpDir, "nonexistent.txt"));

        expect(isNil(content)).toBe(true);
    });
});

describe("readJson", () => {
    it("should parse and return the JSON value", async () => {
        const file = join(tmpDir, "data.json");
        writeFileSync(file, JSON.stringify({ key: "value" }));

        const data = await readJson(file);

        expect(data).toEqual({ key: "value" });
    });

    it("should return nil for a file with invalid JSON", async () => {
        const file = join(tmpDir, "bad.json");
        writeFileSync(file, "not-json");

        const data = await readJson(file);

        expect(isNil(data)).toBe(true);
    });

    it("should return nil when file does not exist", async () => {
        const data = await readJson(join(tmpDir, "missing.json"));

        expect(isNil(data)).toBe(true);
    });
});

describe("readJsonSync", () => {
    it("should parse and return the JSON value", () => {
        const file = join(tmpDir, "data.json");
        writeFileSync(file, JSON.stringify([1, 2, 3]));

        const data = readJsonSync(file);

        expect(data).toEqual([1, 2, 3]);
    });

    it("should return nil for a file with invalid JSON", () => {
        const file = join(tmpDir, "bad.json");
        writeFileSync(file, "not-json");

        const data = readJsonSync(file);

        expect(isNil(data)).toBe(true);
    });

    it("should return nil when file does not exist", () => {
        const data = readJsonSync(join(tmpDir, "missing.json"));

        expect(isNil(data)).toBe(true);
    });
});

describe("readFileByLine", () => {
    it("should return an AsyncIterable that yields each line", async () => {
        const file = join(tmpDir, "lines.txt");
        writeFileSync(file, "line1\nline2\nline3");

        const reader = await readFileByLine(file);

        expect(reader).not.toBeNull();

        const lines: string[] = [];
        for await (const line of reader!) {
            lines.push(line);
        }

        expect(lines).toEqual(["line1", "line2", "line3"]);
    });

    it("should handle an empty file", async () => {
        const file = join(tmpDir, "empty.txt");
        writeFileSync(file, "");

        const reader = await readFileByLine(file);

        expect(reader).not.toBeNull();

        const lines: string[] = [];
        for await (const line of reader!) {
            lines.push(line);
        }

        expect(lines).toEqual([]);
    });
});
