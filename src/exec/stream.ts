import readline from "node:readline";
import { PassThrough } from "node:stream";

import type { Nullable } from "@/types";
import type { Readable } from "node:stream";

export const readStreams = <const T extends readonly Nullable<Readable>[]>(
    streams: T,
): Promise<{ [K in keyof T]: string }> => {
    const promises: Promise<string>[] = [];
    for (const stream of streams) {
        if (!stream) {
            promises.push(Promise.resolve(""));
            continue;
        }

        const chunks = Array.fromAsync(stream).then(chunks =>
            chunks.map(chunk => chunk.toString()).join(""),
        );
        promises.push(chunks);
    }

    return Promise.all(promises) as Promise<{ [K in keyof T]: string }>;
};

export const readStreamLines = (streams: Nullable<Readable>[]) => {
    const input = new PassThrough();

    let streamCount = streams.length;
    const onStreamEnd = () => {
        streamCount -= 1;
        if (streamCount <= 0) {
            input.end();
        }
    };

    for (const stream of streams) {
        if (!stream) {
            onStreamEnd();
            continue;
        }

        stream.pipe(input, { end: false });
        stream.once("end", onStreamEnd);
        stream.once("error", onStreamEnd);
    }

    const reader = readline.createInterface({ input });

    return reader[Symbol.asyncIterator]();
};
