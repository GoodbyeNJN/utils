import { beforeEach, describe, expect, test, vi } from "vitest";

import { mkdir, mkdirSync } from "@/fs/unsafe/mkdir";

import { fs, vol } from "../../helpers/memfs";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const dir = "/dir";
const nestedDir = "/a/b/c";

describe("mkdir", () => {
    test("should create a directory without throwing", async () => {
        await expect(mkdir(dir)).resolves.toBeUndefined();
    });

    test("should create nested directories recursively", async () => {
        await expect(mkdir(nestedDir)).resolves.toBeUndefined();
    });

    test("should not throw when directory already exists (idempotent)", async () => {
        fs.mkdirSync(dir);
        await expect(mkdir(dir)).resolves.toBeUndefined();
    });
});

describe("mkdirSync", () => {
    test("should create a directory without throwing", () => {
        expect(() => mkdirSync(dir)).not.toThrow();
    });

    test("should create nested directories recursively", () => {
        expect(() => mkdirSync(nestedDir)).not.toThrow();
    });

    test("should not throw when directory already exists (idempotent)", () => {
        fs.mkdirSync(dir);
        expect(() => mkdirSync(dir)).not.toThrow();
    });
});
