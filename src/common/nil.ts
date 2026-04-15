import type { Tagged } from "@/types";

export type Nil = Tagged<symbol, "nil">;

export const nil = Symbol("nil") as Nil;

export const isNil = (value: unknown): value is Nil => value === nil;
