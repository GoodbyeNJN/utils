import { isFunction, isPlainObject, isString } from "@/remeda";

const REGEXP_WHITESPACE = /^\s*$/;

export const addPrefix = (prefix: string, str: string) => {
    if (str.startsWith(prefix)) {
        return str;
    }

    return prefix + str;
};

export const addSuffix = (suffix: string, str: string) => {
    if (str.endsWith(suffix)) {
        return str;
    }

    return str + suffix;
};

export const removePrefix = (prefix: string, str: string) => {
    if (!str.startsWith(prefix)) {
        return str;
    }

    return str.slice(prefix.length);
};

export const removeSuffix = (suffix: string, str: string) => {
    if (!str.endsWith(suffix)) {
        return str;
    }

    return str.slice(0, -suffix.length);
};

export const join = (separator: string, ...paths: string[]) => {
    let pathname = "";
    for (const path of paths) {
        const part = removeSuffix(separator, removePrefix(separator, path));

        if (part) {
            pathname += pathname ? separator + part : part;
        }
    }

    return pathname;
};
export const split = (separator: string, path: string) => {
    const paths = [];

    let part = "";
    for (const char of path) {
        if (char === separator) {
            part && paths.push(part);
            part = "";
        } else {
            part += char;
        }
    }

    part && paths.push(part);

    return paths;
};

export const toForwardSlash = (str: string) => str.replace(/\\/g, "/");
export const joinWithSlash = (...paths: string[]) => join("/", ...paths);
export const splitWithSlash = (path: string) => split("/", path);

export const concatTemplateStrings = (template: TemplateStringsArray, values: any[]) =>
    template.reduce((acc, part, index) => acc + part + (values[index] ?? ""), "");

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
export function unindent(template: string): string;
export function unindent(template: TemplateStringsArray, ...values: any[]): string;
export function unindent(template: string | TemplateStringsArray, ...values: any[]) {
    const string = isString(template) ? template : concatTemplateStrings(template, values);
    const lines = string.split("\n");
    const whitespaceLines = lines.map(line => REGEXP_WHITESPACE.test(line));

    const commonIndent = lines.reduce((min, line, idx) => {
        if (whitespaceLines[idx]) return min;
        const indent = line.match(/^\s*/)?.[0].length;
        return indent === undefined ? min : Math.min(min, indent);
    }, Number.POSITIVE_INFINITY);

    let emptyLinesHead = 0;
    while (emptyLinesHead < lines.length && whitespaceLines[emptyLinesHead]) {
        emptyLinesHead += 1;
    }

    let emptyLinesTail = 0;
    while (emptyLinesTail < lines.length && whitespaceLines[lines.length - emptyLinesTail - 1]) {
        emptyLinesTail += 1;
    }

    return lines
        .slice(emptyLinesHead, lines.length - emptyLinesTail)
        .map(line => line.slice(commonIndent))
        .join("\n");
}

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
export function template(
    str: string,
    mapping: Record<string | number, any>,
    fallback?: string | ((key: string) => string),
): string;
export function template(
    str: string,
    ...args: (string | number | bigint | undefined | null)[]
): string;
export function template(str: string, ...args: any[]): string {
    const [firstArg, fallback] = args;

    if (isPlainObject(firstArg)) {
        const mapping = firstArg as Record<string, any>;
        return str.replace(
            /\{(\w+)\}/g,
            (_, key) => mapping[key] || ((isFunction(fallback) ? fallback(key) : fallback) ?? key),
        );
    } else {
        return str.replace(/\{(\d+)\}/g, (_, key) => {
            const index = Number(key);
            if (Number.isNaN(index)) {
                return key;
            }

            return args[index];
        });
    }
}
