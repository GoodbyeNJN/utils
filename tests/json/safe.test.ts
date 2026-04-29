import { describe, expect, test } from "vitest";

import { parse, stringify } from "@/json/safe";

describe("stringify", () => {
    test("should return Ok with the serialized string for an object", () => {
        const result = stringify({ key: "value" });

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBe('{"key":"value"}');
    });

    test("should return Ok with the serialized string for an array", () => {
        const result = stringify([1, 2, 3]);

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBe("[1,2,3]");
    });

    test("should return Ok with custom indent", () => {
        const result = stringify({ a: 1 }, null, 2);

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toContain("  ");
    });

    test("should return Err for undefined", () => {
        const result = stringify(undefined);

        expect(result.isErr()).toBe(true);
    });

    test("should return Err for a function", () => {
        const result = stringify(() => {});

        expect(result.isErr()).toBe(true);
    });

    test("should return Err for a Symbol", () => {
        const result = stringify(Symbol("sym"));

        expect(result.isErr()).toBe(true);
    });

    test("should return Err when the object contains a circular reference", () => {
        const obj: any = {};
        obj.self = obj;
        const result = stringify(obj);

        expect(result.isErr()).toBe(true);
    });

    test("should not throw for a circular reference", () => {
        const obj: any = {};
        obj.self = obj;

        expect(() => stringify(obj)).not.toThrow();
    });
});

describe("parse", () => {
    test("should return Ok for a JSON object string", () => {
        const result = parse<{ key: string }>('{"key":"value"}');

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toEqual({ key: "value" });
    });

    test("should return Ok for a JSON array string", () => {
        const result = parse<number[]>("[1,2,3]");

        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toEqual([1, 2, 3]);
    });

    test("should return Err for an invalid JSON string", () => {
        const result = parse("not json");

        expect(result.isErr()).toBe(true);
    });

    test("should return Err for an empty string", () => {
        const result = parse("");

        expect(result.isErr()).toBe(true);
    });
});
