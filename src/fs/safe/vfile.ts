import { nil as _nil, isNil } from "@/common";
import { parse, stringify } from "@/json/safe";
import { err, ok, Result } from "@/result";

import { ExtendVFile } from "../vfile";

import { cp, cpSync } from "./cp";
import { exists, existsSync } from "./exists";
import { readFile, readFileByLine, readFileSync } from "./read";
import { rm, rmSync } from "./rm";
import { writeFile, writeFileSync } from "./write";

import type { CpOptions, PathLike, RmOptions } from "../types";
import type { InferErrType } from "@/result";

const nil = _nil as any;

export class VFile<T = string, PE = Error, SE = Error> extends ExtendVFile<T> {
    declare protected _transformer?: {
        parse: (raw: string) => Result<T, PE>;
        stringify: (value: T) => Result<string, SE>;
    };
    declare protected _raw: string;
    declare protected _value: T;

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
                parse: parse,
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
            this._raw = raw;
            this._value = nil;

            return this;
        }

        if (!isNil(this._raw)) return ok(this._raw);
        if (isNil(this._value)) {
            return err(new Error("No content")).context("Failed to get raw content");
        }

        return this.stringifyValue(this._value).inspect(raw => {
            this._raw = raw;
        });
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
            this._value = value;
            this._raw = nil;

            return this;
        }

        if (this._value !== nil) return ok(this._value);
        if (this._raw === nil) {
            return err(new Error("No content")).context("Failed to get value");
        }

        return this.parseRaw(this._raw).inspect(value => {
            this._value = value;
        });
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
        return Result.gen(function* () {
            const linebreak = newline ? this._linebreak : "";
            const append = yield* this.stringifyValue(value);

            if (isNil(this._raw) || isNil(this._value)) {
                this.raw(append);
            } else {
                this.raw(this._raw + linebreak + append);
            }
        }, this);
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

    readByLine(): ReturnType<typeof readFileByLine> {
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
        if (!this._transformer?.parse) return ok(raw as T);

        return this._transformer.parse(raw).context("Failed to parse raw content");
    }

    protected stringifyValue(value: T): Result<string, SE> {
        if (!this._transformer?.stringify) return ok(value as string);

        return this._transformer.stringify(value).context("Failed to stringify value");
    }
}
