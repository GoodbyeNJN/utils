import _path from "node:path";

import { removePrefix } from "@/tools";

export const filename = (path: string) => _path.basename(path, _path.extname(path));

export const extname = (path: string, dot = true) => {
    const extname = _path.extname(path);

    return dot ? extname : removePrefix(".", extname);
};

export function* ancestors(path: string) {
    let current = path;

    while (true) {
        yield current;
        const parent = _path.dirname(current);
        if (parent === current) break;
        current = parent;
    }
}

export const segments = (path: string, separator = _path.sep) => {
    const normalized = _path.normalize(path);
    const parts = normalized.split(separator);

    return parts;
};

export const isSubpath = (parent: string, child: string) => {
    const relative = _path.relative(parent, child);

    return Boolean(relative) && !relative.startsWith("..") && !_path.isAbsolute(relative);
};

export const mapPathsToEntry = (paths: string[], base?: string) => {
    const basepath = base || process.cwd();

    const entries = paths.map(path => {
        const extname = _path.extname(path);
        const relative = _path.relative(basepath, path);
        const entry =
            extname.length > 0 ? relative.slice(0, relative.length - extname.length) : relative;
        const normalized = _path.sep !== "/" ? entry.split(_path.sep).join("/") : entry;

        return [normalized, path] as const;
    });

    return Object.fromEntries(entries);
};
