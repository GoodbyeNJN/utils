import { Result } from "../result";

/* #__NO_SIDE_EFFECTS__ */
export const isResult = (value: unknown): value is Result => {
    // @ts-expect-error ts(2359)
    return value instanceof Result;
};
