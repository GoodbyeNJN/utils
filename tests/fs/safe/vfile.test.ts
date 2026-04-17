import { beforeEach, describe, expect, test, vi } from "vitest";

import { VFile } from "@/fs/safe/vfile";
import { err } from "@/result";

import { fs, vol } from "../../helpers/memfs";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const file = "/file.txt";
const json = "/data.json";
const srcFile = "/src.txt";
const destFile = "/dest.txt";

describe("SafeVFile", () => {
    describe("raw / value", () => {
        test("should set and get raw content", () => {
            const vfile = new VFile(file);
            vfile.raw("hello");

            const result = vfile.raw();

            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toBe("hello");
        });

        test("should set and get a typed value", () => {
            const vfile = new VFile<string[]>(file);
            vfile.value(["a", "b"]);

            const result = vfile.value();

            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toEqual(["a", "b"]);
        });

        test("should return Err from raw() when no content is set", () => {
            const vfile = new VFile(file);

            expect(vfile.raw().isErr()).toBe(true);
        });

        test("should return Err from value() when no content is set", () => {
            const vfile = new VFile(file);

            expect(vfile.value().isErr()).toBe(true);
        });
    });

    describe("transformer", () => {
        test("should use the json transformer to parse raw into value", () => {
            const vfile = new VFile(json).transformer("json");
            vfile.raw('{"key":"val"}');

            const result = vfile.value();

            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toEqual({ key: "val" });
        });

        test("should use the json transformer to stringify value into raw", () => {
            const vfile = new VFile<{ key: string }>(json).transformer("json");
            vfile.value({ key: "val" });

            const result = vfile.raw();

            expect(result.isOk()).toBe(true);
            expect(JSON.parse(result.unwrap() as string)).toEqual({ key: "val" });
        });

        test("should return the current transformer when called without arguments", () => {
            const vfile = new VFile(json).transformer("json");

            expect(vfile.transformer()).toBeDefined();
        });
    });

    describe("lines", () => {
        test("should split raw content into lines", () => {
            const vfile = new VFile(file);
            vfile.raw("line1\nline2\nline3");

            const result = vfile.lines();

            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toEqual(["line1", "line2", "line3"]);
        });

        test("should return Err when no content is set", () => {
            const vfile = new VFile(file);

            expect(vfile.lines().isErr()).toBe(true);
        });
    });

    describe("append", () => {
        test("should append a value with newline by default", () => {
            const vfile = new VFile(file);
            // Call value() getter to populate both _raw and _value
            vfile.raw("first");
            vfile.value();
            vfile.append("second");

            expect(vfile.raw().unwrap()).toBe("first\nsecond");
        });

        test("should append a value without newline when specified", () => {
            const vfile = new VFile(file);
            vfile.raw("first");
            vfile.value();
            vfile.append("second", false);

            expect(vfile.raw().unwrap()).toBe("firstsecond");
        });

        test("should set content when VFile has no existing content", () => {
            const vfile = new VFile(file);
            vfile.append("first");

            expect(vfile.raw().unwrap()).toBe("first");
        });

        test("should return Err when the transformer fails to stringify the value", () => {
            const vfile = new VFile(json).transformer({
                parse: () => err(new Error("parse error")),
                stringify: () => err(new Error("stringify error")),
            });

            expect(vfile.append("bad").isErr()).toBe(true);
        });
    });

    describe("exists / existsSync", () => {
        test("should return true when the file exists", async () => {
            fs.writeFileSync(file, "hello");
            const vfile = new VFile(file);

            expect(await vfile.exists()).toBe(true);
            expect(vfile.existsSync()).toBe(true);
        });

        test("should return false when the file does not exist", async () => {
            const vfile = new VFile(file);

            expect(await vfile.exists()).toBe(false);
            expect(vfile.existsSync()).toBe(false);
        });
    });

    describe("read / readSync", () => {
        test("should read file content into raw and return value as Ok", async () => {
            fs.writeFileSync(file, "content");
            const vfile = new VFile(file);

            const result = await vfile.read();

            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toBe("content");
        });

        test("should read file content synchronously", () => {
            fs.writeFileSync(file, "sync-content");
            const vfile = new VFile(file);

            const result = vfile.readSync();

            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toBe("sync-content");
        });

        test("should return Err when file does not exist", async () => {
            const vfile = new VFile(file);

            const result = await vfile.read();

            expect(result.isErr()).toBe(true);
        });

        test("should return Err from readSync when file does not exist", () => {
            const vfile = new VFile(file);

            expect(vfile.readSync().isErr()).toBe(true);
        });
    });

    describe("write / writeSync", () => {
        test("should write raw content to disk and return Ok", async () => {
            const vfile = new VFile(file);
            vfile.raw("written");

            const result = await vfile.write();

            expect(result.isOk()).toBe(true);
        });

        test("should write raw content synchronously and return Ok", () => {
            const vfile = new VFile(file);
            vfile.raw("sync-written");

            const result = vfile.writeSync();

            expect(result.isOk()).toBe(true);
        });

        test("should return Err from write() when no content is set", async () => {
            const vfile = new VFile(file);

            const result = await vfile.write();

            expect(result.isErr()).toBe(true);
        });

        test("should return Err from writeSync() when no content is set", () => {
            const vfile = new VFile(file);

            expect(vfile.writeSync().isErr()).toBe(true);
        });
    });

    describe("rm / rmSync", () => {
        test("should remove the file and return Ok", async () => {
            fs.writeFileSync(file, "bye");
            const vfile = new VFile(file);

            const result = await vfile.rm();

            expect(result.isOk()).toBe(true);
            expect(vfile.existsSync()).toBe(false);
        });

        test("should remove the file synchronously and return Ok", () => {
            fs.writeFileSync(file, "bye-sync");
            const vfile = new VFile(file);

            const result = vfile.rmSync();

            expect(result.isOk()).toBe(true);
            expect(vfile.existsSync()).toBe(false);
        });
    });

    describe("cp / cpSync", () => {
        test("should copy the file and return Ok", async () => {
            fs.writeFileSync(srcFile, "copy-me");
            const vfile = new VFile(srcFile);

            const result = await vfile.cp(destFile);

            expect(result.isOk()).toBe(true);
        });

        test("should copy the file synchronously and return Ok", () => {
            fs.writeFileSync(srcFile, "copy-me-sync");
            const vfile = new VFile(srcFile);

            const result = vfile.cpSync(destFile);

            expect(result.isOk()).toBe(true);
        });
    });
});
