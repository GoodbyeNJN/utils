import { isNil, nil } from "@/common";
import { parse, stringify } from "@/json/unsafe";

import { ExtendVFile } from "../vfile";

import { cp, cpSync } from "./cp";
import { exists, existsSync } from "./exists";
import { readFile, readFileByLine, readFileSync } from "./read";
import { rm, rmSync } from "./rm";
import { writeFile, writeFileSync } from "./write";

import type { CpOptions, PathLike, RmOptions } from "../types";
import type { Nil } from "@/common";

export class VFile<T = string> extends ExtendVFile<T> {
    declare protected _transformer?: {
        parse: (raw: string) => T | Nil;
        stringify: (value: T) => string | Nil;
    };
    declare protected _raw: string | Nil;
    declare protected _value: T | Nil;

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
    raw(): string | Nil;
    /**
     * @example
     * ```js
     * vfile.raw('["hello", "world"]');
     * ```
     */
    raw(raw: string): this;
    raw(raw?: string): any {
        if (raw !== undefined) {
            this._raw = raw;
            this._value = nil;

            return this;
        }

        if (!isNil(this._raw)) return this._raw;
        if (isNil(this._value)) return nil;

        this._raw = this.stringifyValue(this._value);

        return this._raw;
    }

    /**
     * @example
     * ```js
     * vfile.value(); // ["hello", "world"]
     * ```
     */
    value(): T | Nil;
    /**
     * @example
     * ```js
     * vfile.value(["hello", "world"]);
     * ```
     */
    value(value: T): this;
    value(value?: T): any {
        if (value !== undefined) {
            this._value = value;
            this._raw = nil;

            return this;
        }

        if (!isNil(this._value)) return this._value;
        if (isNil(this._raw)) return nil;

        this._value = this.parseRaw(this._raw);

        return this._value;
    }

    /**
     * @example
     * ```js
     * vfile.lines(); // ['["hello", "world"]']
     * ```
     */
    lines(): string[] {
        const raw = this.raw();
        if (isNil(raw)) return [];

        return raw.split(this._linebreak);
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
        if (isNil(append)) throw new TypeError(`Value cannot be stringified: ${String(value)}`);

        if (isNil(this._raw) || isNil(this._value)) {
            this.raw(append);
        } else {
            this.raw(this._raw + linebreak + append);
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

    async read(): Promise<T | Nil> {
        const raw = await readFile(this.pathname(), this.encodingOptions);
        if (isNil(raw)) return nil;

        this.raw(raw);

        return this.value();
    }

    readSync(): T | Nil {
        const raw = readFileSync(this.pathname(), this.encodingOptions);
        if (isNil(raw)) return nil;

        this.raw(raw);

        return this.value();
    }

    readByLine(): ReturnType<typeof readFileByLine> {
        return readFileByLine(this.pathname(), this.encodingOptions);
    }

    async write(): ReturnType<typeof writeFile> {
        const raw = this.raw();
        if (isNil(raw)) throw new TypeError("VFile has no content to write");

        return writeFile(this.pathname(), raw, this.encodingOptions);
    }

    writeSync(): ReturnType<typeof writeFileSync> {
        const raw = this.raw();
        if (isNil(raw)) throw new TypeError("VFile has no content to write");

        return writeFileSync(this.pathname(), raw, this.encodingOptions);
    }

    private get encodingOptions() {
        return { encoding: this._encoding };
    }

    protected parseRaw(raw: string): T | any {
        if (!this._transformer?.parse) return raw as T;

        return this._transformer.parse(raw);
    }

    protected stringifyValue(value: T): string | any {
        if (!this._transformer?.stringify) return value as string;

        return this._transformer.stringify(value);
    }
}
