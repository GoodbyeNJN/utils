// oxlint-disable no-throw-literal
// oxlint-disable require-yield
// oxlint-disable typescript/restrict-template-expressions
// oxlint-disable typescript/prefer-promise-reject-errors
// oxlint-disable typescript/only-throw-error

import { describe, expect, expectTypeOf, test } from "vitest";

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

describe("Option.try", () => {
    test("should return Some if the function executes successfully", () => {
        const result = Option.try(() => {
            return 42;
        });
        expectTypeOf(result).toEqualTypeOf<Option<number>>();
        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toBe(42);
    });

    test("should return None if the function throws", () => {
        const result = Option.try(() => {
            throw "Test error";
        });
        expectTypeOf(result).toEqualTypeOf<Option<never>>();
        expect(result.isNone()).toBe(true);
    });

    test("should return Some if the async function executes successfully", () => {
        const result = Option.try(() => {
            return 42;
        });
        expectTypeOf(result).toEqualTypeOf<Option<number>>();
        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toBe(42);
    });

    test("should return None if the async function throws", () => {
        const result = Option.try(() => {
            throw "Test error";
        });
        expectTypeOf(result).toEqualTypeOf<Option<never>>();
        expect(result.isNone()).toBe(true);
    });

    test("should return Some if the promise resolves", async () => {
        const result = await Option.try(async () => Promise.resolve(42));
        expectTypeOf(result).toEqualTypeOf<Option<number>>();
        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toBe(42);
    });

    test("should return None if the promise rejects", async () => {
        const result = await Option.try(async () => Promise.reject("Test error"));
        expectTypeOf(result).toEqualTypeOf<Option<never>>();
        expect(result.isNone()).toBe(true);
    });
});
