import { describe, expect, test } from "vitest";

import { parse, stringify } from "@/json/unsafe";

describe("stringify", () => {
    test("should return Some with the serialized string for an object", () => {
        const result = stringify({ key: "value" });

        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toBe('{"key":"value"}');
    });

    test("should return Some with the serialized string for an array", () => {
        const result = stringify([1, 2, 3]);

        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toBe("[1,2,3]");
    });

    test("should return Some with custom indent", () => {
        const result = stringify({ a: 1 }, null, 2);

        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toContain("  ");
    });

    test("should return None for undefined", () => {
        const result = stringify(undefined);

        expect(result.isNone()).toBe(true);
    });

    test("should return None for a function", () => {
        const result = stringify(() => {});

        expect(result.isNone()).toBe(true);
    });

    test("should return None for a Symbol", () => {
        const result = stringify(Symbol("sym"));

        expect(result.isNone()).toBe(true);
    });

    test("should throw for a circular reference", () => {
        const obj: any = {};
        obj.self = obj;

        expect(() => stringify(obj)).toThrow();
    });
});

describe("parse", () => {
    test("should return Some for a JSON object string", () => {
        const result = parse<{ key: string }>('{"key":"value"}');

        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toEqual({ key: "value" });
    });

    test("should return Some for a JSON array string", () => {
        const result = parse<number[]>("[1,2,3]");

        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toEqual([1, 2, 3]);
    });

    test("should return None for an invalid JSON string", () => {
        const result = parse("not json");

        expect(result.isNone()).toBe(true);
    });

    test("should return None for an empty string", () => {
        const result = parse("");

        expect(result.isNone()).toBe(true);
    });
});
