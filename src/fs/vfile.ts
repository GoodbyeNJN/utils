/* eslint-disable @typescript-eslint/method-signature-style */

import path from "node:path";
import url from "node:url";

import { nil as _nil, removePrefix } from "@/common";
import { isString } from "@/remeda";

import type { PathLike, StringEncodingOptions } from "./types";

const nil = _nil as any;

interface PathnameGetter<T> {
    /**
     * @example
     * ```js
     * vfile.pathname(); // "/home/user/project/src/page/index.js"
     * ```
     */
    (): string;
    /**
     * @example
     * ```js
     * vfile.pathname("/home/user/project/src/page/index.js");
     * ```
     */
    (pathname: string): T;
    /**
     * @example
     * ```js
     * vfile.pathname.relative(); // "src/page/index.js"
     * ```
     */
    relative(): string;
    /**
     * @example
     * ```js
     * vfile.pathname.relative("src/page/index.js");
     * ```
     */
    relative(pathname: string): T;
}

interface DirnameGetter<T> {
    /**
     * @example
     * ```js
     * vfile.dirname(); // "src/page"
     * ```
     */
    (): string;
    /**
     * @example
     * ```js
     * vfile.dirname("src/page");
     * ```
     */
    (dirname: string): T;
    /**
     * @example
     * ```js
     * vfile.dirname.absolute(); // "/home/user/project/src/page"
     * ```
     */
    absolute(): string;
    /**
     * @example
     * ```js
     * vfile.dirname.absolute("/home/user/project/src/page");
     * ```
     */
    absolute(dirname: string): T;
}

export class BaseVFile {
    protected _cwd = process.cwd();
    protected _dirname = "";
    protected _filename = "";
    protected _extname = "";

    /**
     * @example
     * ```js
     * const vfile = new VFile(
     *   "/home/user/project/src/page/index.js",
     *   "/home/user/project",
     * );
     * ```
     */
    constructor(filepath: PathLike, cwd?: string) {
        if (cwd) {
            this.cwd(cwd);
        }

        const pathname = isString(filepath) ? filepath : url.fileURLToPath(filepath);
        if (path.isAbsolute(pathname)) {
            this.pathname(pathname);
        } else {
            this.pathname.relative(pathname);
        }
    }

    /**
     * @example
     * ```js
     * vfile.cwd(); // "/home/user/project"
     * ```
     */
    cwd(): string;
    /**
     * @example
     * ```js
     * vfile.cwd("/home/user/project");
     * ```
     */
    cwd(cwd: string): this;
    cwd(cwd?: string) {
        if (cwd === undefined) return this._cwd;

        this._cwd = cwd;

        return this;
    }

    get pathname(): PathnameGetter<this> {
        const obj: any = this.absolutePathname.bind(this);
        obj.relative = this.relativePathname.bind(this);

        return obj;
    }

    get dirname(): DirnameGetter<this> {
        const obj: any = this.relativeDirname.bind(this);
        obj.absolute = this.absoluteDirname.bind(this);

        return obj;
    }

    /**
     * @example
     * ```js
     * vfile.filename(); // "index"
     * ```
     */
    filename(): string;
    /**
     * @example
     * ```js
     * vfile.filename("index");
     * ```
     */
    filename(filename: string): this;
    filename(filename?: string) {
        if (filename === undefined) return this._filename;

        this._filename = filename;

        return this;
    }

    /**
     * @example
     * ```js
     * vfile.extname(); // "js"
     * ```
     */
    extname(): string;
    /**
     * @example
     * ```js
     * vfile.extname("js");
     * ```
     */
    extname(extname: string): this;
    extname(extname?: string) {
        if (extname === undefined) return this._extname;

        this._extname = extname;

        return this;
    }

    /**
     * @example
     * ```js
     * vfile.basename(); // "index.js"
     * ```
     */
    basename(): string;
    /**
     * @example
     * ```js
     * vfile.basename("index.js");
     * ```
     */
    basename(basename: string): this;
    basename(basename?: string) {
        if (basename === undefined) {
            if (!this._extname) return this._filename;

            return this._filename + "." + this._extname;
        }

        const { name, ext } = path.parse(basename);

        this._filename = name;
        this._extname = removePrefix(".", ext);

        return this;
    }

    clone(): BaseVFile {
        const vfile = new BaseVFile("");
        vfile._cwd = this._cwd;
        vfile._dirname = this._dirname;
        vfile._filename = this._filename;
        vfile._extname = this._extname;

        return vfile;
    }

    protected absolutePathname(pathname?: string) {
        if (pathname === undefined) {
            const basename = this._filename + (this._extname ? "." : "") + this._extname;

            return path.resolve(this._cwd, this._dirname, basename);
        }

        const { dir, name, ext } = path.parse(pathname);
        this._dirname = path.relative(this._cwd, dir);
        this._filename = name;
        this._extname = removePrefix(".", ext);

        return this;
    }

    protected relativePathname(pathname?: string) {
        if (pathname === undefined) {
            const basename = this._filename + (this._extname ? "." : "") + this._extname;

            return path.join(this._dirname, basename);
        }

        const { dir, name, ext } = path.parse(pathname);
        this._dirname = dir;
        this._filename = name;
        this._extname = removePrefix(".", ext);

        return this;
    }

    protected relativeDirname(dirname?: string) {
        if (dirname === undefined) return this._dirname;

        this._dirname = dirname;

        return this;
    }

    protected absoluteDirname(dirname?: string) {
        if (dirname === undefined) {
            return path.resolve(this._cwd, this._dirname);
        }

        this._dirname = path.relative(this._cwd, dirname);

        return this;
    }
}

export class ExtendVFile<T> extends BaseVFile {
    protected _encoding: BufferEncoding = "utf-8";
    protected _linebreak = "\n";
    protected _transformer?: {
        parse: (raw: string) => any;
        stringify: (value: T) => any;
    };
    protected _raw: string | any = nil;
    protected _value: T | any = nil;

    /**
     * @example
     * ```js
     * vfile.encoding(); // "utf-8"
     * ```
     */
    encoding(): typeof this._encoding;
    /**
     * @example
     * ```js
     * vfile.encoding("utf-8");
     * ```
     */
    encoding(encoding: StringEncodingOptions["encoding"]): this;
    encoding(encoding?: typeof this._encoding): any {
        if (encoding === undefined) return this._encoding;

        this._encoding = encoding;

        return this;
    }

    /**
     * @example
     * ```js
     * vfile.linebreak(); // "\n"
     * ```
     */
    linebreak(): typeof this._linebreak;
    /**
     * @example
     * ```js
     * vfile.linebreak("\r\n");
     * ```
     */
    linebreak(linebreak: string): this;
    linebreak(linebreak?: string): any {
        if (linebreak === undefined) return this._linebreak;

        this._linebreak = linebreak;

        return this;
    }

    override clone(): ExtendVFile<T> {
        const vfile = new ExtendVFile<T>("");
        vfile._cwd = this._cwd;
        vfile._dirname = this._dirname;
        vfile._filename = this._filename;
        vfile._extname = this._extname;
        vfile._encoding = this._encoding;
        vfile._linebreak = this._linebreak;
        vfile._transformer = this._transformer;
        vfile._raw = this._raw;
        vfile._value = this._value;

        return vfile;
    }
}
