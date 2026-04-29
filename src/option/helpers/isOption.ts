import { Option } from "../option";

/* #__NO_SIDE_EFFECTS__ */
export const isOption = (value: unknown): value is Option => {
    return value instanceof Option;
};
