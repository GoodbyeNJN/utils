import { beforeEach, describe, expect, test, vi } from "vitest";

import { exists, existsSync } from "@/fs/safe/exists";

import { fs, vol } from "../../helpers/memfs";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const file = "/file.txt";
const dir = "/dir";

describe("exists", () => {
    test("should return true for an existing file", async () => {
        fs.writeFileSync(file, "hello");

        expect(await exists(file)).toBe(true);
    });

    test("should return true for an existing directory", async () => {
        fs.mkdirSync(dir);

        expect(await exists(dir)).toBe(true);
    });

    test("should return false for a non-existing path", async () => {
        expect(await exists(file)).toBe(false);
    });

    test("should accept a URL", async () => {
        fs.writeFileSync(file, "hello");

        expect(await exists(new URL(`file://${file}`))).toBe(true);
    });
});

describe("existsSync", () => {
    test("should return true for an existing file", async () => {
        fs.writeFileSync(file, "hello");

        expect(existsSync(file)).toBe(true);
    });

    test("should return true for an existing directory", async () => {
        fs.mkdirSync(dir);

        expect(existsSync(dir)).toBe(true);
    });

    test("should return false for a non-existing path", async () => {
        expect(existsSync(file)).toBe(false);
    });
});
