/* eslint-disable @typescript-eslint/no-this-alias */

type Range = [number, number];

class Chunk {
    current: string;
    original: string;

    currentRange: Range;
    originalRange: Range;

    edited = false;

    prev: Chunk | undefined;
    next: Chunk | undefined;

    constructor(content: string, range: Range) {
        this.current = content;
        this.original = content;

        this.currentRange = [...range];
        this.originalRange = [...range];
    }

    iter(fn: (chunk: Chunk) => Chunk | undefined) {
        let chunk: Chunk | undefined = this;
        while (chunk) {
            chunk = fn(chunk);
        }
    }

    iterNext(fn: (chunk: Chunk) => boolean | void) {
        this.iter(chunk => {
            const result = fn(chunk);
            if (result === false) return;

            return chunk.next;
        });
    }

    iterPrev(fn: (chunk: Chunk) => boolean | void) {
        this.iter(chunk => {
            const result = fn(chunk);
            if (result === false) return;

            return chunk.prev;
        });
    }

    contains(index: number) {
        return this.originalRange[0] < index && index < this.originalRange[1];
    }

    clone() {
        const chunk = new Chunk(this.original, this.originalRange);

        chunk.current = this.current;
        chunk.currentRange = [...this.currentRange];

        chunk.edited = this.edited;

        return chunk;
    }

    edit(content: string) {
        this.current = content;
        this.currentRange = [this.originalRange[0], content.length + 1];

        this.edited = true;

        return this;
    }

    reset() {
        if (!this.edited) return;

        this.current = this.original;
        this.currentRange = [...this.originalRange];

        this.edited = false;
    }

    append(content: string) {
        const prev = new Chunk(this.start, this.start, "");

        prev.start = this.start;
        prev.end = this.start;
        prev.content = content;

        prev.edited = true;

        prev.next = this;
        this.prev = prev;
    }

    split(index: number) {
        const offset = index - this.start;

        const before = this.original.slice(0, offset);
        const after = this.original.slice(offset);

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
            this.current = "";
        } else {
            this.current = before;
        }
        this.end = index;

        this.next = next;
        next.next = this.next;
        next.prev = this;
        if (next.next) {
            next.next.prev = next;
        }

        return next;
    }

    toString() {
        return this.prefix + this.current + this.suffix;
    }
}

export class MagicString {
    intro = "";
    original: string;
    outro = "";
    offset: number;

    firstChunk: Chunk;
    lastChunk: Chunk;
    lastSearchedChunk: Chunk;
    byStart: Chunk[] = [];
    byEnd: Chunk[] = [];

    constructor(string: string, offset = 0) {
        this.original = string;
        this.offset = offset;

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
        const offset = this.offset + index;

        this.split(offset);

        const chunk = this.byEnd[offset];

        if (chunk) {
            chunk.appendPrefix(content);
        } else {
            this.intro += content;
        }
        return this;
    }

    appendSuffix(index: number, content: string) {
        const offset = this.offset + index;

        if (typeof content !== "string") {
            throw new TypeError("inserted content must be a string");
        }

        this.split(offset);

        const chunk = this.byStart[offset];

        if (chunk) {
            chunk.appendSuffix(content);
        } else {
            this.outro += content;
        }
        return this;
    }

    prependPrefix(index: number, content: string) {
        const offset = index + this.offset;

        if (typeof content !== "string") {
            throw new TypeError("inserted content must be a string");
        }

        this.split(offset);

        const chunk = this.byEnd[offset];

        if (chunk) {
            chunk.prependPrefix(content);
        } else {
            this.intro = content + this.intro;
        }
        return this;
    }

    prependSuffix(index: number, content: string) {
        const offset = index + this.offset;

        if (typeof content !== "string") {
            throw new TypeError("inserted content must be a string");
        }

        this.split(offset);

        const chunk = this.byStart[offset];

        if (chunk) {
            chunk.prependSuffix(content);
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
        if (chunk.edited && chunk.current.length) {
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
