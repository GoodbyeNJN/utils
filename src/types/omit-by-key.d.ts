import type { Except } from "libs/type-fest";

export type OmitByKey<ObjectType, KeysType extends keyof ObjectType> = Except<
    ObjectType,
    KeysType,
    { requireExactProps: true }
>;
