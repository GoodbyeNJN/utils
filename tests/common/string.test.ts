import { describe, expect, test } from "vitest";

import { indent, unindent } from "@/common/string";

describe("unindent", () => {
    test("basic unindent, no trim", () => {
        const input = `  hello
  world`;
        const result = unindent(false, false)(input);
        expect(result).toMatchInlineSnapshot(`
          "hello
          world"
        `);
    });

    test("trim start and end", () => {
        const input = " \n  hello\n  world\n ";
        const result = unindent(true, true)(input);
        expect(result).toMatchInlineSnapshot(`
          "hello
          world"
        `);
    });

    test("no trim", () => {
        const input = " \n  hello\n  world\n ";
        const result = unindent(false, false)(input);
        expect(result).toMatchInlineSnapshot(`
          "
          hello
          world
          "
        `);
    });

    test("trim start only", () => {
        const input = " \n  hello\n  world\n ";
        const result = unindent(true, false)(input);
        expect(result).toMatchInlineSnapshot(`
          "hello
          world
          "
        `);
    });

    test("trim end only", () => {
        const input = " \n  hello\n  world\n ";
        const result = unindent(false, true)(input);
        expect(result).toMatchInlineSnapshot(`
          "
          hello
          world"
        `);
    });

    test("multiple empty lines, full trim", () => {
        const input = `

  hello
  world

`;
        const result = unindent(true, true)(input);
        expect(result).toMatchInlineSnapshot(`
          "hello
          world"
        `);
    });

    test("all whitespace, no trim", () => {
        const input = "\n  \n    \n";
        const result = unindent(false, false)(input);
        expect(result).toBe("\n  \n    \n");
    });

    test("all whitespace, full trim", () => {
        const input = "\n  \n    \n";
        const result = unindent(true, true)(input);
        expect(result).toBe("");
    });

    test("mixed indentation", () => {
        const input = `    base
      nested
    end`;
        const result = unindent(false, false)(input);
        expect(result).toMatchInlineSnapshot(`
          "base
            nested
          end"
        `);
    });

    test("empty line in middle", () => {
        const input = "  line1\n\n  line2";
        const result = unindent(false, false)(input);
        expect(result).toMatchInlineSnapshot(`
          "line1

          line2"
        `);
    });

    test("no common indentation", () => {
        const input = `hello
world`;
        const result = unindent(false, false)(input);
        expect(result).toMatchInlineSnapshot(`
          "hello
          world"
        `);
    });

    test("tab indentation", () => {
        const input = `		hello
        world`;
        const result = unindent(false, false)(input);
        expect(result).toMatchInlineSnapshot(`
          "hello
                world"
        `);
    });

    test("default trim behavior with direct call", () => {
        const input = `
  hello
  world
`;
        const result = unindent(input);
        expect(result).toMatchInlineSnapshot(`
          "hello
          world"
        `);
    });

    test("default trim behavior with template string", () => {
        const result = unindent`
            hello
            world
        `;
        expect(result).toMatchInlineSnapshot(`
          "hello
          world"
        `);
    });
});

describe("indent", () => {
    test("basic indent, default space", () => {
        const input = `hello
world`;
        const result = indent(2)(input);
        expect(result).toMatchInlineSnapshot(`
          "  hello
            world"
        `);
    });

    test("custom indent string (tab)", () => {
        const input = `hello
world`;
        const result = indent("\t")(input);
        expect(result).toMatchInlineSnapshot(`
          "	hello
          	world"
        `);
    });

    test("custom indent string", () => {
        const input = `hello
world`;
        const result = indent(">>")(input);
        expect(result).toMatchInlineSnapshot(`
          ">>hello
          >>world"
        `);
    });

    test("skip whitespace-only lines", () => {
        const input = `
hello

world
`;
        const result = indent(2)(input);
        expect(result).toMatchInlineSnapshot(`
          "  hello

            world"
        `);
    });

    test("trim start and end", () => {
        const input = `
hello
world
`;
        const result = indent(2, true, true)(input);
        expect(result).toMatchInlineSnapshot(`
          "  hello
            world"
        `);
    });

    test("no trim", () => {
        const input = `
hello
world
`;
        const result = indent(2, false, false)(input);
        expect(result).toMatchInlineSnapshot(`
          "
            hello
            world
          "
        `);
    });

    test("trim start only", () => {
        const input = `
hello
world
`;
        const result = indent(2, true, false)(input);
        expect(result).toMatchInlineSnapshot(`
          "  hello
            world
          "
        `);
    });

    test("trim end only", () => {
        const input = `hello
world
`;
        const result = indent(2, false, true)(input);
        expect(result).toMatchInlineSnapshot(`
          "  hello
            world"
        `);
    });

    test("multiple indent levels", () => {
        const input = `a
b
c`;
        const result = indent(3)(input);
        expect(result).toMatchInlineSnapshot(`
          "   a
             b
             c"
        `);
    });

    test("empty input", () => {
        const input = "";
        const result = indent(2)(input);
        expect(result).toMatchInlineSnapshot(`""`);
    });

    test("single line input", () => {
        const input = "hello";
        const result = indent(2)(input);
        expect(result).toMatchInlineSnapshot(`"  hello"`);
    });

    test("with template string", () => {
        const result = indent(2)`
            if (a) {
              b()
            }
        `;
        expect(result).toMatchInlineSnapshot(`
          "              if (a) {
                          b()
                        }"
        `);
    });

    test("nested indentation", () => {
        const input = `level1
  level2
    level3`;
        const result = indent(2)(input);
        expect(result).toMatchInlineSnapshot(`
          "  level1
              level2
                level3"
        `);
    });

    test("lines with trailing spaces", () => {
        const input = `hello
world  `;
        const result = indent(" ")(input);
        expect(result).toMatchInlineSnapshot(`
          " hello
           world  "
        `);
    });

    test("trim both", () => {
        const input = `
hello
world
 `;
        const result = indent(2, true, true)(input);
        expect(result).toMatchInlineSnapshot(`
          "  hello
            world"
        `);
    });
});
