import { parse, stringify } from "@/json/safe";
import { Err, Ok } from "@/result";

import { ExtendVFile } from "../shared/vfile";

import { cp, cpSync } from "./cp";
import { exists, existsSync } from "./exists";
import { readFile, readFileByLine, readFileSync } from "./read";
import { rm, rmSync } from "./rm";
import { writeFile, writeFileSync } from "./write";

import type { CpOptions, PathLike, RmOptions } from "../shared/types";
import type { InferErrType, Result } from "@/result";

const ERR = Err() as any;

export class VFile<T = string, PE = Error, SE = Error> extends ExtendVFile<T> {
    declare protected _transformer?: {
        parse: (raw: string) => Result<T, PE>;
        stringify: (value: T) => Result<string, SE>;
    };
    declare protected _raw: Result<string, SE>;
    declare protected _value: Result<T, PE>;

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

        this._raw = ERR;
        this._value = ERR;
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
    transformer(
        transformer: "json",
        indent?: number,
    ): VFile<T, InferErrType<ReturnType<typeof parse>>, InferErrType<ReturnType<typeof stringify>>>;
    transformer(transformer?: typeof this._transformer | "json", indent = 2): any {
        if (transformer === undefined) return this._transformer;

        if (transformer === "json") {
            (
                this as VFile<
                    T,
                    InferErrType<ReturnType<typeof parse>>,
                    InferErrType<ReturnType<typeof stringify>>
                >
            )._transformer = {
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
    raw(): Result<string, SE>;
    /**
     * @example
     * ```js
     * vfile.raw('["hello", "world"]');
     * ```
     */
    raw(raw: string): this;
    raw(raw?: string): any {
        if (raw !== undefined) {
            this._raw = Ok(raw);
            this._value = ERR;

            return this;
        }

        if (this._raw.isOk()) return this._raw;
        if (this._value.isErr()) {
            const err = this._value === ERR ? Err(new Error("No content")) : this._value;

            return err.context("Failed to get raw content");
        }

        this._raw = this.stringifyValue(this._value.unwrap());

        return this._raw;
    }

    /**
     * @example
     * ```js
     * vfile.value(); // ["hello", "world"]
     * ```
     */
    value(): Result<T, PE>;
    /**
     * @example
     * ```js
     * vfile.value(["hello", "world"]);
     * ```
     */
    value(value: T): this;
    value(value?: T): any {
        if (value !== undefined) {
            this._value = Ok(value);
            this._raw = ERR;

            return this;
        }

        if (this._value.isOk()) return this._value;
        if (this._raw.isErr()) {
            const err = this._raw === ERR ? Err(new Error("No content")) : this._raw;

            return err.context("Failed to get value");
        }

        this._value = this.parseRaw(this._raw.unwrap());

        return this._value;
    }

    /**
     * @example
     * ```js
     * vfile.lines(); // ['["hello", "world"]']
     * ```
     */
    lines(): Result<string[], SE> {
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
    append(value: T, newline = true): Result<void, SE> {
        const linebreak = newline ? this._linebreak : "";
        const append = this.stringifyValue(value);
        if (append.isErr()) return append;

        if (this._raw.isErr() || this._value.isErr()) {
            this.raw(append.unwrap());
        } else {
            this.raw(this._raw.unwrap() + linebreak + append.unwrap());
        }

        return Ok();
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

    async read(): Promise<Result<T, PE | InferErrType<Awaited<ReturnType<typeof readFile>>>>> {
        return (await readFile(this.pathname(), this.encodingOptions)).andThen(raw => {
            this.raw(raw);

            return this.value();
        });
    }

    readSync(): Result<T, PE | InferErrType<ReturnType<typeof readFileSync>>> {
        return readFileSync(this.pathname(), this.encodingOptions).andThen(raw => {
            this.raw(raw);

            return this.value();
        });
    }

    async readByLine(): ReturnType<typeof readFileByLine> {
        return readFileByLine(this.pathname(), this.encodingOptions);
    }

    async write(): Promise<Result<void, SE | InferErrType<Awaited<ReturnType<typeof writeFile>>>>> {
        const result = this.raw();
        if (result.isErr()) return result;

        return writeFile(this.pathname(), result.unwrap(), this.encodingOptions);
    }

    writeSync(): Result<void, SE | InferErrType<ReturnType<typeof writeFileSync>>> {
        const result = this.raw();
        if (result.isErr()) return result;

        return writeFileSync(this.pathname(), result.unwrap(), this.encodingOptions);
    }

    private get encodingOptions() {
        return { encoding: this._encoding };
    }

    protected parseRaw(raw: string): Result<T, PE> {
        if (!this._transformer?.parse) return Ok(raw as T);

        return this._transformer.parse(raw).context("Failed to parse raw content");
    }

    protected stringifyValue(value: T): Result<string, SE> {
        if (!this._transformer?.stringify) return Ok(value as string);

        return this._transformer.stringify(value).context("Failed to stringify value");
    }
}
