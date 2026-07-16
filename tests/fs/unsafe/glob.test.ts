import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { glob, globSync } from "@/fs/unsafe/glob";

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
        const filepaths = await glob("**/*.txt", { cwd });

        expect(filepaths).toEqual(["file1.txt", "dir1/file2.txt", "dir1/subdir1/file3.txt"]);
    });

    test("should return matched paths in absolute", async () => {
        const filepaths = await glob("**/*.txt", { cwd, absolute: true });

        expect(filepaths).toEqual([
            withCwd("file1.txt"),
            withCwd("dir1/file2.txt"),
            withCwd("dir1/subdir1/file3.txt"),
        ]);
    });

    test("should return matched dirent objects", async () => {
        const entries = await glob("**/*.txt", { cwd, withFileTypes: true });

        expect(entries.map(entry => entry.name)).toEqual(["file1.txt", "file2.txt", "file3.txt"]);
        expect(entries.map(entry => entry.parentPath)).toEqual(["", "dir1", "dir1/subdir1"]);
    });

    test("should return matched dirent objects in absolute", async () => {
        const entries = await glob("**/*.txt", { cwd, withFileTypes: true, absolute: true });

        expect(entries.map(entry => entry.name)).toEqual(["file1.txt", "file2.txt", "file3.txt"]);
        expect(entries.map(entry => entry.parentPath)).toEqual([
            withCwd(),
            withCwd("dir1"),
            withCwd("dir1/subdir1"),
        ]);
    });

    test("should match files only", async () => {
        const filepaths = await glob("dir1/**/*", {
            cwd,
            includeFiles: true,
            includeDirectories: false,
        });

        expect(filepaths).toEqual(["dir1/file2.txt", "dir1/subdir1/file3.txt"]);
    });

    test("should match directories only", async () => {
        const filepaths = await glob("dir1/**/*", {
            cwd,
            includeFiles: false,
            includeDirectories: true,
        });

        expect(filepaths).toEqual(["dir1/subdir1"]);
    });

    test("should not match excluded paths", async () => {
        const filepaths = await glob("**/*.txt", {
            cwd,
            exclude: ["dir1/subdir1/file3.txt"],
        });

        expect(filepaths).toEqual(["file1.txt", "dir1/file2.txt"]);
    });
});

describe("globSync", () => {
    test("should return matched paths", () => {
        const filepaths = globSync("**/*.txt", { cwd });

        expect(filepaths).toEqual(["file1.txt", "dir1/file2.txt", "dir1/subdir1/file3.txt"]);
    });

    test("should return matched paths in absolute", () => {
        const filepaths = globSync("**/*.txt", { cwd, absolute: true });

        expect(filepaths).toEqual([
            withCwd("file1.txt"),
            withCwd("dir1/file2.txt"),
            withCwd("dir1/subdir1/file3.txt"),
        ]);
    });

    test("should return matched dirent objects", () => {
        const entries = globSync("**/*.txt", { cwd, withFileTypes: true });

        expect(entries.map(entry => entry.name)).toEqual(["file1.txt", "file2.txt", "file3.txt"]);
        expect(entries.map(entry => entry.parentPath)).toEqual(["", "dir1", "dir1/subdir1"]);
    });

    test("should return matched dirent objects in absolute", () => {
        const entries = globSync("**/*.txt", { cwd, withFileTypes: true, absolute: true });

        expect(entries.map(entry => entry.name)).toEqual(["file1.txt", "file2.txt", "file3.txt"]);
        expect(entries.map(entry => entry.parentPath)).toEqual([
            withCwd(),
            withCwd("dir1"),
            withCwd("dir1/subdir1"),
        ]);
    });

    test("should match files only", () => {
        const filepaths = globSync("dir1/**/*", {
            cwd,
            includeFiles: true,
            includeDirectories: false,
        });

        expect(filepaths).toEqual(["dir1/file2.txt", "dir1/subdir1/file3.txt"]);
    });

    test("should match directories only", () => {
        const filepaths = globSync("dir1/**/*", {
            cwd,
            includeFiles: false,
            includeDirectories: true,
        });

        expect(filepaths).toEqual(["dir1/subdir1"]);
    });

    test("should not match excluded paths", () => {
        const filepaths = globSync("**/*.txt", {
            cwd,
            exclude: ["dir1/subdir1/file3.txt"],
        });

        expect(filepaths).toEqual(["file1.txt", "dir1/file2.txt"]);
    });
});
