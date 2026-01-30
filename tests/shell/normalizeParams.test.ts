/* eslint-disable max-nested-callbacks */

import { describe, expect, test } from "vitest";

import { normalizeParams } from "@/shell/exec";

describe("normalizeParams", () => {
    describe("string command with args array", () => {
        test("command with args array", () => {
            const result = normalizeParams("npm", ["install", "lodash"]);
            expect(result).toEqual({
                command: "npm",
                args: ["install", "lodash"],
                options: undefined,
                factory: false,
            });
        });

        test("command with args array and options", () => {
            const result = normalizeParams("npm", ["install"], { timeout: 5000 });
            expect(result).toEqual({
                command: "npm",
                args: ["install"],
                options: { timeout: 5000 },
                factory: false,
            });
        });
    });

    describe("string command without args", () => {
        test("simple command string with args", () => {
            const result = normalizeParams("npm install");
            expect(result).toEqual({
                command: "npm",
                args: ["install"],
                options: undefined,
                factory: false,
            });
        });

        test("command string with multiple args", () => {
            const result = normalizeParams("npm install --save lodash");
            expect(result).toEqual({
                command: "npm",
                args: ["install", "--save", "lodash"],
                options: undefined,
                factory: false,
            });
        });

        test("command with quoted arguments", () => {
            const result = normalizeParams('echo "hello world"');
            expect(result).toEqual({
                command: "echo",
                args: ["hello world"],
                options: undefined,
                factory: false,
            });
        });

        test("command string with options", () => {
            const result = normalizeParams("npm install", undefined, { timeout: 5000 });
            expect(result).toEqual({
                command: "npm",
                args: ["install"],
                options: { timeout: 5000 },
                factory: false,
            });
        });
    });

    describe("template string", () => {
        test("basic template string", () => {
            const result = normalizeParams`npm install ${"lodash"}`;
            expect(result).toEqual({
                command: "npm",
                args: ["install", "lodash"],
                options: undefined,
                factory: false,
            });
        });

        test("template string with multiple values", () => {
            const result = normalizeParams`npm install ${"lodash"} ${"--save-dev"}`;
            expect(result).toEqual({
                command: "npm",
                args: ["install", "lodash", "--save-dev"],
                options: undefined,
                factory: false,
            });
        });

        test("template string with special characters", () => {
            const result = normalizeParams`ls -la ${"my-file.txt"}`;
            expect(result).toEqual({
                command: "ls",
                args: ["-la", "my-file.txt"],
                options: undefined,
                factory: false,
            });
        });
    });

    describe("options object (factory mode)", () => {
        test("options object returns factory mode", () => {
            const result = normalizeParams({ timeout: 5000 });
            expect(result).toEqual({
                command: "",
                args: undefined,
                options: { timeout: 5000 },
                factory: true,
            });
        });

        test("multiple options", () => {
            const result = normalizeParams({ throwOnError: true, timeout: 5000 });
            expect(result).toEqual({
                command: "",
                args: undefined,
                options: { throwOnError: true, timeout: 5000 },
                factory: true,
            });
        });
    });

    describe("error cases", () => {
        test("throw error on invalid command string", () => {
            // Using an unclosed quote to trigger tokenizer error
            expect(() => {
                normalizeParams("npm install 'unclosed");
            }).toThrow("Failed to parse command string");
        });

        test("throw error on empty command string", () => {
            expect(() => {
                normalizeParams("");
            }).toThrow("Failed to extract command from string");
        });

        test("throw error on template string with unclosed quote", () => {
            expect(() => {
                normalizeParams(
                    ["npm install '", ""] as unknown as TemplateStringsArray,
                    "unclosed",
                );
            }).toThrow("Failed to parse input template string");
        });

        test("throw error on invalid first parameter type", () => {
            expect(() => {
                normalizeParams(123 as any);
            }).toThrow("First parameter has an invalid type");
        });

        test("throw error on template string without command", () => {
            expect(() => {
                normalizeParams(["  ", ""] as unknown as TemplateStringsArray);
            }).toThrow("Failed to extract command from template string");
        });
    });

    describe("edge cases", () => {
        test("command with equals sign in args", () => {
            const result = normalizeParams("npm install --config=path/to/config");
            expect(result).toEqual({
                command: "npm",
                args: ["install", "--config=path/to/config"],
                options: undefined,
                factory: false,
            });
        });

        test("args array with empty string", () => {
            const result = normalizeParams("echo", [""]);
            expect(result).toEqual({
                command: "echo",
                args: [""],
                options: undefined,
                factory: false,
            });
        });

        test("args array is falsy (empty array)", () => {
            // Empty array is falsy in the condition check
            const result = normalizeParams("npm", null as any);
            expect(result).toEqual({
                command: "npm",
                args: [],
                options: undefined,
                factory: false,
            });
        });

        test("command with spaces", () => {
            const result = normalizeParams("   npm   install   ");
            expect(result.command).toBe("npm");
            expect(result.args).toContain("install");
        });
    });
});
