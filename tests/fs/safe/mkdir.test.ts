import { beforeEach, describe, expect, test, vi } from "vitest";

import { mkdir, mkdirSync } from "@/fs/safe/mkdir";

import { fs, vol } from "../../helpers/memfs";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const dir = "/dir";
const nestedDir = "/a/b/c";

describe("mkdir", () => {
    test("should create a directory and return Ok", async () => {
        const result = await mkdir(dir);

        expect(result.isOk()).toBe(true);
    });

    test("should create nested directories recursively", async () => {
        const result = await mkdir(nestedDir);

        expect(result.isOk()).toBe(true);
    });

    test("should return Ok when directory already exists (idempotent)", async () => {
        fs.mkdirSync(dir);
        const result = await mkdir(dir);

        expect(result.isOk()).toBe(true);
    });
});

describe("mkdirSync", () => {
    test("should create a directory and return Ok", () => {
        const result = mkdirSync(dir);

        expect(result.isOk()).toBe(true);
    });

    test("should create nested directories recursively", () => {
        const result = mkdirSync(nestedDir);

        expect(result.isOk()).toBe(true);
    });

    test("should return Ok when directory already exists (idempotent)", () => {
        fs.mkdirSync(dir);
        const result = mkdirSync(dir);

        expect(result.isOk()).toBe(true);
    });
});
