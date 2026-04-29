import type { Option } from "./option";

export type InferSomeType<O> =
    O extends Option<never> ? never : O extends Option<infer T> ? T : never;

export type ExtractSomeTypes<T extends readonly Option[]> = {
    [K in keyof T]: InferSomeType<T[K]>;
};

export type OptionAll<T extends readonly Option[]> =
    IsLiteralArray<T> extends true ? Traverse<T> : Option<ExtractSomeTypes<T>>;

// #region Combine - Types

// This is a helper type to prevent infinite recursion in typing rules.
//
// Use this with your `depth` variable in your types.
// prettier-ignore
type Prev = [
    never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, ...0[],
];

// Checks if the given type is a literal array.
type IsLiteralArray<T> = T extends { length: infer L }
    ? L extends number
        ? number extends L
            ? false
            : true
        : false
    : false;

type ContainsNone<T, Depth extends number = 50> = [Depth] extends [never]
    ? false
    : T extends [infer H, ...infer Rest]
      ? H extends Option<never>
          ? true
          : ContainsNone<Rest, Prev[Depth]>
      : false;

type Traverse<T extends readonly Option[]> =
    ContainsNone<T> extends true ? Option<never> : Option<ExtractSomeTypes<T>>;

// #endregion
