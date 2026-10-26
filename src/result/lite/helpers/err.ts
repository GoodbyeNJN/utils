import { Result } from "../result";

// oxlint-disable-next-line no-redeclare
export interface Err {
    (): Result<never, void>;
    <E>(error: E): Result<never, E>;
}

/* #__NO_SIDE_EFFECTS__ */
export const Err: Err = (error?: unknown): any => {
    return new Result(false, error, undefined);
};
