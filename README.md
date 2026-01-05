# @goodbyenjn/utils

[![npm version](https://badge.fury.io/js/@goodbyenjn%2Futils.svg)](https://badge.fury.io/js/@goodbyenjn%2Futils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern TypeScript/JavaScript utility library providing a comprehensive collection of type-safe utility functions, functional error handling with the Result pattern, and filesystem operations.

## Features

- 🚀 **Modern**: Built with TypeScript, targeting ES modules and modern JavaScript
- 🔒 **Type-safe**: Full TypeScript support with comprehensive type definitions and type inference
- 📦 **Modular**: Import only what you need with tree-shakable exports and multiple entry points
- 🛡️ **Result Pattern**: Functional error handling without exceptions, based on Rust-style Result types
- 📁 **Safe File System**: Type-safe file system operations with Result-based error handling
- 🧰 **Common Utilities**: String manipulation, math operations, promise utilities, shell commands, and error handling
- 📊 **Remeda Extensions**: Extended utilities built on top of [Remeda](https://remedajs.com/)

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
import { sleep, template, $ } from "@goodbyenjn/utils";
import { safeReadFile } from "@goodbyenjn/utils/fs";
import { ok, Result } from "@goodbyenjn/utils/result";
```

### Common Utilities

#### String Operations

```typescript
import { template, unindent, addPrefix, removeSuffix, join, split } from "@goodbyenjn/utils";

// String templating
const greeting = template("Hello, {name}! You are {age} years old.", {
    name: "Alice",
    age: 30,
});
console.log(greeting); // "Hello, Alice! You are 30 years old."

// Remove common indentation from template strings
const code = unindent`
    function example() {
        return 'formatted';
    }
`;
console.log(code); // properly dedented code

// Prefix and suffix operations
const withPrefix = addPrefix("@", "myfile"); // "@myfile"
const cleaned = removeSuffix(".js", "script.js"); // "script"

// String joining and splitting
const path = join("/", "home", "user", "docs"); // "/home/user/docs"
const parts = split("-", "hello-world-js"); // ["hello", "world", "js"]
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

#### Shell Command Execution

```typescript
import { $ } from "@goodbyenjn/utils";

// Execute shell commands safely using template literals
const result = await $`ls -la`;
if (result.isOk()) {
    console.log("Command succeeded:");
    console.log("stdout:", result.unwrap().stdout);
    console.log("stderr:", result.unwrap().stderr);
} else if (result.isErr()) {
    console.error("Command failed:", result.unwrapErr().message);
}

// Complex command with options
const { $ } = await import("@goodbyenjn/utils");
const deployResult = await $`docker build -t myapp .`;
if (deployResult.isOk()) {
    const { stdout, stderr } = deployResult.unwrap();
    console.log("Build output:", stdout);
}

// Using quoteShellArg for safe argument escaping
import { quoteShellArg } from "@goodbyenjn/utils";
const userInput = "'; rm -rf /;";
const safeArg = quoteShellArg(userInput); // Properly escaped for shell
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
import { debounce, throttle } from "@goodbyenjn/utils";

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

### File System Operations

```typescript
import {
    safeReadFile,
    safeWriteFile,
    safeExists,
    safeReadJson,
    safeWriteJson,
    safeMkdir,
    safeRm,
    safeReadFileByLine,
} from "@goodbyenjn/utils/fs";

// Read text file safely
const textResult = await safeReadFile("config.txt", "utf8");
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
const writeResult = await safeWriteJson("data.json", { users: [] }, { pretty: true });
if (writeResult.isErr()) {
    console.error("Write failed:", writeResult.unwrapErr());
}

// Check if file exists
const existsResult = await safeExists("path/to/file.txt");
if (existsResult.isOk() && existsResult.unwrap()) {
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
import { glob, globSync, convertPathToPattern } from "@goodbyenjn/utils/fs";

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
import { err, ok, Result, safeTry } from "@goodbyenjn/utils/result";

// Create results explicitly
const success = ok(42);
const failure = err("Something went wrong");

// Handle results with chainable methods
const doubled = success
    .map(value => value * 2)
    .mapErr(err => `Error: ${err}`)
    .unwrapOr(0); // 84

// Transform error type
const result: Result<string, Error> = ok("value");
const transformed = result.mapErr(() => new Error("Custom error"));

// Convert throwing functions to Result
async function fetchUser(id: string) {
    // If the function throws, it's caught and wrapped in Err
    const user = await Result.fromCallable(() => JSON.parse(userJson));

    return user.map(u => u.name).mapErr(err => new Error(`Failed to parse user: ${err.message}`));
}

// Combine multiple Results
const results = [ok(1), ok(2), err("oops"), ok(4)];
const combined = Result.all(...results); // Err("oops")

// Safe try-catch alternative
const safeTryExample = await safeTry(async () => {
    return await fetch("/api/data").then(r => r.json());
});

if (safeTryExample.isOk()) {
    console.log("Data:", safeTryExample.unwrap());
} else {
    console.error("Failed:", safeTryExample.unwrapErr());
}
```

### Type Utilities

```typescript
import type {
    Nullable,
    Optional,
    YieldType,
    OmitByKey,
    SetNullable,
} from "@goodbyenjn/utils/types";

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
function* numberGenerator() {
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

### Extended Remeda Utilities

The library includes 100+ utilities from [Remeda](https://remedajs.com/), a functional utility library optimized for TypeScript:

```typescript
import {
    // Property checking
    hasOwnProperty,
    isFunction,
    isPromiseLike,

    // Array operations
    chunk,
    compact,
    drop,
    dropLast,
    filter,
    find,
    flatMap,
    flatten,
    map,
    partition,
    reverse,
    slice,
    take,
    uniq,

    // Object operations
    pick,
    omit,
    merge,
    keys,
    values,
    entries,

    // Functional composition
    pipe,
    compose,

    // Utility functions
    clamp,
    groupBy,
    countBy,
    sumBy,
    minBy,
    maxBy,
} from "@goodbyenjn/utils/remeda";

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
```

## API Reference

### Module Exports

#### Main Module (`@goodbyenjn/utils`)

Common utilities for everyday programming tasks:

```typescript
// String utilities
export {
    template,
    unindent,
    addPrefix,
    addSuffix,
    removePrefix,
    removeSuffix,
    split,
    join,
    splitWithSlash,
    joinWithSlash,
    toForwardSlash,
    concatTemplateStrings,
};

// Promise utilities
export { sleep, createLock, createSingleton, createPromiseWithResolvers };

// Shell command execution
export { $, quoteShellArg };

// Math utilities
export { linear, scale };

// Error handling
export { normalizeError, getErrorMessage };

// Throttling/Debouncing
export { debounce, throttle };

// JSON utilities
export { stringify, parse, safeParse };

// Parsing utilities
export { parseKeyValuePairs, parseValueToBoolean };
```

#### File System Module (`@goodbyenjn/utils/fs`)

Type-safe file system operations with Result pattern error handling:

```typescript
// Safe operations (return Result types)
export {
    safeReadFile,
    safeReadFileSync,
    safeReadJson,
    safeReadJsonSync,
    safeReadFileByLine,
    safeWriteFile,
    safeWriteFileSync,
    safeWriteJson,
    safeWriteJsonSync,
    safeAppendFile,
    safeAppendFileSync,
    safeMkdir,
    safeMkdirSync,
    safeRm,
    safeRmSync,
    safeCp,
    safeCpSync,
    safeExists,
    safeExistsSync,
};

// Glob operations
export { glob, globSync, convertPathToPattern, escapePath, isDynamicPattern };

// Unsafe operations (throw on error)
export {
    readFile,
    readFileSync,
    readJson,
    readJsonSync,
    writeFile,
    writeFileSync,
    writeJson,
    writeJsonSync,
    mkdir,
    mkdirSync,
    // ... and more
};
```

#### Result Module (`@goodbyenjn/utils/result`)

Functional error handling without exceptions:

```typescript
// Main types and constructors
export { Result, ok as Ok, err as Err };

// Helper function
export { safeTry };

// Error class
export { ResultError };

// Type utilities
export type { Ok, Err, InferOkType, InferErrType, ExtractOkTypes, ExtractErrTypes, ResultAll };
```

**Result Methods:**

- `isOk()` / `isErr()` - Type guard checks
- `map(fn)` - Transform the Ok value
- `mapErr(fn)` - Transform the Err value
- `flatMap(fn)` / `andThen(fn)` - Chain operations
- `unwrap()` - Get value or throw
- `unwrapOr(default)` - Get value with fallback
- `expect(msg)` - Unwrap with custom error message
- `inspect(fn)` - Execute side effect on Ok
- `inspectErr(fn)` - Execute side effect on Err
- `static fromCallable(fn, onThrow?)` - Convert throwing function

#### Remeda Module (`@goodbyenjn/utils/remeda`)

Extended functional utilities from Remeda:

```typescript
// Custom implementations
export { hasOwnProperty, isFunction, isPromiseLike };

// Re-exported from Remeda (100+ functions)
export {
    // Predicates
    compact,
    filter,
    // Transformations
    map,
    flatMap,
    flatten,
    // Array operations
    chunk,
    slice,
    take,
    drop,
    uniq,
    reverse,
    // Object operations
    keys,
    values,
    entries,
    pick,
    omit,
    merge,
    // Aggregations
    groupBy,
    countBy,
    sumBy,
    maxBy,
    minBy,
    // Composition
    pipe,
    compose,
    // And 50+ more...
};
```

#### Types Module (`@goodbyenjn/utils/types`)

Utility types for TypeScript:

```typescript
// Type utilities
export type {
    Nullable, // T | null | undefined
    Optional, // T | undefined
    YieldType, // Extract yield type from generator
    OmitByKey, // Omit properties by their value type
    SetNullable, // Make specific properties nullable
    Fn, // (args: any[]) => any
    AsyncFn, // (...args: any[]) => Promise<any>
    SyncFn, // (...args: any[]) => any
    Promisable, // T | Promise<T>
    NonEmptyTuple, // Tuple with at least one element
};
```

### Common Patterns

#### Error Handling with Result

```typescript
// Instead of try-catch
async function loadConfig() {
    const result = await safeReadJson("config.json");

    // Pattern 1: Check and unwrap
    if (result.isErr()) {
        console.error("Failed to load config:", result.error);
        return null;
    }
    return result.value;

    // Pattern 2: Chain operations
    // return result
    //     .map(cfg => validateConfig(cfg))
    //     .unwrapOr(defaultConfig);
}
```

#### File Operations

```typescript
// Safe read with fallback
const result = await safeReadFile("path.txt", "utf8");
const content = result.unwrapOr("default content");

// Or handle error explicitly
const jsonResult = await safeReadJson("data.json");
if (jsonResult.isOk()) {
    processData(jsonResult.value);
} else {
    logger.error(jsonResult.error);
}
```

#### Functional Composition

```typescript
import { pipe, filter, map } from "@goodbyenjn/utils/remeda";

const result = pipe(
    data,
    filter(x => x.active),
    map(x => x.name),
);
```

## Requirements

- **Node.js**: >= 18.0.0
- **TypeScript**: >= 4.5 (for development/type checking)

Modern browsers are supported through ES module imports.

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
