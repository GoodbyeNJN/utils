/* eslint-disable max-nested-callbacks */

import { describe, expect, it } from "vitest";

import { getProcessOptions, getSpawnCommand } from "@/exec/params";

describe("getSpawnCommand", () => {
    describe("command string", () => {
        it("should parse a simple command string into command and args", () => {
            expect(getSpawnCommand(["echo hello"])).toStrictEqual({
                command: "echo",
                args: ["hello"],
            });
        });

        it("should parse a command string with multiple args", () => {
            expect(getSpawnCommand(["echo hello world"])).toStrictEqual({
                command: "echo",
                args: ["hello", "world"],
            });
        });

        it("should handle quoted args in a command string", () => {
            expect(getSpawnCommand(['echo "hello world"'])).toStrictEqual({
                command: "echo",
                args: ["hello world"],
            });
        });

        it("should throw when the command string is empty", () => {
            expect(() => getSpawnCommand([""])).toThrow();
        });

        it("should throw when the command string is whitespace only", () => {
            expect(() => getSpawnCommand(["   "])).toThrow();
        });
    });

    describe("explicit args array", () => {
        it("should use the provided args array directly without further parsing", () => {
            expect(getSpawnCommand(["echo", ["hello", "world"]])).toStrictEqual({
                command: "echo",
                args: ["hello", "world"],
            });
        });

        it("should accept an empty args array", () => {
            expect(getSpawnCommand(["echo", []])).toStrictEqual({ command: "echo", args: [] });
        });
    });

    describe("template string", () => {
        it("should parse a template string with no interpolations", () => {
            const tpl = Object.assign(["echo hello"], { raw: ["echo hello"] });
            expect(getSpawnCommand([tpl])).toStrictEqual({ command: "echo", args: ["hello"] });
        });

        it("should parse a template string with interpolated values", () => {
            const tpl = Object.assign(["echo ", ""], { raw: ["echo ", ""] });
            expect(getSpawnCommand([tpl, "world"])).toStrictEqual({
                command: "echo",
                args: ["world"],
            });
        });

        it("should parse a template string with multiple interpolated values", () => {
            const tpl = Object.assign(["ls ", " ", ""], { raw: ["ls ", " ", ""] });
            expect(getSpawnCommand([tpl, "-la", "/tmp"])).toStrictEqual({
                command: "ls",
                args: ["-la", "/tmp"],
            });
        });
    });

    describe("invalid params", () => {
        it("should throw for a non-string, non-array first parameter", () => {
            expect(() => getSpawnCommand([123 as any])).toThrow(/Invalid first parameter/);
        });
    });
});

describe("getProcessOptions", () => {
    it("should return the options object when the first param is a plain object", () => {
        const options = { timeout: 1000, persist: true };
        expect(getProcessOptions([options])).toStrictEqual(options);
    });

    it("should return undefined when the first param is a command string", () => {
        expect(getProcessOptions(["echo hello"])).toBeUndefined();
    });

    it("should return undefined when the first param is a template strings array", () => {
        const tpl = Object.assign(["echo"], { raw: ["echo"] });
        expect(getProcessOptions([tpl])).toBeUndefined();
    });
});
