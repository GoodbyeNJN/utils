import { beforeEach, describe, expect, test, vi } from "vitest";

import { cp, cpSync } from "@/fs/unsafe/cp";

import { fs, vol } from "../../helpers/memfs";

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
    test("should copy a file", async () => {
        fs.writeFileSync(srcFile, "hello");

        await expect(cp(srcFile, destFile)).resolves.toBeUndefined();
    });

    test("should copy a directory recursively", async () => {
        fs.mkdirSync(srcDir);
        fs.writeFileSync(`${srcDir}${srcFile}`, "content");

        await expect(cp(srcDir, destDir)).resolves.toBeUndefined();
    });

    test("should throw when source does not exist", async () => {
        await expect(cp(srcFile, destFile)).rejects.toThrow();
    });
});

describe("cpSync", () => {
    test("should copy a file", () => {
        fs.writeFileSync(srcFile, "hello");

        expect(() => cpSync(srcFile, destFile)).not.toThrow();
    });

    test("should copy a directory recursively", () => {
        fs.mkdirSync(srcDir);
        fs.writeFileSync(`${srcDir}${srcFile}`, "content");

        expect(() => cpSync(srcDir, destDir)).not.toThrow();
    });

    test("should throw when source does not exist", () => {
        expect(() => cpSync(srcFile, destFile)).toThrow();
    });
});
