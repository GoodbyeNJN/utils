import { isPromiseLike, l$1 as l, o$5 as o, r$4 as r, t$4 as t$1, t$6 as t, u } from "./chunk-a14ca88a.js";

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
//#region node_modules/.pnpm/safe-stable-stringify@2.5.0/node_modules/safe-stable-stringify/index.js
var require_safe_stable_stringify = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/safe-stable-stringify@2.5.0/node_modules/safe-stable-stringify/index.js": ((exports, module) => {
	const { hasOwnProperty } = Object.prototype;
	const stringify$1 = configure$1();
	stringify$1.configure = configure$1;
	stringify$1.stringify = stringify$1;
	stringify$1.default = stringify$1;
	exports.stringify = stringify$1;
	exports.configure = configure$1;
	module.exports = stringify$1;
	const strEscapeSequencesRegExp = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]/;
	function strEscape(str) {
		if (str.length < 5e3 && !strEscapeSequencesRegExp.test(str)) return `"${str}"`;
		return JSON.stringify(str);
	}
	function sort(array, comparator) {
		if (array.length > 200 || comparator) return array.sort(comparator);
		for (let i = 1; i < array.length; i++) {
			const currentValue = array[i];
			let position = i;
			while (position !== 0 && array[position - 1] > currentValue) {
				array[position] = array[position - 1];
				position--;
			}
			array[position] = currentValue;
		}
		return array;
	}
	const typedArrayPrototypeGetSymbolToStringTag = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Object.getPrototypeOf(new Int8Array())), Symbol.toStringTag).get;
	function isTypedArrayWithEntries(value) {
		return typedArrayPrototypeGetSymbolToStringTag.call(value) !== void 0 && value.length !== 0;
	}
	function stringifyTypedArray(array, separator, maximumBreadth) {
		if (array.length < maximumBreadth) maximumBreadth = array.length;
		const whitespace = separator === "," ? "" : " ";
		let res = `"0":${whitespace}${array[0]}`;
		for (let i = 1; i < maximumBreadth; i++) res += `${separator}"${i}":${whitespace}${array[i]}`;
		return res;
	}
	function getCircularValueOption(options) {
		if (hasOwnProperty.call(options, "circularValue")) {
			const circularValue = options.circularValue;
			if (typeof circularValue === "string") return `"${circularValue}"`;
			if (circularValue == null) return circularValue;
			if (circularValue === Error || circularValue === TypeError) return { toString() {
				throw new TypeError("Converting circular structure to JSON");
			} };
			throw new TypeError("The \"circularValue\" argument must be of type string or the value null or undefined");
		}
		return "\"[Circular]\"";
	}
	function getDeterministicOption(options) {
		let value;
		if (hasOwnProperty.call(options, "deterministic")) {
			value = options.deterministic;
			if (typeof value !== "boolean" && typeof value !== "function") throw new TypeError("The \"deterministic\" argument must be of type boolean or comparator function");
		}
		return value === void 0 ? true : value;
	}
	function getBooleanOption(options, key) {
		let value;
		if (hasOwnProperty.call(options, key)) {
			value = options[key];
			if (typeof value !== "boolean") throw new TypeError(`The "${key}" argument must be of type boolean`);
		}
		return value === void 0 ? true : value;
	}
	function getPositiveIntegerOption(options, key) {
		let value;
		if (hasOwnProperty.call(options, key)) {
			value = options[key];
			if (typeof value !== "number") throw new TypeError(`The "${key}" argument must be of type number`);
			if (!Number.isInteger(value)) throw new TypeError(`The "${key}" argument must be an integer`);
			if (value < 1) throw new RangeError(`The "${key}" argument must be >= 1`);
		}
		return value === void 0 ? Infinity : value;
	}
	function getItemCount(number) {
		if (number === 1) return "1 item";
		return `${number} items`;
	}
	function getUniqueReplacerSet(replacerArray) {
		const replacerSet = /* @__PURE__ */ new Set();
		for (const value of replacerArray) if (typeof value === "string" || typeof value === "number") replacerSet.add(String(value));
		return replacerSet;
	}
	function getStrictOption(options) {
		if (hasOwnProperty.call(options, "strict")) {
			const value = options.strict;
			if (typeof value !== "boolean") throw new TypeError("The \"strict\" argument must be of type boolean");
			if (value) return (value$1) => {
				let message = `Object can not safely be stringified. Received type ${typeof value$1}`;
				if (typeof value$1 !== "function") message += ` (${value$1.toString()})`;
				throw new Error(message);
			};
		}
	}
	function configure$1(options) {
		options = { ...options };
		const fail = getStrictOption(options);
		if (fail) {
			if (options.bigint === void 0) options.bigint = false;
			if (!("circularValue" in options)) options.circularValue = Error;
		}
		const circularValue = getCircularValueOption(options);
		const bigint = getBooleanOption(options, "bigint");
		const deterministic = getDeterministicOption(options);
		const comparator = typeof deterministic === "function" ? deterministic : void 0;
		const maximumDepth = getPositiveIntegerOption(options, "maximumDepth");
		const maximumBreadth = getPositiveIntegerOption(options, "maximumBreadth");
		function stringifyFnReplacer(key, parent, stack, replacer, spacer, indentation) {
			let value = parent[key];
			if (typeof value === "object" && value !== null && typeof value.toJSON === "function") value = value.toJSON(key);
			value = replacer.call(parent, key, value);
			switch (typeof value) {
				case "string": return strEscape(value);
				case "object": {
					if (value === null) return "null";
					if (stack.indexOf(value) !== -1) return circularValue;
					let res = "";
					let join$1 = ",";
					const originalIndentation = indentation;
					if (Array.isArray(value)) {
						if (value.length === 0) return "[]";
						if (maximumDepth < stack.length + 1) return "\"[Array]\"";
						stack.push(value);
						if (spacer !== "") {
							indentation += spacer;
							res += `\n${indentation}`;
							join$1 = `,\n${indentation}`;
						}
						const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
						let i = 0;
						for (; i < maximumValuesToStringify - 1; i++) {
							const tmp$1 = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
							res += tmp$1 !== void 0 ? tmp$1 : "null";
							res += join$1;
						}
						const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
						res += tmp !== void 0 ? tmp : "null";
						if (value.length - 1 > maximumBreadth) {
							const removedKeys = value.length - maximumBreadth - 1;
							res += `${join$1}"... ${getItemCount(removedKeys)} not stringified"`;
						}
						if (spacer !== "") res += `\n${originalIndentation}`;
						stack.pop();
						return `[${res}]`;
					}
					let keys = Object.keys(value);
					const keyLength = keys.length;
					if (keyLength === 0) return "{}";
					if (maximumDepth < stack.length + 1) return "\"[Object]\"";
					let whitespace = "";
					let separator = "";
					if (spacer !== "") {
						indentation += spacer;
						join$1 = `,\n${indentation}`;
						whitespace = " ";
					}
					const maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
					if (deterministic && !isTypedArrayWithEntries(value)) keys = sort(keys, comparator);
					stack.push(value);
					for (let i = 0; i < maximumPropertiesToStringify; i++) {
						const key$1 = keys[i];
						const tmp = stringifyFnReplacer(key$1, value, stack, replacer, spacer, indentation);
						if (tmp !== void 0) {
							res += `${separator}${strEscape(key$1)}:${whitespace}${tmp}`;
							separator = join$1;
						}
					}
					if (keyLength > maximumBreadth) {
						const removedKeys = keyLength - maximumBreadth;
						res += `${separator}"...":${whitespace}"${getItemCount(removedKeys)} not stringified"`;
						separator = join$1;
					}
					if (spacer !== "" && separator.length > 1) res = `\n${indentation}${res}\n${originalIndentation}`;
					stack.pop();
					return `{${res}}`;
				}
				case "number": return isFinite(value) ? String(value) : fail ? fail(value) : "null";
				case "boolean": return value === true ? "true" : "false";
				case "undefined": return;
				case "bigint": if (bigint) return String(value);
				default: return fail ? fail(value) : void 0;
			}
		}
		function stringifyArrayReplacer(key, value, stack, replacer, spacer, indentation) {
			if (typeof value === "object" && value !== null && typeof value.toJSON === "function") value = value.toJSON(key);
			switch (typeof value) {
				case "string": return strEscape(value);
				case "object": {
					if (value === null) return "null";
					if (stack.indexOf(value) !== -1) return circularValue;
					const originalIndentation = indentation;
					let res = "";
					let join$1 = ",";
					if (Array.isArray(value)) {
						if (value.length === 0) return "[]";
						if (maximumDepth < stack.length + 1) return "\"[Array]\"";
						stack.push(value);
						if (spacer !== "") {
							indentation += spacer;
							res += `\n${indentation}`;
							join$1 = `,\n${indentation}`;
						}
						const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
						let i = 0;
						for (; i < maximumValuesToStringify - 1; i++) {
							const tmp$1 = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
							res += tmp$1 !== void 0 ? tmp$1 : "null";
							res += join$1;
						}
						const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
						res += tmp !== void 0 ? tmp : "null";
						if (value.length - 1 > maximumBreadth) {
							const removedKeys = value.length - maximumBreadth - 1;
							res += `${join$1}"... ${getItemCount(removedKeys)} not stringified"`;
						}
						if (spacer !== "") res += `\n${originalIndentation}`;
						stack.pop();
						return `[${res}]`;
					}
					stack.push(value);
					let whitespace = "";
					if (spacer !== "") {
						indentation += spacer;
						join$1 = `,\n${indentation}`;
						whitespace = " ";
					}
					let separator = "";
					for (const key$1 of replacer) {
						const tmp = stringifyArrayReplacer(key$1, value[key$1], stack, replacer, spacer, indentation);
						if (tmp !== void 0) {
							res += `${separator}${strEscape(key$1)}:${whitespace}${tmp}`;
							separator = join$1;
						}
					}
					if (spacer !== "" && separator.length > 1) res = `\n${indentation}${res}\n${originalIndentation}`;
					stack.pop();
					return `{${res}}`;
				}
				case "number": return isFinite(value) ? String(value) : fail ? fail(value) : "null";
				case "boolean": return value === true ? "true" : "false";
				case "undefined": return;
				case "bigint": if (bigint) return String(value);
				default: return fail ? fail(value) : void 0;
			}
		}
		function stringifyIndent(key, value, stack, spacer, indentation) {
			switch (typeof value) {
				case "string": return strEscape(value);
				case "object": {
					if (value === null) return "null";
					if (typeof value.toJSON === "function") {
						value = value.toJSON(key);
						if (typeof value !== "object") return stringifyIndent(key, value, stack, spacer, indentation);
						if (value === null) return "null";
					}
					if (stack.indexOf(value) !== -1) return circularValue;
					const originalIndentation = indentation;
					if (Array.isArray(value)) {
						if (value.length === 0) return "[]";
						if (maximumDepth < stack.length + 1) return "\"[Array]\"";
						stack.push(value);
						indentation += spacer;
						let res$1 = `\n${indentation}`;
						const join$2 = `,\n${indentation}`;
						const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
						let i = 0;
						for (; i < maximumValuesToStringify - 1; i++) {
							const tmp$1 = stringifyIndent(String(i), value[i], stack, spacer, indentation);
							res$1 += tmp$1 !== void 0 ? tmp$1 : "null";
							res$1 += join$2;
						}
						const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation);
						res$1 += tmp !== void 0 ? tmp : "null";
						if (value.length - 1 > maximumBreadth) {
							const removedKeys = value.length - maximumBreadth - 1;
							res$1 += `${join$2}"... ${getItemCount(removedKeys)} not stringified"`;
						}
						res$1 += `\n${originalIndentation}`;
						stack.pop();
						return `[${res$1}]`;
					}
					let keys = Object.keys(value);
					const keyLength = keys.length;
					if (keyLength === 0) return "{}";
					if (maximumDepth < stack.length + 1) return "\"[Object]\"";
					indentation += spacer;
					const join$1 = `,\n${indentation}`;
					let res = "";
					let separator = "";
					let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
					if (isTypedArrayWithEntries(value)) {
						res += stringifyTypedArray(value, join$1, maximumBreadth);
						keys = keys.slice(value.length);
						maximumPropertiesToStringify -= value.length;
						separator = join$1;
					}
					if (deterministic) keys = sort(keys, comparator);
					stack.push(value);
					for (let i = 0; i < maximumPropertiesToStringify; i++) {
						const key$1 = keys[i];
						const tmp = stringifyIndent(key$1, value[key$1], stack, spacer, indentation);
						if (tmp !== void 0) {
							res += `${separator}${strEscape(key$1)}: ${tmp}`;
							separator = join$1;
						}
					}
					if (keyLength > maximumBreadth) {
						const removedKeys = keyLength - maximumBreadth;
						res += `${separator}"...": "${getItemCount(removedKeys)} not stringified"`;
						separator = join$1;
					}
					if (separator !== "") res = `\n${indentation}${res}\n${originalIndentation}`;
					stack.pop();
					return `{${res}}`;
				}
				case "number": return isFinite(value) ? String(value) : fail ? fail(value) : "null";
				case "boolean": return value === true ? "true" : "false";
				case "undefined": return;
				case "bigint": if (bigint) return String(value);
				default: return fail ? fail(value) : void 0;
			}
		}
		function stringifySimple(key, value, stack) {
			switch (typeof value) {
				case "string": return strEscape(value);
				case "object": {
					if (value === null) return "null";
					if (typeof value.toJSON === "function") {
						value = value.toJSON(key);
						if (typeof value !== "object") return stringifySimple(key, value, stack);
						if (value === null) return "null";
					}
					if (stack.indexOf(value) !== -1) return circularValue;
					let res = "";
					const hasLength = value.length !== void 0;
					if (hasLength && Array.isArray(value)) {
						if (value.length === 0) return "[]";
						if (maximumDepth < stack.length + 1) return "\"[Array]\"";
						stack.push(value);
						const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
						let i = 0;
						for (; i < maximumValuesToStringify - 1; i++) {
							const tmp$1 = stringifySimple(String(i), value[i], stack);
							res += tmp$1 !== void 0 ? tmp$1 : "null";
							res += ",";
						}
						const tmp = stringifySimple(String(i), value[i], stack);
						res += tmp !== void 0 ? tmp : "null";
						if (value.length - 1 > maximumBreadth) {
							const removedKeys = value.length - maximumBreadth - 1;
							res += `,"... ${getItemCount(removedKeys)} not stringified"`;
						}
						stack.pop();
						return `[${res}]`;
					}
					let keys = Object.keys(value);
					const keyLength = keys.length;
					if (keyLength === 0) return "{}";
					if (maximumDepth < stack.length + 1) return "\"[Object]\"";
					let separator = "";
					let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
					if (hasLength && isTypedArrayWithEntries(value)) {
						res += stringifyTypedArray(value, ",", maximumBreadth);
						keys = keys.slice(value.length);
						maximumPropertiesToStringify -= value.length;
						separator = ",";
					}
					if (deterministic) keys = sort(keys, comparator);
					stack.push(value);
					for (let i = 0; i < maximumPropertiesToStringify; i++) {
						const key$1 = keys[i];
						const tmp = stringifySimple(key$1, value[key$1], stack);
						if (tmp !== void 0) {
							res += `${separator}${strEscape(key$1)}:${tmp}`;
							separator = ",";
						}
					}
					if (keyLength > maximumBreadth) {
						const removedKeys = keyLength - maximumBreadth;
						res += `${separator}"...":"${getItemCount(removedKeys)} not stringified"`;
					}
					stack.pop();
					return `{${res}}`;
				}
				case "number": return isFinite(value) ? String(value) : fail ? fail(value) : "null";
				case "boolean": return value === true ? "true" : "false";
				case "undefined": return;
				case "bigint": if (bigint) return String(value);
				default: return fail ? fail(value) : void 0;
			}
		}
		function stringify$2(value, replacer, space) {
			if (arguments.length > 1) {
				let spacer = "";
				if (typeof space === "number") spacer = " ".repeat(Math.min(space, 10));
				else if (typeof space === "string") spacer = space.slice(0, 10);
				if (replacer != null) {
					if (typeof replacer === "function") return stringifyFnReplacer("", { "": value }, [], replacer, spacer, "");
					if (Array.isArray(replacer)) return stringifyArrayReplacer("", value, [], getUniqueReplacerSet(replacer), spacer, "");
				}
				if (spacer.length !== 0) return stringifyIndent("", value, [], spacer, "");
			}
			return stringifySimple("", value, []);
		}
		return stringify$2;
	}
}) });

//#endregion
//#region node_modules/.pnpm/safe-stable-stringify@2.5.0/node_modules/safe-stable-stringify/esm/wrapper.js
var import_safe_stable_stringify = /* @__PURE__ */ __toESM(require_safe_stable_stringify(), 1);
const configure = import_safe_stable_stringify.configure;

//#endregion
//#region src/result/helper.ts
function safeTry(body, self) {
	const yieldErr = body.call(self).next();
	if (isPromiseLike(yieldErr)) return yieldErr.then((res) => res.value);
	return yieldErr.value;
}

//#endregion
//#region src/result/result.ts
const never = null;
const transformError = (error, onThrow) => {
	if (!onThrow) return error;
	if (onThrow === Error) return normalizeError(error);
	return onThrow(error);
};
function ok(value) {
	return new Ok(value);
}
function err(error) {
	return Err.fromError(error, err);
}
var Result = class Result {
	static fromValue(data, onThrow) {
		try {
			if (!isPromiseLike(data)) return ok(data);
			return data.then((value) => ok(value), (error) => Err.fromError(transformError(error, onThrow), Result.fromValue));
		} catch (error) {
			return Err.fromError(transformError(error, onThrow), Result.fromValue);
		}
	}
	static fromCallable(callable, onThrow) {
		try {
			if (!t$1(callable)) return ok(callable);
			const data = callable();
			if (!isPromiseLike(data)) return ok(data);
			return data.then((value) => ok(value), (error) => Err.fromError(transformError(error, onThrow), Result.fromCallable));
		} catch (error) {
			return Err.fromError(transformError(error, onThrow), Result.fromCallable);
		}
	}
	static all(results) {
		let acc = ok([]);
		for (const result of results) {
			if (!result.isOk()) {
				acc = Err.fromError(result.error, Result.all);
				break;
			}
			acc = acc.map((values) => [...values, result.value]);
		}
		return acc;
	}
	static allSettled(results) {
		let acc = ok([]);
		for (const result of results) if (result.isErr() && acc.isErr()) acc = acc.mapErr((errors) => [...errors, result.error]);
		else if (result.isOk() && acc.isOk()) acc = acc.map((values) => [...values, result.value]);
		else if (result.isErr() && acc.isOk()) acc = Err.fromError([result.error], Result.allSettled);
		return acc;
	}
	contexts = [];
	ok;
	value;
	error;
	constructor(ok$1, error, value) {
		this.ok = ok$1;
		this.error = error;
		this.value = value;
	}
	/**
	* Check if `Result` is `OK`
	*/
	isOk() {
		return this.ok;
	}
	/**
	* Check if `Result` is `OK` and the value matches the predicate
	*/
	isOkAnd(predicate) {
		return this.isOk() && predicate(this.value);
	}
	/**
	* Check if `Result` is `Err`
	*/
	isErr() {
		return !this.ok;
	}
	/**
	* Check if `Result` is `Err` and the error matches the predicate
	*/
	isErrAnd(predicate) {
		return this.isErr() && predicate(this.error);
	}
	/**
	* Maps `Result<T, E>` to `Result<U, E>`
	*/
	map(fn) {
		return this.isErr() ? this : ok(fn(this.value));
	}
	/**
	* Maps `Result<T, E>` to `Result<T, F>`
	*/
	mapErr(fn) {
		return this.isOk() ? this : Err.fromError(fn(this.error), this.mapErr);
	}
	and(result) {
		return this.isErr() ? this : result;
	}
	andThen(fn) {
		return this.isErr() ? this : fn(this.value);
	}
	or(result) {
		return this.isOk() ? this : result;
	}
	orElse(fn) {
		return this.isOk() ? this : fn(this.error);
	}
	/**
	* Calls the function with the value if `Result` is `Ok` and returns the result unchanged
	*/
	inspect(fn) {
		try {
			this.isOk() && fn(this.value);
		} catch {}
		return this;
	}
	/**
	* Calls the function with the error if `Result` is `Err` and returns the result unchanged
	*/
	inspectErr(fn) {
		try {
			this.isErr() && fn(this.error);
		} catch {}
		return this;
	}
	/**
	* Unwrap the `Ok` value, or throw an error if `Result` is `Err`
	*/
	unwrap() {
		if (this.isErr()) throw this.unwrapErr();
		return this.value;
	}
	/**
	* Unwrap the `Err` value, or throw an error if `Result` is `Ok`
	*/
	unwrapErr() {
		if (this.isOk()) throw this.unwrap();
		return this.error;
	}
	/**
	* Unwrap the `Ok` value, or return the provided value if `Result` is `Err`
	*/
	unwrapOr(defaultValue) {
		return this.isOk() ? this.value : defaultValue;
	}
	/**
	* Unwrap the `Ok` value, or compute it from a function if `Result` is `Err`
	*/
	unwrapOrElse(defaultValueGetter) {
		return this.isOk() ? this.value : defaultValueGetter(this.error);
	}
	/**
	* Matches the `Result` variant and executes the corresponding function
	*/
	match(ok$1, err$1) {
		return this.isOk() ? ok$1(this.value) : err$1(this.error);
	}
	/**
	* Returns an iterable object that yields the `Ok` value and `Err` value
	*/
	iter() {
		if (this.isOk()) return [
			true,
			never,
			this.value
		];
		else return [
			false,
			this.error,
			never
		];
	}
	*[Symbol.iterator]() {
		if (this.isOk()) return this.value;
		const self = this;
		yield self;
		return self;
	}
	context(context) {
		this.contexts.push(context);
		return this;
	}
	withContext(contextGetter) {
		this.contexts.push(contextGetter);
		return this;
	}
};
var Ok = class extends Result {
	constructor(value) {
		super(true, never, value);
	}
	toString() {
		return `Ok(${stringify(this["value"])})`;
	}
	toJSON() {
		return this.toString();
	}
};
var Err = class Err extends Result {
	static fromError(error, caller) {
		const err$1 = new Err(error);
		if (error instanceof Error) err$1.stack = error.stack;
		else if ("captureStackTrace" in Error) {
			const dummy = {};
			Error.captureStackTrace(dummy, caller);
			err$1.stack = dummy.stack;
		}
		return err$1;
	}
	stack;
	constructor(error) {
		super(false, error, never);
	}
	toError() {
		return normalizeError(this["error"]);
	}
	format(presetOrOptions) {
		const options = this.normalize(presetOrOptions);
		const message = this.toError().message;
		const contexts = this["contexts"].slice().toReversed().map((ctx) => t$1(ctx) ? ctx() : ctx);
		const stacks = this.stack?.split("\n").map((line) => line.trim()).filter(Boolean) || ["<no stack trace>"];
		const lines = [`Error: ${contexts.length > 0 ? contexts.at(0) : message}`];
		if (options.context) lines.push("", "Caused by:", contexts.slice(1).concat(message).map((line, index) => `    ${index}: ${line}`));
		if (options.stack) {
			const top = stacks.at(0) || "";
			const hasErrorMessage = (/* @__PURE__ */ new RegExp(`^\\w+:\\s+${message}$`)).test(top) || /^\w+$/.test(top);
			lines.push("", "Stack trace:", stacks.slice(hasErrorMessage ? 1 : 0).map((line) => `    ${line}`));
		}
		return lines.flat().join("\n");
	}
	print(presetOrOptions) {
		const options = this.normalize(presetOrOptions);
		const output = this.format(options);
		switch (options.level) {
			case "error":
				console.error(output);
				break;
			case "warn":
				console.warn(output);
				break;
			case "info":
				console.info(output);
				break;
		}
	}
	toString() {
		return this.format();
	}
	toJSON() {
		return this.toString();
	}
	normalize(presetOrOptions) {
		const options = {
			level: "error",
			context: true,
			stack: false
		};
		if (t(presetOrOptions)) {
			options.context = presetOrOptions === "full" || presetOrOptions === "standard";
			options.stack = presetOrOptions === "full";
		} else if (o(presetOrOptions)) {
			options.level = presetOrOptions.level ?? options.level;
			options.context = presetOrOptions.context ?? options.context;
			options.stack = presetOrOptions.stack ?? options.stack;
		}
		return options;
	}
};

//#endregion
//#region src/common/json.ts
const stringify = configure({ bigint: true });
const safeParse = (text, reviver) => {
	const fn = () => {
		return JSON.parse(text, reviver);
	};
	return Result.fromCallable(fn, Error).context(`Failed to parse JSON string: ${text.length > 100 ? text.slice(0, 100) + "..." : text}`);
};
const unsafeParse = (text, reviver) => {
	const result = safeParse(text, reviver);
	if (result.isErr()) return void 0;
	return result.unwrap();
};

//#endregion
//#region src/common/error.ts
const normalizeError = (error) => {
	if (error instanceof Error) return error;
	if (o(error) && "toError" in error && t$1(error.toError)) return error.toError();
	return new Error(stringify(error));
};
const getErrorMessage = (error, message = "Unknown error") => error instanceof Error ? error.message : message;
const errorToMessage = (message = "Unknown error") => (error) => getErrorMessage(error, message);

//#endregion
//#region src/common/math.ts
/**
* @example
* ```
* const value = linear(0.5, [0, 2]) // value: 1
* ```
*/
const linear = (value, range) => {
	const [min, max] = range;
	const interpolation = u(value, {
		min: 0,
		max: 1
	});
	return min + (max - min) * interpolation;
};
/**
* @example
* ```
* const value = scale(0.5, [0, 1], [200, 400]) // value: 300
* ```
*/
const scale = (value, inRange, outRange) => {
	const [inMin, inMax] = inRange;
	const [outMin, outMax] = outRange;
	return linear((value - inMin) / (inMax - inMin), [outMin, outMax]);
};

//#endregion
//#region src/common/parse.ts
const parseKeyValuePairs = (input) => {
	const parseKey = (input$1, raw = input$1) => {
		if (input$1.length === 0) return {
			value: "",
			end: 0
		};
		else if (/^\s/.test(input$1)) {
			const { value: value$1, end: end$1 } = parseKey(input$1.slice(1), raw);
			return {
				value: value$1,
				end: end$1 + 1
			};
		}
		let value = "";
		let end = 0;
		if (input$1[0] === "'" || input$1[0] === "\"") {
			const slice = input$1.slice(1);
			const index = slice.indexOf(input$1[0]);
			if (index === -1 || !slice.slice(index + 1).startsWith("=")) throw new Error(`Failed to parse key from input: ${raw}`);
			value = slice.slice(0, index);
			end = 1 + index + 2;
		} else {
			for (const char of input$1) {
				if (char === "=") break;
				end += 1;
			}
			value = input$1.slice(0, end);
			end += 1;
		}
		return {
			value,
			end
		};
	};
	const parseValue = (input$1, raw = input$1) => {
		if (input$1.length === 0) return {
			value: "",
			end: 0
		};
		let value = "";
		let end = 0;
		if (input$1[0] === "'" || input$1[0] === "\"") {
			const slice = input$1.slice(1);
			const index = slice.indexOf(input$1[0]);
			if (index === -1 || slice.slice(index + 1).length !== 0 && !/^\s/.test(slice.slice(index + 1))) throw new Error(`Failed to parse value from input: ${raw}`);
			value = slice.slice(0, index);
			end = 1 + index + 1;
		} else {
			for (const char of input$1) {
				if (/\s/.test(char)) break;
				end += 1;
			}
			value = input$1.slice(0, end);
			end += 1;
		}
		return {
			value,
			end
		};
	};
	const pairs = {};
	let offset = 0;
	while (offset < input.length) {
		const key = parseKey(input.slice(offset), input);
		offset += key.end;
		const value = parseValue(input.slice(offset), input);
		offset += value.end;
		pairs[key.value] = value.value;
		if (/^\s*$/.test(input.slice(offset))) break;
	}
	return pairs;
};
const parseValueToBoolean = (value, defaultValue) => {
	const str = String(value).trim().toLowerCase();
	if (/^(?:y|yes|true|1|on)$/.test(str)) return true;
	if (/^(?:n|no|false|0|off)$/.test(str)) return false;
	return defaultValue;
};

//#endregion
//#region src/common/promise.ts
const sleep = (ms, callback) => new Promise((resolve) => {
	setTimeout(async () => {
		await callback?.();
		resolve();
	}, ms);
});
const createSingleton = (fn) => {
	let p;
	const wrapper = () => {
		if (!p) p = fn();
		return p;
	};
	wrapper.reset = async () => {
		const prev = p;
		p = void 0;
		if (prev) await prev;
	};
	return wrapper;
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
const createLock = () => {
	const locks = [];
	return {
		async run(fn) {
			const p = fn();
			locks.push(p);
			try {
				return await p;
			} finally {
				const index = locks.indexOf(p);
				if (index >= 0) locks.splice(index, 1);
			}
		},
		async wait() {
			await Promise.allSettled(locks);
		},
		isWaiting() {
			return locks.length > 0;
		},
		clear() {
			locks.length = 0;
		}
	};
};
const PromiseWithResolvers = () => {
	if (t$1(Promise.withResolvers)) return Promise.withResolvers();
	let resolve;
	let reject;
	return {
		promise: new Promise((_resolve, _reject) => {
			resolve = _resolve;
			reject = _reject;
		}),
		resolve,
		reject
	};
};

//#endregion
//#region src/common/string.ts
const REGEXP_WHITESPACE = /^\s*$/;
const addPrefix = (prefix, str) => {
	if (str.startsWith(prefix)) return str;
	return prefix + str;
};
const addSuffix = (suffix, str) => {
	if (str.endsWith(suffix)) return str;
	return str + suffix;
};
const removePrefix = (prefix, str) => {
	if (!str.startsWith(prefix)) return str;
	return str.slice(prefix.length);
};
const removeSuffix = (suffix, str) => {
	if (!str.endsWith(suffix)) return str;
	return str.slice(0, -suffix.length);
};
const join = (separator, ...paths) => {
	let pathname = "";
	for (const path of paths) {
		const part = removeSuffix(separator, removePrefix(separator, path));
		if (part) pathname += pathname ? separator + part : part;
	}
	return pathname;
};
const split = (separator, path) => {
	const paths = [];
	let part = "";
	for (const char of path) if (char === separator) {
		part && paths.push(part);
		part = "";
	} else part += char;
	part && paths.push(part);
	return paths;
};
const toForwardSlash = (str) => str.replace(/\\/g, "/");
const joinWithSlash = (...paths) => join("/", ...paths);
const splitWithSlash = (path) => split("/", path);
const concatTemplateStrings = (template$1, values) => template$1.reduce((acc, part, index) => acc + part + (values[index] ?? ""), "");
function unindent(template$1, ...values) {
	const lines = (t(template$1) ? template$1 : concatTemplateStrings(template$1, values)).split("\n");
	const whitespaceLines = lines.map((line) => REGEXP_WHITESPACE.test(line));
	const commonIndent = lines.reduce((min, line, idx) => {
		if (whitespaceLines[idx]) return min;
		const indent = line.match(/^\s*/)?.[0].length;
		return indent === void 0 ? min : Math.min(min, indent);
	}, Number.POSITIVE_INFINITY);
	let emptyLinesHead = 0;
	while (emptyLinesHead < lines.length && whitespaceLines[emptyLinesHead]) emptyLinesHead += 1;
	let emptyLinesTail = 0;
	while (emptyLinesTail < lines.length && whitespaceLines[lines.length - emptyLinesTail - 1]) emptyLinesTail += 1;
	return lines.slice(emptyLinesHead, lines.length - emptyLinesTail).map((line) => line.slice(commonIndent)).join("\n");
}
function template(str, ...args) {
	const [firstArg, fallback] = args;
	if (r(firstArg)) {
		const mapping = firstArg;
		return str.replace(/\{(\w+)\}/g, (_, key) => mapping[key] || ((t$1(fallback) ? fallback(key) : fallback) ?? key));
	} else return str.replace(/\{(\d+)\}/g, (_, key) => {
		const index = Number(key);
		if (Number.isNaN(index)) return key;
		return args[index];
	});
}

//#endregion
//#region src/common/shell.ts
const REGEXP_NULL_CHAR = /\x00+/g;
const REGEXP_SAFE_CHARS = /^[A-Za-z0-9,:=_./-]+$/;
const REGEXP_SINGLE_QUOTES = /'+/g;
const noop = () => {};
const pipeToStdout = (chunk) => process.stdout.write(chunk);
const pipeToStderr = (chunk) => process.stderr.write(chunk);
async function $(cmd, ...values) {
	const { spawn } = await import("node:child_process");
	const [command, options] = t(cmd) ? [cmd, values[0] || {}] : [concatTemplateStrings(cmd, values), {}];
	const onStdout = options.onStdout === "ignore" ? noop : options.onStdout === "print" ? pipeToStdout : options.onStdout || noop;
	const onStderr = options.onStderr === "ignore" ? noop : options.onStderr === "print" ? pipeToStderr : options.onStderr || noop;
	const fn = async () => {
		const { promise, reject, resolve } = PromiseWithResolvers();
		const child = spawn(command, {
			shell: true,
			stdio: [
				"inherit",
				"pipe",
				"pipe"
			]
		});
		let stdout = "";
		let stderr = "";
		child.stdout?.on("data", (data) => {
			const chunk = data.toString();
			stdout += chunk;
			onStdout(chunk);
		});
		child.stderr?.on("data", (data) => {
			const chunk = data.toString();
			stderr += chunk;
			onStderr(chunk);
		});
		child.on("error", reject);
		child.on("close", (code) => {
			if (code === 0) resolve({
				stdout: stdout.trim(),
				stderr: stderr.trim()
			});
			else reject(/* @__PURE__ */ new Error(`Command exited with code ${code}`));
		});
		return await promise;
	};
	return (await Result.fromCallable(fn, Error)).context(`Failed to execute command: ${cmd}`);
}
const quoteShellArg = (arg) => {
	if (!arg) return "''";
	const cleaned = String(arg).replace(REGEXP_NULL_CHAR, "");
	if (REGEXP_SAFE_CHARS.exec(cleaned)?.[0].length === cleaned.length) return cleaned;
	return `'${cleaned.replace(REGEXP_SINGLE_QUOTES, (matched) => matched.length === 1 ? `'\\''` : `'"${matched}"'`)}'`.replace(/^''/, "").replace(/''$/, "");
};

//#endregion
//#region src/common/throttle.ts
const wrap = (fn, wait, options) => {
	const { leading, trailing } = options;
	let timerId;
	const wrapped = (...args) => {
		if (l(timerId)) return;
		timerId = globalThis.setTimeout(() => {
			timerId = void 0;
			trailing && fn(...args);
		}, wait);
		leading && fn(...args);
	};
	wrapped.cancel = () => {
		if (l(timerId)) globalThis.clearTimeout(timerId);
		timerId = void 0;
	};
	return wrapped;
};
const debounce = (fn, wait = 0, options = {}) => {
	const { leading = false, trailing = true } = options;
	return wrap(fn, wait, {
		leading,
		trailing
	});
};
const throttle = (fn, wait = 0, options = {}) => {
	const { leading = true, trailing = true } = options;
	return wrap(fn, wait, {
		leading,
		trailing
	});
};

//#endregion
export { $, Err, Ok, PromiseWithResolvers, Result, __commonJS, __toESM, addPrefix, addSuffix, concatTemplateStrings, createLock, createSingleton, debounce, err, errorToMessage, getErrorMessage, join, joinWithSlash, linear, normalizeError, ok, parseKeyValuePairs, parseValueToBoolean, quoteShellArg, removePrefix, removeSuffix, safeParse, safeTry, scale, sleep, split, splitWithSlash, stringify, template, throttle, toForwardSlash, unindent, unsafeParse };