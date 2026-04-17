import { beforeEach, describe, expect, vi } from "vitest";

import {
    writeFileSync as unsafeWriteFileSync,
    writeFile,
    writeJson,
    writeJsonSync,
} from "@/fs/unsafe/write";

import { fs, vol } from "../../helpers/memfs";
import { test } from "../../helpers/tester";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const file = "/file.txt";
const subFile = "/dir/file.txt";
const json = "/data.json";

describe("writeFile", () => {
    test("should write content to a file", async () => {
        await writeFile(file, "hello world");

        expect(fs.readFileSync(file, "utf-8")).toBe("hello world");
    });

    test("should create parent directories automatically", async () => {
        await expect(writeFile(subFile, "nested")).resolves.toBeUndefined();
    });

    test("should overwrite existing file content", async () => {
        fs.writeFileSync(file, "old");
        await writeFile(file, "new");

        expect(fs.readFileSync(file, "utf-8")).toBe("new");
    });
});

describe("writeFileSync", () => {
    test("should write content to a file", () => {
        unsafeWriteFileSync(file, "sync content");

        expect(fs.readFileSync(file, "utf-8")).toBe("sync content");
    });

    test("should create parent directories automatically", () => {
        unsafeWriteFileSync(subFile, "nested");

        expect(fs.readFileSync(subFile, "utf-8")).toBe("nested");
    });

    test("should overwrite existing file content", () => {
        fs.writeFileSync(file, "old");
        unsafeWriteFileSync(file, "new");

        expect(fs.readFileSync(file, "utf-8")).toBe("new");
    });
});

describe("writeJson", () => {
    test("should write a JSON object to a file", async () => {
        await writeJson(json, { key: "value" });

        const content = JSON.parse(fs.readFileSync(json, "utf-8") as string);
        expect(content).toEqual({ key: "value" });
    });

    test("should write with a custom indent", async () => {
        await writeJson(json, { a: 1 }, 4);

        const raw = fs.readFileSync(json, "utf-8");
        expect(raw).toContain("    ");
    });

    test("should write an array", async () => {
        await writeJson(json, [1, 2, 3]);

        const content = JSON.parse(fs.readFileSync(json, "utf-8") as string);
        expect(content).toEqual([1, 2, 3]);
    });

    test("should throw for a non-serializable value", async () => {
        await expect(writeJson(json, undefined)).rejects.toThrow(TypeError);
    });
});

describe("writeJsonSync", () => {
    test("should write a JSON object to a file", () => {
        writeJsonSync(json, { key: "value" });

        const content = JSON.parse(fs.readFileSync(json, "utf-8") as string);
        expect(content).toEqual({ key: "value" });
    });

    test("should write an array", () => {
        writeJsonSync(json, [1, 2, 3]);

        const content = JSON.parse(fs.readFileSync(json, "utf-8") as string);
        expect(content).toEqual([1, 2, 3]);
    });

    test("should write with a custom indent", () => {
        writeJsonSync(json, { a: 1 }, 4);

        const raw = fs.readFileSync(json, "utf-8");
        expect(raw).toContain("    ");
    });

    test("should throw for a non-serializable value", () => {
        expect(() => writeJsonSync(json, undefined)).toThrow(TypeError);
    });
});
