import type { Fn } from "./fn";
import type { IterableElement } from "libs/type-fest";

export type YieldType<TargetGeneratorFn extends Fn<Generator | AsyncGenerator>> = IterableElement<
    ReturnType<TargetGeneratorFn>
>;
