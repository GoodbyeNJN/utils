import { beforeEach, describe, expect, vi } from "vitest";

import { isNil } from "@/common";
import { readFile, readFileByLine, readFileSync, readJson, readJsonSync } from "@/fs/unsafe/read";

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
    test("should return file content as a string", async () => {
        fs.writeFileSync(file, "hello world");

        const content = await readFile(file);

        expect(content).toBe("hello world");
    });

    test("should return Buffer when encoding is 'buffer'", async () => {
        fs.writeFileSync(file, "hello");

        const content = await readFile(file, { encoding: "buffer" });

        expect(content).toBeInstanceOf(Buffer);
    });

    test("should return nil for a non-existing file", async () => {
        const content = await readFile(file);

        expect(isNil(content)).toBe(true);
    });
});

describe("readFileSync", () => {
    test("should return file content as a string", () => {
        fs.writeFileSync(file, "hello world");

        const content = readFileSync(file);

        expect(content).toBe("hello world");
    });

    test("should return Buffer when encoding is 'buffer'", () => {
        fs.writeFileSync(file, "hello");

        const content = readFileSync(file, { encoding: "buffer" });

        expect(content).toBeInstanceOf(Buffer);
    });

    test("should return nil for a non-existing file", () => {
        const content = readFileSync(file);

        expect(isNil(content)).toBe(true);
    });
});

describe("readJson", () => {
    test("should parse and return the JSON value", async () => {
        fs.writeFileSync(json, JSON.stringify({ key: "value" }));

        const data = await readJson(json);

        expect(data).toEqual({ key: "value" });
    });

    test("should return nil for a file with invalid JSON", async () => {
        fs.writeFileSync(json, "not-json");

        const data = await readJson(json);

        expect(isNil(data)).toBe(true);
    });

    test("should return nil when file does not exist", async () => {
        const data = await readJson(json);

        expect(isNil(data)).toBe(true);
    });
});

describe("readJsonSync", () => {
    test("should parse and return the JSON value", () => {
        fs.writeFileSync(json, JSON.stringify([1, 2, 3]));

        const data = readJsonSync(json);

        expect(data).toEqual([1, 2, 3]);
    });

    test("should return nil for a file with invalid JSON", () => {
        fs.writeFileSync(json, "not-json");

        const data = readJsonSync(json);

        expect(isNil(data)).toBe(true);
    });

    test("should return nil when file does not exist", () => {
        const data = readJsonSync(json);

        expect(isNil(data)).toBe(true);
    });
});

describe("readFileByLine", () => {
    test("should return an AsyncIterable that yields each line", async () => {
        fs.writeFileSync("/lines.txt", "line1\nline2\nline3");

        const reader = await readFileByLine("/lines.txt");

        expect(isNil(reader)).toBe(false);

        const lines: string[] = [];
        for await (const line of reader as AsyncIterable<string>) {
            lines.push(line);
        }

        expect(lines).toEqual(["line1", "line2", "line3"]);
    });

    test("should handle an empty file", async () => {
        fs.writeFileSync("/empty.txt", "");

        const reader = await readFileByLine("/empty.txt");

        expect(isNil(reader)).toBe(false);

        const lines: string[] = [];
        for await (const line of reader as AsyncIterable<string>) {
            lines.push(line);
        }

        expect(lines).toEqual([]);
    });
});
