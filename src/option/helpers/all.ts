import { None } from "./none";
import { Some } from "./some";

import type { Option } from "../option";
import type { OptionAll } from "../types";
import type { NonEmptyTuple } from "@/types";

export interface All {
    <T extends NonEmptyTuple<Option>>(options: T): OptionAll<T>;
    <T extends readonly Option[]>(options: T): OptionAll<T>;
}

/* #__NO_SIDE_EFFECTS__ */
export const all: All = (options: Option[]): OptionAll<Option[]> => {
    const values: unknown[] = [];

    for (const option of options) {
        if (option.isNone()) {
            return None();
        }

        values.push(option["value"]);
    }

    return Some(values);
};
