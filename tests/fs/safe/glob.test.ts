import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { glob, globSync } from "@/fs/safe/glob";

let cwd = "";
const withCwd = (...paths: string[]) => path.join(cwd, ...paths);

beforeAll(async () => {
    cwd = await fsp.mkdtemp(path.join(os.tmpdir(), "utils-test-fs-glob-"));

    await fsp.mkdir(withCwd("dir1", "subdir1"), { recursive: true });
    await Promise.all([
        fsp.writeFile(withCwd("file1.txt"), "content1"),
        fsp.writeFile(withCwd("dir1", "file2.txt"), "content2"),
        fsp.writeFile(withCwd("dir1", "subdir1", "file3.txt"), "content3"),
    ]);
});
afterAll(async () => {
    await fsp.rm(cwd, { recursive: true, force: true });
});

describe("glob", () => {
    test("should return matched paths", async () => {
        const [ok, _, filepaths] = (await glob("**/*.txt", { cwd })).iter();
        expect(ok).toBe(true);

        expect(filepaths).toEqual(["file1.txt", "dir1/file2.txt", "dir1/subdir1/file3.txt"]);
    });

    test("should return matched paths in absolute", async () => {
        const [ok, _, filepaths] = (await glob("**/*.txt", { cwd, absolute: true })).iter();
        expect(ok).toBe(true);

        expect(filepaths).toEqual([
            withCwd("file1.txt"),
            withCwd("dir1/file2.txt"),
            withCwd("dir1/subdir1/file3.txt"),
        ]);
    });

    test("should return matched dirent objects", async () => {
        const [ok, _, entries] = (await glob("**/*.txt", { cwd, withFileTypes: true })).iter();
        expect(ok).toBe(true);

        expect(entries.map(entry => entry.name)).toEqual(["file1.txt", "file2.txt", "file3.txt"]);
        expect(entries.map(entry => entry.parentPath)).toEqual(["", "dir1", "dir1/subdir1"]);
    });

    test("should return matched dirent objects in absolute", async () => {
        const [ok, _, entries] = (
            await glob("**/*.txt", { cwd, withFileTypes: true, absolute: true })
        ).iter();
        expect(ok).toBe(true);

        expect(entries.map(entry => entry.name)).toEqual(["file1.txt", "file2.txt", "file3.txt"]);
        expect(entries.map(entry => entry.parentPath)).toEqual([
            withCwd(),
            withCwd("dir1"),
            withCwd("dir1/subdir1"),
        ]);
    });

    test("should match files only", async () => {
        const [ok, _, filepaths] = (
            await glob("dir1/**/*", {
                cwd,
                includeFiles: true,
                includeDirectories: false,
            })
        ).iter();
        expect(ok).toBe(true);

        expect(filepaths).toEqual(["dir1/file2.txt", "dir1/subdir1/file3.txt"]);
    });

    test("should match directories only", async () => {
        const [ok, _, filepaths] = (
            await glob("dir1/**/*", {
                cwd,
                includeFiles: false,
                includeDirectories: true,
            })
        ).iter();
        expect(ok).toBe(true);

        expect(filepaths).toEqual(["dir1/subdir1"]);
    });

    test("should not match excluded paths", async () => {
        const [ok, _, filepaths] = (
            await glob("**/*.txt", {
                cwd,
                exclude: ["dir1/subdir1/file3.txt"],
            })
        ).iter();
        expect(ok).toBe(true);

        expect(filepaths).toEqual(["file1.txt", "dir1/file2.txt"]);
    });
});

describe("globSync", () => {
    test("should return matched paths", () => {
        const [ok, _, filepaths] = globSync("**/*.txt", { cwd }).iter();
        expect(ok).toBe(true);

        expect(filepaths).toEqual(["file1.txt", "dir1/file2.txt", "dir1/subdir1/file3.txt"]);
    });

    test("should return matched paths in absolute", () => {
        const [ok, _, filepaths] = globSync("**/*.txt", { cwd, absolute: true }).iter();
        expect(ok).toBe(true);

        expect(filepaths).toEqual([
            withCwd("file1.txt"),
            withCwd("dir1/file2.txt"),
            withCwd("dir1/subdir1/file3.txt"),
        ]);
    });

    test("should return matched dirent objects", () => {
        const [ok, _, entries] = globSync("**/*.txt", { cwd, withFileTypes: true }).iter();
        expect(ok).toBe(true);

        expect(entries.map(entry => entry.name)).toEqual(["file1.txt", "file2.txt", "file3.txt"]);
        expect(entries.map(entry => entry.parentPath)).toEqual(["", "dir1", "dir1/subdir1"]);
    });

    test("should return matched dirent objects in absolute", () => {
        const [ok, _, entries] = globSync("**/*.txt", {
            cwd,
            withFileTypes: true,
            absolute: true,
        }).iter();
        expect(ok).toBe(true);

        expect(entries.map(entry => entry.name)).toEqual(["file1.txt", "file2.txt", "file3.txt"]);
        expect(entries.map(entry => entry.parentPath)).toEqual([
            withCwd(),
            withCwd("dir1"),
            withCwd("dir1/subdir1"),
        ]);
    });

    test("should match files only", () => {
        const [ok, _, filepaths] = globSync("dir1/**/*", {
            cwd,
            includeFiles: true,
            includeDirectories: false,
        }).iter();
        expect(ok).toBe(true);

        expect(filepaths).toEqual(["dir1/file2.txt", "dir1/subdir1/file3.txt"]);
    });

    test("should match directories only", () => {
        const [ok, _, filepaths] = globSync("dir1/**/*", {
            cwd,
            includeFiles: false,
            includeDirectories: true,
        }).iter();
        expect(ok).toBe(true);

        expect(filepaths).toEqual(["dir1/subdir1"]);
    });

    test("should not match excluded paths", () => {
        const [ok, _, filepaths] = globSync("**/*.txt", {
            cwd,
            exclude: ["dir1/subdir1/file3.txt"],
        }).iter();
        expect(ok).toBe(true);

        expect(filepaths).toEqual(["file1.txt", "dir1/file2.txt"]);
    });
});
