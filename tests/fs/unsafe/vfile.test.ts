import { beforeEach, describe, expect, test, vi } from "vitest";

import { VFile } from "@/fs/unsafe/vfile";
import { None } from "@/option";

import { fs, vol } from "../memfs";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
    vol.reset();
});

const file = "/file.txt";
const json = "/data.json";
const srcFile = "/src.txt";
const destFile = "/dest.txt";

describe("UnsafeVFile", () => {
    describe("raw / value", () => {
        test("should set and get raw content", () => {
            const vfile = new VFile(file);
            vfile.raw("hello");

            const result = vfile.raw();

            expect(result.isSome()).toBe(true);
            expect(result.unwrap()).toBe("hello");
        });

        test("should set and get a typed value", () => {
            const vfile = new VFile<string[]>(file);
            vfile.value(["a", "b"]);

            const result = vfile.value();

            expect(result.isSome()).toBe(true);
            expect(result.unwrap()).toEqual(["a", "b"]);
        });

        test("should return None from raw() when no content is set", () => {
            const vfile = new VFile(file);

            expect(vfile.raw().isNone()).toBe(true);
        });

        test("should return None from value() when no content is set", () => {
            const vfile = new VFile(file);

            expect(vfile.value().isNone()).toBe(true);
        });
    });

    describe("transformer", () => {
        test("should use the json transformer to parse raw into value", () => {
            const vfile = new VFile(json).transformer("json");
            vfile.raw('{"key":"val"}');

            const result = vfile.value();

            expect(result.isSome()).toBe(true);
            expect(result.unwrap()).toEqual({ key: "val" });
        });

        test("should use the json transformer to stringify value into raw", () => {
            const vfile = new VFile<{ key: string }>(json).transformer("json");
            vfile.value({ key: "val" });

            const result = vfile.raw();
            expect(result.isSome()).toBe(true);
            expect(JSON.parse(result.unwrap())).toEqual({ key: "val" });
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

            expect(result.isSome()).toBe(true);
            expect(result.unwrap()).toEqual(["line1", "line2", "line3"]);
        });

        test("should return None when no content is set", () => {
            const vfile = new VFile(file);

            expect(vfile.lines().isNone()).toBe(true);
        });
    });

    describe("append", () => {
        test("should append a value with newline by default", () => {
            const vfile = new VFile(file);
            // Set value then trigger raw() getter to populate both _raw and _value
            vfile.value("first");
            vfile.raw();
            vfile.append("second");

            expect(vfile.raw().unwrap()).toBe("first\nsecond");
        });

        test("should append a value without newline when specified", () => {
            const vfile = new VFile(file);
            vfile.value("first");
            vfile.raw();
            vfile.append("second", false);

            expect(vfile.raw().unwrap()).toBe("firstsecond");
        });

        test("should set content when VFile has no existing content", () => {
            const vfile = new VFile(file);
            vfile.append("first");

            expect(vfile.raw().unwrap()).toBe("first");
        });

        test("should throw when the transformer fails to stringify the value", () => {
            const vfile = new VFile(json).transformer({
                parse: () => None(),
                stringify: () => None(),
            });

            expect(() => vfile.append("bad")).toThrow();
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
        test("should read file content into raw and return Some", async () => {
            fs.writeFileSync(file, "content");
            const vfile = new VFile(file);

            const result = await vfile.read();

            expect(result.isSome()).toBe(true);
            expect(result.unwrap()).toBe("content");
        });

        test("should read file content synchronously", () => {
            fs.writeFileSync(file, "sync-content");
            const vfile = new VFile(file);

            const result = vfile.readSync();

            expect(result.isSome()).toBe(true);
            expect(result.unwrap()).toBe("sync-content");
        });

        test("should return None when file does not exist", async () => {
            const vfile = new VFile(file);

            const result = await vfile.read();

            expect(result.isNone()).toBe(true);
        });

        test("should return None from readSync when file does not exist", () => {
            const vfile = new VFile(file);

            const result = vfile.readSync();

            expect(result.isNone()).toBe(true);
        });
    });

    describe("write / writeSync", () => {
        test("should write raw content to disk", async () => {
            const vfile = new VFile(file);
            vfile.raw("written");

            await vfile.write();

            expect(vfile.existsSync()).toBe(true);
        });

        test("should write raw content synchronously", () => {
            const vfile = new VFile(file);
            vfile.raw("sync-written");

            vfile.writeSync();

            expect(vfile.existsSync()).toBe(true);
        });

        test("should throw when write() is called with no content", async () => {
            const vfile = new VFile(file);

            await expect(vfile.write()).rejects.toThrow(TypeError);
        });

        test("should throw when writeSync() is called with no content", () => {
            const vfile = new VFile(file);

            expect(() => vfile.writeSync()).toThrow(TypeError);
        });
    });

    describe("rm / rmSync", () => {
        test("should remove the file", async () => {
            fs.writeFileSync(file, "bye");
            const vfile = new VFile(file);

            await vfile.rm();

            expect(vfile.existsSync()).toBe(false);
        });

        test("should remove the file synchronously", () => {
            fs.writeFileSync(file, "bye-sync");
            const vfile = new VFile(file);

            vfile.rmSync();

            expect(vfile.existsSync()).toBe(false);
        });
    });

    describe("cp / cpSync", () => {
        test("should copy the file", async () => {
            fs.writeFileSync(srcFile, "copy-me");
            const vfile1 = new VFile(srcFile);

            await vfile1.cp(destFile);

            const vfile2 = new VFile(destFile);
            expect(vfile2.existsSync()).toBe(true);
        });

        test("should copy the file synchronously", () => {
            fs.writeFileSync(srcFile, "copy-me-sync");
            const vfile1 = new VFile(srcFile);

            vfile1.cpSync(destFile);

            const vfile2 = new VFile(destFile);
            expect(vfile2.existsSync()).toBe(true);
        });
    });
});
