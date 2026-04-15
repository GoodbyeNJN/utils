export type PathLike = string | URL;

export interface BufferEncodingOptions {
    encoding: "buffer";
}

export interface StringEncodingOptions {
    encoding?: BufferEncoding;
}

export type EncodingOptions = BufferEncodingOptions | StringEncodingOptions;

export type AppendFileOptions = StringEncodingOptions & { newline?: boolean };

export type WriteJsonOptions = (StringEncodingOptions & { indent?: number }) | number;

export interface MkdirOptions {
    recursive?: boolean;
}

export interface RmOptions {
    force?: boolean;
    recursive?: boolean;
}

export interface CpOptions {
    recursive?: boolean;
}
