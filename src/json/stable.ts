import { configure } from "safe-stable-stringify";

export const stableStringify = /* #__PURE__ */ configure({
    bigint: true,
});
