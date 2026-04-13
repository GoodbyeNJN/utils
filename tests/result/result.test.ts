/* eslint-disable require-yield, prefer-promise-reject-errors */

import { describe, expect, expectTypeOf, it } from "vitest";

import { Result } from "@/result/result";

describe("Result.gen", () => {
    it("should handle generator returning non-Result value", () => {
        const value = Result.gen(function* () {
            return 1;
        });
        expect(Result.is(value)).toBe(true);
        expect(value.isOk()).toBe(true);
        expect(value.unwrap()).toBe(1);
    });

    it("should handle generator returning Result value", () => {
        const ok = Result.ok(2);
        const value = Result.gen(function* () {
            return ok;
        });
        expect(value).toBe(ok);

        const err = Result.err("error");
        const error = Result.gen(function* () {
            return err;
        });
        expect(error).toBe(err);
    });

    it("should handle async generators returning non-Result value", async () => {
        const value = await Result.gen(async function* () {
            return 1;
        });

        expect(Result.is(value)).toBe(true);
        expect(value.isOk()).toBe(true);
        expect(value.unwrap()).toBe(1);
    });

    it("should handle async generators returning Result value", async () => {
        const ok = Result.ok(2);
        const value = await Result.gen(async function* () {
            return ok;
        });
        expect(value).toBe(ok);

        const err = Result.err("error");
        const error = await Result.gen(async function* () {
            return err;
        });
        expect(error).toBe(err);
    });
});

describe("Result.try", () => {
    it("should return Ok if the function executes successfully", () => {
        const result = Result.try(() => {
            return 42;
        });
        expectTypeOf(result).toEqualTypeOf<Result<number, unknown>>();
        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBe(42);
    });

    it("should return Err if the function throws", () => {
        const result = Result.try(() => {
            throw "Test error";
        });
        expectTypeOf(result).toEqualTypeOf<Result<never, unknown>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBe("Test error");
    });

    it("should return Err with Error instance if the function throws", () => {
        const result = Result.try(() => {
            throw "Test error";
        }, Error);
        expectTypeOf(result).toEqualTypeOf<Result<never, Error>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBeInstanceOf(Error);
        expect((result.unwrapErr() as Error).message).toBe("Test error");
    });

    it("should return Err with the specified error type if the function throws", () => {
        const result = Result.try(
            () => {
                throw "Test error";
            },
            error => `Custom error: ${error}`,
        );
        expectTypeOf(result).toEqualTypeOf<Result<never, string>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBe("Custom error: Test error");
    });

    it("should return Ok if the async function executes successfully", async () => {
        const result = await Result.try(async () => {
            return 42;
        });
        expectTypeOf(result).toEqualTypeOf<Result<number, unknown>>();
        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBe(42);
    });

    it("should return Err if the async function throws", async () => {
        const result = await Result.try(async () => {
            throw "Test error";
        });
        expectTypeOf(result).toEqualTypeOf<Result<never, unknown>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBe("Test error");
    });

    it("should return Err with Error instance if the async function throws", async () => {
        const result = await Result.try(async () => {
            throw "Test error";
        }, Error);
        expectTypeOf(result).toEqualTypeOf<Result<never, Error>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBeInstanceOf(Error);
        expect((result.unwrapErr() as Error).message).toBe("Test error");
    });

    it("should return Err with the specified error type if the async function throws", async () => {
        const result = await Result.try(
            async () => {
                throw "Test error";
            },
            error => `Custom error: ${error}`,
        );
        expectTypeOf(result).toEqualTypeOf<Result<never, string>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBe("Custom error: Test error");
    });

    it("should return Ok if the promise resolves", async () => {
        const result = await Result.try(() => Promise.resolve(42));
        expectTypeOf(result).toEqualTypeOf<Result<number, unknown>>();
        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBe(42);
    });

    it("should return Err if the promise rejects", async () => {
        const result = await Result.try(() => Promise.reject("Test error"));
        expectTypeOf(result).toEqualTypeOf<Result<never, unknown>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBe("Test error");
    });

    it("should return Err with Error instance if the promise rejects with an Error", async () => {
        const result = await Result.try(() => Promise.reject("Test error"), Error);
        expectTypeOf(result).toEqualTypeOf<Result<never, Error>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBeInstanceOf(Error);
        expect((result.unwrapErr() as Error).message).toBe("Test error");
    });

    it("should return Err with the specified error type if the promise rejects with an error", async () => {
        const result = await Result.try(
            () => Promise.reject("Test error"),
            error => `Custom error: ${error}`,
        );
        expectTypeOf(result).toEqualTypeOf<Result<never, string>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBe("Custom error: Test error");
    });
});
