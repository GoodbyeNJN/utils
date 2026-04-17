import { beforeEach, describe, expect, vi } from "vitest";

import { readFile, readFileByLine, readFileSync, readJson, readJsonSync } from "@/fs/safe/read";

import { fs, vol } from "../../helpers/memfs";
import { test } from "../../helpers/tester";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const file = "/file.txt";
const json = "/data.json";

describe("readFile", () => {
    test("should read file content and return Ok(string)", async () => {
        fs.writeFileSync(file, "hello world");

        const result = await readFile(file);

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBe("hello world");
    });

    test("should return Ok(Buffer) when encoding is 'buffer'", async () => {
        fs.writeFileSync(file, "hello");

        const result = await readFile(file, { encoding: "buffer" });

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBeInstanceOf(Buffer);
    });

    test("should return Err when file does not exist", async () => {
        const result = await readFile(file);

        expect(result.isErr()).toBe(true);
    });
});

describe("readFileSync", () => {
    test("should read file content and return Ok(string)", () => {
        fs.writeFileSync(file, "hello world");

        const result = readFileSync(file);

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBe("hello world");
    });

    test("should return Ok(Buffer) when encoding is 'buffer'", () => {
        fs.writeFileSync(file, "hello");

        const result = readFileSync(file, { encoding: "buffer" });

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBeInstanceOf(Buffer);
    });

    test("should return Err when file does not exist", () => {
        const result = readFileSync(file);

        expect(result.isErr()).toBe(true);
    });
});

describe("readJson", () => {
    test("should parse a JSON file and return Ok(parsed)", async () => {
        fs.writeFileSync(json, JSON.stringify({ key: "value" }));

        const result = await readJson(json);

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toEqual({ key: "value" });
    });

    test("should return Err for a file with invalid JSON", async () => {
        fs.writeFileSync(json, "not-json");

        const result = await readJson(json);

        expect(result.isErr()).toBe(true);
    });

    test("should return Err when file does not exist", async () => {
        const result = await readJson(json);

        expect(result.isErr()).toBe(true);
    });
});

describe("readJsonSync", () => {
    test("should parse a JSON file and return Ok(parsed)", () => {
        fs.writeFileSync(json, JSON.stringify([1, 2, 3]));

        const result = readJsonSync(json);

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toEqual([1, 2, 3]);
    });

    test("should return Err for a file with invalid JSON", () => {
        fs.writeFileSync(json, "not-json");

        const result = readJsonSync(json);

        expect(result.isErr()).toBe(true);
    });

    test("should return Err when file does not exist", () => {
        const result = readJsonSync(json);

        expect(result.isErr()).toBe(true);
    });
});

describe("readFileByLine", () => {
    test("should return Ok(AsyncIterable) and iterate lines", async () => {
        fs.writeFileSync(file, "line1\nline2\nline3");

        const result = await readFileByLine(file);

        expect(result.isOk()).toBe(true);

        const lines: string[] = [];
        for await (const line of result.unwrap()) {
            lines.push(line);
        }

        expect(lines).toEqual(["line1", "line2", "line3"]);
    });

    test("should handle an empty file", async () => {
        fs.writeFileSync(file, "");

        const result = await readFileByLine(file);

        expect(result.isOk()).toBe(true);

        const lines: string[] = [];
        for await (const line of result.unwrap()) {
            lines.push(line);
        }

        expect(lines).toEqual([]);
    });
});
