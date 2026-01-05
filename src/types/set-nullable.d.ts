import type { Nullable } from "./nullable";

export type SetNullable<BaseType, Keys extends keyof BaseType = keyof BaseType> = {
    [Key in keyof BaseType]: Key extends Keys ? Nullable<BaseType[Key]> : BaseType[Key];
};
