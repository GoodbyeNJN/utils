import { And, ArraySlice, CamelCase, EmptyObject, GreaterThan, GreaterThanOrEqual, IfNever, IntRange, IsAny, IsEqual, IsFloat, IsInteger, IsLiteral, IsNegative, IsNever, IsNumericLiteral, IsStringLiteral, IsSymbolLiteral, Join, KeysOfUnion, LastArrayElement, LessThan, Merge, MergeDeep, NonNegative, NonNegativeInteger, Or, ReadonlyTuple, RequireAtLeastOne, SharedUnionFields, Simplify, Split, Subtract, Tagged, ValueOf, Words, Writable } from "./chunks/chunk-ea0120e4.js";

//#region src/remeda/types.d.ts

/**
 * An extension of Extract for type predicates which falls back to the base
 * in order to narrow the `unknown` case.
 *
 * @example
 *   function isMyType<T>(data: T | MyType): data is NarrowedTo<T, MyType> { ... }
 */
type NarrowedTo$1<T, Base> = Extract<T, Base> extends never ? Base : IsAny<T> extends true ? Base : Extract<T, Base>;
//#endregion
//#region src/remeda/hasOwnProperty.d.ts
/**
 *
 * @param data - The object to test.
 * @param properties - The properties to test against.
 * @signature
 *    R.hasOwnProperty(data, properties)
 * @example
 *    R.hasOwnProperty({ a: 1, b: 2, c: 3 }, ["a", "b"]) //=> true
 *    R.hasOwnProperty({ a: 1, b: 2, c: 3 }, ["d"]) //=> false
 * @dataFirst
 * @category Guard
 */
declare function hasOwnProperty<T extends object, P extends readonly PropertyKey[]>(data: Record<PropertyKey, unknown> | T, properties: P): data is NarrowedTo$1<T, { [K in P[number]]: unknown }>;
/**
 *
 * @param properties - The properties to test against.
 * @signature
 *    R.hasOwnProperty(properties)(data)
 * @example
 *    R.hasOwnProperty(["a", "b"])({ a: 1, b: 2, c: 3 }) //=> true
 *    R.hasOwnProperty(["d"])({ a: 1, b: 2, c: 3 }) //=> false
 * @dataLast
 * @category Guard
 */
declare function hasOwnProperty<P extends readonly PropertyKey[]>(properties: P): <T extends object>(data: Record<PropertyKey, unknown> | T) => data is NarrowedTo$1<T, { [K in P[number]]: unknown }>;
//#endregion
//#region src/remeda/isPromiseLike.d.ts
/**
 * A function that checks if the passed parameter is a isPromiseLike and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a isPromiseLike, false otherwise.
 * @signature
 *    R.isPromiseLike(data)
 * @example
 *    R.isPromiseLike(Promise.resolve(5)) //=> true
 *    R.isPromiseLike(Promise.reject(5)) //=> true
 *    R.isPromiseLike({ then: () => {} }) //=> true
 *    R.isPromiseLike('somethingElse') //=> false
 * @category Guard
 */
declare function isPromiseLike<T>(data: Readonly<PromiseLike<unknown>> | T): data is NarrowedTo$1<T, PromiseLike<unknown>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/add.d.ts
/**
 * Adds two numbers.
 *
 * @param value - The number.
 * @param addend - The number to add to the value.
 * @signature
 *    R.add(value, addend);
 * @example
 *    R.add(10, 5) // => 15
 *    R.add(10, -5) // => 5
 * @dataFirst
 * @category Number
 */
declare function add(value: bigint, addend: bigint): bigint;
declare function add(value: number, addend: number): number;
/**
 * Adds two numbers.
 *
 * @param addend - The number to add to the value.
 * @signature
 *    R.add(addend)(value);
 * @example
 *    R.add(5)(10) // => 15
 *    R.add(-5)(10) // => 5
 *    R.map([1, 2, 3, 4], R.add(1)) // => [2, 3, 4, 5]
 * @dataLast
 * @category Number
 */
declare function add(addend: bigint): (value: bigint) => bigint;
declare function add(addend: number): (value: number) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/IsUnion-Bx34mF34.d.ts
type IsUnion<T> = InternalIsUnion<T>;
type InternalIsUnion<T, U = T> = (IsNever<T> extends true ? false : T extends any ? [U] extends [T] ? false : true : never) extends infer Result ? boolean extends Result ? true : Result : never;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/UpsertProp-Df3Rulpq.d.ts
type UpsertProp<T, K extends PropertyKey, V> = Simplify<Omit<T, K> & (IsSingleLiteral<K> extends true ? Writable<Required<Record<K, V>>> :
// ('cat' | 'dog') so we can't say anything for sure, we need to narrow
{ -readonly [P in keyof T as P extends K ? P : never]: T[P] | V } & { -readonly [P in K as P extends keyof T ? never : P]?: V })>;
type IsSingleLiteral<K> = IsLiteral<K> extends true ? (IsUnion<K> extends true ? false : true) : false;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/addProp.d.ts
/**
 * Add a new property to an object.
 *
 * The function doesn't do any checks on the input object. If the property
 * already exists it will be overwritten, and the type of the new value is not
 * checked against the previous type.
 *
 * Use `set` to override values explicitly with better protections.
 *
 * @param obj - The target object.
 * @param prop - The property name.
 * @param value - The property value.
 * @signature
 *    R.addProp(obj, prop, value)
 * @example
 *    R.addProp({firstName: 'john'}, 'lastName', 'doe') // => {firstName: 'john', lastName: 'doe'}
 * @dataFirst
 * @category Object
 */
declare function addProp<T, K extends PropertyKey, V>(obj: T, prop: K, value: V): UpsertProp<T, K, V>;
/**
 * Add a new property to an object.
 *
 * The function doesn't do any checks on the input object. If the property
 * already exists it will be overwritten, and the type of the new value is not
 * checked against the previous type.
 *
 * Use `set` to override values explicitly with better protections.
 *
 * @param prop - The property name.
 * @param value - The property value.
 * @signature
 *    R.addProp(prop, value)(obj)
 * @example
 *    R.addProp('lastName', 'doe')({firstName: 'john'}) // => {firstName: 'john', lastName: 'doe'}
 * @dataLast
 * @category Object
 */
declare function addProp<T, K extends PropertyKey, V>(prop: K, value: V): (obj: T) => UpsertProp<T, K, V>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/allPass.d.ts
/**
 * Determines whether all predicates returns true for the input data.
 *
 * @param data - The input data for predicates.
 * @param fns - The list of predicates.
 * @signature
 *    R.allPass(data, fns)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    R.allPass(12, fns) // => true
 *    R.allPass(8, fns) // => false
 * @dataFirst
 * @category Array
 */
declare function allPass<T>(data: T, fns: ReadonlyArray<(data: T) => boolean>): boolean;
/**
 * Determines whether all predicates returns true for the input data.
 *
 * @param fns - The list of predicates.
 * @signature
 *    R.allPass(fns)(data)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    R.allPass(fns)(12) // => true
 *    R.allPass(fns)(8) // => false
 * @dataLast
 * @category Array
 */
declare function allPass<T>(fns: ReadonlyArray<(data: T) => boolean>): (data: T) => boolean;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/anyPass.d.ts
/**
 * Determines whether any predicate returns true for the input data.
 *
 * @param data - The input data for predicates.
 * @param fns - The list of predicates.
 * @signature
 *    R.anyPass(data, fns)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    R.anyPass(8, fns) // => true
 *    R.anyPass(11, fns) // => false
 * @dataFirst
 * @category Array
 */
declare function anyPass<T>(data: T, fns: ReadonlyArray<(data: T) => boolean>): boolean;
/**
 * Determines whether any predicate returns true for the input data.
 *
 * @param fns - The list of predicates.
 * @signature
 *    R.anyPass(fns)(data)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    R.anyPass(fns)(8) // => true
 *    R.anyPass(fns)(11) // => false
 * @dataLast
 * @category Array
 */
declare function anyPass<T>(fns: ReadonlyArray<(data: T) => boolean>): (data: T) => boolean;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/capitalize.d.ts
/**
 * Makes first character of a string upper-case. Uses the built-in
 * [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * for the runtime, and the built-in [`Capitalize`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#capitalizestringtype)
 * utility type for typing.
 *
 * For other case manipulations see: `toUpperCase`, `toLowerCase`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 * If the output is intended for display (on a browser) consider using
 * [the `text-transform: capitalize;` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * instead!
 *
 * @param data - A string.
 * @signature
 *   R.capitalize(data);
 * @example
 *   R.capitalize("hello world"); // "Hello world"
 * @dataFirst
 * @category String
 */
declare function capitalize<T extends string>(data: T): Capitalize<T>;
/**
 * Makes first character of a string upper-case. Uses the built-in
 * [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * for the runtime, and the built-in [`Capitalize`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#capitalizestringtype)
 * utility type for typing.
 *
 * For other case manipulations see: `toUpperCase`, `toLowerCase`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 * If the output is intended for display (on a browser) consider using
 * [the `text-transform: capitalize;` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * instead!
 *
 * @signature
 *   R.capitalize()(data);
 * @example
 *   R.pipe("hello world", R.capitalize()); // "Hello world"
 * @dataLast
 * @category String
 */
declare function capitalize(): <T extends string>(data: T) => Capitalize<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/ceil.d.ts
/**
 * Rounds up a given number to a specific precision.
 * If you'd like to round up to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.ceil` instead, as it won't incur the additional library overhead.
 *
 * @param value - The number to round up.
 * @param precision - The precision to round up to. Must be an integer between -15 and 15.
 * @signature
 *    R.ceil(value, precision);
 * @example
 *    R.ceil(123.9876, 3) // => 123.988
 *    R.ceil(483.22243, 1) // => 483.3
 *    R.ceil(8541, -1) // => 8550
 *    R.ceil(456789, -3) // => 457000
 * @dataFirst
 * @category Number
 */
declare function ceil(value: number, precision: number): number;
/**
 * Rounds up a given number to a specific precision.
 * If you'd like to round up to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.ceil` instead, as it won't incur the additional library overhead.
 *
 * @param precision - The precision to round up to. Must be an integer between -15 and 15.
 * @signature
 *    R.ceil(precision)(value);
 * @example
 *    R.ceil(3)(123.9876) // => 123.988
 *    R.ceil(1)(483.22243) // => 483.3
 *    R.ceil(-1)(8541) // => 8550
 *    R.ceil(-3)(456789) // => 457000
 * @dataLast
 * @category Number
 */
declare function ceil(precision: number): (value: number) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/IntRangeInclusive-Cn-qsrAN.d.ts
/**
 * Type fest offers IntClosedRange which is a similar offering, but is
 * implemented in a way which makes it inefficient when the Step size is '1'
 * (as in our case). Their implementation can cause ts(2589) errors ('Type
 * instantiation is excessively deep and possibly infinite') errors when the
 * integers are large (even when the range itself is not).
 */
type IntRangeInclusive<From extends number, To extends number> = IntRange<From, To> | To;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/IterableContainer-CtfinwiH.d.ts
/**
 * This should only be used for defining generics which extend any kind of JS
 * array under the hood, this includes arrays *AND* tuples (of the form [x, y],
 * and of the form [x, ...y[]], etc...), and their readonly equivalent. This
 * allows us to be more inclusive to what functions can process.
 *
 * @example
 *   function map<T extends IterableContainer>(items: T) { ... }
 *
 * We would've named this `ArrayLike`, but that's already used by typescript...
 * @see This was inspired by the type-definition of Promise.all (https://github.com/microsoft/TypeScript/blob/1df5717b120cddd325deab8b0f2b2c3eecaf2b01/src/lib/es2015.promise.d.ts#L21)
 */
type IterableContainer<T = unknown> = ReadonlyArray<T> | readonly [];
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/NonEmptyArray-C9Od1wmF.d.ts
type NonEmptyArray<T> = [T, ...Array<T>];
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/PartialArray-DqgYiDUP.d.ts
/**
 * In versions of TypeScript prior to 5.4 there is an issue inferring an array
 * type after passing it to Partial without additional testing. To allow simpler
 * code we pulled this check into it's own utility.
 *
 * TODO [>2]: Remove this utility once the minimum TypeScript version is bumped.
 */
type PartialArray<T> = T extends ReadonlyArray<unknown> | [] ? Partial<T> : never;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/RemedaTypeError-BIoNlKC-.d.ts
declare const RemedaErrorSymbol: unique symbol;
type RemedaTypeErrorOptions = {
  type?: unknown;
  metadata?: unknown;
};
/**
 * Used for reporting type errors in a more useful way than `never`.
 */
type RemedaTypeError<Name extends string, Message extends string, Options extends RemedaTypeErrorOptions = {}> = Tagged<Options extends {
  type: infer T;
} ? T : typeof RemedaErrorSymbol, `RemedaTypeError(${Name}): ${Message}.`, Options extends {
  metadata: infer Metadata;
} ? Metadata : never>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/TupleParts-BeowYtF7.d.ts
/**
 * Takes a tuple and returns the types that make up its parts. These parts
 * follow TypeScript's only supported format for arrays/tuples:
 * [<required>, <optional>, ...<rest>[], <suffix>].
 *
 * There are some limitations to what shapes TypeScript supports:
 * tuples can only have a suffix if they also have a non-never rest element,
 * **and** tuples cannot have both an optional part and a suffix; this means
 * there are only 10 possible shapes for tuples:
 *   1.  Empty Tuples: `[]`.
 *   2.  Fixed Tuples: `[string, number]`.
 *   3.  Optional Tuples: `[string?, number?]`.
 *   4.  Mixed Tuples: `[string, number?]`.
 *   5.  Arrays: `Array<string>`.
 *   6.  Fixed-Prefix Arrays: `[string, ...Array<string>]`.
 *   7.  Optional-Prefix Arrays: `[number?, ...Array<boolean>]`.
 *   8.  Mixed-Prefix Arrays: `[string, number?, ...Array<boolean>]`.
 *   9.  Fixed-Suffix Arrays: `[...Array<string>, string]`.
 *   10. Fixed-Elements Arrays: `[string, ...Array<string>, string]`.
 *
 * @example [
 *   ...TupleParts<T>["required"],
 *   ...Partial<TupleParts<T>["optional"]>,
 *   ...CoercedArray<TupleParts<T>["item"]>,
 *   ...TupleParts<T>["suffix"],
 * ].
 */
type TupleParts<T extends IterableContainer, Prefix extends Array<unknown> = []> = T extends readonly [infer Head, ...infer Tail] ? TupleParts<Tail, [...Prefix, Head]> : Simplify<{
  /**
   * A fixed tuple that defines the part of the tuple where all its
   * elements are required. This will always be the first part of the
   * tuple and will never contain any optional or rest elements. When the
   * array doesn't have a required part this will be an empty tuple
   * (`[]`).
   */
  required: Prefix;
} & TuplePartsWithoutRequired<T>>;
type TuplePartsWithoutRequired<T extends IterableContainer, Suffix extends Array<unknown> = []> = T extends readonly [...infer Head, infer Tail] ? TuplePartsWithoutRequired<Head, [Tail, ...Suffix]> : (Suffix extends readonly [] ? TuplePartsWithoutFixed<T> :
// When the suffix is not empty we can skip the optional part and go
{
  optional: [];
} & TuplePartsRest<T>) & {
  /**
   * A *fixed* tuple that defines the part of a tuple **after** a non-never
   * rest parameter. These could never be optional elements, and could
   * never contain another rest element. When the array doesn't have a
   * required part this will be an empty tuple (`[]`).
   */
  suffix: Suffix;
};
type TuplePartsWithoutFixed<T extends IterableContainer, Optional extends Array<unknown> = []> = T extends readonly [(infer Head)?, ...infer Tail] ? Or<T extends readonly [] ? true : false, Array<T[number]> extends Tail ? true : false> extends true ? {
  /**
   * A *fixed* tuple that defines the part of a tuple where all its
   * elements are suffixed with the optional operator (`?`); but with
   * the optional operator removed (e.g. `[string?]` would be
   * represented as `[string]`). These elements can only follow the
   * `required` part (which could be empty).
   * To add optional operator back wrap the result with the built-in
   * `Partial` type.
   * When the array doesn't have a required part this will be an empty
   * tuple (`[]`).
   *
   * @example Partial<TupleParts<T>["optional"]>
   */
  optional: Optional;
} & TuplePartsRest<T> : TuplePartsWithoutFixed<Tail, [...Optional, Head | undefined]> : RemedaTypeError<"TupleParts", "Unexpected tuple shape", {
  type: never;
  metadata: T;
}>;
type TuplePartsRest<T extends IterableContainer> = {
  /**
   * The type for the rest parameter of the tuple, if any. Unlike the
   * other parts of the tuple, this is a single type and not
   * represented as an array/tuple. When a tuple doesn't have a rest
   * element, this will be `never`. To convert this to a matching array
   * type that could be spread into a new type use the `CoercedArray`
   * type which handles the `never` case correctly.
   *
   * @example CoercedArray<TupleParts<T>["item"]>
   */
  item: T extends readonly [] ? never : T[number];
};
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk.d.ts
/**
 * An array with *exactly* N elements in it.
 *
 * Only literal N values are supported. For very large N the type might result
 * in a recurse depth error. For negative N the type would result in an infinite
 * recursion. None of these have protections because this is an internal type!
 */
type NTuple<T, N extends number, Result extends Array<unknown> = []> = Result["length"] extends N ? Result : NTuple<T, N, [...Result, T]>;
type MAX_LITERAL_SIZE$1 = 350;
type Chunk<T extends IterableContainer, N extends number> = T extends readonly [] ? [] : IsNumericLiteral<N> extends true ? LessThan<N, 1> extends true ? never : LessThan<N, MAX_LITERAL_SIZE$1> extends true ? [...LiteralChunk<T, N>] : GenericChunk<T> : GenericChunk<T>;
type LiteralChunk<T extends IterableContainer, N extends number> = ChunkRestElement<ChunkFixedTuple<TuplePrefix$1<T>, N>, TupleParts<T>["item"], TupleParts<T>["suffix"], N> | ([...TuplePrefix$1<T>, ...TupleParts<T>["suffix"]] extends readonly [] ? [] : never);
/**
 * This type **only** works if the input array `T` is a fixed tuple. For these
 * inputs the chunked output could be computed as literal finite tuples too.
 */
type ChunkFixedTuple<T, N extends number, Result = []> = T extends readonly [infer Head, ...infer Rest] ? ChunkFixedTuple<Rest, N, Result extends [...infer Previous extends Array<Array<unknown>>, infer Current extends Array<unknown>] ? Current["length"] extends N ? [...Previous, Current, [Head]] : [...Previous, [...Current, Head]] : [[Head]]> : Result;
/**
 * Here lies the main complexity of building the chunk type. It takes the prefix
 * chunks, the rest param item type, and the suffix (not chunked!) and it
 * creates all possible combinations of adding items to the prefix and suffix
 * for all possible scenarios for how many items the rest param "represents".
 */
type ChunkRestElement<PrefixChunks, Item, Suffix extends Array<unknown>, N extends number> = IfNever<Item, PrefixChunks, PrefixChunks extends [...infer PrefixFullChunks extends Array<Array<unknown>>, infer LastPrefixChunk extends Array<unknown>] ? ValueOf<{ [Padding in IntRangeInclusive<0, Subtract<N, LastPrefixChunk["length"]>>]: [...PrefixFullChunks, ...ChunkFixedTuple<[...LastPrefixChunk, ...NTuple<Item, Padding>, ...Suffix], N>] }> | [...PrefixFullChunks, [...LastPrefixChunk, ...NTuple<Item, Subtract<N, LastPrefixChunk["length"]>>], ...Array<NTuple<Item, N>>, ...SuffixChunk<Suffix, Item, N>] : [...Array<NTuple<Item, N>>, ...SuffixChunk<Suffix, Item, N>]>;
/**
 * This type assumes it takes a finite tuple that represents the suffix of our
 * input array. It builds all possible combinations of adding items to the
 * **head** of the suffix in order to pad the suffix until the last chunk is
 * full.
 */
type SuffixChunk<T extends Array<unknown>, Item, N extends number> = T extends readonly [] ? [ValueOf<{ [K in IntRangeInclusive<1, N>]: NTuple<Item, K> }>] : ValueOf<{ [Padding in IntRange<0, N>]: ChunkFixedTuple<[...NTuple<Item, Padding>, ...T], N> }>;
/**
 * This is the legacy type used when we don't know what N is. We can only adjust
 * our output based on if we know for sure that the array is empty or not.
 */
type GenericChunk<T extends IterableContainer> = T extends readonly [...Array<unknown>, unknown] | readonly [unknown, ...Array<unknown>] ? NonEmptyArray<NonEmptyArray<T[number]>> : Array<NonEmptyArray<T[number]>>;
type TuplePrefix$1<T extends IterableContainer> = [...TupleParts<T>["required"], ...PartialArray<TupleParts<T>["optional"]>];
/**
 * Split an array into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.
 *
 * @param array - The array.
 * @param size - The length of the chunk.
 * @signature
 *    R.chunk(array, size)
 * @example
 *    R.chunk(['a', 'b', 'c', 'd'], 2) // => [['a', 'b'], ['c', 'd']]
 *    R.chunk(['a', 'b', 'c', 'd'], 3) // => [['a', 'b', 'c'], ['d']]
 * @dataFirst
 * @category Array
 */
declare function chunk<T extends IterableContainer, N extends number>(array: T, size: N): Chunk<T, N>;
/**
 * Split an array into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.
 *
 * @param size - The length of the chunk.
 * @signature
 *    R.chunk(size)(array)
 * @example
 *    R.chunk(2)(['a', 'b', 'c', 'd']) // => [['a', 'b'], ['c', 'd']]
 *    R.chunk(3)(['a', 'b', 'c', 'd']) // => [['a', 'b', 'c'], ['d']]
 * @dataLast
 * @category Array
 */
declare function chunk<N extends number>(size: N): <T extends IterableContainer>(array: T) => Chunk<T, N>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/clamp.d.ts
type Limits = {
  readonly min?: number;
  readonly max?: number;
};
/**
 * Clamp the given value within the inclusive min and max bounds.
 *
 * @param value - The number.
 * @param limits - The bounds limits.
 * @signature
 *    R.clamp(value, { min, max });
 * @example
 *    clamp(10, { min: 20 }) // => 20
 *    clamp(10, { max: 5 }) // => 5
 *    clamp(10, { max: 20, min: 5 }) // => 10
 * @dataFirst
 * @category Number
 */
declare function clamp(value: number, limits: Limits): number;
/**
 * Clamp the given value within the inclusive min and max bounds.
 *
 * @param limits - The bounds limits.
 * @signature
 *    R.clamp({ min, max })(value);
 * @example
 *    clamp({ min: 20 })(10) // => 20
 *    clamp({ max: 5 })(10) // => 5
 *    clamp({ max: 20, min: 5 })(10) // => 10
 * @dataLast
 * @category Number
 */
declare function clamp(limits: Limits): (value: number) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/clone.d.ts
/**
 * Creates a deep copy of the value. Supported types: [plain objects](#isPlainObject),
 * `Array`, `number`, `string`, `boolean`, `Date`, and `RegExp`. Functions are
 * assigned by reference rather than copied. Class instances or any other
 * built-in type that isn't mentioned above are not supported (but might
 * work).
 *
 * @param data - The object to clone.
 * @signature
 *   R.clone(data)
 * @example
 *   R.clone({foo: 'bar'}) // {foo: 'bar'}
 * @dataFirst
 * @category Object
 */
declare function clone<T>(data: T): T;
/**
 * Creates a deep copy of the value. Supported types: [plain objects](#isPlainObject),
 * `Array`, `number`, `string`, `boolean`, `Date`, and `RegExp`. Functions are
 * assigned by reference rather than copied. Class instances or any other
 * built-in type that isn't mentioned above are not supported (but might
 * work).
 *
 * @signature
 *   R.clone()(data)
 * @example
 *   R.pipe({foo: 'bar'}, R.clone()) // {foo: 'bar'}
 * @dataLast
 * @category Object
 */
declare function clone(): <T>(data: T) => T;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/concat.d.ts
/**
 * Merge two or more arrays. This method does not change the existing arrays,
 * but instead returns a new array, even if the other array is empty.
 *
 * @param data - The first items, these would be at the beginning of the new
 * array.
 * @param other - The remaining items, these would be at the end of the new
 * array.
 * @returns A new array with the items of the first array followed by the items
 * of the second array.
 * @signature
 *    R.concat(data, other);
 * @example
 *    R.concat([1, 2, 3], ['a']) // [1, 2, 3, 'a']
 * @dataFirst
 * @category Array
 */
declare function concat<T1 extends IterableContainer, T2 extends IterableContainer>(data: T1, other: T2): [...T1, ...T2];
/**
 * Merge two or more arrays. This method does not change the existing arrays,
 * but instead returns a new array, even if the other array is empty.
 *
 * @param other - The remaining items, these would be at the end of the new
 * array.
 * @returns A new array with the items of the first array followed by the items
 * of the second array.
 * @signature
 *    R.concat(arr2)(arr1);
 * @example
 *    R.concat(['a'])([1, 2, 3]) // [1, 2, 3, 'a']
 * @dataLast
 * @category Array
 */
declare function concat<T2 extends IterableContainer>(other: T2): <T1 extends IterableContainer>(data: T1) => [...T1, ...T2];
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/GuardType-C8IpVeqb.d.ts
/**
 * Extracts a type predicate from a type guard function for the first argument.
 *
 * @example
 * type TypeGuardFn = (x: unknown) => x is string;
 * type Result = GuardType<TypeGuardFn>; // `string`
 */
type GuardType<T, Fallback = never> = T extends ((x: any, ...rest: any) => x is infer U) ? U : Fallback;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/conditional.d.ts
type Case<In, Out, When extends (x: In) => boolean = (x: In) => boolean> = readonly [when: When, then: (x: GuardType<When, In> & In) => Out];
type DefaultCase<In, Out> = (x: In) => Out;
type Utilities = {
  readonly defaultCase: typeof defaultCase;
};
type WithUtils<T> = T & Utilities;
declare const conditionalPlus: WithUtils<typeof conditional>;

/**
 * Executes a transformer function based on the first matching predicate,
 * functioning like a series of `if...else if...` statements. It sequentially
 * evaluates each case and, upon finding a truthy predicate, runs the
 * corresponding transformer, and returns, ignoring any further cases, even if
 * they would match.
 *
 * *NOTE*: Some type-predicates may fail to narrow the param type of their
 * transformer; in such cases wrap your type-predicate in an anonymous arrow
 * function: e.g., instead of
 * `conditional(..., [myTypePredicate, myTransformer], ...)`, use
 * `conditional(..., [($) => myTypePredicate($), myTransformer], ...)`.
 *
 * To add a a default, catch-all, case you can provide a single callback
 * function (instead of a 2-tuple) as the last case. This is equivalent to
 * adding a case with a trivial always-true predicate as it's condition (see
 * example).
 *
 * For simpler cases you should also consider using `when` instead.
 *
 * Due to TypeScript's inability to infer the result of negating a type-
 * predicate we can't refine the types used in subsequent cases based on
 * previous conditions. Using a `switch (true)` statement or ternary operators
 * is recommended for more precise type control when such type narrowing is
 * needed.
 *
 * !IMPORTANT! - Unlike similar implementations in Lodash and Ramda, the Remeda
 * implementation **doesn't** implicitly return `undefined` as a fallback when
 * when none of the cases match; and instead **throws** an exception in those
 * cases! You have to explicitly provide a default case, and can use
 * `constant(undefined)` as your last case to replicate that behavior.
 *
 * @param cases - A list of (up to 10) cases. Each case can be either:
 * - A 2-tuple consisting of a predicate (or type-predicate) and a transformer
 *   function that processes the data if the predicate matches.
 * - A single callback function that acts as a default fallback case.
 * @returns The output of the matched transformer. If no cases match, an
 * exception is thrown. The return type is a union of the return types of all
 * provided transformers.
 * @signature
 *   R.conditional(...cases)(data);
 * @example
 *   const nameOrId = 3 as string | number | boolean;
 *
 *   R.pipe(
 *     nameOrId,
 *     R.conditional(
 *       [R.isString, (name) => `Hello ${name}`],
 *       [R.isNumber, (id) => `Hello ID: ${id}`],
 *     ),
 *   ); //=> 'Hello ID: 3' (typed as `string`), can throw!.
 *
 *   R.pipe(
 *     nameOrId,
 *     R.conditional(
 *       [R.isString, (name) => `Hello ${name}`],
 *       [R.isNumber, (id) => `Hello ID: ${id}`],
 *       R.constant(undefined),
 *     ),
 *   ); //=> 'Hello ID: 3' (typed as `string | undefined`), won't throw.
 *
 *   R.pipe(
 *     nameOrId,
 *     R.conditional(
 *       [R.isString, (name) => `Hello ${name}`],
 *       [R.isNumber, (id) => `Hello ID: ${id}`],
 *       (something) => `Hello something (${JSON.stringify(something)})`,
 *     ),
 *   ); //=> 'Hello ID: 3' (typed as `string`), won't throw.
 * @dataLast
 * @category Function
 */
declare function conditional<T, Fn0 extends (x: T) => boolean, Return0, Fallback = never>(case0: Case<T, Return0, Fn0>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Return0, Return1, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Return0, Return1, Return2, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Return4 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Fn7 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Return7, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, case7: Case<T, Return7, Fn7>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Return7 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Fn7 extends (x: T) => boolean, Fn8 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Return7, Return8, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, case7: Case<T, Return7, Fn7>, case8: Case<T, Return8, Fn8>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Return7 | Return8 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Fn7 extends (x: T) => boolean, Fn8 extends (x: T) => boolean, Fn9 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Return7, Return8, Return9, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, case7: Case<T, Return7, Fn7>, case8: Case<T, Return8, Fn8>, case9: Case<T, Return9, Fn9>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Return7 | Return8 | Return9 | Fallback;
/**
 * Executes a transformer function based on the first matching predicate,
 * functioning like a series of `if...else if...` statements. It sequentially
 * evaluates each case and, upon finding a truthy predicate, runs the
 * corresponding transformer, and returns, ignoring any further cases, even if
 * they would match.
 *
 * *NOTE*: Some type-predicates may fail to narrow the param type of their
 * transformer; in such cases wrap your type-predicate in an anonymous arrow
 * function: e.g., instead of
 * `conditional(..., [myTypePredicate, myTransformer], ...)`, use
 * `conditional(..., [($) => myTypePredicate($), myTransformer], ...)`.
 *
 * To add a a default, catch-all, case you can provide a single callback
 * function (instead of a 2-tuple) as the last case. This is equivalent to
 * adding a case with a trivial always-true predicate as it's condition (see
 * example).
 *
 * For simpler cases you should also consider using `when` instead.
 *
 * Due to TypeScript's inability to infer the result of negating a type-
 * predicate we can't refine the types used in subsequent cases based on
 * previous conditions. Using a `switch (true)` statement or ternary operators
 * is recommended for more precise type control when such type narrowing is
 * needed.
 *
 * !IMPORTANT! - Unlike similar implementations in Lodash and Ramda, the Remeda
 * implementation **doesn't** implicitly return `undefined` as a fallback when
 * when none of the cases match; and instead **throws** an exception in those
 * cases! You have to explicitly provide a default case, and can use
 * `constant(undefined)` as your last case to replicate that behavior.
 *
 * @param data - The input data to be evaluated against the provided cases.
 * @param cases - A list of (up to 10) cases. Each case can be either:
 * - A 2-tuple consisting of a predicate (or type-predicate) and a transformer
 *   function that processes the data if the predicate matches.
 * - A single callback function that acts as a default fallback case.
 * @returns The output of the matched transformer. If no cases match, an
 * exception is thrown. The return type is a union of the return types of all
 * provided transformers.
 * @signature
 *   R.conditional(data, ...cases);
 * @example
 *   const nameOrId = 3 as string | number | boolean;
 *
 *   R.conditional(
 *     nameOrId,
 *     [R.isString, (name) => `Hello ${name}`],
 *     [R.isNumber, (id) => `Hello ID: ${id}`],
 *   ); //=> 'Hello ID: 3' (typed as `string`), can throw!.
 *
 *   R.conditional(
 *     nameOrId,
 *     [R.isString, (name) => `Hello ${name}`],
 *     [R.isNumber, (id) => `Hello ID: ${id}`],
 *     R.constant(undefined),
 *   ); //=> 'Hello ID: 3' (typed as `string | undefined`), won't throw.
 *
 *   R.conditional(
 *     nameOrId,
 *     [R.isString, (name) => `Hello ${name}`],
 *     [R.isNumber, (id) => `Hello ID: ${id}`],
 *     (something) => `Hello something (${JSON.stringify(something)})`,
 *   ); //=> 'Hello ID: 3' (typed as `string`), won't throw.
 * @dataFirst
 * @category Function
 */
declare function conditional<T, Fn0 extends (x: T) => boolean, Return0, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, fallback?: DefaultCase<T, Fallback>): Return0 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Return0, Return1, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Return0, Return1, Return2, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Return4 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Fn7 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Return7, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, case7: Case<T, Return7, Fn7>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Return7 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Fn7 extends (x: T) => boolean, Fn8 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Return7, Return8, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, case7: Case<T, Return7, Fn7>, case8: Case<T, Return8, Fn8>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Return7 | Return8 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Fn7 extends (x: T) => boolean, Fn8 extends (x: T) => boolean, Fn9 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Return7, Return8, Return9, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, case7: Case<T, Return7, Fn7>, case8: Case<T, Return8, Fn8>, case9: Case<T, Return9, Fn9>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Return7 | Return8 | Return9 | Fallback;
/**
 *! **DEPRECATED**: `conditional` now accepts a default, catch-all, callback directly and no longer needs this utility wrapper. Use `constant(undefined)` as your last case instead (see example).
 *
 * @example
 *   const nameOrId = 3 as string | number;
 *   R.conditional(
 *     nameOrId,
 *     [R.isString, (name) => `Hello ${name}`],
 *     [R.isNumber, (id) => `Hello ID: ${id}`],
 *     // Was: `R.conditional.defaultCase(),`, Now:
 *     constant(undefined),
 *   ); //=> 'Hello ID: 3'
 * @deprecated `conditional` now accepts a default, catch-all, callback
 * directly and no longer needs this utility wrapper. Use `constant(undefined)`
 * as your last case instead (see example).
 */
declare function defaultCase(): Case<unknown, undefined>;
/**
 *! **DEPRECATED**: `conditional` now accepts a default, catch-all, callback directly and no longer needs this utility wrapper. Simply put your `then` callback as the last case (see example).
 *
 * @param then - You only need to provide the transformer, the predicate is
 * implicit. @default () => undefined, which is how Lodash and Ramda handle
 * the final fallback case.
 * @example
 *   const nameOrId = 3 as string | number;
 *   R.conditional(
 *     nameOrId,
 *     [R.isString, (name) => `Hello ${name}`],
 *     [R.isNumber, (id) => `Hello ID: ${id}`],
 *     // Was: `R.conditional.defaultCase(
 *     //  (something) => `Hello something (${JSON.stringify(something)})`,
 *     //),`, Now:
 *     (something) => `Hello something (${JSON.stringify(something)})`
 *   ); //=> 'Hello ID: 3'
 * @deprecated `conditional` now accepts a default, catch-all, callback
 * directly and no longer needs this utility wrapper. Simply put your `then`
 * callback as the last case.
 */
declare function defaultCase<In, Then extends (param: In) => unknown>(then: Then): Case<In, ReturnType<Then>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/constant.d.ts
/**
 * A function that takes any arguments and returns the provided `value` on every
 * invocation. This is useful to provide trivial implementations for APIs or in
 * combination with a ternary or other conditional execution to allow to short-
 * circuit more complex implementations for a specific case.
 *
 * Notice that this is a dataLast impl where the function needs to be invoked
 * to get the "do nothing" function.
 *
 * See also:
 * `doNothing` - A function that doesn't return anything.
 * `identity` - A function that returns the first argument it receives.
 *
 * @param value - The constant value that would be returned on every invocation.
 * The value is not copied/cloned on every invocation so care should be taken
 * with mutable objects (like arrays, objects, Maps, etc...).
 * @signature
 *   R.constant(value);
 * @example
 *   R.map([1, 2, 3], R.constant('a')); // => ['a', 'a', 'a']
 *   R.map(
 *     [1, 2, 3],
 *     isDemoMode ? R.add(1) : R.constant(0),
 *   ); // => [2, 3, 4] or [0, 0, 0]
 * @dataLast
 * @category Function
 */
declare function constant<T>(value: T): <Args extends ReadonlyArray<unknown>>(...args: Args) => T;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/If-D4QIikQ1.d.ts
type If<Type extends boolean, IfBranch, ElseBranch> = IsNever<Type> extends true ? ElseBranch : Type extends true ? IfBranch : ElseBranch;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/IsBoundedRecord-CeHuKZ6O.d.ts
/**
 * Checks if a type is a bounded key: a union of bounded strings, numeric
 * literals, or symbol literals.
 *
 * [For an interactive deeper dive and explanation see the following playground](https://www.typescriptlang.org/play/?noUncheckedIndexedAccess=true#code/PTAEBUAsEsGdQE4FMDGB7BATUdQCIAjNAVwDtMlM8AaHAF1EgEN4nQAzaU6OpUWJAzTtQAayQBPWADpQASQZMANrDSIkAR2LRk8HgHJYAKBCg0BAFaoGdNcwBufZUrMi6kJAFtpRuhIAOfABCJOSUoAC8oABKqBiYADwABv7InAAeAPoAJADeeB5KSmh4oAA++ADuGEpUAL5JtHiqnoIwpADmeAB8ANxGJmBQuMjoWDjweGREZBRUtDyMLKBMpDiknNy8-IKuoP5osLDQBEp84lKyCoaDZpbWoOjEtY9opHRMXKCkb3zCoO4vAC0GgfH5AqAAKqkGZhbBRWJjRIpNLQLJ5WB0BBcDoNJotNo4nr9W4AMQwK1IEggAC4IKAkOleOR4AAFJgIOjQZQJcDdUAEakUTZct60AjEGwedaOBACCbfNCKJSVJhSW5Y4hIWQAdQ8a0WuE1fEqfBQq34aoBzAY4AV0E8-iU0BQPCU1P8HK5ylAAApDcZTJptPZlEh3sDQOzOdylLzugBKXwBPhyWByR3O110d3R71xvmRKNe2PxhlM8OYeB2gD8+AkpTpeFIeBJpj14ZWKBQSCOOJW+wQaH8e0BAtCczuVhQtpTAGUUNj-AxzWtw7BiMhrUwGKlh7dGXA6Ho1mPzNPFOQGaQN1uePBwdqjBQUEoOWa3pjQEEAPKQgByAAiACigF0iEsyUP06A3gwsKTlEv4ASBgEANp4KkSAZJkhTFHgAC6-SmKAJEAHo1gM7b6l2PZ9p0A57iO-xjtME7hOe1i0JU1H6D80IoB4KDiJgchhOklAAILdr2sBJLcuDhkwpzhOA86LtAy6PBabzutet4mjaAIpvQoAAFSeNAHSQHQpkCkg4qSisKhoLcMHHBQCDWmaLAGUgd4MJgaC9qQ+gMIeX5fGe9wzrQqgmU8LzKHFBBILcSSQZslBJD4L5vlubkMABSFAaBdLQvBUFGAVoCsZB8JQv+xUoehmHYbhJSEbcJGgORlFDDAegPggWocBSpmmasEjjYOw57EVf4lYBvSgNxLqQKArSrA+hnODN-jwMItzzchoErFueDDqKpDKDQK0wAJCqMkwM66dxO6gEkealo+-zHYt3RyaYm03jsnirFy5pFBIy1xaa+jYIygQztaRpqMgdCbms+gSPoDkMIs6OY-AvH6AAhMmEJpuVbEiZmLpuhIX0+lEaYZk69M5ozJY8tTdV9F1PUUbcervbt7i4MDg3bvjaxg1SWkCLAtC9kjsa6e4hx8O4726MwEKrLcHHI6aG2WdZ3xIOEthLOQZzjnVlLYLVcLqEi8ACJ6CA7u6tCrJgrmrKF6i6W8OB09mrx+a6n7K44azcZ2gLUmD4g7De2rSD4QA).
 */
type IsBounded<T> = (T extends unknown ? Or<IsBoundedString<T>, Or<IsNumericLiteral<T>, IsSymbolLiteral<T>>> : never) extends true ? true : false;
/**
 * Literal strings can be unbounded when they are a template literal which
 * contains non-literal components (e.g. `prefix_${string}`), this is because
 * there are an infinite number of possible values that satisfy it.
 */
type IsBoundedString<T> = T extends string ? IsStringLiteral<T> extends true ? Split<T, "">[number] extends infer U ? [`${number}`] extends [U] ? false : [string] extends [U] ? false : true : false : false : false;

/**
 * Check if a type is guaranteed to be a bounded record: a record with a finite
 * set of keys.
 *
 * See the docs for `IsBounded` to understand more.
 *
 * @example
 *   IsBoundedRecord<{ a: 1, 1: "a" }>; //=> true
 *   IsBoundedRecord<Record<string | number, unknown>>; //=> false
 *   IsBoundedRecord<Record<`prefix_${number}`, unknown>>; //=> false
 */
type IsBoundedRecord<T> = IsBounded<KeysOfUnion<T>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/BoundedPartial-CEE5lvyB.d.ts
/**
 * Records with an unbounded set of keys have different semantics to those with
 * a bounded set of keys when using 'noUncheckedIndexedAccess', the former
 * being implicitly `Partial` whereas the latter are implicitly `Required`.
 *
 * @example
 *    BoundedPartial<{ a: number }>; //=> { a?: number }
 *    BoundedPartial<Record<string, number>>; //=> Record<string, number>
 */
type BoundedPartial<T> = If<IsBoundedRecord<T>, Partial<T>, T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/countBy.d.ts
/**
 * Categorize and count elements in an array using a defined callback function.
 * The callback function is applied to each element in the array to determine
 * its category and then counts how many elements fall into each category.
 *
 * @param data - The array.
 * @param categorizationFn - The categorization function.
 * @signature
 *   R.countBy(data, categorizationFn)
 * @example
 *    R.countBy(
 *      ["a", "b", "c", "B", "A", "a"],
 *      R.toLowerCase()
 *    ); //=> { a: 3, b: 2, c: 1 }
 * @dataFirst
 * @category Array
 */
declare function countBy<T, K extends PropertyKey>(data: ReadonlyArray<T>, categorizationFn: (value: T, index: number, data: ReadonlyArray<T>) => K | undefined): BoundedPartial<Record<K, number>>;
/**
 * Categorize and count elements in an array using a defined callback function.
 * The callback function is applied to each element in the array to determine
 * its category and then counts how many elements fall into each category.
 *
 * @param categorizationFn - The categorization function.
 * @signature
 *   R.countBy(categorizationFn)(data)
 * @example
 *    R.pipe(
 *      ["a", "b", "c", "B", "A", "a"],
 *      R.countBy(R.toLowerCase()),
 *    ); //=> { a: 3, b: 2, c: 1 }
 * @dataLast
 * @category Array
 */
declare function countBy<T, K extends PropertyKey>(categorizationFn: (value: T, index: number, data: ReadonlyArray<T>) => K | undefined): (data: ReadonlyArray<T>) => BoundedPartial<Record<K, number>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/debounce.d.ts
type Debouncer<F extends (...args: any) => unknown, IsNullable extends boolean = true> = {
  /**
   * Invoke the debounced function.
   *
   * @param args - Same as the args for the debounced function.
   * @returns The last computed value of the debounced function with the
   * latest args provided to it. If `timing` does not include `leading` then the
   * the function would return `undefined` until the first cool-down period is
   * over, otherwise the function would always return the return type of the
   * debounced function.
   */
  readonly call: (...args: Parameters<F>) => ReturnType<F> | (true extends IsNullable ? undefined : never);
  /**
   * Cancels any debounced functions without calling them, effectively resetting
   * the debouncer to the same state it is when initially created.
   */
  readonly cancel: () => void;
  /**
   * Similar to `cancel`, but would also trigger the `trailing` invocation if
   * the debouncer would run one at the end of the cool-down period.
   */
  readonly flush: () => ReturnType<F> | undefined;
  /**
   * Is `true` when there is an active cool-down period currently debouncing
   * invocations.
   */
  readonly isPending: boolean;
  /**
   * The last computed value of the debounced function.
   */
  readonly cachedValue: ReturnType<F> | undefined;
};
type DebounceOptions = {
  readonly waitMs?: number;
  readonly maxWaitMs?: number;
};
/**
 * Wraps `func` with a debouncer object that "debounces" (delays) invocations of the function during a defined cool-down period (`waitMs`). It can be configured to invoke the function either at the start of the cool-down period, the end of it, or at both ends (`timing`).
 * It can also be configured to allow invocations during the cool-down period (`maxWaitMs`).
 * It stores the latest call's arguments so they could be used at the end of the cool-down period when invoking `func` (if configured to invoke the function at the end of the cool-down period).
 * It stores the value returned by `func` whenever its invoked. This value is returned on every call, and is accessible via the `cachedValue` property of the debouncer. Its important to note that the value might be different from the value that would be returned from running `func` with the current arguments as it is a cached value from a previous invocation.
 * **Important**: The cool-down period defines the minimum between two invocations, and not the maximum. The period will be **extended** each time a call is made until a full cool-down period has elapsed without any additional calls.
 *
 *! **DEPRECATED**: This implementation of debounce is known to have issues and might not behave as expected. It should be replaced with the `funnel` utility instead. The test file [funnel.remeda-debounce.test.ts](https://github.com/remeda/remeda/blob/main/packages/remeda/src/funnel.remeda-debounce.test.ts) offers a reference implementation that replicates `debounce` via `funnel`!
 *
 * @param func - The function to debounce, the returned `call` function will have
 * the exact same signature.
 * @param options - An object allowing further customization of the debouncer:
 * - `timing?: 'leading' | 'trailing' |'both'`. The default is `'trailing'`.
 *   `leading` would result in the function being invoked at the start of the
 *   cool-down period; `trailing` would result in the function being invoked at
 *   the end of the cool-down period (using the args from the last call to the
 *   debouncer). When `both` is selected the `trailing` invocation would only
 *   take place if there were more than one call to the debouncer during the
 *   cool-down period. **DEFAULT: 'trailing'**
 * - `waitMs?: number`. The length of the cool-down period in milliseconds. The
 *   debouncer would wait until this amount of time has passed without **any**
 *   additional calls to the debouncer before triggering the end-of-cool-down-
 *   period event. When this happens, the function would be invoked (if `timing`
 *   isn't `'leading'`) and the debouncer state would be reset. **DEFAULT: 0**
 * - `maxWaitMs?: number`. The length of time since a debounced call (a call
 *   that the debouncer prevented from being invoked) was made until it would be
 *   invoked. Because the debouncer can be continually triggered and thus never
 *   reach the end of the cool-down period, this allows the function to still
 *   be invoked occasionally. IMPORTANT: This param is ignored when `timing` is
 *   `'leading'`.
 * @returns A debouncer object. The main function is `call`. In addition to it
 * the debouncer comes with the following additional functions and properties:
 * - `cancel` method to cancel delayed `func` invocations
 * - `flush` method to end the cool-down period immediately.
 * - `cachedValue` the latest return value of an invocation (if one occurred).
 * - `isPending` flag to check if there is an inflight cool-down window.
 * @signature
 *   R.debounce(func, options);
 * @example
 *   const debouncer = debounce(identity(), { timing: 'trailing', waitMs: 1000 });
 *   const result1 = debouncer.call(1); // => undefined
 *   const result2 = debouncer.call(2); // => undefined
 *   // after 1 second
 *   const result3 = debouncer.call(3); // => 2
 *   // after 1 second
 *   debouncer.cachedValue; // => 3
 * @dataFirst
 * @category Function
 * @deprecated This implementation of debounce is known to have issues and might
 * not behave as expected. It should be replaced with the `funnel` utility
 * instead. The test file `funnel.remeda-debounce.test.ts` offers a reference
 * implementation that replicates `debounce` via `funnel`.
 * @see https://css-tricks.com/debouncing-throttling-explained-examples/
 */
declare function debounce<F extends (...args: any) => any>(func: F, options: DebounceOptions & {
  readonly timing?: "trailing";
}): Debouncer<F>;
declare function debounce<F extends (...args: any) => any>(func: F, options: (DebounceOptions & {
  readonly timing: "both";
}) | (Omit<DebounceOptions, "maxWaitMs"> & {
  readonly timing: "leading";
})): Debouncer<F, false>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/difference.d.ts
/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. The inputs are treated as multi-sets/bags (multiple copies of
 * items are treated as unique items).
 *
 * @param data - The input items.
 * @param other - The values to exclude.
 * @signature
 *    R.difference(data, other)
 * @example
 *    R.difference([1, 2, 3, 4], [2, 5, 3]); // => [1, 4]
 *    R.difference([1, 1, 2, 2], [1]); // => [1, 2, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function difference<T>(data: ReadonlyArray<T>, other: ReadonlyArray<T>): Array<T>;
/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. The inputs are treated as multi-sets/bags (multiple copies of
 * items are treated as unique items).
 *
 * @param other - The values to exclude.
 * @signature
 *    R.difference(other)(data)
 * @example
 *    R.pipe([1, 2, 3, 4], R.difference([2, 5, 3])); // => [1, 4]
 *    R.pipe([1, 1, 2, 2], R.difference([1])); // => [1, 2, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function difference<T>(other: ReadonlyArray<T>): (data: ReadonlyArray<T>) => Array<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/differenceWith.d.ts
type IsEquals$1<TFirst, TSecond> = (a: TFirst, b: TSecond) => boolean;
/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 *
 * @param array - The source array.
 * @param other - The values to exclude.
 * @param isEquals - The comparator.
 * @signature
 *    R.differenceWith(array, other, isEquals)
 * @example
 *    R.differenceWith(
 *      [{a: 1}, {a: 2}, {a: 3}, {a: 4}],
 *      [{a: 2}, {a: 5}, {a: 3}],
 *      R.equals,
 *    ) // => [{a: 1}, {a: 4}]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function differenceWith<TFirst, TSecond>(array: ReadonlyArray<TFirst>, other: ReadonlyArray<TSecond>, isEquals: IsEquals$1<TFirst, TSecond>): Array<TFirst>;
/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 *
 * @param other - The values to exclude.
 * @param isEquals - The comparator.
 * @signature
 *    R.differenceWith(other, isEquals)(array)
 * @example
 *    R.differenceWith(
 *      [{a: 2}, {a: 5}, {a: 3}],
 *      R.equals,
 *    )([{a: 1}, {a: 2}, {a: 3}, {a: 4}]) // => [{a: 1}, {a: 4}]
 *    R.pipe(
 *      [{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}, {a: 6}], // only 4 iterations
 *      R.differenceWith([{a: 2}, {a: 3}], R.equals),
 *      R.take(2),
 *    ) // => [{a: 1}, {a: 4}]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function differenceWith<TFirst, TSecond>(other: ReadonlyArray<TSecond>, isEquals: IsEquals$1<TFirst, TSecond>): (array: ReadonlyArray<TFirst>) => Array<TFirst>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/divide.d.ts
/**
 * Divides two numbers.
 *
 * @param value - The number.
 * @param divisor - The number to divide the value by.
 * @signature
 *    R.divide(value, divisor);
 * @example
 *    R.divide(12, 3) // => 4
 *    R.reduce([1, 2, 3, 4], R.divide, 24) // => 1
 * @dataFirst
 * @category Number
 */
declare function divide(value: bigint, divisor: bigint): bigint;
declare function divide(value: number, divisor: number): number;
/**
 * Divides two numbers.
 *
 * @param divisor - The number to divide the value by.
 * @signature
 *    R.divide(divisor)(value);
 * @example
 *    R.divide(3)(12) // => 4
 *    R.map([2, 4, 6, 8], R.divide(2)) // => [1, 2, 3, 4]
 * @dataLast
 * @category Number
 */
declare function divide(divisor: bigint): (value: bigint) => bigint;
declare function divide(divisor: number): (value: number) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/doNothing.d.ts
/**
 * A function that takes any arguments and does nothing with them. This is
 * useful as a placeholder for any function or API that requires a **void**
 * function (a function that doesn't return a value). This could also be used in
 * combination with a ternary or other conditional execution to allow disabling
 * a function call for a specific case.
 *
 * Notice that this is a dataLast impl where the function needs to be invoked
 * to get the "do nothing" function.
 *
 * See also:
 * * `constant` - A function that ignores it's arguments and returns the same value on every invocation.
 * * `identity` - A function that returns the first argument it receives.
 *
 * @signature
 *   R.doNothing();
 * @example
 *   myApi({ onSuccess: handleSuccess, onError: R.doNothing() });
 *   myApi({ onSuccess: isDemoMode ? R.doNothing(): handleSuccess });
 * @dataLast
 * @category Function
 */
declare function doNothing(): typeof doesNothing;
declare function doesNothing<Args extends ReadonlyArray<unknown>>(..._args: Args): void;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/ClampedIntegerSubtract-DdO1KLSt.d.ts
/**
 * We built our own version of Subtract instead of using type-fest's one
 * because we needed a simpler implementation that isn't as prone to excessive
 * recursion issues and that is clamped at 0 so that we don't need to handle
 * negative values using even more utilities.
 */
type ClampedIntegerSubtract<Minuend, Subtrahend, SubtrahendBag extends Array<unknown> = [], ResultBag extends Array<unknown> = []> = [...SubtrahendBag, ...ResultBag]["length"] extends Minuend ? ResultBag["length"] : SubtrahendBag["length"] extends Subtrahend ? ClampedIntegerSubtract<Minuend, Subtrahend, SubtrahendBag, [...ResultBag, unknown]> : ClampedIntegerSubtract<Minuend, Subtrahend, [...SubtrahendBag, unknown], ResultBag>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/CoercedArray-DRz3tqda.d.ts
/**
 * `never[]` and `[]` are not the same type, and in some cases they aren't
 * interchangeable.
 *
 * This type makes it easier to use the result of TupleParts when the input is a
 * fixed-length tuple but we still want to spread the rest of the array. e.g.
 * `[...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]]`.
 *
 */
type CoercedArray<T> = IfNever<T, [], Array<T>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/drop.d.ts
type Drop<T extends IterableContainer, N extends number> = IsNegative<N> extends true ? Writable<T> : IsInteger<N> extends false ? Array<T[number]> : ClampedIntegerSubtract<N, TupleParts<T>["required"]["length"]> extends infer RemainingPrefix extends number ? RemainingPrefix extends 0 ? [...DropFixedTuple<TupleParts<T>["required"], N>, ...PartialArray<TupleParts<T>["optional"]>, ...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]] : ClampedIntegerSubtract<RemainingPrefix, TupleParts<T>["optional"]["length"]> extends infer RemainingOptional extends number ? RemainingOptional extends 0 ? [...PartialArray<DropFixedTuple<TupleParts<T>["optional"], RemainingPrefix>>, ...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]] : [...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]] | Exclude<DropFixedTuple<TupleParts<T>["suffix"], RemainingOptional, true>, TupleParts<T>["suffix"]> : never : never;
type DropFixedTuple<T, N, IncludePrefixes = false, Dropped extends Array<unknown> = []> = Dropped["length"] extends N ? T : T extends readonly [unknown, ...infer Rest] ? DropFixedTuple<Rest, N, IncludePrefixes, [...Dropped, unknown]> | (true extends IncludePrefixes ? T : never) : [];
/**
 * Removes first `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to skip.
 * @signature
 *    R.drop(array, n)
 * @example
 *    R.drop([1, 2, 3, 4, 5], 2) // => [3, 4, 5]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function drop<T extends IterableContainer, N extends number>(array: T, n: N): Drop<T, N>;
/**
 * Removes first `n` elements from the `array`.
 *
 * @param n - The number of elements to skip.
 * @signature
 *    R.drop(n)(array)
 * @example
 *    R.drop(2)([1, 2, 3, 4, 5]) // => [3, 4, 5]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function drop<N extends number>(n: N): <T extends IterableContainer>(array: T) => Drop<T, N>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/purryOrderRules-BKXCPBNx.d.ts
declare const COMPARATORS: {
  readonly asc: <T>(x: T, y: T) => boolean;
  readonly desc: <T>(x: T, y: T) => boolean;
};
/**
 * An order rule defines a projection/extractor that returns a comparable from
 * the data being compared. It would be run on each item being compared, and a
 * comparator would then be used on the results to determine the order.
 *
 * There are 2 forms of the order rule, a simple one which only provides the
 * projection function and assumes ordering is ascending, and a 2-tuple where
 * the first element is the projection function and the second is the direction;
 * this allows changing the direction without defining a more complex projection
 * to simply negate the value (e.g. `(x) => -x`).
 *
 * We rely on the javascript implementation of `<` and `>` for comparison, which
 * will attempt to transform both operands into a primitive comparable value via
 * the built in `valueOf` function (and then `toString`). It's up to the caller
 * to make sure that the projection is returning a value that makes sense for
 * this logic.
 *
 * It's important to note that there is no built-in caching/memoization of
 * projection function and therefore no guarantee that it would only be called
 * once.
 */
type OrderRule<T> = Projection<T> | readonly [projection: Projection<T>, direction: keyof typeof COMPARATORS];
type Projection<T> = (x: T) => Comparable;
type Comparable = ComparablePrimitive | {
  [Symbol.toPrimitive]: (hint: string) => ComparablePrimitive;
} | {
  toString: () => string;
} | {
  valueOf: () => ComparablePrimitive;
};
type ComparablePrimitive = bigint | boolean | number | string;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/dropFirstBy.d.ts
/**
 * Drop the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before dropping the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to keep `n` elements) see `takeFirstBy`.
 *
 * @param data - The input array.
 * @param n - The number of items to drop. If `n` is non-positive no items would be dropped and a *clone* of the input would be returned, if `n` is bigger then data.length no items would be returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns A subset of the input array.
 * @signature
 *   R.dropFirstBy(data, n, ...rules);
 * @example
 *   R.dropFirstBy(['aa', 'aaaa', 'a', 'aaa'], 2, x => x.length); // => ['aaa', 'aaaa']
 * @dataFirst
 * @category Array
 */
declare function dropFirstBy<T>(data: ReadonlyArray<T>, n: number, ...rules: Readonly<NonEmptyArray<OrderRule<T>>>): Array<T>;
/**
 * Drop the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before dropping the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to keep `n` elements) see `takeFirstBy`.
 *
 * @param n - The number of items to drop. If `n` is non-positive no items would be dropped and a *clone* of the input would be returned, if `n` is bigger then data.length no items would be returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns A subset of the input array.
 * @signature
 *   R.dropFirstBy(n, ...rules)(data);
 * @example
 *   R.pipe(['aa', 'aaaa', 'a', 'aaa'], R.dropFirstBy(2, x => x.length)); // => ['aaa', 'aaaa']
 * @dataLast
 * @category Array
 */
declare function dropFirstBy<T>(n: number, ...rules: Readonly<NonEmptyArray<OrderRule<T>>>): (data: ReadonlyArray<T>) => Array<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/dropLast.d.ts
/**
 * Removes last `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to skip.
 * @signature
 *    R.dropLast(array, n)
 * @example
 *    R.dropLast([1, 2, 3, 4, 5], 2) // => [1, 2, 3]
 * @dataFirst
 * @category Array
 */
declare function dropLast<T extends IterableContainer>(array: T, n: number): Array<T[number]>;
/**
 * Removes last `n` elements from the `array`.
 *
 * @param n - The number of elements to skip.
 * @signature
 *    R.dropLast(n)(array)
 * @example
 *    R.dropLast(2)([1, 2, 3, 4, 5]) // => [1, 2, 3]
 * @dataLast
 * @category Array
 */
declare function dropLast(n: number): <T extends IterableContainer>(array: T) => Array<T[number]>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/dropLastWhile.d.ts
/**
 * Removes elements from the end of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array starting from the end and moving towards the beginning, until the predicate returns false. The returned array includes elements from the beginning of the array, up to and including the element that produced false for the predicate.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    R.dropLastWhile(data, predicate)
 * @example
 *    R.dropLastWhile([1, 2, 10, 3, 4], x => x < 10) // => [1, 2, 10]
 * @dataFirst
 * @category Array
 */
declare function dropLastWhile<T extends IterableContainer>(data: T, predicate: (item: T[number], index: number, data: T) => boolean): Array<T[number]>;
/**
 * Removes elements from the end of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array starting from the end and moving towards the beginning, until the predicate returns false. The returned array includes elements from the beginning of the array, up to and including the element that produced false for the predicate.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.dropLastWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 10, 3, 4], R.dropLastWhile(x => x < 10))  // => [1, 2, 10]
 * @dataLast
 * @category Array
 */
declare function dropLastWhile<T extends IterableContainer>(predicate: (item: T[number], index: number, data: T) => boolean): (data: T) => Array<T[number]>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/dropWhile.d.ts
/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    R.dropWhile(data, predicate)
 * @example
 *    R.dropWhile([1, 2, 10, 3, 4], x => x < 10) // => [10, 3, 4]
 * @dataFirst
 * @category Array
 */
declare function dropWhile<T extends IterableContainer>(data: T, predicate: (item: T[number], index: number, data: T) => boolean): Array<T[number]>;
/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.dropWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 10, 3, 4], R.dropWhile(x => x < 10))  // => [10, 3, 4]
 * @dataLast
 * @category Array
 */
declare function dropWhile<T extends IterableContainer>(predicate: (item: T[number], index: number, data: T) => boolean): (data: T) => Array<T[number]>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/endsWith.d.ts
/**
 * Determines whether the string ends with the provided suffix, and refines
 * the output if possible. Uses the built-in [`String.prototype.endsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith).
 *
 * @param data - The input string.
 * @param suffix - The prefix to check for.
 * @signature
 *   R.endsWith(data, suffix);
 * @example
 *   R.endsWith("hello world", "hello"); // false
 *   R.endsWith("hello world", "world"); // true
 * @dataFirst
 * @category String
 */
declare function endsWith<T extends string, Suffix extends string>(data: T, suffix: string extends Suffix ? never : Suffix): data is T & `${string}${Suffix}`;
declare function endsWith(data: string, suffix: string): boolean;
/**
 * Determines whether the string ends with the provided suffix, and refines
 * the output if possible. Uses the built-in [`String.prototype.endsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith).
 *
 * @param suffix - The prefix to check for.
 * @signature
 *   R.endsWith(suffix)(data);
 * @example
 *   R.pipe("hello world", R.endsWith("hello")); // false
 *   R.pipe("hello world", R.endsWith("world")); // true
 * @dataLast
 * @category String
 */
declare function endsWith<Suffix extends string>(suffix: string extends Suffix ? never : Suffix): <T extends string>(data: T) => data is T & `${string}${Suffix}`;
declare function endsWith(suffix: string): (data: string) => boolean;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/ToString-DO8zw6jS.d.ts
/**
 * A utility to preserve strings as-is, convert numbers to strings, and fail on
 * anything else. This happens a lot in JS when accessing objects or when
 * enumerating over keys.
 *
 * Notice that symbols are not supported, which is consistent with how built-in
 * functions like `Object.keys` and `Object.entries` behave.
 */
type ToString<T> = T extends unknown ? T extends number ? `${T}` : T extends string ? T : never : never;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/entries.d.ts
type Entry$1<T> = Simplify<ValueOf<{ [P in Exclude<keyof T, symbol>]-?: [key: ToString<P>, value: Required<T>[P]] }>>;
/**
 * Returns an array of key/values of the enumerable properties of an object.
 *
 * @param data - Object to return keys and values of.
 * @signature
 *    R.entries(object)
 * @example
 *    R.entries({ a: 1, b: 2, c: 3 }); // => [['a', 1], ['b', 2], ['c', 3]]
 * @dataFirst
 * @category Object
 */
declare function entries<T extends {}>(data: T): Array<Entry$1<T>>;
/**
 * Returns an array of key/values of the enumerable properties of an object.
 *
 * @signature
 *    R.entries()(object)
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3 }, R.entries()); // => [['a', 1], ['b', 2], ['c', 3]]
 * @dataLast
 * @category Object
 */
declare function entries(): <T extends {}>(data: T) => Array<Entry$1<T>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/evolve.d.ts
/**
 * Creates an assumed `evolver` type from the type of `data` argument.
 *
 * @example
 * interface Data {
 *   id: number;
 *   quartile: Array<number>;
 *   time?: { elapsed: number; remaining?: number };
 * }
 * type Nested = Evolver<Data>; //  => type Nested = {
 * //   id?: ((data: number) => unknown) | undefined;
 * //   quartile?: ((data: number[]) => unknown) | undefined;
 * //   time?:
 * //     | ((data: { elapsed: number; remaining?: number | undefined }) => unknown)
 * //     | {
 * //         elapsed?: ((data: number) => unknown) | undefined;
 * //         remaining?: ((data: number) => unknown) | undefined;
 * //       }
 * //     | undefined;
 * // };
 */
type Evolver<T> = T extends object ? T extends IterableContainer ? never : { readonly [K in keyof T]?: K extends symbol ? never : Evolver<T[K]> | ((data: Required<T>[K]) => unknown) } : never;
/**
 * Creates return type from the type of arguments of `evolve`.
 */
type Evolved<T, E> = T extends object ? { -readonly [K in keyof T]: K extends keyof E ? E[K] extends ((...arg: any) => infer R) ? R : Evolved<T[K], E[K]> : Required<T>[K] } : T;
/**
 * Creates a new object by applying functions that is included in `evolver` object parameter
 * to the `data` object parameter according to their corresponding path.
 *
 * Functions included in `evolver` object will not be invoked
 * if its corresponding key does not exist in the `data` object.
 * Also, values included in `data` object will be kept as is
 * if its corresponding key does not exist in the `evolver` object.
 *
 * @param object - Object whose value is applied to the corresponding function
 * that is defined in `evolver` at the same path.
 * @param evolver - Object that include functions that is applied to
 * the corresponding value of `data` object at the same path.
 * @signature
 *    R.evolve(data, evolver)
 * @example
 *    const evolver = {
 *      count: add(1),
 *      time: { elapsed: add(1), remaining: add(-1) },
 *    };
 *    const data = {
 *      id: 10,
 *      count: 10,
 *      time: { elapsed: 100, remaining: 1400 },
 *    };
 *    evolve(data, evolver)
 *    // => {
 *    //   id: 10,
 *    //   count: 11,
 *    //   time: { elapsed: 101, remaining: 1399 },
 *    // }
 * @dataFirst
 * @category Object
 */
declare function evolve<T extends object, E extends Evolver<T>>(object: T, evolver: E): Evolved<T, E>;
/**
 * Creates a new object by applying functions that is included in `evolver` object parameter
 * to the `data` object parameter according to their corresponding path.
 *
 * Functions included in `evolver` object will not be invoked
 * if its corresponding key does not exist in the `data` object.
 * Also, values included in `data` object will not be used
 * if its corresponding key does not exist in the `evolver` object.
 *
 * @param evolver - Object that include functions that is applied to
 * the corresponding value of `data` object at the same path.
 * @signature
 *    R.evolve(evolver)(data)
 * @example
 *    const evolver = {
 *      count: add(1),
 *      time: { elapsed: add(1), remaining: add(-1) },
 *    };
 *    const data = {
 *      id: 10,
 *      count: 10,
 *      time: { elapsed: 100, remaining: 1400 },
 *    };
 *    R.pipe(data, R.evolve(evolver))
 *    // => {
 *    //   id: 10,
 *    //   count: 11,
 *    //   time: { elapsed: 101, remaining: 1399 },
 *    // }
 * @dataLast
 * @category Object
 */
declare function evolve<T extends object, E extends Evolver<T>>(evolver: E): (object: T) => Evolved<T, E>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/FilteredArray-0g05hoCh.d.ts
type FilteredArray<T extends IterableContainer, Condition> = T extends unknown ? [...FilteredFixedTuple<TupleParts<T>["required"], Condition>, ...FilteredFixedTuple<TupleParts<T>["optional"], Condition>, ...CoercedArray<SymmetricRefine<TupleParts<T>["item"], Condition>>, ...FilteredFixedTuple<TupleParts<T>["suffix"], Condition>] : never;
type FilteredFixedTuple<T, Condition, Output extends Array<unknown> = []> = T extends readonly [infer Head, ...infer Rest] ? FilteredFixedTuple<Rest, Condition, Head extends Condition ? [...Output, Head] : Head | Condition extends object ? Output : Condition extends Head ?
// But for any other type (mostly primitives), if the condition
Output | [...Output, Condition] : Output> : Output;
type SymmetricRefine<Item, Condition> = Item extends Condition ? Item : Condition extends Item ? Condition : never;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/filter.d.ts
type NonRefinedFilteredArray<T extends IterableContainer, IsItemIncluded extends boolean> = boolean extends IsItemIncluded ? Array<T[number]> : IsItemIncluded extends true ? Writable<T> : [];
/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * @param data - The array to filter.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise. A type-predicate can also be used to narrow the result.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    R.filter(data, predicate)
 * @example
 *    R.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function filter<T extends IterableContainer, Condition extends T[number]>(data: T, predicate: (value: T[number], index: number, data: T) => value is Condition): FilteredArray<T, Condition>;
declare function filter<T extends IterableContainer, IsItemIncluded extends boolean>(data: T, predicate: (value: T[number], index: number, data: T) => IsItemIncluded): NonRefinedFilteredArray<T, IsItemIncluded>;
/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    R.filter(predicate)(data)
 * @example
 *    R.pipe([1, 2, 3], R.filter(x => x % 2 === 1)) // => [1, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function filter<T extends IterableContainer, Condition extends T[number]>(predicate: (value: T[number], index: number, data: T) => value is Condition): (data: T) => FilteredArray<T, Condition>;
declare function filter<T extends IterableContainer, IsItemIncluded extends boolean>(predicate: (value: T[number], index: number, data: T) => IsItemIncluded): (data: T) => NonRefinedFilteredArray<T, IsItemIncluded>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/find.d.ts
/**
 * Returns the first element in the provided array that satisfies the provided
 * testing function. If no values satisfy the testing function, `undefined` is
 * returned.
 *
 * Similar functions:
 * * `findLast` - If you need the last element that satisfies the provided testing function.
 * * `findIndex` - If you need the index of the found element in the array.
 * * `indexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The first element in the array that satisfies the provided testing
 * function. Otherwise, `undefined` is returned.
 * @signature
 *    R.find(data, predicate)
 * @example
 *    R.find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function find<T, S extends T>(data: ReadonlyArray<T>, predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S): S | undefined;
declare function find<T>(data: ReadonlyArray<T>, predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): T | undefined;
/**
 * Returns the first element in the provided array that satisfies the provided
 * testing function. If no values satisfy the testing function, `undefined` is
 * returned.
 *
 * Similar functions:
 * * `findLast` - If you need the last element that satisfies the provided testing function.
 * * `findIndex` - If you need the index of the found element in the array.
 * * `indexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The first element in the array that satisfies the provided testing
 * function. Otherwise, `undefined` is returned.
 * @signature
 *    R.find(predicate)(data)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.find(n => n % 2 === 0)
 *    ) // => 4
 * @dataLast
 * @lazy
 * @category Array
 */
declare function find<T, S extends T>(predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S): (data: ReadonlyArray<T>) => S | undefined;
declare function find<T>(predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): (data: ReadonlyArray<T>) => T | undefined;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/findIndex.d.ts
/**
 * Returns the index of the first element in an array that satisfies the
 * provided testing function. If no elements satisfy the testing function, -1 is
 * returned.
 *
 * See also the `find` method, which returns the first element that satisfies
 * the testing function (rather than its index).
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return a `true` to indicate a matching element has been found, and a
 * `false` otherwise.
 * @returns The index of the first element in the array that passes the test.
 * Otherwise, -1.
 * @signature
 *    R.findIndex(data, predicate)
 * @example
 *    R.findIndex([1, 3, 4, 6], n => n % 2 === 0) // => 2
 * @dataFirst
 * @category Array
 */
declare function findIndex<T>(data: ReadonlyArray<T>, predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean): number;
/**
 * Returns the index of the first element in an array that satisfies the
 * provided testing function. If no elements satisfy the testing function, -1 is
 * returned.
 *
 * See also the `find` method, which returns the first element that satisfies
 * the testing function (rather than its index).
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return a `true` to indicate a matching element has been found, and a
 * `false` otherwise.
 * @returns The index of the first element in the array that passes the test.
 * Otherwise, -1.
 * @signature
 *    R.findIndex(predicate)(data)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findIndex(n => n % 2 === 0)
 *    ); // => 2
 * @dataLast
 * @category Array
 */
declare function findIndex<T>(predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean): (data: ReadonlyArray<T>) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/findLast.d.ts
/**
 * Iterates the array in reverse order and returns the value of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, undefined is returned.
 *
 * Similar functions:
 * * `find` - If you need the first element that satisfies the provided testing function.
 * * `findLastIndex` - If you need the index of the found element in the array.
 * * `lastIndexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The last (highest-index) element in the array that satisfies the
 * provided testing function; undefined if no matching element is found.
 * @signature
 *    R.findLast(data, predicate)
 * @example
 *    R.findLast([1, 3, 4, 6], n => n % 2 === 1) // => 3
 * @dataFirst
 * @category Array
 */
declare function findLast<T, S extends T>(data: ReadonlyArray<T>, predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S): S | undefined;
declare function findLast<T>(data: ReadonlyArray<T>, predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): T | undefined;
/**
 * Iterates the array in reverse order and returns the value of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, undefined is returned.
 *
 * Similar functions:
 * * `find` - If you need the first element that satisfies the provided testing function.
 * * `findLastIndex` - If you need the index of the found element in the array.
 * * `lastIndexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The last (highest-index) element in the array that satisfies the
 * provided testing function; undefined if no matching element is found.
 * @signature
 *    R.findLast(predicate)(data)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findLast(n => n % 2 === 1)
 *    ) // => 3
 * @dataLast
 * @category Array
 */
declare function findLast<T, S extends T>(predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S): (data: ReadonlyArray<T>) => S | undefined;
declare function findLast<T = never>(predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): (data: ReadonlyArray<T>) => T | undefined;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/findLastIndex.d.ts
/**
 * Iterates the array in reverse order and returns the index of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, -1 is returned.
 *
 * See also `findLast` which returns the value of last element that satisfies
 * the testing function (rather than its index).
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise.
 * @returns The index of the last (highest-index) element in the array that
 * passes the test. Otherwise -1 if no matching element is found.
 * @signature
 *    R.findLastIndex(data, predicate)
 * @example
 *    R.findLastIndex([1, 3, 4, 6], n => n % 2 === 1) // => 1
 * @dataFirst
 * @category Array
 */
declare function findLastIndex<T>(data: ReadonlyArray<T>, predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): number;
/**
 * Iterates the array in reverse order and returns the index of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, -1 is returned.
 *
 * See also `findLast` which returns the value of last element that satisfies
 * the testing function (rather than its index).
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise.
 * @returns The index of the last (highest-index) element in the array that
 * passes the test. Otherwise -1 if no matching element is found.
 * @signature
 *    R.findLastIndex(fn)(items)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findLastIndex(n => n % 2 === 1)
 *    ) // => 1
 * @dataLast
 * @category Array
 */
declare function findLastIndex<T>(predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): (array: ReadonlyArray<T>) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/first.d.ts
type First$1<T extends IterableContainer> = T extends [] ? undefined : T extends readonly [unknown, ...Array<unknown>] ? T[0] : T extends readonly [...infer Pre, infer Last] ? Last | Pre[0] : T[0] | undefined;
/**
 * Gets the first element of `array`.
 *
 * @param data - The array.
 * @returns The first element of the array.
 * @signature
 *    R.first(array)
 * @example
 *    R.first([1, 2, 3]) // => 1
 *    R.first([]) // => undefined
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function first<T extends IterableContainer>(data: T): First$1<T>;
/**
 * Gets the first element of `array`.
 *
 * @returns The first element of the array.
 * @signature
 *    R.first()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 4, 8, 16],
 *      R.filter(x => x > 3),
 *      R.first(),
 *      x => x + 1
 *    ); // => 5
 * @dataLast
 * @lazy
 * @category Array
 */
declare function first(): <T extends IterableContainer>(data: T) => First$1<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/firstBy.d.ts
type FirstBy<T extends IterableContainer> = T[number] | (T extends readonly [unknown, ...ReadonlyArray<unknown>] ? never : T extends readonly [...ReadonlyArray<unknown>, unknown] ? never : undefined);
/**
 * Find the first element in the array that adheres to the order rules provided. This is a superset of what a typical `maxBy` or `minBy` function would do as it allows defining "tie-breaker" rules when values are equal, and allows comparing items using any logic. This function is equivalent to calling `R.first(R.sortBy(...))` but runs at *O(n)* instead of *O(nlogn)*.
 *
 * Use `nthBy` if you need an element other that the first, or `takeFirstBy` if you more than just the first element.
 *
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns The first element by the order criteria, or `undefined` if the array
 * is empty. (The function provides strong typing if the input type assures the
 * array isn't empty).
 * @signature
 *   R.firstBy(...rules)(data);
 * @example
 *   const max = R.pipe([1,2,3], R.firstBy([R.identity(), "desc"])); // => 3;
 *   const min = R.pipe([1,2,3], R.firstBy(R.identity())); // => 1;
 *
 *   const data = [{ a: "a" }, { a: "aa" }, { a: "aaa" }] as const;
 *   const maxBy = R.pipe(data, R.firstBy([(item) => item.a.length, "desc"])); // => { a: "aaa" };
 *   const minBy = R.pipe(data, R.firstBy((item) => item.a.length)); // => { a: "a" };
 *
 *   const data = [{type: "cat", size: 1}, {type: "cat", size: 2}, {type: "dog", size: 3}] as const;
 *   const multi = R.pipe(data, R.firstBy(R.prop('type'), [R.prop('size'), 'desc'])); // => {type: "cat", size: 2}
 * @dataLast
 * @category Array
 */
declare function firstBy<T extends IterableContainer>(...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>): (data: T) => FirstBy<T>;
/**
 * Find the first element in the array that adheres to the order rules provided. This is a superset of what a typical `maxBy` or `minBy` function would do as it allows defining "tie-breaker" rules when values are equal, and allows comparing items using any logic. This function is equivalent to calling `R.first(R.sortBy(...))` but runs at *O(n)* instead of *O(nlogn)*.
 *
 * Use `nthBy` if you need an element other that the first, or `takeFirstBy` if you more than just the first element.
 *
 * @param data - An array of items.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns The first element by the order criteria, or `undefined` if the array
 * is empty. (The function provides strong typing if the input type assures the
 * array isn't empty).
 * @signature
 *   R.firstBy(data, ...rules);
 * @example
 *   const max = R.firstBy([1,2,3], [R.identity(), "desc"]); // => 3;
 *   const min = R.firstBy([1,2,3], R.identity()); // => 1;
 *
 *   const data = [{ a: "a" }, { a: "aa" }, { a: "aaa" }] as const;
 *   const maxBy = R.firstBy(data, [(item) => item.a.length, "desc"]); // => { a: "aaa" };
 *   const minBy = R.firstBy(data, (item) => item.a.length); // => { a: "a" };
 *
 *   const data = [{type: "cat", size: 1}, {type: "cat", size: 2}, {type: "dog", size: 3}] as const;
 *   const multi = R.firstBy(data, R.prop('type'), [R.prop('size'), 'desc']); // => {type: "cat", size: 2}
 * @dataFirst
 * @category Array
 */
declare function firstBy<T extends IterableContainer>(data: T, ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>): FirstBy<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/flat.d.ts
type FlatArray<T, Depth extends number, Iteration extends ReadonlyArray<unknown> = []> = Depth extends Iteration["length"] ? T : T extends readonly [] ? [] : T extends readonly [infer Item, ...infer Rest] ? [...(Item extends IterableContainer ? FlatArray<Item, Depth, [...Iteration, unknown]> : [Item]), ...FlatArray<Rest, Depth, Iteration>] : Array<FlatSimpleArrayItems<T, Depth, Iteration>>;
type FlatSimpleArrayItems<T, Depth extends number, Iteration extends ReadonlyArray<unknown> = [], IsDone extends boolean = false> = {
  done: T;
  recur: T extends ReadonlyArray<infer InnerArr> ? FlatSimpleArrayItems<InnerArr, Depth, [...Iteration, unknown], Iteration["length"] extends Depth ? true : false> : T;
}[IsDone extends true ? "done" : "recur"];
/**
 * Creates a new array with all sub-array elements concatenated into it
 * recursively up to the specified depth. Equivalent to the built-in
 * `Array.prototype.flat` method.
 *
 * @param data - The items to flatten.
 * @param depth - The depth level specifying how deep a nested array structure
 * should be flattened. Defaults to 1. Non literal values (those typed as
 * `number`cannot be used. `Infinity`, `Number.POSITIVE_INFINITY` and
 * `Number.MAX_VALUE` are all typed as `number` and can't be used either. For
 * "unlimited" depth use a literal value that would exceed your expected
 * practical maximum nesting level.
 * @signature
 *   R.flat(data)
 *   R.flat(data, depth)
 * @example
 *   R.flat([[1, 2], [3, 4], [5], [[6]]]); // => [1, 2, 3, 4, 5, [6]]
 *   R.flat([[[1]], [[2]]], 2); // => [1, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function flat<T extends IterableContainer, Depth extends number = 1>(data: T, depth?: IsNumericLiteral<Depth> extends true ? Depth : never): FlatArray<T, Depth>;
/**
 * Creates a new array with all sub-array elements concatenated into it
 * recursively up to the specified depth. Equivalent to the built-in
 * `Array.prototype.flat` method.
 *
 * @param depth - The depth level specifying how deep a nested array structure
 * should be flattened. Defaults to 1.
 * @signature
 *   R.flat()(data)
 *   R.flat(depth)(data)
 * @example
 *   R.pipe([[1, 2], [3, 4], [5], [[6]]], R.flat()); // => [1, 2, 3, 4, 5, [6]]
 *   R.pipe([[[1]], [[2]]], R.flat(2)); // => [1, 2]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function flat<Depth extends number = 1>(depth?: IsNumericLiteral<Depth> extends true ? Depth : never): <T extends IterableContainer>(data: T) => FlatArray<T, Depth>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/flatMap.d.ts
/**
 * Returns a new array formed by applying a given callback function to each
 * element of the array, and then flattening the result by one level. It is
 * identical to a `map` followed by a `flat` of depth 1
 * (`flat(map(data, ...args))`), but slightly more efficient than calling those
 * two methods separately. Equivalent to `Array.prototype.flatMap`.
 *
 * @param data - The items to map and flatten.
 * @param callbackfn - A function to execute for each element in the array. It
 * should return an array containing new elements of the new array, or a single
 * non-array value to be added to the new array.
 * @returns A new array with each element being the result of the callback
 * function and flattened by a depth of 1.
 * @signature
 *    R.flatMap(data, callbackfn)
 * @example
 *    R.flatMap([1, 2, 3], x => [x, x * 10]) // => [1, 10, 2, 20, 3, 30]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function flatMap<T, U>(data: ReadonlyArray<T>, callbackfn: (input: T, index: number, data: ReadonlyArray<T>) => ReadonlyArray<U> | U): Array<U>;
/**
 * Returns a new array formed by applying a given callback function to each
 * element of the array, and then flattening the result by one level. It is
 * identical to a `map` followed by a `flat` of depth 1
 * (`flat(map(data, ...args))`), but slightly more efficient than calling those
 * two methods separately. Equivalent to `Array.prototype.flatMap`.
 *
 * @param callbackfn - A function to execute for each element in the array. It
 * should return an array containing new elements of the new array, or a single
 * non-array value to be added to the new array.
 * @returns A new array with each element being the result of the callback
 * function and flattened by a depth of 1.
 * @signature
 *    R.flatMap(callbackfn)(data)
 * @example
 *    R.pipe([1, 2, 3], R.flatMap(x => [x, x * 10])) // => [1, 10, 2, 20, 3, 30]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function flatMap<T, U>(callbackfn: (input: T, index: number, data: ReadonlyArray<T>) => ReadonlyArray<U> | U): (data: ReadonlyArray<T>) => Array<U>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/floor.d.ts
/**
 * Rounds down a given number to a specific precision.
 * If you'd like to round down to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.floor` instead, as it won't incur the additional library overhead.
 *
 * @param value - The number to round down.
 * @param precision - The precision to round down to. Must be an integer between -15 and 15.
 * @signature
 *    R.floor(value, precision);
 * @example
 *    R.floor(123.9876, 3) // => 123.987
 *    R.floor(483.22243, 1) // => 483.2
 *    R.floor(8541, -1) // => 8540
 *    R.floor(456789, -3) // => 456000
 * @dataFirst
 * @category Number
 */
declare function floor(value: number, precision: number): number;
/**
 * Rounds down a given number to a specific precision.
 * If you'd like to round down to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.floor` instead, as it won't incur the additional library overhead.
 *
 * @param precision - The precision to round down to. Must be an integer between -15 and 15.
 * @signature
 *    R.floor(precision)(value);
 * @example
 *    R.floor(3)(123.9876) // => 123.987
 *    R.floor(1)(483.22243) // => 483.2
 *    R.floor(-1)(8541) // => 8540
 *    R.floor(-3)(456789) // => 456000
 * @dataLast
 * @category Number
 */
declare function floor(precision: number): (value: number) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/forEach.d.ts
/**
 * Executes a provided function once for each array element. Equivalent to
 * `Array.prototype.forEach`.
 *
 * The dataLast version returns the original array (instead of not returning
 * anything (`void`)) to allow using it in a pipe. When not used in a `pipe` the
 * returned array is equal to the input array (by reference), and not a shallow
 * copy of it!
 *
 * @param data - The values that would be iterated on.
 * @param callbackfn - A function to execute for each element in the array.
 * @signature
 *    R.forEach(data, callbackfn)
 * @example
 *    R.forEach([1, 2, 3], x => {
 *      console.log(x)
 *    });
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function forEach<T extends IterableContainer>(data: T, callbackfn: (value: T[number], index: number, data: T) => void): void;
/**
 * Executes a provided function once for each array element. Equivalent to
 * `Array.prototype.forEach`.
 *
 * The dataLast version returns the original array (instead of not returning
 * anything (`void`)) to allow using it in a pipe. The returned array is the
 * same reference as the input array, and not a shallow copy of it!
 *
 * @param callbackfn - A function to execute for each element in the array.
 * @returns The original array (the ref itself, not a shallow copy of it).
 * @signature
 *    R.forEach(callbackfn)(data)
 * @example
 *    R.pipe(
 *      [1, 2, 3],
 *      R.forEach(x => {
 *        console.log(x)
 *      })
 *    ) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function forEach<T extends IterableContainer>(callbackfn: (value: T[number], index: number, data: T) => void): (data: T) => Writable<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/EnumerableStringKeyOf-CLExxPV5.d.ts
/**
 * A union of all keys of T which are not symbols, and where number keys are
 * converted to strings, following the definition of `Object.keys` and
 * `Object.entries`.
 *
 * Inspired and largely copied from [`sindresorhus/ts-extras`](https://github.com/sindresorhus/ts-extras/blob/44f57392c5f027268330771996c4fdf9260b22d6/source/object-keys.ts).
 *
 * @see EnumerableStringKeyedValueOf
 */
type EnumerableStringKeyOf<T> = Required<T> extends Record<infer K, unknown> ? ToString<K> : never;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/EnumerableStringKeyedValueOf-BU9R_cEk.d.ts
/**
 * A union of all values of properties in T which are not keyed by a symbol,
 * following the definition of `Object.values` and `Object.entries`.
 */
type EnumerableStringKeyedValueOf<T> = T extends unknown ? IfNever<Exclude<keyof T, symbol>, never, Required<T>[Exclude<keyof T, symbol>]> : never;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/forEachObj.d.ts
/**
 * Iterate an object using a defined callback function.
 *
 * The dataLast version returns the original object (instead of not returning
 * anything (`void`)) to allow using it in a pipe. The returned object is the
 * same reference as the input object, and not a shallow copy of it!
 *
 * @param data - The object who'se entries would be iterated on.
 * @param callbackfn - A function to execute for each element in the array.
 * @signature
 *    R.forEachObj(object, fn)
 * @example
 *    R.forEachObj({a: 1}, (val, key, obj) => {
 *      console.log(`${key}: ${val}`)
 *    }) // "a: 1"
 * @dataFirst
 * @category Object
 */
declare function forEachObj<T extends object>(data: T, callbackfn: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, obj: T) => void): void;
/**
 * Iterate an object using a defined callback function.
 *
 * The dataLast version returns the original object (instead of not returning
 * anything (`void`)) to allow using it in a pipe. The returned object is the
 * same reference as the input object, and not a shallow copy of it!
 *
 * @param callbackfn - A function to execute for each element in the array.
 * @returns The original object (the ref itself, not a shallow copy of it).
 * @signature
 *    R.forEachObj(fn)(object)
 * @example
 *    R.pipe(
 *      {a: 1},
 *      R.forEachObj((val, key) => console.log(`${key}: ${val}`))
 *    ) // "a: 1"
 * @dataLast
 * @category Object
 */
declare function forEachObj<T extends object>(callbackfn: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, obj: T) => void): (object: T) => T;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/fromEntries.d.ts
type FromEntriesError<Message extends string> = RemedaTypeError<"fromEntries", Message>;
type Entry<Key extends PropertyKey = PropertyKey, Value = unknown> = readonly [key: Key, value: Value];
type FromEntries<Entries> = Entries extends readonly [infer First, ...infer Tail] ? FromEntriesTuple<First, Tail> : Entries extends readonly [...infer Head, infer Last] ? FromEntriesTuple<Last, Head> : Entries extends IterableContainer<Entry> ? FromEntriesArray<Entries> : FromEntriesError<"Entries array-like could not be inferred">;
type FromEntriesTuple<E, Rest> = E extends Entry ? FromEntries<Rest> & Record<E[0], E[1]> : FromEntriesError<"Array-like contains a non-entry element">;
type FromEntriesArray<Entries extends IterableContainer<Entry>> = string extends AllKeys$1<Entries> ? Record<string, Entries[number][1]> : number extends AllKeys$1<Entries> ? Record<number, Entries[number][1]> : symbol extends AllKeys$1<Entries> ? Record<symbol, Entries[number][1]> : FromEntriesArrayWithLiteralKeys<Entries>;
type FromEntriesArrayWithLiteralKeys<Entries extends IterableContainer<Entry>> = { [P in AllKeys$1<Entries>]?: ValueForKey<Entries, P> };
type AllKeys$1<Entries extends IterableContainer<Entry>> = Extract<Entries[number], Entry>[0];
type ValueForKey<Entries extends IterableContainer<Entry>, K extends PropertyKey> = (Extract<Entries[number], Entry<K>> extends never ? Entries[number] : Extract<Entries[number], Entry<K>>)[1];
/**
 * Creates a new object from an array of tuples by pairing up first and second elements as {[key]: value}.
 * If a tuple is not supplied for any element in the array, the element will be ignored
 * If duplicate keys exist, the tuple with the greatest index in the input array will be preferred.
 *
 * The strict option supports more sophisticated use-cases like those that would
 * result when calling the strict `toPairs` function.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * Refer to the docs for more details.
 *
 * @param entries - An array of key-value pairs.
 * @signature
 *   R.fromEntries(tuples)
 * @example
 *   R.fromEntries([['a', 'b'], ['c', 'd']]); // => {a: 'b', c: 'd'}
 * @dataFirst
 * @category Object
 */
declare function fromEntries<Entries extends IterableContainer<Entry>>(entries: Entries): Simplify<FromEntries<Entries>>;
/**
 * Creates a new object from an array of tuples by pairing up first and second elements as {[key]: value}.
 * If a tuple is not supplied for any element in the array, the element will be ignored
 * If duplicate keys exist, the tuple with the greatest index in the input array will be preferred.
 *
 * The strict option supports more sophisticated use-cases like those that would
 * result when calling the strict `toPairs` function.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * Refer to the docs for more details.
 *
 * @signature
 *   R.fromEntries()(tuples)
 * @example
 *   R.pipe(
 *     [['a', 'b'], ['c', 'd']] as const,
 *     R.fromEntries(),
 *   ); // => {a: 'b', c: 'd'}
 * @dataLast
 * @category Object
 */
declare function fromEntries(): <Entries extends IterableContainer<Entry>>(entries: Entries) => Simplify<FromEntries<Entries>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/fromKeys.d.ts
type ExactlyOneKey<T, V> = T extends PropertyKey ? Record<T, V> : never;
type FromKeys<T extends IterableContainer, V> = T extends readonly [] ? {} : T extends readonly [infer Head, ...infer Rest] ? ExactlyOneKey<Head, V> & FromKeys<Rest, V> : T[number] extends PropertyKey ? BoundedPartial<Record<T[number], V>> : never;
/**
 * Creates an object that maps each key in `data` to the result of `mapper` for
 * that key. Duplicate keys are overwritten, guaranteeing that `mapper` is run
 * for each item in `data`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
 *
 * @param data - An array of keys of the output object. All items in the array
 * would be keys in the output array.
 * @param mapper - Takes a key and returns the value that would be associated
 * with that key.
 * @signature
 *   R.fromKeys(data, mapper);
 * @example
 *   R.fromKeys(["cat", "dog"], R.length()); // { cat: 3, dog: 3 } (typed as Partial<Record<"cat" | "dog", number>>)
 *   R.fromKeys([1, 2], R.add(1)); // { 1: 2, 2: 3 } (typed as Partial<Record<1 | 2, number>>)
 * @dataFirst
 * @category Object
 */
declare function fromKeys<T extends IterableContainer<PropertyKey>, V>(data: T, mapper: (item: T[number], index: number, data: T) => V): Simplify<FromKeys<T, V>>;
/**
 * Creates an object that maps each key in `data` to the result of `mapper` for
 * that key. Duplicate keys are overwritten, guaranteeing that `mapper` is run
 * for each item in `data`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
 *
 * @param mapper - Takes a key and returns the value that would be associated
 * with that key.
 * @signature
 *   R.fromKeys(mapper)(data);
 * @example
 *   R.pipe(["cat", "dog"], R.fromKeys(R.length())); // { cat: 3, dog: 3 } (typed as Partial<Record<"cat" | "dog", number>>)
 *   R.pipe([1, 2], R.fromKeys(R.add(1))); // { 1: 2, 2: 3 } (typed as Partial<Record<1 | 2, number>>)
 * @dataLast
 * @category Object
 */
declare function fromKeys<T extends IterableContainer<PropertyKey>, V>(mapper: (item: T[number], index: number, data: T) => V): (data: T) => Simplify<FromKeys<T, V>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/funnel.d.ts
type FunnelOptions<Args extends RestArguments, R> = {
  readonly reducer?: (accumulator: R | undefined, ...params: Args) => R;
} & FunnelTimingOptions;
type FunnelTimingOptions = ({
  readonly triggerAt?: "end";
} & (({
  readonly minGapMs: number;
} & RequireAtLeastOne<{
  readonly minQuietPeriodMs: number;
  readonly maxBurstDurationMs: number;
}>) | {
  readonly minQuietPeriodMs?: number;
  readonly maxBurstDurationMs?: number;
  readonly minGapMs?: never;
})) | {
  readonly triggerAt: "start" | "both";
  readonly minQuietPeriodMs?: number;
  readonly maxBurstDurationMs?: number;
  readonly minGapMs?: number;
};
type RestArguments = Array<any>;
type Funnel<Args extends RestArguments = []> = {
  /**
   * Call the function. This might result in the `execute` function being called
   * now or later, depending on it's configuration and it's current state.
   *
   * @param args - The args are defined by the `reducer` function.
   */
  readonly call: (...args: Args) => void;
  /**
   * Resets the funnel to it's initial state. Any calls made since the last
   * invocation will be discarded.
   */
  readonly cancel: () => void;
  /**
   * Triggers an invocation regardless of the current state of the funnel.
   * Like any other invocation, The funnel will also be reset to it's initial
   * state afterwards.
   */
  readonly flush: () => void;
  /**
   * The funnel is in it's initial state (there are no active timeouts).
   */
  readonly isIdle: boolean;
};
/**
 * Creates a funnel that controls the timing and execution of `callback`. Its
 * main purpose is to manage multiple consecutive (usually fast-paced) calls,
 * reshaping them according to a defined batching strategy and timing policy.
 * This is useful when handling uncontrolled call rates, such as DOM events or
 * network traffic. It can implement strategies like debouncing, throttling,
 * batching, and more.
 *
 * An optional `reducer` function can be provided to allow passing data to the
 * callback via calls to `call` (otherwise the signature of `call` takes no
 * arguments).
 *
 * Typing is inferred from `callback`s param, and from the rest params that
 * the optional `reducer` function accepts. Use **explicit** types for these
 * to ensure that everything _else_ is well-typed.
 *
 * Notice that this function constructs a funnel **object**, and does **not**
 * execute anything when called. The returned object should be used to execute
 * the funnel via the its `call` method.
 *
 * - Debouncing: use `minQuietPeriodMs` and any `triggerAt`.
 * - Throttling: use `minGapMs` and `triggerAt: "start"` or `"both"`.
 * - Batching: See the reference implementation in [`funnel.reference-batch.test.ts`](https://github.com/remeda/remeda/blob/main/packages/remeda/src/funnel.reference-batch.test.ts).
 *
 * @param callback - The main function that would be invoked periodically based
 * on `options`. The function would take the latest result of the `reducer`; if
 * no calls where made since the last time it was invoked it will not be
 * invoked. (If a return value is needed, it should be passed via a reference or
 * via closure to the outer scope of the funnel).
 * @param options - An object that defines when `execute` should be invoked,
 * relative to the calls of `call`. An empty/missing options object is
 * equivalent to setting `minQuietPeriodMs` to `0`.
 * @param options.reducer - Combines the arguments passed to `call` with the
 * value computed on the previous call (or `undefined` on the first time). The
 * goal of the function is to extract and summarize the data needed for
 * `callback`. It should be fast and simple as it is called often and should
 * defer heavy operations to the `execute` function. If the final value
 * is `undefined`, `callback` will not be called.
 * @param options.triggerAt - At what "edges" of the funnel's burst window
 * would `execute` invoke:
 * - `start` - the function will be invoked immediately (within the  **same**
 * execution frame!), and any subsequent calls would be ignored until the funnel
 * is idle again. During this period `reducer` will also not be called.
 * - `end` - the function will **not** be invoked initially but the timer will
 * be started. Any calls during this time would be passed to the reducer, and
 * when the timers are done, the reduced result would trigger an invocation.
 * - `both` - the function will be invoked immediately, and then the funnel
 * would behave as if it was in the 'end' state. @default 'end'.
 * @param options.minQuietPeriodMs - The burst timer prevents subsequent calls
 * in short succession to cause excessive invocations (aka "debounce"). This
 * duration represents the **minimum** amount of time that needs to pass
 * between calls (the "quiet" part) in order for the subsequent call to **not**
 * be considered part of the burst. In other words, as long as calls are faster
 * than this, they are considered part of the burst and the burst is extended.
 * @param options.maxBurstDurationMs - Bursts are extended every time a call is
 * made within the burst period. This means that the burst period could be
 * extended indefinitely. To prevent such cases, a maximum burst duration could
 * be defined. When `minQuietPeriodMs` is not defined and this option is, they
 * will both share the same value.
 * @param options.minGapMs - A minimum duration between calls of `execute`.
 * This is maintained regardless of the shape of the burst and is ensured even
 * if the `maxBurstDurationMs` is reached before it. (aka "throttle").
 * @returns A funnel with a `call` function that is used to trigger invocations.
 * In addition to it the funnel also comes with the following functions and
 * properties:
 * - `cancel` - Resets the funnel to it's initial state, discarding the current
 * `reducer` result without calling `execute` on it.
 * - `flush` - Triggers an invocation even if there are active timeouts, and
 * then resets the funnel to it's initial state.
 * - `isIdle` - Checks if there are any active timeouts.
 * @signature
 *   R.funnel(callback, options);
 * @example
 *   const debouncer = R.funnel(
 *     () => {
 *       console.log("Callback executed!");
 *     },
 *     { minQuietPeriodMs: 100 },
 *   );
 *   debouncer.call();
 *   debouncer.call();
 *
 *   const throttle = R.funnel(
 *     () => {
 *       console.log("Callback executed!");
 *     },
 *     { minGapMs: 100, triggerAt: "start" },
 *   );
 *   throttle.call();
 *   throttle.call();
 * @category Function
 */
declare function funnel<Args extends RestArguments = [], R = never>(callback: (data: R) => void, {
  triggerAt,
  minQuietPeriodMs,
  maxBurstDurationMs,
  minGapMs,
  reducer
}: FunnelOptions<Args, R>): Funnel<Args>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/groupBy.d.ts
/**
 * Groups the elements of a given iterable according to the string values
 * returned by a provided callback function. The returned object has separate
 * properties for each group, containing arrays with the elements in the group.
 * Unlike the built in `Object.groupBy` this function also allows the callback to
 * return `undefined` in order to exclude the item from being added to any
 * group.
 *
 * If you are grouping objects by a property of theirs (e.g.
 * `groupBy(data, ({ myProp }) => myProp)` or `groupBy(data, prop('myProp'))`)
 * consider using `groupByProp` (e.g. `groupByProp(data, 'myProp')`) instead,
 * as it would provide better typing.
 *
 * @param data - The items to group.
 * @param callbackfn - A function to execute for each element in the iterable.
 * It should return a value indicating the group of the current element, or
 * `undefined` when the item should be excluded from any group.
 * @returns An object with properties for all groups, each assigned to an array
 * containing the elements of the associated group.
 * @signature
 *    R.groupBy(data, callbackfn)
 * @example
 *    R.groupBy([{a: 'cat'}, {a: 'dog'}] as const, R.prop('a')) // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
 *    R.groupBy([0, 1], x => x % 2 === 0 ? 'even' : undefined) // => {even: [0]}
 * @dataFirst
 * @category Array
 */
declare function groupBy<T, Key extends PropertyKey = PropertyKey>(data: ReadonlyArray<T>, callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => Key | undefined): BoundedPartial<Record<Key, NonEmptyArray<T>>>;
/**
 * Groups the elements of a given iterable according to the string values
 * returned by a provided callback function. The returned object has separate
 * properties for each group, containing arrays with the elements in the group.
 * Unlike the built in `Object.groupBy` this function also allows the callback to
 * return `undefined` in order to exclude the item from being added to any
 * group.
 *
 * If you are grouping objects by a property of theirs (e.g.
 * `groupBy(data, ({ myProp }) => myProp)` or `groupBy(data, prop('myProp'))`)
 * consider using `groupByProp` (e.g. `groupByProp(data, 'myProp')`) instead,
 * as it would provide better typing.
 *
 * @param callbackfn - A function to execute for each element in the iterable.
 * It should return a value indicating the group of the current element, or
 * `undefined` when the item should be excluded from any group.
 * @returns An object with properties for all groups, each assigned to an array
 * containing the elements of the associated group.
 * @signature
 *    R.groupBy(callbackfn)(data);
 * @example
 *    R.pipe(
 *      [{a: 'cat'}, {a: 'dog'}] as const,
 *      R.groupBy(R.prop('a')),
 *    ); // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
 *    R.pipe(
 *      [0, 1],
 *      R.groupBy(x => x % 2 === 0 ? 'even' : undefined),
 *    ); // => {even: [0]}
 * @dataLast
 * @category Array
 */
declare function groupBy<T, Key extends PropertyKey = PropertyKey>(callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => Key | undefined): (items: ReadonlyArray<T>) => BoundedPartial<Record<Key, NonEmptyArray<T>>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/ArrayRequiredPrefix-BfmKgW23.d.ts
type ArrayRequiredPrefix<T extends IterableContainer, N extends number> = IsLiteral<N> extends true ? T extends unknown ? ClampedIntegerSubtract<N, [...TupleParts<T>["required"], ...TupleParts<T>["suffix"]]["length"]> extends infer Remainder extends number ? Remainder extends 0 ? T : And<GreaterThan<Remainder, TupleParts<T>["optional"]["length"]>, IsNever<TupleParts<T>["item"]>> extends true ? RemedaTypeError<"ArrayRequiredPrefix", "The input tuple cannot satisfy the minimum", {
  type: never;
  metadata: [T, N];
}> : WithSameReadonly<T, [...TupleParts<T>["required"], ...OptionalTupleRequiredPrefix<TupleParts<T>["optional"], Remainder>, ...ReadonlyTuple<TupleParts<T>["item"], ClampedIntegerSubtract<Remainder, TupleParts<T>["optional"]["length"]>>, ...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]]> : RemedaTypeError<"ArrayRequiredPrefix", "Remainder didn't compute to a number?!", {
  type: never;
  metadata: [T, N];
}> : RemedaTypeError<"ArrayRequiredPrefix", "Failed to distribute union?!", {
  type: never;
  metadata: T;
}> : RemedaTypeError<"ArrayRequiredPrefix", "Only literal minimums are supported!", {
  type: never;
  metadata: N;
}>;
type WithSameReadonly<Source, Destination> = IsEqual<Source, Readonly<Source>> extends true ? Readonly<Destination> : Destination;
type OptionalTupleRequiredPrefix<T extends Array<unknown>, N, Prefix extends Array<unknown> = []> = Prefix["length"] extends N ? [...Prefix, ...Partial<T>] : T extends readonly [infer Head, ...infer Rest] ? OptionalTupleRequiredPrefix<Rest, N, [...Prefix, Head]> : Prefix;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/hasAtLeast.d.ts
/**
 * Checks if the given array has at least the defined number of elements. When
 * the minimum used is a literal (e.g. `3`) the output is refined accordingly so
 * that those indices are defined when accessing the array even when using
 * typescript's 'noUncheckedIndexAccess'.
 *
 * @param data - The input array.
 * @param minimum - The minimum number of elements the array must have.
 * @returns True if the array's length is *at least* `minimum`. When `minimum`
 * is a literal value, the output is narrowed to ensure the first items are
 * guaranteed.
 * @signature
 *   R.hasAtLeast(data, minimum)
 * @example
 *   R.hasAtLeast([], 4); // => false
 *
 *   const data: number[] = [1,2,3,4];
 *   R.hasAtLeast(data, 1); // => true
 *   data[0]; // 1, with type `number`
 * @dataFirst
 * @category Array
 */
declare function hasAtLeast<T extends IterableContainer, N extends number>(data: IterableContainer | T, minimum: IsNumericLiteral<N> extends true ? N : never): data is ArrayRequiredPrefix<T, N>;
declare function hasAtLeast(data: IterableContainer, minimum: number): boolean;
/**
 * Checks if the given array has at least the defined number of elements. When
 * the minimum used is a literal (e.g. `3`) the output is refined accordingly so
 * that those indices are defined when accessing the array even when using
 * typescript's 'noUncheckedIndexAccess'.
 *
 * @param minimum - The minimum number of elements the array must have.
 * @returns True if the array's length is *at least* `minimum`. When `minimum`
 * is a literal value, the output is narrowed to ensure the first items are
 * guaranteed.
 * @signature
 *   R.hasAtLeast(minimum)(data)
 * @example
 *   R.pipe([], R.hasAtLeast(4)); // => false
 *
 *   const data = [[1,2], [3], [4,5]];
 *   R.pipe(
 *     data,
 *     R.filter(R.hasAtLeast(2)),
 *     R.map(([, second]) => second),
 *   ); // => [2,5], with type `number[]`
 * @dataLast
 * @category Array
 */
declare function hasAtLeast<N extends number>(minimum: IsNumericLiteral<N> extends true ? N : never): <T extends IterableContainer>(data: IterableContainer | T) => data is ArrayRequiredPrefix<T, N>;
declare function hasAtLeast(minimum: number): (data: IterableContainer) => boolean;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/hasSubObject.d.ts
declare const HAS_SUB_OBJECT_BRAND: unique symbol;
type HasSubObjectGuard<T, S> = Simplify<Tagged<S & T, typeof HAS_SUB_OBJECT_BRAND>>;
type HasSubObjectObjectValue<A, B> = Partial<{ [Key in keyof A & keyof B]: A[Key] & B[Key] extends never ? B[Key] : A[Key] | B[Key] extends object ? HasSubObjectObjectValue<A[Key], B[Key]> : A[Key] & B[Key] extends object ? B[Key] : A[Key] }> & { [Key in Exclude<keyof A, keyof B> | Exclude<keyof B, keyof A>]: Key extends keyof B ? B[Key] : never };
type HasSubObjectData<Data, SubObject, RData = Required<Data>, RSubObject = Required<SubObject>> = Partial<{ [Key in keyof RData & keyof RSubObject]: RData[Key] & RSubObject[Key] extends never ? RSubObject[Key] : RData[Key] | RSubObject[Key] extends object ? HasSubObjectObjectValue<RData[Key], RSubObject[Key]> : RData[Key] & RSubObject[Key] extends object ? RSubObject[Key] : RData[Key] }> & { [Key in Exclude<keyof SubObject, keyof Data>]: SubObject[Key] };
type HasSubObjectSubObject<SubObject, Data, RSubObject = Required<SubObject>, RData = Required<Data>> = Partial<{ [Key in keyof RData & keyof RSubObject]: RData[Key] & RSubObject[Key] extends never ? RData[Key] : RData[Key] | RSubObject[Key] extends object ? HasSubObjectObjectValue<RSubObject[Key], RData[Key]> : RData[Key] & RSubObject[Key] extends object ? RData[Key] : RSubObject[Key] }> & Record<Exclude<keyof SubObject, keyof Data>, never>;
/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `isDeepEqual`.
 *
 * @param data - The object to test.
 * @param subObject - The sub-object to test against.
 * @signature
 *    R.hasSubObject(data, subObject)
 * @example
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 }) //=> true
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, { b: 4 }) //=> false
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, {}) //=> true
 * @dataFirst
 * @category Guard
 */
declare function hasSubObject<T extends object, S extends HasSubObjectSubObject<S, T>>(data: T, subObject: S): data is HasSubObjectGuard<T, S>;
/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `isDeepEqual`.
 *
 * @param subObject - The sub-object to test against.
 * @signature
 *    R.hasSubObject(subObject)(data)
 * @example
 *    R.hasSubObject({ a: 1, c: 3 })({ a: 1, b: 2, c: 3 }) //=> true
 *    R.hasSubObject({ b: 4 })({ a: 1, b: 2, c: 3 }) //=> false
 *    R.hasSubObject({})({ a: 1, b: 2, c: 3 }) //=> true
 * @dataLast
 * @category Guard
 */
declare function hasSubObject<S extends object>(subObject: S): <T extends HasSubObjectData<T, S>>(data: T) => data is HasSubObjectGuard<T, S>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/identity.d.ts
type IdentityFunction = <T>(firstParameter: T, ...rest: any) => T;
/**
 * A function that returns the first argument passed to it.
 *
 * Notice that this is a dataLast impl where the function needs to be invoked
 * to get the "do nothing" function.
 *
 * See also:
 * * `doNothing` - A function that doesn't return anything.
 * * `constant` - A function that ignores the input arguments and returns the same value on every invocation.
 *
 * @signature
 *    R.identity();
 * @example
 *    R.map([1,2,3], R.identity()); // => [1,2,3]
 * @category Function
 */
declare function identity(): IdentityFunction;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/indexBy.d.ts
/**
 * Converts a list of objects into an object indexing the objects by the given
 * key.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
 *
 * @param data - The array.
 * @param mapper - The indexing function.
 * @signature
 *    R.indexBy(array, fn)
 * @example
 *    R.indexBy(['one', 'two', 'three'], x => x.length) // => {3: 'two', 5: 'three'}
 * @dataFirst
 * @category Array
 */
declare function indexBy<T, K extends PropertyKey>(data: ReadonlyArray<T>, mapper: (item: T, index: number, data: ReadonlyArray<T>) => K): BoundedPartial<Record<K, T>>;
/**
 * Converts a list of objects into an object indexing the objects by the given
 * key.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
 *
 * @param mapper - The indexing function.
 * @signature
 *    R.indexBy(fn)(array)
 * @example
 *    R.pipe(
 *      ['one', 'two', 'three'],
 *      R.indexBy(x => x.length)
 *    ) // => {3: 'two', 5: 'three'}
 * @dataLast
 * @category Array
 */
declare function indexBy<T, K extends PropertyKey>(mapper: (item: T, index: number, data: ReadonlyArray<T>) => K): (data: ReadonlyArray<T>) => BoundedPartial<Record<K, T>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/intersection.d.ts
/**
 * Returns a list of elements that exist in both array. The output maintains the
 * same order as the input. The inputs are treated as multi-sets/bags (multiple
 * copies of items are treated as unique items).
 *
 * @param data - The input items.
 * @param other - The items to compare against.
 * @signature
 *    R.intersection(data, other)
 * @example
 *    R.intersection([1, 2, 3], [2, 3, 5]); // => [2, 3]
 *    R.intersection([1, 1, 2, 2], [1]); // => [1]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function intersection<T, S>(data: ReadonlyArray<T>, other: ReadonlyArray<S>): Array<S & T>;
/**
 * Returns a list of elements that exist in both array. The output maintains the
 * same order as the input. The inputs are treated as multi-sets/bags (multiple
 * copies of items are treated as unique items).
 *
 * @param other - The items to compare against.
 * @signature
 *    R.intersection(other)(data)
 * @example
 *    R.pipe([1, 2, 3], R.intersection([2, 3, 5])); // => [2, 3]
 *    R.pipe([1, 1, 2, 2], R.intersection([1])); // => [1]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function intersection<S>(other: ReadonlyArray<S>): <T>(data: ReadonlyArray<T>) => Array<S & T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/intersectionWith.d.ts
type Comparator<TFirst, TSecond> = (a: TFirst, b: TSecond) => boolean;
/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 *
 * @param array - The source array.
 * @param other - The second array.
 * @param comparator - The custom comparator.
 * @signature
 *    R.intersectionWith(array, other, comparator)
 * @example
 *    R.intersectionWith(
 *      [
 *        { id: 1, name: 'Ryan' },
 *        { id: 3, name: 'Emma' },
 *      ],
 *      [3, 5],
 *      (a, b) => a.id === b,
 *    ) // => [{ id: 3, name: 'Emma' }]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function intersectionWith<TFirst, TSecond>(array: ReadonlyArray<TFirst>, other: ReadonlyArray<TSecond>, comparator: Comparator<TFirst, TSecond>): Array<TFirst>;
/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 *
 * @param other - The second array.
 * @param comparator - The custom comparator.
 * @signature
 *    R.intersectionWith(other, comparator)(array)
 * @example
 *    R.intersectionWith(
 *      [3, 5],
 *      (a, b) => a.id === b
 *      )([
 *        { id: 1, name: 'Ryan' },
 *        { id: 3, name: 'Emma' },
 *      ]); // => [{ id: 3, name: 'Emma' }]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function intersectionWith<TFirst, TSecond>(other: ReadonlyArray<TSecond>,
/**
 * Type inference doesn't work properly for the comparator's first parameter
 * in data last variant.
 */
comparator: Comparator<TFirst, TSecond>): (array: ReadonlyArray<TFirst>) => Array<TFirst>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/invert.d.ts
type Inverted<T extends object> = Simplify<{ -readonly [K in keyof T as K extends number | string ? Required<T>[K] extends PropertyKey ? Required<T>[K] : never : never]: ToString<K> }>;
/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @param object - The object.
 * @signature
 *    R.invert(object)
 * @example
 *    R.invert({ a: "d", b: "e", c: "f" }) // => { d: "a", e: "b", f: "c" }
 * @dataFirst
 * @category Object
 */
declare function invert<T extends object>(object: T): Inverted<T>;
/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @signature
 *    R.invert()(object)
 * @example
 *    R.pipe({ a: "d", b: "e", c: "f" }, R.invert()); // => { d: "a", e: "b", f: "c" }
 * @dataLast
 * @category Object
 */
declare function invert<T extends object>(): (object: T) => Inverted<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/NarrowedTo-CDIykNaN.d.ts
/**
 * An extension of Extract for type predicates which falls back to the base
 * in order to narrow the `unknown` case.
 *
 * @example
 *   function isMyType<T>(data: T | MyType): data is NarrowedTo<T, MyType> { ... }
 */
type NarrowedTo<T, Base> = Extract<T, Base> extends never ? Base : IsAny<T> extends true ? Base : Extract<T, Base>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isArray.d.ts
/**
 * A function that checks if the passed parameter is an Array and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is an Array, false otherwise.
 * @signature
 *    R.isArray(data)
 * @example
 *    R.isArray([5]) //=> true
 *    R.isArray([]) //=> true
 *    R.isArray('somethingElse') //=> false
 * @category Guard
 */
declare function isArray<T>(data: ArrayLike<unknown> | T): data is NarrowedTo<T, ReadonlyArray<unknown>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isBigInt.d.ts
/**
 * A function that checks if the passed parameter is a bigint and narrows its
 * type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a number, false otherwise.
 * @signature
 *    R.isBigInt(data)
 * @example
 *    R.isBigInt(1n); // => true
 *    R.isBigInt(1); // => false
 *    R.isBigInt('notANumber'); // => false
 * @category Guard
 */
declare function isBigInt<T>(data: T | bigint): data is NarrowedTo<T, bigint>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isBoolean.d.ts
/**
 * A function that checks if the passed parameter is a boolean and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a boolean, false otherwise.
 * @signature
 *    R.isBoolean(data)
 * @example
 *    R.isBoolean(true) //=> true
 *    R.isBoolean(false) //=> true
 *    R.isBoolean('somethingElse') //=> false
 * @category Guard
 */
declare function isBoolean<T>(data: T | boolean): data is NarrowedTo<T, boolean>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isDate.d.ts
/**
 * A function that checks if the passed parameter is a Date and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Date, false otherwise.
 * @signature
 *    R.isDate(data)
 * @example
 *    R.isDate(new Date()) //=> true
 *    R.isDate('somethingElse') //=> false
 * @category Guard
 */
declare function isDate(data: unknown): data is Date;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isDeepEqual.d.ts
/**
 * Performs a *deep structural* comparison between two values to determine if
 * they are equivalent. For primitive values this is equivalent to `===`, for
 * arrays the check would be performed on every item recursively, in order, and
 * for objects all props will be compared recursively.
 *
 * The built-in Date and RegExp are special-cased and will be compared by their
 * values.
 *
 * !IMPORTANT: TypedArrays and symbol properties of objects are not supported
 * right now and might result in unexpected behavior. Please open an issue in
 * the Remeda github project if you need support for these types.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isStrictEqual` if you don't need a deep comparison and just want to
 * check for simple (`===`, `Object.is`) equality.
 * - `isShallowEqual` if you need to compare arrays and objects "by-value" but
 * don't want to recurse into their values.
 *
 * @param data - The first value to compare.
 * @param other - The second value to compare.
 * @signature
 *    R.isDeepEqual(data, other)
 * @example
 *    R.isDeepEqual(1, 1) //=> true
 *    R.isDeepEqual(1, '1') //=> false
 *    R.isDeepEqual([1, 2, 3], [1, 2, 3]) //=> true
 * @dataFirst
 * @category Guard
 */
declare function isDeepEqual<T, S extends T>(data: T, other: T extends Exclude<T, S> ? S : never): data is S;
declare function isDeepEqual<T>(data: T, other: T): boolean;
/**
 * Performs a *deep structural* comparison between two values to determine if
 * they are equivalent. For primitive values this is equivalent to `===`, for
 * arrays the check would be performed on every item recursively, in order, and
 * for objects all props will be compared recursively.
 *
 * The built-in Date and RegExp are special-cased and will be compared by their
 * values.
 *
 * !IMPORTANT: TypedArrays and symbol properties of objects are not supported
 * right now and might result in unexpected behavior. Please open an issue in
 * the Remeda github project if you need support for these types.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isStrictEqual` if you don't need a deep comparison and just want to
 * check for simple (`===`, `Object.is`) equality.
 * - `isShallowEqual` if you need to compare arrays and objects "by-value" but
 * don't want to recurse into their values.
 *
 * @param other - The second value to compare.
 * @signature
 *    R.isDeepEqual(other)(data)
 * @example
 *    R.pipe(1, R.isDeepEqual(1)); //=> true
 *    R.pipe(1, R.isDeepEqual('1')); //=> false
 *    R.pipe([1, 2, 3], R.isDeepEqual([1, 2, 3])); //=> true
 * @dataLast
 * @category Guard
 */
declare function isDeepEqual<T, S extends T>(other: T extends Exclude<T, S> ? S : never): (data: T) => data is S;
declare function isDeepEqual<T>(other: T): (data: T) => boolean;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isDefined.d.ts
/**
 * A function that checks if the passed parameter is defined (`!== undefined`)
 * and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is defined, false otherwise.
 * @signature
 *    R.isDefined(data)
 * @example
 *    R.isDefined('string') //=> true
 *    R.isDefined(null) //=> true
 *    R.isDefined(undefined) //=> false
 * @category Guard
 */
declare function isDefined<T>(data: T | undefined): data is T;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isEmpty.d.ts
/**
 * A function that checks if the passed parameter is empty.
 *
 * `undefined` is also considered empty, but only when it's in a union with a
 * `string` or string-like type.
 *
 * This guard doesn't work negated because of typescript limitations! If you
 * need to check that an array is *not* empty, use `R.hasAtLeast(data, 1)`
 * and not `!R.isEmpty(data)`. For strings and objects there's no way in
 * typescript to narrow the result to a non-empty type.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is empty, false otherwise.
 * @signature
 *    R.isEmpty(data)
 * @example
 *    R.isEmpty(undefined) //=>true
 *    R.isEmpty('') //=> true
 *    R.isEmpty([]) //=> true
 *    R.isEmpty({}) //=> true
 *    R.isEmpty('test') //=> false
 *    R.isEmpty([1, 2, 3]) //=> false
 *    R.isEmpty({ length: 0 }) //=> false
 * @category Guard
 */
declare function isEmpty<T extends string | undefined>(data: T): data is ("" extends T ? "" : never) | (undefined extends T ? undefined : never);
declare function isEmpty(data: IterableContainer): data is [];
declare function isEmpty<T extends object>(data: T): data is Record<keyof T, never>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isError.d.ts
type DefinitelyError<T> = Extract<T, Error> extends never ? Error : Extract<T, Error>;
/**
 * A function that checks if the passed parameter is an Error and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is an Error, false otherwise.
 * @signature
 *    R.isError(data)
 * @example
 *    R.isError(new Error('message')) //=> true
 *    R.isError('somethingElse') //=> false
 * @category Guard
 */
declare function isError<T>(data: Error | T): data is DefinitelyError<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isFunction.d.ts
type DefinitelyFunction<T> = Extract<T, Function> extends never ? Function : Extract<T, Function>;
/**
 * A function that checks if the passed parameter is a Function and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Function, false otherwise.
 * @signature
 *    R.isFunction(data)
 * @example
 *    R.isFunction(() => {}) //=> true
 *    R.isFunction('somethingElse') //=> false
 * @category Guard
 */
declare function isFunction<T>(data: Function | T): data is DefinitelyFunction<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isIncludedIn.d.ts
/**
 * A "constant" tuple is a type that has a single runtime value that can fulfil
 * it. This means that it doesn't have any variadic/rest/spread/array parts, and
 * that all it's values are singular (non-union) literals.
 *
 * We use this type to allow narrowing when checking against a set of values
 * defined as a const.
 *
 * @example
 *   type T1 = IsConstantTuple<["cat", "dog", 3, true]>; // => true;
 *   type T2 = IsConstantTuple<["cat" | "dog"]>; // false;
 *   type T2 = IsConstantTuple<["cat", ...Array<"cat">]>; // false;
 */
type IsConstantTuple<T extends IterableContainer> = T extends readonly [] ? true : T extends readonly [infer Head, ...infer Rest] ? IsUnion<Head> extends true ? false : IsConstantTuple<Rest> : false;
/**
 * There is no way to tell Typescript to only narrow the "accepted" side of a
 * type-predicate and so in many cases the negated side is also affected, this
 * results in over-narrowing in many cases, breaking typing. For this reason we
 * only want to use the type-predicate variant of `isIncludedIn` when we can
 * assume the result represents the expected types (closely enough). This is not
 * and ideal solution and we will still generate wrong types in some cases (see
 * tests), but it reduces the surface of this problem significantly, while still
 * keeping the utility of `isIncludedIn` for the common cases.
 *
 * TL;DR - The types are narrowable when: T is literal and S is a pure tuple, or
 * when T isn't a literal, but S is.
 *
 * @example
 *   const data = 1 as 1 | 2 | 3;
 *   const container = [] as Array<1 | 2>;
 *   if (isIncludedIn(data, container)) {
 *     ... it makes sense to narrow data to `1 | 2` as the value `3` is not part
 *     ... of the typing of container, so will never result in being true.
 *   } else {
 *     ... but it doesn't make sense to narrow the value to 3 here, because 1
 *     ... and 2 are still valid values for data, when container doesn't include
 *     ... them **at runtime**.
 *     ... Typescript narrows the _rejected_ branch based on how it narrowed the
 *     ... _accepted_ clause, and we can't control that; because our input type
 *     ... is `1 | 2 | 3` and the accepted side is `1 | 2`, the rejected side is
 *     ... typed `Exclude<1 | 2 | 3, 1 | 2>`, which is `3`.
 *   }
 * }
 */
type IsNarrowable<T, S extends IterableContainer<T>> = IsLiteral<T> extends true ? IsConstantTuple<S> : IsLiteral<S[number]>;
/**
 * Checks if the item is included in the container. This is a wrapper around
 * `Array.prototype.includes` and `Set.prototype.has` and thus relies on the
 * same equality checks that those functions do (which is reference equality,
 * e.g. `===`). In some cases the input's type is also narrowed to the
 * container's item types.
 *
 * Notice that unlike most functions, this function takes a generic item as it's
 * data and **an array** as it's parameter.
 *
 * @param data - The item that is checked.
 * @param container - The items that are checked against.
 * @returns `true` if the item is in the container, or `false` otherwise. In
 * cases the type of `data` is also narrowed down.
 * @signature
 *   R.isIncludedIn(data, container);
 * @example
 *   R.isIncludedIn(2, [1, 2, 3]); // => true
 *   R.isIncludedIn(4, [1, 2, 3]); // => false
 *
 *   const data = "cat" as "cat" | "dog" | "mouse";
 *   R.isIncludedIn(data, ["cat", "dog"] as const); // true (typed "cat" | "dog");
 * @dataFirst
 * @category Guard
 */
declare function isIncludedIn<T, S extends IterableContainer<T>>(data: T, container: IsNarrowable<T, S> extends true ? S : never): data is S[number];
declare function isIncludedIn<T, S extends T>(data: T, container: IterableContainer<S>): boolean;
/**
 * Checks if the item is included in the container. This is a wrapper around
 * `Array.prototype.includes` and `Set.prototype.has` and thus relies on the
 * same equality checks that those functions do (which is reference equality,
 * e.g. `===`). In some cases the input's type is also narrowed to the
 * container's item types.
 *
 * Notice that unlike most functions, this function takes a generic item as it's
 * data and **an array** as it's parameter.
 *
 * @param container - The items that are checked against.
 * @returns `true` if the item is in the container, or `false` otherwise. In
 * cases the type of `data` is also narrowed down.
 * @signature
 *   R.isIncludedIn(container)(data);
 * @example
 *   R.pipe(2, R.isIncludedIn([1, 2, 3])); // => true
 *   R.pipe(4, R.isIncludedIn([1, 2, 3])); // => false
 *
 *   const data = "cat" as "cat" | "dog" | "mouse";
 *   R.pipe(
 *     data,
 *     R.isIncludedIn(["cat", "dog"] as const),
 *   ); // => true (typed "cat" | "dog");
 * @dataLast
 * @category Guard
 */
declare function isIncludedIn<T, S extends IterableContainer<T>>(container: IsNarrowable<T, S> extends true ? S : never): (data: T) => data is S[number];
declare function isIncludedIn<T, S extends T>(container: IterableContainer<S>): (data: T) => boolean;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isNonNull.d.ts
/**
 * A function that checks if the passed parameter is not `null` and narrows its type accordingly.
 * Notice that `undefined` is not null!
 *
 * @param data - The variable to check.
 * @returns True if the passed input is defined, false otherwise.
 * @signature
 *    R.isNonNull(data)
 * @example
 *    R.isNonNull('string') //=> true
 *    R.isNonNull(null) //=> false
 *    R.isNonNull(undefined) //=> true
 * @category Guard
 */
declare function isNonNull<T>(data: T | null): data is T;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isNonNullish.d.ts
/**
 * A function that checks if the passed parameter is defined *AND* isn't `null`
 * and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is defined and isn't `null`, false
 * otherwise.
 * @signature
 *    R.isNonNullish(data)
 * @example
 *    R.isNonNullish('string') //=> true
 *    R.isNonNullish(null) //=> false
 *    R.isNonNullish(undefined) //=> false
 * @category Guard
 */
declare function isNonNullish<T>(data: T): data is NonNullable<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isNot.d.ts
/**
 * A function that takes a guard function as predicate and returns a guard that negates it.
 *
 * @param predicate - The guard function to negate.
 * @returns Function A guard function.
 * @signature
 *    R.isNot(R.isTruthy)(data)
 * @example
 *    R.isNot(R.isTruthy)(false) //=> true
 *    R.isNot(R.isTruthy)(true) //=> false
 * @dataLast
 * @category Guard
 */
declare function isNot<T, S extends T>(predicate: (data: T) => data is S): (data: T) => data is Exclude<T, S>;
declare function isNot<T>(predicate: (data: T) => boolean): (data: T) => boolean;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isNullish.d.ts
/**
 * A function that checks if the passed parameter is either `null` or
 * `undefined` and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is either `null` or `undefined`, false
 * otherwise.
 * @signature
 *    R.isNullish(data)
 * @example
 *    R.isNullish(undefined) //=> true
 *    R.isNullish(null) //=> true
 *    R.isNullish('somethingElse') //=> false
 * @category Guard
 */
declare function isNullish<T>(data: T | null | undefined): data is NarrowedTo<T, null | undefined>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isNumber.d.ts
/**
 * A function that checks if the passed parameter is a number and narrows its
 * type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a number, false otherwise.
 * @signature
 *    R.isNumber(data)
 * @example
 *    R.isNumber(1); // => true
 *    R.isNumber(1n); // => false
 *    R.isNumber('notANumber'); // => false
 * @category Guard
 */
declare function isNumber<T>(data: T | number): data is NarrowedTo<T, number>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isObjectType.d.ts
/**
 * Checks if the given parameter is of type `"object"` via `typeof`, excluding `null`.
 *
 * It's important to note that in JavaScript, many entities are considered objects, like Arrays, Classes, RegExps, Maps, Sets, Dates, URLs, Promise, Errors, and more. Although technically an object too, `null` is not considered an object by this function, so that its easier to narrow nullables.
 *
 * For a more specific check that is limited to plain objects (simple struct/shape/record-like objects), consider using `isPlainObject` instead. For a simpler check that only removes `null` from the type prefer `isNonNull` or `isDefined`.
 *
 * @param data - The variable to be checked for being an object type.
 * @returns The input type, narrowed to only objects.
 * @signature
 *    R.isObjectType(data)
 * @example
 *    // true
 *    R.isObjectType({}) //=> true
 *    R.isObjectType([]) //=> true
 *    R.isObjectType(Promise.resolve("something")) //=> true
 *    R.isObjectType(new Date()) //=> true
 *    R.isObjectType(new Error("error")) //=> true
 *
 *    // false
 *    R.isObjectType('somethingElse') //=> false
 *    R.isObjectType(null) //=> false
 * @dataFirst
 * @category Guard
 */
declare function isObjectType<T>(data: T | object): data is NarrowedTo<T, object>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isPlainObject.d.ts
/**
 * Checks if `data` is a "plain" object. A plain object is defined as an object with string keys and values of any type, including primitives, other objects, functions, classes, etc (aka struct/shape/record/simple). Technically, a plain object is one whose prototype is either `Object.prototype` or `null`, ensuring it does not inherit properties or methods from other object types.
 *
 * This function is narrower in scope than `isObjectType`, which accepts any entity considered an `"object"` by JavaScript's `typeof`.
 *
 * Note that Maps, Arrays, and Sets are not considered plain objects and would return `false`.
 *
 * @param data - The variable to check.
 * @returns The input type, narrowed to only plain objects.
 * @signature
 *    R.isPlainObject(data)
 * @example
 *    // true
 *    R.isPlainObject({}) //=> true
 *    R.isPlainObject({ a: 123 }) //=> true
 *
 *    // false
 *    R.isPlainObject([]) //=> false
 *    R.isPlainObject(Promise.resolve("something")) //=> false
 *    R.isPlainObject(new Date()) //=> false
 *    R.isPlainObject(new Error("error")) //=> false
 *    R.isPlainObject('somethingElse') //=> false
 *    R.isPlainObject(null) //=> false
 * @category Guard
 */
declare function isPlainObject<T>(data: Readonly<Record<PropertyKey, unknown>> | T): data is NarrowedTo<T, Record<PropertyKey, unknown>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isPromise.d.ts
/**
 * A function that checks if the passed parameter is a Promise and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Promise, false otherwise.
 * @signature
 *    R.isPromise(data)
 * @example
 *    R.isPromise(Promise.resolve(5)) //=> true
 *    R.isPromise(Promise.reject(5)) //=> true
 *    R.isPromise('somethingElse') //=> false
 * @category Guard
 */
declare function isPromise<T>(data: Readonly<PromiseLike<unknown>> | T): data is NarrowedTo<T, PromiseLike<unknown>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isShallowEqual.d.ts
/**
 * Performs a *shallow structural* comparison between two values to determine if
 * they are equivalent. For primitive values this is equivalent to `===`, for
 * arrays a **strict equality** check would be performed on every item, in
 * order, and for objects props will be matched and checked for **strict
 * equality**; Unlike `isDeepEqual` where the function also *recurses* into each
 * item and value.
 *
 * !IMPORTANT: symbol properties of objects are not supported right now and
 * might result in unexpected behavior. Please open an issue in the Remeda
 * github project if you need support for these types.
 *
 * !IMPORTANT: Promise, Date, and RegExp, are shallowly equal, even when they
 * are semantically different (e.g. resolved promises); but `isDeepEqual` does
 * compare the latter 2 semantically by-value.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isStrictEqual` if you don't need a deep comparison and just want to check
 * for simple (`===`, `Object.is`) equality.
 * - `isDeepEqual` for a recursively deep check of arrays and objects.
 *
 * @param data - The first value to compare.
 * @param other - The second value to compare.
 * @signature
 *    R.isShallowEqual(data, other)
 * @example
 *    R.isShallowEqual(1, 1) //=> true
 *    R.isShallowEqual(1, '1') //=> false
 *    R.isShallowEqual([1, 2, 3], [1, 2, 3]) //=> true
 *    R.isShallowEqual([[1], [2], [3]], [[1], [2], [3]]) //=> false
 * @dataFirst
 * @category Guard
 */
declare function isShallowEqual<T, S extends T>(data: T, other: T extends Exclude<T, S> ? S : never): data is S;
declare function isShallowEqual<T>(data: T, other: T): boolean;
/**
 * Performs a *shallow structural* comparison between two values to determine if
 * they are equivalent. For primitive values this is equivalent to `===`, for
 * arrays a **strict equality** check would be performed on every item, in
 * order, and for objects props will be matched and checked for **strict
 * equality**; Unlike `isDeepEqual` where the function also *recurses* into each
 * item and value.
 *
 * !IMPORTANT: symbol properties of objects are not supported right now and
 * might result in unexpected behavior. Please open an issue in the Remeda
 * github project if you need support for these types.
 *
 * !IMPORTANT: All built-in objects (Promise, Date, RegExp) are shallowly equal,
 * even when they are semantically different (e.g. resolved promises). Use
 * `isDeepEqual` instead.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isStrictEqual` if you don't need a deep comparison and just want to check
 * for simple (`===`, `Object.is`) equality.
 * - `isDeepEqual` for a recursively deep check of arrays and objects.
 *
 * @param other - The second value to compare.
 * @signature
 *    R.isShallowEqual(other)(data)
 * @example
 *    R.pipe(1, R.isShallowEqual(1)) //=> true
 *    R.pipe(1, R.isShallowEqual('1')) //=> false
 *    R.pipe([1, 2, 3], R.isShallowEqual([1, 2, 3])) //=> true
 *    R.pipe([[1], [2], [3]], R.isShallowEqual([[1], [2], [3]])) //=> false
 * @dataFirst
 * @category Guard
 */
declare function isShallowEqual<T, S extends T>(other: T extends Exclude<T, S> ? S : never): (data: T) => data is S;
declare function isShallowEqual<T>(other: T): (data: T) => boolean;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isStrictEqual.d.ts
/**
 * Determines whether two values are *functionally identical* in all contexts.
 * For primitive values (string, number), this is done by-value, and for objects
 * it is done by-reference (i.e., they point to the same object in memory).
 *
 * Under the hood we use **both** the [`===` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
 * and [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). This means that `isStrictEqual(NaN, NaN) === true`
 * (whereas `NaN !== NaN`), and `isStrictEqual(-0, 0) === true` (whereas
 * `Object.is(-0, 0) === false`).
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isDeepEqual` for a semantic comparison that allows comparing arrays and
 * objects "by-value", and recurses for every item.
 * - `isShallowEqual` if you need to compare arrays and objects "by-value" but
 * don't want to recurse into their values.
 *
 * @param data - The first value to compare.
 * @param other - The second value to compare.
 * @signature
 *    R.isStrictEqual(data, other)
 * @example
 *    R.isStrictEqual(1, 1) //=> true
 *    R.isStrictEqual(1, '1') //=> false
 *    R.isStrictEqual([1, 2, 3], [1, 2, 3]) //=> false
 * @dataFirst
 * @category Guard
 */
declare function isStrictEqual<T, S extends T>(data: T, other: T extends Exclude<T, S> ? S : never): data is S;
declare function isStrictEqual<T>(data: T, other: T): boolean;
/**
 * Determines whether two values are *functionally identical* in all contexts.
 * For primitive values (string, number), this is done by-value, and for objects
 * it is done by-reference (i.e., they point to the same object in memory).
 *
 * Under the hood we use **both** the [`===` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
 * and [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). This means that `isStrictEqual(NaN, NaN) === true`
 * (whereas `NaN !== NaN`), and `isStrictEqual(-0, 0) === true` (whereas
 * `Object.is(-0, 0) === false`).
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isDeepEqual` for a semantic comparison that allows comparing arrays and
 * objects "by-value", and recurses for every item.
 * - `isShallowEqual` if you need to compare arrays and objects "by-value" but
 * don't want to recurse into their values.
 *
 * @param other - The second value to compare.
 * @signature
 *    R.isStrictEqual(other)(data)
 * @example
 *    R.pipe(1, R.isStrictEqual(1)); //=> true
 *    R.pipe(1, R.isStrictEqual('1')); //=> false
 *    R.pipe([1, 2, 3], R.isStrictEqual([1, 2, 3])); //=> false
 * @dataLast
 * @category Guard
 */
declare function isStrictEqual<T, S extends T>(other: T extends Exclude<T, S> ? S : never): (data: T) => data is S;
declare function isStrictEqual<T>(other: T): (data: T) => boolean;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isString.d.ts
/**
 * A function that checks if the passed parameter is a string and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a string, false otherwise.
 * @signature
 *    R.isString(data)
 * @example
 *    R.isString('string') //=> true
 *    R.isString(1) //=> false
 * @category Guard
 */
declare function isString<T>(data: T | string): data is NarrowedTo<T, string>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isSymbol.d.ts
/**
 * A function that checks if the passed parameter is a symbol and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a symbol, false otherwise.
 * @signature
 *    R.isSymbol(data)
 * @example
 *    R.isSymbol(Symbol('foo')) //=> true
 *    R.isSymbol(1) //=> false
 * @category Guard
 */
declare function isSymbol<T>(data: T | symbol): data is NarrowedTo<T, symbol>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/isTruthy.d.ts
/**
 * A function that checks if the passed parameter is truthy and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is truthy, false otherwise.
 * @signature
 *    R.isTruthy(data)
 * @example
 *    R.isTruthy('somethingElse') //=> true
 *    R.isTruthy(null) //=> false
 *    R.isTruthy(undefined) //=> false
 *    R.isTruthy(false) //=> false
 *    R.isTruthy(0) //=> false
 *    R.isTruthy('') //=> false
 * @category Guard
 */
declare function isTruthy<T>(data: T): data is Exclude<T, "" | 0 | false | null | undefined>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/join.d.ts
type JoinableItem = bigint | boolean | number | string | null | undefined;
/**
 * Joins the elements of the array by: casting them to a string and
 * concatenating them one to the other, with the provided glue string in between
 * every two elements.
 *
 * When called on a tuple and with stricter item types (union of literal values,
 * the result is strictly typed to the tuples shape and it's item types).
 *
 * @param data - The array to join.
 * @param glue - The string to put in between every two elements.
 * @signature
 *    R.join(data, glue)
 * @example
 *    R.join([1,2,3], ",") // => "1,2,3" (typed `string`)
 *    R.join(['a','b','c'], "") // => "abc" (typed `string`)
 *    R.join(['hello', 'world'] as const, " ") // => "hello world" (typed `hello world`)
 * @dataFirst
 * @category Array
 */
declare function join<T extends ReadonlyArray<JoinableItem> | [], Glue extends string>(data: T, glue: Glue): Join<T, Glue>;
/**
 * Joins the elements of the array by: casting them to a string and
 * concatenating them one to the other, with the provided glue string in between
 * every two elements.
 *
 * When called on a tuple and with stricter item types (union of literal values,
 * the result is strictly typed to the tuples shape and it's item types).
 *
 * @param glue - The string to put in between every two elements.
 * @signature
 *    R.join(glue)(data)
 * @example
 *    R.pipe([1,2,3], R.join(",")) // => "1,2,3" (typed `string`)
 *    R.pipe(['a','b','c'], R.join("")) // => "abc" (typed `string`)
 *    R.pipe(['hello', 'world'] as const, R.join(" ")) // => "hello world" (typed `hello world`)
 * @dataLast
 * @category Array
 */
declare function join<T extends ReadonlyArray<JoinableItem> | [], Glue extends string>(glue: Glue): (data: T) => Join<T, Glue>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/keys.d.ts
type Keys$1<T> = T extends IterableContainer ? ArrayKeys<T> : ObjectKeys<T>;
type ArrayKeys<T extends IterableContainer> = { -readonly [Index in keyof T]: Index extends number | string ? ToString<IsIndexAfterSpread<T, Index> extends true ? number : Index> : never };
type IsIndexAfterSpread<T extends IterableContainer, Index extends number | string> = IndicesAfterSpread<T> extends never ? false : Index extends `${IndicesAfterSpread<T>}` ? true : false;
type IndicesAfterSpread<T extends ReadonlyArray<unknown> | [], Iterations extends ReadonlyArray<unknown> = []> = T[number] extends never ? never : T extends readonly [unknown, ...infer Tail] ? IndicesAfterSpread<Tail, [unknown, ...Iterations]> : T extends readonly [...infer Head, unknown] ? IndicesAfterSpread<Head, [unknown, ...Iterations]> | Iterations["length"] : Iterations["length"];
type ObjectKeys<T> = T extends Record<PropertyKey, never> ? [] : Array<EnumerableStringKeyOf<T>>;
/**
 * Returns a new array containing the keys of the array or object.
 *
 * @param data - Either an array or an object.
 * @signature
 *    R.keys(source)
 * @example
 *    R.keys(['x', 'y', 'z']); // => ['0', '1', '2']
 *    R.keys({ a: 'x', b: 'y', 5: 'z' }); // => ['a', 'b', '5']
 * @dataFirst
 * @category Object
 */
declare function keys<T extends object>(data: T): Keys$1<T>;
/**
 * Returns a new array containing the keys of the array or object.
 *
 * @signature
 *    R.keys()(source)
 * @example
 *    R.Pipe(['x', 'y', 'z'], keys()); // => ['0', '1', '2']
 *    R.pipe({ a: 'x', b: 'y', 5: 'z' } as const, R.keys()) // => ['a', 'b', '5']
 * @dataLast
 * @category Object
 */
declare function keys(): <T extends object>(data: T) => Keys$1<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/last.d.ts
type Last$1<T extends IterableContainer> = LastArrayElement<T, T extends readonly [] ? never : undefined>;
/**
 * Gets the last element of `array`.
 *
 * @param data - The array.
 * @signature
 *    R.last(array)
 * @example
 *    R.last([1, 2, 3]) // => 3
 *    R.last([]) // => undefined
 * @dataFirst
 * @category Array
 */
declare function last<T extends IterableContainer>(data: T): Last$1<T>;
/**
 * Gets the last element of `array`.
 *
 * @signature
 *    R.last()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 4, 8, 16],
 *      R.filter(x => x > 3),
 *      R.last(),
 *      x => x + 1
 *    ); // => 17
 * @dataLast
 * @category Array
 */
declare function last(): <T extends IterableContainer>(data: T) => Last$1<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/length.d.ts
type Enumerable<T> = ArrayLike<T> | Iterable<T>;
/**
 * Counts values of the collection or iterable.
 *
 * @param items - The input data.
 * @signature
 *    R.length(array)
 * @example
 *    R.length([1, 2, 3]) // => 3
 * @dataFirst
 * @category Array
 */
declare function length<T>(items: Enumerable<T>): number;
/**
 * Counts values of the collection or iterable.
 *
 * @signature
 *    R.length()(array)
 * @example
 *    R.pipe([1, 2, 3], R.length()) // => 3
 * @dataLast
 * @category Array
 */
declare function length<T>(): (items: Enumerable<T>) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/Mapped-oLjj1faZ.d.ts
type Mapped<T extends IterableContainer, K> = { -readonly [P in keyof T]: K };
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/map.d.ts
/**
 * Creates a new array populated with the results of calling a provided function
 * on every element in the calling array. Equivalent to `Array.prototype.map`.
 *
 * @param data - The array to map.
 * @param callbackfn - A function to execute for each element in the array. Its
 * return value is added as a single element in the new array.
 * @returns A new array with each element being the result of the callback
 * function.
 * @signature
 *    R.map(data, callbackfn)
 * @example
 *    R.map([1, 2, 3], R.multiply(2)); // => [2, 4, 6]
 *    R.map([0, 0], R.add(1)); // => [1, 1]
 *    R.map([0, 0], (value, index) => value + index); // => [0, 1]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function map<T extends IterableContainer, U>(data: T, callbackfn: (value: T[number], index: number, data: T) => U): Mapped<T, U>;
/**
 * Creates a new array populated with the results of calling a provided function
 * on every element in the calling array. Equivalent to `Array.prototype.map`.
 *
 * @param callbackfn - A function to execute for each element in the array. Its
 * return value is added as a single element in the new array.
 * @returns A new array with each element being the result of the callback
 * function.
 * @signature
 *    R.map(callbackfn)(data)
 * @example
 *    R.pipe([1, 2, 3], R.map(R.multiply(2))); // => [2, 4, 6]
 *    R.pipe([0, 0], R.map(R.add(1))); // => [1, 1]
 *    R.pipe([0, 0], R.map((value, index) => value + index)); // => [0, 1]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function map<T extends IterableContainer, U>(callbackfn: (value: T[number], index: number, data: T) => U): (data: T) => Mapped<T, U>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/mapKeys.d.ts
/**
 * Maps keys of `object` and keeps the same values.
 *
 * @param data - The object to map.
 * @param keyMapper - The mapping function.
 * @signature
 *    R.mapKeys(object, fn)
 * @example
 *    R.mapKeys({a: 1, b: 2}, (key, value) => key + value) // => { a1: 1, b2: 2 }
 * @dataFirst
 * @category Object
 */
declare function mapKeys<T extends {}, S extends PropertyKey>(data: T, keyMapper: (key: EnumerableStringKeyOf<T>, value: EnumerableStringKeyedValueOf<T>, data: T) => S): BoundedPartial<Record<S, EnumerableStringKeyedValueOf<T>>>;
/**
 * Maps keys of `object` and keeps the same values.
 *
 * @param keyMapper - The mapping function.
 * @signature
 *    R.mapKeys(fn)(object)
 * @example
 *    R.pipe({a: 1, b: 2}, R.mapKeys((key, value) => key + value)) // => { a1: 1, b2: 2 }
 * @dataLast
 * @category Object
 */
declare function mapKeys<T extends {}, S extends PropertyKey>(keyMapper: (key: EnumerableStringKeyOf<T>, value: EnumerableStringKeyedValueOf<T>, data: T) => S): (data: T) => BoundedPartial<Record<S, EnumerableStringKeyedValueOf<T>>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/mapToObj.d.ts
/**
 * Map each element of an array into an object using a defined mapper that
 * converts each item into an object entry (a tuple of `[<key>, <value>]`).
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * - `fromKeys` - Builds an object from an array of *keys* and a mapper for
 * values.
 * - `indexBy` - Builds an object from an array of *values* and a mapper for
 * keys.
 * - `pullObject` - Builds an object from an array of items with a mapper for
 * values and another mapper for keys.
 * - `fromEntries` - Builds an object from an array of key-value pairs.
 *
 * **Warning**: We strongly advise against using this function unless it is
 * used with a huge input array and your app has stringent memory/gc
 * constraints. We recommend that in most cases you should use `pullObject`,
 * or the composition `fromEntries(map(array, fn))`. This function will be
 * deprecated and **removed** in future versions of the library!
 *
 * @param array - The array to map.
 * @param fn - The mapping function, which should return a tuple of [key, value], similar to Object.fromEntries.
 * @returns The new mapped object.
 * @signature
 *    R.mapToObj(array, fn)
 * @example
 *    R.mapToObj([1, 2, 3], x => [String(x), x * 2]) // => {1: 2, 2: 4, 3: 6}
 * @dataFirst
 * @category Array
 */
declare function mapToObj<T, K extends PropertyKey, V>(array: ReadonlyArray<T>, fn: (value: T, index: number, data: ReadonlyArray<T>) => [K, V]): Record<K, V>;
/**
 * Map each element of an array into an object using a defined mapper that
 * converts each item into an object entry (a tuple of `[<key>, <value>]`).
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * - `fromKeys` - Builds an object from an array of *keys* and a mapper for
 * values.
 * - `indexBy` - Builds an object from an array of *values* and a mapper for
 * keys.
 * - `pullObject` - Builds an object from an array of items with a mapper for
 * values and another mapper for keys.
 * - `fromEntries` - Builds an object from an array of key-value pairs.
 *
 * **Warning**: We strongly advise against using this function unless it is
 * used with a huge input array and your app has stringent memory/gc
 * constraints. We recommend that in most cases you should use `pullObject`,
 * or the composition `fromEntries(map(array, fn))`. This function will be
 * deprecated and **removed** in future versions of the library!
 *
 * @param fn - The mapping function, which should return a tuple of [key, value], similar to Object.fromEntries.
 * @returns The new mapped object.
 * @signature
 *    R.mapToObj(fn)(array)
 * @example
 *    R.pipe(
 *      [1, 2, 3],
 *      R.mapToObj(x => [String(x), x * 2])
 *    ) // => {1: 2, 2: 4, 3: 6}
 * @dataLast
 * @category Array
 */
declare function mapToObj<T, K extends PropertyKey, V>(fn: (value: T, index: number, data: ReadonlyArray<T>) => [K, V]): (array: ReadonlyArray<T>) => Record<K, V>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/mapValues.d.ts
type MappedValues<T extends object, Value> = Simplify<{ -readonly [P in keyof T as P extends number | string ? P : never]: Value }>;
/**
 * Maps values of `object` and keeps the same keys. Symbol keys are not passed
 * to the mapper and will be removed from the output object.
 *
 * To also copy the symbol keys to the output use merge:
 * `merge(data, mapValues(data, mapper))`).
 *
 * @param data - The object to map.
 * @param valueMapper - The mapping function.
 * @signature
 *    R.mapValues(data, mapper)
 * @example
 *    R.mapValues({a: 1, b: 2}, (value, key) => value + key) // => {a: '1a', b: '2b'}
 * @dataFirst
 * @category Object
 */
declare function mapValues<T extends object, Value>(data: T, valueMapper: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => Value): MappedValues<T, Value>;
/**
 * Maps values of `object` and keeps the same keys. Symbol keys are not passed
 * to the mapper and will be removed from the output object.
 *
 * To also copy the symbol keys to the output use merge:
 * `merge(data, mapValues(data, mapper))`).
 *
 * @param valueMapper - The mapping function.
 * @signature
 *    R.mapValues(mapper)(data)
 * @example
 *    R.pipe({a: 1, b: 2}, R.mapValues((value, key) => value + key)) // => {a: '1a', b: '2b'}
 * @dataLast
 * @category Object
 */
declare function mapValues<T extends object, Value>(valueMapper: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => Value): (data: T) => MappedValues<T, Value>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/mapWithFeedback.d.ts
/**
 * Applies a function on each element of the array, using the result of the
 * previous application, and returns an array of the successively computed
 * values.
 *
 * @param data - The array to map over.
 * @param callbackfn - The callback function that receives the previous value,
 * the current element.
 * @param initialValue - The initial value to start the computation with.
 * @returns An array of successively computed values from the left side of the
 * array.
 * @signature
 *    R.mapWithFeedback(data, callbackfn, initialValue);
 * @example
 *    R.mapWithFeedback(
 *      [1, 2, 3, 4, 5],
 *      (prev, x) => prev + x,
 *      100,
 *    ); // => [101, 103, 106, 110, 115]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function mapWithFeedback<T extends IterableContainer, U>(data: T, callbackfn: (previousValue: U, currentValue: T[number], currentIndex: number, data: T) => U, initialValue: U): Mapped<T, U>;
/**
 * Applies a function on each element of the array, using the result of the
 * previous application, and returns an array of the successively computed
 * values.
 *
 * @param callbackfn - The callback function that receives the previous value,
 * the current element.
 * @param initialValue - The initial value to start the computation with.
 * @returns An array of successively computed values from the left side of the
 * array.
 * @signature
 *    R.mapWithFeedback(callbackfn, initialValue)(data);
 * @example
 *    R.pipe(
 *      [1, 2, 3, 4, 5],
 *      R.mapWithFeedback((prev, x) => prev + x, 100),
 *    ); // => [101, 103, 106, 110, 115]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function mapWithFeedback<T extends IterableContainer, U>(callbackfn: (previousValue: U, currentValue: T[number], currentIndex: number, data: T) => U, initialValue: U): (data: T) => Mapped<T, U>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/mean.d.ts
type Mean<T extends IterableContainer<number>> = (T extends readonly [] ? never : number) | (T extends readonly [unknown, ...Array<unknown>] ? never : undefined);
/**
 * Returns the mean of the elements of an array.
 *
 * Only `number` arrays are supported, as `bigint` is unable to represent fractional values.
 *
 * IMPORTANT: The result for empty arrays would be `undefined`, regardless of
 * the type of the array. This approach improves type-checking and ensures that
 * cases where `NaN` might occur are handled properly. To avoid adding this to
 * the return type for cases where the array is known to be non-empty you can use
 * `hasAtLeast` or `isEmpty` to guard against this case.
 *
 * @param data - The array of numbers.
 * @signature
 *   R.mean(data);
 * @example
 *   R.mean([1, 2, 3]); // => 2
 *   R.mean([]); // => undefined
 * @dataFirst
 * @category Number
 */
declare function mean<T extends IterableContainer<number>>(data: T): Mean<T>;
/**
 * Returns the mean of the elements of an array.
 *
 * Only `number` arrays are supported, as `bigint` is unable to represent fractional values.
 *
 * IMPORTANT: The result for empty arrays would be `undefined`, regardless of
 * the type of the array. This approach improves type-checking and ensures that
 * cases where `NaN` might occur are handled properly. To avoid adding this to
 * the return type for cases where the array is known to be non-empty you can use
 * `hasAtLeast` or `isEmpty` to guard against this case.
 *
 * @signature
 *   R.mean()(data);
 * @example
 *   R.pipe([1, 2, 3], R.mean()); // => 2
 *   R.pipe([], R.mean()); // => undefined
 * @dataLast
 * @category Number
 */
declare function mean(): <T extends IterableContainer<number>>(data: T) => Mean<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/meanBy.d.ts
/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param fn - Predicate function.
 * @signature
 *   R.meanBy(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.meanBy(x => x.a)
 *    ) // 3
 * @dataLast
 * @category Array
 */
declare function meanBy<T>(fn: (value: T, index: number, data: ReadonlyArray<T>) => number): (items: ReadonlyArray<T>) => number;
/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param items - The array.
 * @param fn - Predicate function.
 * @signature
 *   R.meanBy(array, fn)
 * @example
 *    R.meanBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 3
 * @dataFirst
 * @category Array
 */
declare function meanBy<T>(items: ReadonlyArray<T>, fn: (value: T, index: number, data: ReadonlyArray<T>) => number): number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/median.d.ts
type Median<T extends IterableContainer<number>> = (T extends readonly [] ? never : number) | (T extends readonly [unknown, ...Array<unknown>] ? never : undefined);
/**
 * Returns the median of the elements of an array.
 *
 * Only `number` arrays are supported, as `bigint` is unable to represent fractional values.
 *
 * IMPORTANT: The result for empty arrays would be `undefined`, regardless of
 * the type of the array. This approach improves type-checking and ensures that
 * cases where `NaN` might occur are handled properly. To avoid adding this to
 * the return type for cases where the array is known to be non-empty you can use
 * `hasAtLeast` or `isEmpty` to guard against this case.
 *
 * @param data - The array of numbers.
 * @signature
 *   R.median(data);
 * @example
 *   R.pipe([6, 10, 11], R.median()); // => 10
 *   R.median([]); // => undefined
 * @dataFirst
 * @category Number
 */
declare function median<T extends IterableContainer<number>>(data: T): Median<T>;
/**
 * Returns the median of the elements of an array.
 *
 * Only `number` arrays are supported, as `bigint` is unable to represent fractional values.
 *
 * IMPORTANT: The result for empty arrays would be `undefined`, regardless of
 * the type of the array. This approach improves type-checking and ensures that
 * cases where `NaN` might occur are handled properly. To avoid adding this to
 * the return type for cases where the array is known to be non-empty you can use
 * `hasAtLeast` or `isEmpty` to guard against this case.
 *
 * @signature
 *   R.median()(data);
 * @example
 *   R.pipe([6, 10, 11], R.median()); // => 10
 *   R.pipe([], R.median()); // => undefined
 * @dataLast
 * @category Number
 */
declare function median(): <T extends IterableContainer<number>>(data: T) => Median<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/merge.d.ts
/**
 * Merges two objects into one by combining their properties, effectively
 * creating a new object that incorporates elements from both. The merge
 * operation prioritizes the second object's properties, allowing them to
 * overwrite those from the first object with the same names.
 *
 * Equivalent to `{ ...data, ...source }`.
 *
 * @param data - The destination object, serving as the basis for the merge.
 * Properties from this object are included in the new object, but will be
 * overwritten by properties from the source object with matching keys.
 * @param source - The source object, whose properties will be included in the
 * new object. If properties in this object share keys with properties in the
 * destination object, the values from the source object will be used in the
 * new object.
 * @returns An object fully containing `source`, and any properties from `data`
 * that don't share a name with any property in `source`.
 * @signature
 *    R.merge(data, source)
 * @example
 *    R.merge({ x: 1, y: 2 }, { y: 10, z: 2 }) // => { x: 1, y: 10, z: 2 }
 * @dataFirst
 * @category Object
 */
declare function merge<T, Source>(data: T, source: Source): Merge<T, Source>;
/**
 * Merges two objects into one by combining their properties, effectively
 * creating a new object that incorporates elements from both. The merge
 * operation prioritizes the second object's properties, allowing them to
 * overwrite those from the first object with the same names.
 *
 * Equivalent to `{ ...data, ...source }`.
 *
 * @param source - The source object, whose properties will be included in the
 * new object. If properties in this object share keys with properties in the
 * destination object, the values from the source object will be used in the
 * new object.
 * @returns An object fully containing `source`, and any properties from `data`
 * that don't share a name with any property in `source`.
 * @signature
 *    R.merge(source)(data)
 * @example
 *    R.pipe(
 *      { x: 1, y: 2 },
 *      R.merge({ y: 10, z: 2 }),
 *    ); // => { x: 1, y: 10, z: 2 }
 * @dataLast
 * @category Object
 */
declare function merge<Source>(source: Source): <T>(data: T) => Merge<T, Source>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/mergeAll.d.ts
/**
 * Gets the set of keys that are not shared by all members of a union. This is the complement of the keys of {@link SharedUnionFields}.
 */
type DisjointUnionFieldKeys<T extends object> = Exclude<KeysOfUnion<T>, keyof SharedUnionFields<T>>;
/**
 * Gets the set of fields that are not shared by all members of a union. This is the complement of {@link SharedUnionFields}.
 */
type DisjointUnionFields<T extends object> = { [K in DisjointUnionFieldKeys<T>]: T extends Partial<Record<K, unknown>> ? T[K] : never };

/**
 * Merge a tuple of object types, where props from later objects override earlier props.
 */
type MergeTuple<T extends IterableContainer, Result = object> = T extends readonly [infer Head, ...infer Rest] ? MergeTuple<Rest, Merge<Result, Head>> : Result;
type MergeUnion<T extends object> = Simplify<SharedUnionFields<T> & Partial<DisjointUnionFields<T>>>;
type MergeAll<T extends IterableContainer<object>> = TupleParts<T> extends {
  item: never;
} ? T extends readonly [] ? EmptyObject : MergeTuple<T> : MergeUnion<T[number]> | EmptyObject;
/**
 * Merges a list of objects into a single object.
 *
 * @param objects - The array of objects.
 * @returns A new object merged with all of the objects in the list. If the list is empty, an empty object is returned.
 * @signature
 *    R.mergeAll(objects)
 * @example
 *    R.mergeAll([{ a: 1, b: 1 }, { b: 2, c: 3 }, { d: 10 }]) // => { a: 1, b: 2, c: 3, d: 10 }
 *    R.mergeAll([]) // => {}
 * @dataFirst
 * @category Array
 */
declare function mergeAll<T extends object>(objects: Readonly<NonEmptyArray<T>>): MergeUnion<T>;
declare function mergeAll<T extends IterableContainer<object>>(objects: T): MergeAll<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/mergeDeep.d.ts
/**
 * Merges the `source` object into the `destination` object. The merge is similar to performing `{ ...destination, ... source }` (where disjoint values from each object would be copied as-is, and for any overlapping props the value from `source` would be used); But for *each prop* (`p`), if **both** `destination` and `source` have a **plain-object** as a value, the value would be taken as the result of recursively deepMerging them (`result.p === deepMerge(destination.p, source.p)`).
 *
 * @param destination - The object to merge into. In general, this object would have it's values overridden.
 * @param source - The object to merge from. In general, shared keys would be taken from this object.
 * @returns The merged object.
 * @signature
 *    R.mergeDeep(destination, source)
 * @example
 *    R.mergeDeep({ foo: 'bar', x: 1 }, { foo: 'baz', y: 2 }) // => { foo: 'baz', x: 1, y: 2 }
 * @dataFirst
 * @category Object
 */
declare function mergeDeep<Destination extends object, Source extends object>(destination: Destination, source: Source): MergeDeep<Destination, Source>;
/**
 * Merges the `source` object into the `destination` object. The merge is similar to performing `{ ...destination, ... source }` (where disjoint values from each object would be copied as-is, and for any overlapping props the value from `source` would be used); But for *each prop* (`p`), if **both** `destination` and `source` have a **plain-object** as a value, the value would be taken as the result of recursively deepMerging them (`result.p === deepMerge(destination.p, source.p)`).
 *
 * @param source - The object to merge from. In general, shared keys would be taken from this object.
 * @returns The merged object.
 * @signature
 *    R.mergeDeep(source)(destination)
 * @example
 *    R.pipe(
 *      { foo: 'bar', x: 1 },
 *      R.mergeDeep({ foo: 'baz', y: 2 }),
 *    );  // => { foo: 'baz', x: 1, y: 2 }
 * @dataLast
 * @category Object
 */
declare function mergeDeep<Source extends object>(source: Source): <Destination extends object>(target: Destination) => MergeDeep<Destination, Source>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/multiply.d.ts
/**
 * Multiplies two numbers.
 *
 * @param value - The number.
 * @param multiplicand - The number to multiply the value by.
 * @signature
 *    R.multiply(value, multiplicand);
 * @example
 *    R.multiply(3, 4) // => 12
 *    R.reduce([1, 2, 3, 4], R.multiply, 1) // => 24
 * @dataFirst
 * @category Number
 */
declare function multiply(value: bigint, multiplicand: bigint): bigint;
declare function multiply(value: number, multiplicand: number): number;
/**
 * Multiplies two numbers.
 *
 * @param multiplicand - The number to multiply the value by.
 * @signature
 *    R.multiply(multiplicand)(value);
 * @example
 *    R.multiply(4)(3) // => 12
 *    R.map([1, 2, 3, 4], R.multiply(2)) // => [2, 4, 6, 8]
 * @dataLast
 * @category Number
 */
declare function multiply(multiplicand: bigint): (value: bigint) => bigint;
declare function multiply(multiplicand: number): (value: number) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/nthBy.d.ts
/**
 * Retrieves the element that would be at the given index if the array were sorted according to specified rules. This function uses the *QuickSelect* algorithm running at an average complexity of *O(n)*. Semantically it is equivalent to `sortBy(data, ...rules).at(index)` which would run at *O(nlogn)*.
 *
 * See also `firstBy` which provides an even more efficient algorithm and a stricter return type, but only for `index === 0`. See `takeFirstBy` to get all the elements up to and including `index`.
 *
 * @param data - The input array.
 * @param index - The zero-based index for selecting the element in the sorted order. Negative indices count backwards from the end.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns The element at the specified index in the sorted order, or `undefined` if the index is out of bounds.
 * @signature
 *   R.nthBy(data, index, ...rules);
 * @example
 *   R.nthBy([2,1,4,5,3,], 2, identity()); // => 3
 * @dataFirst
 * @category Array
 */
declare function nthBy<T extends IterableContainer>(data: T, index: number, ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>): T[number] | undefined;
/**
 * Retrieves the element that would be at the given index if the array were sorted according to specified rules. This function uses the *QuickSelect* algorithm running at an average complexity of *O(n)*. Semantically it is equivalent to `sortBy(data, ...rules)[index]` which would run at *O(nlogn)*.
 *
 * See also `firstBy` which provides an even more efficient algorithm and a stricter return type, but only for `index === 0`. See `takeFirstBy` to get all the elements up to and including `index`.
 *
 * @param index - The zero-based index for selecting the element in the sorted order. Negative indices count backwards from the end.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns The element at the specified index in the sorted order, or `undefined` if the index is out of bounds.
 * @signature
 *   R.nthBy(index, ...rules)(data);
 * @example
 *   R.pipe([2,1,4,5,3,], R.nthBy(2, identity())); // => 3
 * @dataLast
 * @category Array
 */
declare function nthBy<T extends IterableContainer>(index: number, ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>): (data: T) => T[number] | undefined;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/objOf.d.ts
/**
 * Creates an object containing a single `key:value` pair.
 *
 * @param value - The object value.
 * @param key - The property name.
 * @signature
 *    R.objOf(value, key)
 * @example
 *    R.objOf(10, 'a') // => { a: 10 }
 * @category Object
 */
declare function objOf<T, K extends string>(value: T, key: K): Record<K, T>;
/**
 * Creates an object containing a single `key:value` pair.
 *
 * @param key - The property name.
 * @signature
 *    R.objOf(key)(value)
 * @example
 *    R.pipe(10, R.objOf('a')) // => { a: 10 }
 * @category Object
 */
declare function objOf<T, K extends string>(key: K): (value: T) => Record<K, T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/omit.d.ts
/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * @param propNames - The property names.
 * @signature
 *    R.omit(names)(obj);
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.omit(['a', 'd'])) // => { b: 2, c: 3 }
 * @dataLast
 * @category Object
 */
declare function omit<T extends object, K extends keyof T>(propNames: ReadonlyArray<K>): (data: T) => Omit<T, K>;
/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * @param data - The object.
 * @param propNames - The property names.
 * @signature
 *    R.omit(obj, names);
 * @example
 *    R.omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { b: 2, c: 3 }
 * @dataFirst
 * @category Object
 */
declare function omit<T extends object, K extends keyof T>(data: T, propNames: ReadonlyArray<K>): Omit<T, K>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/omitBy.d.ts
type PickSymbolKeys<T extends object> = { -readonly [P in keyof T as P extends symbol ? P : never]: T[P] };
type PartialEnumerableKeys<T extends object> = T extends unknown ? Simplify<If<IsBoundedRecord<T>, PickSymbolKeys<T> & { -readonly [P in keyof T as P extends symbol ? never : P]?: Required<T>[P] }, Record<EnumerableStringKeyOf<T>, EnumerableStringKeyedValueOf<T>>>> : never;
type PartialEnumerableKeysNarrowed<T extends object, S> = Simplify<ExactProps$1<T, S> & PartialProps$1<T, S> & PickSymbolKeys<T>>;
type ExactProps$1<T, S> = { -readonly [P in keyof T as IsExactProp$1<T, P, S> extends true ? P : never]: Exclude<T[P], S> };
type PartialProps$1<T, S> = { -readonly [P in keyof T as IsPartialProp$1<T, P, S> extends true ? P : never]?: Exclude<T[P], S> };
type IsExactProp$1<T, P extends keyof T, S> = P extends symbol ? false : T[P] extends Exclude<T[P], S> ? S extends T[P] ? false : true : false;
type IsPartialProp$1<T, P extends keyof T, S> = P extends symbol ? false : IsExactProp$1<T, P, S> extends true ? false : IfNever<Exclude<Required<T>[P], S>, false, true>;
/**
 * Creates a shallow copy of the data, and then removes any keys that the
 * predicate rejects. Symbol keys are not passed to the predicate and would be
 * passed through to the output as-is.
 *
 * See `pickBy` for a complementary function which starts with an empty object
 * and adds the entries that the predicate accepts. Because it is additive,
 * symbol keys will not be passed through to the output object.
 *
 * @param data - The target object.
 * @param predicate - A function that takes the value, key, and the data itself
 * and returns `true` if the entry shouldn't be part of the output object, or
 * `false` to keep it. If the function is a type-guard on the value the output
 * type would be narrowed accordingly.
 * @returns A shallow copy of the input object with the rejected entries
 * removed.
 * @signature R.omitBy(data, predicate)
 * @example
 *    R.omitBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {a: 1, b: 2}
 * @dataFirst
 * @category Object
 */
declare function omitBy<T extends object, S extends EnumerableStringKeyedValueOf<T>>(data: T, predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => value is S): PartialEnumerableKeysNarrowed<T, S>;
declare function omitBy<T extends object>(data: T, predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => boolean): PartialEnumerableKeys<T>;
/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 *
 * @param predicate - The predicate.
 * @signature R.omitBy(fn)(object)
 * @example
 *    R.omitBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {a: 1, b: 2}
 * @dataLast
 * @category Object
 */
declare function omitBy<T extends object, S extends EnumerableStringKeyedValueOf<T>>(predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => value is S): (data: T) => PartialEnumerableKeysNarrowed<T, S>;
declare function omitBy<T extends object>(predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => boolean): (data: T) => PartialEnumerableKeys<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/once.d.ts
/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls to the function return the value of the first invocation.
 *
 * @param fn - The function to wrap.
 * @signature R.once(fn)
 * @example
 * const initialize = R.once(createApplication);
 * initialize();
 * initialize();
 * // => `createApplication` is invoked once
 * @category Function
 */
declare function once<T>(fn: () => T): () => T;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/only.d.ts
type Only<T extends IterableContainer> = T extends readonly [...Array<unknown>, unknown, unknown] | readonly [] | readonly [unknown, ...Array<unknown>, unknown] | readonly [unknown, unknown, ...Array<unknown>] ? undefined : T extends readonly [unknown] ? T[number] : T[number] | undefined;
/**
 * Returns the first and only element of `array`, or undefined otherwise.
 *
 * @param array - The target array.
 * @signature
 *    R.only(array)
 * @example
 *    R.only([]) // => undefined
 *    R.only([1]) // => 1
 *    R.only([1, 2]) // => undefined
 * @dataFirst
 * @category Array
 */
declare function only<T extends IterableContainer>(array: Readonly<T>): Only<T>;
/**
 * Returns the first and only element of `array`, or undefined otherwise.
 *
 * @signature
 *    R.only()(array)
 * @example
 *    R.pipe([], R.only()); // => undefined
 *    R.pipe([1], R.only()); // => 1
 *    R.pipe([1, 2], R.only()); // => undefined
 * @dataLast
 * @category Array
 */
declare function only<T extends IterableContainer>(): (array: Readonly<T>) => Only<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/TupleSplits-1vDFhyOe.d.ts
/**
 * The union of all possible ways to write a tuple as [...left, ...right].
 */
type TupleSplits<T extends IterableContainer> = T extends unknown ?
// The complete set of all splits is the union of splitting each part of
SplitPrefix<T> | SplitOptional<T> | SplitRest<T> | SplitSuffix<T> : never;
type SplitPrefix<T extends IterableContainer> = FixedTupleSplits<TupleParts<T>["required"]> extends infer Req ? Req extends {
  left: infer Left;
  right: infer Right extends Array<unknown>;
} ? {
  left: Left;
  right: [...Right, ...PartialArray<TupleParts<T>["optional"]>, ...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]];
} : RemedaTypeError<"SplitPrefix", "Unexpected result shape from FixedTupleSplits", {
  type: never;
  metadata: [Req, T];
}> : never;
type SplitOptional<T extends IterableContainer> = FixedTupleSplits<TupleParts<T>["optional"]> extends infer Optional ? Optional extends {
  left: infer Left extends Array<unknown>;
  right: infer Right extends Array<unknown>;
} ? {
  left: [...TupleParts<T>["required"], ...PartialArray<Left>];
  right: [...PartialArray<Right>, ...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]];
} : RemedaTypeError<"SplitOptional", "Unexpected result shape from FixedTupleSplits", {
  type: never;
  metadata: [Optional, T];
}> : never;
type SplitRest<T extends IterableContainer> = {
  left: [...TupleParts<T>["required"], ...PartialArray<TupleParts<T>["optional"]>, ...CoercedArray<TupleParts<T>["item"]>];
  right: [...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]];
};
type SplitSuffix<T extends IterableContainer> = FixedTupleSplits<TupleParts<T>["suffix"]> extends infer Suffix ? Suffix extends {
  left: infer Left extends Array<unknown>;
  right: infer Right;
} ? {
  left: [...TupleParts<T>["required"], ...PartialArray<TupleParts<T>["optional"]>, ...CoercedArray<TupleParts<T>["item"]>, ...Left];
  right: Right;
} : RemedaTypeError<"SplitSuffix", "Unexpected result shape from FixedTupleSplits", {
  type: never;
  metadata: [Suffix, T];
}> : never;
type FixedTupleSplits<L, R extends Array<unknown> = []> = {
  left: L;
  right: R;
} | (L extends readonly [...infer Head, infer Tail] ? FixedTupleSplits<Head, [Tail, ...R]> : never);
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/partialBind.d.ts
type PartialBindError<Message extends string, Metadata = never> = RemedaTypeError<"partialBind", Message, {
  metadata: Metadata;
}>;
type TuplePrefix<T extends IterableContainer> = TupleSplits<T>["left"];
type RemovePrefix<T extends IterableContainer, Prefix extends TuplePrefix<T>> = Prefix extends readonly [] ? T : T extends readonly [infer THead, ...infer TRest] ? Prefix extends readonly [infer _PrefixHead, ...infer PrefixRest] ? RemovePrefix<TRest, PrefixRest> : [THead?, ...RemovePrefix<TRest, Prefix>] : T extends readonly [(infer _THead)?, ...infer TRest] ? Prefix extends readonly [infer _PrefixHead, ...infer PrefixRest] ? RemovePrefix<TRest, PrefixRest> : TRest : PartialBindError<"Function parameter list has unexpected shape", T>;
/**
 * Creates a function that calls `func` with `partial` put before the arguments
 * it receives.
 *
 * Can be thought of as "freezing" some portion of a function's arguments,
 * resulting in a new function with a simplified signature.
 *
 * @param func - The function to wrap.
 * @param partial - The arguments to put before.
 * @returns A partially bound function.
 * @signature
 *    R.partialBind(func, ...partial);
 * @example
 *    const fn = (x: number, y: number, z: number) => x * 100 + y * 10 + z;
 *    const partialFn = R.partialBind(fn, 1, 2);
 *    partialFn(3); //=> 123
 *
 *    const logWithPrefix = R.partialBind(console.log, "[prefix]");
 *    logWithPrefix("hello"); //=> "[prefix] hello"
 * @dataFirst
 * @category Function
 * @see partialLastBind
 */
declare function partialBind<F extends (...args: any) => any, PrefixArgs extends TuplePrefix<Parameters<F>>, RemovedPrefix extends RemovePrefix<Parameters<F>, PrefixArgs>>(func: F, ...partial: PrefixArgs): (...rest: RemovedPrefix extends IterableContainer ? RemovedPrefix : never) => ReturnType<F>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/partialLastBind.d.ts
type PartialLastBindError<Message extends string, Metadata = never> = RemedaTypeError<"partialLastBind", Message, {
  metadata: Metadata;
}>;
type TupleSuffix<T extends IterableContainer> = TupleSplits<T>["right"];
type RemoveSuffix<T extends IterableContainer, Suffix extends TupleSuffix<T>> = Suffix extends readonly [] ? T : T extends readonly [...infer TRest, infer TLast] ? Suffix extends readonly [...infer SuffixRest, infer _SuffixLast] ? RemoveSuffix<TRest, SuffixRest> : [...RemoveSuffix<TRest, Suffix>, TLast?] : T extends readonly [...infer TRest, (infer _TLast)?] ? Suffix extends readonly [...infer SuffixRest, infer _SuffixLast] ? RemoveSuffix<TRest, SuffixRest> : TRest : PartialLastBindError<"Function parameter list has unexpected shape", T>;
/**
 * Creates a function that calls `func` with `partial` put after the arguments
 * it receives. Note that this doesn't support functions with both optional
 * and rest parameters.
 *
 * Can be thought of as "freezing" some portion of a function's arguments,
 * resulting in a new function with a simplified signature.
 *
 * Useful for converting a data-first function to a data-last one.
 *
 * @param func - The function to wrap.
 * @param partial - The arguments to put after.
 * @returns A partially bound function.
 * @signature
 *    R.partialLastBind(func, ...partial);
 * @example
 *    const fn = (x: number, y: number, z: number) => x * 100 + y * 10 + z;
 *    const partialFn = R.partialLastBind(fn, 2, 3);
 *    partialFn(1); //=> 123
 *
 *    const parseBinary = R.partialLastBind(parseInt, "2");
 *    parseBinary("101"); //=> 5
 *
 *    R.pipe(
 *      { a: 1 },
 *      // instead of (arg) => JSON.stringify(arg, null, 2)
 *      R.partialLastBind(JSON.stringify, null, 2),
 *    ); //=> '{\n  "a": 1\n}'
 * @dataFirst
 * @category Function
 * @see partialBind
 */
declare function partialLastBind<F extends (...args: any) => any, SuffixArgs extends TupleSuffix<Parameters<F>>, RemovedSuffix extends RemoveSuffix<Parameters<F>, SuffixArgs>>(func: F, ...partial: SuffixArgs): (...rest: RemovedSuffix extends IterableContainer ? RemovedSuffix : never) => ReturnType<F>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/partition.d.ts
/**
 * Splits a collection into two groups, the first of which contains elements the
 * `predicate` type guard passes, and the second one containing the rest.
 *
 * @param data - The items to split.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to add the element to the first partition, and and
 * `false` to add the element to the other partition. A type-predicate can also
 * be used to narrow the result.
 * @returns A 2-tuple of arrays where the first array contains the elements that
 * passed the predicate, and the second array contains the elements that did
 * not. The items are in the same order as they were in the original array.
 * @signature
 *    R.partition(data, predicate)
 * @example
 *    R.partition(
 *      ['one', 'two', 'forty two'],
 *      x => x.length === 3,
 *    ); // => [['one', 'two'], ['forty two']]
 * @dataFirst
 * @category Array
 */
declare function partition<T, S extends T>(data: ReadonlyArray<T>, predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S): [Array<S>, Array<Exclude<T, S>>];
declare function partition<T>(data: ReadonlyArray<T>, predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): [Array<T>, Array<T>];
/**
 * Splits a collection into two groups, the first of which contains elements the
 * `predicate` type guard passes, and the second one containing the rest.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to add the element to the first partition, and and
 * `false` to add the element to the other partition. A type-predicate can also
 * be used to narrow the result.
 * @returns A 2-tuple of arrays where the first array contains the elements that
 * passed the predicate, and the second array contains the elements that did
 * not. The items are in the same order as they were in the original array.
 * @signature
 *    R.partition(predicate)(data)
 * @example
 *    R.pipe(
 *      ['one', 'two', 'forty two'],
 *      R.partition(x => x.length === 3),
 *    ); // => [['one', 'two'], ['forty two']]
 * @dataLast
 * @category Array
 */
declare function partition<T, S extends T>(predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S): (data: ReadonlyArray<T>) => [Array<S>, Array<Exclude<T, S>>];
declare function partition<T>(predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): (data: ReadonlyArray<T>) => [Array<T>, Array<T>];
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/pathOr.d.ts
/**
 * Given a union of indexable types `T`, we derive an indexable type
 * containing all of the keys of each variant of `T`. If a key is
 * present in multiple variants of `T`, then the corresponding type in
 * `Pathable<T>` will be the intersection of all types for that key.
 *
 * @example
 *    type T1 = Pathable<{a: number} | {a: string; b: boolean}>
 *    // {a: number | string; b: boolean}
 *
 *    type T2 = Pathable<{a?: {b: string}}
 *    // {a: {b: string} | undefined}
 *
 *    type T3 = Pathable<{a: string} | number>
 *    // {a: string}
 *
 *    type T4 = Pathable<{a: number} | {a: string} | {b: boolean}>
 *    // {a: number | string; b: boolean}
 *
 * This type lets us answer the questions:
 * - Given some object of type `T`, what keys might this object have?
 * - If this object did happen to have a particular key, what values
 *   might that key have?
 */
type Pathable<T> = { [K in AllKeys<T>]: TypesForKey<T, K> };
type AllKeys<T> = T extends infer I ? keyof I : never;
type TypesForKey<T, K extends PropertyKey> = T extends infer I ? K extends keyof I ? I[K] : never : never;
type StrictlyRequired<T> = { [K in keyof T]-?: NonNullable<T[K]> };
/**
 * Given some `A` which is a key of at least one variant of `T`, derive
 * `T[A]` for the cases where `A` is present in `T`, and `T[A]` is not
 * null or undefined.
 */
type PathValue1<T, A extends keyof Pathable<T>> = StrictlyRequired<Pathable<T>>[A];
/** All possible options after successfully reaching `T[A]`. */
type Pathable1<T, A extends keyof Pathable<T>> = Pathable<PathValue1<T, A>>;
/** As `PathValue1`, but for `T[A][B]`. */
type PathValue2<T, A extends keyof Pathable<T>, B extends keyof Pathable1<T, A>> = StrictlyRequired<Pathable1<T, A>>[B];
/** As `Pathable1`, but for `T[A][B]`. */
type Pathable2<T, A extends keyof Pathable<T>, B extends keyof Pathable1<T, A>> = Pathable<PathValue2<T, A, B>>;
/** As `PathValue1`, but for `T[A][B][C]`. */
type PathValue3<T, A extends keyof Pathable<T>, B extends keyof Pathable1<T, A>, C extends keyof Pathable2<T, A, B>> = StrictlyRequired<Pathable2<T, A, B>>[C];
/**
 * Gets the value at `path` of `object`. If the resolved value is `null` or `undefined`, the `defaultValue` is returned in its place.
 *
 * @param object - The target object.
 * @param path - The path of the property to get.
 * @param defaultValue - The default value.
 * @signature R.pathOr(object, array, defaultValue)
 * @example
 *    R.pathOr({x: 10}, ['y'], 2) // 2
 *    R.pathOr({y: 10}, ['y'], 2) // 10
 * @dataFirst
 * @category Object
 */
declare function pathOr<T, A extends keyof Pathable<T>>(object: T, path: readonly [A], defaultValue: PathValue1<T, A>): PathValue1<T, A>;
declare function pathOr<T, A extends keyof Pathable<T>, B extends keyof Pathable1<T, A>>(object: T, path: readonly [A, B], defaultValue: PathValue2<T, A, B>): PathValue2<T, A, B>;
declare function pathOr<T, A extends keyof Pathable<T>, B extends keyof Pathable1<T, A>, C extends keyof Pathable2<T, A, B>>(object: T, path: readonly [A, B, C], defaultValue: PathValue3<T, A, B, C>): PathValue3<T, A, B, C>;
/**
 * Gets the value at `path` of `object`. If the resolved value is `undefined`, the `defaultValue` is returned in its place.
 *
 * @param path - The path of the property to get.
 * @param defaultValue - The default value.
 * @signature R.pathOr(array, defaultValue)(object)
 * @example
 *    R.pipe({x: 10}, R.pathOr(['y'], 2)) // 2
 *    R.pipe({y: 10}, R.pathOr(['y'], 2)) // 10
 * @dataLast
 * @category Object
 */
declare function pathOr<T, A extends keyof Pathable<T>>(path: readonly [A], defaultValue: PathValue1<T, A>): (object: T) => PathValue1<T, A>;
declare function pathOr<T, A extends keyof Pathable<T>, B extends keyof Pathable1<T, A>>(path: readonly [A, B], defaultValue: PathValue2<T, A, B>): (object: T) => PathValue2<T, A, B>;
declare function pathOr<T, A extends keyof Pathable<T>, B extends keyof Pathable1<T, A>, C extends keyof Pathable2<T, A, B>>(path: readonly [A, B, C], defaultValue: PathValue3<T, A, B, C>): (object: T) => PathValue3<T, A, B, C>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/pick.d.ts
type PickFromArray<T, Keys extends ReadonlyArray<KeysOfUnion<T>>> = T extends unknown ? Keys extends unknown ? If<IsNever<Extract<Keys[number], keyof T>>, EmptyObject, Writable<If<IsBoundedRecord<T>, PickBoundedFromArray<T, Keys>, PickUnbounded<T, Extract<Keys[number], keyof T>>>>> : never : never;
/**
 * Bounded records have bounded keys and result in a bounded output. The only
 * question left is whether to add the prop as-is, or make it optional. This
 * can be determined by the part of the keys array the prop is defined in, and
 * the way that element is defined: if the array contains a singular literal
 * key in either the required prefix or the suffix, we know that prop should be
 * picked as-is, otherwise, the key might not be present in the keys array so it
 * can only be picked optionally.
 */
type PickBoundedFromArray<T, Keys extends ReadonlyArray<KeysOfUnion<T>>> = Pick<T, Extract<ItemsByUnion<TupleParts<Keys>["required"]>["singular"] | ItemsByUnion<TupleParts<Keys>["suffix"]>["singular"], keyof T>> & Partial<Pick<T, Extract<ItemsByUnion<TupleParts<Keys>["required"]>["union"] | TupleParts<Keys>["optional"][number] | TupleParts<Keys>["item"] | ItemsByUnion<TupleParts<Keys>["suffix"]>["union"], keyof T>>>;
/**
 * We split the fixed tuple item types into **singular** props (e.g., `"a"`),
 * and unions of several props (e.g., `"a" | "b"`).
 *
 * We assume that T is a fixed tuple (no optional or rest elements), and that
 * all elements in it are bounded (as defined by `IsBounded`).
 */
type ItemsByUnion<T, Singular = never, Union = never> = T extends readonly [infer Head, ...infer Rest] ? If<IsUnion<Head>, ItemsByUnion<Rest, Singular, Union | Head>, ItemsByUnion<Rest, Singular | Head, Union>> : {
  singular: Singular;
  union: Union;
};
/**
 * The built-in `Pick` is weird when it comes to picking bounded keys from
 * unbounded records. It reconstructs the output object regardless of the shape
 * of the input: `Pick<Record<string, "world">, "hello">` results in the type
 * `{ hello: "world" }`, but you'd expect it to be optional because we don't
 * know if the record contains a `hello` prop or not!
 *
 * !Important: We assume T is unbounded and don't test for it!
 *
 * See: https://www.typescriptlang.org/play/?#code/PTAEE0HsFcHIBNQFMAeAHJBjALqAGqNpKAEZKigAGA3qABZIA2jkA-AFygBEA7pAE6N4XUAF9KAGlLRcAQ0ayAzgChsATwz5QAXlAAFAJaYA1gB4ASlgHxTi7PwMA7AOZTeAoVwB8bhs0jeANzKIBSgAHqsykA.
 */
type PickUnbounded<T, Keys extends keyof T> = If<IsBounded<Keys>, Partial<Pick<T, Keys>>, Pick<T, Keys>>;
/**
 * Creates an object composed of the picked `data` properties.
 *
 * @param keys - The property names.
 * @signature R.pick([prop1, prop2])(object)
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.pick(['a', 'd'])) // => { a: 1, d: 4 }
 * @dataLast
 * @category Object
 */
declare function pick<T extends object, const Keys extends ReadonlyArray<KeysOfUnion<T>>>(keys: Keys): (data: T) => PickFromArray<T, Keys>;
/**
 * Creates an object composed of the picked `data` properties.
 *
 * @param data - The target object.
 * @param keys - The property names.
 * @signature R.pick(object, [prop1, prop2])
 * @example
 *    R.pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { a: 1, d: 4 }
 * @dataFirst
 * @category Object
 */
declare function pick<T extends object, const Keys extends ReadonlyArray<KeysOfUnion<T>>>(data: T, keys: Keys): PickFromArray<T, Keys>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/pickBy.d.ts
type EnumeratedPartial<T> = T extends unknown ? Simplify<If<IsBoundedRecord<T>, { -readonly [P in keyof T as ToString<P>]?: Required<T>[P] }, Record<EnumerableStringKeyOf<T>, EnumerableStringKeyedValueOf<T>>>> : never;
type EnumeratedPartialNarrowed<T, S> = T extends unknown ? Simplify<If<IsBoundedRecord<T>, ExactProps<T, S> & PartialProps<T, S>, Record<EnumerableStringKeyOf<T>, Extract<EnumerableStringKeyedValueOf<T>, S>>>> : never;
type ExactProps<T, S> = { -readonly [P in keyof T as ToString<IsExactProp<T, P, S> extends true ? P : never>]: Extract<Required<T>[P], S> };
type PartialProps<T, S> = { -readonly [P in keyof T as ToString<IsPartialProp<T, P, S> extends true ? P : never>]?: IfNever<Extract<T[P], S>, S extends T[P] ? S : never, Extract<T[P], S>> };
type IsExactProp<T, P extends keyof T, S> = T[P] extends Extract<T[P], S> ? true : false;
type IsPartialProp<T, P extends keyof T, S> = IsExactProp<T, P, S> extends true ? false : IfNever<Extract<T[P], S>, S extends T[P] ? true : false, true>;
/**
 * Iterates over the entries of `data` and reconstructs the object using only
 * entries that `predicate` accepts. Symbol keys are not passed to the predicate
 * and would be filtered out from the output object.
 *
 * See `omitBy` for a complementary function which starts with a shallow copy of
 * the input object and removes the entries that the predicate rejects. Because
 * it is subtractive symbol keys would be copied over to the output object.
 * See also `entries`, `filter`, and `fromEntries` which could be used to build
 * your own version of `pickBy` if you need more control (though the resulting
 * type might be less precise).
 *
 * @param data - The target object.
 * @param predicate - A function that takes the value, key, and the data itself
 * and returns true if the entry should be part of the output object, or `false`
 * to remove it. If the function is a type-guard on the value the output type
 * would be narrowed accordingly.
 * @returns A shallow copy of the input object with the rejected entries
 * removed.
 * @signature R.pickBy(data, predicate)
 * @example
 *    R.pickBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {A: 3, B: 4}
 * @dataFirst
 * @category Object
 */
declare function pickBy<T extends object, S extends EnumerableStringKeyedValueOf<T>>(data: T, predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => value is S): EnumeratedPartialNarrowed<T, S>;
declare function pickBy<T extends object>(data: T, predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => boolean): EnumeratedPartial<T>;
/**
 * Iterates over the entries of `data` and reconstructs the object using only
 * entries that `predicate` accepts. Symbol keys are not passed to the predicate
 * and would be filtered out from the output object.
 *
 * See `omitBy` for a complementary function which starts with a shallow copy of
 * the input object and removes the entries that the predicate rejects. Because
 * it is subtractive symbol keys would be copied over to the output object.
 * See also `entries`, `filter`, and `fromEntries` which could be used to build
 * your own version of `pickBy` if you need more control (though the resulting
 * type might be less precise).
 *
 * @param predicate - A function that takes the value, key, and the data itself
 * and returns true if the entry should be part of the output object, or `false`
 * to remove it. If the function is a type-guard on the value the output type
 * would be narrowed accordingly.
 * @signature
 *   R.pickBy(predicate)(data)
 * @example
 *    R.pipe({a: 1, b: 2, A: 3, B: 4}, pickBy((val, key) => key.toUpperCase() === key)); // => {A: 3, B: 4}
 * @dataLast
 * @category Object
 */
declare function pickBy<T extends object, S extends EnumerableStringKeyedValueOf<T>>(predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => value is S): (data: T) => EnumeratedPartialNarrowed<T, S>;
declare function pickBy<T extends object>(predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => boolean): (data: T) => EnumeratedPartial<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/pipe.d.ts
/**
 * Perform left-to-right function composition.
 *
 * @param value - The initial value.
 * @param operations - The list of operations to apply.
 * @signature R.pipe(data, op1, op2, op3)
 * @example
 *    R.pipe(
 *      [1, 2, 3, 4],
 *      R.map(x => x * 2),
 *      arr => [arr[0] + arr[1], arr[2] + arr[3]],
 *    ) // => [6, 14]
 * @dataFirst
 * @category Function
 */
declare function pipe<A>(value: A): A;
declare function pipe<A, B>(value: A, op1: (input: A) => B): B;
declare function pipe<A, B, C>(value: A, op1: (input: A) => B, op2: (input: B) => C): C;
declare function pipe<A, B, C, D>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D): D;
declare function pipe<A, B, C, D, E>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E): E;
declare function pipe<A, B, C, D, E, F>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E, op5: (input: E) => F): F;
declare function pipe<A, B, C, D, E, F, G>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E, op5: (input: E) => F, op6: (input: F) => G): G;
declare function pipe<A, B, C, D, E, F, G, H>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E, op5: (input: E) => F, op6: (input: F) => G, op7: (input: G) => H): H;
declare function pipe<A, B, C, D, E, F, G, H, I>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E, op5: (input: E) => F, op6: (input: F) => G, op7: (input: G) => H, op8: (input: H) => I): I;
declare function pipe<A, B, C, D, E, F, G, H, I, J>(value: A, op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E, op5: (input: E) => F, op6: (input: F) => G, op7: (input: G) => H, op8: (input: H) => I, op9: (input: I) => J): J;
declare function pipe<A, B, C, D, E, F, G, H, I, J, K>(value: A, op01: (input: A) => B, op02: (input: B) => C, op03: (input: C) => D, op04: (input: D) => E, op05: (input: E) => F, op06: (input: F) => G, op07: (input: G) => H, op08: (input: H) => I, op09: (input: I) => J, op10: (input: J) => K): K;
declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(value: A, op01: (input: A) => B, op02: (input: B) => C, op03: (input: C) => D, op04: (input: D) => E, op05: (input: E) => F, op06: (input: F) => G, op07: (input: G) => H, op08: (input: H) => I, op09: (input: I) => J, op10: (input: J) => K, op11: (input: K) => L): L;
declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(value: A, op01: (input: A) => B, op02: (input: B) => C, op03: (input: C) => D, op04: (input: D) => E, op05: (input: E) => F, op06: (input: F) => G, op07: (input: G) => H, op08: (input: H) => I, op09: (input: I) => J, op10: (input: J) => K, op11: (input: K) => L, op12: (input: L) => M): M;
declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(value: A, op01: (input: A) => B, op02: (input: B) => C, op03: (input: C) => D, op04: (input: D) => E, op05: (input: E) => F, op06: (input: F) => G, op07: (input: G) => H, op08: (input: H) => I, op09: (input: I) => J, op10: (input: J) => K, op11: (input: K) => L, op12: (input: L) => M, op13: (input: M) => N): N;
declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(value: A, op01: (input: A) => B, op02: (input: B) => C, op03: (input: C) => D, op04: (input: D) => E, op05: (input: E) => F, op06: (input: F) => G, op07: (input: G) => H, op08: (input: H) => I, op09: (input: I) => J, op10: (input: J) => K, op11: (input: K) => L, op12: (input: L) => M, op13: (input: M) => N, op14: (input: N) => O): O;
declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(value: A, op01: (input: A) => B, op02: (input: B) => C, op03: (input: C) => D, op04: (input: D) => E, op05: (input: E) => F, op06: (input: F) => G, op07: (input: G) => H, op08: (input: H) => I, op09: (input: I) => J, op10: (input: J) => K, op11: (input: K) => L, op12: (input: L) => M, op13: (input: M) => N, op14: (input: N) => O, op15: (input: O) => P): P;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/piped.d.ts
/**
 * A dataLast version of `pipe` that could be used to provide more complex
 * computations to functions that accept a function as a param (like `map`,
 * `filter`, `groupBy`, etc.).
 *
 * The first function must be always annotated. Other functions are
 * automatically inferred.
 *
 * @signature
 *    R.piped(...ops)(data);
 * @example
 *    R.filter(
 *      [{ a: 1 }, { a: 2 }, { a: 3 }],
 *      R.piped(
 *        R.prop('a'),
 *        (x) => x % 2 === 0,
 *      ),
 *    ); // => [{ a: 2 }]
 * @category Function
 */
declare function piped<A, B>(op1: (input: A) => B): (value: A) => B;
declare function piped<A, B, C>(op1: (input: A) => B, op2: (input: B) => C): (value: A) => C;
declare function piped<A, B, C, D>(op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D): (value: A) => D;
declare function piped<A, B, C, D, E>(op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E): (value: A) => E;
declare function piped<A, B, C, D, E, F>(op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E, op5: (input: E) => F): (value: A) => F;
declare function piped<A, B, C, D, E, F, G>(op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E, op5: (input: E) => F, op6: (input: F) => G): (value: A) => G;
declare function piped<A, B, C, D, E, F, G, H>(op1: (input: A) => B, op2: (input: B) => C, op3: (input: C) => D, op4: (input: D) => E, op5: (input: E) => F, op6: (input: F) => G, op7: (input: G) => H): (value: A) => H;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/product.d.ts
type Product<T extends IterableContainer<bigint> | IterableContainer<number>> = T extends readonly [] ? 1 : T extends readonly [bigint, ...ReadonlyArray<unknown>] ? bigint : T[number] extends bigint ? bigint | 1 : number;
/**
 * Compute the product of the numbers in the array, or return 1 for an empty
 * array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 1 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @param data - The array of numbers.
 * @signature
 *   R.product(data);
 * @example
 *   R.product([1, 2, 3]); // => 6
 *   R.product([1n, 2n, 3n]); // => 6n
 *   R.product([]); // => 1
 * @dataFirst
 * @category Number
 */
declare function product<T extends IterableContainer<bigint> | IterableContainer<number>>(data: T): Product<T>;
/**
 * Compute the product of the numbers in the array, or return 1 for an empty
 * array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 1 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @signature
 *   R.product()(data);
 * @example
 *   R.pipe([1, 2, 3], R.product()); // => 6
 *   R.pipe([1n, 2n, 3n], R.product()); // => 6n
 *   R.pipe([], R.product()); // => 1
 * @dataLast
 * @category Number
 */
declare function product(): <T extends IterableContainer<bigint> | IterableContainer<number>>(data: T) => Product<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/prop.d.ts
/**
 * Gets the value of the given property.
 *
 * @param data - The object to extract the prop from.
 * @param key - The key of the property to extract.
 * @signature
 *   R.prop(data, key);
 * @example
 *   R.prop({ foo: 'bar' }, 'foo'); // => 'bar'
 * @dataFirst
 * @category Object
 */
declare function prop<T, K extends keyof T>(data: T, key: K): T[K];
/**
 * Gets the value of the given property.
 *
 * @param key - The key of the property to extract.
 * @signature
 *   R.prop(key)(data);
 * @example
 *    R.pipe({foo: 'bar'}, R.prop('foo')) // => 'bar'
 * @dataLast
 * @category Object
 */
declare function prop<T, K extends keyof T>(key: K): (data: T) => T[K];
declare function prop<K extends PropertyKey>(key: K): <T extends Partial<Record<K, unknown>>>(data: T) => T[K];
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/pullObject.d.ts
/**
 * Creates an object that maps the result of `valueExtractor` with a key
 * resulting from running `keyExtractor` on each item in `data`. Duplicate keys
 * are overwritten, guaranteeing that the extractor functions are run on each
 * item in `data`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
 *
 * @param data - The items used to pull/extract the keys and values from.
 * @param keyExtractor - Computes the key for item.
 * @param valueExtractor - Computes the value for the item.
 * @signature
 *   R.pullObject(data, keyExtractor, valueExtractor);
 * @example
 *   R.pullObject(
 *     [
 *       { name: "john", email: "john@remedajs.com" },
 *       { name: "jane", email: "jane@remedajs.com" }
 *     ],
 *     R.prop("name"),
 *     R.prop("email"),
 *   ); // => { john: "john@remedajs.com", jane: "jane@remedajs.com" }
 * @dataFirst
 * @category Object
 */
declare function pullObject<T extends IterableContainer, K extends PropertyKey, V>(data: T, keyExtractor: (item: T[number], index: number, data: T) => K, valueExtractor: (item: T[number], index: number, data: T) => V): BoundedPartial<Record<K, V>>;
/**
 * Creates an object that maps the result of `valueExtractor` with a key
 * resulting from running `keyExtractor` on each item in `data`. Duplicate keys
 * are overwritten, guaranteeing that the extractor functions are run on each
 * item in `data`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
 *
 * @param keyExtractor - Computes the key for item.
 * @param valueExtractor - Computes the value for the item.
 * @signature
 *   R.pullObject(keyExtractor, valueExtractor)(data);
 * @example
 *   R.pipe(
 *     [
 *       { name: "john", email: "john@remedajs.com" },
 *       { name: "jane", email: "jane@remedajs.com" }
 *     ],
 *     R.pullObject(R.prop("email"), R.prop("name")),
 *   ); // => { john: "john@remedajs.com", jane: "jane@remedajs.com" }
 * @dataLast
 * @category Object
 */
declare function pullObject<T extends IterableContainer, K extends PropertyKey, V>(keyExtractor: (item: T[number], index: number, data: T) => K, valueExtractor: (item: T[number], index: number, data: T) => V): (data: T) => BoundedPartial<Record<K, V>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/purry.d.ts
type LazyResult<T> = LazyEmpty | LazyMany<T> | LazyNext<T>;
type LazyEmpty = {
  done: boolean;
  hasNext: false;
  hasMany?: false | undefined;
  next?: undefined;
};
type LazyNext<T> = {
  done: boolean;
  hasNext: true;
  hasMany?: false | undefined;
  next: T;
};
type LazyMany<T> = {
  done: boolean;
  hasNext: true;
  hasMany: true;
  next: ReadonlyArray<T>;
};
type LazyEvaluator<T = unknown, R = T> = (item: T, index: number, data: ReadonlyArray<T>) => LazyResult<R>;

/**
 * Creates a function with `dataFirst` and `dataLast` signatures.
 *
 * `purry` is a dynamic function and it's not type safe. It should be wrapped by
 * a function that have proper typings. Refer to the example below for correct
 * usage.
 *
 * !IMPORTANT: functions that simply call `purry` and return the result (like
 * almost all functions in this library) should return `unknown` themselves if
 * an explicit return type is required. This is because we currently don't
 * provide a generic return type that is built from the input function, and
 * crafting one manually isn't worthwhile as we rely on function declaration
 * overloading to combine the types for dataFirst and dataLast invocations!
 *
 * @param fn - The function to purry.
 * @param args - The arguments.
 * @param lazy - A lazy version of the function to purry.
 * @signature R.purry(fn, args);
 * @example
 *    function _findIndex(array, fn) {
 *      for (let i = 0; i < array.length; i++) {
 *        if (fn(array[i])) {
 *          return i;
 *        }
 *      }
 *      return -1;
 *    }
 *
 *    // data-first
 *    function findIndex<T>(array: T[], fn: (item: T) => boolean): number;
 *
 *    // data-last
 *    function findIndex<T>(fn: (item: T) => boolean): (array: T[]) => number;
 *
 *    function findIndex(...args: unknown[]) {
 *      return R.purry(_findIndex, args);
 *    }
 * @category Function
 */
declare function purry(fn: (...args: any) => unknown, args: ReadonlyArray<unknown>, lazy?: (...args: any) => LazyEvaluator): unknown;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/randomBigInt.d.ts
/**
 * Generate a random `bigint` between `from` and `to` (inclusive).
 *
 * ! Important: In most environments this function uses
 * [`crypto.getRandomValues()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
 * under-the-hood which **is** cryptographically strong. When the WebCrypto API
 * isn't available (Node 18) we fallback to an implementation that uses
 * [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
 * which is **NOT** cryptographically secure.
 *
 * @param from - The minimum value.
 * @param to - The maximum value.
 * @returns The random integer.
 * @signature
 *   R.randomBigInt(from, to)
 * @example
 *   R.randomBigInt(1n, 10n) // => 5n
 * @dataFirst
 * @category Number
 */
declare function randomBigInt(from: bigint, to: bigint): bigint;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/randomInteger.d.ts
type MaxLiteral = 1000;
type RandomInteger<From extends number, To extends number> = Or<IsNever<NonNegativeInteger<From>>, IsNever<NonNegativeInteger<To>>> extends true ? number : IsEqual<From, To> extends true ? From : GreaterThan<From, To> extends true ? never : GreaterThanOrEqual<To, MaxLiteral> extends true ? number : IntRangeInclusive<From, To>;
/**
 * Generate a random integer between `from` and `to` (inclusive).
 *
 * !Important: This function uses [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) under-the-hood, which has two major limitations:
 * 1. It generates 2^52 possible values, so the bigger the range, the less
 * uniform the distribution of values would be, and at ranges larger than that
 * some values would never come up.
 * 2. It is not cryptographically secure and should not be used for security
 * scenarios.
 *
 * @param from - The minimum value.
 * @param to - The maximum value.
 * @returns The random integer.
 * @signature
 *   R.randomInteger(from, to)
 * @example
 *   R.randomInteger(1, 10) // => 5
 *   R.randomInteger(1.5, 2.6) // => 2
 * @dataFirst
 * @category Number
 */
declare function randomInteger<From extends number, To extends number>(from: From, to: To): RandomInteger<From, To>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/randomString.d.ts
/**
 * Random a non-cryptographic random string from characters a-zA-Z0-9.
 *
 * @param length - The length of the random string.
 * @returns The random string.
 * @signature
 *   R.randomString(length)
 * @example
 *   R.randomString(5) // => aB92J
 * @dataFirst
 * @category String
 */
declare function randomString(length: number): string;
/**
 * Random a non-cryptographic random string from characters a-zA-Z0-9.
 *
 * @returns The random string.
 * @signature
 *   R.randomString()(length)
 * @example
 *   R.pipe(5, R.randomString()) // => aB92J
 * @dataLast
 * @category String
 */
declare function randomString(): (length: number) => string;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/range.d.ts
/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 *
 * @param start - The start number.
 * @param end - The end number.
 * @signature range(start, end)
 * @example
 *    R.range(1, 5) // => [1, 2, 3, 4]
 * @dataFirst
 * @category Array
 */
declare function range(start: number, end: number): Array<number>;
/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 *
 * @param end - The end number.
 * @signature range(end)(start)
 * @example
 *    R.range(5)(1) // => [1, 2, 3, 4]
 * @dataLast
 * @category Array
 */
declare function range(end: number): (start: number) => Array<number>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/rankBy.d.ts
/**
 * Calculates the rank of an item in an array based on `rules`. The rank is the position where the item would appear in the sorted array. This function provides an efficient way to determine the rank in *O(n)* time, compared to *O(nlogn)* for the equivalent `sortedIndex(sortBy(data, ...rules), item)`.
 *
 * @param data - The input array.
 * @param item - The item whose rank is to be determined.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns The rank of the item in the sorted array in the range [0..data.length].
 * @signature
 *   R.rankBy(data, item, ...rules)
 * @example
 *   const DATA = [{ a: 5 }, { a: 1 }, { a: 3 }] as const;
 *   R.rankBy(DATA, 0, R.prop('a')) // => 0
 *   R.rankBy(DATA, 1, R.prop('a')) // => 1
 *   R.rankBy(DATA, 2, R.prop('a')) // => 1
 *   R.rankBy(DATA, 3, R.prop('a')) // => 2
 * @dataFirst
 * @category Array
 */
declare function rankBy<T>(data: ReadonlyArray<T>, item: T, ...rules: Readonly<NonEmptyArray<OrderRule<T>>>): number;
/**
 * Calculates the rank of an item in an array based on `rules`. The rank is the position where the item would appear in the sorted array. This function provides an efficient way to determine the rank in *O(n)* time, compared to *O(nlogn)* for the equivalent `sortedIndex(sortBy(data, ...rules), item)`.
 *
 * @param item - The item whose rank is to be determined.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns The rank of the item in the sorted array in the range [0..data.length].
 * @signature
 *   R.rankBy(item, ...rules)(data)
 * @example
 *   const DATA = [{ a: 5 }, { a: 1 }, { a: 3 }] as const;
 *   R.pipe(DATA, R.rankBy(0, R.prop('a'))) // => 0
 *   R.pipe(DATA, R.rankBy(1, R.prop('a'))) // => 1
 *   R.pipe(DATA, R.rankBy(2, R.prop('a'))) // => 1
 *   R.pipe(DATA, R.rankBy(3, R.prop('a'))) // => 2
 * @dataLast
 * @category Array
 */
declare function rankBy<T>(item: T, ...rules: Readonly<NonEmptyArray<OrderRule<T>>>): (data: ReadonlyArray<T>) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/reduce.d.ts
/**
 * Executes a user-supplied "reducer" callback function on each element of the
 * array, in order, passing in the return value from the calculation on the
 * preceding element. The final result of running the reducer across all
 * elements of the array is a single value. Equivalent to
 * `Array.prototype.reduce`.
 *
 * @param data - The items to reduce.
 * @param callbackfn - A function to execute for each element in the array. Its
 * return value becomes the value of the accumulator parameter on the next
 * invocation of callbackFn. For the last invocation, the return value becomes
 * the return value of reduce().
 * @param initialValue - A value to which accumulator is initialized the first
 * time the callback is called. CallbackFn starts executing with the first value
 * in the array as currentValue.
 * @returns The value that results from running the "reducer" callback function
 * to completion over the entire array.
 * @signature
 *    R.reduce(data, callbackfn, initialValue)
 * @example
 *    R.reduce([1, 2, 3, 4, 5], (acc, x) => acc + x, 100) // => 115
 * @dataFirst
 * @category Array
 */
declare function reduce<T, U>(data: ReadonlyArray<T>, callbackfn: (previousValue: U, currentValue: T, currentIndex: number, data: ReadonlyArray<T>) => U, initialValue: U): U;
/**
 * Executes a user-supplied "reducer" callback function on each element of the
 * array, in order, passing in the return value from the calculation on the
 * preceding element. The final result of running the reducer across all
 * elements of the array is a single value. Equivalent to
 * `Array.prototype.reduce`.
 *
 * @param callbackfn - A function to execute for each element in the array. Its
 * return value becomes the value of the accumulator parameter on the next
 * invocation of callbackFn. For the last invocation, the return value becomes
 * the return value of reduce().
 * @param initialValue - A value to which accumulator is initialized the first
 * time the callback is called. CallbackFn starts executing with the first value
 * in the array as currentValue.
 * @returns The value that results from running the "reducer" callback function
 * to completion over the entire array.
 * @signature
 *    R.reduce(fn, initialValue)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 5], R.reduce((acc, x) => acc + x, 100)) // => 115
 * @dataLast
 * @category Array
 */
declare function reduce<T, U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, data: ReadonlyArray<T>) => U, initialValue: U): (data: ReadonlyArray<T>) => U;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/reverse.d.ts
type Reverse<T extends ReadonlyArray<unknown>, R extends ReadonlyArray<unknown> = []> = ReturnType<T extends IsNoTuple<T> ? () => [...T, ...R] : T extends readonly [infer F, ...infer L] ? () => Reverse<L, [F, ...R]> : () => R>;
type IsNoTuple<T> = T extends readonly [unknown, ...Array<unknown>] ? never : T;
/**
 * Reverses array.
 *
 * @param array - The array.
 * @signature
 *    R.reverse(arr);
 * @example
 *    R.reverse([1, 2, 3]) // [3, 2, 1]
 * @dataFirst
 * @category Array
 */
declare function reverse<T extends ReadonlyArray<unknown>>(array: T): Reverse<T>;
/**
 * Reverses array.
 *
 * @signature
 *    R.reverse()(array);
 * @example
 *    R.reverse()([1, 2, 3]) // [3, 2, 1]
 * @dataLast
 * @category Array
 */
declare function reverse<T extends ReadonlyArray<unknown>>(): (array: T) => Reverse<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/round.d.ts
/**
 * Rounds a given number to a specific precision.
 * If you'd like to round to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.round` instead, as it won't incur the additional library overhead.
 *
 * @param value - The number to round.
 * @param precision - The precision to round to. Must be an integer between -15 and 15.
 * @signature
 *    R.round(value, precision);
 * @example
 *    R.round(123.9876, 3) // => 123.988
 *    R.round(483.22243, 1) // => 483.2
 *    R.round(8541, -1) // => 8540
 *    R.round(456789, -3) // => 457000
 * @dataFirst
 * @category Number
 */
declare function round(value: number, precision: number): number;
/**
 * Rounds a given number to a specific precision.
 * If you'd like to round to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.round` instead, as it won't incur the additional library overhead.
 *
 * @param precision - The precision to round to. Must be an integer between -15 and 15.
 * @signature
 *    R.round(precision)(value);
 * @example
 *    R.round(3)(123.9876) // => 123.988
 *    R.round(1)(483.22243) // => 483.2
 *    R.round(-1)(8541) // => 8540
 *    R.round(-3)(456789) // => 457000
 * @dataLast
 * @category Number
 */
declare function round(precision: number): (value: number) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/sample.d.ts
type Sampled<T extends IterableContainer, N extends number> = number extends N ? SampledGeneric<T> : undefined extends T[N] ? T : SampledLiteral<T, N>;
type SampledGeneric<T extends IterableContainer> = T[number] extends never ? T : T extends readonly [infer First, ...infer Rest] ? SampledGeneric<Rest> | [First, ...SampledGeneric<Rest>] : Array<T[number]>;
type SampledLiteral<T extends IterableContainer, N extends number, Iteration extends Array<unknown> = []> = Iteration["length"] extends N ? [] : T extends readonly [infer First, ...infer Tail] ? [First | Tail[number], ...SampledLiteral<Tail, N, [unknown, ...Iteration]>] : T extends readonly [...infer Head, infer Last] ? [...SampledLiteral<Head, N, [unknown, ...Iteration]>, Last] : SampledLiteral<T, N, [unknown, ...Iteration]> | [T[number], ...SampledLiteral<T, N, [unknown, ...Iteration]>];
/**
 * Returns a random subset of size `sampleSize` from `array`.
 *
 * Maintains and infers most of the typing information that could be passed
 * along to the output. This means that when using tuples, the output will be
 * a tuple too, and when using literals, those literals would be preserved.
 *
 * The items in the result are kept in the same order as they are in the input.
 * If you need to get a shuffled response you can pipe the shuffle function
 * after this one.
 *
 * @param data - The array.
 * @param sampleSize - The number of elements to take.
 * @signature
 *    R.sample(array, sampleSize)
 * @example
 *    R.sample(["hello", "world"], 1); // => ["hello"] // typed string[]
 *    R.sample(["hello", "world"] as const, 1); // => ["world"] // typed ["hello" | "world"]
 * @dataFirst
 * @category Array
 */
declare function sample<T extends IterableContainer, N extends number = number>(data: T, sampleSize: N): Sampled<T, N>;
/**
 * Returns a random subset of size `sampleSize` from `array`.
 *
 * Maintains and infers most of the typing information that could be passed
 * along to the output. This means that when using tuples, the output will be
 * a tuple too, and when using literals, those literals would be preserved.
 *
 * The items in the result are kept in the same order as they are in the input.
 * If you need to get a shuffled response you can pipe the shuffle function
 * after this one.
 *
 * @param sampleSize - The number of elements to take.
 * @signature
 *    R.sample(sampleSize)(array)
 * @example
 *    R.sample(1)(["hello", "world"]); // => ["hello"] // typed string[]
 *    R.sample(1)(["hello", "world"] as const); // => ["world"] // typed ["hello" | "world"]
 * @dataLast
 * @category Array
 */
declare function sample<T extends IterableContainer, N extends number = number>(sampleSize: N): (data: T) => Sampled<T, N>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/set.d.ts
/**
 * Sets the `value` at `prop` of `object`.
 *
 * To add a new property to an object, or to override its type, use `addProp`
 * instead, and to set a property within a nested object use `setPath`.
 *
 * @param obj - The target method.
 * @param prop - The property name.
 * @param value - The value to set.
 * @signature
 *    R.set(obj, prop, value)
 * @example
 *    R.set({ a: 1 }, 'a', 2) // => { a: 2 }
 * @dataFirst
 * @category Object
 */
declare function set<T, K extends keyof T, V extends Required<T>[K]>(obj: T, prop: K, value: V): UpsertProp<T, K, V>;
/**
 * Sets the `value` at `prop` of `object`.
 *
 * To add a new property to an object, or to override it's type use `addProp`
 * instead.
 *
 * @param prop - The property name.
 * @param value - The value to set.
 * @signature
 *    R.set(prop, value)(obj)
 * @example
 *    R.pipe({ a: 1 }, R.set('a', 2)) // => { a: 2 }
 * @dataLast
 * @category Object
 */
declare function set<T, K extends keyof T, V extends Required<T>[K]>(prop: K, value: V): (obj: T) => UpsertProp<T, K, V>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/setPath.d.ts
type Paths<T, Prefix extends ReadonlyArray<unknown> = []> = Prefix | (T extends object ? ValueOf<{ [K in ProperKeyOf<T>]-?: Paths<T[K], [...Prefix, K]> }> : RemedaTypeError<"setPath", "Can only compute paths objects", {
  type: never;
  metadata: T;
}>) extends infer Path ? Readonly<Path> : never;
/**
 * Array objects have all Array.prototype keys in their "keyof" type, which
 * is not what we'd expect from the operator. We only want the numeric keys
 * which represent proper elements of the array.
 */
type ProperKeyOf<T> = Extract<keyof T, T extends ReadonlyArray<unknown> ? number : keyof T>;
type ValueAtPath<T, Path> = Path extends readonly [infer Head extends keyof T, ...infer Rest] ? ValueAtPath<T[Head], Rest> : T;
/**
 * Sets the value at `path` of `object`.
 *
 * For simple cases where the path is only one level deep, prefer `set` instead.
 *
 * @param data - The target method.
 * @param path - The array of properties.
 * @param value - The value to set.
 * @signature
 *    R.setPath(obj, path, value)
 * @example
 *    R.setPath({ a: { b: 1 } }, ['a', 'b'], 2) // => { a: { b: 2 } }
 * @dataFirst
 * @category Object
 */
declare function setPath<T, Path extends Paths<T>>(data: T, path: Path, value: ValueAtPath<T, Path>): T;
/**
 * Sets the value at `path` of `object`.
 *
 * @param path - The array of properties.
 * @param value - The value to set.
 * @signature
 *    R.setPath(path, value)(obj)
 * @example
 *    R.pipe({ a: { b: 1 } }, R.setPath(['a', 'b'], 2)) // { a: { b: 2 } }
 * @dataLast
 * @category Object
 */
declare function setPath<T, Path extends Paths<T>, Value extends ValueAtPath<T, Path>>(path: Path, value: Value): (data: T) => T;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/ReorderedArray-DFPIAkRH.d.ts
type ReorderedArray<T extends IterableContainer> = { -readonly [P in keyof T]: T[number] };
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/shuffle.d.ts
/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 *
 * @param items - The array to shuffle.
 * @signature
 *    R.shuffle(array)
 * @example
 *    R.shuffle([4, 2, 7, 5]) // => [7, 5, 4, 2]
 * @dataFirst
 * @category Array
 */
declare function shuffle<T extends IterableContainer>(items: T): ReorderedArray<T>;
/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 *
 * @signature
 *    R.shuffle()(array)
 * @example
 *    R.pipe([4, 2, 7, 5], R.shuffle()) // => [7, 5, 4, 2]
 * @dataLast
 * @category Array
 */
declare function shuffle(): <T extends IterableContainer>(items: T) => ReorderedArray<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/sliceString.d.ts
/**
 * Extracts a section of this string and returns it as a new string, without
 * modifying the original string. Equivalent to `String.prototype.slice`.
 *
 * @param data - The string to extract from.
 * @param indexStart - The index of the first character to include in the
 * returned substring.
 * @param indexEnd - The index of the first character to exclude from the
 * returned substring.
 * @returns A new string containing the extracted section of the string.
 * @signature
 *    R.sliceString(data, indexStart, indexEnd)
 * @example
 *    R.sliceString("abcdefghijkl", 1) // => `bcdefghijkl`
 *    R.sliceString("abcdefghijkl", 4, 7) // => `efg`
 * @dataLast
 * @category String
 */
declare function sliceString(data: string, indexStart: number, indexEnd?: number): string;
/**
 * Extracts a section of this string and returns it as a new string, without
 * modifying the original string. Equivalent to `String.prototype.slice`.
 *
 * @param indexStart - The index of the first character to include in the
 * returned substring.
 * @param indexEnd - The index of the first character to exclude from the
 * returned substring, or `undefined` for the rest of the string.
 * @returns A new string containing the extracted section of the string.
 * @signature
 *    R.sliceString(indexStart, indexEnd)(string)
 * @example
 *    R.sliceString(1)("abcdefghijkl") // => `bcdefghijkl`
 *    R.sliceString(4, 7)("abcdefghijkl") // => `efg`
 * @dataLast
 * @category String
 */
declare function sliceString(indexStart: number, indexEnd?: number): (data: string) => string;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/sort.d.ts
/**
 * Sorts an array. The comparator function should accept two values at a time
 * and return a negative number if the first value is smaller, a positive number
 * if it's larger, and zero if they are equal. Sorting is based on a native
 * `sort` function.
 *
 * @param items - The array to sort.
 * @param cmp - The comparator function.
 * @signature
 *    R.sort(items, cmp)
 * @example
 *    R.sort([4, 2, 7, 5], (a, b) => a - b); // => [2, 4, 5, 7]
 * @dataFirst
 * @category Array
 */
declare function sort<T extends IterableContainer>(items: T, cmp: (a: T[number], b: T[number]) => number): ReorderedArray<T>;
/**
 * Sorts an array. The comparator function should accept two values at a time
 * and return a negative number if the first value is smaller, a positive number
 * if it's larger, and zero if they are equal. Sorting is based on a native
 * `sort` function.
 *
 * @param cmp - The comparator function.
 * @signature
 *    R.sort(cmp)(items)
 * @example
 *    R.pipe([4, 2, 7, 5], R.sort((a, b) => a - b)) // => [2, 4, 5, 7]
 * @dataLast
 * @category Array
 */
declare function sort<T extends IterableContainer>(cmp: (a: T[number], b: T[number]) => number): (items: T) => ReorderedArray<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/sortBy.d.ts
/**
 * Sorts `data` using the provided ordering rules. The `sort` is done via the
 * native `Array.prototype.sort` but is performed on a shallow copy of the array
 * to avoid mutating the original data.
 *
 * There are several other functions that take order rules and **bypass** the
 * need to sort the array first (in *O(nlogn)* time):
 * * `firstBy` === `first(sortBy(data, ...rules))`, O(n).
 * * `takeFirstBy` === `take(sortBy(data, ...rules), k)`, O(nlogk).
 * * `dropFirstBy` === `drop(sortBy(data, ...rules), k)`, O(nlogk).
 * * `nthBy` === `sortBy(data, ...rules).at(k)`, O(n).
 * * `rankBy` === `sortedIndex(sortBy(data, ...rules), item)`, O(n).
 * Refer to the docs for more details.
 *
 * @param sortRules - A variadic array of order rules defining the sorting
 * criteria. Each order rule is a projection function that extracts a comparable
 * value from the data. Sorting is based on these extracted values using the
 * native `<` and `>` operators. Earlier rules take precedence over later ones.
 * Use the syntax `[projection, "desc"]` for descending order.
 * @returns A shallow copy of the input array sorted by the provided rules.
 * @signature
 *    R.sortBy(...rules)(data)
 * @example
 *    R.pipe(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      R.sortBy(R.prop('a')),
 *    ); // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }]
 * @dataLast
 * @category Array
 */
declare function sortBy<T extends IterableContainer>(...sortRules: Readonly<NonEmptyArray<OrderRule<T[number]>>>): (array: T) => ReorderedArray<T>;
/**
 * Sorts `data` using the provided ordering rules. The `sort` is done via the
 * native `Array.prototype.sort` but is performed on a shallow copy of the array
 * to avoid mutating the original data.
 *
 * There are several other functions that take order rules and **bypass** the
 * need to sort the array first (in *O(nlogn)* time):
 * * `firstBy` === `first(sortBy(data, ...rules))`, O(n).
 * * `takeFirstBy` === `take(sortBy(data, ...rules), k)`, O(nlogk).
 * * `dropFirstBy` === `drop(sortBy(data, ...rules), k)`, O(nlogk).
 * * `nthBy` === `sortBy(data, ...rules).at(k)`, O(n).
 * * `rankBy` === `sortedIndex(sortBy(data, ...rules), item)`, O(n).
 * Refer to the docs for more details.
 *
 * @param array - The input array.
 * @param sortRules - A variadic array of order rules defining the sorting
 * criteria. Each order rule is a projection function that extracts a comparable
 * value from the data. Sorting is based on these extracted values using the
 * native `<` and `>` operators. Earlier rules take precedence over later ones.
 * Use the syntax `[projection, "desc"]` for descending order.
 * @returns A shallow copy of the input array sorted by the provided rules.
 * @signature
 *    R.sortBy(data, ...rules)
 * @example
 *    R.sortBy(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      prop('a'),
 *    );  // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }]
 *    R.sortBy(
 *      [
 *        {color: 'red', weight: 2},
 *        {color: 'blue', weight: 3},
 *        {color: 'green', weight: 1},
 *        {color: 'purple', weight: 1},
 *      ],
 *      [prop('weight'), 'asc'],
 *      prop('color'),
 *    ); // => [
 *    //   {color: 'green', weight: 1},
 *    //   {color: 'purple', weight: 1},
 *    //   {color: 'red', weight: 2},
 *    //   {color: 'blue', weight: 3},
 *    // ]
 * @dataFirst
 * @category Array
 */
declare function sortBy<T extends IterableContainer>(array: T, ...sortRules: Readonly<NonEmptyArray<OrderRule<T[number]>>>): ReorderedArray<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/sortedIndex.d.ts
/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order; so that `splice(sortedIndex, 0, item)` would result in
 * maintaining the array's sort-ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *first*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * @param data - The (ascending) sorted array.
 * @param item - The item to insert.
 * @returns Insertion index (In the range 0..array.length).
 * @signature
 *    R.sortedIndex(data, item)
 * @example
 *    R.sortedIndex(['a','a','b','c','c'], 'c') // => 3
 * @dataFirst
 * @category Array
 * @see sortedIndexBy, sortedIndexWith, sortedLastIndex, sortedLastIndexBy
 */
declare function sortedIndex<T>(data: ReadonlyArray<T>, item: T): number;
/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order; so that `splice(sortedIndex, 0, item)` would result in
 * maintaining the array's sort-ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *first*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * @param item - The item to insert.
 * @returns Insertion index (In the range 0..array.length).
 * @signature
 *    R.sortedIndex(item)(data)
 * @example
 *    R.pipe(['a','a','b','c','c'], R.sortedIndex('c')) // => 3
 * @dataLast
 * @category Array
 * @see sortedIndexBy, sortedIndexWith, sortedLastIndex, sortedLastIndexBy
 */
declare function sortedIndex<T>(item: T): (data: ReadonlyArray<T>) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/sortedIndexBy.d.ts
/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order using a value function; so that
 * `splice(sortedIndex, 0, item)` would result in maintaining the arrays sort-
 * ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *first*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * See also:
 * * `findIndex` - scans a possibly unsorted array in-order (linear search).
 * * `sortedIndex` - like this function, but doesn't take a callbackfn.
 * * `sortedLastIndexBy` - like this function, but finds the last suitable index.
 * * `sortedLastIndex` - like `sortedIndex`, but finds the last suitable index.
 * * `rankBy` - scans a possibly unsorted array in-order, returning the index based on a sorting criteria.
 *
 * @param data - The (ascending) sorted array.
 * @param item - The item to insert.
 * @param valueFunction - All comparisons would be performed on the result of
 * calling this function on each compared item. Preferably this function should
 * return a `number` or `string`. This function should be the same as the one
 * provided to sortBy to sort the array. The function is called exactly once on
 * each items that is compared against in the array, and once at the beginning
 * on `item`. When called on `item` the `index` argument is `undefined`.
 * @returns Insertion index (In the range 0..data.length).
 * @signature
 *    R.sortedIndexBy(data, item, valueFunction)
 * @example
 *    R.sortedIndexBy([{age:20},{age:22}],{age:21},prop('age')) // => 1
 * @dataFirst
 * @category Array
 */
declare function sortedIndexBy<T>(data: ReadonlyArray<T>, item: T, valueFunction: (item: T, index: number | undefined, data: ReadonlyArray<T>) => NonNullable<unknown>): number;
/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order using a value function; so that
 * `splice(sortedIndex, 0, item)` would result in maintaining the arrays sort-
 * ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *first*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * See also:
 * * `findIndex` - scans a possibly unsorted array in-order (linear search).
 * * `sortedIndex` - like this function, but doesn't take a callbackfn.
 * * `sortedLastIndexBy` - like this function, but finds the last suitable index.
 * * `sortedLastIndex` - like `sortedIndex`, but finds the last suitable index.
 * * `rankBy` - scans a possibly unsorted array in-order, returning the index based on a sorting criteria.
 *
 * @param item - The item to insert.
 * @param valueFunction - All comparisons would be performed on the result of
 * calling this function on each compared item. Preferably this function should
 * return a `number` or `string`. This function should be the same as the one
 * provided to sortBy to sort the array. The function is called exactly once on
 * each items that is compared against in the array, and once at the beginning
 * on `item`. When called on `item` the `index` argument is `undefined`.
 * @signature
 *    R.sortedIndexBy(data, item, valueFunction)
 * @example
 *    R.sortedIndexBy([{age:20},{age:22}],{age:21},prop('age')) // => 1
 * @dataLast
 * @category Array
 */
declare function sortedIndexBy<T>(item: T, valueFunction: (item: T, index: number | undefined, data: ReadonlyArray<T>) => NonNullable<unknown>): (data: ReadonlyArray<T>) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/sortedIndexWith.d.ts
/**
 * Performs a **binary search** for the index of the item at which the predicate
 * stops returning `true`. This function assumes that the array is "sorted" in
 * regards to the predicate, meaning that running the predicate as a mapper on
 * it would result in an array `[...true[], ...false[]]`.
 * This stricter requirement from the predicate provides us 2 benefits over
 * `findIndex` which does a similar thing:
 * 1. It would run at O(logN) time instead of O(N) time.
 * 2. It always returns a value (it would return `data.length` if the
 * predicate returns `true` for all items).
 *
 * This function is the basis for all other sortedIndex functions which search
 * for a specific item in a sorted array, and it could be used to perform
 * similar efficient searches.
 * * `sortedIndex` - scans a sorted array with a binary search, find the first suitable index.
 * * `sortedIndexBy` - like `sortedIndex`, but assumes sorting is based on a callbackfn.
 * * `sortedLastIndex` - scans a sorted array with a binary search, finding the last suitable index.
 * * `sortedLastIndexBy` - like `sortedLastIndex`, but assumes sorting is based on a callbackfn.
 *
 * See also:
 * * `findIndex` - scans a possibly unsorted array in-order (linear search).
 * * `rankBy` - scans a possibly unsorted array in-order, returning the index based on a sorting criteria.
 *
 * @param data - Array, "sorted" by `predicate`.
 * @param predicate - A predicate which also defines the array's order.
 * @returns Index (In the range 0..data.length).
 * @signature
 *    R.sortedIndexWith(data, predicate)
 * @example
 *    R.sortedIndexWith(['a','ab','abc'], (item) => item.length < 2) // => 1
 * @dataFirst
 * @category Array
 * @see findIndex, sortedIndex, sortedIndexBy, sortedLastIndex, sortedLastIndexBy
 */
declare function sortedIndexWith<T>(data: ReadonlyArray<T>, predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): number;
/**
 * Performs a **binary search** for the index of the item at which the predicate
 * stops returning `true`. This function assumes that the array is "sorted" in
 * regards to the predicate, meaning that running the predicate as a mapper on
 * it would result in an array `[...true[], ...false[]]`.
 * This stricter requirement from the predicate provides us 2 benefits over
 * `findIndex` which does a similar thing:
 * 1. It would run at O(logN) time instead of O(N) time.
 * 2. It always returns a value (it would return `data.length` if the
 * predicate returns `true` for all items).
 *
 * This function is the basis for all other sortedIndex functions which search
 * for a specific item in a sorted array, and it could be used to perform
 * similar efficient searches.
 * * `sortedIndex` - scans a sorted array with a binary search, find the first suitable index.
 * * `sortedIndexBy` - like `sortedIndex`, but assumes sorting is based on a callbackfn.
 * * `sortedLastIndex` - scans a sorted array with a binary search, finding the last suitable index.
 * * `sortedLastIndexBy` - like `sortedLastIndex`, but assumes sorting is based on a callbackfn.
 *
 * See also:
 * * `findIndex` - scans a possibly unsorted array in-order (linear search).
 * * `rankBy` - scans a possibly unsorted array in-order, returning the index based on a sorting criteria.
 *
 * @param predicate - A predicate which also defines the array's order.
 * @returns Index (In the range 0..data.length).
 * @signature
 *    R.sortedIndexWith(predicate)(data)
 * @example
 *    R.pipe(['a','ab','abc'], R.sortedIndexWith((item) => item.length < 2)) // => 1
 * @dataLast
 * @category Array
 */
declare function sortedIndexWith<T>(predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): (data: ReadonlyArray<T>) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/sortedLastIndex.d.ts
/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order; so that `splice(sortedIndex, 0, item)` would result in
 * maintaining the array's sort-ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *last*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * @param data - The (ascending) sorted array.
 * @param item - The item to insert.
 * @returns Insertion index (In the range 0..data.length).
 * @signature
 *    R.sortedLastIndex(data, item)
 * @example
 *    R.sortedLastIndex(['a','a','b','c','c'], 'c') // => 5
 * @dataFirst
 * @category Array
 * @see sortedIndex, sortedIndexBy, sortedIndexWith, sortedLastIndexBy
 */
declare function sortedLastIndex<T>(data: ReadonlyArray<T>, item: T): number;
/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order; so that `splice(sortedIndex, 0, item)` would result in
 * maintaining the array's sort-ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *last*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * @param item - The item to insert.
 * @returns Insertion index (In the range 0..data.length).
 * @signature
 *    R.sortedLastIndex(item)(data)
 * @example
 *    R.pipe(['a','a','b','c','c'], sortedLastIndex('c')) // => 5
 * @dataLast
 * @category Array
 * @see sortedIndex, sortedIndexBy, sortedIndexWith, sortedLastIndexBy
 */
declare function sortedLastIndex<T>(item: T): (data: ReadonlyArray<T>) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/sortedLastIndexBy.d.ts
/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order using a value function; so that
 * `splice(sortedIndex, 0, item)` would result in maintaining the arrays sort-
 * ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *last*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * See also:
 * * `findIndex` - scans a possibly unsorted array in-order (linear search).
 * * `sortedLastIndex` - a simplified version of this function, without a callbackfn.
 * * `sortedIndexBy` - like this function, but returns the first suitable index.
 * * `sortedIndex` - like `sortedLastIndex` but without a callbackfn.
 * * `rankBy` - scans a possibly unsorted array in-order, returning the index based on a sorting criteria.
 *
 * @param data - The (ascending) sorted array.
 * @param item - The item to insert.
 * @param valueFunction - All comparisons would be performed on the result of
 * calling this function on each compared item. Preferably this function should
 * return a `number` or `string`. This function should be the same as the one
 * provided to sortBy to sort the array. The function is called exactly once on
 * each items that is compared against in the array, and once at the beginning
 * on `item`. When called on `item` the `index` argument is `undefined`.
 * @returns Insertion index (In the range 0..data.length).
 * @signature
 *    R.sortedLastIndexBy(data, item, valueFunction)
 * @example
 *    R.sortedLastIndexBy([{age:20},{age:22}],{age:21},prop('age')) // => 1
 * @dataFirst
 * @category Array
 */
declare function sortedLastIndexBy<T>(data: ReadonlyArray<T>, item: T, valueFunction: (item: T, index: number | undefined, data: ReadonlyArray<T>) => NonNullable<unknown>): number;
/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order using a value function; so that
 * `splice(sortedIndex, 0, item)` would result in maintaining the arrays sort-
 * ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *last*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * See also:
 * * `findIndex` - scans a possibly unsorted array in-order (linear search).
 * * `sortedLastIndex` - a simplified version of this function, without a callbackfn.
 * * `sortedIndexBy` - like this function, but returns the first suitable index.
 * * `sortedIndex` - like `sortedLastIndex` but without a callbackfn.
 * * `rankBy` - scans a possibly unsorted array in-order, returning the index based on a sorting criteria.
 *
 * @param item - The item to insert.
 * @param valueFunction - All comparisons would be performed on the result of
 * calling this function on each compared item. Preferably this function should
 * return a `number` or `string`. This function should be the same as the one
 * provided to sortBy to sort the array. The function is called exactly once on
 * each items that is compared against in the array, and once at the beginning
 * on `item`. When called on `item` the `index` argument is `undefined`.
 * @returns Insertion index (In the range 0..data.length).
 * @signature
 *    R.sortedLastIndexBy(item, valueFunction)(data)
 * @example
 *    R.pipe([{age:20},{age:22}],sortedLastIndexBy({age:21},prop('age'))) // => 1
 * @dataLast
 * @category Array
 * @see sortedIndex, sortedIndexBy, sortedIndexWith, sortedLastIndex
 */
declare function sortedLastIndexBy<T>(item: T, valueFunction: (item: T, index: number | undefined, data: ReadonlyArray<T>) => NonNullable<unknown>): (data: ReadonlyArray<T>) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/splice.d.ts
/**
 * Removes elements from an array and, inserts new elements in their place.
 *
 * @param items - The array to splice.
 * @param start - The index from which to start removing elements.
 * @param deleteCount - The number of elements to remove.
 * @param replacement - The elements to insert into the array in place of the deleted elements.
 * @signature
 *    R.splice(items, start, deleteCount, replacement)
 * @example
 *    R.splice([1,2,3,4,5,6,7,8], 2, 3, []); //=> [1,2,6,7,8]
 *    R.splice([1,2,3,4,5,6,7,8], 2, 3, [9, 10]); //=> [1,2,9,10,6,7,8]
 * @dataFirst
 * @category Array
 */
declare function splice<T>(items: ReadonlyArray<T>, start: number, deleteCount: number, replacement: ReadonlyArray<T>): Array<T>;
/**
 * Removes elements from an array and, inserts new elements in their place.
 *
 * @param start - The index from which to start removing elements.
 * @param deleteCount - The number of elements to remove.
 * @param replacement - The elements to insert into the array in place of the deleted elements.
 * @signature
 *    R.splice(start, deleteCount, replacement)(items)
 * @example
 *    R.pipe([1,2,3,4,5,6,7,8], R.splice(2, 3, [])) // => [1,2,6,7,8]
 *    R.pipe([1,2,3,4,5,6,7,8], R.splice(2, 3, [9, 10])) // => [1,2,9,10,6,7,8]
 * @dataLast
 * @category Array
 */
declare function splice<T>(start: number, deleteCount: number, replacement: ReadonlyArray<T>): (items: ReadonlyArray<T>) => Array<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/split.d.ts
type BuiltInReturnType = ReturnType<typeof String.prototype.split>;
type Split$1<S extends string, Separator extends string, N extends number | undefined = undefined> = string extends S ? BuiltInReturnType : string extends Separator ? BuiltInReturnType : number extends N ? BuiltInReturnType : IsFloat<N> extends true ? BuiltInReturnType : N extends number ? ArraySlice<Split<S, Separator>, 0, NonNegative<N>> : Split<S, Separator>;
/**
 * Takes a pattern and divides this string into an ordered list of substrings by
 * searching for the pattern, puts these substrings into an array, and returns
 * the array. This function mirrors the built-in [`String.prototype.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
 * method.
 *
 * @param data - The string to split.
 * @param separator - The pattern describing where each split should occur. Can
 * be a string, or a regular expression.
 * @param limit - A non-negative integer specifying a limit on the number of
 * substrings to be included in the array. If provided, splits the string at
 * each occurrence of the specified separator, but stops when limit entries have
 * been placed in the array. Any leftover text is not included in the array at
 * all. The array may contain fewer entries than limit if the end of the string
 * is reached before the limit is reached. If limit is 0, [] is returned.
 * @returns An Array of strings, split at each point where the separator occurs
 * in the given string.
 * @signature
 *   R.split(data, separator, limit);
 * @example
 *   R.split("a,b,c", ","); //=> ["a", "b", "c"]
 *   R.split("a,b,c", ",", 2); //=> ["a", "b"]
 *   R.split("a1b2c3d", /\d/u); //=> ["a", "b", "c", "d"]
 * @dataFirst
 * @category String
 */
declare function split(data: string, separator: RegExp, limit?: number): Array<string>;
declare function split<S extends string, Separator extends string, N extends number | undefined = undefined>(data: S, separator: Separator, limit?: N): Split$1<S, Separator, N>;
/**
 * Takes a pattern and divides this string into an ordered list of substrings by
 * searching for the pattern, puts these substrings into an array, and returns
 * the array. This function mirrors the built-in [`String.prototype.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
 * method.
 *
 * @param separator - The pattern describing where each split should occur. Can
 * be a string, or a regular expression.
 * @param limit - A non-negative integer specifying a limit on the number of
 * substrings to be included in the array. If provided, splits the string at
 * each occurrence of the specified separator, but stops when limit entries have
 * been placed in the array. Any leftover text is not included in the array at
 * all. The array may contain fewer entries than limit if the end of the string
 * is reached before the limit is reached. If limit is 0, [] is returned.
 * @returns An Array of strings, split at each point where the separator occurs
 * in the given string.
 * @signature
 *   R.split(separator, limit)(data);
 * @example
 *   R.pipe("a,b,c", R.split(",")); //=> ["a", "b", "c"]
 *   R.pipe("a,b,c", R.split(",", 2)); //=> ["a", "b"]
 *   R.pipe("a1b2c3d", R.split(/\d/u)); //=> ["a", "b", "c", "d"]
 * @dataLast
 * @category String
 */
declare function split(separator: RegExp, limit?: number): (data: string) => Array<string>;
declare function split<S extends string, Separator extends string, N extends number | undefined = undefined>(separator: Separator, limit?: N): (data: S) => Split$1<S, Separator, N>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/splitAt.d.ts
/**
 * Splits a given array at a given index.
 *
 * @param array - The array to split.
 * @param index - The index to split at.
 * @signature
 *    R.splitAt(array, index)
 * @example
 *    R.splitAt([1, 2, 3], 1) // => [[1], [2, 3]]
 *    R.splitAt([1, 2, 3, 4, 5], -1) // => [[1, 2, 3, 4], [5]]
 * @dataFirst
 * @category Array
 */
declare function splitAt<T>(array: ReadonlyArray<T>, index: number): [Array<T>, Array<T>];
/**
 * Splits a given array at a given index.
 *
 * @param index - The index to split at.
 * @signature
 *    R.splitAt(index)(array)
 * @example
 *    R.splitAt(1)([1, 2, 3]) // => [[1], [2, 3]]
 *    R.splitAt(-1)([1, 2, 3, 4, 5]) // => [[1, 2, 3, 4], [5]]
 * @dataLast
 * @category Array
 */
declare function splitAt<T>(index: number): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/splitWhen.d.ts
/**
 * Splits a given array at the first index where the given predicate returns true.
 *
 * @param data - The array to split.
 * @param predicate - The predicate.
 * @signature
 *    R.splitWhen(array, fn)
 * @example
 *    R.splitWhen([1, 2, 3], x => x === 2) // => [[1], [2, 3]]
 * @dataFirst
 * @category Array
 */
declare function splitWhen<T>(data: ReadonlyArray<T>, predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean): [Array<T>, Array<T>];
/**
 * Splits a given array at an index where the given predicate returns true.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.splitWhen(fn)(array)
 * @example
 *    R.splitWhen(x => x === 2)([1, 2, 3]) // => [[1], [2, 3]]
 * @dataLast
 * @category Array
 */
declare function splitWhen<T>(predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/startsWith.d.ts
/**
 * Determines whether the string begins with the provided prefix, and refines
 * the output if possible. Uses the built-in [`String.prototype.startsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith).
 *
 * @param data - The input string.
 * @param prefix - The prefix to check for.
 * @signature
 *   R.startsWith(data, prefix);
 * @example
 *   R.startsWith("hello world", "hello"); // true
 *   R.startsWith("hello world", "world"); // false
 * @dataFirst
 * @category String
 */
declare function startsWith<T extends string, Prefix extends string>(data: T, prefix: string extends Prefix ? never : Prefix): data is T & `${Prefix}${string}`;
declare function startsWith(data: string, prefix: string): boolean;
/**
 * Determines whether the string begins with the provided prefix, and refines
 * the output if possible. Uses the built-in [`String.prototype.startsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith).
 *
 * @param prefix - The prefix to check for.
 * @signature
 *   R.startsWith(prefix)(data);
 * @example
 *   R.pipe("hello world", R.startsWith("hello")); // true
 *   R.pipe("hello world", R.startsWith("world")); // false
 * @dataLast
 * @category String
 */
declare function startsWith<Prefix extends string>(prefix: string extends Prefix ? never : Prefix): <T extends string>(data: T) => data is T & `${Prefix}${string}`;
declare function startsWith(prefix: string): (data: string) => boolean;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/stringToPath.d.ts
type StringToPath<S> = If<IsStringLiteral<S>, StringToPathImpl<S>, Array<string | number>>;
type StringToPathImpl<S> = S extends `${infer Head}['${infer Quoted}']${infer Tail}` ? [...StringToPath<Head>, Quoted, ...StringToPath<Tail>] : S extends `${infer Head}["${infer DoubleQuoted}"]${infer Tail}` ? [...StringToPath<Head>, DoubleQuoted, ...StringToPath<Tail>] : S extends `${infer Head}[${infer Unquoted}]${infer Tail}` ? [...StringToPath<Head>, ...StringToPath<Unquoted>, ...StringToPath<Tail>] : S extends `${infer Head}.${infer Tail}` ? [...StringToPath<Head>, ...StringToPath<Tail>] : "" extends S ? [] : S extends `${infer N extends number}` ? [If<IsNumericLiteral<N>, N, S>] : [S];
/**
 * A utility to allow JSONPath-like strings to be used in other utilities which
 * take an array of path segments as input (e.g. `pathOr`, `setPath`, etc...).
 * The main purpose of this utility is to act as a bridge between the runtime
 * implementation that converts the path to an array, and the type-system that
 * parses the path string **type** into an array **type**. This type allows us
 * to return fine-grained types and to enforce correctness at the type-level.
 *
 * We **discourage** using this utility for new code. This utility is for legacy
 * code that already contains path strings (which are accepted by Lodash). We
 * strongly recommend using *path arrays* instead as they provide better
 * developer experience via significantly faster type-checking, fine-grained
 * error messages, and automatic typeahead suggestions for each segment of the
 * path.
 *
 * *There are a bunch of limitations to this utility derived from the
 * limitations of the type itself, these are usually edge-cases around deeply
 * nested paths, escaping, whitespaces, and empty segments. This is true even
 * in cases where the runtime implementation can better handle them, this is
 * intentional. See the tests for this utility for more details and the
 * expected outputs*.
 *
 * @param path - A string path.
 * @signature
 *   R.stringToPath(path)
 * @example
 *   R.stringToPath('a.b[0].c') // => ['a', 'b', 0, 'c']
 * @dataFirst
 * @category Utility
 */
declare function stringToPath<const Path extends string>(path: Path): StringToPath<Path>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/subtract.d.ts
/**
 * Subtracts two numbers.
 *
 * @param value - The number.
 * @param subtrahend - The number to subtract from the value.
 * @signature
 *    R.subtract(value, subtrahend);
 * @example
 *    R.subtract(10, 5) // => 5
 *    R.subtract(10, -5) // => 15
 *    R.reduce([1, 2, 3, 4], R.subtract, 20) // => 10
 * @dataFirst
 * @category Number
 */
declare function subtract(value: bigint, subtrahend: bigint): bigint;
declare function subtract(value: number, subtrahend: number): number;
/**
 * Subtracts two numbers.
 *
 * @param subtrahend - The number to subtract from the value.
 * @signature
 *    R.subtract(subtrahend)(value);
 * @example
 *    R.subtract(5)(10) // => 5
 *    R.subtract(-5)(10) // => 15
 *    R.map([1, 2, 3, 4], R.subtract(1)) // => [0, 1, 2, 3]
 * @dataLast
 * @category Number
 */
declare function subtract(subtrahend: bigint): (value: bigint) => bigint;
declare function subtract(subtrahend: number): (value: number) => number;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/sum.d.ts
type Sum<T extends IterableContainer<bigint> | IterableContainer<number>> = T extends readonly [] ? 0 : T extends readonly [bigint, ...ReadonlyArray<unknown>] ? bigint : T[number] extends bigint ? bigint | 0 : number;
/**
 * Sums the numbers in the array, or return 0 for an empty array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @param data - The array of numbers.
 * @signature
 *   R.sum(data);
 * @example
 *   R.sum([1, 2, 3]); // => 6
 *   R.sum([1n, 2n, 3n]); // => 6n
 *   R.sum([]); // => 0
 * @dataFirst
 * @category Number
 */
declare function sum<T extends IterableContainer<bigint> | IterableContainer<number>>(data: T): Sum<T>;
/**
 * Sums the numbers in the array, or return 0 for an empty array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty`to guard against this case.
 *
 * @signature
 *   R.sum()(data);
 * @example
 *   R.pipe([1, 2, 3], R.sum()); // => 6
 *   R.pipe([1n, 2n, 3n], R.sum()); // => 6n
 *   R.pipe([], R.sum()); // => 0
 * @dataLast
 * @category Number
 */
declare function sum(): <T extends IterableContainer<bigint> | IterableContainer<number>>(data: T) => Sum<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/sumBy.d.ts
type SumBy<T extends IterableContainer, U extends bigint | number> = T extends readonly [] ? 0 : T extends readonly [unknown, ...ReadonlyArray<unknown>] ? U : U | 0;
/**
 * Returns the sum of the elements of an array using the provided mapper.
 *
 * Works for both `number` and `bigint` mappers, but not mappers that return both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the mapper; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @param callbackfn - Predicate function.
 * @signature
 *   R.sumBy(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.sumBy(x => x.a)
 *    ) // 9
 *
 *    R.pipe(
 *      [{a: 5n}, {a: 1n}, {a: 3n}],
 *      R.sumBy(x => x.a)
 *    ) // 9n
 * @dataLast
 * @category Array
 */
declare function sumBy<T extends IterableContainer>(callbackfn: (value: T[number], index: number, data: T) => number): (items: T) => SumBy<T, number>;
declare function sumBy<T extends IterableContainer>(callbackfn: (value: T[number], index: number, data: T) => bigint): (items: T) => SumBy<T, bigint>;
/**
 * Returns the sum of the elements of an array using the provided mapper.
 *
 * Works for both `number` and `bigint` mappers, but not mappers that can return both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the mapper; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @param data - The array.
 * @param callbackfn - Predicate function.
 * @signature
 *   R.sumBy(array, fn)
 * @example
 *    R.sumBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 9
 *    R.sumBy(
 *      [{a: 5n}, {a: 1n}, {a: 3n}],
 *      x => x.a
 *    ) // 9n
 * @dataFirst
 * @category Array
 */
declare function sumBy<T extends IterableContainer>(data: T, callbackfn: (value: T[number], index: number, data: T) => number): SumBy<T, number>;
declare function sumBy<T extends IterableContainer>(data: T, callbackfn: (value: T[number], index: number, data: T) => bigint): SumBy<T, bigint>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/swapIndices.d.ts
type Difference<A extends number, B extends number> = TupleOfLength<A> extends [...infer U, ...TupleOfLength<B>] ? U["length"] : never;
type isLessThan<A extends number, B extends number> = IsEqual<A, B> extends true ? false : 0 extends A ? true : 0 extends B ? false : isLessThan<Difference<A, 1>, Difference<B, 1>>;
type TupleOfLength<L extends number, T extends IterableContainer = []> = T["length"] extends L ? T : TupleOfLength<L, [...T, unknown]>;
type IsNonNegative<T extends number> = number extends T ? false : `${T}` extends `-${string}` ? false : true;
type CharactersTuple<T extends string> = string extends T ? Array<string> : T extends `${infer C}${infer R}` ? [C, ...CharactersTuple<R>] : [];
type SwapArrayInternal<T extends IterableContainer, Index1 extends number, Index2 extends number, Position extends ReadonlyArray<unknown> = [], Original extends IterableContainer = T> = T extends readonly [infer AtPosition, ...infer Rest] ? [Position["length"] extends Index1 ? Original[Index2] : Position["length"] extends Index2 ? Original[Index1] : AtPosition, ...SwapArrayInternal<Rest, Index1, Index2, [unknown, ...Position], Original>] : T;
type SwapString<T extends string, K1 extends number, K2 extends number> = Join<SwapArray<CharactersTuple<T>, K1, K2>, "">;
type SwapArray<T extends IterableContainer, K1 extends number, K2 extends number> = IsNonNegative<K1> extends false ? Array<T[number]> : IsNonNegative<K2> extends false ? Array<T[number]> : isLessThan<K1, T["length"]> extends false ? T : isLessThan<K2, T["length"]> extends false ? T : SwapArrayInternal<T, K1, K2>;
type SwappedIndices<T extends IterableContainer | string, K1 extends number, K2 extends number> = T extends string ? SwapString<T, K1, K2> : T extends IterableContainer ? SwapArray<T, K1, K2> : never;
/**
 * Swaps the positions of two elements in an array or string at the provided indices.
 *
 * Negative indices are supported and would be treated as an offset from the end of the array. The resulting type thought would be less strict than when using positive indices.
 *
 * If either index is out of bounds the result would be a shallow copy of the input, as-is.
 *
 * @param data - The item to be manipulated. This can be an array, or a string.
 * @param index1 - The first index.
 * @param index2 - The second index.
 * @returns Returns the manipulated array or string.
 * @signature
 *   swapIndices(data, index1, index2)
 * @example
 *   swapIndices(['a', 'b', 'c'], 0, 1) // => ['b', 'a', 'c']
 *   swapIndices(['a', 'b', 'c'], 1, -1) // => ['a', 'c', 'b']
 *   swapIndices('abc', 0, 1) // => 'bac'
 * @dataFirst
 * @category Array
 */
declare function swapIndices<T extends IterableContainer | string, K1 extends number, K2 extends number>(data: T, index1: K1, index2: K2): SwappedIndices<T, K1, K2>;
/**
 * Swaps the positions of two elements in an array or string at the provided indices.
 *
 * Negative indices are supported and would be treated as an offset from the end of the array. The resulting type thought would be less strict than when using positive indices.
 *
 * If either index is out of bounds the result would be a shallow copy of the input, as-is.
 *
 * @param index1 - The first index.
 * @param index2 - The second index.
 * @returns Returns the manipulated array or string.
 * @signature
 *   swapIndices(index1, index2)(data)
 * @example
 *   swapIndices(0, 1)(['a', 'b', 'c']) // => ['b', 'a', 'c']
 *   swapIndices(0, -1)('abc') // => 'cba'
 * @dataLast
 * @category Array
 */
declare function swapIndices<K1 extends number, K2 extends number>(index1: K1, index2: K2): <T extends IterableContainer | string>(data: T) => SwappedIndices<T, K1, K2>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/swapProps.d.ts
type SwappedProps<T, K1 extends keyof T, K2 extends keyof T> = { [K in keyof T]: T[K1 extends K ? K2 : K2 extends K ? K1 : K] };
/**
 * Swaps the positions of two properties in an object based on the provided keys.
 *
 * @param data - The object to be manipulated.
 * @param key1 - The first property key.
 * @param key2 - The second property key.
 * @returns Returns the manipulated object.
 * @signature
 *   swap(data, key1, key2)
 * @example
 *   swap({a: 1, b: 2, c: 3}, 'a', 'b') // => {a: 2, b: 1, c: 3}
 * @dataFirst
 * @category Object
 */
declare function swapProps<T extends object, K1 extends keyof T, K2 extends keyof T>(data: T, key1: K1, key2: K2): SwappedProps<T, K1, K2>;
/**
 * Swaps the positions of two properties in an object based on the provided keys.
 *
 * @param key1 - The first property key.
 * @param key2 - The second property key.
 * @returns Returns the manipulated object.
 * @signature
 *   swap(key1, key2)(data)
 * @example
 *   swap('a', 'b')({a: 1, b: 2, c: 3}) // => {a: 2, b: 1, c: 3}
 * @dataLast
 * @category Object
 */
declare function swapProps<T extends object, K1 extends keyof T, K2 extends keyof T>(key1: K1, key2: K2): (data: T) => SwappedProps<T, K1, K2>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/take.d.ts
/**
 * Returns the first `n` elements of `array`.
 *
 * @param array - The array.
 * @param n - The number of elements to take.
 * @signature
 *    R.take(array, n)
 * @example
 *    R.take([1, 2, 3, 4, 3, 2, 1], 3) // => [1, 2, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function take<T extends IterableContainer>(array: T, n: number): Array<T[number]>;
/**
 * Returns the first `n` elements of `array`.
 *
 * @param n - The number of elements to take.
 * @signature
 *    R.take(n)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 3, 2, 1], R.take(n)) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function take(n: number): <T extends IterableContainer>(array: T) => Array<T[number]>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/takeFirstBy.d.ts
/**
 * Take the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before taking the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to drop `n` elements) see `dropFirstBy`.
 *
 * @param data - The input array.
 * @param n - The number of items to take. If `n` is non-positive no items would be returned, if `n` is bigger then data.length a *clone* of `data` would be returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns A subset of the input array.
 * @signature
 *   R.takeFirstBy(data, n, ...rules);
 * @example
 *   R.takeFirstBy(['aa', 'aaaa', 'a', 'aaa'], 2, x => x.length); // => ['a', 'aa']
 * @dataFirst
 * @category Array
 */
declare function takeFirstBy<T>(data: ReadonlyArray<T>, n: number, ...rules: Readonly<NonEmptyArray<OrderRule<T>>>): Array<T>;
/**
 * Take the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before taking the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to drop `n` elements) see `dropFirstBy`.
 *
 * @param n - The number of items to take. If `n` is non-positive no items would be returned, if `n` is bigger then data.length a *clone* of `data` would be returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns A subset of the input array.
 * @signature
 *   R.takeFirstBy(n, ...rules)(data);
 * @example
 *   R.pipe(['aa', 'aaaa', 'a', 'aaa'], R.takeFirstBy(2, x => x.length)); // => ['a', 'aa']
 * @dataLast
 * @category Array
 */
declare function takeFirstBy<T>(n: number, ...rules: Readonly<NonEmptyArray<OrderRule<T>>>): (data: ReadonlyArray<T>) => Array<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/takeLast.d.ts
/**
 * Takes the last `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to take.
 * @signature
 *    R.takeLast(array, n)
 * @example
 *    R.takeLast([1, 2, 3, 4, 5], 2) // => [4, 5]
 * @dataFirst
 * @category Array
 */
declare function takeLast<T extends IterableContainer>(array: T, n: number): Array<T[number]>;
/**
 * Take the last `n` elements from the `array`.
 *
 * @param n - The number of elements to take.
 * @signature
 *    R.takeLast(n)(array)
 * @example
 *    R.takeLast(2)([1, 2, 3, 4, 5]) // => [4, 5]
 * @dataLast
 * @category Array
 */
declare function takeLast<T extends IterableContainer>(n: number): (array: T) => Array<T[number]>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/takeLastWhile.d.ts
/**
 * Returns elements from the end of the array until the predicate returns false.
 * The returned elements will be in the same order as in the original array.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    R.takeLastWhile(data, predicate)
 * @example
 *    R.takeLastWhile([1, 2, 10, 3, 4, 5], x => x < 10) // => [3, 4, 5]
 * @dataFirst
 * @category Array
 */
declare function takeLastWhile<T extends IterableContainer, S extends T[number]>(data: T, predicate: (item: T[number], index: number, data: T) => item is S): Array<S>;
declare function takeLastWhile<T extends IterableContainer>(data: T, predicate: (item: T[number], index: number, data: T) => boolean): Array<T[number]>;
/**
 * Returns elements from the end of the array until the predicate returns false.
 * The returned elements will be in the same order as in the original array.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.takeLastWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 10, 3, 4, 5], R.takeLastWhile(x => x < 10))  // => [3, 4, 5]
 * @dataLast
 * @category Array
 */
declare function takeLastWhile<T extends IterableContainer, S extends T[number]>(predicate: (item: T[number], index: number, data: T) => item is S): (array: T) => Array<S>;
declare function takeLastWhile<T extends IterableContainer>(predicate: (item: T[number], index: number, data: T) => boolean): (data: T) => Array<T[number]>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/takeWhile.d.ts
/**
 * Returns elements from the array until predicate returns false.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    R.takeWhile(data, predicate)
 * @example
 *    R.takeWhile([1, 2, 3, 4, 3, 2, 1], x => x !== 4) // => [1, 2, 3]
 * @dataFirst
 * @category Array
 */
declare function takeWhile<T extends IterableContainer, S extends T[number]>(data: T, predicate: (item: T[number], index: number, data: T) => item is S): Array<S>;
declare function takeWhile<T extends IterableContainer>(data: T, predicate: (item: T[number], index: number, data: T) => boolean): Array<T[number]>;
/**
 * Returns elements from the array until predicate returns false.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.takeWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 3, 4, 3, 2, 1], R.takeWhile(x => x !== 4))  // => [1, 2, 3]
 * @dataLast
 * @category Array
 */
declare function takeWhile<T extends IterableContainer, S extends T[number]>(predicate: (item: T[number], index: number, data: T) => item is S): (array: T) => Array<S>;
declare function takeWhile<T extends IterableContainer>(predicate: (item: T[number], index: number, data: T) => boolean): (array: T) => Array<T[number]>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/tap.d.ts
/**
 * Calls the given function with the given value, then returns the given value.
 * The return value of the provided function is ignored.
 *
 * This allows "tapping into" a function sequence in a pipe, to perform side
 * effects on intermediate results.
 *
 * @param value - The value to pass into the function.
 * @param fn - The function to call.
 * @signature
 *    R.tap(value, fn)
 * @example
 *    R.tap("foo", console.log) // => "foo"
 * @dataFirst
 * @category Other
 */
declare function tap<T>(value: T, fn: (value: T) => void): T;
/**
 * Calls the given function with the given value, then returns the given value.
 * The return value of the provided function is ignored.
 *
 * This allows "tapping into" a function sequence in a pipe, to perform side
 * effects on intermediate results.
 *
 * @param fn - The function to call.
 * @signature
 *    R.tap(fn)(value)
 * @example
 *    R.pipe(
 *      [-5, -1, 2, 3],
 *      R.filter(n => n > 0),
 *      R.tap(console.log), // prints [2, 3]
 *      R.map(n => n * 2)
 *    ) // => [4, 6]
 * @dataLast
 * @category Other
 */
declare function tap<T, F extends (value: T) => unknown>(fn: F): (value: T) => T;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/times.d.ts
type MAX_LITERAL_SIZE = 46;
type TimesArray<T, N extends number, Iteration extends ReadonlyArray<unknown> = []> = number extends N ? Array<T> : `${N}` extends `-${number}` ? [] : `${N}` extends `${infer K extends number}.${number}` ? TimesArray<T, K, Iteration> : GreaterThan<N, MAX_LITERAL_SIZE> extends true ? [...TimesArray<T, MAX_LITERAL_SIZE, Iteration>, ...Array<T>] : N extends Iteration["length"] ? [] : [T, ...TimesArray<T, N, [unknown, ...Iteration]>];
/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @param count - A value between `0` and `n - 1`. Increments after each
 * function call.
 * @param fn - The function to invoke. Passed one argument, the current value of
 * `n`.
 * @returns An array containing the return values of all calls to `fn`.
 * @signature
 *    R.times(count, fn)
 * @example
 *    R.times(5, R.identity()); //=> [0, 1, 2, 3, 4]
 * @dataFirst
 * @category Array
 */
declare function times<T, N extends number>(count: N, fn: (index: number) => T): TimesArray<T, N>;
/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @param fn - The function to invoke. Passed one argument, the current value of
 * `n`.
 * @returns An array containing the return values of all calls to `fn`.
 * @signature
 *    R.times(fn)(count)
 * @example
 *    R.times(R.identity())(5); //=> [0, 1, 2, 3, 4]
 * @dataLast
 * @category Array
 */
declare function times<T>(fn: (index: number) => T): <N extends number>(count: N) => TimesArray<T, N>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/toCamelCase.d.ts
type CamelCaseOptions = {
  readonly preserveConsecutiveUppercase?: boolean;
};
declare const DEFAULT_PRESERVE_CONSECUTIVE_UPPERCASE = true;
type CamelCaseOptionsWithDefaults<Options extends CamelCaseOptions> = Merge<{
  preserveConsecutiveUppercase: typeof DEFAULT_PRESERVE_CONSECUTIVE_UPPERCASE;
}, Options>;
/**
 * Convert a text to camelCase by splitting it into words, un-capitalizing the
 * first word, capitalizing the rest, then joining them back together. This is
 * the runtime implementation of type-fest's [`CamelCase` type](https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts).
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 *
 * For *PascalCase* use `capitalize(toCamelCase(data))`.
 *
 * @param data - A string.
 * @param options - An _optional_ object with an _optional_ prop
 * `preserveConsecutiveUppercase` that can be used to change the way consecutive
 * uppercase characters are handled. Defaults to `true`.
 * @signature
 *   R.toCamelCase(data);
 *   R.toCamelCase(data, { preserveConsecutiveUppercase });
 * @example
 *   R.toCamelCase("hello world"); // "helloWorld"
 *   R.toCamelCase("__HELLO_WORLD__"); // "helloWorld"
 *   R.toCamelCase("HasHTML"); // "hasHTML"
 *   R.toCamelCase("HasHTML", { preserveConsecutiveUppercase: false }); // "hasHtml"
 * @dataFirst
 * @category String
 */
declare function toCamelCase<T extends string, Options extends CamelCaseOptions>(data: T, options?: Options): CamelCase<T, CamelCaseOptionsWithDefaults<Options>>;
/**
 * Convert a text to camelCase by splitting it into words, un-capitalizing the
 * first word, capitalizing the rest, then joining them back together. This is
 * the runtime implementation of type-fest's [`CamelCase` type](https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts).
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 *
 * For *PascalCase* use `capitalize(toCamelCase(data))`.
 *
 * @param options - An _optional_ object with an _optional_ prop
 * `preserveConsecutiveUppercase` that can be used to change the way consecutive
 * uppercase characters are handled. Defaults to `true`.
 * @signature
 *   R.toCamelCase()(data);
 *   R.toCamelCase({ preserveConsecutiveUppercase })(data);
 * @example
 *   R.pipe("hello world", R.toCamelCase()); // "helloWorld"
 *   R.pipe("__HELLO_WORLD__", toCamelCase()); // "helloWorld"
 *   R.pipe("HasHTML", R.toCamelCase()); // "hasHTML"
 *   R.pipe(
 *     "HasHTML",
 *     R.toCamelCase({ preserveConsecutiveUppercase: false }),
 *   ); // "hasHtml"
 * @dataLast
 * @category String
 */
declare function toCamelCase<Options extends CamelCaseOptions>(options?: Options): <T extends string>(data: T) => CamelCase<T, CamelCaseOptionsWithDefaults<Options>>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/toKebabCase.d.ts
type KebabCase<S extends string> = string extends S ? string : Lowercase<Join<Words<S>, "-">>;
/**
 * Convert a text to kebab-Case by splitting it into words and joining them back
 * together with "-", and then lowering the case of the result.
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toCamelCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 *
 * @param data - A string.
 * @signature
 *   R.toKebabCase(data);
 * @example
 *   R.toKebabCase("hello world"); // "hello-world"
 *   R.toKebabCase("__HELLO_WORLD__"); // "hello-world"
 * @dataFirst
 * @category String
 */
declare function toKebabCase<S extends string>(data: S): KebabCase<S>;
/**
 * Convert a text to kebabCase by splitting it into words and joining them back
 * together with "-", and then lowering the case of the result.
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, and `toCamelCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 *
 * @signature
 *   R.toKebabCase()(data);
 * @example
 *   R.pipe("hello world", R.toKebabCase()); // "hello-world"
 *   R.pipe("__HELLO_WORLD__", toKebabCase()); // "hello-world"
 * @dataLast
 * @category String
 */
declare function toKebabCase(): <S extends string>(data: S) => KebabCase<S>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/toLowerCase.d.ts
/**
 * Lowers the case of all characters in the input. Uses the built-in [`String.prototype.toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
 * for the runtime, and the built-in [`Lowercase`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#lowercasestringtype)
 * utility type for typing.
 *
 * For other case manipulations see: `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 * If the output is intended for display (on a browser) consider using
 * [the `text-transform: lowercase;` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * instead!
 *
 * @param data - A string.
 * @signature
 *   R.toLowerCase(data);
 * @example
 *   R.toLowerCase("Hello World"); // "hello world"
 * @dataFirst
 * @category String
 */
declare function toLowerCase<T extends string>(data: T): Lowercase<T>;
/**
 * Lowers the case of all characters in the input. Uses the built-in [`String.prototype.toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
 * for the runtime, and the built-in [`Lowercase`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#lowercasestringtype)
 * utility type for typing.
 *
 * For other case manipulations see: `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 * If the output is intended for display (on a browser) consider using
 * [the `text-transform" lowercase;` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * instead!
 *
 * @signature
 *   R.toLowerCase()(data);
 * @example
 *   R.pipe("Hello World", R.toLowerCase()); // "hello world"
 * @dataLast
 * @category String
 */
declare function toLowerCase(): <T extends string>(data: T) => Lowercase<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/toSnakeCase.d.ts
type SnakeCase<S extends string> = string extends S ? string : Lowercase<Join<Words<S>, "_">>;
/**
 * Convert a text to snake-case by splitting it into words and joining them back
 * together with "_", and then lowering the case of the result.
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, and `toKebabCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 *
 * @param data - A string.
 * @signature
 *   R.toSnakeCase(data);
 * @example
 *   R.toSnakeCase("hello world"); // "hello_world"
 *   R.toSnakeCase("__HELLO_WORLD__"); // "hello_world"
 * @dataFirst
 * @category String
 */
declare function toSnakeCase<S extends string>(data: S): SnakeCase<S>;
/**
 * Convert a text to snake-case by splitting it into words and joining them back
 * together with "_", and then lowering the case of the result.
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, and `toKebabCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 *
 * @signature
 *   R.toSnakeCase()(data);
 * @example
 *   R.pipe("hello world", R.toSnakeCase()); // "hello_world"
 *   R.pipe("__HELLO_WORLD__", toSnakeCase()); // "hello_world"
 * @dataLast
 * @category String
 */
declare function toSnakeCase(): <S extends string>(data: S) => SnakeCase<S>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/toUpperCase.d.ts
/**
 * Replaces all lower-case characters to their upper-case equivalent in the
 * input. Uses the built-in [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * for the runtime, and the built-in [`Uppercase`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#uppercasestringtype)
 * utility type for typing.
 *
 * For other case manipulations see: `toLowerCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 * If the output is intended for display (on a browser) consider using
 * [the `text-transform: uppercase;` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * instead!
 *
 * @param data - A string.
 * @signature
 *   R.toUpperCase(data);
 * @example
 *   R.toUpperCase("Hello World"); // "HELLO WORLD"
 * @dataFirst
 * @category String
 */
declare function toUpperCase<T extends string>(data: T): Uppercase<T>;
/**
 * Replaces all lower-case characters to their upper-case equivalent in the
 * input. Uses the built-in [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * for the runtime, and the built-in [`Uppercase`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#uppercasestringtype)
 * utility type for typing.
 *
 * For other case manipulations see: `toLowerCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 * If the output is intended for display (on a browser) consider using
 * [the `text-transform: uppercase;` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * instead!
 *
 * @signature
 *   R.toUpperCase()(data);
 * @example
 *   R.pipe("Hello World", R.toUpperCase()); // "HELLO WORLD"
 * @dataLast
 * @category String
 */
declare function toUpperCase(): <T extends string>(data: T) => Uppercase<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/uncapitalize.d.ts
/**
 * Makes first character of a string lower-case. Uses the built-in
 * [`String.prototype.toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
 * for the runtime, and the built-in [`Uncapitalize`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#Uncapitalizestringtype)
 * utility type for typing.
 *
 * For other case manipulations see: `toUpperCase`, `toLowerCase`, `capitalize`,
 * `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 *
 * @param data - A string.
 * @signature
 *   R.uncapitalize(data);
 * @example
 *   R.uncapitalize("HELLO WORLD"); // "hELLO WORLD"
 * @dataFirst
 * @category String
 */
declare function uncapitalize<T extends string>(data: T): Uncapitalize<T>;
/**
 * Makes first character of a string upper-case. Uses the built-in
 * [`String.prototype.toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
 * for the runtime, and the built-in [`Uncapitalize`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#Uncapitalizestringtype)
 * utility type for typing.
 *
 * For other case manipulations see: `toUpperCase`, `toLowerCase`, `capitalize`,
 * `toCamelCase`, `toKebabCase`, and `toSnakeCase`.
 *
 * !IMPORTANT: This function might work _incorrectly_ for **non-ascii** inputs.
 *
 * @signature
 *   R.uncapitalize()(data);
 * @example
 *   R.pipe("HELLO WORLD", R.uncapitalize()); // "hELLO WORLD"
 * @dataLast
 * @category String
 */
declare function uncapitalize(): <T extends string>(data: T) => Uncapitalize<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/Deduped-BcgFsruc.d.ts
/**
 * The result of running a function that would dedupe an array (`unique`,
 * `uniqueBy`, and `uniqueWith`).
 *
 * There are certain traits of the output which are unique to a deduped array
 * that allow us to create a better type; see comments inline.
 *
 * !Note: We can build better types for each of the unique functions
 * _separately_ by taking advantage of _other_ characteristics that are unique
 * to each one (e.g. in `unique` we know that each item that has a disjoint type
 * to all previous items would be part of the output, even when it isn't the
 * first), but to make this utility the most useful we kept it simple and
 * generic for now.
 */
type Deduped<T extends IterableContainer> = T extends readonly [] ? [] : T extends readonly [infer Head, ...infer Rest] ? [Head, ...Array<Rest[number]>] : T extends readonly [...Array<unknown>, unknown] ? NonEmptyArray<T[number]> : Array<T[number]>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/unique.d.ts
/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @param data - The array to filter.
 * @signature
 *    R.unique(array)
 * @example
 *    R.unique([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function unique<T extends IterableContainer>(data: T): Deduped<T>;
/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @signature
 *    R.unique()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *      R.unique(),
 *      R.take(3)
 *    ) // => [1, 2, 5]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function unique(): <T extends IterableContainer>(data: T) => Deduped<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/uniqueBy.d.ts
/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param data - The array to filter.
 * @param keyFunction - Extracts a value that would be used to compare elements.
 * @signature
 *    R.uniqueBy(data, keyFunction)
 * @example
 *    R.uniqueBy(
 *     [{ n: 1 }, { n: 2 }, { n: 2 }, { n: 5 }, { n: 1 }, { n: 6 }, { n: 7 }],
 *     (obj) => obj.n,
 *    ) // => [{n: 1}, {n: 2}, {n: 5}, {n: 6}, {n: 7}]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function uniqueBy<T extends IterableContainer>(data: T, keyFunction: (item: T[number], index: number, data: T) => unknown): Deduped<T>;
/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param keyFunction - Extracts a value that would be used to compare elements.
 * @signature
 *    R.uniqueBy(keyFunction)(data)
 * @example
 *    R.pipe(
 *      [{n: 1}, {n: 2}, {n: 2}, {n: 5}, {n: 1}, {n: 6}, {n: 7}], // only 4 iterations
 *      R.uniqueBy(obj => obj.n),
 *      R.take(3)
 *    ) // => [{n: 1}, {n: 2}, {n: 5}]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function uniqueBy<T extends IterableContainer>(keyFunction: (item: T[number], index: number, data: T) => unknown): (data: T) => Deduped<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/uniqueWith.d.ts
type IsEquals<T> = (a: T, b: T) => boolean;
/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param data - The array to filter.
 * @param isEquals - The comparator.
 * @signature
 *    R.uniqueWith(array, isEquals)
 * @example
 *    R.uniqueWith(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *      R.equals,
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function uniqueWith<T extends IterableContainer>(data: T, isEquals: IsEquals<T[number]>): Deduped<T>;
/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param isEquals - The comparator.
 * @signature R.uniqueWith(isEquals)(array)
 * @example
 *    R.uniqueWith(R.equals)(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 *    R.pipe(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}], // only 4 iterations
 *      R.uniqueWith(R.equals),
 *      R.take(3)
 *    ) // => [{a: 1}, {a: 2}, {a: 5}]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function uniqueWith<T extends IterableContainer>(isEquals: IsEquals<T[number]>): (data: T) => Deduped<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/values.d.ts
type Values<T extends object> = T extends IterableContainer ? Array<T[number]> : Array<EnumerableStringKeyedValueOf<T>>;
/**
 * Returns a new array containing the values of the array or object.
 *
 * @param data - Either an array or an object.
 * @signature
 *    R.values(source)
 * @example
 *    R.values(['x', 'y', 'z']) // => ['x', 'y', 'z']
 *    R.values({ a: 'x', b: 'y', c: 'z' }) // => ['x', 'y', 'z']
 * @dataFirst
 * @category Object
 */
declare function values<T extends object>(data: T): Values<T>;
/**
 * Returns a new array containing the values of the array or object.
 *
 * @signature
 *    R.values()(source)
 * @example
 *    R.pipe(['x', 'y', 'z'], R.values()) // => ['x', 'y', 'z']
 *    R.pipe({ a: 'x', b: 'y', c: 'z' }, R.values()) // => ['x', 'y', 'z']
 *    R.pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      R.values(),
 *      R.first(),
 *    ) // => 'x'
 * @dataLast
 * @category Object
 */
declare function values(): <T extends object>(data: T) => Values<T>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/when.d.ts
/**
 * Conditionally run a function based on a predicate, returning it's result (similar to
 * the [`?:` (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator).)
 * If the optional `onFalse` function is not provided, the data will be passed
 * through in those cases.
 *
 * Supports type predicates to refine the types for both branches and the return
 * value.
 *
 * Additional arguments are passed to all functions. In data-first calls, they
 * are taken as variadic arguments; but in data-last calls, they are when the
 * curried function itself is called.
 *
 * For more complex cases check out `conditional`.
 *
 * @param predicate - Decides if the `onTrue` mapper should run or not. If it's
 * a type predicate it also narrows types for the mappers and the return value.
 * @param onTrue - Function to run when the predicate returns `true`.
 * @signature
 *   when(predicate, onTrue)(data, ...extraArgs)
 *   when(predicate, { onTrue, onFalse })(data, ...extraArgs)
 * @example
 *   pipe(data, when(isNullish, constant(42)));
 *   pipe(data, when((x) => x > 3, { onTrue: add(1), onFalse: multiply(2) }));
 *   map(data, when(isNullish, (x, index) => x + index));
 * @dataLast
 * @category Function
 */
declare function when<T, ExtraArgs extends Array<any>, Predicate extends (data: T, ...extraArgs: ExtraArgs) => boolean, OnTrue extends (data: GuardType<Predicate, T>, ...extraArgs: ExtraArgs) => unknown>(predicate: Predicate, onTrue: OnTrue): (data: T, ...extraArgs: ExtraArgs) => Exclude<T, GuardType<Predicate>> | ReturnType<OnTrue>;
declare function when<T, ExtraArgs extends Array<any>, Predicate extends (data: T, ...extraArgs: ExtraArgs) => boolean, OnTrue extends (data: GuardType<Predicate, T>, ...extraArgs: ExtraArgs) => unknown, OnFalse extends (data: Exclude<T, GuardType<Predicate>>, ...extraArgs: ExtraArgs) => unknown>(predicate: Predicate, branches: {
  readonly onTrue: OnTrue;
  readonly onFalse: OnFalse;
}): (data: T, ...extraArgs: ExtraArgs) => ReturnType<OnFalse> | ReturnType<OnTrue>;
/**
 * Conditionally run a function based on a predicate, returning it's result (similar to
 * the [`?:` (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator).)
 * If the optional `onFalse` function is not provided, the data will be passed
 * through in those cases.
 *
 * Supports type predicates to refine the types for both branches and the return
 * value.
 *
 * Additional arguments are passed to all functions. In data-first calls, they
 * are taken as variadic arguments; but in data-last calls, they are when the
 * curried function itself is called.
 *
 * For more complex cases check out `conditional`.
 *
 * @param data - The data to be passed to all functions, as the first param.
 * @param predicate - Decides if the `onTrue` mapper should run or not. If it's
 * a type predicate it also narrows types for the mappers and the return value.
 * @param onTrue - The function that would run when the predicate returns
 * `true`.
 * @param extraArgs - Additional arguments. These would be passed as is to the
 * `predicate`, `onTrue`, and `onFalse` functions.
 * @signature
 *   when(data, predicate, onTrue, ...extraArgs)
 *   when(data, predicate, { onTrue, onFalse }, ...extraArgs)
 * @example
 *   when(data, isNullish, constant(42));
 *   when(data, (x) => x > 3, { onTrue: add(1), onFalse: multiply(2) });
 *   when(data, isString, (x, radix) => parseInt(x, radix), 10);
 * @dataFirst
 * @category Function
 */
declare function when<T, ExtraArgs extends Array<any>, Predicate extends (data: T, ...extraArgs: ExtraArgs) => boolean, OnTrue extends (data: GuardType<Predicate, T>, ...extraArgs: ExtraArgs) => unknown>(data: T, predicate: Predicate, onTrue: OnTrue, ...extraArgs: ExtraArgs): Exclude<T, GuardType<Predicate>> | ReturnType<OnTrue>;
declare function when<T, ExtraArgs extends Array<any>, Predicate extends (data: T, ...extraArgs: ExtraArgs) => boolean, OnTrue extends (data: GuardType<Predicate, T>, ...extraArgs: ExtraArgs) => unknown, OnFalse extends (data: Exclude<T, GuardType<Predicate>>, ...extraArgs: ExtraArgs) => unknown>(data: T, predicate: Predicate, branches: {
  readonly onTrue: OnTrue;
  readonly onFalse: OnFalse;
}, ...extraArgs: ExtraArgs): ReturnType<OnFalse> | ReturnType<OnTrue>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/zip.d.ts
type Zipped<Left extends IterableContainer, Right extends IterableContainer> = Left extends readonly [] ? [] : Right extends readonly [] ? [] : Left extends readonly [infer LeftHead, ...infer LeftRest] ? Right extends readonly [infer RightHead, ...infer RightRest] ? [[LeftHead, RightHead], ...Zipped<LeftRest, RightRest>] : [[LeftHead, Right[number]], ...Zipped<LeftRest, Right>] : Right extends readonly [infer RightHead, ...infer RightRest] ? [[Left[number], RightHead], ...Zipped<Left, RightRest>] : Array<[Left[number], Right[number]]>;
/**
 * Creates a new list from two supplied lists by pairing up equally-positioned
 * items. The length of the returned list will match the shortest of the two
 * inputs.
 *
 * @param first - The first input list.
 * @param second - The second input list.
 * @signature
 *   R.zip(first, second)
 * @example
 *   R.zip([1, 2], ['a', 'b']) // => [[1, 'a'], [2, 'b']]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function zip<F extends IterableContainer, S extends IterableContainer>(first: F, second: S): Zipped<F, S>;
/**
 * Creates a new list from two supplied lists by pairing up equally-positioned
 * items. The length of the returned list will match the shortest of the two
 * inputs.
 *
 * @param second - The second input list.
 * @signature
 *   R.zip(second)(first)
 * @example
 *   R.zip(['a', 'b'])([1, 2]) // => [[1, 'a'], [2, 'b']]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function zip<S extends IterableContainer>(second: S): <F extends IterableContainer>(first: F) => Zipped<F, S>;
//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/zipWith.d.ts
type ZippingFunction<T1 extends IterableContainer = IterableContainer, T2 extends IterableContainer = IterableContainer, Value = unknown> = (first: T1[number], second: T2[number], index: number, data: readonly [first: T1, second: T2]) => Value;
/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param fn - The function applied to each position of the list.
 * @signature
 *   R.zipWith(fn)(first, second)
 * @example
 *   R.zipWith((a: string, b: string) => a + b)(['1', '2', '3'], ['a', 'b', 'c']) // => ['1a', '2b', '3c']
 * @category Array
 */
declare function zipWith<TItem1, TItem2, Value>(fn: ZippingFunction<ReadonlyArray<TItem1>, ReadonlyArray<TItem2>, Value>): (first: ReadonlyArray<TItem1>, second: ReadonlyArray<TItem2>) => Array<Value>;
/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param second - The second input list.
 * @param fn - The function applied to each position of the list.
 * @signature
 *   R.zipWith(second, fn)(first)
 * @example
 *   R.pipe(['1', '2', '3'], R.zipWith(['a', 'b', 'c'], (a, b) => a + b)) // => ['1a', '2b', '3c']
 * @dataLast
 * @lazy
 * @category Array
 */
declare function zipWith<T1 extends IterableContainer, T2 extends IterableContainer, Value>(second: T2, fn: ZippingFunction<T1, T2, Value>): (first: T1) => Array<Value>;
/**
 * Creates a new list from two supplied lists by calling the supplied function
 * with the same-positioned element from each list.
 *
 * @param first - The first input list.
 * @param second - The second input list.
 * @param fn - The function applied to each position of the list.
 * @signature
 *   R.zipWith(first, second, fn)
 * @example
 *   R.zipWith(['1', '2', '3'], ['a', 'b', 'c'], (a, b) => a + b) // => ['1a', '2b', '3c']
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function zipWith<T1 extends IterableContainer, T2 extends IterableContainer, Value>(first: T1, second: T2, fn: ZippingFunction<T1, T2, Value>): Array<Value>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/compositions/compose.d.ts
/**
 * Composes functions left-to-right. The parameter of the first function must be annotated.
 *
 * @example
 * compose(
 *   (arr: number[]) => arr.map(x => x * 2),
 *   arr => arr.join(','),
 * )([1, 2, 3, 4]); // => '2,4,6,8'
 */
declare function compose<A, B>(fn1: (value: A) => B): (value: A) => B;
declare function compose<A, B, C>(fn1: (value: A) => B, fn2: (value: B) => C): (value: A) => C;
declare function compose<A, B, C, D>(fn1: (value: A) => B, fn2: (value: B) => C, fn3: (value: C) => D): (value: A) => D;
declare function compose<A, B, C, D, E>(fn1: (value: A) => B, fn2: (value: B) => C, fn3: (value: C) => D, fn4: (value: D) => E): (value: A) => E;
declare function compose<A, B, C, D, E, F>(fn1: (value: A) => B, fn2: (value: B) => C, fn3: (value: C) => D, fn4: (value: D) => E, fn5: (value: E) => F): (value: A) => F;
declare function compose<A, B, C, D, E, F, G>(fn1: (value: A) => B, fn2: (value: B) => C, fn3: (value: C) => D, fn4: (value: D) => E, fn5: (value: E) => F, fn6: (value: F) => G): (value: A) => G;
declare function compose<A, B, C, D, E, F, G, H>(fn1: (value: A) => B, fn2: (value: B) => C, fn3: (value: C) => D, fn4: (value: D) => E, fn5: (value: E) => F, fn6: (value: F) => G, fn7: (value: G) => H): (value: A) => H;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/compositions/curry.d.ts
type Curried<F extends (...args: readonly never[]) => unknown> = Parameters<F> extends readonly [infer T, ...infer R extends unknown[]] ? (...args: R) => (arg: T) => ReturnType<F> : Parameters<F> extends Array<infer T> ? (...args: T[]) => (arg: T) => ReturnType<F> : never;
type NthCurried<N extends number, F extends (...args: readonly never[]) => unknown, A extends never[] = [never]> = A['length'] extends N ? Curried<F> : NthCurried<N, Curried<F>, [never, ...A]>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/compositions/purry.d.ts
type Purried<F extends (...args: Parameters<F>) => ReturnType<F>, P extends Parameters<F> | Parameters<Curried<F>> = Parameters<F> | Parameters<Curried<F>>> = Parameters<F> & Parameters<Curried<F>> extends never ? Parameters<F> extends [unknown, unknown, ...unknown[]] ? P extends Parameters<F> ? F : Curried<F> : never : never;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/controls/types.d.ts
type StaticSeries<T> = readonly T[] | ReadonlySet<T>;
type SyncSeries<T> = StaticSeries<T> | IterableIterator<T>;
type Series<T> = MaybePromise<SyncSeries<MaybePromise<T>> | AsyncIterableIterator<MaybePromise<T>>>;
type MaybePromise<T> = T | Promise<T>;
type VariantLengthArray<T, L extends number, A extends T[] = []> = number extends L ? T[] : A['length'] extends L ? A : A | VariantLengthArray<T, L, [T, ...A]>;
type Chunked<T, L extends number> = VariantLengthArray<T, L, [T]>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/controls/accumulate.d.ts
declare function accumulateAsync<T>(input: Series<T>): Promise<Array<Awaited<T>>>;
declare const executeAsync: typeof accumulateAsync;
declare const toArrayAsync: typeof accumulateAsync;
/** Awaits all promises in a series. Alias of {@link accumulate.async} */
declare const awaitAll: typeof accumulateAsync;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/controls/buffer.d.ts
declare function _buffer<T>(input: Series<T>, options: {
  /** Number of items buffered. */
  size: number;
  /**
   * - `'frfo'` (default) : first resolved will be first output.
   * - `'fifo'` : first input will be first output.
   */
  mode?: 'frfo' | 'fifo';
}): AsyncGenerator<Awaited<T>>;
/**
 * Buffers specified number of items and generates results in the resolution order.
 *
 * If the input is a synchronous iterator which generates promises, the promises are executed in parallel and throttled.
 */
declare function buffer<T>(...args: Parameters<typeof _buffer<T>>): ReturnType<typeof _buffer<T>>;
declare function buffer<T>(...args: Parameters<Curried<typeof _buffer<T>>>): ReturnType<Curried<typeof _buffer<T>>>;
/**
 * The promises generated by the given synchronous iterator are executed in parallel and throttled.
 * Alias of {@link buffer}.
 *
 * @example
 * ```ts
 * const responses = await Rt.pipe(
 *     urls,
 *     Rt.map.sync(async url => {
 *         const response = await fetch(url);
 *         return await response.json();
 *     }),
 *     Rt.throttle({ size: 5 }), // Maintain up to 5 concurrent HTTP fetch requests.
 *     Rt.accumulate.async, // The results are in resolution order.
 * );
 * ```
 */
declare const throttle: typeof buffer;
/**
 * The promises generated by the given synchronous iterator are executed in parallel and kept in defined concurrency level.
 * Alias of {@link buffer}.
 *
 * @example
 * ```ts
 * const responses = await Rt.pipe(
 *     urls,
 *     Rt.map.sync(async url => {
 *         const response = await fetch(url);
 *         return await response.json();
 *     }),
 *     Rt.concurrency({ size: 5 }), // Maintain up to 5 concurrent HTTP fetch requests.
 *     Rt.accumulate.async, // The results are in resolution order.
 * );
 * ```
 */
declare const concurrency: typeof buffer;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/controls/chunk.d.ts
declare function _asyncChunk<T, L extends number>(input: Series<T>, size: L): AsyncGenerator<Chunked<Awaited<T>, L>>;
declare function chunkAsync<T, L extends number>(...args: Parameters<typeof _asyncChunk<T, L>>): ReturnType<typeof _asyncChunk<T, L>>;
declare function chunkAsync<T, L extends number>(...args: Parameters<Curried<typeof _asyncChunk<T, L>>>): ReturnType<Curried<typeof _asyncChunk<T, L>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/controls/flatten.d.ts
declare function flattenAsync<T>(input: Series<Series<T>>): AsyncGenerator<Awaited<T>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/controls/serialize.d.ts
declare function serializeAsync<T>(input: Series<T>): AsyncGenerator<Awaited<T>>;
declare const toIteratorAsync: typeof serializeAsync;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/filters/filter.d.ts
declare function filterAsync<T, S extends Awaited<T>>(input: Series<T>, test: (value: Awaited<T>) => value is S): AsyncGenerator<S>;
declare function filterAsync<T, S extends Awaited<T>>(test: (value: Awaited<T>) => value is S): (input: Series<T>) => AsyncGenerator<S>;
declare function filterAsync<T>(input: Series<T>, test: (value: Awaited<T>) => MaybePromise<boolean>): AsyncGenerator<Awaited<T>>;
declare function filterAsync<T>(test: (value: Awaited<T>) => MaybePromise<boolean>): (input: Series<T>) => AsyncGenerator<Awaited<T>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/filters/unique.d.ts
declare const uniqueAsync: <T>(input: Series<T>) => AsyncGenerator<Awaited<T>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/filters/unique-by.d.ts
declare const _asyncUniqueBy: <T>(input: Series<T>, key: (value: Awaited<T>) => MaybePromise<unknown>) => AsyncGenerator<Awaited<T>>;
declare function uniqueByAsync<T>(...args: Parameters<typeof _asyncUniqueBy<T>>): ReturnType<typeof _asyncUniqueBy<T>>;
declare function uniqueByAsync<T>(...args: Parameters<Curried<typeof _asyncUniqueBy<T>>>): ReturnType<Curried<typeof _asyncUniqueBy<T>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/filters/unique-with.d.ts
declare const _asyncUniqueWith: <T>(input: Series<T>, equals: (value1: Awaited<T>, value2: Awaited<T>) => MaybePromise<boolean>) => AsyncGenerator<Awaited<T>>;
declare function uniqueWithAsync<T>(...args: Parameters<typeof _asyncUniqueWith<T>>): ReturnType<typeof _asyncUniqueWith<T>>;
declare function uniqueWithAsync<T>(...args: Parameters<Curried<typeof _asyncUniqueWith<T>>>): ReturnType<Curried<typeof _asyncUniqueWith<T>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/difference.d.ts
declare const _asyncDifference: <T, U>(input: Series<T>, other: StaticSeries<U>) => AsyncGenerator<Awaited<T>>;
declare function differenceAsync<T, U>(...args: Parameters<typeof _asyncDifference<T, U>>): ReturnType<typeof _asyncDifference<T, U>>;
declare function differenceAsync<T, U>(...args: Parameters<Curried<typeof _asyncDifference<T, U>>>): ReturnType<Curried<typeof _asyncDifference<T, U>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/difference-by.d.ts
declare const _asyncDifferenceBy: <T, U>(input: Series<T>, other: StaticSeries<U>, key: (value: Awaited<T>) => MaybePromise<U>) => AsyncGenerator<Awaited<T>>;
declare function differenceByAsync<T, U>(...args: Parameters<typeof _asyncDifferenceBy<T, U>>): ReturnType<typeof _asyncDifferenceBy<T, U>>;
declare function differenceByAsync<T, U>(...args: Parameters<Curried<typeof _asyncDifferenceBy<T, U>>>): ReturnType<Curried<typeof _asyncDifferenceBy<T, U>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/difference-with.d.ts
declare const _asyncDifferenceWith: <T, U>(input: Series<T>, other: StaticSeries<U>, equals: (value: Awaited<T>, otherValue: U) => MaybePromise<boolean>) => AsyncGenerator<Awaited<T>>;
declare function differenceWithAsync<T, U>(...args: Parameters<typeof _asyncDifferenceWith<T, U>>): ReturnType<typeof _asyncDifferenceWith<T, U>>;
declare function differenceWithAsync<T, U>(...args: Parameters<Curried<typeof _asyncDifferenceWith<T, U>>>): ReturnType<Curried<typeof _asyncDifferenceWith<T, U>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/intersection.d.ts
declare const _asyncIntersection: <T, U>(input: Series<T>, other: StaticSeries<U>) => AsyncGenerator<Awaited<T> & U>;
declare function intersectionAsync<T, U>(...args: Parameters<typeof _asyncIntersection<T, U>>): ReturnType<typeof _asyncIntersection<T, U>>;
declare function intersectionAsync<T, U>(...args: Parameters<Curried<typeof _asyncIntersection<T, U>>>): ReturnType<Curried<typeof _asyncIntersection<T, U>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/intersection-by.d.ts
declare const _asyncIntersectionBy: <T, U>(input: Series<T>, other: StaticSeries<U>, key: (value: Awaited<T>) => MaybePromise<U>) => AsyncGenerator<Awaited<T>>;
declare function intersectionByAsync<T, U>(...args: Parameters<typeof _asyncIntersectionBy<T, U>>): ReturnType<typeof _asyncIntersectionBy<T, U>>;
declare function intersectionByAsync<T, U>(...args: Parameters<Curried<typeof _asyncIntersectionBy<T, U>>>): ReturnType<Curried<typeof _asyncIntersectionBy<T, U>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/intersection-with.d.ts
declare const _asyncIntersectionWith: <T, U>(input: Series<T>, other: StaticSeries<U>, equals: (value: Awaited<T>, otherValue: U) => MaybePromise<boolean>) => AsyncGenerator<Awaited<T>>;
declare function intersectionWithAsync<T, U>(...args: Parameters<typeof _asyncIntersectionWith<T, U>>): ReturnType<typeof _asyncIntersectionWith<T, U>>;
declare function intersectionWithAsync<T, U>(...args: Parameters<Curried<typeof _asyncIntersectionWith<T, U>>>): ReturnType<Curried<typeof _asyncIntersectionWith<T, U>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/mappers/flat-map.d.ts
declare function _asyncFlatMap<I, O>(input: Series<I>, mapper: (value: Awaited<I>) => Series<O>): AsyncGenerator<Awaited<O>>;
declare function flatMapAsync<I, O>(...args: Parameters<typeof _asyncFlatMap<I, O>>): ReturnType<typeof _asyncFlatMap<I, O>>;
declare function flatMapAsync<I, O>(...args: Parameters<Curried<typeof _asyncFlatMap<I, O>>>): ReturnType<Curried<typeof _asyncFlatMap<I, O>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/mappers/map.d.ts
declare function _asyncMap<I, O>(input: Series<I>, mapper: (value: Awaited<I>) => O | Promise<O>): AsyncGenerator<Awaited<O>>;
declare function mapAsync<I, O>(...args: Parameters<typeof _asyncMap<I, O>>): ReturnType<typeof _asyncMap<I, O>>;
declare function mapAsync<I, O>(...args: Parameters<Curried<typeof _asyncMap<I, O>>>): ReturnType<Curried<typeof _asyncMap<I, O>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/reducers/every.d.ts
declare function _asyncEvery<T>(input: Series<T>, test: (value: Awaited<T>) => MaybePromise<boolean>): Promise<boolean>;
declare function everyAsync<T>(...args: Parameters<typeof _asyncEvery<T>>): ReturnType<typeof _asyncEvery<T>>;
declare function everyAsync<T>(...args: Parameters<Curried<typeof _asyncEvery<T>>>): ReturnType<Curried<typeof _asyncEvery<T>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/reducers/find.d.ts
declare function findAsync<T, S extends Awaited<T>>(input: Series<T>, test: ((value: Awaited<T>) => value is S) | ((value: Awaited<T>) => Promise<boolean>)): Promise<S | undefined>;
declare function findAsync<T, S extends Awaited<T>>(test: ((value: Awaited<T>) => value is S) | ((value: Awaited<T>) => Promise<boolean>)): (input: Series<T>) => Promise<S | undefined>;
declare function findAsync<T>(input: Series<T>, test: (value: Awaited<T>) => MaybePromise<boolean>): Promise<T | undefined>;
declare function findAsync<T>(test: (value: Awaited<T>) => MaybePromise<boolean>): (input: Series<T>) => Promise<T | undefined>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/reducers/reduce.d.ts
declare function _asyncReduce<T, R, I>(input: Series<T>, reducer: (accumulator: Awaited<R | I>, value: Awaited<T>) => R | Promise<R>, initialValue: I | Promise<I>): Promise<Awaited<R> | Awaited<I>>;
declare function reduceAsync<T, R, I>(...args: Parameters<typeof _asyncReduce<T, R, I>>): ReturnType<typeof _asyncReduce<T, R, I>>;
declare function reduceAsync<T, R, I>(...args: Parameters<Curried<typeof _asyncReduce<T, R, I>>>): ReturnType<Curried<typeof _asyncReduce<T, R, I>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/reducers/some.d.ts
declare function _asyncSome<T>(input: Series<T>, test: (value: Awaited<T>) => MaybePromise<boolean>): Promise<boolean>;
declare function someAsync<T>(...args: Parameters<typeof _asyncSome<T>>): ReturnType<typeof _asyncSome<T>>;
declare function someAsync<T>(...args: Parameters<Curried<typeof _asyncSome<T>>>): ReturnType<Curried<typeof _asyncSome<T>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/side-effectors/for-each.d.ts
declare function _asyncForEach<T>(input: Series<T>, action: (value: Awaited<T>) => void | Promise<void>): Promise<void>;
declare function forEachAsync<T>(...args: Parameters<typeof _asyncForEach<T>>): ReturnType<typeof _asyncForEach<T>>;
declare function forEachAsync<T>(...args: Parameters<Curried<typeof _asyncForEach<T>>>): ReturnType<Curried<typeof _asyncForEach<T>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/side-effectors/peek.d.ts
declare function _asyncPeek<T>(input: Series<T>, action: (value: Awaited<T>) => MaybePromise<void>): AsyncGenerator<Awaited<T>>;
declare function peekAsync<T>(...args: Parameters<typeof _asyncPeek<T>>): ReturnType<typeof _asyncPeek<T>>;
declare function peekAsync<T>(...args: Parameters<Curried<typeof _asyncPeek<T>>>): ReturnType<Curried<typeof _asyncPeek<T>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/splicers/concat.d.ts
declare function _asyncConcat<T>(preceding: Series<T>, following: Series<T>): AsyncGenerator<T>;
declare function concatAsync<T>(...args: Parameters<typeof _asyncConcat<T>>): ReturnType<typeof _asyncConcat<T>>;
declare function concatAsync<T>(...args: Parameters<Curried<typeof _asyncConcat<T>>>): ReturnType<Curried<typeof _asyncConcat<T>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/splicers/drop.d.ts
declare function _asyncDrop<T>(input: Series<T>, drop: number): AsyncGenerator<T>;
declare function dropAsync<T>(...args: Parameters<typeof _asyncDrop<T>>): ReturnType<typeof _asyncDrop<T>>;
declare function dropAsync<T>(...args: Parameters<Curried<typeof _asyncDrop<T>>>): ReturnType<Curried<typeof _asyncDrop<T>>>;
//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/splicers/take.d.ts
declare function _asyncTake<T>(input: Series<T>, take: number): AsyncGenerator<T>;
declare function takeAsync<T>(...args: Parameters<typeof _asyncTake<T>>): ReturnType<typeof _asyncTake<T>>;
declare function takeAsync<T>(...args: Parameters<Curried<typeof _asyncTake<T>>>): ReturnType<Curried<typeof _asyncTake<T>>>;
//#endregion
export { type Chunked, type Curried, type NthCurried, type Purried, type Series, type StaticSeries, type SyncSeries, accumulateAsync as accumulateP, add, addProp, allPass, anyPass, awaitAll, buffer, capitalize, ceil, chunk, chunkAsync as chunkP, clamp, clone, compose, concat, concatAsync as concatP, concurrency, conditionalPlus as conditional, constant, countBy, debounce, difference, differenceByAsync as differenceByP, differenceAsync as differenceP, differenceWith, differenceWithAsync as differenceWithP, divide, doNothing, drop, dropFirstBy, dropLast, dropLastWhile, dropAsync as dropP, dropWhile, endsWith, entries, everyAsync as everyP, evolve, executeAsync as executeP, filter, filterAsync as filterP, find, findIndex, findLast, findLastIndex, findAsync as findP, first, firstBy, flat, flatMap, flatMapAsync as flatMapP, flattenAsync as flattenP, floor, forEach, forEachObj, forEachAsync as forEachP, fromEntries, fromKeys, funnel, groupBy, hasAtLeast, hasOwnProperty, hasSubObject, identity, indexBy, intersection, intersectionByAsync as intersectionByP, intersectionAsync as intersectionP, intersectionWith, intersectionWithAsync as intersectionWithP, invert, isArray, isBigInt, isBoolean, isDate, isDeepEqual, isDefined, isEmpty, isError, isFunction, isIncludedIn, isNonNull, isNonNullish, isNot, isNullish, isNumber, isObjectType, isPlainObject, isPromise, isPromiseLike, isShallowEqual, isStrictEqual, isString, isSymbol, isTruthy, join, keys, last, length, map, mapKeys, mapAsync as mapP, mapToObj, mapValues, mapWithFeedback, mean, meanBy, median, merge, mergeAll, mergeDeep, multiply, nthBy, objOf, omit, omitBy, once, only, partialBind, partialLastBind, partition, pathOr, pick, pickBy, pipe, piped, product, prop, pullObject, purry, randomBigInt, randomInteger, randomString, range, rankBy, reduce, reduceAsync as reduceP, reverse, round, sample, serializeAsync as serializeP, set, setPath, shuffle, sliceString, someAsync as someP, sort, sortBy, sortedIndex, sortedIndexBy, sortedIndexWith, sortedLastIndex, sortedLastIndexBy, splice, split, splitAt, splitWhen, startsWith, stringToPath, subtract, sum, sumBy, swapIndices, swapProps, take, takeFirstBy, takeLast, takeLastWhile, takeAsync as takeP, takeWhile, tap, peekAsync as tapP, throttle, times, toArrayAsync as toArrayP, toCamelCase, toIteratorAsync as toIteratorP, toKebabCase, toLowerCase, toSnakeCase, toUpperCase, uncapitalize, unique, uniqueBy, uniqueByAsync as uniqueByP, uniqueAsync as uniqueP, uniqueWith, uniqueWithAsync as uniqueWithP, values, when, zip, zipWith };