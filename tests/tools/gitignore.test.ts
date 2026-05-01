import { describe, expect, test } from "vitest";

import { convertGitignorePatternToMinimatch } from "@/tools/gitignore";

// Test cases are derived from the official git documentation on gitignore rules:
// https://git-scm.com/docs/gitignore

describe("convertGitignorePatternToMinimatch", () => {
    // Rule: A blank line matches no files, so it can serve as a separator for readability.
    describe("blank lines", () => {
        test("empty string returns null", () => {
            expect(convertGitignorePatternToMinimatch("")).toBeNull();
        });

        test("spaces-only string returns null", () => {
            expect(convertGitignorePatternToMinimatch("   ")).toBeNull();
        });

        test("tab-only string returns null", () => {
            expect(convertGitignorePatternToMinimatch("\t")).toBeNull();
        });

        test("mixed whitespace-only string returns null", () => {
            expect(convertGitignorePatternToMinimatch(" \t ")).toBeNull();
        });
    });

    // Rule: A line starting with # serves as a comment.
    // Put a backslash ("\") in front of the first "#" for patterns that begin with a hash.
    describe("comments", () => {
        test("line starting with # returns null", () => {
            expect(convertGitignorePatternToMinimatch("# comment")).toBeNull();
        });

        test("bare # returns null", () => {
            expect(convertGitignorePatternToMinimatch("#")).toBeNull();
        });

        test("## double hash returns null", () => {
            expect(convertGitignorePatternToMinimatch("## double hash")).toBeNull();
        });

        test("\\# escapes leading hash, treating it as a literal character", () => {
            expect(convertGitignorePatternToMinimatch("\\#comment")).toBe("**/#comment");
        });
    });

    // Rule: An optional prefix "!" which negates the pattern.
    // Put a backslash ("\") in front of the first "!" for patterns that begin with a literal "!".
    describe("negation", () => {
        test("! prefix negates a simple pattern", () => {
            expect(convertGitignorePatternToMinimatch("!foo")).toBe("!**/foo");
        });

        test("! prefix with anchored pattern (leading slash)", () => {
            expect(convertGitignorePatternToMinimatch("!/foo")).toBe("!foo");
        });

        test("! prefix with directory pattern", () => {
            expect(convertGitignorePatternToMinimatch("!foo/")).toBe("!**/foo/**");
        });

        test("! prefix with wildcard", () => {
            expect(convertGitignorePatternToMinimatch("!*.log")).toBe("!**/*.log");
        });

        test("! prefix with middle-slash pattern", () => {
            expect(convertGitignorePatternToMinimatch("!foo/bar")).toBe("!foo/bar");
        });

        test("\\! escapes leading !, treating it as a literal character", () => {
            expect(convertGitignorePatternToMinimatch("\\!important")).toBe("**/!important");
        });
    });

    // Rule: Otherwise the pattern may also match at any level below the .gitignore level.
    // (Patterns without a separator can match at any directory level.)
    describe("unanchored patterns — no slash means match at any level", () => {
        test("simple filename matches anywhere", () => {
            expect(convertGitignorePatternToMinimatch("foo")).toBe("**/foo");
        });

        test("filename with extension matches anywhere", () => {
            expect(convertGitignorePatternToMinimatch("foo.txt")).toBe("**/foo.txt");
        });

        test("* wildcard matches anywhere", () => {
            expect(convertGitignorePatternToMinimatch("*.log")).toBe("**/*.log");
        });

        test("? wildcard matches anywhere", () => {
            expect(convertGitignorePatternToMinimatch("?oo")).toBe("**/?oo");
        });

        test("character range matches anywhere", () => {
            expect(convertGitignorePatternToMinimatch("[Mm]akefile")).toBe("**/[Mm]akefile");
        });

        test("combined wildcards match anywhere", () => {
            expect(convertGitignorePatternToMinimatch("*.[oa]")).toBe("**/*.[oa]");
        });
    });

    // Rule: If there is a separator at the beginning or middle (or both) of the pattern,
    // then the pattern is relative to the level of the particular .gitignore file itself.
    describe("leading slash — anchored to the root", () => {
        test("leading slash makes pattern anchored", () => {
            expect(convertGitignorePatternToMinimatch("/foo")).toBe("foo");
        });

        test("leading slash with file extension", () => {
            expect(convertGitignorePatternToMinimatch("/foo.txt")).toBe("foo.txt");
        });

        test("leading slash with wildcard", () => {
            expect(convertGitignorePatternToMinimatch("/*.txt")).toBe("*.txt");
        });

        test("leading slash with nested path", () => {
            expect(convertGitignorePatternToMinimatch("/foo/bar")).toBe("foo/bar");
        });
    });

    describe("middle slash — anchored to the root", () => {
        test("middle slash makes pattern anchored", () => {
            expect(convertGitignorePatternToMinimatch("foo/bar")).toBe("foo/bar");
        });

        test("directory and wildcard pattern is anchored", () => {
            expect(convertGitignorePatternToMinimatch("dir/*.log")).toBe("dir/*.log");
        });

        test("deep path pattern is anchored", () => {
            expect(convertGitignorePatternToMinimatch("foo/bar/baz")).toBe("foo/bar/baz");
        });
    });

    // Rule: If there is a separator at the end of the pattern then the pattern will only match
    // directories, otherwise the pattern can match both files and directories.
    describe("trailing slash — directory-only patterns", () => {
        test("trailing slash on unanchored name matches directory anywhere", () => {
            expect(convertGitignorePatternToMinimatch("foo/")).toBe("**/foo/**");
        });

        test("leading slash and trailing slash matches directory at root", () => {
            expect(convertGitignorePatternToMinimatch("/foo/")).toBe("foo/**");
        });

        test("middle path with trailing slash matches directory at anchored path", () => {
            expect(convertGitignorePatternToMinimatch("foo/bar/")).toBe("foo/bar/**");
        });

        test("negated trailing slash pattern", () => {
            expect(convertGitignorePatternToMinimatch("!build/")).toBe("!**/build/**");
        });
    });

    // Rule: A trailing "/**" matches everything inside.
    // For example, "abc/**" matches all files inside directory "abc".
    describe("trailing /** — everything inside a directory", () => {
        test("abc/** matches everything inside abc", () => {
            expect(convertGitignorePatternToMinimatch("abc/**")).toBe("abc/**");
        });

        test("src/** matches everything inside src", () => {
            expect(convertGitignorePatternToMinimatch("src/**")).toBe("src/**");
        });
    });

    // Rule: A leading "**" followed by a slash means match in all directories.
    // For example, "**/foo" matches file or directory "foo" anywhere.
    // "**/foo/bar" matches file or directory "bar" directly under directory "foo" anywhere.
    describe("leading **/ — match in all directories", () => {
        test("**/foo matches foo anywhere (equivalent to foo without slash)", () => {
            expect(convertGitignorePatternToMinimatch("**/foo")).toBe("**/foo");
        });

        test("**/foo/bar matches bar directly under foo anywhere", () => {
            expect(convertGitignorePatternToMinimatch("**/foo/bar")).toBe("**/foo/bar");
        });
    });

    // Rule: A slash followed by two consecutive asterisks followed by a slash matches
    // zero or more directories. For example, "a/**/b" matches "a/b", "a/x/b", "a/x/y/b".
    describe("/**/ middle — zero or more intermediate directories", () => {
        test("a/**/b matches a/b, a/x/b, a/x/y/b", () => {
            expect(convertGitignorePatternToMinimatch("a/**/b")).toBe("a/**/b");
        });

        test("src/**/test matches test under any subdirectory of src", () => {
            expect(convertGitignorePatternToMinimatch("src/**/test")).toBe("src/**/test");
        });
    });

    // Rule: Trailing spaces can be marked by backslash ("\");
    // otherwise trailing whitespace is ignored.
    describe("trailing whitespace", () => {
        test("trailing spaces are stripped", () => {
            expect(convertGitignorePatternToMinimatch("foo   ")).toBe("**/foo");
        });

        test("trailing tabs are stripped", () => {
            expect(convertGitignorePatternToMinimatch("foo\t\t")).toBe("**/foo");
        });

        test("trailing mixed whitespace is stripped", () => {
            expect(convertGitignorePatternToMinimatch("foo \t ")).toBe("**/foo");
        });

        test("escaped trailing space is preserved", () => {
            expect(convertGitignorePatternToMinimatch("foo\\ ")).toBe("**/foo\\ ");
        });

        test("double backslash before space strips the space (backslash escapes itself)", () => {
            expect(convertGitignorePatternToMinimatch("foo\\\\ ")).toBe("**/foo\\\\");
        });
    });
});
