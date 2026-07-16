import fs, { promises as fsp } from "node:fs";
import os from "node:os";
import path from "node:path";

import { describe, expect, test } from "vitest";

import { mkdtemp, mkdtempSync } from "@/fs/safe/mkdtemp";

describe("mkdtemp", () => {
    const prefix = "utils-test-fs-mkdtemp-";

    test("should create a temporary directory", async () => {
        const [ok, _, dir] = (await mkdtemp(prefix)).iter();
        expect(ok).toBe(true);

        expect(path.dirname(dir)).toBe(os.tmpdir());
        expect((await fsp.stat(dir)).isDirectory()).toBe(true);

        await fsp.rm(dir, { recursive: true, force: true });
    });

    test("should create a temporary directory disposable after use", async () => {
        let dir = "";
        {
            const [ok, _, value] = (
                await mkdtemp(`${prefix}disposable-`, { disposable: true })
            ).iter();
            expect(ok).toBe(true);

            await using disposable = value;
            dir = disposable.path;

            expect(path.dirname(dir)).toBe(os.tmpdir());
            expect((await fsp.stat(dir)).isDirectory()).toBe(true);
        }

        await expect(fsp.stat(dir)).rejects.toThrow();
    });

    test("should create a temporary directory in a custom directory", async () => {
        const cwd = await fsp.mkdtemp(path.join(os.tmpdir(), `${prefix}cwd-`));

        const [ok, _, dir] = (await mkdtemp("dir-", { cwd })).iter();
        expect(ok).toBe(true);

        expect(path.dirname(dir)).toBe(cwd);
        expect((await fsp.stat(dir)).isDirectory()).toBe(true);

        await fsp.rm(cwd, { recursive: true, force: true });
    });

    test("should create a temporary directory disposable after use in a custom directory", async () => {
        const cwd = await fsp.mkdtemp(path.join(os.tmpdir(), `${prefix}disposable-cwd-`));

        let dir = "";
        {
            const [ok, _, value] = (
                await mkdtemp("dir-", {
                    cwd,
                    disposable: true,
                })
            ).iter();
            expect(ok).toBe(true);

            await using disposable = value;
            dir = disposable.path;

            expect(path.dirname(dir)).toBe(cwd);
            expect((await fsp.stat(dir)).isDirectory()).toBe(true);
        }

        await expect(fsp.stat(dir)).rejects.toThrow();
        await fsp.rm(cwd, { recursive: true, force: true });
    });
});

describe("mkdtempSync", () => {
    const prefix = "utils-test-fs-mkdtempSync-";

    test("should create a temporary directory", () => {
        const [ok, _, dir] = mkdtempSync(prefix).iter();
        expect(ok).toBe(true);

        expect(path.dirname(dir)).toBe(os.tmpdir());
        expect(fs.statSync(dir).isDirectory()).toBe(true);

        fs.rmSync(dir, { recursive: true, force: true });
    });

    test("should create a temporary directory disposable after use", () => {
        let dir = "";
        {
            const [ok, _, value] = mkdtempSync(`${prefix}disposable-`, {
                disposable: true,
            }).iter();
            expect(ok).toBe(true);

            using disposable = value;
            dir = disposable.path;

            expect(path.dirname(dir)).toBe(os.tmpdir());
            expect(fs.statSync(dir).isDirectory()).toBe(true);
        }

        expect(() => fs.statSync(dir)).toThrow();
    });

    test("should create a temporary directory in a custom directory", () => {
        const cwd = fs.mkdtempSync(path.join(os.tmpdir(), `${prefix}cwd-`));

        const [ok, _, dir] = mkdtempSync("dir-", { cwd }).iter();
        expect(ok).toBe(true);

        expect(path.dirname(dir)).toBe(cwd);
        expect(fs.statSync(dir).isDirectory()).toBe(true);

        fs.rmSync(cwd, { recursive: true, force: true });
    });

    test("should create a temporary directory disposable after use in a custom directory", () => {
        const cwd = fs.mkdtempSync(path.join(os.tmpdir(), `${prefix}disposable-cwd-`));

        let dir = "";
        {
            const [ok, _, value] = mkdtempSync("dir-", {
                cwd,
                disposable: true,
            }).iter();
            expect(ok).toBe(true);

            using disposable = value;
            dir = disposable.path;

            expect(path.dirname(dir)).toBe(cwd);
            expect(fs.statSync(dir).isDirectory()).toBe(true);
        }

        expect(() => fs.statSync(dir)).toThrow();
        fs.rmSync(cwd, { recursive: true, force: true });
    });
});
