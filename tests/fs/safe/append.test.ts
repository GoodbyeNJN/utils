import { beforeEach, describe, expect, vi } from "vitest";

import { appendFile, appendFileSync } from "@/fs/safe/append";

import { fs, vol } from "../../helpers/memfs";
import { test } from "../../helpers/tester";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const file = "/file.txt";
const subFile = "/dir/file.txt";

describe("appendFile", () => {
    test("should append data to an existing file with a leading newline by default", async () => {
        fs.writeFileSync(file, "first");

        const result = await appendFile(file, "second");

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(file, "utf-8")).toBe("first\nsecond");
    });

    test("should append data without a newline when newline is false", async () => {
        fs.writeFileSync(file, "first");

        const result = await appendFile(file, "second", { newline: false });

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(file, "utf-8")).toBe("firstsecond");
    });

    test("should create parent directories automatically", async () => {
        const result = await appendFile(subFile, "data");

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(subFile, "utf-8")).toBe("\ndata");
    });
});

describe("appendFileSync", () => {
    test("should append data to an existing file with a leading newline by default", () => {
        fs.writeFileSync(file, "first");

        const result = appendFileSync(file, "second");

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(file, "utf-8")).toBe("first\nsecond");
    });

    test("should append data without a newline when newline is false", () => {
        fs.writeFileSync(file, "first");

        const result = appendFileSync(file, "second", { newline: false });

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(file, "utf-8")).toBe("firstsecond");
    });

    test("should create parent directories automatically", () => {
        const result = appendFileSync(subFile, "data");

        expect(result.isOk()).toBe(true);
        expect(fs.readFileSync(subFile, "utf-8")).toBe("\ndata");
    });
});
