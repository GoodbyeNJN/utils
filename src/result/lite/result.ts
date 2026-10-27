import { isResult } from "./helpers/isResult";
import { _try } from "./helpers/try";
import { wrap } from "./helpers/wrap";

import type { InspectContext } from "node:util";

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

    // See `Inspectable` and `inspect` types in `node:util` for details
    [Symbol.for("nodejs.util.inspect.custom")](
        depth: number,
        options: InspectContext,
        inspect: typeof import("node:util").inspect,
    ): string {
        if (this.ok) {
            const inner = inspect(this.value, options);

            return `Ok(${inner})`;
        } else if (this.error instanceof Error) {
            const { name, message } = this.error;
            const inner = inspect(message, options);

            return `Err(${name}(${inner}))`;
        } else {
            const inner = inspect(this.error, options);

            return `Err(${inner})`;
        }
    }
}
