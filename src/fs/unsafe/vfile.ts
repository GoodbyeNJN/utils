import { parse, stringify } from "@/json/unsafe";
import { None, Some } from "@/option";

import { ExtendVFile } from "../shared/vfile";

import { cp, cpSync } from "./cp";
import { exists, existsSync } from "./exists";
import { readFile, readFileByLine, readFileSync } from "./read";
import { rm, rmSync } from "./rm";
import { writeFile, writeFileSync } from "./write";

import type { CpOptions, PathLike, RmOptions } from "../shared/types";
import type { Option } from "@/option";

export class VFile<T = string> extends ExtendVFile<T> {
    declare protected _transformer?: {
        parse: (raw: string) => Option<T>;
        stringify: (value: T) => Option<string>;
    };
    declare protected _raw: Option<string>;
    declare protected _value: Option<T>;

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
        super(filepath, cwd);

        this._raw = None();
        this._value = None();
    }

    /**
     * @example
     * ```js
     * vfile.transformer(); // { parse: [Function], stringify: [Function] }
     * ```
     */
    transformer(): typeof this._transformer;
    /**
     * @example
     * ```js
     * vfile.transformer({ parse: [Function], stringify: [Function] });
     * ```
     */
    transformer(transformer: typeof this._transformer): this;
    /**
     * @example
     * ```js
     * vfile.transformer("json");
     * ```
     */
    transformer(transformer: "json", indent?: number): this;
    transformer(transformer?: typeof this._transformer | "json", indent = 2): any {
        if (transformer === undefined) return this._transformer;

        if (transformer === "json") {
            this._transformer = {
                parse,
                stringify: value => stringify(value, null, indent),
            };
        } else {
            this._transformer = transformer;
        }

        return this;
    }

    /**
     * @example
     * ```js
     * vfile.raw(); // '["hello", "world"]'
     * ```
     */
    raw(): Option<string>;
    /**
     * @example
     * ```js
     * vfile.raw('["hello", "world"]');
     * ```
     */
    raw(raw: string): this;
    raw(raw?: string): any {
        if (raw !== undefined) {
            this._raw = Some(raw);
            this._value = None();

            return this;
        }

        if (this._raw.isSome()) return this._raw;
        if (this._value.isNone()) return this._value;

        this._raw = this.stringifyValue(this._value.unwrap());

        return this._raw;
    }

    /**
     * @example
     * ```js
     * vfile.value(); // ["hello", "world"]
     * ```
     */
    value(): Option<T>;
    /**
     * @example
     * ```js
     * vfile.value(["hello", "world"]);
     * ```
     */
    value(value: T): this;
    value(value?: T): any {
        if (value !== undefined) {
            this._value = Some(value);
            this._raw = None();

            return this;
        }

        if (this._value.isSome()) return this._value;
        if (this._raw.isNone()) return this._raw;

        this._value = this.parseRaw(this._raw.unwrap());

        return this._value;
    }

    /**
     * @example
     * ```js
     * vfile.lines(); // ['["hello", "world"]']
     * ```
     */
    lines(): Option<string[]> {
        return this.raw().map(raw => raw.split(this._linebreak));
    }

    /**
     * @example
     * ```js
     * vfile.append({ hello: "world" });
     * ```
     * @example
     * ```js
     * vfile.append({ hello: "world" }, false);
     * ```
     */
    append(value: T, newline = true): void {
        const linebreak = newline ? this._linebreak : "";
        const append = this.stringifyValue(value);
        if (append.isNone()) throw new TypeError(`Value cannot be stringified: ${String(value)}`);

        if (this._raw.isNone() || this._value.isNone()) {
            this.raw(append.unwrap());
        } else {
            this.raw(this._raw.unwrap() + linebreak + append.unwrap());
        }
    }

    async exists(): ReturnType<typeof exists> {
        return exists(this.pathname());
    }

    existsSync(): ReturnType<typeof existsSync> {
        return existsSync(this.pathname());
    }

    async cp(destination: PathLike, options?: CpOptions): ReturnType<typeof cp> {
        return cp(this.pathname(), destination, options);
    }

    cpSync(destination: PathLike, options?: CpOptions): ReturnType<typeof cpSync> {
        return cpSync(this.pathname(), destination, options);
    }

    async rm(options?: RmOptions): ReturnType<typeof rm> {
        return rm(this.pathname(), options);
    }

    rmSync(options?: RmOptions): ReturnType<typeof rmSync> {
        return rmSync(this.pathname(), options);
    }

    async read(): Promise<Option<T>> {
        return (await readFile(this.pathname(), this.encodingOptions)).andThen(raw => {
            this.raw(raw);

            return this.value();
        });
    }

    readSync(): Option<T> {
        return readFileSync(this.pathname(), this.encodingOptions).andThen(raw => {
            this.raw(raw);

            return this.value();
        });
    }

    async readByLine(): ReturnType<typeof readFileByLine> {
        return readFileByLine(this.pathname(), this.encodingOptions);
    }

    async write(): ReturnType<typeof writeFile> {
        const raw = this.raw();
        if (raw.isNone()) throw new TypeError("VFile has no content to write");

        return writeFile(this.pathname(), raw.unwrap(), this.encodingOptions);
    }

    writeSync(): ReturnType<typeof writeFileSync> {
        const raw = this.raw();
        if (raw.isNone()) throw new TypeError("VFile has no content to write");

        return writeFileSync(this.pathname(), raw.unwrap(), this.encodingOptions);
    }

    private get encodingOptions() {
        return { encoding: this._encoding };
    }

    protected parseRaw(raw: string) {
        if (!this._transformer?.parse) return Some(raw as T);

        return this._transformer.parse(raw);
    }

    protected stringifyValue(value: T) {
        if (!this._transformer?.stringify) return Some(value as string);

        return this._transformer.stringify(value);
    }
}
