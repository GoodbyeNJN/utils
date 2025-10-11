import type { Except } from "type-fest";

export type OmitByKey<ObjectType, KeysType extends keyof ObjectType> = Except<
    ObjectType,
    KeysType,
    { requireExactProps: true }
>;
