import path from "node:path";

import { removePrefix } from "@/common";

import { readFile } from "./safe";

export interface VFileOptions {
    pathname: string;
    content?: string | undefined;
    cwd?: string | undefined;
}

export class VFile {
    static async fromFilepath(pathname: string, cwd?: string) {
        const vfile = new VFile({
            pathname,
            cwd,
        });

        const content = await readFile(pathname);

        return content.map(content => {
            vfile.content = content;
            return vfile;
        });
    }

    content = "";

    /**
     * @example
     * `/home/user/project`
     */
    cwd = process.cwd();
    /**
     * @example
     * `src`
     */
    dirname = "";
    /**
     * @example
     * `index`
     */
    filename = "";
    /**
     * @example
     * `js`
     */
    extname = "";

    constructor(options: VFileOptions) {
        const { pathname, content, cwd } = options;

        this.pathname = pathname;

        if (content) {
            this.content = content;
        }
        if (cwd) {
            this.cwd = cwd;
        }
    }

    /**
     * @example
     * `/home/user/project/src/index.js`
     */
    get pathname() {
        return path.resolve(this.cwd, this.dirname, this.basename);
    }

    set pathname(value) {
        this.parse(value);
    }

    /**
     * @example
     * `index.js`
     */
    get basename() {
        return this.filename + "." + this.extname;
    }

    set basename(value) {
        const { name, ext } = path.parse(value);
        this.filename = name;
        this.extname = removePrefix(ext, ".");
    }

    /**
     * @example
     * `/home/user/project/src`
     */
    get absoluteDirname() {
        return path.resolve(this.cwd, this.dirname);
    }

    set absoluteDirname(value) {
        this.dirname = path.relative(this.cwd, value);
    }

    /**
     * @example
     * `src/index.js`
     */
    get relativePathname() {
        return path.relative(this.cwd, this.pathname);
    }

    set relativePathname(value) {
        this.parse(path.resolve(this.cwd, value));
    }

    clone() {
        const vfile = new VFile({
            pathname: this.pathname,
            content: this.content,
            cwd: this.cwd,
        });

        return vfile;
    }

    private parse(value: string) {
        this.dirname = path.relative(this.cwd, path.dirname(value));
        this.extname = path.extname(value);
        this.filename = path.basename(value, this.extname);
    }
}
