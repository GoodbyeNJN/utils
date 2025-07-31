class Chunk {
    start: number;
    end: number;

    current: string;
    original: string;

    edited = false;

    prev: Chunk | null = null;
    next: Chunk | null = null;

    constructor(start: number, end: number, content: string) {
        this.start = start;
        this.end = end;

        this.current = content;
        this.original = content;
    }

    iter() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let chunk: Chunk | null = this;

        return {
            *[Symbol.iterator]() {
                while (chunk) {
                    yield chunk;
                    chunk = chunk.next;
                }
            },
        };
    }

    contains(index: number) {
        return this.start < index && index < this.end;
    }

    clone() {
        const chunk = new Chunk(this.start, this.end, this.original);

        chunk.current = this.current;

        chunk.edited = this.edited;

        return chunk;
    }

    reset() {
        if (!this.edited) return;

        this.current = this.original;

        this.edited = false;
    }

    update(content: string) {
        this.current = content;

        this.edited = true;

        return this;
    }

    prepend(content: string) {
        const prev = new Chunk(this.start, this.start, content);

        prev.edited = true;

        prev.next = this;
        this.prev = prev;
    }

    append(content: string) {
        const next = new Chunk(this.end, this.end, content);

        next.edited = true;

        this.next = next;
        next.prev = this;
    }

    split(index: number) {
        const offset = index - this.start;
        const before = this.original.slice(0, offset);
        const after = this.original.slice(offset);

        const next = new Chunk(index, this.end, after);

        this.end = index;
        this.original = before;
        if (this.edited) {
            next.update("");
        } else {
            this.current = before;
        }

        this.next = next;
        next.next = this.next;
        next.prev = this;
        if (next.next) {
            next.next.prev = next;
        }

        return next;
    }

    toString() {
        return this.current;
    }
}

export class MagicString {
    original: string;
    intro = "";
    outro = "";

    offset: number;

    firstChunk: Chunk;
    lastChunk: Chunk;

    constructor(string: string, offset = 0) {
        this.original = string;
        this.offset = offset;

        const chunk = new Chunk(0, string.length, string);

        this.firstChunk = chunk;
        this.lastChunk = chunk;
    }

    prepend(content: string) {
        this.intro = content + this.intro;

        return this;
    }

    append(content: string) {
        this.outro += content;

        return this;
    }

    insert(index: number, content: string) {
        const offset = this.offset + index;
        if (offset <= 0) {
            return this.prepend(content);
        } else if (offset >= this.original.length) {
            return this.append(content);
        }

        const [chunk, next] = this.split(offset) ?? [this.lastChunk, null];
    }

    private split(index: number) {
        const offset = this.offset + index;
        if (offset <= 0) {
            return;
        } else if (offset >= this.original.length) {
            return;
        }

        for (const chunk of this.firstChunk.iter()) {
            if (!chunk.contains(index)) continue;

            const next = chunk.split(index);

            if (chunk === this.lastChunk) {
                this.lastChunk = next;
            }

            return [chunk, next] as const;
        }

        return;
    }
}
