import { Result, err, ok, removePrefix, safeParse, safeTry, stringify } from "./chunks/chunk-4981f17d.js";
import { e$3 as e } from "./chunks/chunk-a14ca88a.js";
import fs, { promises } from "node:fs";
import path, { dirname } from "node:path";

//#region src/fs/safe.ts
const pathLikeToPath = (pathLike) => path.resolve(pathLike instanceof URL ? pathLike.pathname : pathLike);
const parseEncodingOptions = (options) => {
	const encoding = options?.encoding || "utf-8";
	return encoding === "buffer" ? {} : { encoding };
};
const parseWriteJsonOptions = (options) => {
	if (e(options)) return {
		indent: options,
		encoding: parseEncodingOptions()
	};
	return {
		indent: options?.indent ?? 2,
		encoding: parseEncodingOptions(options)
	};
};
const appendFile$1 = async (path$1, data, options) => safeTry(async function* () {
	const newline = options?.newline ?? true;
	yield* await mkdir$1(dirname(pathLikeToPath(path$1).toString()));
	const fn = async () => {
		await promises.appendFile(path$1, newline ? `\n${data}` : data, parseEncodingOptions(options));
	};
	return (await Result.try(fn, Error)).context(`Failed to append file: ${path$1}`);
});
const appendFileSync$1 = (path$1, data, options) => safeTry(function* () {
	const newline = options?.newline ?? true;
	yield* mkdirSync$1(dirname(pathLikeToPath(path$1).toString()));
	const fn = () => {
		fs.appendFileSync(path$1, newline ? `\n${data}` : data, parseEncodingOptions(options));
	};
	return Result.try(fn, Error).context(`Failed to append file: ${path$1}`);
});
const cp$1 = async (source, destination, options) => {
	const { recursive = true } = options || {};
	const fn = async () => {
		await promises.cp(source, destination, { recursive });
	};
	return (await Result.try(fn, Error)).context(`Failed to copy path: ${source} to ${destination}`);
};
const cpSync$1 = (source, destination, options) => {
	const { recursive = true } = options || {};
	const fn = () => {
		fs.cpSync(source, destination, { recursive });
	};
	return Result.try(fn, Error).context(`Failed to copy path: ${source} to ${destination}`);
};
const exists$1 = async (path$1) => {
	const fn = async () => {
		await promises.access(path$1);
		return true;
	};
	return (await Result.try(fn, Error)).context(`Failed to check exists for path: ${path$1}`);
};
const existsSync$1 = (path$1) => {
	const fn = () => {
		fs.accessSync(path$1);
		return true;
	};
	return Result.try(fn, Error).context(`Failed to check exists for path: ${path$1}`);
};
const mkdir$1 = async (path$1, options) => {
	const { recursive = true } = options || {};
	if ((await exists$1(path$1)).isOk()) return ok();
	const fn = async () => {
		await promises.mkdir(path$1, { recursive });
	};
	return (await Result.try(fn, Error)).context(`Failed to create directory: ${path$1}`);
};
const mkdirSync$1 = (path$1, options) => {
	const { recursive = true } = options || {};
	if (existsSync$1(path$1).isOk()) return ok();
	const fn = () => {
		fs.mkdirSync(path$1, { recursive });
	};
	return Result.try(fn, Error).context(`Failed to create directory: ${path$1}`);
};
async function readFile$1(path$1, options) {
	return safeTry(async function* () {
		yield* await exists$1(path$1);
		const fn = async () => {
			return await promises.readFile(path$1, parseEncodingOptions(options));
		};
		return (await Result.try(fn, Error)).context(`Failed to read file: ${path$1}`);
	});
}
function readFileSync$1(path$1, options) {
	return safeTry(function* () {
		yield* existsSync$1(path$1);
		const fn = () => {
			return fs.readFileSync(path$1, parseEncodingOptions(options));
		};
		return Result.try(fn, Error).context(`Failed to read file: ${path$1}`);
	});
}
const readFileByLine$1 = async (path$1, options) => safeTry(async function* () {
	yield* await exists$1(path$1);
	const { createInterface } = await import("node:readline");
	const fn = () => {
		const stream = fs.createReadStream(path$1, {
			...parseEncodingOptions(options),
			autoClose: true
		});
		stream.on("error", (error) => {
			throw error;
		});
		return createInterface({
			input: stream,
			crlfDelay: Infinity
		})[Symbol.asyncIterator]();
	};
	return Result.try(fn, Error).context(`Failed to read file: ${path$1}`);
});
const readJson$1 = async (path$1, options) => safeTry(async function* () {
	const content = yield* await readFile$1(path$1, options);
	if (!content) return err(/* @__PURE__ */ new Error(`JSON file is empty: ${path$1}`));
	return safeParse(content).context(`Failed to parse JSON file: ${path$1}`);
});
const readJsonSync$1 = (path$1, options) => safeTry(function* () {
	const content = yield* readFileSync$1(path$1, options);
	if (!content) return err(/* @__PURE__ */ new Error(`JSON file is empty: ${path$1}`));
	return safeParse(content).context(`Failed to parse JSON file: ${path$1}`);
});
const rm$1 = async (path$1, options) => {
	const { force = true, recursive = true } = options || {};
	const fn = async () => {
		await promises.rm(path$1, {
			force,
			recursive
		});
	};
	return (await Result.try(fn, Error)).context(`Failed to remove path: ${path$1}`);
};
const rmSync$1 = (path$1, options) => {
	const { force = true, recursive = true } = options || {};
	const fn = () => {
		fs.rmSync(path$1, {
			force,
			recursive
		});
	};
	return Result.try(fn, Error).context(`Failed to remove path: ${path$1}`);
};
const writeFile = async (path$1, data, options) => safeTry(async function* () {
	yield* await mkdir$1(dirname(pathLikeToPath(path$1).toString()));
	const fn = async () => {
		await promises.writeFile(path$1, data, parseEncodingOptions(options));
	};
	return (await Result.try(fn, Error)).context(`Failed to write file: ${path$1}`);
});
const writeFileSync = (path$1, data, options) => {
	const fn = () => {
		fs.writeFileSync(path$1, data, parseEncodingOptions(options));
	};
	return Result.try(fn, Error).context(`Failed to write file: ${path$1}`);
};
const writeJson = async (path$1, data, indentOrOptions) => {
	const { indent, encoding } = parseWriteJsonOptions(indentOrOptions);
	return writeFile(path$1, stringify(data, null, indent) ?? "", encoding);
};
const writeJsonSync = (path$1, data, indentOrOptions) => {
	const { indent, encoding } = parseWriteJsonOptions(indentOrOptions);
	return writeFileSync(path$1, stringify(data, null, indent) ?? "", encoding);
};

//#endregion
//#region src/fs/unsafe.ts
const appendFile = async (path$1, data, options) => {
	await appendFile$1(path$1, data, options);
};
const appendFileSync = (path$1, data, options) => {
	appendFileSync$1(path$1, data, options);
};
const cp = async (source, destination, options) => {
	await cp$1(source, destination, options);
};
const cpSync = (source, destination, options) => {
	cpSync$1(source, destination, options);
};
const exists = async (path$1) => {
	return (await exists$1(path$1)).isOk();
};
const existsSync = (path$1) => {
	return existsSync$1(path$1).isOk();
};
const mkdir = async (path$1, options) => {
	await mkdir$1(path$1, options);
};
const mkdirSync = (path$1, options) => {
	mkdirSync$1(path$1, options);
};
async function readFile(path$1, options) {
	const result = await readFile$1(path$1, options);
	if (result.isErr()) return void 0;
	return result.unwrap();
}
function readFileSync(path$1, options) {
	const result = readFileSync$1(path$1, options);
	if (result.isErr()) return void 0;
	return result.unwrap();
}
const readFileByLine = async (path$1, options) => {
	const result = await readFileByLine$1(path$1, options);
	if (result.isErr()) return void 0;
	return result.unwrap();
};
const readJson = async (path$1, options) => {
	const result = await readJson$1(path$1, options);
	if (result.isErr()) return void 0;
	return result.unwrap();
};
const readJsonSync = (path$1, options) => {
	const result = readJsonSync$1(path$1, options);
	if (result.isErr()) return void 0;
	return result.unwrap();
};
const rm = async (path$1, options) => {
	await rm$1(path$1, options);
};
const rmSync = (path$1, options) => {
	rmSync$1(path$1, options);
};
const writeFile$1 = async (path$1, data, options) => {
	await writeFile(path$1, data, options);
};
const writeFileSync$1 = (path$1, data, options) => {
	writeFileSync(path$1, data, options);
};
const writeJson$1 = async (path$1, data, indentOrOptions) => {
	await writeJson(path$1, data, indentOrOptions);
};
const writeJsonSync$1 = (path$1, data, indentOrOptions) => {
	writeJsonSync(path$1, data, indentOrOptions);
};

//#endregion
//#region src/fs/vfile.ts
var VFile = class VFile {
	static async fromFilepath(pathname, cwd) {
		const vfile = new VFile({
			pathname,
			cwd
		});
		return (await readFile$1(pathname)).map((content) => {
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
	constructor(options) {
		const { pathname, content, cwd } = options;
		this.pathname = pathname;
		if (content) this.content = content;
		if (cwd) this.cwd = cwd;
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
		return new VFile({
			pathname: this.pathname,
			content: this.content,
			cwd: this.cwd
		});
	}
	parse(value) {
		this.dirname = path.relative(this.cwd, path.dirname(value));
		this.extname = path.extname(value);
		this.filename = path.basename(value, this.extname);
	}
};

//#endregion
export { VFile, appendFile, appendFileSync, cp, cpSync, exists, existsSync, mkdir, mkdirSync, readFile, readFileByLine, readFileSync, readJson, readJsonSync, rm, rmSync, appendFile$1 as safeAppendFile, appendFileSync$1 as safeAppendFileSync, cp$1 as safeCp, cpSync$1 as safeCpSync, exists$1 as safeExists, existsSync$1 as safeExistsSync, mkdir$1 as safeMkdir, mkdirSync$1 as safeMkdirSync, readFile$1 as safeReadFile, readFileByLine$1 as safeReadFileByLine, readFileSync$1 as safeReadFileSync, readJson$1 as safeReadJson, readJsonSync$1 as safeReadJsonSync, rm$1 as safeRm, rmSync$1 as safeRmSync, writeFile as safeWriteFile, writeFileSync as safeWriteFileSync, writeJson as safeWriteJson, writeJsonSync as safeWriteJsonSync, writeFile$1 as writeFile, writeFileSync$1 as writeFileSync, writeJson$1 as writeJson, writeJsonSync$1 as writeJsonSync };