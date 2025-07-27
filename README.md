# @goodbyenjn/utils

[![npm version](https://badge.fury.io/js/@goodbyenjn%2Futils.svg)](https://badge.fury.io/js/@goodbyenjn%2Futils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

GoodbyeNJN's utility library for TypeScript and JavaScript, providing a collection of common utility functions and types.

## Features

- 🚀 **Modern**: Built with TypeScript, targeting ES modules
- 🔒 **Type-safe**: Full TypeScript support with comprehensive type definitions
- 📦 **Modular**: Import only what you need with tree-shakable exports
- 🛡️ **Result Type**: Functional error handling with Result pattern
- 📁 **File System**: Safe file system operations with Result types
- 🧰 **Common Utils**: String, math, promise, and other utility functions
- 📊 **Remeda Extensions**: Extended utilities built on top of Remeda

## Installation

```bash
npm install @goodbyenjn/utils
# or
pnpm add @goodbyenjn/utils
# or
yarn add @goodbyenjn/utils
```

## Usage

### Common Utilities

```typescript
import { sleep, template, unindent, debounce } from "@goodbyenjn/utils";

// Promise utilities
await sleep(1000); // Sleep for 1 second

// String utilities
const text = template("Hello, {name}!", { name: "World" });
console.log(text); // "Hello, World!"

const code = unindent`
    function example() {
        return 'formatted';
    }
`;

// Throttling and debouncing
const debouncedFn = debounce(() => console.log("Called!"), 300);
```

### File System Operations

```typescript
import { safeReadFile, safeWriteFile, safeExists } from "@goodbyenjn/utils/fs";

// Safe file operations that return Result types
const fileResult = await safeReadFile("config.json", "utf8");
if (fileResult.isOk()) {
    console.log("File content:", fileResult.value);
} else {
    console.error("Failed to read file:", fileResult.error);
}

// Check if file exists
const existsResult = await safeExists("path/to/file.txt");
if (existsResult.isOk() && existsResult.value) {
    console.log("File exists!");
}
```

### Result Pattern

```typescript
import { Ok, Err, fromThrowable } from "@goodbyenjn/utils/result";

// Create results
const success = Ok(42);
const failure = Err("Something went wrong");

// Handle results
if (success.isOk()) {
    console.log("Value:", success.value); // 42
}

// Convert throwing functions to Result
const safeParseInt = fromThrowable(parseInt);
const result = safeParseInt("not-a-number");
if (result.isErr()) {
    console.log("Parse failed:", result.error);
}
```

### Extended Remeda Utilities

```typescript
import { hasOwnProperty, isPromiseLike } from "@goodbyenjn/utils/remeda";

// Type-safe property checking
const obj = { name: "John", age: 30 };
if (hasOwnProperty(obj, "name")) {
    console.log(obj.name); // TypeScript knows this is safe
}

// Promise detection
if (isPromiseLike(someValue)) {
    const result = await someValue;
}
```

### Type Utilities

```typescript
import type { Nullable, YieldType } from "@goodbyenjn/utils/types";

// Nullable type for values that can be null or undefined
type User = {
    id: string;
    name: string;
    email: Nullable<string>; // string | null | undefined
};

// Extract yield type from generators
function* numberGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

type NumberType = YieldType<typeof numberGenerator>; // number
```

## API Reference

### Available Modules

- **Main (`@goodbyenjn/utils`)** - Common utilities (string, math, promise, error handling, etc.)
- **File System (`@goodbyenjn/utils/fs`)** - Safe file system operations
- **Result (`@goodbyenjn/utils/result`)** - Functional error handling
- **Remeda (`@goodbyenjn/utils/remeda`)** - Extended Remeda utilities
- **Types (`@goodbyenjn/utils/types`)** - Utility types for TypeScript

### Core Functions

#### String Utilities

- `template(str, vars)` - Simple string templating
- `unindent(str)` - Remove common indentation
- `addPrefix/removePrefix` - Prefix manipulation
- `addSuffix/removeSuffix` - Suffix manipulation
- `toForwardSlash` - Convert backslashes to forward slashes

#### Promise Utilities

- `sleep(ms)` - Async sleep function
- `createLock()` - Create a mutex lock
- `createSingleton(factory)` - Create singleton factory
- `PromiseWithResolvers` - Promise with external resolvers

#### Math Utilities

- `linear(value, range)` - Linear interpolation
- `scale(value, inRange, outRange)` - Scale value between ranges

#### Error Handling

- `normalizeError(error)` - Normalize any value to Error
- `getErrorMessage(error)` - Extract error message safely

#### Throttling

- `debounce(fn, delay, options)` - Debounce function calls
- `throttle(fn, delay, options)` - Throttle function calls

## Requirements

- Node.js >= 18
- TypeScript >= 4.5 (for TypeScript users)

## Development

```bash
# Install dependencies
pnpm install

# Build the library
pnpm run build

# Clean build artifacts
pnpm run clean
```

## License

MIT © [GoodbyeNJN](https://github.com/GoodbyeNJN)

## Links

- [GitHub Repository](https://github.com/GoodbyeNJN/utils)
- [npm Package](https://www.npmjs.com/package/@goodbyenjn/utils)
- [Issues](https://github.com/GoodbyeNJN/utils/issues)
