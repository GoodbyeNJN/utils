import { isArray, isBoolean, isFunction, isNumber, isPlainObject, isString } from "@/remeda";

const REGEXP_WHITESPACE_ONLY = /^\s*$/;
const REGEXP_WHITESPACE_PREFIX = /^\s*/;

export const addPrefix = (prefix: string, str: string): string => {
    if (str.startsWith(prefix)) {
        return str;
    }

    return prefix + str;
};

export const addSuffix = (suffix: string, str: string): string => {
    if (str.endsWith(suffix)) {
        return str;
    }

    return str + suffix;
};

export const removePrefix = (prefix: string, str: string): string => {
    if (!str.startsWith(prefix)) {
        return str;
    }

    return str.slice(prefix.length);
};

export const removeSuffix = (suffix: string, str: string): string => {
    if (!str.endsWith(suffix)) {
        return str;
    }

    return str.slice(0, -suffix.length);
};

export const join = (separator: string, ...paths: string[]): string => {
    let pathname = "";
    for (const path of paths) {
        const part = removeSuffix(separator, removePrefix(separator, path));

        if (part) {
            pathname += pathname ? separator + part : part;
        }
    }

    return pathname;
};
export const split = (separator: string, path: string): string[] => {
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

export const toForwardSlash = (str: string): string => str.replace(/\\/g, "/");
export const joinWithSlash = (...paths: string[]): string => join("/", ...paths);
export const splitWithSlash = (path: string): string[] => split("/", path);

export const splitByLineBreak = (str: string): string[] => str.split(/\r?\n/);

export const concatTemplateStrings = (template: TemplateStringsArray, values: any[]): string =>
    template.reduce((acc, part, index) => acc + part + (values[index] ?? ""), "");

interface StringOrTemplateFunction {
    (str: string): string;
    (template: TemplateStringsArray, ...values: any[]): string;
}

interface UnindentFunction extends StringOrTemplateFunction {
    (trimStart?: boolean, trimEnd?: boolean): StringOrTemplateFunction;
}

/**
 * @example
 * ```ts
 * // Default behavior: trim both start and end
 * const str1 = unindent`
 *   if (a) {
 *     b()
 *   }
 * `;
 *
 * // Factory function: custom trim behavior
 * const str2 = unindent(false, false)`
 *   if (a) {
 *     b()
 *   }
 * `;
 *
 * // Only trim start, keep end
 * const str3 = unindent(true, false)("  hello\n  world\n");
 * ```
 */
export const unindent: UnindentFunction = (...params): any => {
    let trimStart = true;
    let trimEnd = true;
    const unindentImpl: StringOrTemplateFunction = (...params) => {
        const string = isString(params[0])
            ? params[0]
            : concatTemplateStrings(params[0], params.slice(1));
        const lines = splitByLineBreak(string);

        // Find whitespace lines and common indent
        let commonIndent = Number.POSITIVE_INFINITY;
        let firstContentLine = -1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]!;
            const isWhitespaceLine = REGEXP_WHITESPACE_ONLY.test(line);
            if (isWhitespaceLine) continue;

            if (firstContentLine === -1) {
                firstContentLine = i;
            }

            const indent = line.match(REGEXP_WHITESPACE_PREFIX)?.[0].length ?? 0;
            commonIndent = Math.min(commonIndent, indent);
        }

        // Set commonIndent to 0 if no content lines found
        if (firstContentLine === -1) {
            commonIndent = 0;
        }

        // Ensure commonIndent is finite
        if (!Number.isFinite(commonIndent)) {
            commonIndent = 0;
        }

        // Calculate start and end indices for trimming
        let startIndex = 0;
        let endIndex = lines.length;

        // If trimStart is true, skip leading whitespace-only lines
        if (trimStart) {
            while (startIndex < lines.length && REGEXP_WHITESPACE_ONLY.test(lines[startIndex]!)) {
                startIndex++;
            }
        }

        // If trimEnd is true, skip trailing whitespace-only lines
        if (trimEnd) {
            while (endIndex > startIndex && REGEXP_WHITESPACE_ONLY.test(lines[endIndex - 1]!)) {
                endIndex--;
            }
        }

        return lines
            .slice(startIndex, endIndex)
            .map(line => line.slice(commonIndent))
            .join("\n");
    };

    // Factory function mode: unindent(trimStart?, trimEnd?)
    if (
        (isBoolean(params[0]) || params[0] === undefined) &&
        (isBoolean(params[1]) || params[1] === undefined)
    ) {
        trimStart = params[0] !== false;
        trimEnd = params[1] !== false;

        return unindentImpl;
    }

    // Direct call mode
    if (isString(params[0]) || isArray(params[0])) {
        return unindentImpl(...(params as [any]));
    }

    throw new TypeError("Invalid arguments.");
};

interface IndentFunction {
    (indentNumber: number, trimStart?: boolean, trimEnd?: boolean): StringOrTemplateFunction;
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    (indentString: string, trimStart?: boolean, trimEnd?: boolean): StringOrTemplateFunction;
}

/**
 * @example
 * ```ts
 * // Using indent count with default space character
 * const str1 = indent(2)`
 *   if (a) {
 *     b()
 *   }
 * `;
 *
 * // Using custom indent string directly
 * const str2 = indent(">>")`
 *   if (a) {
 *     b()
 *   }
 * `;
 *
 * // Only trim start, keep end
 * const str3 = indent(2, true, false)("hello\nworld\n");
 * ```
 */
export const indent: IndentFunction = (...params) => {
    let indentString: string;
    let trimStart = true;
    let trimEnd = true;

    const indentImpl: StringOrTemplateFunction = (...params) => {
        const string = isString(params[0])
            ? params[0]
            : concatTemplateStrings(params[0], params.slice(1));
        const lines = splitByLineBreak(string);
        const whitespaceLines = lines.map(line => REGEXP_WHITESPACE_ONLY.test(line));

        // Calculate start and end indices for trimming
        let startIndex = 0;
        let endIndex = lines.length;

        // If trimStart is true, skip leading whitespace-only lines
        if (trimStart) {
            while (startIndex < lines.length && whitespaceLines[startIndex]!) {
                startIndex++;
            }
        }

        // If trimEnd is true, skip trailing whitespace-only lines
        if (trimEnd) {
            while (endIndex > startIndex && whitespaceLines[endIndex - 1]!) {
                endIndex--;
            }
        }

        return lines
            .slice(startIndex, endIndex)
            .map((line, index) => {
                const originalIndex = index + startIndex;
                return whitespaceLines[originalIndex] ? line : indentString + line;
            })
            .join("\n");
    };

    // indent(_, trimStart?, trimEnd?)
    if (
        (isBoolean(params[1]) || params[1] === undefined) &&
        (isBoolean(params[2]) || params[2] === undefined)
    ) {
        trimStart = params[1] !== false;
        trimEnd = params[2] !== false;
    }

    // indent(indentNumber)
    if (isNumber(params[0])) {
        indentString = " ".repeat(params[0]);

        return indentImpl;
    }

    // indent(indentString)
    if (isString(params[0])) {
        indentString = params[0];

        return indentImpl;
    }

    throw new TypeError("Invalid arguments.");
};

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
