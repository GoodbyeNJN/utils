import fs, { promises as fsp } from "node:fs";
import path from "node:path";

import { isArray, isString, omit } from "@/fp";

import { pathLikeToPath } from "../shared/utils";

import type {
    GlobOptions,
    GlobOptionsWithFileTypes,
    GlobOptionsWithoutFileTypes,
} from "../shared/types";
import type { Dirent } from "node:fs";

type Glob = {
    (patterns: GlobOptions["patterns"]): Promise<string[]>;
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
    (): Promise<string[]>;
    (options: GlobOptionsWithFileTypes): Promise<Dirent[]>;
    (options: GlobOptionsWithoutFileTypes): Promise<string[]>;
    (options: GlobOptions): Promise<(Dirent | string)[]>;
};

type GlobSync = {
    (patterns: GlobOptions["patterns"]): string[];
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
    (): string[];
    (options: GlobOptionsWithFileTypes): Dirent[];
    (options: GlobOptionsWithoutFileTypes): string[];
    (options: GlobOptions): (Dirent | string)[];
};

interface NormalizedOptions extends Omit<GlobOptions, "patterns"> {
    cwd: string;
}

const normalizeArgs = (
    patternsOrOptions: string | string[] | GlobOptions,
    maybeOptions?: Omit<GlobOptions, "patterns">,
) => {
    const isFirstArgumentPattern = isString(patternsOrOptions) || isArray(patternsOrOptions);

    const patterns = isFirstArgumentPattern ? patternsOrOptions : patternsOrOptions.patterns;
    const options = isFirstArgumentPattern
        ? maybeOptions || {}
        : omit(patternsOrOptions, ["patterns"]);

    if (options.includeFiles === undefined && options.includeDirectories === undefined) {
        options.includeFiles = true;
        options.includeDirectories = false;
    } else if (options.includeFiles === undefined) {
        options.includeFiles = !options.includeDirectories;
    } else if (options.includeDirectories === undefined) {
        options.includeDirectories = !options.includeFiles;
    }

    const cwd = options.cwd === undefined ? process.cwd() : pathLikeToPath(options.cwd);
    options.cwd = path.isAbsolute(cwd) ? cwd : path.join(process.cwd(), cwd);

    return { patterns, options: options as NormalizedOptions };
};

const processEntries = (entries: Dirent[], options: NormalizedOptions) => {
    /*
        // Node.js v26.5.0

        glob
            No cwd:			Not absolute
            Absolute cwd:	Not absolute
            Relative cwd:	Not absolute
            URL cwd:		Not absolute

        globSync
            No cwd:			Not absolute
            Absolute cwd:	Not absolute
            Relative cwd:	Not absolute
            URL cwd:		Not absolute

        glob (withFileTypes)
            No cwd:			Absolute
            Absolute cwd:	Absolute
            Relative cwd:	Absolute
            URL cwd:		Absolute

        globSync (withFileTypes)
            No cwd:			Not absolute
            Absolute cwd:	Absolute
            Relative cwd:	Not absolute
            URL cwd:		Absolute
    */

    const { absolute, includeFiles, includeDirectories, cwd, withFileTypes } = options;

    const dirent =
        includeFiles || includeDirectories
            ? entries.filter(
                  entry =>
                      (includeFiles && entry.isFile()) ||
                      (includeDirectories && entry.isDirectory()),
              )
            : entries;

    if (withFileTypes) {
        for (const entry of dirent) {
            if (!absolute) {
                entry.parentPath = path.relative(cwd, entry.parentPath);
            }
        }

        return dirent;
    } else {
        return dirent.map(({ name, parentPath }) =>
            path.join(absolute ? parentPath : path.relative(cwd, parentPath), name),
        );
    }
};

/* #__NO_SIDE_EFFECTS__ */
export const glob: Glob = async (...args: [any?, any?]): Promise<any[]> => {
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
export const globSync: GlobSync = (...args: [any?, any?]): any[] => {
    const { patterns, options } = normalizeArgs(...args);

    const entries = fs.globSync(patterns, {
        ...options,
        withFileTypes: true,
    });

    return processEntries(entries, options);
};
