import { Option } from "../option";

/* #__NO_SIDE_EFFECTS__ */
export const Some = <T>(value: T): Option<T> => {
    // @ts-expect-error ts(2673)
    return new Option(value);
};
