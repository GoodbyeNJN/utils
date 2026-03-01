import path from "node:path";

import { beforeEach, describe, expect, test } from "vitest";

import { VFile } from "@/fs/vfile";

const cwd = "/home/user/project";
const dirname = "src";
const filename = "index";
const extname = "js";
const pathname = path.join(cwd, dirname, `${filename}.${extname}`);
const basename = `${filename}.${extname}`;
const absoluteDirname = path.join(cwd, dirname);
const relativePathname = path.join(dirname, `${filename}.${extname}`);

let vfile: VFile;

beforeEach(() => {
    vfile = new VFile({
        pathname: relativePathname,
        cwd,
    });
});

describe("constructor", () => {
    test("should create a VFile with relative pathname", () => {
        const file = new VFile({
            pathname: relativePathname,
            cwd,
        });
        expect(file.pathname).toBe(pathname);
    });

    test("should create a VFile with absolute pathname", () => {
        const file = new VFile({
            pathname,
            cwd,
        });
        expect(file.pathname).toBe(pathname);
    });

    test("should create a VFile with content", () => {
        const content = "console.log('hello')";
        const file = new VFile({
            pathname: relativePathname,
            cwd,
            content,
        });
        expect(file.content).toBe(content);
    });

    test("should set default content to empty string", () => {
        const file = new VFile({
            pathname: relativePathname,
            cwd,
        });
        expect(file.content).toBe("");
    });

    test("should create a VFile with custom cwd", () => {
        const cwd = "/custom/path";
        const file = new VFile({
            pathname: relativePathname,
            cwd,
        });
        expect(file.cwd).toBe(cwd);
    });

    test("should set default cwd to process.cwd()", () => {
        const file = new VFile({
            pathname: relativePathname,
        });
        expect(file.cwd).toBe(process.cwd());
    });

    test("should create a VFile with dot file", () => {
        const file = new VFile({
            pathname: path.join(cwd, "src/.env"),
            cwd,
        });
        expect(file.filename).toBe(".env");
        expect(file.extname).toBe("");
    });
});

describe("dirname", () => {
    test("should get dirname", () => {
        expect(vfile.dirname).toBe(dirname);
    });

    test("should set dirname", () => {
        vfile.dirname = "lib";
        expect(vfile.dirname).toBe("lib");
        expect(vfile.filename).toBe("index");
        expect(vfile.extname).toBe("js");
        expect(vfile.pathname).toBe(path.join(cwd, "lib/index.js"));
        expect(vfile.basename).toBe("index.js");
        expect(vfile.absoluteDirname).toBe(path.join(cwd, "lib"));
        expect(vfile.relativePathname).toBe("lib/index.js");
    });
});

describe("filename", () => {
    test("should get filename", () => {
        expect(vfile.filename).toBe(filename);
    });

    test("should set filename", () => {
        vfile.filename = "app";
        expect(vfile.dirname).toBe("src");
        expect(vfile.filename).toBe("app");
        expect(vfile.extname).toBe("js");
        expect(vfile.pathname).toBe(path.join(cwd, "src/app.js"));
        expect(vfile.basename).toBe("app.js");
        expect(vfile.absoluteDirname).toBe(path.join(cwd, "src"));
        expect(vfile.relativePathname).toBe("src/app.js");
    });

    test("should set filename with dot file", () => {
        vfile.filename = ".env";
        expect(vfile.dirname).toBe("src");
        expect(vfile.filename).toBe(".env");
        expect(vfile.extname).toBe("js");
        expect(vfile.pathname).toBe(path.join(cwd, "src/.env.js"));
        expect(vfile.basename).toBe(".env.js");
        expect(vfile.absoluteDirname).toBe(path.join(cwd, "src"));
        expect(vfile.relativePathname).toBe("src/.env.js");
    });
});

describe("extname", () => {
    test("should get extname", () => {
        expect(vfile.extname).toBe(extname);
    });

    test("should set extname", () => {
        vfile.extname = "ts";
        expect(vfile.dirname).toBe("src");
        expect(vfile.filename).toBe("index");
        expect(vfile.extname).toBe("ts");
        expect(vfile.pathname).toBe(path.join(cwd, "src/index.ts"));
        expect(vfile.basename).toBe("index.ts");
        expect(vfile.absoluteDirname).toBe(path.join(cwd, "src"));
        expect(vfile.relativePathname).toBe("src/index.ts");
    });
});

describe("pathname", () => {
    test("should get pathname", () => {
        expect(vfile.pathname).toBe(pathname);
    });

    test("should set pathname", () => {
        const pathname = path.join(cwd, "docs/README.md");
        vfile.pathname = pathname;
        expect(vfile.dirname).toBe("docs");
        expect(vfile.filename).toBe("README");
        expect(vfile.extname).toBe("md");
        expect(vfile.pathname).toBe(pathname);
        expect(vfile.basename).toBe("README.md");
        expect(vfile.absoluteDirname).toBe(path.join(cwd, "docs"));
        expect(vfile.relativePathname).toBe("docs/README.md");
    });

    test("should set pathname with dot file", () => {
        const pathname = path.join(cwd, "src/.env");
        vfile.pathname = pathname;
        expect(vfile.dirname).toBe("src");
        expect(vfile.filename).toBe(".env");
        expect(vfile.extname).toBe("");
        expect(vfile.pathname).toBe(pathname);
        expect(vfile.basename).toBe(".env");
        expect(vfile.absoluteDirname).toBe(path.join(cwd, "src"));
        expect(vfile.relativePathname).toBe("src/.env");
    });
});

describe("basename", () => {
    test("should get basename", () => {
        expect(vfile.basename).toBe(basename);
    });

    test("should set basename", () => {
        vfile.basename = "main.ts";
        expect(vfile.dirname).toBe("src");
        expect(vfile.filename).toBe("main");
        expect(vfile.extname).toBe("ts");
        expect(vfile.pathname).toBe(path.join(cwd, "src/main.ts"));
        expect(vfile.basename).toBe("main.ts");
        expect(vfile.absoluteDirname).toBe(path.join(cwd, "src"));
        expect(vfile.relativePathname).toBe("src/main.ts");
    });

    test("should set basename without extension", () => {
        vfile.basename = "Makefile";
        expect(vfile.dirname).toBe("src");
        expect(vfile.filename).toBe("Makefile");
        expect(vfile.extname).toBe("");
        expect(vfile.pathname).toBe(path.join(cwd, "src/Makefile"));
        expect(vfile.basename).toBe("Makefile");
        expect(vfile.absoluteDirname).toBe(path.join(cwd, "src"));
        expect(vfile.relativePathname).toBe("src/Makefile");
    });

    test("should set basename with dot file", () => {
        vfile.basename = ".env";
        expect(vfile.dirname).toBe("src");
        expect(vfile.filename).toBe(".env");
        expect(vfile.extname).toBe("");
        expect(vfile.pathname).toBe(path.join(cwd, "src/.env"));
        expect(vfile.basename).toBe(".env");
        expect(vfile.absoluteDirname).toBe(path.join(cwd, "src"));
        expect(vfile.relativePathname).toBe("src/.env");
    });
});

describe("absoluteDirname", () => {
    test("should get absoluteDirname", () => {
        expect(vfile.absoluteDirname).toBe(absoluteDirname);
    });

    test("should set absoluteDirname", () => {
        vfile.absoluteDirname = path.join(cwd, "lib");
        expect(vfile.dirname).toBe("lib");
        expect(vfile.filename).toBe("index");
        expect(vfile.extname).toBe("js");
        expect(vfile.pathname).toBe(path.join(cwd, "lib/index.js"));
        expect(vfile.basename).toBe("index.js");
        expect(vfile.absoluteDirname).toBe(path.join(cwd, "lib"));
        expect(vfile.relativePathname).toBe("lib/index.js");
    });
});

describe("relativePathname", () => {
    test("should get relativePathname", () => {
        expect(vfile.relativePathname).toBe(relativePathname);
    });

    test("should set relativePathname", () => {
        vfile.relativePathname = "lib/module.ts";
        expect(vfile.dirname).toBe("lib");
        expect(vfile.filename).toBe("module");
        expect(vfile.extname).toBe("ts");
        expect(vfile.pathname).toBe(path.join(cwd, "lib/module.ts"));
        expect(vfile.basename).toBe("module.ts");
        expect(vfile.absoluteDirname).toBe(path.join(cwd, "lib"));
        expect(vfile.relativePathname).toBe("lib/module.ts");
    });

    test("should set relativePathname with dot file", () => {
        vfile.relativePathname = "src/.env";
        expect(vfile.dirname).toBe("src");
        expect(vfile.filename).toBe(".env");
        expect(vfile.extname).toBe("");
        expect(vfile.pathname).toBe(path.join(cwd, "src/.env"));
        expect(vfile.basename).toBe(".env");
        expect(vfile.absoluteDirname).toBe(path.join(cwd, "src"));
        expect(vfile.relativePathname).toBe("src/.env");
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
