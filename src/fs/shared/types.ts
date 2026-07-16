import type {
    GlobOptions as NodeGlobOptions,
    GlobOptionsWithFileTypes as NodeGlobOptionsWithFileTypes,
    GlobOptionsWithoutFileTypes as NodeGlobOptionsWithoutFileTypes,
} from "node:fs";

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

export interface MkdtempOptions {
    cwd?: PathLike;
    disposable?: boolean;
}

export interface MkdtempDisposableOptions extends MkdtempOptions {
    disposable: true;
}

export interface MkdtempNonDisposableOptions extends MkdtempOptions {
    disposable?: false;
}

export interface RmOptions {
    force?: boolean;
    recursive?: boolean;
}

export interface CpOptions {
    recursive?: boolean;
}

interface BaseGlobOptions {
    patterns: string | string[];

    /**
     * Return absolute paths in the results.
     *
     * @default false
     */
    absolute?: boolean;
    /**
     * Include files in the results.
     *
     * @default true
     */
    includeFiles?: boolean;
    /**
     * Include directories in the results.
     *
     * @default false
     */
    includeDirectories?: boolean;
}

export interface GlobOptions extends BaseGlobOptions, NodeGlobOptions {}

export interface GlobOptionsWithFileTypes extends BaseGlobOptions, NodeGlobOptionsWithFileTypes {}

export interface GlobOptionsWithoutFileTypes
    extends BaseGlobOptions, NodeGlobOptionsWithoutFileTypes {}
