/* eslint-disable complexity */
/* eslint-disable max-depth */
/* eslint-disable max-params */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-this-alias */

import { isDefined, isNonNull, isString } from "@/remeda";

const guessIndent = (code: string) => {
    const lines = code.split("\n");

    const tabbed = lines.filter(line => /^\t+/.test(line));
    const spaced = lines.filter(line => /^ {2,}/.test(line));

    if (tabbed.length === 0 && spaced.length === 0) {
        return null;
    }

    // More lines tabbed than spaced? Assume tabs, and
    // default to tabs in the case of a tie (or nothing
    // to go on)
    if (tabbed.length >= spaced.length) {
        return "\t";
    }

    // Otherwise, we need to guess the multiple
    const min = spaced.reduce((previous, current) => {
        const numSpaces = /^ +/.exec(current)![0].length;
        return Math.min(numSpaces, previous);
    }, Infinity);

    return " ".repeat(min);
};

const getLocator = (source: string) => {
    const originalLines = source.split("\n");
    const lineOffsets: number[] = [];

    for (let i = 0, pos = 0; i < originalLines.length; i++) {
        lineOffsets.push(pos);
        pos += originalLines[i]!.length + 1;
    }

    return (index: number) => {
        let i = 0;
        let j = lineOffsets.length;
        while (i < j) {
            const m = (i + j) >> 1;
            if (index < lineOffsets[m]!) {
                j = m;
            } else {
                i = m + 1;
            }
        }
        const line = i - 1;
        const column = index - lineOffsets[line]!;
        return { line, column };
    };
};

const n = "\n";

class Chunk {
    start: number;
    end: number;
    original: string;
    content: string;

    intro = "";
    outro = "";
    edited = false;

    previous: this | undefined;
    next: this | undefined;

    constructor(start: number, end: number, content: string) {
        this.start = start;
        this.end = end;
        this.original = content;
        this.content = content;
    }

    appendLeft(content: string) {
        this.outro += content;
    }

    appendRight(content: string) {
        this.intro = this.intro + content;
    }

    clone() {
        const chunk = new Chunk(this.start, this.end, this.original) as this;

        chunk.intro = this.intro;
        chunk.outro = this.outro;
        chunk.content = this.content;
        chunk.edited = this.edited;

        return chunk;
    }

    contains(index: number) {
        return this.start < index && index < this.end;
    }

    iter(fn: (chunk: this) => this | undefined) {
        let chunk: this | undefined = this;
        while (chunk) {
            chunk = fn(chunk);
        }
    }

    eachNext(fn: (chunk: this) => boolean | void) {
        this.iter(chunk => {
            const result = fn(chunk);
            if (result === false) return;

            return chunk.next;
        });
    }

    eachPrevious(fn: (chunk: this) => boolean | void) {
        this.iter(chunk => {
            const result = fn(chunk);
            if (result === false) return;

            return chunk.previous;
        });
    }

    edit(content: string, contentOnly?: boolean) {
        this.content = content;
        if (!contentOnly) {
            this.intro = "";
            this.outro = "";
        }

        this.edited = true;

        return this;
    }

    prependLeft(content: string) {
        this.outro = content + this.outro;
    }

    prependRight(content: string) {
        this.intro = content + this.intro;
    }

    reset() {
        this.intro = "";
        this.outro = "";
        if (this.edited) {
            this.content = this.original;
            this.edited = false;
        }
    }

    split(index: number) {
        const sliceIndex = index - this.start;

        const originalBefore = this.original.slice(0, sliceIndex);
        const originalAfter = this.original.slice(sliceIndex);

        this.original = originalBefore;

        const newChunk = new Chunk(index, this.end, originalAfter) as this;
        newChunk.outro = this.outro;
        this.outro = "";

        this.end = index;

        if (this.edited) {
            // after split we should save the edit content record into the correct chunk
            // to make sure sourcemap correct
            // For example:
            // '  test'.trim()
            //     split   -> '  ' + 'test'
            //   ✔️ edit    -> '' + 'test'
            //   ✖️ edit    -> 'test' + ''
            // TODO is this block necessary?...
            newChunk.edit("");
            this.content = "";
        } else {
            this.content = originalBefore;
        }

        newChunk.next = this.next;
        if (newChunk.next) newChunk.next.previous = newChunk;
        newChunk.previous = this;
        this.next = newChunk;

        return newChunk;
    }

    toString() {
        return this.intro + this.content + this.outro;
    }

    trimEnd(rx: string | RegExp) {
        this.outro = this.outro.replace(rx, "");
        if (this.outro.length) return true;

        const trimmed = this.content.replace(rx, "");

        if (trimmed.length) {
            if (trimmed !== this.content) {
                this.split(this.start + trimmed.length).edit("", true);
                if (this.edited) {
                    // save the change, if it has been edited
                    this.edit(trimmed, true);
                }
            }
            return true;
        } else {
            this.edit("", true);

            this.intro = this.intro.replace(rx, "");
            if (this.intro.length) return true;
        }

        return false;
    }

    trimStart(rx: string | RegExp) {
        this.intro = this.intro.replace(rx, "");
        if (this.intro.length) return true;

        const trimmed = this.content.replace(rx, "");

        if (trimmed.length) {
            if (trimmed !== this.content) {
                const newChunk = this.split(this.end - trimmed.length);
                if (this.edited) {
                    // save the change, if it has been edited
                    newChunk.edit(trimmed, true);
                }
                this.edit("", true);
            }
            return true;
        } else {
            this.edit("", true);

            this.outro = this.outro.replace(rx, "");
            if (this.outro.length) return true;
        }

        return false;
    }
}

export type ExclusionRange = [number, number];

export interface MagicStringOptions {
    filename?: string;
    indentExclusionRanges?: ExclusionRange | ExclusionRange[];
    offset?: number;
}

export interface IndentOptions {
    exclude?: ExclusionRange | ExclusionRange[];
    indentStart?: boolean;
}

export interface OverwriteOptions {
    contentOnly?: boolean;
}

export interface UpdateOptions {
    overwrite?: boolean;
}

export class MagicString {
    original: string;
    outro = "";
    intro = "";

    firstChunk: Chunk;
    lastChunk: Chunk;
    lastSearchedChunk: Chunk;
    byStart: Chunk[] = [];
    byEnd: Chunk[] = [];

    indentExclusionRanges: ExclusionRange | ExclusionRange[];
    indentStr: string | null | undefined;

    offset: number;

    constructor(string: string, options: MagicStringOptions = {}) {
        const chunk = new Chunk(0, string.length, string);

        this.original = string;

        this.firstChunk = chunk;
        this.lastChunk = chunk;
        this.lastSearchedChunk = chunk;

        this.indentExclusionRanges = options.indentExclusionRanges || [];
        this.offset = options.offset || 0;

        this.byStart[0] = chunk;
        this.byEnd[string.length] = chunk;
    }

    append(content: string) {
        if (typeof content !== "string") throw new TypeError("outro content must be a string");

        this.outro += content;
        return this;
    }

    appendLeft(index: number, content: string) {
        index = index + this.offset;

        if (typeof content !== "string") throw new TypeError("inserted content must be a string");

        this.split(index);

        const chunk = this.byEnd[index];

        if (chunk) {
            chunk.appendLeft(content);
        } else {
            this.intro += content;
        }
        return this;
    }

    appendRight(index: number, content: string) {
        index = index + this.offset;

        if (typeof content !== "string") throw new TypeError("inserted content must be a string");

        this.split(index);

        const chunk = this.byStart[index];

        if (chunk) {
            chunk.appendRight(content);
        } else {
            this.outro += content;
        }
        return this;
    }

    clone() {
        const cloned = new MagicString(this.original, {
            offset: this.offset,
        });

        let clonedChunk = this.firstChunk.clone();
        cloned.firstChunk = clonedChunk;
        cloned.lastSearchedChunk = clonedChunk;

        this.firstChunk.eachNext(chunk => {
            cloned.byStart[clonedChunk.start] = clonedChunk;
            cloned.byEnd[clonedChunk.end] = clonedChunk;

            const nextClonedChunk = chunk.next?.clone();

            if (nextClonedChunk) {
                clonedChunk.next = nextClonedChunk;
                nextClonedChunk.previous = clonedChunk;

                clonedChunk = nextClonedChunk;
            }
        });

        cloned.lastChunk = clonedChunk;

        if (this.indentExclusionRanges) {
            cloned.indentExclusionRanges = [...this.indentExclusionRanges];
        }

        cloned.intro = this.intro;
        cloned.outro = this.outro;

        return cloned;
    }

    private ensureIndentStr() {
        if (isDefined(this.indentStr)) return;

        this.indentStr = guessIndent(this.original);
    }

    getIndentString() {
        this.ensureIndentStr();
        return isNonNull(this.indentStr) ? this.indentStr : "\t";
    }

    indent(indentStr?: string, options?: IndentOptions) {
        const pattern = /^[^\r\n]/gm;

        if (typeof indentStr === "object") {
            options = indentStr;
            indentStr = undefined;
        }

        if (!isDefined(indentStr)) {
            this.ensureIndentStr();
            indentStr = this.indentStr || "\t";
        }

        if (indentStr === "") return this; // noop

        options = options || {};

        // Process exclusion ranges
        const isExcluded: boolean[] = [];

        if (options.exclude) {
            const exclusions = (
                typeof options.exclude[0] === "number" ? [options.exclude] : options.exclude
            ) as ExclusionRange[];
            exclusions.forEach(exclusion => {
                for (let i = exclusion[0]; i < exclusion[1]; i += 1) {
                    isExcluded[i] = true;
                }
            });
        }

        let shouldIndentNextCharacter = options.indentStart !== false;
        const replacer: Parameters<String["replace"]>[1] = match => {
            if (shouldIndentNextCharacter) return `${indentStr}${match}`;
            shouldIndentNextCharacter = true;
            return match;
        };

        this.intro = this.intro.replace(pattern, replacer);

        let charIndex = 0;
        let chunk = this.firstChunk;

        while (chunk) {
            const end = chunk.end;

            if (chunk.edited) {
                if (!isExcluded[charIndex]) {
                    chunk.content = chunk.content.replace(pattern, replacer);

                    if (chunk.content.length) {
                        shouldIndentNextCharacter =
                            chunk.content[chunk.content.length - 1] === "\n";
                    }
                }
            } else {
                charIndex = chunk.start;

                while (charIndex < end) {
                    if (!isExcluded[charIndex]) {
                        const char = this.original[charIndex];

                        if (char === "\n") {
                            shouldIndentNextCharacter = true;
                        } else if (char !== "\r" && shouldIndentNextCharacter) {
                            shouldIndentNextCharacter = false;

                            if (charIndex === chunk.start) {
                                chunk.prependRight(indentStr);
                            } else {
                                this.splitChunk(chunk, charIndex);
                                chunk = chunk.next!;
                                chunk.prependRight(indentStr);
                            }
                        }
                    }

                    charIndex += 1;
                }
            }

            charIndex = chunk.end;
            chunk = chunk.next!;
        }

        this.outro = this.outro.replace(pattern, replacer);

        return this;
    }

    move(start: number, end: number, index: number) {
        start = start + this.offset;
        end = end + this.offset;
        index = index + this.offset;

        if (index >= start && index <= end)
            throw new Error("Cannot move a selection inside itself");

        this.split(start);
        this.split(end);
        this.split(index);

        const first = this.byStart[start]!;
        const last = this.byEnd[end]!;

        const oldLeft = first.previous;
        const oldRight = last.next;

        const newRight = this.byStart[index];
        if (!newRight && last === this.lastChunk) return this;
        const newLeft = newRight ? newRight.previous : this.lastChunk;

        if (oldLeft) oldLeft.next = oldRight;
        if (oldRight) oldRight.previous = oldLeft;

        if (newLeft) newLeft.next = first;
        if (newRight) newRight.previous = last;

        if (!first.previous) this.firstChunk = last.next!;
        if (!last.next) {
            this.lastChunk = first.previous!;
            this.lastChunk.next = undefined;
        }

        first.previous = newLeft;
        last.next = newRight;

        if (!newLeft) this.firstChunk = first;
        if (!newRight) this.lastChunk = last;
        return this;
    }

    overwrite(start: number, end: number, content: string, options: OverwriteOptions = {}) {
        return this.update(start, end, content, { ...options, overwrite: !options.contentOnly });
    }

    update(start: number, end: number, content: string, options: UpdateOptions = {}) {
        start = start + this.offset;
        end = end + this.offset;

        if (typeof content !== "string")
            throw new TypeError("replacement content must be a string");

        if (this.original.length !== 0) {
            while (start < 0) start += this.original.length;
            while (end < 0) end += this.original.length;
        }

        if (end > this.original.length) throw new Error("end is out of bounds");
        if (start === end)
            throw new Error(
                "Cannot overwrite a zero-length range – use appendLeft or prependRight instead",
            );

        this.split(start);
        this.split(end);

        const first = this.byStart[start];
        const last = this.byEnd[end];

        if (first) {
            first.eachNext(chunk => {
                if (chunk === last) return false;

                if (chunk.next !== this.byStart[chunk.end]) {
                    throw new Error("Cannot overwrite across a split point");
                }

                chunk.next?.edit("", false);

                return true;
            });

            first.edit(content, !options.overwrite);
        } else {
            // must be inserting at the end
            const newChunk = new Chunk(start, end, "").edit(content);

            // TODO last chunk in the array may not be the last chunk, if it's moved...
            last!.next = newChunk;
            newChunk.previous = last;
        }
        return this;
    }

    prepend(content: string) {
        if (typeof content !== "string") throw new TypeError("outro content must be a string");

        this.intro = content + this.intro;
        return this;
    }

    prependLeft(index: number, content: string) {
        index = index + this.offset;

        if (typeof content !== "string") throw new TypeError("inserted content must be a string");

        this.split(index);

        const chunk = this.byEnd[index];

        if (chunk) {
            chunk.prependLeft(content);
        } else {
            this.intro = content + this.intro;
        }
        return this;
    }

    prependRight(index: number, content: string) {
        index = index + this.offset;

        if (typeof content !== "string") throw new TypeError("inserted content must be a string");

        this.split(index);

        const chunk = this.byStart[index];

        if (chunk) {
            chunk.prependRight(content);
        } else {
            this.outro = content + this.outro;
        }
        return this;
    }

    remove(start: number, end: number) {
        start = start + this.offset;
        end = end + this.offset;

        if (this.original.length !== 0) {
            while (start < 0) start += this.original.length;
            while (end < 0) end += this.original.length;
        }

        if (start === end) return this;

        if (start < 0 || end > this.original.length) throw new Error("Character is out of bounds");
        if (start > end) throw new Error("end must be greater than start");

        this.split(start);
        this.split(end);

        this.byStart[start]!.iter(chunk => {
            chunk.intro = "";
            chunk.outro = "";
            chunk.edit("");

            if (end <= chunk.end) return;

            return this.byStart[chunk.end];
        });

        return this;
    }

    reset(start: number, end: number) {
        start = start + this.offset;
        end = end + this.offset;

        if (this.original.length !== 0) {
            while (start < 0) start += this.original.length;
            while (end < 0) end += this.original.length;
        }

        if (start === end) return this;

        if (start < 0 || end > this.original.length) throw new Error("Character is out of bounds");
        if (start > end) throw new Error("end must be greater than start");

        this.split(start);
        this.split(end);

        this.byStart[start]!.iter(chunk => {
            chunk.reset();

            if (end <= chunk.end) return;

            return this.byStart[chunk.end];
        });

        return this;
    }

    lastChar() {
        if (this.outro.length) return this.outro[this.outro.length - 1];
        let chunk = this.lastChunk;
        do {
            if (chunk.outro.length) return chunk.outro[chunk.outro.length - 1];
            if (chunk.content.length) return chunk.content[chunk.content.length - 1];
            if (chunk.intro.length) return chunk.intro[chunk.intro.length - 1];
        } while ((chunk = chunk.previous!));
        if (this.intro.length) return this.intro[this.intro.length - 1];
        return "";
    }

    lastLine() {
        let lineIndex = this.outro.lastIndexOf(n);
        if (lineIndex !== -1) return this.outro.substring(lineIndex + 1);
        let lineStr = this.outro;
        let chunk = this.lastChunk;
        do {
            if (chunk.outro.length > 0) {
                lineIndex = chunk.outro.lastIndexOf(n);
                if (lineIndex !== -1) return chunk.outro.substring(lineIndex + 1) + lineStr;
                lineStr = chunk.outro + lineStr;
            }

            if (chunk.content.length > 0) {
                lineIndex = chunk.content.lastIndexOf(n);
                if (lineIndex !== -1) return chunk.content.substring(lineIndex + 1) + lineStr;
                lineStr = chunk.content + lineStr;
            }

            if (chunk.intro.length > 0) {
                lineIndex = chunk.intro.lastIndexOf(n);
                if (lineIndex !== -1) return chunk.intro.substring(lineIndex + 1) + lineStr;
                lineStr = chunk.intro + lineStr;
            }
        } while ((chunk = chunk.previous!));
        lineIndex = this.intro.lastIndexOf(n);
        if (lineIndex !== -1) return this.intro.substring(lineIndex + 1) + lineStr;
        return this.intro + lineStr;
    }

    toStringSlice(start = 0, end = this.original.length - this.offset) {
        start = start + this.offset;
        end = end + this.offset;

        if (this.original.length !== 0) {
            while (start < 0) start += this.original.length;
            while (end < 0) end += this.original.length;
        }

        let result = "";

        // find start chunk
        let chunk = this.firstChunk;
        while (chunk && (chunk.start > start || chunk.end <= start)) {
            // found end chunk before start
            if (chunk.start < end && chunk.end >= end) {
                return result;
            }

            chunk = chunk.next!;
        }

        if (chunk && chunk.edited && chunk.start !== start)
            throw new Error(`Cannot use replaced character ${start} as slice start anchor.`);

        const startChunk = chunk;
        while (chunk) {
            if (chunk.intro && (startChunk !== chunk || chunk.start === start)) {
                result += chunk.intro;
            }

            const containsEnd = chunk.start < end && chunk.end >= end;
            if (containsEnd && chunk.edited && chunk.end !== end)
                throw new Error(`Cannot use replaced character ${end} as slice end anchor.`);

            const sliceStart = startChunk === chunk ? start - chunk.start : 0;
            const sliceEnd = containsEnd
                ? chunk.content.length + end - chunk.end
                : chunk.content.length;

            result += chunk.content.slice(sliceStart, sliceEnd);

            if (chunk.outro && (!containsEnd || chunk.end === end)) {
                result += chunk.outro;
            }

            if (containsEnd) {
                break;
            }

            chunk = chunk.next!;
        }

        return result;
    }

    slice(start = 0, end = this.original.length) {
        this.remove(0, start);
        this.remove(end, this.original.length);

        return this;
    }

    private split(index: number) {
        if (this.byStart[index] || this.byEnd[index]) return;

        const searchForward = index > this.lastSearchedChunk.end;
        this.lastSearchedChunk.iter(chunk => {
            if (chunk.contains(index)) {
                this.splitChunk(chunk, index);
                return;
            }

            return searchForward ? this.byStart[chunk.end] : this.byEnd[chunk.start];
        });
    }

    private splitChunk(chunk: Chunk, index: number) {
        if (chunk.edited && chunk.content.length) {
            // zero-length edited chunks are a special case (overlapping replacements)
            const loc = getLocator(this.original)(index);
            throw new Error(
                `Cannot split a chunk that has already been edited (${loc.line}:${loc.column} – "${chunk.original}")`,
            );
        }

        const newChunk = chunk.split(index);

        this.byEnd[index] = chunk;
        this.byStart[index] = newChunk;
        this.byEnd[newChunk.end] = newChunk;

        if (chunk === this.lastChunk) this.lastChunk = newChunk;

        this.lastSearchedChunk = chunk;
        return true;
    }

    toString() {
        let str = this.intro;

        this.firstChunk.eachNext(chunk => {
            str += chunk.toString();
        });

        return str + this.outro;
    }

    isEmpty() {
        let isEmpty = true;

        this.firstChunk.eachNext(chunk => {
            if (
                (chunk.intro.length && chunk.intro.trim()) ||
                (chunk.content.length && chunk.content.trim()) ||
                (chunk.outro.length && chunk.outro.trim())
            ) {
                isEmpty = false;

                return false;
            }

            return true;
        });

        return isEmpty;
    }

    length() {
        let length = 0;

        this.firstChunk.eachNext(chunk => {
            length += chunk.intro.length + chunk.content.length + chunk.outro.length;
        });

        return length;
    }

    trimLines() {
        return this.trim("[\\r\\n]");
    }

    trim(charType?: string) {
        return this.trimStart(charType).trimEnd(charType);
    }

    private trimEndAborted(charType?: string) {
        const rx = new RegExp((charType || "\\s") + "+$");

        this.outro = this.outro.replace(rx, "");
        if (this.outro.length) return;

        this.lastChunk.eachPrevious(chunk => {
            const end = chunk.end;
            const aborted = chunk.trimEnd(rx);

            // if chunk was trimmed, we have a new lastChunk
            if (chunk.end !== end) {
                if (this.lastChunk === chunk) {
                    this.lastChunk = chunk.next!;
                }

                this.byEnd[chunk.end] = chunk;
                this.byStart[chunk.next!.start] = chunk.next!;
                this.byEnd[chunk.next!.end] = chunk.next!;
            }

            return !aborted;
        });
    }

    trimEnd(charType?: string) {
        this.trimEndAborted(charType);
        return this;
    }
    private trimStartAborted(charType?: string) {
        const rx = new RegExp("^" + (charType || "\\s") + "+");

        this.intro = this.intro.replace(rx, "");
        if (this.intro.length) return;

        this.firstChunk.eachNext(chunk => {
            const end = chunk.end;
            const aborted = chunk.trimStart(rx);

            if (chunk.end !== end) {
                // special case...
                if (chunk === this.lastChunk) {
                    this.lastChunk = chunk.next!;
                }

                this.byEnd[chunk.end] = chunk;
                this.byStart[chunk.next!.start] = chunk.next!;
                this.byEnd[chunk.next!.end] = chunk.next!;
            }

            return !aborted;
        });
    }

    trimStart(charType?: string) {
        this.trimStartAborted(charType);
        return this;
    }

    hasChanged() {
        return this.original !== this.toString();
    }

    private replaceRegexp(
        searchValue: RegExp,
        replacement: string | ((substring: string, ...args: any[]) => string),
    ) {
        const getReplacement = (match: RegExpExecArray | RegExpMatchArray, str: string) => {
            if (typeof replacement === "string") {
                return replacement.replace(/\$(\$|&|\d+)/g, (_, i) => {
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter
                    if (i === "$") return "$";
                    if (i === "&") return match[0];
                    const num = Number(i);
                    if (num < match.length) return match[num]!;
                    return `$${i}`;
                });
            } else {
                const [substring, ...patterns] = match;
                return replacement(substring, ...patterns, match.index, str, match.groups);
            }
        };
        const matchAll = (re: RegExp, str: string) => {
            let match;
            const matches = [];
            while ((match = re.exec(str))) {
                matches.push(match);
            }
            return matches;
        };
        if (searchValue.global) {
            const matches = matchAll(searchValue, this.original);
            matches.forEach(match => {
                if (isDefined(match.index)) {
                    const replacement = getReplacement(match, this.original);
                    if (replacement !== match[0]) {
                        this.overwrite(match.index, match.index + match[0].length, replacement);
                    }
                }
            });
        } else {
            const match = this.original.match(searchValue);
            if (match && isDefined(match.index)) {
                const replacement = getReplacement(match, this.original);
                if (replacement !== match[0]) {
                    this.overwrite(match.index, match.index + match[0].length, replacement);
                }
            }
        }
        return this;
    }

    private replaceString(string: string, replacement: string) {
        const { original } = this;
        const index = original.indexOf(string);

        if (index !== -1) {
            this.overwrite(index, index + string.length, replacement);
        }

        return this;
    }

    replace(searchValue: string, replacement: string): this;
    replace(
        searchValue: RegExp,
        replacement: string | ((substring: string, ...args: any[]) => string),
    ): this;
    replace(
        searchValue: string | RegExp,
        replacement: string | ((substring: string, ...args: any[]) => string),
    ) {
        if (isString(searchValue)) {
            if (!isString(replacement)) {
                throw new TypeError("replacement must be a string");
            }

            return this.replaceString(searchValue, replacement);
        }

        return this.replaceRegexp(searchValue, replacement);
    }

    private replaceAllString(string: string, replacement: string) {
        const { original } = this;
        const stringLength = string.length;
        for (
            let index = original.indexOf(string);
            index !== -1;
            index = original.indexOf(string, index + stringLength)
        ) {
            const previous = original.slice(index, index + stringLength);
            if (previous !== replacement) this.overwrite(index, index + stringLength, replacement);
        }

        return this;
    }

    replaceAll(searchValue: string, replacement: string): this;
    replaceAll(
        searchValue: RegExp,
        replacement: string | ((substring: string, ...args: any[]) => string),
    ): this;
    replaceAll(
        searchValue: string | RegExp,
        replacement: string | ((substring: string, ...args: any[]) => string),
    ) {
        if (typeof searchValue === "string") {
            if (!isString(replacement)) {
                throw new TypeError("replacement must be a string");
            }

            return this.replaceAllString(searchValue, replacement);
        }

        if (!searchValue.global) {
            throw new TypeError(
                "MagicString.prototype.replaceAll called with a non-global RegExp argument",
            );
        }

        return this.replaceRegexp(searchValue, replacement);
    }
}
