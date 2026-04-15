import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { isNil, nil } from "@/common";
import { VFile } from "@/fs/unsafe/vfile";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-unsafe-vfile-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("UnsafeVFile", () => {
    describe("raw / value", () => {
        it("should set and get raw content", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));
            vfile.raw("hello");

            expect(vfile.raw()).toBe("hello");
        });

        it("should set and get a typed value", () => {
            const vfile = new VFile<string[]>(join(tmpDir, "file.txt"));
            vfile.value(["a", "b"]);

            expect(vfile.value()).toEqual(["a", "b"]);
        });

        it("should return nil when no content is set", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));

            expect(isNil(vfile.raw())).toBe(true);
        });

        it("should return nil from value() when no content is set", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));

            expect(isNil(vfile.value())).toBe(true);
        });
    });

    describe("transformer", () => {
        it("should use the json transformer to parse raw into value", () => {
            const vfile = new VFile(join(tmpDir, "file.json")).transformer("json");
            vfile.raw('{"key":"val"}');

            expect(vfile.value()).toEqual({ key: "val" });
        });

        it("should use the json transformer to stringify value into raw", () => {
            const vfile = new VFile<{ key: string }>(join(tmpDir, "file.json")).transformer("json");
            vfile.value({ key: "val" });

            const raw = vfile.raw();
            expect(typeof raw).toBe("string");
            expect(JSON.parse(raw as string)).toEqual({ key: "val" });
        });

        it("should return the current transformer when called without arguments", () => {
            const vfile = new VFile(join(tmpDir, "file.json")).transformer("json");

            expect(vfile.transformer()).toBeDefined();
        });
    });

    describe("lines", () => {
        it("should split raw content into lines", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));
            vfile.raw("line1\nline2\nline3");

            expect(vfile.lines()).toEqual(["line1", "line2", "line3"]);
        });

        it("should return empty array when no content is set", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));

            expect(vfile.lines()).toEqual([]);
        });
    });

    describe("append", () => {
        it("should append a value with newline by default", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));
            // Set value then trigger raw() getter to populate both _raw and _value
            vfile.value("first");
            vfile.raw();
            vfile.append("second");

            expect(vfile.raw()).toBe("first\nsecond");
        });

        it("should append a value without newline when specified", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));
            vfile.value("first");
            vfile.raw();
            vfile.append("second", false);

            expect(vfile.raw()).toBe("firstsecond");
        });

        it("should set content when VFile has no existing content", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));
            vfile.append("first");

            expect(vfile.raw()).toBe("first");
        });

        it("should throw when the transformer fails to stringify the value", () => {
            const vfile = new VFile(join(tmpDir, "file.json")).transformer({
                parse: raw => raw,
                stringify: () => nil,
            });

            expect(() => vfile.append("bad")).toThrow(TypeError);
        });
    });

    describe("exists / existsSync", () => {
        it("should return true when the file exists", async () => {
            const filepath = join(tmpDir, "file.txt");
            writeFileSync(filepath, "hello");
            const vfile = new VFile(filepath);

            expect(await vfile.exists()).toBe(true);
            expect(vfile.existsSync()).toBe(true);
        });

        it("should return false when the file does not exist", async () => {
            const vfile = new VFile(join(tmpDir, "missing.txt"));

            expect(await vfile.exists()).toBe(false);
            expect(vfile.existsSync()).toBe(false);
        });
    });

    describe("read / readSync", () => {
        it("should read file content and return the string value", async () => {
            const filepath = join(tmpDir, "file.txt");
            writeFileSync(filepath, "content");
            const vfile = new VFile(filepath);

            const value = await vfile.read();

            expect(value).toBe("content");
        });

        it("should read file content synchronously", () => {
            const filepath = join(tmpDir, "file.txt");
            writeFileSync(filepath, "sync-content");
            const vfile = new VFile(filepath);

            expect(vfile.readSync()).toBe("sync-content");
        });

        it("should return nil when file does not exist", async () => {
            const vfile = new VFile(join(tmpDir, "missing.txt"));

            expect(isNil(await vfile.read())).toBe(true);
        });

        it("should return nil from readSync when file does not exist", () => {
            const vfile = new VFile(join(tmpDir, "missing.txt"));

            expect(isNil(vfile.readSync())).toBe(true);
        });
    });

    describe("write / writeSync", () => {
        it("should write raw content to disk", async () => {
            const filepath = join(tmpDir, "out.txt");
            const vfile = new VFile(filepath);
            vfile.raw("written");

            await vfile.write();

            expect(vfile.existsSync()).toBe(true);
        });

        it("should write raw content synchronously", () => {
            const filepath = join(tmpDir, "out.txt");
            const vfile = new VFile(filepath);
            vfile.raw("sync-written");

            vfile.writeSync();

            expect(vfile.existsSync()).toBe(true);
        });

        it("should throw when write() is called with no content", async () => {
            const vfile = new VFile(join(tmpDir, "empty.txt"));

            await expect(vfile.write()).rejects.toThrow(TypeError);
        });

        it("should throw when writeSync() is called with no content", () => {
            const vfile = new VFile(join(tmpDir, "empty.txt"));

            expect(() => vfile.writeSync()).toThrow(TypeError);
        });
    });

    describe("rm / rmSync", () => {
        it("should remove the file", async () => {
            const filepath = join(tmpDir, "file.txt");
            writeFileSync(filepath, "bye");
            const vfile = new VFile(filepath);

            await vfile.rm();

            expect(vfile.existsSync()).toBe(false);
        });

        it("should remove the file synchronously", () => {
            const filepath = join(tmpDir, "file-sync.txt");
            writeFileSync(filepath, "bye-sync");
            const vfile = new VFile(filepath);

            vfile.rmSync();

            expect(vfile.existsSync()).toBe(false);
        });
    });

    describe("cp / cpSync", () => {
        it("should copy the file", async () => {
            const src = join(tmpDir, "src.txt");
            const dest = join(tmpDir, "dest.txt");
            writeFileSync(src, "copy-me");
            const vfile = new VFile(src);

            await vfile.cp(dest);

            const destFile = new VFile(dest);
            expect(destFile.existsSync()).toBe(true);
        });

        it("should copy the file synchronously", () => {
            const src = join(tmpDir, "src.txt");
            const dest = join(tmpDir, "dest-sync.txt");
            writeFileSync(src, "copy-me-sync");
            const vfile = new VFile(src);

            vfile.cpSync(dest);

            const destFile = new VFile(dest);
            expect(destFile.existsSync()).toBe(true);
        });
    });
});
