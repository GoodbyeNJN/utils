export { getErrorMessage, normalizeError } from "./error";

export { linear, scale } from "./math";

export { parseKeyValuePairs, parseValueToBoolean } from "./parse";

export { createLock, createPromiseWithResolvers, createSingleton, sleep } from "./promise";

export {
    addPrefix,
    addSuffix,
    concatTemplateStrings,
    indent,
    joinWith,
    joinWithSlash,
    removePrefix,
    removeSuffix,
    splitBy,
    splitByLineBreak,
    splitBySlash,
    template,
    toForwardSlash,
    unindent,
} from "./string";

export type { Lock, PromiseWithResolvers, Singleton } from "./promise";
