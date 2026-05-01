/* #__NO_SIDE_EFFECTS__ */
export const convertGitignorePatternToMinimatch = (pattern: string): string | null => {
    // Trim trailing unescaped whitespace (git spec: trailing spaces can be marked by backslash).
    // Count consecutive backslashes before the whitespace: odd = escaped (preserve), even = strip.
    let p = pattern.replace(/[ \t]+$/, (match, offset: number) => {
        const trailingBackslashes = pattern.slice(0, offset).match(/\\+$/)?.[0].length ?? 0;
        return trailingBackslashes % 2 === 1 ? match : "";
    });

    // A blank line matches no files
    if (!p) return null;

    // A line starting with # serves as a comment
    if (p.startsWith("#")) return null;

    // An optional prefix ! which negates the pattern
    const isNegated = p.startsWith("!");
    if (isNegated) p = p.slice(1);

    // Put a backslash in front of the first # or ! for patterns that begin with those characters
    if (p.startsWith("\\#") || p.startsWith("\\!")) {
        p = p.slice(1);
    }

    // If there is a separator at the end of the pattern then the pattern will only match directories
    const isDirectoryOnly = p.endsWith("/");
    if (isDirectoryOnly) p = p.slice(0, -1);

    // If there is a separator at the beginning or middle (or both) of the pattern, then the pattern
    // is relative to the level of the particular .gitignore file itself (anchored).
    // Otherwise the pattern may also match at any level below the .gitignore level.
    const isAnchored = p.includes("/");

    // Remove leading slash so the pattern is relative to root
    if (p.startsWith("/")) p = p.slice(1);

    // If not anchored, add **/ prefix to allow matching at any level
    if (!isAnchored) p = `**/${p}`;

    // If directory-only, add /** suffix to match all contents of the directory
    if (isDirectoryOnly) p = `${p}/**`;

    return isNegated ? `!${p}` : p;
};
