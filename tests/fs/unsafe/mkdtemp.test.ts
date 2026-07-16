import fs, { promises as fsp } from "node:fs";
import os from "node:os";
import path from "node:path";

import { describe, expect, test } from "vitest";

import { mkdtemp, mkdtempSync } from "@/fs/unsafe/mkdtemp";

describe("mkdtemp", () => {
    const prefix = "utils-test-fs-mkdtemp-";

    test("should create a temporary directory", async () => {
        const dir = await mkdtemp(prefix);

        expect(path.dirname(dir)).toBe(os.tmpdir());
        expect((await fsp.stat(dir)).isDirectory()).toBe(true);

        await fsp.rm(dir, { recursive: true, force: true });
    });

    test("should create a temporary directory disposable after use", async () => {
        let dir = "";
        {
            await using disposable = await mkdtemp(`${prefix}disposable-`, { disposable: true });
            dir = disposable.path;

            expect(path.dirname(dir)).toBe(os.tmpdir());
            expect((await fsp.stat(dir)).isDirectory()).toBe(true);
        }

        expect(fsp.stat(dir)).rejects.toThrow();
    });

    test("should create a temporary directory in a custom directory", async () => {
        const cwd = await fsp.mkdtemp(path.join(os.tmpdir(), `${prefix}cwd-`));

        const dir = await mkdtemp("dir-", { cwd });

        expect(path.dirname(dir)).toBe(cwd);
        expect((await fsp.stat(dir)).isDirectory()).toBe(true);

        await fsp.rm(cwd, { recursive: true, force: true });
    });

    test("should create a temporary directory disposable after use in a custom directory", async () => {
        const cwd = await fsp.mkdtemp(path.join(os.tmpdir(), `${prefix}disposable-cwd-`));

        let dir = "";
        {
            await using disposable = await mkdtemp("dir-", {
                cwd,
                disposable: true,
            });
            dir = disposable.path;

            expect(path.dirname(dir)).toBe(cwd);
            expect((await fsp.stat(dir)).isDirectory()).toBe(true);
        }

        expect(fsp.stat(dir)).rejects.toThrow();
        await fsp.rm(cwd, { recursive: true, force: true });
    });
});

describe("mkdtempSync", () => {
    const prefix = "utils-test-fs-mkdtempSync-";

    test("should create a temporary directory", () => {
        const dir = mkdtempSync(prefix);

        expect(path.dirname(dir)).toBe(os.tmpdir());
        expect(fs.statSync(dir).isDirectory()).toBe(true);

        fs.rmSync(dir, { recursive: true, force: true });
    });

    test("should create a temporary directory disposable after use", () => {
        let dir = "";
        {
            using disposable = mkdtempSync(`${prefix}disposable-`, { disposable: true });
            dir = disposable.path;

            expect(path.dirname(dir)).toBe(os.tmpdir());
            expect(fs.statSync(dir).isDirectory()).toBe(true);
        }

        expect(() => fs.statSync(dir)).toThrow();
    });

    test("should create a temporary directory in a custom directory", () => {
        const cwd = fs.mkdtempSync(path.join(os.tmpdir(), `${prefix}cwd-`));

        const dir = mkdtempSync("dir-", { cwd });

        expect(path.dirname(dir)).toBe(cwd);
        expect(fs.statSync(dir).isDirectory()).toBe(true);

        fs.rmSync(cwd, { recursive: true, force: true });
    });

    test("should create a temporary directory disposable after use in a custom directory", () => {
        const cwd = fs.mkdtempSync(path.join(os.tmpdir(), `${prefix}disposable-cwd-`));

        let dir = "";
        {
            using disposable = mkdtempSync("dir-", {
                cwd,
                disposable: true,
            });
            dir = disposable.path;

            expect(path.dirname(dir)).toBe(cwd);
            expect(fs.statSync(dir).isDirectory()).toBe(true);
        }

        expect(() => fs.statSync(dir)).toThrow();
        fs.rmSync(cwd, { recursive: true, force: true });
    });
});
