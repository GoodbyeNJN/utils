import { NONE, Option } from "../option";

/* #__NO_SIDE_EFFECTS__ */
export const None = (): Option<never> => {
    // @ts-expect-error ts(2673)
    return new Option(NONE);
};
