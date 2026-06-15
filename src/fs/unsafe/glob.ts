import fs, { promises as fsp } from "node:fs";
import path from "node:path";
import url from "node:url";

import { isArray, isString, omit } from "@/fp";

import type {
    Dirent,
    GlobOptions as NodeGlobOptions,
    GlobOptionsWithFileTypes as NodeGlobOptionsWithFileTypes,
    GlobOptionsWithoutFileTypes as NodeGlobOptionsWithoutFileTypes,
} from "node:fs";

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

export type Glob = {
    (
        patterns: GlobOptionsWithFileTypes["patterns"],
        options?: Omit<GlobOptionsWithFileTypes, "patterns">,
    ): Promise<Dirent[]>;
    (
        patterns: GlobOptionsWithoutFileTypes["patterns"],
        options?: Omit<GlobOptionsWithoutFileTypes, "patterns">,
    ): Promise<string[]>;
    (
        patterns: GlobOptions["patterns"],
        options?: Omit<GlobOptions, "patterns">,
    ): Promise<(Dirent | string)[]>;
    (options: GlobOptionsWithFileTypes): Promise<Dirent[]>;
    (options: GlobOptionsWithoutFileTypes): Promise<string[]>;
    (options: GlobOptions): Promise<(Dirent | string)[]>;
};

export type GlobSync = {
    (
        patterns: GlobOptionsWithFileTypes["patterns"],
        options?: Omit<GlobOptionsWithFileTypes, "patterns">,
    ): Dirent[];
    (
        patterns: GlobOptionsWithoutFileTypes["patterns"],
        options?: Omit<GlobOptionsWithoutFileTypes, "patterns">,
    ): string[];
    (
        patterns: GlobOptions["patterns"],
        options?: Omit<GlobOptions, "patterns">,
    ): (Dirent | string)[];
    (options: GlobOptionsWithFileTypes): Dirent[];
    (options: GlobOptionsWithoutFileTypes): string[];
    (options: GlobOptions): (Dirent | string)[];
};

const normalizeArgs = (
    patternsOrOptions: string | string[] | GlobOptions,
    maybeOptions?: Omit<GlobOptions, "patterns">,
) => {
    const patternsAsArgument = isString(patternsOrOptions) || isArray(patternsOrOptions);

    const patterns = patternsAsArgument ? patternsOrOptions : patternsOrOptions.patterns;
    const options = patternsAsArgument ? maybeOptions || {} : omit(patternsOrOptions, ["patterns"]);

    if (options.includeFiles === undefined && options.includeDirectories === undefined) {
        options.includeFiles = true;
        options.includeDirectories = false;
    } else if (options.includeFiles === undefined) {
        options.includeFiles = !options.includeDirectories;
    } else if (options.includeDirectories === undefined) {
        options.includeDirectories = !options.includeFiles;
    }

    return { patterns, options };
};

const processEntries = (entries: Dirent[], options: Omit<GlobOptions, "patterns">) => {
    const result = entries.filter(
        entry =>
            (options.includeFiles && entry.isFile()) ||
            (options.includeDirectories && entry.isDirectory()) ||
            (!options.includeFiles && !options.includeDirectories),
    );

    if (options.absolute) {
        const cwd =
            (options.cwd instanceof URL ? url.fileURLToPath(options.cwd) : options.cwd) ??
            process.cwd();

        if (!options.withFileTypes) {
            return result.map(entry => path.resolve(cwd, entry.parentPath, entry.name));
        } else {
            for (const entry of entries) {
                entry.parentPath = path.resolve(cwd, entry.parentPath);
            }

            return result;
        }
    }

    if (!options.withFileTypes) {
        return result.map(entry => path.join(entry.parentPath, entry.name));
    }

    return result;
};

/* #__NO_SIDE_EFFECTS__ */
export const glob: Glob = async (...args: [any, any?]): Promise<any[]> => {
    const { patterns, options } = normalizeArgs(...args);

    const entries = await Array.fromAsync(
        fsp.glob(patterns, {
            ...options,
            withFileTypes: true,
        }),
    );

    return processEntries(entries, options);
};

/* #__NO_SIDE_EFFECTS__ */
export const globSync: GlobSync = (...args: [any, any?]): any[] => {
    const { patterns, options } = normalizeArgs(...args);

    const entries = fs.globSync(patterns, {
        ...options,
        withFileTypes: true,
    });

    return processEntries(entries, options);
};
