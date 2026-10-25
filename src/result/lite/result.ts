import { isResult } from "./helpers/isResult";
import { _try } from "./helpers/try";
import { wrap } from "./helpers/wrap";

type ResultTuple<T, E> = readonly [ok: boolean, error: E, value: T];

// oxlint-disable-next-line no-redeclare
export interface Result<T = unknown, E = unknown> extends ResultTuple<T, E> {}

export class Result<T = unknown, E = unknown> {
    static is = isResult;

    static try = _try;

    static wrap = wrap;

    ok: boolean;
    error: E;
    value: T;

    constructor(ok: boolean, error: E, value: T) {
        this.ok = ok;
        this.error = error;
        this.value = value;
    }

    *[Symbol.iterator]() {
        yield this.ok;
        yield this.error;
        yield this.value;

        return undefined;
    }
}
