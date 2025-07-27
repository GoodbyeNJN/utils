export type PathLike = string | URL;

export interface BufferEncodingOptions {
    encoding?: "buffer" | undefined;
}

export interface StringEncodingOptions {
    encoding?: BufferEncoding | undefined;
}

export type AppendFileOptions = StringEncodingOptions & { newline?: boolean | undefined };

export type WriteJsonOptions = (StringEncodingOptions & { indent?: number | undefined }) | number;

export interface MkdirOptions {
    recursive?: boolean | undefined;
}

export interface RmOptions {
    force?: boolean | undefined;
    recursive?: boolean | undefined;
}

export interface CpOptions {
    recursive?: boolean | undefined;
}
