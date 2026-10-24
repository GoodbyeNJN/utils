import type { isResult } from "./helpers/isResult";
import type { Try } from "./helpers/try";
import type { Wrap } from "./helpers/wrap";

// oxlint-disable-next-line no-redeclare
export type Result<T = unknown, E = unknown> =
    | ({
          readonly ok: true;
          readonly error: never;
          readonly value: T;
      } & readonly [ok: true, error: never, value: T])
    | ({
          readonly ok: false;
          readonly error: E;
          readonly value: never;
      } & readonly [ok: false, error: E, value: never]);

interface ResultConstructor {
    is: typeof isResult;

    /**
     * Creates a `Result` from a function or a promise, catching any thrown errors or rejected
     * promises.
     */
    try: Try;

    /**
     * Wraps a function and returns a new function that always returns a `Result`, catching any
     * thrown errors or rejected promises.
     */
    wrap: Wrap;
}

export declare const Result: ResultConstructor;
