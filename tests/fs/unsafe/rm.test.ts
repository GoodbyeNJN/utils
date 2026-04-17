import { beforeEach, describe, expect, test, vi } from "vitest";

import { rm, rmSync as unsafeRmSync } from "@/fs/unsafe/rm";

import { fs, vol } from "../../helpers/memfs";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const file = "/file.txt";
const dir = "/dir";

describe("rm", () => {
    test("should remove an existing file", async () => {
        fs.writeFileSync(file, "hello");

        await expect(rm(file)).resolves.toBeUndefined();
    });

    test("should remove a directory recursively", async () => {
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}${file}`, "hello");

        await expect(rm(dir)).resolves.toBeUndefined();
    });

    test("should not throw for a non-existing path when force is true (default)", async () => {
        await expect(rm(file)).resolves.toBeUndefined();
    });
});

describe("rmSync", () => {
    test("should remove an existing file", () => {
        fs.writeFileSync(file, "hello");

        expect(() => unsafeRmSync(file)).not.toThrow();
    });

    test("should remove a directory recursively", () => {
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}${file}`, "hello");

        expect(() => unsafeRmSync(dir)).not.toThrow();
    });

    test("should not throw for a non-existing path when force is true (default)", () => {
        expect(() => unsafeRmSync(file)).not.toThrow();
    });
});
