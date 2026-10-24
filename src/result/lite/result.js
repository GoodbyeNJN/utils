import { isResult } from "./helpers/isResult";
import { _try } from "./helpers/try";
import { wrap } from "./helpers/wrap";

export class Result {
    static is = isResult;

    static try = _try;

    static wrap = wrap;

    constructor(ok, error, value) {
        this.ok = ok;
        this.error = error;
        this.value = value;

        this[0] = ok;
        this[1] = error;
        this[2] = value;
    }

    *[Symbol.iterator]() {
        yield this.ok;
        yield this.error;
        yield this.value;
    }
}
