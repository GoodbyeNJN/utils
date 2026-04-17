import { beforeEach, describe, expect, test, vi } from "vitest";

import { rm, rmSync as safeRmSync } from "@/fs/safe/rm";

import { fs, vol } from "../../helpers/memfs";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const file = "/file.txt";
const dir = "/dir";

describe("rm", () => {
    test("should remove an existing file and return Ok", async () => {
        fs.writeFileSync(file, "hello");

        const result = await rm(file);

        expect(result.isOk()).toBe(true);
    });

    test("should remove a directory recursively and return Ok", async () => {
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}${file}`, "hello");

        const result = await rm(dir);

        expect(result.isOk()).toBe(true);
    });

    test("should return Ok for a non-existing path when force is true (default)", async () => {
        const result = await rm(file);

        expect(result.isOk()).toBe(true);
    });
});

describe("rmSync", () => {
    test("should remove an existing file and return Ok", () => {
        fs.writeFileSync(file, "hello");

        const result = safeRmSync(file);

        expect(result.isOk()).toBe(true);
    });

    test("should remove a directory recursively and return Ok", () => {
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}${file}`, "hello");

        const result = safeRmSync(dir);

        expect(result.isOk()).toBe(true);
    });

    test("should return Ok for a non-existing path when force is true (default)", () => {
        const result = safeRmSync(file);

        expect(result.isOk()).toBe(true);
    });
});
