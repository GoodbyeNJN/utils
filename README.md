# @goodbyenjn/utils

[![npm version](https://badge.fury.io/js/@goodbyenjn%2Futils.svg)](https://badge.fury.io/js/@goodbyenjn%2Futils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern TypeScript/JavaScript utility library providing a comprehensive collection of type-safe utility functions, functional error handling with the Result and Option patterns, filesystem operations, and shell command execution.

## Features

- 🚀 **Modern**: Built with TypeScript, targeting ES modules and modern JavaScript
- 🔒 **Type-safe**: Full TypeScript support with comprehensive type definitions and type inference
- 📦 **Modular**: Import only what you need with tree-shakable exports and multiple entry points
- 🛡️ **Result & Option Pattern**: Functional error handling and optional values without exceptions, based on Rust-style Result and Option types
- 📁 **VFile & FS**: Type-safe file system operations and a powerful virtual file object
- 🐚 **Exec**: Powerful and flexible command execution with safe and unsafe variants
- 🧰 **Common Utilities**: String manipulation, math operations, promise utilities, and JSON handling
- 📊 **FP Utilities**: Functional programming utilities built on top of [Remeda](https://remedajs.com/) and [Rotery](https://github.com/nicolo-ribaudo/rotery), including async iteration helpers

## Installation

```bash
npm install @goodbyenjn/utils
# or
pnpm add @goodbyenjn/utils
# or
yarn add @goodbyenjn/utils
```

## Usage

### Quick Start

```typescript
// Import what you need from the main module
import { sleep, template } from "@goodbyenjn/utils";
import { exec } from "@goodbyenjn/utils/exec";
import { exec as safeExec } from "@goodbyenjn/utils/exec/safe";
import { BaseVFile } from "@goodbyenjn/utils/fs";
import { readFile as safeReadFile } from "@goodbyenjn/utils/fs/safe";
import { Ok, Result } from "@goodbyenjn/utils/result";
import { parse } from "@goodbyenjn/utils/json";
import { parse as safeParse } from "@goodbyenjn/utils/json/safe";
import { Some, None } from "@goodbyenjn/utils/option";
import type { Nullable, SetOptional } from "@goodbyenjn/utils/types";

// Enable global type augmentations (better Object.keys, Map.has, Array.filter, etc.)
import "@goodbyenjn/utils/global-types";
```

### Common Utilities

#### String Operations

```typescript
import { template, unindent, addPrefix, removeSuffix, joinWith, splitBy } from "@goodbyenjn/utils";

// String templating
const greeting = template("Hello, {name}! You are {age} years old.", {
    name: "Alice",
    age: 30,
});
console.log(greeting); // "Hello, Alice! You are 30 years old."

// Remove common indentation from template strings (default: trim start and end)
const code = unindent`
    function example() {
        return 'formatted';
    }
`;
console.log(code);
/*
function example() {
    return 'formatted';
}
*/

// Custom trim behavior with factory function
const codeNoTrim = unindent(false, false)`
    function example() {
        return 'formatted';
    }
`;
console.log(codeNoTrim);
/*

function example() {
    return 'formatted';
}

*/

// Only trim start, keep end
const onlyTrimStart = unindent(true, false)("  hello\n  world\n");
console.log(onlyTrimStart); // "hello\nworld\n"

// Add indentation to strings
const indented = indent(2)`
    if (a) {
        b()
    }
`;
console.log(indented);
/*
      if (a) {
          b()
      }
*/

// With custom string
const arrowIndented = indent(">>")("line1\nline2");
console.log(arrowIndented); // ">>line1\n>>line2"

// Only trim start, keep end
const onlyTrimStart = indent(2, true, false)("hello\nworld\n");
console.log(onlyTrimStart); // "  hello\n  world\n"

// Prefix and suffix operations
const withPrefix = addPrefix("@", "myfile"); // "@myfile"
const cleaned = removeSuffix(".js", "script.js"); // "script"

// String joining and splitting
const path = joinWith("/", "home", "user", "docs"); // "/home/user/docs"
const parts = splitBy("-", "hello-world-js"); // ["hello", "world", "js"]

// Split string by line breaks (handles both \n and \r\n)
const lines = splitByLineBreak("line1\nline2\r\nline3");
console.log(lines); // ["line1", "line2", "line3"]

// Parse boolean value with custom default
const isEnabled = parseValueToBoolean("yes", false); // true
const debugMode = parseValueToBoolean("invalid", "auto"); // "auto"
```

#### Promise Utilities

```typescript
import { sleep, createLock, createSingleton, createPromiseWithResolvers } from "@goodbyenjn/utils";

// Sleep/delay execution
await sleep(1000); // Wait 1 second

// Create a reusable mutex lock
const lock = createLock();
await lock.acquire();
try {
    // Critical section
    console.log("Executing exclusively");
} finally {
    lock.release();
}

// Singleton pattern factory
const getDatabase = createSingleton(() => {
    console.log("Initializing database...");
    return new Database();
});
const db1 = await getDatabase(); // Initializes once
const db2 = await getDatabase(); // Returns same instance

// Promise with external resolvers
const { promise, resolve, reject } = createPromiseWithResolvers<string>();
setTimeout(() => resolve("done!"), 1000);
const result = await promise;
```

### Command Execution

```typescript
import { exec } from "@goodbyenjn/utils/exec";
import { exec as safeExec } from "@goodbyenjn/utils/exec/safe";

// 1. Unsafe Execution (throws on failure)
const output = await exec`npm install`;
console.log(output.stdout);

// String command with args
const lsOutput = await exec("ls", ["-la"]);
console.log(lsOutput.stdout);

// 2. Safe Execution (returns Result)
const safeOutput = await safeExec`npm install`;
if (safeOutput.isOk()) {
    console.log("Success:", safeOutput.unwrap().stdout);
} else {
    // Result contains error information (e.g., NonZeroExitError)
    console.error("Failed:", safeOutput.unwrapErr().message);
}

// 3. Pipe Output
const piped = await exec`echo "hello"`.pipe`cat`;
console.log(piped.stdout);

// 4. Iterate Output
for await (const line of exec`cat large-file.txt`) {
    console.log(line);
}

// 5. Configuration Factory
const withCwd = exec({ cwd: "/path/to/project" });
const result3 = await withCwd`npm install`;
```

#### Math Utilities

```typescript
import { linear, scale } from "@goodbyenjn/utils";

// Linear interpolation between values
const mid = linear(0.5, [0, 100]); // 50

// Scale a value from one range to another
const scaledValue = scale(75, [0, 100], [0, 1]); // 0.75
const percentage = scale(200, [0, 255], [0, 100]); // 78.43...
```

#### Error Handling

```typescript
import { normalizeError, getErrorMessage } from "@goodbyenjn/utils";

// Normalize any value to an Error object
const error = normalizeError("Something went wrong");
const typeError = normalizeError({ code: 500 });

// Safely extract error message
const message1 = getErrorMessage(new Error("Oops"));
const message2 = getErrorMessage("Plain string error");
const message3 = getErrorMessage(null); // "Unknown error"
```

#### Throttling and Debouncing

```typescript
import { debounce, throttle } from "@goodbyenjn/utils/fp";

// Debounce - wait for inactivity before executing
const debouncedSearch = debounce((query: string) => {
    console.log("Searching for:", query);
}, 300);

// Call multiple times, executes only after 300ms of inactivity
input.addEventListener("input", e => {
    debouncedSearch((e.target as HTMLInputElement).value);
});

// Throttle - execute at most once per interval
const throttledScroll = throttle(() => {
    console.log("Scroll position:", window.scrollY);
}, 100);

window.addEventListener("scroll", throttledScroll);
```

#### JSON Handling

```typescript
import { parse, stringify } from "@goodbyenjn/utils/json";
// Or use the safe-only entry point:
import { parse as safeParse, stringify as safeStringify } from "@goodbyenjn/utils/json/safe";

// Standard JSON parsing (returns value or nil)
const data = parse('{"a": 1}'); // Some({ a: 1 })
const invalid = parse("bad"); // None

// Safe JSON parsing (returns Result)
const result = safeParse('{"a": 1}');
if (result.isOk()) {
    console.log(result.unwrap().a);
}

// Safe stringify
const json = safeStringify({ a: 1 }); // Result<string, Error>
```

### File System Operations

```typescript
import {
    BaseVFile,
    exists as safeExists,
    mkdir as safeMkdir,
    readFile as safeReadFile,
    readFileByLine as safeReadFileByLine,
    readJson as safeReadJson,
    rm as safeRm,
    writeFile as safeWriteFile,
    writeJson as safeWriteJson,
} from "@goodbyenjn/utils/fs/safe";

// BaseVFile - Unified file handling
const vfile = new BaseVFile("example.json");

// Fluid path manipulation
vfile.filename("data").extname("ts");
console.log(vfile.basename()); // "data.ts"

// Cross-platform path handling
const relative = vfile.pathname.relative(); // "data.ts" (relative to cwd)
const absolute = vfile.pathname(); // "/full/path/to/data.ts"

// Built-in operations (available in extended VFile implementations)
// await vfile.read(); // Get content
// await vfile.write(); // Write content

const textResult = await safeReadFile("example.txt");
if (textResult.isOk()) {
    console.log("File content:", textResult.unwrap());
} else {
    console.error("Failed to read file:", textResult.unwrapErr().message);
}

// Read and parse JSON safely
const jsonResult = await safeReadJson("package.json");
if (jsonResult.isOk()) {
    const pkg = jsonResult.unwrap();
    console.log("Package name:", pkg.name);
}

// Write JSON file
const writeResult = await safeWriteJson("data.json", { users: [] }, 2);
if (writeResult.isErr()) {
    console.error("Write failed:", writeResult.unwrapErr());
}

// Check if file exists
const exists = await safeExists("path/to/file.txt");
if (exists) {
    console.log("File exists!");
}

// Create directories (recursive)
const mkResult = await safeMkdir("src/components/ui", { recursive: true });

// Delete files or directories
const rmResult = await safeRm("build", { recursive: true, force: true });

// Read file line by line
const lineResult = await safeReadFileByLine("large-file.log");
if (lineResult.isOk()) {
    for await (const line of lineResult.unwrap()) {
        console.log(line);
    }
}
```

### Glob Patterns

```typescript
import { glob, globSync, convertPathToPattern } from "@goodbyenjn/utils/glob";

// Async glob pattern matching
const files = await glob("src/**/*.{ts,tsx}", { cwd: "." });
console.log("Found files:", files);

// Synchronous version
const syncFiles = globSync("**/*.test.ts", { cwd: "tests" });

// Convert file path to glob pattern
const pattern = convertPathToPattern("/home/user/project");
```

### Result Pattern - Functional Error Handling

```typescript
import { Err, Ok, Result } from "@goodbyenjn/utils/result";

// Create results explicitly
const success = Ok(42);
const failure = Err("Something went wrong");

// Handle results with chainable methods
const doubled = success
    .map(value => value * 2) // Supports async: .map(async v => v * 2) returns Promise<Result>
    .mapErr(err => `Error: ${err}`)
    .unwrapOr(0); // 84

// Transform error type
const result: Result<string, Error> = Ok("value");
const transformed = result.mapErr(() => new Error("Custom error"));

// Convert throwing functions or promises to Result
async function fetchUser(id: string) {
    // Result.try catches thrown errors
    const user = await Result.try(() => JSON.parse(userJson));
    // Or handle promise rejections
    const user = await Result.try(fetch(`/api/users/${id}`));

    return user.map(u => u.name).mapErr(err => new Error(`Failed to parse user: ${err.message}`));
}

// Wrap a function to always return a Result
const safeParse = Result.wrap(JSON.parse, Error);
const data = safeParse('{"valid": true}'); // Result<any, Error>

// Combine multiple Results
const results = [Ok(1), Ok(2), Err("oops"), Ok(4)];
const combined = Result.all(results); // Err("oops")

// Generator-based "do" notation for flattening Results
const finalResult = Result.gen(function* () {
    const a = yield* Ok(10);
    const b = yield* Ok(20);
    return a + b;
}); // Ok(30)

// Supports async generators
const asyncFinal = await Result.gen(async function* () {
    const user = yield* await fetchUser("1");
    return user.name;
});
```

### Type Utilities

```typescript
import type {
    Nullable,
    Optional,
    YieldType,
    OmitByKey,
    SetNullable,
    TemplateFn,
    // New function types with `this` binding
    FnWithThis,
    AsyncFnWithThis,
    SyncFnWithThis,
    // Re-exported from type-fest
    SetOptional,
    SetRequired,
    PartialDeep,
    Simplify,
    LiteralUnion,
    PackageJson,
} from "@goodbyenjn/utils/types";

// ... (other types)

// Template string function type
const myTag: TemplateFn<string> = (strings, ...values) => {
    return strings[0] + values[0];
};

// Nullable type for values that can be null or undefined
type User = {
id: string;
name: string;
email: Nullable<string>; // string | null | undefined
};

// Optional type (undefined but not null)
type Profile = {
bio: Optional<string>; // string | undefined
};

// Extract yield type from generators
function\* numberGenerator() {
yield 1;
yield 2;
yield 3;
}

type NumberType = YieldType<typeof numberGenerator>; // number

// Omit properties by their value type
type Config = {
name: string;
debug: boolean;
verbose: boolean;
timeout: number;
};
type WithoutBooleans = OmitByKey<Config, boolean>; // { name: string; timeout: number }

// Set specific properties to nullable
type APIResponse = {
id: number;
name: string;
email: string;
};
type PartialResponse = SetNullable<APIResponse, "email" | "name">; // email and name become nullable
```

### FP Utilities

The library provides 100+ functional utilities via `@goodbyenjn/utils/fp`, built on top of [Remeda](https://remedajs.com/) and [Rotery](https://github.com/nicolo-ribaudo/rotery):

```typescript
import {
    // Custom type-checking helpers
    hasOwnProperty,
    isFunction,
    isPromiseLike,
    isOption, // check if a value is an Option
    isResult, // check if a value is a Result

    // Throttle / debounce (moved from main module)
    debounce,
    throttle,

    // Array operations (from Remeda)
    chunk,
    filter,
    find,
    flatMap,
    flatten,
    map,
    partition,
    reverse,
    take,
    drop,
    unique,

    // Object operations (from Remeda)
    pick,
    omit,
    merge,
    keys,
    values,
    entries,

    // Functional composition (from Remeda)
    pipe,
    compose,

    // Aggregations (from Remeda)
    groupBy,
    countBy,
    sumBy,

    // Async iteration (from Rotery, aliased with P suffix)
    filterP, // async filter
    mapP, // async map
    flatMapP, // async flatMap
    forEachP, // async forEach
    every, // sync every
    everyP, // async every
    some, // sync some
    someP, // async some
    toArray, // collect iterator to array
    toArrayP, // async collect
    flatten as flattenSync,
    flattenP, // async flatten
    reduceP, // async reduce
    concurrency, // limit concurrency
    buffer, // buffer items
} from "@goodbyenjn/utils/fp";

// Type-safe property checking
const obj = { name: "John", age: 30, active: true };
if (hasOwnProperty(obj, "name")) {
    console.log(obj.name); // TypeScript type narrowing
}

// Function type checking
const maybeCallback: unknown = (x: number) => x * 2;
if (isFunction(maybeCallback)) {
    maybeCallback(5);
}

// Promise detection
async function handleValue(value: any) {
    if (isPromiseLike(value)) {
        const result = await value;
        console.log("Async result:", result);
    }
}

// Functional data transformations
const users = [
    { id: 1, name: "Alice", role: "admin", active: true },
    { id: 2, name: "Bob", role: "user", active: false },
    { id: 3, name: "Charlie", role: "user", active: true },
];

// Chain operations with pipe
const adminNames = pipe(
    users,
    filter(u => u.role === "admin"),
    map(u => u.name),
); // ["Alice"]

// Group users by role
const byRole = groupBy(users, u => u.role);
// { admin: [...], user: [...] }

// Sum ages of active users
const totalAge = sumBy(
    filter(users, u => u.active),
    u => u.age ?? 0,
);

// Chunk array into groups
const chunked = chunk(users, 2);
// [[user1, user2], [user3]]

// Async iteration with Rotery helpers
const results = await pipe(
    [1, 2, 3],
    toIterator,
    mapP(async n => fetchUser(n)),
    filterP(async u => u.active),
    toArrayP,
);
```

## Requirements

- **Node.js**: >= 20.0.0
- **TypeScript**: >= 6.0 (for development/type checking)

Modern browsers are supported through ES module imports.

## Versioning

**Note:** This project does **not** follow Semantic Versioning (semver). Instead, it uses a calendar-based versioning scheme:

**Version Format:** `v<YY>.<M>.<PATCH>`

- `<YY>` - Release year (e.g., 26 for 2026)
- `<M>` - Release month (1-12)
- `<PATCH>` - Patch/revision number within the same month (starting from 0)

**Example versions:**

- `v26.1.0` - First release in January 2026
- `v26.1.1` - Second release in January 2026
- `v26.2.0` - First release in February 2026

This scheme provides clarity on when features were released while allowing multiple updates within the same month.

## Development

```bash
# Install dependencies
pnpm install

# Development mode with watch
pnpm run dev

# Build the library
pnpm run build

# Clean build artifacts
pnpm run clean

# Run tests (if configured)
pnpm run test
```

## Performance Considerations

- **Tree-shaking**: All modules are properly configured for tree-shaking. Import only what you need.
- **Result Pattern**: The Result type has minimal overhead compared to exceptions and enables better error handling.
- **Functional Composition**: Use Remeda utilities with pipe for efficient data transformations.
- **Shell Execution**: The `$` function safely escapes arguments and is suitable for production use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request at [GitHub Repository](https://github.com/GoodbyeNJN/utils).

## License

MIT © [GoodbyeNJN](https://github.com/GoodbyeNJN)

## Links

- [GitHub Repository](https://github.com/GoodbyeNJN/utils)
- [npm Package](https://www.npmjs.com/package/@goodbyenjn/utils)
- [Issue Tracker](https://github.com/GoodbyeNJN/utils/issues)
- [Remeda Documentation](https://remedajs.com/)

---

**Maintained with ❤️ by [GoodbyeNJN](https://github.com/GoodbyeNJN)**
