import { beforeEach, describe, expect, test, vi } from "vitest";

import {
    writeFileSync as safeWriteFileSync,
    writeFile,
    writeJson,
    writeJsonSync,
} from "@/fs/safe/write";

import { fs, vol } from "../../helpers/memfs";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const file = "/file.txt";
const subFile = "/dir/file.txt";
const json = "/data.json";

describe("writeFile", () => {
    test("should write content and return Ok", async () => {
        const result = await writeFile(file, "hello world");

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(file, "utf-8")).toBe("hello world");
    });

    test("should create parent directories automatically", async () => {
        const result = await writeFile(subFile, "nested");

        expect(result.isOk()).toBe(true);
    });

    test("should overwrite existing file content", async () => {
        fs.writeFileSync(file, "old");
        const result = await writeFile(file, "new");

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(file, "utf-8")).toBe("new");
    });
});

describe("writeFileSync", () => {
    test("should write content and return Ok", () => {
        const result = safeWriteFileSync(file, "hello world");

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(file, "utf-8")).toBe("hello world");
    });

    test("should create parent directories automatically", () => {
        const result = safeWriteFileSync(subFile, "nested");

        expect(result.isOk()).toBe(true);
    });

    test("should overwrite existing file content", () => {
        fs.writeFileSync(file, "old");
        const result = safeWriteFileSync(file, "new");

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(file, "utf-8")).toBe("new");
    });
});

describe("writeJson", () => {
    test("should write a JSON object and return Ok", async () => {
        const result = await writeJson(json, { key: "value" });

        expect(result.isOk()).toBe(true);
        expect(JSON.parse(fs.readFileSync(json, "utf-8") as string)).toEqual({
            key: "value",
        });
    });

    test("should write with a custom indent", async () => {
        const result = await writeJson(json, { a: 1 }, 4);

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(json, "utf-8")).toContain("    ");
    });

    test("should write an array", async () => {
        const result = await writeJson(json, [1, 2, 3]);

        expect(result.isOk()).toBe(true);
        expect(JSON.parse(fs.readFileSync(json, "utf-8") as string)).toEqual([1, 2, 3]);
    });

    test("should return Err for a non-serializable value", async () => {
        const result = await writeJson(json, undefined);

        expect(result.isErr()).toBe(true);
    });
});

describe("writeJsonSync", () => {
    test("should write a JSON object and return Ok", () => {
        const result = writeJsonSync(json, { key: "value" });

        expect(result.isOk()).toBe(true);
        expect(JSON.parse(fs.readFileSync(json, "utf-8") as string)).toEqual({
            key: "value",
        });
    });

    test("should write an array", () => {
        const result = writeJsonSync(json, [1, 2, 3]);

        expect(result.isOk()).toBe(true);
        expect(JSON.parse(fs.readFileSync(json, "utf-8") as string)).toEqual([1, 2, 3]);
    });

    test("should write with a custom indent", () => {
        const result = writeJsonSync(json, { a: 1 }, 4);

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(json, "utf-8")).toContain("    ");
    });

    test("should return Err for a non-serializable value", () => {
        const result = writeJsonSync(json, undefined);

        expect(result.isErr()).toBe(true);
    });
});
