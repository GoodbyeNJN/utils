import path from "node:path";

import { beforeEach, describe, expect, test } from "vitest";

import { VFile } from "@/fs/vfile";

const toVFileProperties = (pathname: string, cwd: string) => {
    const { dir, name, ext } = path.parse(pathname);

    return {
        cwd,
        dirname: path.relative(cwd, dir),
        filename: name,
        extname: ext.startsWith(".") ? ext.slice(1) : ext,
        pathname,
        basename: `${name}${ext}`,
        absoluteDirname: dir,
        relativePathname: path.relative(cwd, pathname),
    };
};

const expectVFile = (actual: VFile, pathname: string, cwd: string) => {
    const expected = toVFileProperties(pathname, cwd);

    expect(actual.cwd).toBe(expected.cwd);
    expect(actual.dirname).toBe(expected.dirname);
    expect(actual.filename).toBe(expected.filename);
    expect(actual.extname).toBe(expected.extname);
    expect(actual.pathname).toBe(expected.pathname);
    expect(actual.basename).toBe(expected.basename);
    expect(actual.absoluteDirname).toBe(expected.absoluteDirname);
    expect(actual.relativePathname).toBe(expected.relativePathname);
};

const { cwd, dirname, filename, extname, pathname, basename, absoluteDirname, relativePathname } =
    toVFileProperties("/home/user/project/src/pages/index.js", "/home/user/project");

let vfile: VFile;

beforeEach(() => {
    vfile = new VFile({
        pathname: relativePathname,
        cwd,
    });
});

describe("constructor", () => {
    test("should create a VFile with relative pathname", () => {
        const vfile = new VFile({
            pathname: relativePathname,
            cwd,
        });
        expectVFile(vfile, pathname, cwd);
    });

    test("should create a VFile with absolute pathname", () => {
        const vfile = new VFile({
            pathname,
            cwd,
        });
        expectVFile(vfile, pathname, cwd);
    });

    test("should create a VFile with content", () => {
        const content = "console.log('hello')";
        const vfile = new VFile({
            pathname: relativePathname,
            cwd,
            content,
        });
        expect(vfile.content).toBe(content);
    });

    test("should set default content to empty string", () => {
        const vfile = new VFile({
            pathname: relativePathname,
            cwd,
        });
        expect(vfile.content).toBe("");
    });

    test("should create a VFile with custom cwd", () => {
        const cwd = "/custom/path";
        const vfile = new VFile({
            pathname: relativePathname,
            cwd,
        });
        expectVFile(vfile, path.join(cwd, relativePathname), cwd);
    });

    test("should set default cwd to process.cwd()", () => {
        const cwd = process.cwd();
        const vfile = new VFile({
            pathname: relativePathname,
        });
        expectVFile(vfile, path.join(cwd, relativePathname), cwd);
    });

    test("should create a VFile with dot file", () => {
        const pathname = path.join(cwd, "src/.env");
        const vfile = new VFile({
            pathname,
            cwd,
        });
        expectVFile(vfile, pathname, cwd);
    });
});

describe("content", () => {
    test("should get content", () => {
        expect(vfile.content).toBe("");
    });

    test("should set content", () => {
        const content = "some content";
        vfile.content = content;
        expect(vfile.content).toBe(content);
    });
});

describe("cwd", () => {
    test("should get cwd", () => {
        expect(vfile.cwd).toBe(cwd);
    });

    test("should set cwd", () => {
        const cwd = "/custom/path";
        vfile.cwd = cwd;
        expectVFile(vfile, path.join(cwd, relativePathname), cwd);
    });
});

describe("dirname", () => {
    test("should get dirname", () => {
        expect(vfile.dirname).toBe(dirname);
    });

    test("should set dirname", () => {
        const dirname = "lib";
        vfile.dirname = dirname;
        expectVFile(vfile, path.join(cwd, dirname, basename), cwd);
    });
});

describe("filename", () => {
    test("should get filename", () => {
        expect(vfile.filename).toBe(filename);
    });

    test("should set filename", () => {
        const filename = "app";
        vfile.filename = filename;
        expectVFile(vfile, path.join(cwd, dirname, `${filename}.${extname}`), cwd);
    });

    test("should set filename with dot file", () => {
        const filename = ".env";
        vfile.filename = filename;
        expectVFile(vfile, path.join(cwd, dirname, `${filename}.${extname}`), cwd);
    });
});

describe("extname", () => {
    test("should get extname", () => {
        expect(vfile.extname).toBe(extname);
    });

    test("should set extname", () => {
        const extname = "ts";
        vfile.extname = extname;
        expectVFile(vfile, path.join(cwd, dirname, `${filename}.${extname}`), cwd);
    });
});

describe("pathname", () => {
    test("should get pathname", () => {
        expect(vfile.pathname).toBe(pathname);
    });

    test("should set pathname", () => {
        const pathname = path.join(cwd, "docs/README.md");
        vfile.pathname = pathname;
        expectVFile(vfile, pathname, cwd);
    });

    test("should set pathname with dot file", () => {
        const pathname = path.join(cwd, "src/.env");
        vfile.pathname = pathname;
        expectVFile(vfile, pathname, cwd);
    });
});

describe("basename", () => {
    test("should get basename", () => {
        expect(vfile.basename).toBe(basename);
    });

    test("should set basename", () => {
        const basename = "main.ts";
        vfile.basename = basename;
        expectVFile(vfile, path.join(cwd, dirname, basename), cwd);
    });

    test("should set basename without extension", () => {
        const basename = "Makefile";
        vfile.basename = basename;
        expectVFile(vfile, path.join(cwd, dirname, basename), cwd);
    });

    test("should set basename with dot file", () => {
        const basename = ".env";
        vfile.basename = basename;
        expectVFile(vfile, path.join(cwd, dirname, basename), cwd);
    });
});

describe("absoluteDirname", () => {
    test("should get absoluteDirname", () => {
        expect(vfile.absoluteDirname).toBe(absoluteDirname);
    });

    test("should set absoluteDirname", () => {
        const absoluteDirname = path.join(cwd, "lib");
        vfile.absoluteDirname = absoluteDirname;
        expectVFile(vfile, path.join(absoluteDirname, basename), cwd);
    });
});

describe("relativePathname", () => {
    test("should get relativePathname", () => {
        expect(vfile.relativePathname).toBe(relativePathname);
    });

    test("should set relativePathname", () => {
        const relativePathname = "lib/module.ts";
        vfile.relativePathname = relativePathname;
        expectVFile(vfile, path.join(cwd, relativePathname), cwd);
    });

    test("should set relativePathname with dot file", () => {
        const relativePathname = "src/.env";
        vfile.relativePathname = relativePathname;
        expectVFile(vfile, path.join(cwd, relativePathname), cwd);
    });
});

describe("clone", () => {
    test("should create a copy of VFile", () => {
        const cloned = vfile.clone();
        expect(cloned).not.toBe(vfile);
        expect(cloned.cwd).toBe(vfile.cwd);
        expect(cloned.dirname).toBe(vfile.dirname);
        expect(cloned.filename).toBe(vfile.filename);
        expect(cloned.extname).toBe(vfile.extname);
        expect(cloned.pathname).toBe(vfile.pathname);
        expect(cloned.basename).toBe(vfile.basename);
        expect(cloned.absoluteDirname).toBe(vfile.absoluteDirname);
        expect(cloned.relativePathname).toBe(vfile.relativePathname);
    });

    test("should clone with content", () => {
        vfile.content = "some content";
        const cloned = vfile.clone();
        expect(cloned.content).toBe("some content");
    });

    test("should clone independently", () => {
        vfile.content = "original";
        const cloned = vfile.clone();

        cloned.content = "modified";
        expect(vfile.content).toBe("original");
        expect(cloned.content).toBe("modified");
    });
});
