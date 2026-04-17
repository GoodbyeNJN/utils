import { beforeEach, describe, expect, test, vi } from "vitest";

import { appendFile, appendFileSync } from "@/fs/unsafe/append";

import { fs, vol } from "../../helpers/memfs";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const file = "/file.txt";
const subFile = "/dir/file.txt";

describe("appendFile", () => {
    test("should append data with a leading newline by default", async () => {
        fs.writeFileSync(file, "first");
        await appendFile(file, "second");

        expect(fs.readFileSync(file, "utf-8")).toBe("first\nsecond");
    });

    test("should append data without a newline when newline is false", async () => {
        fs.writeFileSync(file, "first");
        await appendFile(file, "second", { newline: false });

        expect(fs.readFileSync(file, "utf-8")).toBe("firstsecond");
    });

    test("should create parent directories automatically", async () => {
        await expect(appendFile(subFile, "data")).resolves.toBeUndefined();
    });
});

describe("appendFileSync", () => {
    test("should append data with a leading newline by default", () => {
        fs.writeFileSync(file, "first");
        appendFileSync(file, "second");

        expect(fs.readFileSync(file, "utf-8")).toBe("first\nsecond");
    });

    test("should append data without a newline when newline is false", () => {
        fs.writeFileSync(file, "first");
        appendFileSync(file, "second", { newline: false });

        expect(fs.readFileSync(file, "utf-8")).toBe("firstsecond");
    });

    test("should create parent directories automatically", () => {
        expect(() => appendFileSync(subFile, "data")).not.toThrow();
    });
});
