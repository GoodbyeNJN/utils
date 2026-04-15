import { Readable } from "node:stream";

import { describe, expect, it } from "vitest";

import { readStreamLines, readStreams } from "@/exec/stream";

describe("readStreams", () => {
    it("should return an empty string for a null stream", async () => {
        const [a] = await readStreams([null]);
        expect(a).toBe("");
    });

    it("should read the full content from a readable stream", async () => {
        const [a] = await readStreams([Readable.from(["hello"])]);
        expect(a).toBe("hello");
    });

    it("should read multiple streams independently", async () => {
        const [a, b] = await readStreams([Readable.from(["stdout"]), Readable.from(["stderr"])]);
        expect(a).toBe("stdout");
        expect(b).toBe("stderr");
    });

    it("should handle a mix of null and readable streams", async () => {
        const [a, b] = await readStreams([null, Readable.from(["data"])]);
        expect(a).toBe("");
        expect(b).toBe("data");
    });

    it("should concatenate multiple chunks from a single stream", async () => {
        const [a] = await readStreams([Readable.from(["foo", "bar", "baz"])]);
        expect(a).toBe("foobarbaz");
    });
});

describe("readStreamLines", () => {
    it("should yield each line from a stream", async () => {
        const lines: string[] = [];
        for await (const line of readStreamLines([Readable.from(["line1\nline2\nline3"])])) {
            lines.push(line);
        }
        expect(lines).toStrictEqual(["line1", "line2", "line3"]);
    });

    it("should handle a null stream without throwing", async () => {
        const lines: string[] = [];
        for await (const line of readStreamLines([null, Readable.from(["hello"])])) {
            lines.push(line);
        }
        expect(lines).toStrictEqual(["hello"]);
    });

    it("should merge lines from multiple streams", async () => {
        const lines: string[] = [];
        for await (const line of readStreamLines([
            Readable.from(["line1\n"]),
            Readable.from(["line2\n"]),
        ])) {
            lines.push(line);
        }
        expect(lines.sort()).toStrictEqual(["line1", "line2"]);
    });

    it("should yield an empty iterator when all streams are null", async () => {
        const lines: string[] = [];
        for await (const line of readStreamLines([null, null])) {
            lines.push(line);
        }
        expect(lines).toStrictEqual([]);
    });
});
