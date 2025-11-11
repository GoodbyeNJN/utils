import { Result } from "./chunks/chunk-471ae0aa.js";
import { AsyncFn, Fn } from "./chunks/chunk-ea0120e4.js";

//#region src/common/error.d.ts
declare const normalizeError: (error: unknown) => Error;
declare const getErrorMessage: (error: unknown, message?: string) => string;
declare const errorToMessage: (message?: string) => (error: unknown) => string;
//#endregion
//#region node_modules/.pnpm/safe-stable-stringify@2.5.0/node_modules/safe-stable-stringify/index.d.ts
type Replacer = (number | string)[] | null | undefined | ((key: string, value: unknown) => string | number | boolean | null | object);
declare function stringify$1(value: undefined | symbol | ((...args: unknown[]) => unknown), replacer?: Replacer, space?: string | number): undefined;
declare function stringify$1(value: string | number | unknown[] | null | boolean | object, replacer?: Replacer, space?: string | number): string;
declare function stringify$1(value: unknown, replacer?: ((key: string, value: unknown) => unknown) | (number | string)[] | null | undefined, space?: string | number): string | undefined;
interface StringifyOptions {
  bigint?: boolean;
  circularValue?: string | null | TypeErrorConstructor | ErrorConstructor;
  deterministic?: boolean | ((a: string, b: string) => number);
  maximumBreadth?: number;
  maximumDepth?: number;
  strict?: boolean;
}
declare namespace stringify$1 {
  export function configure(options: StringifyOptions): typeof stringify$1;
}
//#endregion
//#region src/common/json.d.ts
declare const stringify: typeof stringify$1;
declare const safeParse: <T = any>(text: string, reviver?: (this: any, key: string, value: any) => any) => Result<T, Error>;
declare const unsafeParse: <T = any>(text: string, reviver?: (this: any, key: string, value: any) => any) => T | undefined;
//#endregion
//#region src/common/math.d.ts
/**
 * @example
 * ```
 * const value = linear(0.5, [0, 2]) // value: 1
 * ```
 */
declare const linear: (value: number, range: [min: number, max: number]) => number;
/**
 * @example
 * ```
 * const value = scale(0.5, [0, 1], [200, 400]) // value: 300
 * ```
 */
declare const scale: (value: number, inRange: [min: number, max: number], outRange: [min: number, max: number]) => number;
//#endregion
//#region src/common/parse.d.ts
declare const parseKeyValuePairs: (input: string) => Record<string, string>;
declare const parseValueToBoolean: (value: unknown, defaultValue: boolean) => boolean;
//#endregion
//#region src/common/promise.d.ts
interface PromiseWithResolvers<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}
declare const sleep: (ms: number, callback?: Fn) => Promise<void>;
declare const createSingleton: <T>(fn: AsyncFn<T>) => {
  (): Promise<T>;
  reset(): Promise<void>;
};
/**
 * @example
 * ```
 * const lock = createLock()
 *
 * lock.run(async () => {
 *   await doSomething()
 * })
 *
 * // in anther context:
 * await lock.wait() // it will wait all tasking finished
 * ```
 */
declare const createLock: () => {
  run<T = void>(fn: AsyncFn<T>): Promise<T>;
  wait(): Promise<void>;
  isWaiting(): boolean;
  clear(): void;
};
declare const PromiseWithResolvers: <T>() => PromiseWithResolvers<T>;
//#endregion
//#region src/common/shell.d.ts
interface ShellExecOptions {
  onStdout?: "ignore" | "print" | ((chunk: string) => void);
  onStderr?: "ignore" | "print" | ((chunk: string) => void);
}
interface ShellExecResult {
  stdout: string;
  stderr: string;
}
declare function $(cmd: string, options?: ShellExecOptions): Promise<Result<ShellExecResult, Error>>;
declare function $(cmd: TemplateStringsArray, ...values: any[]): Promise<Result<ShellExecResult, Error>>;
declare const quoteShellArg: (arg: string) => string;
//#endregion
//#region src/common/string.d.ts
declare const addPrefix: (prefix: string, str: string) => string;
declare const addSuffix: (suffix: string, str: string) => string;
declare const removePrefix: (prefix: string, str: string) => string;
declare const removeSuffix: (suffix: string, str: string) => string;
declare const join: (separator: string, ...paths: string[]) => string;
declare const split: (separator: string, path: string) => string[];
declare const toForwardSlash: (str: string) => string;
declare const joinWithSlash: (...paths: string[]) => string;
declare const splitWithSlash: (path: string) => string[];
declare const concatTemplateStrings: (template: TemplateStringsArray, values: any[]) => string;
/**
 * @example
 * ```ts
 * const str = unindent`
 *   if (a) {
 *     b()
 *   }
 * `
 * ```
 */
declare function unindent(template: string): string;
declare function unindent(template: TemplateStringsArray, ...values: any[]): string;
/**
 * @example
 * ```
 * const result = template(
 *   'Hello {0}! My name is {1}.',
 *   'World',
 *   'Alice'
 * ) // Hello World! My name is Alice.
 * ```
 *
 * ```
 * const result = template(
 *   '{greet}! My name is {name}.',
 *   { greet: 'Hello', name: 'Alice' }
 * ) // Hello! My name is Alice.
 * ```
 *
 * const result = template(
 *   '{greet}! My name is {name}.',
 *   { greet: 'Hello' }, // name isn't passed hence fallback will be used for name
 *   'placeholder'
 * ) // Hello! My name is placeholder.
 * ```
 */
declare function template(str: string, mapping: Record<string | number, any>, fallback?: string | ((key: string) => string)): string;
declare function template(str: string, ...args: (string | number | bigint | undefined | null)[]): string;
//#endregion
//#region src/common/throttle.d.ts
interface WrappedFn<T extends Fn> {
  (...args: Parameters<T>): void;
  cancel: Fn<void>;
}
interface Options {
  leading?: boolean;
  trailing?: boolean;
}
type DebouncedFn<T extends Fn> = WrappedFn<T>;
type ThrottledFn<T extends Fn> = WrappedFn<T>;
type DebounceOptions = Options;
type ThrottleOptions = Options;
declare const debounce: <T extends Fn>(fn: T, wait?: number, options?: Options) => WrappedFn<T>;
declare const throttle: <T extends Fn>(fn: T, wait?: number, options?: Options) => WrappedFn<T>;
//#endregion
export { $, type DebounceOptions, type DebouncedFn, PromiseWithResolvers, type ThrottleOptions, type ThrottledFn, addPrefix, addSuffix, concatTemplateStrings, createLock, createSingleton, debounce, errorToMessage, getErrorMessage, join, joinWithSlash, linear, normalizeError, unsafeParse as parse, parseKeyValuePairs, parseValueToBoolean, quoteShellArg, removePrefix, removeSuffix, safeParse, scale, sleep, split, splitWithSlash, stringify, template, throttle, toForwardSlash, unindent };