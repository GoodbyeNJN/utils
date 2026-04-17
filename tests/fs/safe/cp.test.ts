import { beforeEach, describe, expect, vi } from "vitest";

import { cp, cpSync } from "@/fs/safe/cp";

import { fs, vol } from "../../helpers/memfs";
import { test } from "../../helpers/tester";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const srcFile = "/src.txt";
const destFile = "/dest.txt";
const srcDir = "/src";
const destDir = "/dest";

describe("cp", () => {
    test("should copy a file and return Ok", async () => {
        fs.writeFileSync(srcFile, "hello");

        const result = await cp(srcFile, destFile);

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(destFile, "utf-8")).toBe("hello");
    });

    test("should copy a directory recursively and return Ok", async () => {
        fs.mkdirSync(srcDir);
        fs.writeFileSync(`${srcDir}${srcFile}`, "content");

        const result = await cp(srcDir, destDir);

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(`${destDir}${srcFile}`, "utf-8")).toBe("content");
    });

    test("should return Err when source does not exist", async () => {
        const result = await cp(srcFile, destFile);

        expect(result.isErr()).toBe(true);
    });
});

describe("cpSync", () => {
    test("should copy a file and return Ok", async () => {
        fs.writeFileSync(srcFile, "hello");

        const result = cpSync(srcFile, destFile);

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(destFile, "utf-8")).toBe("hello");
    });

    test("should copy a directory recursively and return Ok", async () => {
        fs.mkdirSync(srcDir);
        fs.writeFileSync(`${srcDir}${srcFile}`, "content");

        const result = cpSync(srcDir, destDir);

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(`${destDir}${srcFile}`, "utf-8")).toBe("content");
    });

    test("should return Err when source does not exist", async () => {
        const result = cpSync(srcFile, destFile);

        expect(result.isErr()).toBe(true);
    });
});
