import { describe, expect, test } from "vitest";

import { BaseVFile } from "@/fs/vfile";

describe("BaseVFile", () => {
    describe("constructor", () => {
        test("should accept an absolute path", () => {
            const vfile = new BaseVFile("/home/user/project/src/page/index.js");

            expect(vfile.pathname()).toBe("/home/user/project/src/page/index.js");
        });

        test("should accept a relative path", () => {
            const vfile = new BaseVFile("src/page/index.js");

            expect(vfile.pathname.relative()).toBe("src/page/index.js");
        });

        test("should accept a custom cwd", () => {
            const vfile = new BaseVFile("src/page/index.js", "/home/user/project");

            expect(vfile.cwd()).toBe("/home/user/project");
        });
    });

    describe("cwd", () => {
        test("should get and set the cwd", () => {
            const vfile = new BaseVFile("/home/user/file.ts");

            vfile.cwd("/other/dir");

            expect(vfile.cwd()).toBe("/other/dir");
        });
    });

    describe("filename", () => {
        test("should return the filename without extension", () => {
            const vfile = new BaseVFile("/home/user/project/index.js");

            expect(vfile.filename()).toBe("index");
        });

        test("should set the filename", () => {
            const vfile = new BaseVFile("/home/user/project/index.js");
            vfile.filename("main");

            expect(vfile.filename()).toBe("main");
        });
    });

    describe("extname", () => {
        test("should return the extension without the dot", () => {
            const vfile = new BaseVFile("/home/user/project/index.js");

            expect(vfile.extname()).toBe("js");
        });

        test("should set the extension", () => {
            const vfile = new BaseVFile("/home/user/project/index.js");
            vfile.extname("ts");

            expect(vfile.extname()).toBe("ts");
        });
    });

    describe("basename", () => {
        test("should return filename + extension", () => {
            const vfile = new BaseVFile("/home/user/project/index.js");

            expect(vfile.basename()).toBe("index.js");
        });

        test("should set filename and extension from basename", () => {
            const vfile = new BaseVFile("/home/user/project/index.js");
            vfile.basename("main.ts");

            expect(vfile.filename()).toBe("main");
            expect(vfile.extname()).toBe("ts");
        });
    });

    describe("dirname", () => {
        test("should return the relative dirname", () => {
            const vfile = new BaseVFile(
                "/home/user/project/src/page/index.js",
                "/home/user/project",
            );

            expect(vfile.dirname()).toBe("src/page");
        });

        test("should return the absolute dirname", () => {
            const vfile = new BaseVFile(
                "/home/user/project/src/page/index.js",
                "/home/user/project",
            );

            expect(vfile.dirname.absolute()).toBe("/home/user/project/src/page");
        });
    });

    describe("pathname", () => {
        test("should return the absolute pathname", () => {
            const vfile = new BaseVFile("/home/user/project/index.js");

            expect(vfile.pathname()).toBe("/home/user/project/index.js");
        });

        test("should return the relative pathname", () => {
            const vfile = new BaseVFile("/home/user/project/src/index.js", "/home/user/project");

            expect(vfile.pathname.relative()).toBe("src/index.js");
        });
    });

    describe("clone", () => {
        test("should return a new BaseVFile with the same properties", () => {
            const vfile = new BaseVFile("/home/user/project/src/index.js", "/home/user/project");
            const clone = vfile.clone();

            expect(clone).toBeInstanceOf(BaseVFile);
            expect(clone.pathname()).toBe(vfile.pathname());
            expect(clone).not.toBe(vfile);
        });
    });
});
