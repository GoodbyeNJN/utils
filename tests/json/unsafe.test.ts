import { describe, expect, it } from "vitest";

import { isNil } from "@/common";
import { parse, stringify } from "@/json/unsafe";

describe("stringify", () => {
    it("should return the serialized string for an object", () => {
        const result = stringify({ key: "value" });

        expect(result).toBe('{"key":"value"}');
    });

    it("should return the serialized string for an array", () => {
        const result = stringify([1, 2, 3]);

        expect(result).toBe("[1,2,3]");
    });

    it("should return the serialized string with custom indent", () => {
        const result = stringify({ a: 1 }, null, 2);

        expect(typeof result).toBe("string");
        expect(result as string).toContain("  ");
    });

    it("should return nil for undefined", () => {
        const result = stringify(undefined);

        expect(isNil(result)).toBe(true);
    });

    it("should return nil for a function", () => {
        const result = stringify(() => {});

        expect(isNil(result)).toBe(true);
    });

    it("should return nil for a Symbol", () => {
        const result = stringify(Symbol("sym"));

        expect(isNil(result)).toBe(true);
    });

    it("should throw for a circular reference", () => {
        const obj: any = {};
        obj.self = obj;

        expect(() => stringify(obj)).toThrow(TypeError);
    });
});

describe("parse", () => {
    it("should return the parsed value for a valid JSON object string", () => {
        const result = parse<{ key: string }>('{"key":"value"}');

        expect(result).toEqual({ key: "value" });
    });

    it("should return the parsed value for a valid JSON array string", () => {
        const result = parse<number[]>("[1,2,3]");

        expect(result).toEqual([1, 2, 3]);
    });

    it("should return nil for an invalid JSON string", () => {
        const result = parse("not json");

        expect(isNil(result)).toBe(true);
    });

    it("should return nil for an empty string", () => {
        const result = parse("");

        expect(isNil(result)).toBe(true);
    });
});
