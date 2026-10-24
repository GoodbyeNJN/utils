import { Result } from "../result";

// oxlint-disable-next-line no-redeclare
export interface Ok {
    (): Result<void, never>;
    <T>(value: T): Result<T, never>;
}

/* #__NO_SIDE_EFFECTS__ */
export const Ok: Ok = (value?: unknown) => {
    // @ts-expect-error ts(2351)
    return new Result(true, undefined, value);
};
