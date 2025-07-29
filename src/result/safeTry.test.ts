/* eslint-disable max-nested-callbacks */
/* eslint-disable require-yield */

import { describe, expect, test } from "vitest";

import { Err, err, errAsync, Ok, ok, okAsync, safeTry } from "./";

import type { Result, ResultAsync } from "./";

describe("Returns what is returned from the generator function", () => {
    const val = "value";

    test("With Ok", () => {
        const res = safeTry(function* () {
            return ok(val);
        });
        expect(res).toBeInstanceOf(Ok);
        expect(res.value).toBe(val);
    });

    test("With Err", () => {
        const res = safeTry(function* () {
            return err(val);
        });
        expect(res).toBeInstanceOf(Err);
        expect(res.error).toBe(val);
    });

    test("With async Ok", async () => {
        const res = await safeTry(async function* () {
            return okAsync(val);
        });
        expect(res).toBeInstanceOf(Ok);
        expect(res.value).toBe(val);
    });

    test("With async Err", async () => {
        const res = await safeTry(async function* () {
            return errAsync(val);
        });
        expect(res).toBeInstanceOf(Err);
        expect(res.error).toBe(val);
    });
});

describe("Returns the first occurence of Err instance as yiled*'s operand", () => {
    test("With results", () => {
        const errVal = "err";
        const okValues = Array<string>();

        const result = safeTry(function* () {
            const okFoo = yield* ok("foo");
            okValues.push(okFoo);

            const okBar = yield* ok("bar");
            okValues.push(okBar);

            yield* err(errVal);

            throw new Error("This line should not be executed");
        });

        expect(okValues).toMatchObject(["foo", "bar"]);

        expect(result).toBeInstanceOf(Err);
        expect(result.error).toBe(errVal);
    });

    test("With async results", async () => {
        const errVal = "err";
        const okValues = Array<string>();

        const result = await safeTry(async function* () {
            const okFoo = yield* okAsync("foo");
            okValues.push(okFoo);

            const okBar = yield* okAsync("bar");
            okValues.push(okBar);

            yield* errAsync(errVal);

            throw new Error("This line should not be executed");
        });

        expect(okValues).toMatchObject(["foo", "bar"]);

        expect(result).toBeInstanceOf(Err);
        expect(result.error).toBe(errVal);
    });

    test("Mix results of and async in AsyncGenerator", async () => {
        const errVal = "err";
        const okValues = Array<string>();

        const result = await safeTry(async function* () {
            const okFoo = yield* okAsync("foo");
            okValues.push(okFoo);

            const okBar = yield* ok("bar");
            okValues.push(okBar);

            yield* err(errVal);

            throw new Error("This line should not be executed");
        });

        expect(okValues).toMatchObject(["foo", "bar"]);

        expect(result).toBeInstanceOf(Err);
        expect(result.error).toBe(errVal);
    });
});

describe("Tests if README's examples work", () => {
    const okValue = 3;
    const errValue = "err!";
    function good(): Result<number, string> {
        return ok(okValue);
    }
    function bad(): Result<number, string> {
        return err(errValue);
    }
    function promiseGood(): Promise<Result<number, string>> {
        return Promise.resolve(ok(okValue));
    }
    function promiseBad(): Promise<Result<number, string>> {
        return Promise.resolve(err(errValue));
    }
    function asyncGood(): ResultAsync<number, string> {
        return okAsync(okValue);
    }
    function asyncBad(): ResultAsync<number, string> {
        return errAsync(errValue);
    }

    test("mayFail2 error", () => {
        function myFunc(): Result<number, string> {
            return safeTry<number, string>(function* () {
                return ok(
                    (yield* good().mapErr(e => `1st, ${e}`)) +
                        (yield* bad().mapErr(e => `2nd, ${e}`)),
                );
            });
        }

        const result = myFunc();
        expect(result.isErr()).toBe(true);
        expect(result.error).toBe(`2nd, ${errValue}`);
    });

    test("all ok", () => {
        function myFunc(): Result<number, string> {
            return safeTry<number, string>(function* () {
                return ok(
                    (yield* good().mapErr(e => `1st, ${e}`)) +
                        (yield* good().mapErr(e => `2nd, ${e}`)),
                );
            });
        }

        const result = myFunc();
        expect(result.isOk()).toBe(true);
        expect(result.value).toBe(okValue + okValue);
    });

    test("async mayFail1 error", async () => {
        function myFunc(): ResultAsync<number, string> {
            return safeTry<number, string>(async function* () {
                return ok(
                    (yield* (await promiseBad()).mapErr(e => `1st, ${e}`)) +
                        (yield* asyncGood().mapErr(e => `2nd, ${e}`)),
                );
            });
        }

        const result = await myFunc();
        expect(result.isErr()).toBe(true);
        expect(result.error).toBe(`1st, ${errValue}`);
    });

    test("async mayFail2 error", async () => {
        function myFunc(): ResultAsync<number, string> {
            return safeTry<number, string>(async function* () {
                return ok(
                    (yield* (await promiseGood()).mapErr(e => `1st, ${e}`)) +
                        (yield* asyncBad().mapErr(e => `2nd, ${e}`)),
                );
            });
        }

        const result = await myFunc();
        expect(result.isErr()).toBe(true);
        expect(result.error).toBe(`2nd, ${errValue}`);
    });

    test("promise async all ok", async () => {
        function myFunc(): ResultAsync<number, string> {
            return safeTry<number, string>(async function* () {
                return ok(
                    (yield* (await promiseGood()).mapErr(e => `1st, ${e}`)) +
                        (yield* asyncGood().mapErr(e => `2nd, ${e}`)),
                );
            });
        }

        const result = await myFunc();
        expect(result.isOk()).toBe(true);
        expect(result.value).toBe(okValue + okValue);
    });
});

describe("it yields and works without safeUnwrap", () => {
    test("With Ok", () => {
        const res: Result<string, string> = ok("ok");

        const actual = safeTry(function* () {
            const x = yield* res;
            return ok(x);
        });

        expect(actual).toBeInstanceOf(Ok);
        expect(actual.value).toBe("ok");
    });

    test("With Err", () => {
        const res: Result<number, string> = err("error");

        const actual = safeTry(function* () {
            const x = yield* res;
            return ok(x);
        });

        expect(actual).toBeInstanceOf(Err);
        expect(actual.error).toBe("error");
    });

    const okValue = 3;
    const errValue = "err!";

    function good(): Result<number, string> {
        return ok(okValue);
    }
    function bad(): Result<number, string> {
        return err(errValue);
    }
    function promiseGood(): Promise<Result<number, string>> {
        return Promise.resolve(ok(okValue));
    }
    function promiseBad(): Promise<Result<number, string>> {
        return Promise.resolve(err(errValue));
    }
    function asyncGood(): ResultAsync<number, string> {
        return okAsync(okValue);
    }
    function asyncBad(): ResultAsync<number, string> {
        return errAsync(errValue);
    }

    test("mayFail2 error", () => {
        function fn(): Result<number, string> {
            return safeTry<number, string>(function* () {
                const first = yield* good().mapErr(e => `1st, ${e}`);
                const second = yield* bad().mapErr(e => `2nd, ${e}`);

                return ok(first + second);
            });
        }

        const result = fn();
        expect(result.isErr()).toBe(true);
        expect(result.error).toBe(`2nd, ${errValue}`);
    });

    test("all ok", () => {
        function myFunc(): Result<number, string> {
            return safeTry<number, string>(function* () {
                const first = yield* good().mapErr(e => `1st, ${e}`);
                const second = yield* good().mapErr(e => `2nd, ${e}`);
                return ok(first + second);
            });
        }

        const result = myFunc();
        expect(result.isOk()).toBe(true);
        expect(result.value).toBe(okValue + okValue);
    });

    test("async mayFail1 error", async () => {
        function myFunc(): ResultAsync<number, string> {
            return safeTry<number, string>(async function* () {
                const first = yield* (await promiseBad()).mapErr(e => `1st, ${e}`);
                const second = yield* asyncGood().mapErr(e => `2nd, ${e}`);
                return ok(first + second);
            });
        }

        const result = await myFunc();
        expect(result.isErr()).toBe(true);
        expect(result.error).toBe(`1st, ${errValue}`);
    });

    test("async mayFail2 error", async () => {
        function myFunc(): ResultAsync<number, string> {
            return safeTry<number, string>(async function* () {
                const goodResult = await promiseGood();
                const value = yield* goodResult.mapErr(e => `1st, ${e}`);
                const value2 = yield* asyncBad().mapErr(e => `2nd, ${e}`);

                return okAsync(value + value2);
            });
        }

        const result = await myFunc();
        expect(result.isErr()).toBe(true);
        expect(result.error).toBe(`2nd, ${errValue}`);
    });

    test("promise async all ok", async () => {
        function myFunc(): ResultAsync<number, string> {
            return safeTry<number, string>(async function* () {
                const first = yield* (await promiseGood()).mapErr(e => `1st, ${e}`);
                const second = yield* asyncGood().mapErr(e => `2nd, ${e}`);
                return ok(first + second);
            });
        }

        const result = await myFunc();
        expect(result.isOk()).toBe(true);
        expect(result.value).toBe(okValue + okValue);
    });
});
