import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { VFile } from "@/fs/safe/vfile";
import { err } from "@/result";

let tmpDir: string;

beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "utils-fs-safe-vfile-"));
});

afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
});

describe("SafeVFile", () => {
    describe("raw / value", () => {
        it("should set and get raw content", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));
            vfile.raw("hello");

            const result = vfile.raw();

            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toBe("hello");
        });

        it("should set and get a typed value", () => {
            const vfile = new VFile<string[]>(join(tmpDir, "file.txt"));
            vfile.value(["a", "b"]);

            const result = vfile.value();

            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toEqual(["a", "b"]);
        });

        it("should return Err from raw() when no content is set", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));

            expect(vfile.raw().isErr()).toBe(true);
        });

        it("should return Err from value() when no content is set", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));

            expect(vfile.value().isErr()).toBe(true);
        });
    });

    describe("transformer", () => {
        it("should use the json transformer to parse raw into value", () => {
            const vfile = new VFile(join(tmpDir, "file.json")).transformer("json");
            vfile.raw('{"key":"val"}');

            const result = vfile.value();

            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toEqual({ key: "val" });
        });

        it("should use the json transformer to stringify value into raw", () => {
            const vfile = new VFile<{ key: string }>(join(tmpDir, "file.json")).transformer("json");
            vfile.value({ key: "val" });

            const result = vfile.raw();

            expect(result.isOk()).toBe(true);
            expect(JSON.parse(result.unwrap() as string)).toEqual({ key: "val" });
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

            const result = vfile.lines();

            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toEqual(["line1", "line2", "line3"]);
        });

        it("should return Err when no content is set", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));

            expect(vfile.lines().isErr()).toBe(true);
        });
    });

    describe("append", () => {
        it("should append a value with newline by default", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));
            // Call value() getter to populate both _raw and _value
            vfile.raw("first");
            vfile.value();
            vfile.append("second");

            expect(vfile.raw().unwrap()).toBe("first\nsecond");
        });

        it("should append a value without newline when specified", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));
            vfile.raw("first");
            vfile.value();
            vfile.append("second", false);

            expect(vfile.raw().unwrap()).toBe("firstsecond");
        });

        it("should set content when VFile has no existing content", () => {
            const vfile = new VFile(join(tmpDir, "file.txt"));
            vfile.append("first");

            expect(vfile.raw().unwrap()).toBe("first");
        });

        it("should return Err when the transformer fails to stringify the value", () => {
            const vfile = new VFile(join(tmpDir, "file.json")).transformer({
                parse: () => err(new Error("parse error")),
                stringify: () => err(new Error("stringify error")),
            });

            expect(vfile.append("bad").isErr()).toBe(true);
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
        it("should read file content into raw and return value as Ok", async () => {
            const filepath = join(tmpDir, "file.txt");
            writeFileSync(filepath, "content");
            const vfile = new VFile(filepath);

            const result = await vfile.read();

            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toBe("content");
        });

        it("should read file content synchronously", () => {
            const filepath = join(tmpDir, "file.txt");
            writeFileSync(filepath, "sync-content");
            const vfile = new VFile(filepath);

            const result = vfile.readSync();

            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toBe("sync-content");
        });

        it("should return Err when file does not exist", async () => {
            const vfile = new VFile(join(tmpDir, "missing.txt"));

            const result = await vfile.read();

            expect(result.isErr()).toBe(true);
        });

        it("should return Err from readSync when file does not exist", () => {
            const vfile = new VFile(join(tmpDir, "missing.txt"));

            expect(vfile.readSync().isErr()).toBe(true);
        });
    });

    describe("write / writeSync", () => {
        it("should write raw content to disk and return Ok", async () => {
            const filepath = join(tmpDir, "out.txt");
            const vfile = new VFile(filepath);
            vfile.raw("written");

            const result = await vfile.write();

            expect(result.isOk()).toBe(true);
        });

        it("should write raw content synchronously and return Ok", () => {
            const filepath = join(tmpDir, "out.txt");
            const vfile = new VFile(filepath);
            vfile.raw("sync-written");

            const result = vfile.writeSync();

            expect(result.isOk()).toBe(true);
        });

        it("should return Err from write() when no content is set", async () => {
            const vfile = new VFile(join(tmpDir, "empty.txt"));

            const result = await vfile.write();

            expect(result.isErr()).toBe(true);
        });

        it("should return Err from writeSync() when no content is set", () => {
            const vfile = new VFile(join(tmpDir, "empty.txt"));

            expect(vfile.writeSync().isErr()).toBe(true);
        });
    });

    describe("rm / rmSync", () => {
        it("should remove the file and return Ok", async () => {
            const filepath = join(tmpDir, "file.txt");
            writeFileSync(filepath, "bye");
            const vfile = new VFile(filepath);

            const result = await vfile.rm();

            expect(result.isOk()).toBe(true);
            expect(vfile.existsSync()).toBe(false);
        });

        it("should remove the file synchronously and return Ok", () => {
            const filepath = join(tmpDir, "file-sync.txt");
            writeFileSync(filepath, "bye-sync");
            const vfile = new VFile(filepath);

            const result = vfile.rmSync();

            expect(result.isOk()).toBe(true);
            expect(vfile.existsSync()).toBe(false);
        });
    });

    describe("cp / cpSync", () => {
        it("should copy the file and return Ok", async () => {
            const src = join(tmpDir, "src.txt");
            const dest = join(tmpDir, "dest.txt");
            writeFileSync(src, "copy-me");
            const vfile = new VFile(src);

            const result = await vfile.cp(dest);

            expect(result.isOk()).toBe(true);
        });

        it("should copy the file synchronously and return Ok", () => {
            const src = join(tmpDir, "src.txt");
            const dest = join(tmpDir, "dest-sync.txt");
            writeFileSync(src, "copy-me-sync");
            const vfile = new VFile(src);

            const result = vfile.cpSync(dest);

            expect(result.isOk()).toBe(true);
        });
    });
});
