export { getErrorMessage, normalizeError } from "./error";

export { linear, scale } from "./math";

export { nil, isNil } from "./nil";

export { parseKeyValuePairs, parseValueToBoolean } from "./parse";

export { createLock, createPromiseWithResolvers, createSingleton, sleep } from "./promise";

export {
    addPrefix,
    addSuffix,
    concatTemplateStrings,
    indent,
    join,
    joinWithSlash,
    removePrefix,
    removeSuffix,
    split,
    splitByLineBreak,
    splitWithSlash,
    template,
    toForwardSlash,
    unindent,
} from "./string";

export { debounce, throttle } from "./throttle";

export type { Nil } from "./nil";

export type { Lock, PromiseWithResolvers, Singleton } from "./promise";

export type { DebouncedFn, DebounceOptions, ThrottledFn, ThrottleOptions } from "./throttle";
