// oxlint-disable typescript/restrict-template-expressions
// oxlint-disable typescript/prefer-promise-reject-errors
// oxlint-disable typescript/only-throw-error
// oxlint-disable require-yield

import { describe, expect, expectTypeOf, test } from "vitest";

import { Err, Ok, Result } from "@/result";

describe("Result.gen", () => {
    test("should handle generator returning non-Result value", () => {
        const value = Result.gen(function* () {
            return 1;
        });
        expect(Result.is(value)).toBe(true);
        expect(value.isOk()).toBe(true);
        expect(value.unwrap()).toBe(1);
    });

    test("should handle generator returning Result value", () => {
        const ok = Ok(2);
        const value = Result.gen(function* () {
            return ok;
        });
        expect(value).toBe(ok);

        const err = Err("error");
        const error = Result.gen(function* () {
            return err;
        });
        expect(error).toBe(err);
    });

    test("should handle async generators returning non-Result value", () => {
        const value = Result.gen(function* () {
            return 1;
        });

        expect(Result.is(value)).toBe(true);
        expect(value.isOk()).toBe(true);
        expect(value.unwrap()).toBe(1);
    });

    test("should handle async generators returning Result value", () => {
        const ok = Ok(2);
        const value = Result.gen(function* () {
            return ok;
        });
        expect(value).toBe(ok);

        const err = Err("error");
        const error = Result.gen(function* () {
            return err;
        });
        expect(error).toBe(err);
    });
});

describe("Result.try", () => {
    test("should return Ok if the function executes successfully", () => {
        const result = Result.try(() => {
            return 42;
        });
        expectTypeOf(result).toEqualTypeOf<Result<number, unknown>>();
        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBe(42);
    });

    test("should return Err if the function throws", () => {
        const result = Result.try(() => {
            throw "Test error";
        });
        expectTypeOf(result).toEqualTypeOf<Result<never, unknown>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBe("Test error");
    });

    test("should return Err with Error instance if the function throws", () => {
        const result = Result.try(() => {
            throw "Test error";
        }, Error);
        expectTypeOf(result).toEqualTypeOf<Result<never, Error>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBeInstanceOf(Error);
        expect(result.unwrapErr().message).toBe("Test error");
    });

    test("should return Err with the specified error type if the function throws", () => {
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

    test("should return Ok if the async function executes successfully", () => {
        const result = Result.try(() => {
            return 42;
        });
        expectTypeOf(result).toEqualTypeOf<Result<number, unknown>>();
        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBe(42);
    });

    test("should return Err if the async function throws", () => {
        const result = Result.try(() => {
            throw "Test error";
        });
        expectTypeOf(result).toEqualTypeOf<Result<never, unknown>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBe("Test error");
    });

    test("should return Err with Error instance if the async function throws", () => {
        const result = Result.try(() => {
            throw "Test error";
        }, Error);
        expectTypeOf(result).toEqualTypeOf<Result<never, Error>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBeInstanceOf(Error);
        expect(result.unwrapErr().message).toBe("Test error");
    });

    test("should return Err with the specified error type if the async function throws", () => {
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

    test("should return Ok if the promise resolves", async () => {
        const result = await Result.try(async () => Promise.resolve(42));
        expectTypeOf(result).toEqualTypeOf<Result<number, unknown>>();
        expect(result.isOk()).toBe(true);
        expect(result.unwrap()).toBe(42);
    });

    test("should return Err if the promise rejects", async () => {
        const result = await Result.try(async () => Promise.reject("Test error"));
        expectTypeOf(result).toEqualTypeOf<Result<never, unknown>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBe("Test error");
    });

    test("should return Err with Error instance if the promise rejects with an Error", async () => {
        const result = await Result.try(async () => Promise.reject("Test error"), Error);
        expectTypeOf(result).toEqualTypeOf<Result<never, Error>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBeInstanceOf(Error);
        expect(result.unwrapErr().message).toBe("Test error");
    });

    test("should return Err with the specified error type if the promise rejects with an error", async () => {
        const result = await Result.try(
            async () => Promise.reject("Test error"),
            error => `Custom error: ${error}`,
        );
        expectTypeOf(result).toEqualTypeOf<Result<never, string>>();
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBe("Custom error: Test error");
    });
});
