import { Result } from "./chunks/chunk-471ae0aa.js";
import "./chunks/chunk-ea0120e4.js";

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
declare const readFileByLine$1: (path: PathLike, options?: StringEncodingOptions) => Promise<Result<AsyncIterator<string>, Error>>;
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
declare const readFileByLine: (path: PathLike, options?: StringEncodingOptions) => Promise<AsyncIterator<string> | undefined>;
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
export { type AppendFileOptions, type BufferEncodingOptions, type CpOptions, type MkdirOptions, type StringEncodingOptions, VFile, type VFileOptions, type WriteJsonOptions, appendFile, appendFileSync, cp, cpSync, exists, existsSync, mkdir, mkdirSync, readFile, readFileByLine, readFileSync, readJson, readJsonSync, rm, rmSync, appendFile$1 as safeAppendFile, appendFileSync$1 as safeAppendFileSync, cp$1 as safeCp, cpSync$1 as safeCpSync, exists$1 as safeExists, existsSync$1 as safeExistsSync, mkdir$1 as safeMkdir, mkdirSync$1 as safeMkdirSync, readFile$1 as safeReadFile, readFileByLine$1 as safeReadFileByLine, readFileSync$1 as safeReadFileSync, readJson$1 as safeReadJson, readJsonSync$1 as safeReadJsonSync, rm$1 as safeRm, rmSync$1 as safeRmSync, writeFile as safeWriteFile, writeFileSync as safeWriteFileSync, writeJson as safeWriteJson, writeJsonSync as safeWriteJsonSync, writeFile$1 as writeFile, writeFileSync$1 as writeFileSync, writeJson$1 as writeJson, writeJsonSync$1 as writeJsonSync };