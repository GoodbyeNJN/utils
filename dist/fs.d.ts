/// <reference types="node" />
import { Result } from "./chunks/chunk-221a9598.js";
import "./chunks/chunk-ea0120e4.js";
import * as nativeFs$1 from "fs";

//#region node_modules/.pnpm/fdir@6.5.0_picomatch@4.0.3/node_modules/fdir/dist/index.d.mts

type FSLike = {
  readdir: typeof nativeFs$1.readdir;
  readdirSync: typeof nativeFs$1.readdirSync;
  realpath: typeof nativeFs$1.realpath;
  realpathSync: typeof nativeFs$1.realpathSync;
  stat: typeof nativeFs$1.stat;
  statSync: typeof nativeFs$1.statSync;
};
//#endregion
//#region node_modules/.pnpm/tinyglobby@0.2.15/node_modules/tinyglobby/dist/index.d.mts
//#region src/utils.d.ts

/**
* Converts a path to a pattern depending on the platform.
* Identical to {@link escapePath} on POSIX systems.
* @see {@link https://superchupu.dev/tinyglobby/documentation#convertPathToPattern}
*/
declare const convertPathToPattern: (path: string) => string;
/**
* Escapes a path's special characters depending on the platform.
* @see {@link https://superchupu.dev/tinyglobby/documentation#escapePath}
*/
declare const escapePath: (path: string) => string;
/**
* Checks if a pattern has dynamic parts.
*
* Has a few minor differences with [`fast-glob`](https://github.com/mrmlnc/fast-glob) for better accuracy:
*
* - Doesn't necessarily return `false` on patterns that include `\`.
* - Returns `true` if the pattern includes parentheses, regardless of them representing one single pattern or not.
* - Returns `true` for unfinished glob extensions i.e. `(h`, `+(h`.
* - Returns `true` for unfinished brace expansions as long as they include `,` or `..`.
*
* @see {@link https://superchupu.dev/tinyglobby/documentation#isDynamicPattern}
*/
declare function isDynamicPattern(pattern: string, options?: {
  caseSensitiveMatch: boolean;
}): boolean;
//#endregion
//#region src/index.d.ts
interface GlobOptions$1 {
  /**
  * Whether to return absolute paths. Disable to have relative paths.
  * @default false
  */
  absolute?: boolean;
  /**
  * Enables support for brace expansion syntax, like `{a,b}` or `{1..9}`.
  * @default true
  */
  braceExpansion?: boolean;
  /**
  * Whether to match in case-sensitive mode.
  * @default true
  */
  caseSensitiveMatch?: boolean;
  /**
  * The working directory in which to search. Results will be returned relative to this directory, unless
  * {@link absolute} is set.
  *
  * It is important to avoid globbing outside this directory when possible, even with absolute paths enabled,
  * as doing so can harm performance due to having to recalculate relative paths.
  * @default process.cwd()
  */
  cwd?: string | URL;
  /**
  * Logs useful debug information. Meant for development purposes. Logs can change at any time.
  * @default false
  */
  debug?: boolean;
  /**
  * Maximum directory depth to crawl.
  * @default Infinity
  */
  deep?: number;
  /**
  * Whether to return entries that start with a dot, like `.gitignore` or `.prettierrc`.
  * @default false
  */
  dot?: boolean;
  /**
  * Whether to automatically expand directory patterns.
  *
  * Important to disable if migrating from [`fast-glob`](https://github.com/mrmlnc/fast-glob).
  * @default true
  */
  expandDirectories?: boolean;
  /**
  * Enables support for extglobs, like `+(pattern)`.
  * @default true
  */
  extglob?: boolean;
  /**
  * Whether to traverse and include symbolic links. Can slightly affect performance.
  * @default true
  */
  followSymbolicLinks?: boolean;
  /**
  * An object that overrides `node:fs` functions.
  * @default import('node:fs')
  */
  fs?: FileSystemAdapter;
  /**
  * Enables support for matching nested directories with globstars (`**`).
  * If `false`, `**` behaves exactly like `*`.
  * @default true
  */
  globstar?: boolean;
  /**
  * Glob patterns to exclude from the results.
  * @default []
  */
  ignore?: string | readonly string[];
  /**
  * Enable to only return directories.
  * If `true`, disables {@link onlyFiles}.
  * @default false
  */
  onlyDirectories?: boolean;
  /**
  * Enable to only return files.
  * @default true
  */
  onlyFiles?: boolean;
  /**
  * @deprecated Provide patterns as the first argument instead.
  */
  patterns?: string | readonly string[];
  /**
  * An `AbortSignal` to abort crawling the file system.
  * @default undefined
  */
  signal?: AbortSignal;
}
type FileSystemAdapter = Partial<FSLike>;
/**
* Asynchronously match files following a glob pattern.
* @see {@link https://superchupu.dev/tinyglobby/documentation#glob}
*/
//#endregion
//#region src/fs/glob.d.ts
interface GlobOptions extends Omit<GlobOptions$1, "patterns"> {
  /**
   * Provide patterns as the first argument instead.
   */
  patterns: string | string[];
}
declare function glob(patterns: string | string[], options?: Omit<GlobOptions, "patterns">): Promise<string[]>;
declare function glob(options: GlobOptions): Promise<string[]>;
declare function globSync(patterns: string | string[], options?: Omit<GlobOptions, "patterns">): string[];
declare function globSync(options: GlobOptions): string[];
//#endregion
//#region src/fs/types.d.ts
type PathLike = string | URL;
interface BufferEncodingOptions {
  encoding?: "buffer" | undefined;
}
interface StringEncodingOptions {
  encoding?: BufferEncoding | undefined;
}
type AppendFileOptions = StringEncodingOptions & {
  newline?: boolean | undefined;
};
type WriteJsonOptions = (StringEncodingOptions & {
  indent?: number | undefined;
}) | number;
interface MkdirOptions {
  recursive?: boolean | undefined;
}
interface RmOptions {
  force?: boolean | undefined;
  recursive?: boolean | undefined;
}
interface CpOptions {
  recursive?: boolean | undefined;
}
//#endregion
//#region src/fs/safe.d.ts
declare const appendFile$1: (path: PathLike, data: string, options?: AppendFileOptions) => Promise<Result<void, Error>>;
declare const appendFileSync$1: (path: PathLike, data: string, options?: AppendFileOptions) => Result<void, Error>;
declare const cp$1: (source: PathLike, destination: PathLike, options?: CpOptions) => Promise<Result<void, Error>>;
declare const cpSync$1: (source: PathLike, destination: PathLike, options?: CpOptions) => Result<void, Error>;
declare const exists$1: (path: PathLike) => Promise<Result<true, Error>>;
declare const existsSync$1: (path: PathLike) => Result<true, Error>;
declare const mkdir$1: (path: PathLike, options?: MkdirOptions) => Promise<Result<void, Error>>;
declare const mkdirSync$1: (path: PathLike, options?: MkdirOptions) => Result<void, Error>;
declare function readFile$1(path: PathLike, options: BufferEncodingOptions): Promise<Result<Buffer, Error>>;
declare function readFile$1(path: PathLike, options?: StringEncodingOptions): Promise<Result<string, Error>>;
declare function readFileSync$1(path: PathLike, options: BufferEncodingOptions): Result<Buffer, Error>;
declare function readFileSync$1(path: PathLike, options?: StringEncodingOptions): Result<string, Error>;
declare const readFileByLine$1: (path: PathLike, options?: StringEncodingOptions) => Promise<Result<AsyncIterable<string>, Error>>;
declare const readJson$1: <T = any>(path: PathLike, options?: StringEncodingOptions) => Promise<Result<T, Error>>;
declare const readJsonSync$1: <T = any>(path: PathLike, options?: StringEncodingOptions) => Result<T, Error>;
declare const rm$1: (path: PathLike, options?: RmOptions) => Promise<Result<void, Error>>;
declare const rmSync$1: (path: PathLike, options?: RmOptions) => Result<void, Error>;
declare const writeFile: (path: PathLike, data: string, options?: StringEncodingOptions) => Promise<Result<void, Error>>;
declare const writeFileSync: (path: PathLike, data: string, options?: StringEncodingOptions) => Result<void, Error>;
declare const writeJson: (path: PathLike, data: any, indentOrOptions?: WriteJsonOptions) => Promise<Result<void, Error>>;
declare const writeJsonSync: (path: PathLike, data: any, indentOrOptions?: WriteJsonOptions) => Result<void, Error>;
//#endregion
//#region src/fs/unsafe.d.ts
declare const appendFile: (path: PathLike, data: string, options?: AppendFileOptions) => Promise<void>;
declare const appendFileSync: (path: PathLike, data: string, options?: AppendFileOptions) => void;
declare const cp: (source: PathLike, destination: PathLike, options?: CpOptions) => Promise<void>;
declare const cpSync: (source: PathLike, destination: PathLike, options?: CpOptions) => void;
declare const exists: (path: PathLike) => Promise<boolean>;
declare const existsSync: (path: PathLike) => boolean;
declare const mkdir: (path: PathLike, options?: MkdirOptions) => Promise<void>;
declare const mkdirSync: (path: PathLike, options?: MkdirOptions) => void;
declare function readFile(path: PathLike, options: BufferEncodingOptions): Promise<Buffer | undefined>;
declare function readFile(path: PathLike, options?: StringEncodingOptions): Promise<string | undefined>;
declare function readFileSync(path: PathLike, options: BufferEncodingOptions): Buffer | undefined;
declare function readFileSync(path: PathLike, options?: StringEncodingOptions): string | undefined;
declare const readFileByLine: (path: PathLike, options?: StringEncodingOptions) => Promise<AsyncIterable<string> | undefined>;
declare const readJson: <T = any>(path: PathLike, options?: StringEncodingOptions) => Promise<T | undefined>;
declare const readJsonSync: <T = any>(path: PathLike, options?: StringEncodingOptions) => T | undefined;
declare const rm: (path: PathLike, options?: RmOptions) => Promise<void>;
declare const rmSync: (path: PathLike, options?: RmOptions) => void;
declare const writeFile$1: (path: PathLike, data: string, options?: StringEncodingOptions) => Promise<void>;
declare const writeFileSync$1: (path: PathLike, data: string, options?: StringEncodingOptions) => void;
declare const writeJson$1: (path: PathLike, data: any, indentOrOptions?: WriteJsonOptions) => Promise<void>;
declare const writeJsonSync$1: (path: PathLike, data: any, indentOrOptions?: WriteJsonOptions) => void;
//#endregion
//#region src/fs/vfile.d.ts
interface VFileOptions {
  pathname: string;
  content?: string | undefined;
  cwd?: string | undefined;
}
declare class VFile {
  static fromFilepath(pathname: string, cwd?: string): Promise<Result<VFile, Error>>;
  content: string;
  /**
   * @example
   * `/home/user/project`
   */
  cwd: string;
  /**
   * @example
   * `src`
   */
  dirname: string;
  /**
   * @example
   * `index`
   */
  filename: string;
  /**
   * @example
   * `js`
   */
  extname: string;
  constructor(options: VFileOptions);
  /**
   * @example
   * `/home/user/project/src/index.js`
   */
  get pathname(): string;
  set pathname(value: string);
  /**
   * @example
   * `index.js`
   */
  get basename(): string;
  set basename(value: string);
  /**
   * @example
   * `/home/user/project/src`
   */
  get absoluteDirname(): string;
  set absoluteDirname(value: string);
  /**
   * @example
   * `src/index.js`
   */
  get relativePathname(): string;
  set relativePathname(value: string);
  clone(): VFile;
  private parse;
}
//#endregion
export { type AppendFileOptions, type BufferEncodingOptions, type CpOptions, type FileSystemAdapter, type GlobOptions, type MkdirOptions, type StringEncodingOptions, VFile, type VFileOptions, type WriteJsonOptions, appendFile, appendFileSync, convertPathToPattern, cp, cpSync, escapePath, exists, existsSync, glob, globSync, isDynamicPattern, mkdir, mkdirSync, readFile, readFileByLine, readFileSync, readJson, readJsonSync, rm, rmSync, appendFile$1 as safeAppendFile, appendFileSync$1 as safeAppendFileSync, cp$1 as safeCp, cpSync$1 as safeCpSync, exists$1 as safeExists, existsSync$1 as safeExistsSync, mkdir$1 as safeMkdir, mkdirSync$1 as safeMkdirSync, readFile$1 as safeReadFile, readFileByLine$1 as safeReadFileByLine, readFileSync$1 as safeReadFileSync, readJson$1 as safeReadJson, readJsonSync$1 as safeReadJsonSync, rm$1 as safeRm, rmSync$1 as safeRmSync, writeFile as safeWriteFile, writeFileSync as safeWriteFileSync, writeJson as safeWriteJson, writeJsonSync as safeWriteJsonSync, writeFile$1 as writeFile, writeFileSync$1 as writeFileSync, writeJson$1 as writeJson, writeJsonSync$1 as writeJsonSync };