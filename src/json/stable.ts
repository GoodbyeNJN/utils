import { configure } from "safe-stable-stringify";

export const stableStringify = configure({
    bigint: true,
});
