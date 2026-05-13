// oxlint-disable require-yield

import { describe, expect, test } from "vitest";

import { Option, Some } from "@/option";

describe("Option.gen", () => {
    test("should handle generator returning non-Option value", () => {
        const value = Option.gen(function* () {
            return 1;
        });
        expect(Option.is(value)).toBe(true);
        expect(value.isSome()).toBe(true);
        expect(value.unwrap()).toBe(1);
    });

    test("should handle generator returning Option value", () => {
        const some = Some(2);
        const value = Option.gen(function* () {
            return some;
        });
        expect(value).toBe(some);
    });

    test("should handle async generators returning non-Option value", () => {
        const value = Option.gen(function* () {
            return 1;
        });

        expect(Option.is(value)).toBe(true);
        expect(value.isSome()).toBe(true);
        expect(value.unwrap()).toBe(1);
    });

    test("should handle async generators returning Option value", () => {
        const some = Some(2);
        const value = Option.gen(function* () {
            return some;
        });
        expect(value).toBe(some);
    });
});
