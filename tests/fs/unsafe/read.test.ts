import { beforeEach, describe, expect, test, vi } from "vitest";

import { readFile, readFileByLine, readFileSync, readJson, readJsonSync } from "@/fs/unsafe/read";

import { fs, vol } from "../memfs";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const file = "/file.txt";
const json = "/data.json";

describe("readFile", () => {
    test("should read file content and return Some(string)", async () => {
        fs.writeFileSync(file, "hello world");

        const result = await readFile(file);

        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toBe("hello world");
    });

    test("should return Some(Buffer) when encoding is 'buffer'", async () => {
        fs.writeFileSync(file, "hello");

        const result = await readFile(file, { encoding: "buffer" });

        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toBeInstanceOf(Buffer);
    });

    test("should return None when file does not exist", async () => {
        const result = await readFile(file);

        expect(result.isNone()).toBe(true);
    });
});

describe("readFileSync", () => {
    test("should read file content and return Some(string)", () => {
        fs.writeFileSync(file, "hello world");

        const result = readFileSync(file);

        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toBe("hello world");
    });

    test("should return Some(Buffer) when encoding is 'buffer'", () => {
        fs.writeFileSync(file, "hello");

        const result = readFileSync(file, { encoding: "buffer" });

        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toBeInstanceOf(Buffer);
    });

    test("should return None when file does not exist", () => {
        const result = readFileSync(file);

        expect(result.isNone()).toBe(true);
    });
});

describe("readJson", () => {
    test("should parse a JSON file and return Some(parsed)", async () => {
        fs.writeFileSync(json, JSON.stringify({ key: "value" }));

        const result = await readJson(json);

        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toEqual({ key: "value" });
    });

    test("should return None for a file with invalid JSON", async () => {
        fs.writeFileSync(json, "not-json");

        const result = await readJson(json);

        expect(result.isNone()).toBe(true);
    });

    test("should return None when file does not exist", async () => {
        const result = await readJson(json);

        expect(result.isNone()).toBe(true);
    });
});

describe("readJsonSync", () => {
    test("should parse a JSON file and return Some(parsed)", () => {
        fs.writeFileSync(json, JSON.stringify([1, 2, 3]));

        const result = readJsonSync(json);

        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toEqual([1, 2, 3]);
    });

    test("should return None for a file with invalid JSON", () => {
        fs.writeFileSync(json, "not-json");

        const result = readJsonSync(json);

        expect(result.isNone()).toBe(true);
    });

    test("should return None when file does not exist", () => {
        const result = readJsonSync(json);

        expect(result.isNone()).toBe(true);
    });
});

describe("readFileByLine", () => {
    test("should return an AsyncIterable that yields each line", async () => {
        fs.writeFileSync("/lines.txt", "line1\nline2\nline3");

        const reader = await readFileByLine("/lines.txt");

        expect(reader).not.toBe(null);

        const lines: string[] = [];
        for await (const line of reader!) {
            lines.push(line);
        }

        expect(lines).toEqual(["line1", "line2", "line3"]);
    });

    test("should handle an empty file", async () => {
        fs.writeFileSync("/empty.txt", "");

        const reader = await readFileByLine("/empty.txt");

        expect(reader).not.toBe(null);

        const lines: string[] = [];
        for await (const line of reader!) {
            lines.push(line);
        }

        expect(lines).toEqual([]);
    });
});
