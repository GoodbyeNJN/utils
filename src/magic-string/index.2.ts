/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-this-alias */

class Chunk {
    original: string;

    prefix = "";
    suffix = "";
    edited = false;

    prev: this | undefined;
    next: this | undefined;

    constructor(
        public start: number,
        public end: number,
        public content: string,
    ) {
        this.original = content;
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

    iterNext(fn: (chunk: this) => boolean | void) {
        this.iter(chunk => {
            const result = fn(chunk);
            if (result === false) return;

            return chunk.next;
        });
    }

    iterPrev(fn: (chunk: this) => boolean | void) {
        this.iter(chunk => {
            const result = fn(chunk);
            if (result === false) return;

            return chunk.prev;
        });
    }

    clone() {
        const chunk = new Chunk(this.start, this.end, this.original) as this;

        chunk.prefix = this.prefix;
        chunk.suffix = this.suffix;
        chunk.content = this.content;
        chunk.edited = this.edited;

        return chunk;
    }

    edit(content: string, noFix?: boolean) {
        this.content = content;

        if (!noFix) {
            this.prefix = "";
            this.suffix = "";
        }

        this.edited = true;

        return this;
    }

    reset() {
        this.prefix = "";
        this.suffix = "";
        if (this.edited) {
            this.content = this.original;
            this.edited = false;
        }
    }

    appendSuffix(content: string) {
        this.suffix = this.suffix + content;
    }

    appendPrefix(content: string) {
        this.prefix = this.prefix + content;
    }

    prependSuffix(content: string) {
        this.suffix = content + this.suffix;
    }

    prependPrefix(content: string) {
        this.prefix = content + this.prefix;
    }

    trimStart(rx: string | RegExp) {
        this.prefix = this.prefix.replace(rx, "");
        if (this.prefix.length) return true;

        const trimmed = this.content.replace(rx, "");

        if (!trimmed.length) {
            this.edit("", true);

            this.suffix = this.suffix.replace(rx, "");
            if (this.suffix.length) return true;

            return false;
        }

        if (trimmed !== this.content) {
            const next = this.split(this.end - trimmed.length);
            if (this.edited) {
                // save the change, if it has been edited
                next.edit(trimmed, true);
            }
            this.edit("", true);
        }

        return true;
    }

    trimEnd(rx: string | RegExp) {
        this.suffix = this.suffix.replace(rx, "");
        if (this.suffix.length) return true;

        const trimmed = this.content.replace(rx, "");

        if (!trimmed.length) {
            this.edit("", true);

            this.prefix = this.prefix.replace(rx, "");
            if (this.prefix.length) return true;

            return false;
        }

        if (trimmed !== this.content) {
            const next = this.split(this.start + trimmed.length);
            if (this.edited) {
                // save the change, if it has been edited
                this.edit(trimmed, true);
            }
            next.edit("", true);
        }

        return true;
    }

    split(index: number) {
        const sliceIndex = index - this.start;

        const before = this.original.slice(0, sliceIndex);
        const after = this.original.slice(sliceIndex);

        const next = new Chunk(index, this.end, after);

        this.original = before;
        if (this.edited) {
            // after split we should save the edit content record into the correct chunk
            // to make sure sourcemap correct
            // For example:
            // '  test'.trim()
            //     split   -> '  ' + 'test'
            //   ✔️ edit    -> '' + 'test'
            //   ✖️ edit    -> 'test' + ''
            // TODO is this block necessary?...
            next.edit("");
            this.content = "";
        } else {
            this.content = before;
        }
        this.suffix = "";
        this.end = index;

        next.suffix = this.suffix;

        this.next = next as this;
        next.next = this.next;
        next.prev = this;
        if (next.next) {
            next.next.prev = next;
        }

        return next;
    }

    toString() {
        return this.prefix + this.content + this.suffix;
    }
}

export class MagicString {
    intro = "";
    original: string;
    outro = "";

    firstChunk: Chunk;
    lastChunk: Chunk;
    lastSearchedChunk: Chunk;
    byStart: Chunk[] = [];
    byEnd: Chunk[] = [];

    constructor(
        string: string,
        public offset = 0,
    ) {
        this.original = string;

        const chunk = new Chunk(0, string.length, string);

        this.firstChunk = chunk;
        this.lastChunk = chunk;
        this.lastSearchedChunk = chunk;

        this.byStart[0] = chunk;
        this.byEnd[string.length] = chunk;
    }

    append(content: string) {
        this.outro += content;

        return this;
    }

    prepend(content: string) {
        this.intro = content + this.intro;

        return this;
    }

    appendPrefix(index: number, content: string) {
        index = index + this.offset;

        this.split(index);

        const chunk = this.byEnd[index];

        if (chunk) {
            chunk.appendPrefix(content);
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
}
