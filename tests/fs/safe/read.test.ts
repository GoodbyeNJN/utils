import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { readFile, readFileByLine, readFileSync, readJson, readJsonSync } from "@/fs/safe/read";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-safe-read-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("readFile", () => {
    it("should read file content and return Ok(string)", async () => {
        const file = join(tmpDir, "hello.txt");
        writeFileSync(file, "hello world");

        const result = await readFile(file);

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBe("hello world");
    });

    it("should return Ok(Buffer) when encoding is 'buffer'", async () => {
        const file = join(tmpDir, "hello.txt");
        writeFileSync(file, "hello");

        const result = await readFile(file, { encoding: "buffer" });

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBeInstanceOf(Buffer);
    });

    it("should return Err when file does not exist", async () => {
        const result = await readFile(join(tmpDir, "nonexistent.txt"));

        expect(result.isErr()).toBe(true);
    });
});

describe("readFileSync", () => {
    it("should read file content and return Ok(string)", () => {
        const file = join(tmpDir, "hello.txt");
        writeFileSync(file, "hello world");

        const result = readFileSync(file);

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBe("hello world");
    });

    it("should return Ok(Buffer) when encoding is 'buffer'", () => {
        const file = join(tmpDir, "hello.txt");
        writeFileSync(file, "hello");

        const result = readFileSync(file, { encoding: "buffer" });

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBeInstanceOf(Buffer);
    });

    it("should return Err when file does not exist", () => {
        const result = readFileSync(join(tmpDir, "nonexistent.txt"));

        expect(result.isErr()).toBe(true);
    });
});

describe("readJson", () => {
    it("should parse a JSON file and return Ok(parsed)", async () => {
        const file = join(tmpDir, "data.json");
        writeFileSync(file, JSON.stringify({ key: "value" }));

        const result = await readJson(file);

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toEqual({ key: "value" });
    });

    it("should return Err for a file with invalid JSON", async () => {
        const file = join(tmpDir, "bad.json");
        writeFileSync(file, "not-json");

        const result = await readJson(file);

        expect(result.isErr()).toBe(true);
    });

    it("should return Err when file does not exist", async () => {
        const result = await readJson(join(tmpDir, "missing.json"));

        expect(result.isErr()).toBe(true);
    });
});

describe("readJsonSync", () => {
    it("should parse a JSON file and return Ok(parsed)", () => {
        const file = join(tmpDir, "data.json");
        writeFileSync(file, JSON.stringify([1, 2, 3]));

        const result = readJsonSync(file);

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toEqual([1, 2, 3]);
    });

    it("should return Err for a file with invalid JSON", () => {
        const file = join(tmpDir, "bad.json");
        writeFileSync(file, "not-json");

        const result = readJsonSync(file);

        expect(result.isErr()).toBe(true);
    });

    it("should return Err when file does not exist", () => {
        const result = readJsonSync(join(tmpDir, "missing.json"));

        expect(result.isErr()).toBe(true);
    });
});

describe("readFileByLine", () => {
    it("should return Ok(AsyncIterable) and iterate lines", async () => {
        const file = join(tmpDir, "lines.txt");
        writeFileSync(file, "line1\nline2\nline3");

        const result = await readFileByLine(file);

        expect(result.isOk()).toBe(true);

        const lines: string[] = [];
        for await (const line of result.unwrap()) {
            lines.push(line);
        }

        expect(lines).toEqual(["line1", "line2", "line3"]);
    });

    it("should handle an empty file", async () => {
        const file = join(tmpDir, "empty.txt");
        writeFileSync(file, "");

        const result = await readFileByLine(file);

        expect(result.isOk()).toBe(true);

        const lines: string[] = [];
        for await (const line of result.unwrap()) {
            lines.push(line);
        }

        expect(lines).toEqual([]);
    });
});
