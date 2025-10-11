//#region src/types/fn.d.ts
type Fn<Return = any, Args extends readonly any[] = any[]> = (...args: Args) => Return;
type FnWithThis<Return = any, Args extends readonly any[] = any[], This = unknown> = ((this: This, ...args: Args) => Return) & {
  prototype: This;
};
type AsyncFn<Return = any, Args extends readonly any[] = any[]> = (...args: Args) => Promise<Return>;
type AsyncFnWithThis<Return = any, Args extends readonly any[] = any[], This = unknown> = ((this: This, ...args: Args) => Promise<Return>) & {
  prototype: This;
};
type SyncFn<Return = any, Args extends readonly any[] = any[]> = (...args: Args) => Return extends Promise<any> ? never : Return;
type SyncFnWithThis<Return = any, Args extends readonly any[] = any[], This = unknown> = ((this: This, ...args: Args) => Return extends Promise<any> ? never : Return) & {
  prototype: This;
};
//#endregion
//#region src/types/nullable.d.ts
type Nullable<T> = T | null | undefined;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/primitive.d.ts
/**
Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).

@category Type
*/
type Primitive = null | undefined | string | number | boolean | symbol | bigint;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/typed-array.d.ts
/**
Matches any [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), like `Uint8Array` or `Float64Array`.

@category Array
*/
type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/basic.d.ts
/**
Matches a [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

@category Class
*/
type Class<T, Arguments extends unknown[] = any[]> = {
  prototype: Pick<T, keyof T>;
  new (...arguments_: Arguments): T;
};
/**
Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

@category Class
*/
type Constructor<T, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T;
/**
Matches an [`abstract class`](https://www.typescriptlang.org/docs/handbook/classes.html#abstract-classes).

@category Class

@privateRemarks
We cannot use a `type` here because TypeScript throws: 'abstract' modifier cannot appear on a type member. (1070)
*/
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface AbstractClass<T, Arguments extends unknown[] = any[]> extends AbstractConstructor<T, Arguments> {
  prototype: Pick<T, keyof T>;
}
/**
Matches an [`abstract class`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html#abstract-construct-signatures) constructor.

@category Class
*/
type AbstractConstructor<T, Arguments extends unknown[] = any[]> = abstract new (...arguments_: Arguments) => T;
/**
Matches a JSON object.

This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.

@category JSON
*/
type JsonObject = { [Key in string]: JsonValue } & { [Key in string]?: JsonValue | undefined };
/**
Matches a JSON array.

@category JSON
*/
type JsonArray = JsonValue[] | readonly JsonValue[];
/**
Matches any valid JSON primitive value.

@category JSON
*/
type JsonPrimitive = string | number | boolean | null;
/**
Matches any valid JSON value.

@see `Jsonify` if you need to transform a type to one that is assignable to `JsonValue`.

@category JSON
*/
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/observable-like.d.ts
declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- It has to be an `interface` so that it can be merged.
  interface SymbolConstructor {
    readonly observable: symbol;
  }
}

/**
@remarks
The TC39 observable proposal defines a `closed` property, but some implementations (such as xstream) do not as of 10/08/2021.
As well, some guidance on making an `Observable` to not include `closed` property.
@see https://github.com/tc39/proposal-observable/blob/master/src/Observable.js#L129-L130
@see https://github.com/staltz/xstream/blob/6c22580c1d84d69773ee4b0905df44ad464955b3/src/index.ts#L79-L85
@see https://github.com/benlesh/symbol-observable#making-an-object-observable

@category Observable
*/

//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/union-to-intersection.d.ts
/**
Convert a union type to an intersection type using [distributive conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).

Inspired by [this Stack Overflow answer](https://stackoverflow.com/a/50375286/2172153).

@example
```
import type {UnionToIntersection} from 'type-fest';

type Union = {the(): void} | {great(arg: string): void} | {escape: boolean};

type Intersection = UnionToIntersection<Union>;
//=> {the(): void; great(arg: string): void; escape: boolean};
```

A more applicable example which could make its way into your library code follows.

@example
```
import type {UnionToIntersection} from 'type-fest';

class CommandOne {
	commands: {
		a1: () => undefined,
		b1: () => undefined,
	}
}

class CommandTwo {
	commands: {
		a2: (argA: string) => undefined,
		b2: (argB: string) => undefined,
	}
}

const union = [new CommandOne(), new CommandTwo()].map(instance => instance.commands);
type Union = typeof union;
//=> {a1(): void; b1(): void} | {a2(argA: string): void; b2(argB: string): void}

type Intersection = UnionToIntersection<Union>;
//=> {a1(): void; b1(): void; a2(argA: string): void; b2(argB: string): void}
```

@category Type
*/
type UnionToIntersection<Union> = (
// `extends unknown` is always going to be the case and is used to convert the
// `Union` into a [distributive conditional
// type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
Union extends unknown
// The union type is used as the only argument to a function since the union
// of function arguments is an intersection.
? (distributedUnion: Union) => void
// This won't happen.
: never
// Infer the `Intersection` type since TypeScript represents the positional
// arguments of unions of functions as an intersection of the union.
) extends ((mergedIntersection: infer Intersection) => void)
// The `& Union` is to allow indexing by the resulting type
? Intersection & Union : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/keys-of-union.d.ts
/**
Create a union of all keys from a given type, even those exclusive to specific union members.

Unlike the native `keyof` keyword, which returns keys present in **all** union members, this type returns keys from **any** member.

@link https://stackoverflow.com/a/49402091

@example
```
import type {KeysOfUnion} from 'type-fest';

type A = {
	common: string;
	a: number;
};

type B = {
	common: string;
	b: string;
};

type C = {
	common: string;
	c: boolean;
};

type Union = A | B | C;

type CommonKeys = keyof Union;
//=> 'common'

type AllKeys = KeysOfUnion<Union>;
//=> 'common' | 'a' | 'b' | 'c'
```

@category Object
*/
type KeysOfUnion<ObjectType> =
// Hack to fix https://github.com/sindresorhus/type-fest/issues/1008
keyof UnionToIntersection<ObjectType extends unknown ? Record<keyof ObjectType, never> : never>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/distributed-omit.d.ts
/**
Omits keys from a type, distributing the operation over a union.

TypeScript's `Omit` doesn't distribute over unions, leading to the erasure of unique properties from union members when omitting keys. This creates a type that only retains properties common to all union members, making it impossible to access member-specific properties after the Omit. Essentially, using `Omit` on a union type merges the types into a less specific one, hindering type narrowing and property access based on discriminants. This type solves that.

Example:

```
type A = {
	discriminant: 'A';
	foo: string;
	a: number;
};

type B = {
	discriminant: 'B';
	foo: string;
	b: string;
};

type Union = A | B;

type OmittedUnion = Omit<Union, 'foo'>;
//=> {discriminant: 'A' | 'B'}

const omittedUnion: OmittedUnion = createOmittedUnion();

if (omittedUnion.discriminant === 'A') {
	// We would like to narrow `omittedUnion`'s type
	// to `A` here, but we can't because `Omit`
	// doesn't distribute over unions.

	omittedUnion.a;
 	//=> Error: `a` is not a property of `{discriminant: 'A' | 'B'}`
}
```

While `Except` solves this problem, it restricts the keys you can omit to the ones that are present in **ALL** union members, where `DistributedOmit` allows you to omit keys that are present in **ANY** union member.

@example
```
type A = {
	discriminant: 'A';
	foo: string;
	a: number;
};

type B = {
	discriminant: 'B';
	foo: string;
	bar: string;
	b: string;
};

type C = {
	discriminant: 'C';
	bar: string;
	c: boolean;
};

// Notice that `foo` exists in `A` and `B`, but not in `C`, and
// `bar` exists in `B` and `C`, but not in `A`.

type Union = A | B | C;

type OmittedUnion = DistributedOmit<Union, 'foo' | 'bar'>;

const omittedUnion: OmittedUnion = createOmittedUnion();

if (omittedUnion.discriminant === 'A') {
	omittedUnion.a;
 	//=> OK

	omittedUnion.foo;
 	//=> Error: `foo` is not a property of `{discriminant: 'A'; a: string}`

	omittedUnion.bar;
 	//=> Error: `bar` is not a property of `{discriminant: 'A'; a: string}`
}
```

@category Object
*/
type DistributedOmit<ObjectType, KeyType extends KeysOfUnion<ObjectType>> = ObjectType extends unknown ? Omit<ObjectType, KeyType> : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/distributed-pick.d.ts
/**
Pick keys from a type, distributing the operation over a union.

TypeScript's `Pick` doesn't distribute over unions, leading to the erasure of unique properties from union members when picking keys. This creates a type that only retains properties common to all union members, making it impossible to access member-specific properties after the Pick. Essentially, using `Pick` on a union type merges the types into a less specific one, hindering type narrowing and property access based on discriminants. This type solves that.

Example:

```
type A = {
	discriminant: 'A';
	foo: {
		bar: string;
	};
};

type B = {
	discriminant: 'B';
	foo: {
		baz: string;
	};
};

type Union = A | B;

type PickedUnion = Pick<Union, 'discriminant' | 'foo'>;
//=> {discriminant: 'A' | 'B', foo: {bar: string} | {baz: string}}

const pickedUnion: PickedUnion = createPickedUnion();

if (pickedUnion.discriminant === 'A') {
	// We would like to narrow `pickedUnion`'s type
	// to `A` here, but we can't because `Pick`
	// doesn't distribute over unions.

	pickedUnion.foo.bar;
	//=> Error: Property 'bar' does not exist on type '{bar: string} | {baz: string}'.
}
```

@example
```
type A = {
	discriminant: 'A';
	foo: {
		bar: string;
	};
	extraneous: boolean;
};

type B = {
	discriminant: 'B';
	foo: {
		baz: string;
	};
	extraneous: boolean;
};

// Notice that `foo.bar` exists in `A` but not in `B`.

type Union = A | B;

type PickedUnion = DistributedPick<Union, 'discriminant' | 'foo'>;

const pickedUnion: PickedUnion = createPickedUnion();

if (pickedUnion.discriminant === 'A') {
	pickedUnion.foo.bar;
 	//=> OK

	pickedUnion.extraneous;
	//=> Error: Property `extraneous` does not exist on type `Pick<A, 'discriminant' | 'foo'>`.

	pickedUnion.foo.baz;
	//=> Error: `bar` is not a property of `{discriminant: 'A'; a: string}`.
}
```

@category Object
*/
type DistributedPick<ObjectType, KeyType extends KeysOfUnion<ObjectType>> = ObjectType extends unknown ? Pick<ObjectType, Extract<KeyType, keyof ObjectType>> : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/empty-object.d.ts
declare const emptyObjectSymbol: unique symbol;

/**
Represents a strictly empty plain object, the `{}` value.

When you annotate something as the type `{}`, it can be anything except `null` and `undefined`. This means that you cannot use `{}` to represent an empty plain object ([read more](https://stackoverflow.com/questions/47339869/typescript-empty-object-and-any-difference/52193484#52193484)).

@example
```
import type {EmptyObject} from 'type-fest';

// The following illustrates the problem with `{}`.
const foo1: {} = {}; // Pass
const foo2: {} = []; // Pass
const foo3: {} = 42; // Pass
const foo4: {} = {a: 1}; // Pass

// With `EmptyObject` only the first case is valid.
const bar1: EmptyObject = {}; // Pass
const bar2: EmptyObject = 42; // Fail
const bar3: EmptyObject = []; // Fail
const bar4: EmptyObject = {a: 1}; // Fail
```

Unfortunately, `Record<string, never>`, `Record<keyof any, never>` and `Record<never, never>` do not work. See {@link https://github.com/sindresorhus/type-fest/issues/395 #395}.

@category Object
*/
type EmptyObject = {
  [emptyObjectSymbol]?: never;
};
/**
Returns a `boolean` for whether the type is strictly equal to an empty plain object, the `{}` value.

@example
```
import type {IsEmptyObject} from 'type-fest';

type Pass = IsEmptyObject<{}>; //=> true
type Fail = IsEmptyObject<[]>; //=> false
type Fail = IsEmptyObject<null>; //=> false
```

@see EmptyObject
@category Object
*/
type IsEmptyObject<T> = T extends EmptyObject ? true : false;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/if-empty-object.d.ts
/**
An if-else-like type that resolves depending on whether the given type is `{}`.

@see {@link IsEmptyObject}

@example
```
import type {IfEmptyObject} from 'type-fest';

type ShouldBeTrue = IfEmptyObject<{}>;
//=> true

type ShouldBeBar = IfEmptyObject<{key: any}, 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
*/
type IfEmptyObject<T, TypeIfEmptyObject = true, TypeIfNotEmptyObject = false> = IsEmptyObject<T> extends true ? TypeIfEmptyObject : TypeIfNotEmptyObject;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/optional-keys-of.d.ts
/**
Extract all optional keys from the given type.

This is useful when you want to create a new type that contains different type values for the optional keys only.

@example
```
import type {OptionalKeysOf, Except} from 'type-fest';

interface User {
	name: string;
	surname: string;

	luckyNumber?: number;
}

const REMOVE_FIELD = Symbol('remove field symbol');
type UpdateOperation<Entity extends object> = Except<Partial<Entity>, OptionalKeysOf<Entity>> & {
	[Key in OptionalKeysOf<Entity>]?: Entity[Key] | typeof REMOVE_FIELD;
};

const update1: UpdateOperation<User> = {
	name: 'Alice'
};

const update2: UpdateOperation<User> = {
	name: 'Bob',
	luckyNumber: REMOVE_FIELD
};
```

@category Utilities
*/
type OptionalKeysOf<BaseType extends object> = BaseType extends unknown // For distributing `BaseType`
? (keyof { [Key in keyof BaseType as BaseType extends Record<Key, BaseType[Key]> ? never : Key]: never }) & (keyof BaseType) // Intersect with `keyof BaseType` to ensure result of `OptionalKeysOf<BaseType>` is always assignable to `keyof BaseType`
: never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/required-keys-of.d.ts
/**
Extract all required keys from the given type.

This is useful when you want to create a new type that contains different type values for the required keys only or use the list of keys for validation purposes, etc...

@example
```
import type {RequiredKeysOf} from 'type-fest';

declare function createValidation<Entity extends object, Key extends RequiredKeysOf<Entity> = RequiredKeysOf<Entity>>(field: Key, validator: (value: Entity[Key]) => boolean): ValidatorFn;

interface User {
	name: string;
	surname: string;

	luckyNumber?: number;
}

const validator1 = createValidation<User>('name', value => value.length < 25);
const validator2 = createValidation<User>('surname', value => value.length < 25);
```

@category Utilities
*/
type RequiredKeysOf<BaseType extends object> = BaseType extends unknown // For distributing `BaseType`
? Exclude<keyof BaseType, OptionalKeysOf<BaseType>> : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/has-required-keys.d.ts
/**
Creates a type that represents `true` or `false` depending on whether the given type has any required fields.

This is useful when you want to create an API whose behavior depends on the presence or absence of required fields.

@example
```
import type {HasRequiredKeys} from 'type-fest';

type GeneratorOptions<Template extends object> = {
	prop1: number;
	prop2: string;
} & (HasRequiredKeys<Template> extends true
	? {template: Template}
	: {template?: Template});

interface Template1 {
	optionalSubParam?: string;
}

interface Template2 {
	requiredSubParam: string;
}

type Options1 = GeneratorOptions<Template1>;
type Options2 = GeneratorOptions<Template2>;

const optA: Options1 = {
	prop1: 0,
	prop2: 'hi'
};
const optB: Options1 = {
	prop1: 0,
	prop2: 'hi',
	template: {}
};
const optC: Options1 = {
	prop1: 0,
	prop2: 'hi',
	template: {
		optionalSubParam: 'optional value'
	}
};

const optD: Options2 = {
	prop1: 0,
	prop2: 'hi',
	template: {
		requiredSubParam: 'required value'
	}
};

```

@category Utilities
*/
type HasRequiredKeys<BaseType extends object> = RequiredKeysOf<BaseType> extends never ? false : true;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/is-never.d.ts
/**
Returns a boolean for whether the given type is `never`.

@link https://github.com/microsoft/TypeScript/issues/31751#issuecomment-498526919
@link https://stackoverflow.com/a/53984913/10292952
@link https://www.zhenghao.io/posts/ts-never

Useful in type utilities, such as checking if something does not occur.

@example
```
import type {IsNever, And} from 'type-fest';

// https://github.com/andnp/SimplyTyped/blob/master/src/types/strings.ts
type AreStringsEqual<A extends string, B extends string> =
	And<
		IsNever<Exclude<A, B>> extends true ? true : false,
		IsNever<Exclude<B, A>> extends true ? true : false
	>;

type EndIfEqual<I extends string, O extends string> =
	AreStringsEqual<I, O> extends true
		? never
		: void;

function endIfEqual<I extends string, O extends string>(input: I, output: O): EndIfEqual<I, O> {
	if (input === output) {
		process.exit(0);
	}
}

endIfEqual('abc', 'abc');
//=> never

endIfEqual('abc', '123');
//=> void
```

@category Type Guard
@category Utilities
*/
type IsNever<T> = [T] extends [never] ? true : false;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/if-never.d.ts
/**
An if-else-like type that resolves depending on whether the given type is `never`.

@see {@link IsNever}

@example
```
import type {IfNever} from 'type-fest';

type ShouldBeTrue = IfNever<never>;
//=> true

type ShouldBeBar = IfNever<'not never', 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
*/
type IfNever$1<T, TypeIfNever = true, TypeIfNotNever = false> = (IsNever<T> extends true ? TypeIfNever : TypeIfNotNever);
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/unknown-array.d.ts
/**
Represents an array with `unknown` value.

Use case: You want a type that all arrays can be assigned to, but you don't care about the value.

@example
```
import type {UnknownArray} from 'type-fest';

type IsArray<T> = T extends UnknownArray ? true : false;

type A = IsArray<['foo']>;
//=> true

type B = IsArray<readonly number[]>;
//=> true

type C = IsArray<string>;
//=> false
```

@category Type
@category Array
*/
type UnknownArray = readonly unknown[];
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/internal/array.d.ts
/**
Matches any unknown array or tuple.
*/
type UnknownArrayOrTuple = readonly [...unknown[]];
// TODO: should unknown-array be updated?

/**
Extracts the type of the first element of an array or tuple.
*/
type FirstArrayElement<TArray extends UnknownArrayOrTuple> = TArray extends readonly [infer THead, ...unknown[]] ? THead : never;
/**
Extract the element of an array that also works for array union.

Returns `never` if T is not an array.

It creates a type-safe way to access the element type of `unknown` type.
*/
type ArrayElement<T> = T extends readonly unknown[] ? T[0] : never;
/**
Returns the static, fixed-length portion of the given array, excluding variable-length parts.

@example
```
type A = [string, number, boolean, ...string[]];
type B = StaticPartOfArray<A>;
//=> [string, number, boolean]
```
*/
type StaticPartOfArray<T extends UnknownArray, Result extends UnknownArray = []> = T extends unknown ? number extends T['length'] ? T extends readonly [infer U, ...infer V] ? StaticPartOfArray<V, [...Result, U]> : Result : T : never;
// Should never happen

/**
Returns the variable, non-fixed-length portion of the given array, excluding static-length parts.

@example
```
type A = [string, number, boolean, ...string[]];
type B = VariablePartOfArray<A>;
//=> string[]
```
*/
type VariablePartOfArray<T extends UnknownArray> = T extends unknown ? T extends readonly [...StaticPartOfArray<T>, ...infer U] ? U : [] : never;
// Should never happen

/**
Set the given array to readonly if `IsReadonly` is `true`, otherwise set the given array to normal, then return the result.

@example
```
type ReadonlyArray = readonly string[];
type NormalArray = string[];

type ReadonlyResult = SetArrayAccess<NormalArray, true>;
//=> readonly string[]

type NormalResult = SetArrayAccess<ReadonlyArray, false>;
//=> string[]
```
*/
type SetArrayAccess<T extends UnknownArray, IsReadonly extends boolean> = T extends readonly [...infer U] ? IsReadonly extends true ? readonly [...U] : [...U] : T;
/**
Returns whether the given array `T` is readonly.
*/
type IsArrayReadonly<T extends UnknownArray> = IfNever$1<T, false, T extends unknown[] ? false : true>;
/**
An if-else-like type that resolves depending on whether the given array is readonly.

@see {@link IsArrayReadonly}

@example
```
import type {ArrayTail} from 'type-fest';

type ReadonlyPreservingArrayTail<TArray extends readonly unknown[]> =
	ArrayTail<TArray> extends infer Tail
		? IfArrayReadonly<TArray, Readonly<Tail>, Tail>
		: never;

type ReadonlyTail = ReadonlyPreservingArrayTail<readonly [string, number, boolean]>;
//=> readonly [number, boolean]

type NonReadonlyTail = ReadonlyPreservingArrayTail<[string, number, boolean]>;
//=> [number, boolean]

type ShouldBeTrue = IfArrayReadonly<readonly unknown[]>;
//=> true

type ShouldBeBar = IfArrayReadonly<unknown[], 'foo', 'bar'>;
//=> 'bar'
```
*/
type IfArrayReadonly<T extends UnknownArray, TypeIfArrayReadonly = true, TypeIfNotArrayReadonly = false> = IsArrayReadonly<T> extends infer Result ? Result extends true ? TypeIfArrayReadonly : TypeIfNotArrayReadonly : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/internal/characters.d.ts
type StringDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Whitespace = '\u{9}' // '\t'
| '\u{A}' // '\n'
| '\u{B}' // '\v'
| '\u{C}' // '\f'
| '\u{D}' // '\r'
| '\u{20}' // ' '
| '\u{85}' | '\u{A0}' | '\u{1680}' | '\u{2000}' | '\u{2001}' | '\u{2002}' | '\u{2003}' | '\u{2004}' | '\u{2005}' | '\u{2006}' | '\u{2007}' | '\u{2008}' | '\u{2009}' | '\u{200A}' | '\u{2028}' | '\u{2029}' | '\u{202F}' | '\u{205F}' | '\u{3000}' | '\u{FEFF}';
type WordSeparators = '-' | '_' | Whitespace;
type AsciiPunctuation = '!' | '"' | '#' | '$' | '%' | '&' | '\'' | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | ':' | ';' | '<' | '=' | '>' | '?' | '@' | '[' | '\\' | ']' | '^' | '_' | '`' | '{' | '|' | '}' | '~';
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/is-any.d.ts
// Can eventually be replaced with the built-in once this library supports
// TS5.4+ only. Tracked in https://github.com/sindresorhus/type-fest/issues/848
type NoInfer<T> = T extends infer U ? U : never;

/**
Returns a boolean for whether the given type is `any`.

@link https://stackoverflow.com/a/49928360/1490091

Useful in type utilities, such as disallowing `any`s to be passed to a function.

@example
```
import type {IsAny} from 'type-fest';

const typedObject = {a: 1, b: 2} as const;
const anyObject: any = {a: 1, b: 2};

function get<O extends (IsAny<O> extends true ? {} : Record<string, number>), K extends keyof O = keyof O>(obj: O, key: K) {
	return obj[key];
}

const typedA = get(typedObject, 'a');
//=> 1

const anyA = get(anyObject, 'a');
//=> any
```

@category Type Guard
@category Utilities
*/
type IsAny<T> = 0 extends 1 & NoInfer<T> ? true : false;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/is-float.d.ts
/**
Returns a boolean for whether the given number is a float, like `1.5` or `-1.5`.

Use-case:
- If you want to make a conditional branch based on the result of whether a number is a float or not.

@example
```
import type {IsFloat, PositiveInfinity} from "type-fest";

type A = IsFloat<1.5>;
//=> true

type B = IsFloat<-1.5>;
//=> true

type C = IsFloat<1e-7>;
//=> true

type D = IsFloat<1.0>;
//=> false

type E = IsFloat<PositiveInfinity>;
//=> false

type F = IsFloat<1.23e+21>;
//=> false
```

@category Type Guard
@category Numeric
*/
type IsFloat<T> = T extends number ? `${T}` extends `${number}e${infer E extends '-' | '+'}${number}` ? E extends '-' ? true : false : `${T}` extends `${number}.${number}` ? true : false : false;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/is-integer.d.ts
/**
Returns a boolean for whether the given number is an integer, like `-5`, `1.0`, or `100`.

Use-case:
- If you want to make a conditional branch based on the result of whether a number is an integer or not.

@example
```
import type {IsInteger, PositiveInfinity} from "type-fest";

type A = IsInteger<1>;
//=> true

type B = IsInteger<1.0>;
//=> true

type C = IsInteger<-1>;
//=> true

type D = IsInteger<0b10>;
//=> true

type E = IsInteger<0o10>;
//=> true

type F = IsInteger<0x10>;
//=> true

type G = IsInteger<1.23+21>;
//=> true

type H = IsInteger<1.5>;
//=> false

type I = IsInteger<PositiveInfinity>;
//=> false

type J = IsInteger<1e-7>;
//=> false
```

@category Type Guard
@category Numeric
*/
type IsInteger<T> = T extends bigint ? true : T extends number ? number extends T ? false : T extends PositiveInfinity | NegativeInfinity ? false : Not<IsFloat<T>> : false;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/numeric.d.ts
type Numeric = number | bigint;
type Zero = 0 | 0n;
/**
Matches the hidden `Infinity` type.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/32277) if you want to have this type as a built-in in TypeScript.

@see NegativeInfinity

@category Numeric
*/
// See https://github.com/microsoft/TypeScript/issues/31752
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
type PositiveInfinity = 1e999;
/**
Matches the hidden `-Infinity` type.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/32277) if you want to have this type as a built-in in TypeScript.

@see PositiveInfinity

@category Numeric
*/
// See https://github.com/microsoft/TypeScript/issues/31752
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
type NegativeInfinity = -1e999;
/**
A finite `number`.
You can't pass a `bigint` as they are already guaranteed to be finite.

Use-case: Validating and documenting parameters.

Note: This can't detect `NaN`, please upvote [this issue](https://github.com/microsoft/TypeScript/issues/28682) if you want to have this type as a built-in in TypeScript.

@example
```
import type {Finite} from 'type-fest';

declare function setScore<T extends number>(length: Finite<T>): void;
```

@category Numeric
*/
type Finite<T extends number> = T extends PositiveInfinity | NegativeInfinity ? never : T;
/**
A `number` that is an integer.

Use-case: Validating and documenting parameters.

@example
```
type Integer = Integer<1>;
//=> 1

type IntegerWithDecimal = Integer<1.0>;
//=> 1

type NegativeInteger = Integer<-1>;
//=> -1

type Float = Integer<1.5>;
//=> never

// Supports non-decimal numbers

type OctalInteger: Integer<0o10>;
//=> 0o10

type BinaryInteger: Integer<0b10>;
//=> 0b10

type HexadecimalInteger: Integer<0x10>;
//=> 0x10
```

@example
```
import type {Integer} from 'type-fest';

declare function setYear<T extends number>(length: Integer<T>): void;
```

@see NegativeInteger
@see NonNegativeInteger

@category Numeric
*/
// `${bigint}` is a type that matches a valid bigint literal without the `n` (ex. 1, 0b1, 0o1, 0x1)
// Because T is a number and not a string we can effectively use this to filter out any numbers containing decimal points
type Integer<T> = T extends unknown // To distributive type
? IsInteger<T> extends true ? T : never : never;
// Never happens

/**
A `number` that is not an integer.

Use-case: Validating and documenting parameters.

It does not accept `Infinity`.

@example
```
import type {Float} from 'type-fest';

declare function setPercentage<T extends number>(length: Float<T>): void;
```

@see Integer

@category Numeric
*/
type Float<T> = T extends unknown // To distributive type
? IsFloat<T> extends true ? T : never : never;
// Never happens

/**
A negative (`-∞ < x < 0`) `number` that is not an integer.
Equivalent to `Negative<Float<T>>`.

Use-case: Validating and documenting parameters.

@see Negative
@see Float

@category Numeric
*/
type NegativeFloat<T extends number> = Negative<Float<T>>;
/**
A negative `number`/`bigint` (`-∞ < x < 0`)

Use-case: Validating and documenting parameters.

@see NegativeInteger
@see NonNegative

@category Numeric
*/
type Negative<T extends Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never;
/**
A negative (`-∞ < x < 0`) `number` that is an integer.
Equivalent to `Negative<Integer<T>>`.

You can't pass a `bigint` as they are already guaranteed to be integers, instead use `Negative<T>`.

Use-case: Validating and documenting parameters.

@see Negative
@see Integer

@category Numeric
*/
type NegativeInteger<T extends number> = Negative<Integer<T>>;
/**
A non-negative `number`/`bigint` (`0 <= x < ∞`).

Use-case: Validating and documenting parameters.

@see NonNegativeInteger
@see Negative

@example
```
import type {NonNegative} from 'type-fest';

declare function setLength<T extends number>(length: NonNegative<T>): void;
```

@category Numeric
*/
type NonNegative<T extends Numeric> = T extends Zero ? T : Negative<T> extends never ? T : never;
/**
A non-negative (`0 <= x < ∞`) `number` that is an integer.
Equivalent to `NonNegative<Integer<T>>`.

You can't pass a `bigint` as they are already guaranteed to be integers, instead use `NonNegative<T>`.

Use-case: Validating and documenting parameters.

@see NonNegative
@see Integer

@example
```
import type {NonNegativeInteger} from 'type-fest';

declare function setLength<T extends number>(length: NonNegativeInteger<T>): void;
```

@category Numeric
*/
type NonNegativeInteger<T extends number> = NonNegative<Integer<T>>;
/**
Returns a boolean for whether the given number is a negative number.

@see Negative

@example
```
import type {IsNegative} from 'type-fest';

type ShouldBeFalse = IsNegative<1>;
type ShouldBeTrue = IsNegative<-1>;
```

@category Numeric
*/
type IsNegative<T extends Numeric> = T extends Negative<T> ? true : false;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/is-literal.d.ts
/**
Returns a boolean for whether the given type `T` is the specified `LiteralType`.

@link https://stackoverflow.com/a/52806744/10292952

@example
```
LiteralCheck<1, number>
//=> true

LiteralCheck<number, number>
//=> false

LiteralCheck<1, string>
//=> false
```
*/
type LiteralCheck<T, LiteralType extends Primitive> = (IsNever<T> extends false // Must be wider than `never`
? [T] extends [LiteralType & infer U] // Remove any branding
? [U] extends [LiteralType] // Must be narrower than `LiteralType`
? [LiteralType] extends [U] // Cannot be wider than `LiteralType`
? false : true : false : false : false);

/**
Returns a boolean for whether the given type `T` is one of the specified literal types in `LiteralUnionType`.

@example
```
LiteralChecks<1, Numeric>
//=> true

LiteralChecks<1n, Numeric>
//=> true

LiteralChecks<bigint, Numeric>
//=> false
```
*/
type LiteralChecks<T, LiteralUnionType> = (
// Conditional type to force union distribution.
// If `T` is none of the literal types in the union `LiteralUnionType`, then `LiteralCheck<T, LiteralType>` will evaluate to `false` for the whole union.
// If `T` is one of the literal types in the union, it will evaluate to `boolean` (i.e. `true | false`)
IsNotFalse<LiteralUnionType extends Primitive ? LiteralCheck<T, LiteralUnionType> : never>);

/**
Returns a boolean for whether the given type is a `string` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed string manipulation functions
	- constraining strings to be a string literal
	- type utilities, such as when constructing parsers and ASTs

The implementation of this type is inspired by the trick mentioned in this [StackOverflow answer](https://stackoverflow.com/a/68261113/420747).

@example
```
import type {IsStringLiteral} from 'type-fest';

type CapitalizedString<T extends string> = IsStringLiteral<T> extends true ? Capitalize<T> : string;

// https://github.com/yankeeinlondon/native-dash/blob/master/src/capitalize.ts
function capitalize<T extends Readonly<string>>(input: T): CapitalizedString<T> {
	return (input.slice(0, 1).toUpperCase() + input.slice(1)) as CapitalizedString<T>;
}

const output = capitalize('hello, world!');
//=> 'Hello, world!'
```

@example
```
// String types with infinite set of possible values return `false`.

import type {IsStringLiteral} from 'type-fest';

type AllUppercaseStrings = IsStringLiteral<Uppercase<string>>;
//=> false

type StringsStartingWithOn = IsStringLiteral<`on${string}`>;
//=> false

// This behaviour is particularly useful in string manipulation utilities, as infinite string types often require separate handling.

type Length<S extends string, Counter extends never[] = []> =
	IsStringLiteral<S> extends false
		? number // return `number` for infinite string types
		: S extends `${string}${infer Tail}`
			? Length<Tail, [...Counter, never]>
			: Counter['length'];

type L1 = Length<Lowercase<string>>;
//=> number

type L2 = Length<`${number}`>;
//=> number
```

@category Type Guard
@category Utilities
*/
type IsStringLiteral<T> = IfNever$1<T, false,
// If `T` is an infinite string type (e.g., `on${string}`), `Record<T, never>` produces an index signature,
// and since `{}` extends index signatures, the result becomes `false`.
T extends string ? {} extends Record<T, never> ? false : true : false>;
/**
Returns a boolean for whether the given type is a `number` or `bigint` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsNumericLiteral} from 'type-fest';

// https://github.com/inocan-group/inferred-types/blob/master/src/types/boolean-logic/EndsWith.ts
type EndsWith<TValue, TEndsWith extends string> =
	TValue extends string
		? IsStringLiteral<TEndsWith> extends true
			? IsStringLiteral<TValue> extends true
				? TValue extends `${string}${TEndsWith}`
					? true
					: false
				: boolean
			: boolean
		: TValue extends number
			? IsNumericLiteral<TValue> extends true
				? EndsWith<`${TValue}`, TEndsWith>
				: false
			: false;

function endsWith<Input extends string | number, End extends string>(input: Input, end: End) {
	return `${input}`.endsWith(end) as EndsWith<Input, End>;
}

endsWith('abc', 'c');
//=> true

endsWith(123456, '456');
//=> true

const end = '123' as string;

endsWith('abc123', end);
//=> boolean
```

@category Type Guard
@category Utilities
*/
type IsNumericLiteral<T> = LiteralChecks<T, Numeric>;
/**
Returns a boolean for whether the given type is a `true` or `false` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsBooleanLiteral} from 'type-fest';

const id = 123;

type GetId<AsString extends boolean> =
	IsBooleanLiteral<AsString> extends true
		? AsString extends true
			? `${typeof id}`
			: typeof id
		: number | string;

function getId<AsString extends boolean = false>(options?: {asString: AsString}) {
	return (options?.asString ? `${id}` : id) as GetId<AsString>;
}

const numberId = getId();
//=> 123

const stringId = getId({asString: true});
//=> '123'

declare const runtimeBoolean: boolean;
const eitherId = getId({asString: runtimeBoolean});
//=> number | string
```

@category Type Guard
@category Utilities
*/
type IsBooleanLiteral<T> = LiteralCheck<T, boolean>;
/**
Returns a boolean for whether the given type is a `symbol` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsSymbolLiteral} from 'type-fest';

type Get<Obj extends Record<symbol, number>, Key extends keyof Obj> =
	IsSymbolLiteral<Key> extends true
		? Obj[Key]
		: number;

function get<Obj extends Record<symbol, number>, Key extends keyof Obj>(o: Obj, key: Key) {
	return o[key] as Get<Obj, Key>;
}

const symbolLiteral = Symbol('literal');
const symbolValue: symbol = Symbol('value');

get({[symbolLiteral]: 1} as const, symbolLiteral);
//=> 1

get({[symbolValue]: 1} as const, symbolValue);
//=> number
```

@category Type Guard
@category Utilities
*/
type IsSymbolLiteral<T> = LiteralCheck<T, symbol>;
/** Helper type for `IsLiteral`. */
type IsLiteralUnion<T> = IsStringLiteral<T> | IsNumericLiteral<T> | IsBooleanLiteral<T> | IsSymbolLiteral<T>;

/**
Returns a boolean for whether the given type is a [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsLiteral} from 'type-fest';

// https://github.com/inocan-group/inferred-types/blob/master/src/types/string-literals/StripLeading.ts
export type StripLeading<A, B> =
	A extends string
		? B extends string
			? IsLiteral<A> extends true
				? string extends B ? never : A extends `${B & string}${infer After}` ? After : A
				: string
			: A
		: A;

function stripLeading<Input extends string, Strip extends string>(input: Input, strip: Strip) {
	return input.replace(`^${strip}`, '') as StripLeading<Input, Strip>;
}

stripLeading('abc123', 'abc');
//=> '123'

const str = 'abc123' as string;

stripLeading(str, 'abc');
//=> string
```

@category Type Guard
@category Utilities
*/
type IsLiteral<T> = IsPrimitive<T> extends true ? IsNotFalse<IsLiteralUnion<T>> : false;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/trim.d.ts
/**
Remove spaces from the left side.
*/
type TrimLeft<V extends string> = V extends `${Whitespace}${infer R}` ? TrimLeft<R> : V;

/**
Remove spaces from the right side.
*/
type TrimRight<V extends string> = V extends `${infer R}${Whitespace}` ? TrimRight<R> : V;

/**
Remove leading and trailing spaces from a string.

@example
```
import type {Trim} from 'type-fest';

Trim<' foo '>
//=> 'foo'
```

@category String
@category Template literal
*/
type Trim<V extends string> = TrimLeft<TrimRight<V>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/is-equal.d.ts
/**
Returns a boolean for whether the two given types are equal.

@link https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
@link https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796

Use-cases:
- If you want to make a conditional branch based on the result of a comparison of two types.

@example
```
import type {IsEqual} from 'type-fest';

// This type returns a boolean for whether the given array includes the given item.
// `IsEqual` is used to compare the given array at position 0 and the given item and then return true if they are equal.
type Includes<Value extends readonly any[], Item> =
	Value extends readonly [Value[0], ...infer rest]
		? IsEqual<Value[0], Item> extends true
			? true
			: Includes<rest, Item>
		: false;
```

@category Type Guard
@category Utilities
*/
type IsEqual<A, B> = (<G>() => G extends A & G | G ? 1 : 2) extends (<G>() => G extends B & G | G ? 1 : 2) ? true : false;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/and.d.ts
/**
Returns a boolean for whether two given types are both true.

Use-case: Constructing complex conditional types where multiple conditions must be satisfied.

@example
```
import type {And} from 'type-fest';

And<true, true>;
//=> true

And<true, false>;
//=> false
```

@see {@link Or}
*/
type And<A extends boolean, B extends boolean> = [A, B][number] extends true ? true : true extends [IsEqual<A, false>, IsEqual<B, false>][number] ? false : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/or.d.ts
/**
Returns a boolean for whether either of two given types are true.

Use-case: Constructing complex conditional types where multiple conditions must be satisfied.

@example
```
import type {Or} from 'type-fest';

Or<true, false>;
//=> true

Or<false, false>;
//=> false
```

@see {@link And}
*/
type Or<A extends boolean, B extends boolean> = [A, B][number] extends false ? false : true extends [IsEqual<A, true>, IsEqual<B, true>][number] ? true : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/greater-than.d.ts
/**
Returns a boolean for whether a given number is greater than another number.

@example
```
import type {GreaterThan} from 'type-fest';

GreaterThan<1, -5>;
//=> true

GreaterThan<1, 1>;
//=> false

GreaterThan<1, 5>;
//=> false
```
*/
type GreaterThan<A extends number, B extends number> = A extends number // For distributing `A`
? B extends number // For distributing `B`
? number extends A | B ? never : [IsEqual<A, PositiveInfinity>, IsEqual<A, NegativeInfinity>, IsEqual<B, PositiveInfinity>, IsEqual<B, NegativeInfinity>] extends infer R extends [boolean, boolean, boolean, boolean] ? Or<And<IsEqual<R[0], true>, IsEqual<R[2], false>>, And<IsEqual<R[3], true>, IsEqual<R[1], false>>> extends true ? true : Or<And<IsEqual<R[1], true>, IsEqual<R[3], false>>, And<IsEqual<R[2], true>, IsEqual<R[0], false>>> extends true ? false : true extends R[number] ? false : [IsNegative<A>, IsNegative<B>] extends infer R extends [boolean, boolean] ? [true, false] extends R ? false : [false, true] extends R ? true : [false, false] extends R ? PositiveNumericStringGt<`${A}`, `${B}`> : PositiveNumericStringGt<`${NumberAbsolute<B>}`, `${NumberAbsolute<A>}`> : never : never : never // Should never happen
: never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/greater-than-or-equal.d.ts
/**
Returns a boolean for whether a given number is greater than or equal to another number.

@example
```
import type {GreaterThanOrEqual} from 'type-fest';

GreaterThanOrEqual<1, -5>;
//=> true

GreaterThanOrEqual<1, 1>;
//=> true

GreaterThanOrEqual<1, 5>;
//=> false
```
*/
type GreaterThanOrEqual<A extends number, B extends number> = number extends A | B ? never : A extends B ? true : GreaterThan<A, B>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/less-than.d.ts
/**
Returns a boolean for whether a given number is less than another number.

@example
```
import type {LessThan} from 'type-fest';

LessThan<1, -5>;
//=> false

LessThan<1, 1>;
//=> false

LessThan<1, 5>;
//=> true
```
*/
type LessThan<A extends number, B extends number> = number extends A | B ? never : GreaterThanOrEqual<A, B> extends infer Result ? Result extends true ? false : true : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/internal/tuple.d.ts
/**
Infer the length of the given tuple `<T>`.

Returns `never` if the given type is an non-fixed-length array like `Array<string>`.

@example
```
type Tuple = TupleLength<[string, number, boolean]>;
//=> 3

type Array = TupleLength<string[]>;
//=> never

// Supports union types.
type Union = TupleLength<[] | [1, 2, 3] | Array<number>>;
//=> 1 | 3
```
*/
type TupleLength<T extends UnknownArray> =
// `extends unknown` is used to convert `T` (if `T` is a union type) to
// a [distributive conditionaltype](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types))
T extends unknown ? number extends T['length'] ? never // Return never if the given type is an non-flexed-length array like `Array<string>`
: T['length'] : never;
// Should never happen

/**
Create a tuple type of the given length `<L>` and fill it with the given type `<Fill>`.

If `<Fill>` is not provided, it will default to `unknown`.

@link https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
*/
type BuildTuple<L extends number, Fill = unknown, T extends readonly unknown[] = []> = number extends L ? Fill[] : L extends T['length'] ? T : BuildTuple<L, Fill, [...T, Fill]>;
/**
Returns the maximum value from a tuple of integers.

Note:
- Float numbers are not supported.

@example
```
ArrayMax<[1, 2, 5, 3]>;
//=> 5

ArrayMax<[1, 2, 5, 3, 99, -1]>;
//=> 99
```
*/
type TupleMax<A extends number[], Result extends number = NegativeInfinity> = number extends A[number] ? never : A extends [infer F extends number, ...infer R extends number[]] ? GreaterThan<F, Result> extends true ? TupleMax<R, F> : TupleMax<R, Result> : Result;
/**
Returns the minimum value from a tuple of integers.

Note:
- Float numbers are not supported.

@example
```
ArrayMin<[1, 2, 5, 3]>;
//=> 1

ArrayMin<[1, 2, 5, 3, -5]>;
//=> -5
```
*/
type TupleMin<A extends number[], Result extends number = PositiveInfinity> = number extends A[number] ? never : A extends [infer F extends number, ...infer R extends number[]] ? LessThan<F, Result> extends true ? TupleMin<R, F> : TupleMin<R, Result> : Result;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/internal/string.d.ts
/**
Return a string representation of the given string or number.

Note: This type is not the return type of the `.toString()` function.
*/
type ToString<T> = T extends string | number ? `${T}` : never;
/**
Converts a numeric string to a number.

@example
```
type PositiveInt = StringToNumber<'1234'>;
//=> 1234

type NegativeInt = StringToNumber<'-1234'>;
//=> -1234

type PositiveFloat = StringToNumber<'1234.56'>;
//=> 1234.56

type NegativeFloat = StringToNumber<'-1234.56'>;
//=> -1234.56

type PositiveInfinity = StringToNumber<'Infinity'>;
//=> Infinity

type NegativeInfinity = StringToNumber<'-Infinity'>;
//=> -Infinity
```

@category String
@category Numeric
@category Template literal
*/
type StringToNumber<S extends string> = S extends `${infer N extends number}` ? N : S extends 'Infinity' ? PositiveInfinity : S extends '-Infinity' ? NegativeInfinity : never;
/**
Returns a boolean for whether the given string `S` starts with the given string `SearchString`.

@example
```
StartsWith<'abcde', 'abc'>;
//=> true

StartsWith<'abcde', 'bc'>;
//=> false

StartsWith<string, 'bc'>;
//=> never

StartsWith<'abcde', string>;
//=> never
```

@category String
@category Template literal
*/
type StartsWith<S extends string, SearchString extends string> = string extends S | SearchString ? never : S extends `${SearchString}${infer T}` ? true : false;
/**
Returns an array of the characters of the string.

@example
```
StringToArray<'abcde'>;
//=> ['a', 'b', 'c', 'd', 'e']

StringToArray<string>;
//=> never
```

@category String
*/
type StringToArray<S extends string, Result extends string[] = []> = string extends S ? never : S extends `${infer F}${infer R}` ? StringToArray<R, [...Result, F]> : Result;
/**
Returns the length of the given string.

@example
```
StringLength<'abcde'>;
//=> 5

StringLength<string>;
//=> never
```

@category String
@category Template literal
*/
type StringLength<S extends string> = string extends S ? never : StringToArray<S>['length'];
/**
Returns a boolean for whether the string is lowercased.
*/
type IsLowerCase<T extends string> = T extends Lowercase<T> ? true : false;
/**
Returns a boolean for whether the string is uppercased.
*/
type IsUpperCase<T extends string> = T extends Uppercase<T> ? true : false;
/**
Returns a boolean for whether the string is numeric.

This type is a workaround for [Microsoft/TypeScript#46109](https://github.com/microsoft/TypeScript/issues/46109#issuecomment-930307987).
*/
type IsNumeric<T extends string> = T extends `${number}` ? Trim<T> extends T ? true : false : false;
/**
Returns a boolean for whether `A` represents a number greater than `B`, where `A` and `B` are both numeric strings and have the same length.

@example
```
SameLengthPositiveNumericStringGt<'50', '10'>;
//=> true

SameLengthPositiveNumericStringGt<'10', '10'>;
//=> false
```
*/
type SameLengthPositiveNumericStringGt<A extends string, B extends string> = A extends `${infer FirstA}${infer RestA}` ? B extends `${infer FirstB}${infer RestB}` ? FirstA extends FirstB ? SameLengthPositiveNumericStringGt<RestA, RestB> : PositiveNumericCharacterGt<FirstA, FirstB> : never : false;
type NumericString = '0123456789';

/**
Returns a boolean for whether `A` is greater than `B`, where `A` and `B` are both positive numeric strings.

@example
```
PositiveNumericStringGt<'500', '1'>;
//=> true

PositiveNumericStringGt<'1', '1'>;
//=> false

PositiveNumericStringGt<'1', '500'>;
//=> false
```
*/
type PositiveNumericStringGt<A extends string, B extends string> = A extends B ? false : [BuildTuple<StringLength<A>, 0>, BuildTuple<StringLength<B>, 0>] extends infer R extends [readonly unknown[], readonly unknown[]] ? R[0] extends [...R[1], ...infer Remain extends readonly unknown[]] ? 0 extends Remain['length'] ? SameLengthPositiveNumericStringGt<A, B> : true : false : never;
/**
Returns a boolean for whether `A` represents a number greater than `B`, where `A` and `B` are both positive numeric characters.

@example
```
PositiveNumericCharacterGt<'5', '1'>;
//=> true

PositiveNumericCharacterGt<'1', '1'>;
//=> false
```
*/
type PositiveNumericCharacterGt<A extends string, B extends string> = NumericString extends `${infer HeadA}${A}${infer TailA}` ? NumericString extends `${infer HeadB}${B}${infer TailB}` ? HeadA extends `${HeadB}${infer _}${infer __}` ? true : false : never : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/internal/keys.d.ts
// Returns `never` if the key or property is not jsonable without testing whether the property is required or optional otherwise return the key.
type BaseKeyFilter<Type, Key extends keyof Type> = Key extends symbol ? never : Type[Key] extends symbol ? never
/*
To prevent a problem where an object with only a `name` property is incorrectly treated as assignable to a function, we first check if the property is a record.
This check is necessary, because without it, if we don't verify whether the property is a record, an object with a type of `{name: any}` would return `never` due to its potential assignability to a function.
See: https://github.com/sindresorhus/type-fest/issues/657
*/ : Type[Key] extends Record<string, unknown> ? Key : [(...arguments_: any[]) => any] extends [Type[Key]] ? never : Key;

/**
Returns the required keys.
*/
type FilterDefinedKeys<T extends object> = Exclude<{ [Key in keyof T]: IsAny<T[Key]> extends true ? Key : undefined extends T[Key] ? never : T[Key] extends undefined ? never : BaseKeyFilter<T, Key> }[keyof T], undefined>;
/**
Returns the optional keys.
*/
type FilterOptionalKeys<T extends object> = Exclude<{ [Key in keyof T]: IsAny<T[Key]> extends true ? never : undefined extends T[Key] ? T[Key] extends undefined ? never : BaseKeyFilter<T, Key> : never }[keyof T], undefined>;
/**
Disallows any of the given keys.
*/
type RequireNone<KeysType extends PropertyKey> = Partial<Record<KeysType, never>>;
/**
Utility type to retrieve only literal keys from type.
*/
type LiteralKeyOf<T> = keyof { [K in keyof T as IsLiteral<K> extends true ? K : never]-?: never };
/**
Get the exact version of the given `Key` in the given object `T`.

Use-case: You known that a number key (e.g. 10) is in an object, but you don't know how it is defined in the object, as a string or as a number (e.g. 10 or '10'). You can use this type to get the exact version of the key. See the example.

@example
```
type Object = {
	0: number;
	'1': string;
};

type Key1 = ExactKey<Object, '0'>;
//=> 0
type Key2 = ExactKey<Object, 0>;
//=> 0

type Key3 = ExactKey<Object, '1'>;
//=> '1'
type Key4 = ExactKey<Object, 1>;
//=> '1'
```

@category Object
*/
type ExactKey<T extends object, Key extends PropertyKey> = Key extends keyof T ? Key : ToString<Key> extends keyof T ? ToString<Key> : Key extends `${infer NumberKey extends number}` ? NumberKey extends keyof T ? NumberKey : never : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/internal/numeric.d.ts
/**
Returns the absolute value of a given value.

@example
```
NumberAbsolute<-1>;
//=> 1

NumberAbsolute<1>;
//=> 1

NumberAbsolute<NegativeInfinity>
//=> PositiveInfinity
```
*/
type NumberAbsolute<N extends number> = `${N}` extends `-${infer StringPositiveN}` ? StringToNumber<StringPositiveN> : N;
/**
Check whether the given type is a number or a number string.

Supports floating-point as a string.

@example
```
type A = IsNumberLike<'1'>;
//=> true

type B = IsNumberLike<'-1.1'>;
//=> true

type C = IsNumberLike<1>;
//=> true

type D = IsNumberLike<'a'>;
//=> false
*/
type IsNumberLike<N> = N extends number ? true : N extends `${number}` ? true : N extends `${number}.${number}` ? true : false;
/**
Returns the minimum number in the given union of numbers.

Note: Just supports numbers from 0 to 999.

@example
```
type A = UnionMin<3 | 1 | 2>;
//=> 1
```
*/
type UnionMin<N extends number> = InternalUnionMin<N>;
/**
The actual implementation of `UnionMin`. It's private because it has some arguments that don't need to be exposed.
*/
type InternalUnionMin<N extends number, T extends UnknownArray = []> = T['length'] extends N ? T['length'] : InternalUnionMin<N, [...T, unknown]>;

/**
Returns the maximum number in the given union of numbers.

Note: Just supports numbers from 0 to 999.

@example
```
type A = UnionMax<1 | 3 | 2>;
//=> 3
```
*/
type UnionMax<N extends number> = InternalUnionMax<N>;
/**
The actual implementation of `UnionMax`. It's private because it has some arguments that don't need to be exposed.
*/
type InternalUnionMax<N extends number, T extends UnknownArray = []> = IsNever<N> extends true ? T['length'] : T['length'] extends N ? InternalUnionMax<Exclude<N, T['length']>, T> : InternalUnionMax<N, [...T, unknown]>;

/**
Returns the number with reversed sign.

@example
```
ReverseSign<-1>;
//=> 1

ReverseSign<1>;
//=> -1

ReverseSign<NegativeInfinity>
//=> PositiveInfinity

ReverseSign<PositiveInfinity>
//=> NegativeInfinity
```
*/
type ReverseSign<N extends number> =
// Handle edge cases
N extends 0 ? 0 : N extends PositiveInfinity ? NegativeInfinity : N extends NegativeInfinity ? PositiveInfinity :
// Handle negative numbers
`${N}` extends `-${infer P extends number}` ? P
// Handle positive numbers
: `-${N}` extends `${infer R extends number}` ? R : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/simplify.d.ts
/**
Useful to flatten the type output to improve type hints shown in editors. And also to transform an interface into a type to aide with assignability.

@example
```
import type {Simplify} from 'type-fest';

type PositionProps = {
	top: number;
	left: number;
};

type SizeProps = {
	width: number;
	height: number;
};

// In your editor, hovering over `Props` will show a flattened object with all the properties.
type Props = Simplify<PositionProps & SizeProps>;
```

Sometimes it is desired to pass a value as a function argument that has a different type. At first inspection it may seem assignable, and then you discover it is not because the `value`'s type definition was defined as an interface. In the following example, `fn` requires an argument of type `Record<string, unknown>`. If the value is defined as a literal, then it is assignable. And if the `value` is defined as type using the `Simplify` utility the value is assignable.  But if the `value` is defined as an interface, it is not assignable because the interface is not sealed and elsewhere a non-string property could be added to the interface.

If the type definition must be an interface (perhaps it was defined in a third-party npm package), then the `value` can be defined as `const value: Simplify<SomeInterface> = ...`. Then `value` will be assignable to the `fn` argument.  Or the `value` can be cast as `Simplify<SomeInterface>` if you can't re-declare the `value`.

@example
```
import type {Simplify} from 'type-fest';

interface SomeInterface {
	foo: number;
	bar?: string;
	baz: number | undefined;
}

type SomeType = {
	foo: number;
	bar?: string;
	baz: number | undefined;
};

const literal = {foo: 123, bar: 'hello', baz: 456};
const someType: SomeType = literal;
const someInterface: SomeInterface = literal;

function fn(object: Record<string, unknown>): void {}

fn(literal); // Good: literal object type is sealed
fn(someType); // Good: type is sealed
fn(someInterface); // Error: Index signature for type 'string' is missing in type 'someInterface'. Because `interface` can be re-opened
fn(someInterface as Simplify<SomeInterface>); // Good: transform an `interface` into a `type`
```

@link https://github.com/microsoft/TypeScript/issues/15300
@see SimplifyDeep
@category Object
*/
type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/omit-index-signature.d.ts
/**
Omit any index signatures from the given object type, leaving only explicitly defined properties.

This is the counterpart of `PickIndexSignature`.

Use-cases:
- Remove overly permissive signatures from third-party types.

This type was taken from this [StackOverflow answer](https://stackoverflow.com/a/68261113/420747).

It relies on the fact that an empty object (`{}`) is assignable to an object with just an index signature, like `Record<string, unknown>`, but not to an object with explicitly defined keys, like `Record<'foo' | 'bar', unknown>`.

(The actual value type, `unknown`, is irrelevant and could be any type. Only the key type matters.)

```
const indexed: Record<string, unknown> = {}; // Allowed

const keyed: Record<'foo', unknown> = {}; // Error
// => TS2739: Type '{}' is missing the following properties from type 'Record<"foo" | "bar", unknown>': foo, bar
```

Instead of causing a type error like the above, you can also use a [conditional type](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) to test whether a type is assignable to another:

```
type Indexed = {} extends Record<string, unknown>
	? '✅ `{}` is assignable to `Record<string, unknown>`'
	: '❌ `{}` is NOT assignable to `Record<string, unknown>`';
// => '✅ `{}` is assignable to `Record<string, unknown>`'

type Keyed = {} extends Record<'foo' | 'bar', unknown>
	? "✅ `{}` is assignable to `Record<'foo' | 'bar', unknown>`"
	: "❌ `{}` is NOT assignable to `Record<'foo' | 'bar', unknown>`";
// => "❌ `{}` is NOT assignable to `Record<'foo' | 'bar', unknown>`"
```

Using a [mapped type](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#further-exploration), you can then check for each `KeyType` of `ObjectType`...

```
import type {OmitIndexSignature} from 'type-fest';

type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType // Map each key of `ObjectType`...
	]: ObjectType[KeyType]; // ...to its original value, i.e. `OmitIndexSignature<Foo> == Foo`.
};
```

...whether an empty object (`{}`) would be assignable to an object with that `KeyType` (`Record<KeyType, unknown>`)...

```
import type {OmitIndexSignature} from 'type-fest';

type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType
		// Is `{}` assignable to `Record<KeyType, unknown>`?
		as {} extends Record<KeyType, unknown>
			? ... // ✅ `{}` is assignable to `Record<KeyType, unknown>`
			: ... // ❌ `{}` is NOT assignable to `Record<KeyType, unknown>`
	]: ObjectType[KeyType];
};
```

If `{}` is assignable, it means that `KeyType` is an index signature and we want to remove it. If it is not assignable, `KeyType` is a "real" key and we want to keep it.

@example
```
import type {OmitIndexSignature} from 'type-fest';

interface Example {
	// These index signatures will be removed.
	[x: string]: any
	[x: number]: any
	[x: symbol]: any
	[x: `head-${string}`]: string
	[x: `${string}-tail`]: string
	[x: `head-${string}-tail`]: string
	[x: `${bigint}`]: string
	[x: `embedded-${number}`]: string

	// These explicitly defined keys will remain.
	foo: 'bar';
	qux?: 'baz';
}

type ExampleWithoutIndexSignatures = OmitIndexSignature<Example>;
// => { foo: 'bar'; qux?: 'baz' | undefined; }
```

@see PickIndexSignature
@category Object
*/
type OmitIndexSignature<ObjectType> = { [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown> ? never : KeyType]: ObjectType[KeyType] };
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/pick-index-signature.d.ts
/**
Pick only index signatures from the given object type, leaving out all explicitly defined properties.

This is the counterpart of `OmitIndexSignature`.

@example
```
import type {PickIndexSignature} from 'type-fest';

declare const symbolKey: unique symbol;

type Example = {
	// These index signatures will remain.
	[x: string]: unknown;
	[x: number]: unknown;
	[x: symbol]: unknown;
	[x: `head-${string}`]: string;
	[x: `${string}-tail`]: string;
	[x: `head-${string}-tail`]: string;
	[x: `${bigint}`]: string;
	[x: `embedded-${number}`]: string;

	// These explicitly defined keys will be removed.
	['kebab-case-key']: string;
	[symbolKey]: string;
	foo: 'bar';
	qux?: 'baz';
};

type ExampleIndexSignature = PickIndexSignature<Example>;
// {
// 	[x: string]: unknown;
// 	[x: number]: unknown;
// 	[x: symbol]: unknown;
// 	[x: `head-${string}`]: string;
// 	[x: `${string}-tail`]: string;
// 	[x: `head-${string}-tail`]: string;
// 	[x: `${bigint}`]: string;
// 	[x: `embedded-${number}`]: string;
// }
```

@see OmitIndexSignature
@category Object
*/
type PickIndexSignature<ObjectType> = { [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown> ? KeyType : never]: ObjectType[KeyType] };
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/merge.d.ts
// Merges two objects without worrying about index signatures.
type SimpleMerge<Destination, Source> = { [Key in keyof Destination as Key extends keyof Source ? never : Key]: Destination[Key] } & Source;

/**
Merge two types into a new type. Keys of the second type overrides keys of the first type.

@example
```
import type {Merge} from 'type-fest';

interface Foo {
	[x: string]: unknown;
	[x: number]: unknown;
	foo: string;
	bar: symbol;
}

type Bar = {
	[x: number]: number;
	[x: symbol]: unknown;
	bar: Date;
	baz: boolean;
};

export type FooBar = Merge<Foo, Bar>;
// => {
// 	[x: string]: unknown;
// 	[x: number]: number;
// 	[x: symbol]: unknown;
// 	foo: string;
// 	bar: Date;
// 	baz: boolean;
// }
```

@category Object
*/
type Merge<Destination, Source> = Simplify<SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>> & SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/if-any.d.ts
/**
An if-else-like type that resolves depending on whether the given type is `any`.

@see {@link IsAny}

@example
```
import type {IfAny} from 'type-fest';

type ShouldBeTrue = IfAny<any>;
//=> true

type ShouldBeBar = IfAny<'not any', 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
*/
type IfAny$1<T, TypeIfAny = true, TypeIfNotAny = false> = (IsAny<T> extends true ? TypeIfAny : TypeIfNotAny);
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/internal/type.d.ts
/**
Matches any primitive, `void`, `Date`, or `RegExp` value.
*/
type BuiltIns = Primitive | void | Date | RegExp;
/**
Matches non-recursive types.
*/
type NonRecursiveType = BuiltIns | Function | (new (...arguments_: any[]) => unknown);
/**
Returns a boolean for whether the two given types extends the base type.
*/
type IsBothExtends<BaseType, FirstType, SecondType> = FirstType extends BaseType ? SecondType extends BaseType ? true : false : false;
/**
Test if the given function has multiple call signatures.

Needed to handle the case of a single call signature with properties.

Multiple call signatures cannot currently be supported due to a TypeScript limitation.
@see https://github.com/microsoft/TypeScript/issues/29732
*/
type HasMultipleCallSignatures<T extends (...arguments_: any[]) => unknown> = T extends {
  (...arguments_: infer A): unknown;
  (...arguments_: infer B): unknown;
} ? B extends A ? A extends B ? false : true : true : false;
/**
Returns a boolean for whether the given `boolean` is not `false`.
*/
type IsNotFalse<T extends boolean> = [T] extends [false] ? false : true;
/**
Returns a boolean for whether the given type is primitive value or primitive type.

@example
```
IsPrimitive<'string'>
//=> true

IsPrimitive<string>
//=> true

IsPrimitive<Object>
//=> false
```
*/
type IsPrimitive<T> = [T] extends [Primitive] ? true : false;
/**
Returns a boolean for whether A is false.

@example
```
Not<true>;
//=> false

Not<false>;
//=> true
```
*/
type Not<A extends boolean> = A extends true ? false : A extends false ? true : never;
/**
Returns a boolean for whether the given type is a union type.

@example
```
type A = IsUnion<string | number>;
//=> true

type B = IsUnion<string>;
//=> false
```
*/
type IsUnion<T> = InternalIsUnion<T>;
/**
The actual implementation of `IsUnion`.
*/
type InternalIsUnion<T, U = T> = (
// @link https://ghaiklor.github.io/type-challenges-solutions/en/medium-isunion.html
IsNever<T> extends true ? false : T extends any ? [U] extends [T] ? false : true : never) extends infer Result
// In some cases `Result` will return `false | true` which is `boolean`,
// that means `T` has at least two types and it's a union type,
// so we will return `true` instead of `boolean`.
? boolean extends Result ? true : Result : never; // Should never happen

/**
An if-else-like type that resolves depending on whether the given type is `any` or `never`.

@example
```
// When `T` is a NOT `any` or `never` (like `string`) => Returns `IfNotAnyOrNever` branch
type A = IfNotAnyOrNever<string, 'VALID', 'IS_ANY', 'IS_NEVER'>;
//=> 'VALID'

// When `T` is `any` => Returns `IfAny` branch
type B = IfNotAnyOrNever<any, 'VALID', 'IS_ANY', 'IS_NEVER'>;
//=> 'IS_ANY'

// When `T` is `never` => Returns `IfNever` branch
type C = IfNotAnyOrNever<never, 'VALID', 'IS_ANY', 'IS_NEVER'>;
//=> 'IS_NEVER'
```
*/
type IfNotAnyOrNever<T, IfNotAnyOrNever, IfAny = any, IfNever = never> = IsAny<T> extends true ? IfAny : IsNever<T> extends true ? IfNever : IfNotAnyOrNever;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/internal/object.d.ts
/**
Create an object type with the given key `<Key>` and value `<Value>`.

It will copy the prefix and optional status of the same key from the given object `CopiedFrom` into the result.

@example
```
type A = BuildObject<'a', string>;
//=> {a: string}

// Copy `readonly` and `?` from the key `a` of `{readonly a?: any}`
type B = BuildObject<'a', string, {readonly a?: any}>;
//=> {readonly a?: string}
```
*/
type BuildObject<Key extends PropertyKey, Value, CopiedFrom extends object = {}> = Key extends keyof CopiedFrom ? Pick<{ [_ in keyof CopiedFrom]: Value }, Key> : Key extends `${infer NumberKey extends number}` ? NumberKey extends keyof CopiedFrom ? Pick<{ [_ in keyof CopiedFrom]: Value }, NumberKey> : { [_ in Key]: Value } : { [_ in Key]: Value };
/**
Returns a boolean for whether the given type is a plain key-value object.
*/
type IsPlainObject<T> = T extends NonRecursiveType | UnknownArray | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> ? false : T extends object ? true : false;
/**
Extract the object field type if T is an object and K is a key of T, return `never` otherwise.

It creates a type-safe way to access the member type of `unknown` type.
*/
type ObjectValue<T, K> = K extends keyof T ? T[K] : ToString<K> extends keyof T ? T[ToString<K>] : K extends `${infer NumberK extends number}` ? NumberK extends keyof T ? T[NumberK] : never : never;
/**
For an object T, if it has any properties that are a union with `undefined`, make those into optional properties instead.

@example
```
type User = {
	firstName: string;
	lastName: string | undefined;
};

type OptionalizedUser = UndefinedToOptional<User>;
//=> {
// 	firstName: string;
// 	lastName?: string;
// }
```
*/
type UndefinedToOptional<T extends object> = Simplify<{
  // Property is not a union with `undefined`, keep it as-is.
[Key in keyof Pick<T, FilterDefinedKeys<T>>]: T[Key] } & {
  // Property _is_ a union with defined value. Set as optional (via `?`) and remove `undefined` from the union.
[Key in keyof Pick<T, FilterOptionalKeys<T>>]?: Exclude<T[Key], undefined> }>;
/**
Works similar to the built-in `Pick` utility type, except for the following differences:
- Distributes over union types and allows picking keys from any member of the union type.
- Primitives types are returned as-is.
- Picks all keys if `Keys` is `any`.
- Doesn't pick `number` from a `string` index signature.

@example
```
type ImageUpload = {
	url: string;
	size: number;
	thumbnailUrl: string;
};

type VideoUpload = {
	url: string;
	duration: number;
	encodingFormat: string;
};

// Distributes over union types and allows picking keys from any member of the union type
type MediaDisplay = HomomorphicPick<ImageUpload | VideoUpload, "url" | "size" | "duration">;
//=> {url: string; size: number} | {url: string; duration: number}

// Primitive types are returned as-is
type Primitive = HomomorphicPick<string | number, 'toUpperCase' | 'toString'>;
//=> string | number

// Picks all keys if `Keys` is `any`
type Any = HomomorphicPick<{a: 1; b: 2} | {c: 3}, any>;
//=> {a: 1; b: 2} | {c: 3}

// Doesn't pick `number` from a `string` index signature
type IndexSignature = HomomorphicPick<{[k: string]: unknown}, number>;
//=> {}
*/
type HomomorphicPick<T, Keys extends KeysOfUnion<T>> = { [P in keyof T as Extract<P, Keys>]: T[P] };
/**
Extract all possible values for a given key from a union of object types.

@example
```
type Statuses = ValueOfUnion<{ id: 1, status: "open" } | { id: 2, status: "closed" }, "status">;
//=> "open" | "closed"
```
*/
type ValueOfUnion<Union, Key extends KeysOfUnion<Union>> = Union extends unknown ? Key extends keyof Union ? Union[Key] : never : never;
/**
Extract all readonly keys from a union of object types.

@example
```
type User = {
		readonly id: string;
		name: string;
};

type Post = {
		readonly id: string;
		readonly author: string;
		body: string;
};

type ReadonlyKeys = ReadonlyKeysOfUnion<User | Post>;
//=> "id" | "author"
```
*/
type ReadonlyKeysOfUnion<Union> = Union extends unknown ? keyof { [Key in keyof Union as IsEqual<{ [K in Key]: Union[Key] }, { readonly [K in Key]: Union[Key] }> extends true ? Key : never]: never } : never;
/**
Merges user specified options with default options.

@example
```
type PathsOptions = {maxRecursionDepth?: number; leavesOnly?: boolean};
type DefaultPathsOptions = {maxRecursionDepth: 10; leavesOnly: false};
type SpecifiedOptions = {leavesOnly: true};

type Result = ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, SpecifiedOptions>;
//=> {maxRecursionDepth: 10; leavesOnly: true}
```

@example
```
// Complains if default values are not provided for optional options

type PathsOptions = {maxRecursionDepth?: number; leavesOnly?: boolean};
type DefaultPathsOptions = {maxRecursionDepth: 10};
type SpecifiedOptions = {};

type Result = ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, SpecifiedOptions>;
//                                              ~~~~~~~~~~~~~~~~~~~
// Property 'leavesOnly' is missing in type 'DefaultPathsOptions' but required in type '{ maxRecursionDepth: number; leavesOnly: boolean; }'.
```

@example
```
// Complains if an option's default type does not conform to the expected type

type PathsOptions = {maxRecursionDepth?: number; leavesOnly?: boolean};
type DefaultPathsOptions = {maxRecursionDepth: 10; leavesOnly: 'no'};
type SpecifiedOptions = {};

type Result = ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, SpecifiedOptions>;
//                                              ~~~~~~~~~~~~~~~~~~~
// Types of property 'leavesOnly' are incompatible. Type 'string' is not assignable to type 'boolean'.
```

@example
```
// Complains if an option's specified type does not conform to the expected type

type PathsOptions = {maxRecursionDepth?: number; leavesOnly?: boolean};
type DefaultPathsOptions = {maxRecursionDepth: 10; leavesOnly: false};
type SpecifiedOptions = {leavesOnly: 'yes'};

type Result = ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, SpecifiedOptions>;
//                                                                   ~~~~~~~~~~~~~~~~
// Types of property 'leavesOnly' are incompatible. Type 'string' is not assignable to type 'boolean'.
```
*/
type ApplyDefaultOptions<Options extends object, Defaults extends Simplify<Omit<Required<Options>, RequiredKeysOf<Options>> & Partial<Record<RequiredKeysOf<Options>, never>>>, SpecifiedOptions extends Options> = IfAny$1<SpecifiedOptions, Defaults, IfNever$1<SpecifiedOptions, Defaults, Simplify<Merge<Defaults, { [Key in keyof SpecifiedOptions as Key extends OptionalKeysOf<Options> ? Extract<SpecifiedOptions[Key], undefined> extends never ? Key : never : Key]: SpecifiedOptions[Key] }> & Required<Options>> // `& Required<Options>` ensures that `ApplyDefaultOptions<SomeOption, ...>` is always assignable to `Required<SomeOption>`
>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/except.d.ts
/**
Filter out keys from an object.

Returns `never` if `Exclude` is strictly equal to `Key`.
Returns `never` if `Key` extends `Exclude`.
Returns `Key` otherwise.

@example
```
type Filtered = Filter<'foo', 'foo'>;
//=> never
```

@example
```
type Filtered = Filter<'bar', string>;
//=> never
```

@example
```
type Filtered = Filter<'bar', 'foo'>;
//=> 'bar'
```

@see {Except}
*/
type Filter<KeyType, ExcludeType> = IsEqual<KeyType, ExcludeType> extends true ? never : (KeyType extends ExcludeType ? never : KeyType);
type ExceptOptions = {
  /**
  Disallow assigning non-specified properties.
  	Note that any omitted properties in the resulting type will be present in autocomplete as `undefined`.
  	@default false
  */
  requireExactProps?: boolean;
};
type DefaultExceptOptions = {
  requireExactProps: false;
};

/**
Create a type from an object type without certain keys.

We recommend setting the `requireExactProps` option to `true`.

This type is a stricter version of [`Omit`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type). The `Omit` type does not restrict the omitted keys to be keys present on the given type, while `Except` does. The benefits of a stricter type are avoiding typos and allowing the compiler to pick up on rename refactors automatically.

This type was proposed to the TypeScript team, which declined it, saying they prefer that libraries implement stricter versions of the built-in types ([microsoft/TypeScript#30825](https://github.com/microsoft/TypeScript/issues/30825#issuecomment-523668235)).

@example
```
import type {Except} from 'type-fest';

type Foo = {
	a: number;
	b: string;
};

type FooWithoutA = Except<Foo, 'a'>;
//=> {b: string}

const fooWithoutA: FooWithoutA = {a: 1, b: '2'};
//=> errors: 'a' does not exist in type '{ b: string; }'

type FooWithoutB = Except<Foo, 'b', {requireExactProps: true}>;
//=> {a: number} & Partial<Record<"b", never>>

const fooWithoutB: FooWithoutB = {a: 1, b: '2'};
//=> errors at 'b': Type 'string' is not assignable to type 'undefined'.

// The `Omit` utility type doesn't work when omitting specific keys from objects containing index signatures.

// Consider the following example:

type UserData = {
	[metadata: string]: string;
	email: string;
	name: string;
	role: 'admin' | 'user';
};

// `Omit` clearly doesn't behave as expected in this case:
type PostPayload = Omit<UserData, 'email'>;
//=> type PostPayload = { [x: string]: string; [x: number]: string; }

// In situations like this, `Except` works better.
// It simply removes the `email` key while preserving all the other keys.
type PostPayload = Except<UserData, 'email'>;
//=> type PostPayload = { [x: string]: string; name: string; role: 'admin' | 'user'; }
```

@category Object
*/
type Except<ObjectType, KeysType extends keyof ObjectType, Options extends ExceptOptions = {}> = _Except<ObjectType, KeysType, ApplyDefaultOptions<ExceptOptions, DefaultExceptOptions, Options>>;
type _Except<ObjectType, KeysType extends keyof ObjectType, Options extends Required<ExceptOptions>> = { [KeyType in keyof ObjectType as Filter<KeyType, KeysType>]: ObjectType[KeyType] } & (Options['requireExactProps'] extends true ? Partial<Record<KeysType, never>> : {});
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/require-at-least-one.d.ts
/**
Create a type that requires at least one of the given keys. The remaining keys are kept as is.

@example
```
import type {RequireAtLeastOne} from 'type-fest';

type Responder = {
	text?: () => string;
	json?: () => string;
	secure?: boolean;
};

const responder: RequireAtLeastOne<Responder, 'text' | 'json'> = {
	json: () => '{"message": "ok"}',
	secure: true
};
```

@category Object
*/
type RequireAtLeastOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> = IfNotAnyOrNever<ObjectType, IfNever$1<KeysType, never, _RequireAtLeastOne<ObjectType, IfAny$1<KeysType, keyof ObjectType, KeysType>>>>;
type _RequireAtLeastOne<ObjectType, KeysType extends keyof ObjectType> = {
  // For each `Key` in `KeysType` make a mapped type:
[Key in KeysType]-?: Required<Pick<ObjectType, Key>> &
// 1. Make `Key`'s type required
// 2. Make all other keys in `KeysType` optional
Partial<Pick<ObjectType, Exclude<KeysType, Key>>> }[KeysType] &
// 3. Add the remaining keys not in `KeysType`
Except<ObjectType, KeysType>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/non-empty-object.d.ts
/**
Represents an object with at least 1 non-optional key.

This is useful when you need an object where all keys are optional, but there must be at least 1 key.

@example
```
import type {NonEmptyObject} from 'type-fest';

type User = {
	name: string;
	surname: string;
	id: number;
};

type UpdateRequest<Entity extends object> = NonEmptyObject<Partial<Entity>>;

const update1: UpdateRequest<User> = {
	name: 'Alice',
	surname: 'Acme',
};

// At least 1 key is required, therefore this will report a 2322 error:
// Type '{}' is not assignable to type 'UpdateRequest<User>'
const update2: UpdateRequest<User> = {};
```

@see Use `IsEmptyObject` to check whether an object is empty.

@category Object
*/
type NonEmptyObject<T extends object> = HasRequiredKeys<T> extends true ? T : RequireAtLeastOne<T, keyof T>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/non-empty-string.d.ts
/**
Matches any non-empty string.

This is useful when you need a string that is not empty, for example, as a function parameter.

NOTE:
- This returns `never` not just when instantiated with an empty string, but also when an empty string is a subtype of the instantiated type, like `string` or `Uppercase<string>`.

@example
```
import type {NonEmptyString} from 'type-fest';

declare function foo<T extends string>(string: NonEmptyString<T>): void;

foo('a');
//=> OK

foo('');
//=> Error: Argument of type '""' is not assignable to parameter of type 'never'.

declare const someString: string
foo(someString);
//=> Error: Argument of type 'string' is not assignable to parameter of type 'never'.
```

@category String
*/
type NonEmptyString<T extends string> = '' extends T ? never : T;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/unknown-record.d.ts
/**
Represents an object with `unknown` value. You probably want this instead of `{}`.

Use case: You have an object whose keys and values are unknown to you.

@example
```
import type {UnknownRecord} from 'type-fest';

function toJson(object: UnknownRecord) {
	return JSON.stringify(object);
}

toJson({hello: 'world'});
//=> '{"hello":"world"}'

function isObject(value: unknown): value is UnknownRecord {
	return typeof value === 'object' && value !== null;
}

isObject({hello: 'world'});
//=> true

isObject('hello');
//=> false
```

@category Type
@category Object
*/
type UnknownRecord = Record<PropertyKey, unknown>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/unknown-set.d.ts
/**
Represents a set with `unknown` value.

Use case: You want a type that all sets can be assigned to, but you don't care about the value.

@example
```
import type {UnknownSet} from 'type-fest';

type IsSet<T> = T extends UnknownSet ? true : false;

type A = IsSet<Set<string>>;
//=> true

type B = IsSet<ReadonlySet<number>>;
//=> true

type C = IsSet<string>;
//=> false
```

@category Type
*/
type UnknownSet = ReadonlySet<unknown>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/unknown-map.d.ts
/**
Represents a map with `unknown` key and value.

Use case: You want a type that all maps can be assigned to, but you don't care about the value.

@example
```
import type {UnknownMap} from 'type-fest';

type IsMap<T> = T extends UnknownMap ? true : false;

type A = IsMap<Map<string, number>>;
//=> true

type B = IsMap<ReadonlyMap<number, string>>;
//=> true

type C = IsMap<string>;
//=> false
```

@category Type
*/
type UnknownMap = ReadonlyMap<unknown, unknown>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/tagged-union.d.ts
/**
Create a union of types that share a common discriminant property.

Use-case: A shorter way to declare tagged unions with multiple members.

@example
```
import type {TaggedUnion} from 'type-fest';

type Tagged<Fields extends Record<string, unknown> = TaggedUnion<'type', Fields>

// The TaggedUnion utility reduces the amount of boilerplate needed to create a tagged union with multiple members, making the code more concise.
type EventMessage = Tagged<{
	OpenExternalUrl: {
		url: string;
		id: number;
		language: string;
	};
	ToggleBackButtonVisibility: {
		visible: boolean;
	};
	PurchaseButtonPressed: {
		price: number;
		time: Date;
	};
	NavigationStateChanged: {
		navigation?: string;
	};
}>;

// Here is the same type created without this utility.
type EventMessage =
	| {
		type: 'OpenExternalUrl';
		url: string;
		id: number;
		language: string;
	}
	| {type: 'ToggleBackButtonVisibility'; visible: boolean}
	| {type: 'PurchaseButtonPressed'; price: number; time: Date}
	| {type: 'NavigationStateChanged'; navigation?: string};
```

@category Utilities
*/
type TaggedUnion<TagKey extends string, UnionMembers extends Record<string, Record<string, unknown>>> = { [Name in keyof UnionMembers]: { [Key in TagKey]: Name } & UnionMembers[Name] }[keyof UnionMembers];
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/writable.d.ts
/**
Create a writable version of the given array type.
*/
type WritableArray<ArrayType extends readonly unknown[]> = ArrayType extends readonly [] ? [] : ArrayType extends readonly [...infer U, infer V] ? [...U, V] : ArrayType extends readonly [infer U, ...infer V] ? [U, ...V] : ArrayType extends ReadonlyArray<infer U> ? U[] : ArrayType;

/**
Create a type that strips `readonly` from the given type. Inverse of `Readonly<T>`.

The 2nd argument will be ignored if the input type is not an object.

Note: This type can make readonly `Set` and `Map` writable. This behavior is different from `Readonly<T>` (as of TypeScript 5.2.2). See: https://github.com/microsoft/TypeScript/issues/29655

This can be used to [store and mutate options within a class](https://github.com/sindresorhus/pageres/blob/4a5d05fca19a5fbd2f53842cbf3eb7b1b63bddd2/source/index.ts#L72), [edit `readonly` objects within tests](https://stackoverflow.com/questions/50703834), [construct a `readonly` object within a function](https://github.com/Microsoft/TypeScript/issues/24509), or to define a single model where the only thing that changes is whether or not some of the keys are writable.

@example
```
import type {Writable} from 'type-fest';

type Foo = {
	readonly a: number;
	readonly b: readonly string[]; // To show that only the mutability status of the properties, not their values, are affected.
	readonly c: boolean;
};

const writableFoo: Writable<Foo> = {a: 1, b: ['2'], c: true};
writableFoo.a = 3;
writableFoo.b[0] = 'new value'; // Will still fail as the value of property "b" is still a readonly type.
writableFoo.b = ['something']; // Will work as the "b" property itself is no longer readonly.

type SomeWritable = Writable<Foo, 'b' | 'c'>;
// type SomeWritable = {
// 	readonly a: number;
// 	b: readonly string[]; // It's now writable. The type of the property remains unaffected.
// 	c: boolean; // It's now writable.
// }

// Also supports array
const readonlyArray: readonly number[] = [1, 2, 3];
readonlyArray.push(4); // Will fail as the array itself is readonly.
const writableArray: Writable<typeof readonlyArray> = readonlyArray as Writable<typeof readonlyArray>;
writableArray.push(4); // Will work as the array itself is now writable.
```

@category Object
*/
type Writable<BaseType, Keys extends keyof BaseType = keyof BaseType> = BaseType extends ReadonlyMap<infer KeyType, infer ValueType> ? Map<KeyType, ValueType> : BaseType extends ReadonlySet<infer ItemType> ? Set<ItemType> : BaseType extends readonly unknown[]
// Handle array
? WritableArray<BaseType>
// Handle object
: Simplify<
// Pick just the keys that are not writable from the base type.
Except<BaseType, Keys> &
// Pick the keys that should be writable from the base type and make them writable by removing the `readonly` modifier from the key.
{ -readonly [KeyType in keyof Pick<BaseType, Keys>]: Pick<BaseType, Keys>[KeyType] }>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/writable-deep.d.ts
/**
Create a deeply mutable version of an `object`/`ReadonlyMap`/`ReadonlySet`/`ReadonlyArray` type. The inverse of `ReadonlyDeep<T>`. Use `Writable<T>` if you only need one level deep.

This can be used to [store and mutate options within a class](https://github.com/sindresorhus/pageres/blob/4a5d05fca19a5fbd2f53842cbf3eb7b1b63bddd2/source/index.ts#L72), [edit `readonly` objects within tests](https://stackoverflow.com/questions/50703834), [construct a `readonly` object within a function](https://github.com/Microsoft/TypeScript/issues/24509), or to define a single model where the only thing that changes is whether or not some of the keys are writable.

@example
```
import type {WritableDeep} from 'type-fest';

type Foo = {
	readonly a: number;
	readonly b: readonly string[]; // To show that mutability is deeply affected.
	readonly c: boolean;
};

const writableDeepFoo: WritableDeep<Foo> = {a: 1, b: ['2'], c: true};
writableDeepFoo.a = 3;
writableDeepFoo.b[0] = 'new value';
writableDeepFoo.b = ['something'];
```

Note that types containing overloaded functions are not made deeply writable due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

@see Writable
@category Object
@category Array
@category Set
@category Map
*/
type WritableDeep<T> = T extends BuiltIns ? T : T extends ((...arguments_: any[]) => unknown) ? {} extends WritableObjectDeep<T> ? T : HasMultipleCallSignatures<T> extends true ? T : ((...arguments_: Parameters<T>) => ReturnType<T>) & WritableObjectDeep<T> : T extends ReadonlyMap<unknown, unknown> ? WritableMapDeep<T> : T extends ReadonlySet<unknown> ? WritableSetDeep<T> : T extends readonly unknown[] ? WritableArrayDeep<T> : T extends object ? WritableObjectDeep<T> : unknown;
/**
Same as `WritableDeep`, but accepts only `Map`s as inputs. Internal helper for `WritableDeep`.
*/
type WritableMapDeep<MapType extends ReadonlyMap<unknown, unknown>> = MapType extends ReadonlyMap<infer KeyType, infer ValueType> ? Map<WritableDeep<KeyType>, WritableDeep<ValueType>> : MapType; // Should not heppen

/**
Same as `WritableDeep`, but accepts only `Set`s as inputs. Internal helper for `WritableDeep`.
*/
type WritableSetDeep<SetType extends ReadonlySet<unknown>> = SetType extends ReadonlySet<infer ItemType> ? Set<WritableDeep<ItemType>> : SetType; // Should not heppen

/**
Same as `WritableDeep`, but accepts only `object`s as inputs. Internal helper for `WritableDeep`.
*/
type WritableObjectDeep<ObjectType extends object> = { -readonly [KeyType in keyof ObjectType]: WritableDeep<ObjectType[KeyType]> };

/**
Same as `WritableDeep`, but accepts only `Array`s as inputs. Internal helper for `WritableDeep`.
*/
type WritableArrayDeep<ArrayType extends readonly unknown[]> = ArrayType extends readonly [] ? [] : ArrayType extends readonly [...infer U, infer V] ? [...WritableArrayDeep<U>, WritableDeep<V>] : ArrayType extends readonly [infer U, ...infer V] ? [WritableDeep<U>, ...WritableArrayDeep<V>] : ArrayType extends ReadonlyArray<infer U> ? Array<WritableDeep<U>> : ArrayType extends Array<infer U> ? Array<WritableDeep<U>> : ArrayType;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/conditional-simplify.d.ts
/**
Recursively simplifies a type while including and/or excluding certain types from being simplified.

This type is **experimental** and was introduced as a result of this {@link https://github.com/sindresorhus/type-fest/issues/436 issue}. It should be used with caution.

See {@link ConditionalSimplify} for usages and examples.

@internal
@experimental
@category Object
*/
type ConditionalSimplifyDeep<Type, ExcludeType = never, IncludeType = unknown> = Type extends ExcludeType ? Type : Type extends IncludeType ? { [TypeKey in keyof Type]: ConditionalSimplifyDeep<Type[TypeKey], ExcludeType, IncludeType> } : Type;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/non-empty-tuple.d.ts
/**
Matches any non-empty tuple.

@example
```
import type {NonEmptyTuple} from 'type-fest';

const sum = (...numbers: NonEmptyTuple<number>) => numbers.reduce((total, value) => total + value, 0);

sum(1, 2, 3);
//=> 6

sum();
//=> Error: Expected at least 1 arguments, but got 0.
```

@see {@link RequireAtLeastOne} for objects

@category Array
*/
type NonEmptyTuple<T = unknown> = readonly [T, ...T[]];
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/array-tail.d.ts
/**
@see {@link ArrayTail}
*/
type ArrayTailOptions = {
  /**
  Return a readonly array if the input array is readonly.
  	@default false
  	@example
  ```
  import type {ArrayTail} from 'type-fest';
  	type Example1 = ArrayTail<readonly [string, number, boolean], {preserveReadonly: true}>;
  //=> readonly [number, boolean]
  	type Example2 = ArrayTail<[string, number, boolean], {preserveReadonly: true}>;
  //=> [number, boolean]
  	type Example3 = ArrayTail<readonly [string, number, boolean], {preserveReadonly: false}>;
  //=> [number, boolean]
  	type Example4 = ArrayTail<[string, number, boolean], {preserveReadonly: false}>;
  //=> [number, boolean]
  ```
  */
  preserveReadonly?: boolean;
};
type DefaultArrayTailOptions = {
  preserveReadonly: false;
};

/**
Extracts the type of an array or tuple minus the first element.

@example
```
import type {ArrayTail} from 'type-fest';

declare const curry: <Arguments extends unknown[], Return>(
	function_: (...arguments_: Arguments) => Return,
	...arguments_: ArrayTail<Arguments>
) => (...arguments_: ArrayTail<Arguments>) => Return;

const add = (a: number, b: number) => a + b;

const add3 = curry(add, 3);

add3(4);
//=> 7
```

@see {@link ArrayTailOptions}

@category Array
*/
type ArrayTail<TArray extends UnknownArray, Options extends ArrayTailOptions = {}> = ApplyDefaultOptions<ArrayTailOptions, DefaultArrayTailOptions, Options> extends infer ResolvedOptions extends Required<ArrayTailOptions> ? TArray extends UnknownArray // For distributing `TArray`
? _ArrayTail<TArray> extends infer Result ? ResolvedOptions['preserveReadonly'] extends true ? IfArrayReadonly<TArray, Readonly<Result>, Result> : Result : never // Should never happen
: never // Should never happen
: never;
// Should never happen

type _ArrayTail<TArray extends UnknownArray> = TArray extends readonly [unknown?, ...infer Tail] ? keyof TArray & `${number}` extends never ? [] : Tail : [];
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/enforce-optional.d.ts
// Returns `never` if the key is optional otherwise return the key type.
type RequiredFilter<Type, Key extends keyof Type> = undefined extends Type[Key] ? Type[Key] extends undefined ? Key : never : Key;

// Returns `never` if the key is required otherwise return the key type.
type OptionalFilter<Type, Key extends keyof Type> = undefined extends Type[Key] ? Type[Key] extends undefined ? never : Key : never;

/**
Enforce optional keys (by adding the `?` operator) for keys that have a union with `undefined`.

@example
```
import type {EnforceOptional} from 'type-fest';

type Foo = {
	a: string;
	b?: string;
	c: undefined;
	d: number | undefined;
};

type FooBar = EnforceOptional<Foo>;
// => {
// 	a: string;
// 	b?: string;
// 	c: undefined;
// 	d?: number;
// }
```

@internal
@category Object
*/
type EnforceOptional<ObjectType> = Simplify<{ [Key in keyof ObjectType as RequiredFilter<ObjectType, Key>]: ObjectType[Key] } & { [Key in keyof ObjectType as OptionalFilter<ObjectType, Key>]?: Exclude<ObjectType[Key], undefined> }>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/simplify-deep.d.ts
/**
Deeply simplifies an object type.

You can exclude certain types from being simplified by providing them in the second generic `ExcludeType`.

Useful to flatten the type output to improve type hints shown in editors.

@example
```
import type {SimplifyDeep} from 'type-fest';

type PositionX = {
	left: number;
	right: number;
};

type PositionY = {
	top: number;
	bottom: number;
};

type Properties1 = {
	height: number;
	position: PositionY;
};

type Properties2 = {
	width: number;
	position: PositionX;
};

type Properties = Properties1 & Properties2;
// In your editor, hovering over `Props` will show the following:
//
// type Properties = Properties1 & Properties2;

type SimplifyDeepProperties = SimplifyDeep<Properties1 & Properties2>;
// But if wrapped in SimplifyDeep, hovering over `SimplifyDeepProperties` will show a flattened object with all the properties:
//
// SimplifyDeepProperties = {
// 	height: number;
// 	width: number;
// 	position: {
// 		top: number;
// 		bottom: number;
// 		left: number;
// 		right: number;
// 	};
// };
```

@example
```
import type {SimplifyDeep} from 'type-fest';

// A complex type that you don't want or need to simplify
type ComplexType = {
	a: string;
	b: 'b';
	c: number;
	...
};

type PositionX = {
	left: number;
	right: number;
};

type PositionY = {
	top: number;
	bottom: number;
};

// You want to simplify all other types
type Properties1 = {
	height: number;
	position: PositionY;
	foo: ComplexType;
};

type Properties2 = {
	width: number;
	position: PositionX;
	foo: ComplexType;
};

type SimplifyDeepProperties = SimplifyDeep<Properties1 & Properties2, ComplexType>;
// If wrapped in `SimplifyDeep` and set `ComplexType` to exclude, hovering over `SimplifyDeepProperties` will
// show a flattened object with all the properties except `ComplexType`:
//
// SimplifyDeepProperties = {
// 	height: number;
// 	width: number;
// 	position: {
// 		top: number;
// 		bottom: number;
// 		left: number;
// 		right: number;
// 	};
//	foo: ComplexType;
// };
```

@see Simplify
@category Object
*/
type SimplifyDeep<Type, ExcludeType = never> = ConditionalSimplifyDeep<Type, ExcludeType | NonRecursiveType | Set<unknown> | Map<unknown, unknown>, object>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/merge-deep.d.ts
type SimplifyDeepExcludeArray<T> = SimplifyDeep<T, UnknownArray>;

/**
Try to merge two record properties or return the source property value, preserving `undefined` properties values in both cases.
*/
type MergeDeepRecordProperty<Destination, Source, Options extends MergeDeepInternalOptions> = undefined extends Source ? MergeDeepOrReturn<Source, Exclude<Destination, undefined>, Exclude<Source, undefined>, Options> | undefined : MergeDeepOrReturn<Source, Destination, Source, Options>;

/**
Walk through the union of the keys of the two objects and test in which object the properties are defined.
Rules:
1. If the source does not contain the key, the value of the destination is returned.
2. If the source contains the key and the destination does not contain the key, the value of the source is returned.
3. If both contain the key, try to merge according to the chosen {@link MergeDeepOptions options} or return the source if unable to merge.
*/
type DoMergeDeepRecord<Destination extends UnknownRecord, Source extends UnknownRecord, Options extends MergeDeepInternalOptions> =
// Case in rule 1: The destination contains the key but the source doesn't.
{ [Key in keyof Destination as Key extends keyof Source ? never : Key]: Destination[Key] }
// Case in rule 2: The source contains the key but the destination doesn't.
& { [Key in keyof Source as Key extends keyof Destination ? never : Key]: Source[Key] }
// Case in rule 3: Both the source and the destination contain the key.
& { [Key in keyof Source as Key extends keyof Destination ? Key : never]: MergeDeepRecordProperty<Destination[Key], Source[Key], Options> };

/**
Wrapper around {@link DoMergeDeepRecord} which preserves index signatures.
*/
type MergeDeepRecord<Destination extends UnknownRecord, Source extends UnknownRecord, Options extends MergeDeepInternalOptions> = DoMergeDeepRecord<OmitIndexSignature<Destination>, OmitIndexSignature<Source>, Options> & Merge<PickIndexSignature<Destination>, PickIndexSignature<Source>>;

// Helper to avoid computing ArrayTail twice.
type PickRestTypeHelper<Tail extends UnknownArrayOrTuple, Type> = Tail extends [] ? Type : PickRestType<Tail>;

/**
Pick the rest type.

@example
```
type Rest1 = PickRestType<[]>; // => []
type Rest2 = PickRestType<[string]>; // => []
type Rest3 = PickRestType<[...number[]]>; // => number[]
type Rest4 = PickRestType<[string, ...number[]]>; // => number[]
type Rest5 = PickRestType<string[]>; // => string[]
```
*/
type PickRestType<Type extends UnknownArrayOrTuple> = number extends Type['length'] ? PickRestTypeHelper<ArrayTail<Type>, Type> : [];

// Helper to avoid computing ArrayTail twice.
type OmitRestTypeHelper<Tail extends UnknownArrayOrTuple, Type extends UnknownArrayOrTuple, Result extends UnknownArrayOrTuple = []> = Tail extends [] ? Result : OmitRestType<Tail, [...Result, FirstArrayElement<Type>]>;

/**
Omit the rest type.

@example
```
type Tuple1 = OmitRestType<[]>; // => []
type Tuple2 = OmitRestType<[string]>; // => [string]
type Tuple3 = OmitRestType<[...number[]]>; // => []
type Tuple4 = OmitRestType<[string, ...number[]]>; // => [string]
type Tuple5 = OmitRestType<[string, boolean[], ...number[]]>; // => [string, boolean[]]
type Tuple6 = OmitRestType<string[]>; // => []
```
*/
type OmitRestType<Type extends UnknownArrayOrTuple, Result extends UnknownArrayOrTuple = []> = number extends Type['length'] ? OmitRestTypeHelper<ArrayTail<Type>, Type, Result> : Type;

// Utility to avoid picking two times the type.
type TypeNumberOrType<Type extends UnknownArrayOrTuple> = Type[number] extends never ? Type : Type[number];

// Pick the rest type (array) and try to get the intrinsic type or return the provided type.
type PickRestTypeFlat<Type extends UnknownArrayOrTuple> = TypeNumberOrType<PickRestType<Type>>;

/**
Try to merge two array/tuple elements or return the source element if the end of the destination is reached or vis-versa.
*/
type MergeDeepArrayOrTupleElements<Destination, Source, Options extends MergeDeepInternalOptions> = Source extends [] ? Destination : Destination extends [] ? Source : MergeDeepOrReturn<Source, Destination, Source, Options>;

/**
Merge two tuples recursively.
*/
type DoMergeDeepTupleAndTupleRecursive<Destination extends UnknownArrayOrTuple, Source extends UnknownArrayOrTuple, DestinationRestType, SourceRestType, Options extends MergeDeepInternalOptions> = Destination extends [] ? Source extends [] ? [] : MergeArrayTypeAndTuple<DestinationRestType, Source, Options> : Source extends [] ? MergeTupleAndArrayType<Destination, SourceRestType, Options> : [MergeDeepArrayOrTupleElements<FirstArrayElement<Destination>, FirstArrayElement<Source>, Options>, ...DoMergeDeepTupleAndTupleRecursive<ArrayTail<Destination>, ArrayTail<Source>, DestinationRestType, SourceRestType, Options>];

/**
Merge two tuples recursively taking into account a possible rest element.
*/
type MergeDeepTupleAndTupleRecursive<Destination extends UnknownArrayOrTuple, Source extends UnknownArrayOrTuple, Options extends MergeDeepInternalOptions> = [...DoMergeDeepTupleAndTupleRecursive<OmitRestType<Destination>, OmitRestType<Source>, PickRestTypeFlat<Destination>, PickRestTypeFlat<Source>, Options>, ...MergeDeepArrayOrTupleElements<PickRestType<Destination>, PickRestType<Source>, Options>];

/**
Merge an array type with a tuple recursively.
*/
type MergeTupleAndArrayType<Tuple extends UnknownArrayOrTuple, ArrayType, Options extends MergeDeepInternalOptions> = Tuple extends [] ? Tuple : [MergeDeepArrayOrTupleElements<FirstArrayElement<Tuple>, ArrayType, Options>, ...MergeTupleAndArrayType<ArrayTail<Tuple>, ArrayType, Options>];

/**
Merge an array into a tuple recursively taking into account a possible rest element.
*/
type MergeDeepTupleAndArrayRecursive<Destination extends UnknownArrayOrTuple, Source extends UnknownArrayOrTuple, Options extends MergeDeepInternalOptions> = [...MergeTupleAndArrayType<OmitRestType<Destination>, Source[number], Options>, ...MergeDeepArrayOrTupleElements<PickRestType<Destination>, PickRestType<Source>, Options>];

/**
Merge a tuple with an array type recursively.
*/
type MergeArrayTypeAndTuple<ArrayType, Tuple extends UnknownArrayOrTuple, Options extends MergeDeepInternalOptions> = Tuple extends [] ? Tuple : [MergeDeepArrayOrTupleElements<ArrayType, FirstArrayElement<Tuple>, Options>, ...MergeArrayTypeAndTuple<ArrayType, ArrayTail<Tuple>, Options>];

/**
Merge a tuple into an array recursively taking into account a possible rest element.
*/
type MergeDeepArrayAndTupleRecursive<Destination extends UnknownArrayOrTuple, Source extends UnknownArrayOrTuple, Options extends MergeDeepInternalOptions> = [...MergeArrayTypeAndTuple<Destination[number], OmitRestType<Source>, Options>, ...MergeDeepArrayOrTupleElements<PickRestType<Destination>, PickRestType<Source>, Options>];

/**
Merge mode for array/tuple elements.
*/
type ArrayMergeMode = 'spread' | 'replace';

/**
Test if it should spread top-level arrays.
*/
type ShouldSpread<Options extends MergeDeepInternalOptions> = Options['spreadTopLevelArrays'] extends false ? Options['arrayMergeMode'] extends 'spread' ? true : false : true;

/**
Merge two arrays/tuples according to the chosen {@link MergeDeepOptions.arrayMergeMode arrayMergeMode} option.
*/
type DoMergeArrayOrTuple<Destination extends UnknownArrayOrTuple, Source extends UnknownArrayOrTuple, Options extends MergeDeepInternalOptions> = ShouldSpread<Options> extends true ? Array<Exclude<Destination, undefined>[number] | Exclude<Source, undefined>[number]> : Source; // 'replace'

/**
Merge two arrays recursively.

If the two arrays are multi-level, we merge deeply, otherwise we merge the first level only.

Note: The `[number]` accessor is used to test the type of the second level.
*/
type MergeDeepArrayRecursive<Destination extends UnknownArrayOrTuple, Source extends UnknownArrayOrTuple, Options extends MergeDeepInternalOptions> = Destination[number] extends UnknownArrayOrTuple ? Source[number] extends UnknownArrayOrTuple ? Array<MergeDeepArrayOrTupleRecursive<Destination[number], Source[number], Options>> : DoMergeArrayOrTuple<Destination, Source, Options> : Destination[number] extends UnknownRecord ? Source[number] extends UnknownRecord ? Array<SimplifyDeepExcludeArray<MergeDeepRecord<Destination[number], Source[number], Options>>> : DoMergeArrayOrTuple<Destination, Source, Options> : DoMergeArrayOrTuple<Destination, Source, Options>;

/**
Merge two array/tuple recursively by selecting one of the four strategies according to the type of inputs.

- tuple/tuple
- tuple/array
- array/tuple
- array/array
*/
type MergeDeepArrayOrTupleRecursive<Destination extends UnknownArrayOrTuple, Source extends UnknownArrayOrTuple, Options extends MergeDeepInternalOptions> = IsBothExtends<NonEmptyTuple, Destination, Source> extends true ? MergeDeepTupleAndTupleRecursive<Destination, Source, Options> : Destination extends NonEmptyTuple ? MergeDeepTupleAndArrayRecursive<Destination, Source, Options> : Source extends NonEmptyTuple ? MergeDeepArrayAndTupleRecursive<Destination, Source, Options> : MergeDeepArrayRecursive<Destination, Source, Options>;

/**
Merge two array/tuple according to {@link MergeDeepOptions.recurseIntoArrays recurseIntoArrays} option.
*/
type MergeDeepArrayOrTuple<Destination extends UnknownArrayOrTuple, Source extends UnknownArrayOrTuple, Options extends MergeDeepInternalOptions> = Options['recurseIntoArrays'] extends true ? MergeDeepArrayOrTupleRecursive<Destination, Source, Options> : DoMergeArrayOrTuple<Destination, Source, Options>;

/**
Try to merge two objects or two arrays/tuples recursively into a new type or return the default value.
*/
type MergeDeepOrReturn<DefaultType, Destination, Source, Options extends MergeDeepInternalOptions> = SimplifyDeepExcludeArray<[undefined] extends [Destination | Source] ? DefaultType : Destination extends UnknownRecord ? Source extends UnknownRecord ? MergeDeepRecord<Destination, Source, Options> : DefaultType : Destination extends UnknownArrayOrTuple ? Source extends UnknownArrayOrTuple ? MergeDeepArrayOrTuple<Destination, Source, EnforceOptional<Merge<Options, {
  spreadTopLevelArrays: false;
}>>> : DefaultType : DefaultType>;

/**
MergeDeep options.

@see {@link MergeDeep}
*/
type MergeDeepOptions = {
  /**
  Merge mode for array and tuple.
  	When we walk through the properties of the objects and the same key is found and both are array or tuple, a merge mode must be chosen:
  - `replace`: Replaces the destination value by the source value. This is the default mode.
  - `spread`: Spreads the destination and the source values.
  	See {@link MergeDeep} for usages and examples.
  	Note: Top-level arrays and tuples are always spread.
  	@default 'replace'
  */
  arrayMergeMode?: ArrayMergeMode;

  /**
  Whether to affect the individual elements of arrays and tuples.
  	If this option is set to `true` the following rules are applied:
  - If the source does not contain the key, the value of the destination is returned.
  - If the source contains the key and the destination does not contain the key, the value of the source is returned.
  - If both contain the key, try to merge according to the chosen {@link MergeDeepOptions.arrayMergeMode arrayMergeMode} or return the source if unable to merge.
  	@default false
  */
  recurseIntoArrays?: boolean;
};
/**
Internal options.
*/
type MergeDeepInternalOptions = Merge<MergeDeepOptions, {
  spreadTopLevelArrays?: boolean;
}>;

/**
Merge default and internal options with user provided options.
*/
type DefaultMergeDeepOptions<Options extends MergeDeepOptions> = Merge<{
  arrayMergeMode: 'replace';
  recurseIntoArrays: false;
  spreadTopLevelArrays: true;
}, Options>;

/**
This utility selects the correct entry point with the corresponding default options. This avoids re-merging the options at each iteration.
*/
type MergeDeepWithDefaultOptions<Destination, Source, Options extends MergeDeepOptions> = SimplifyDeepExcludeArray<[undefined] extends [Destination | Source] ? never : Destination extends UnknownRecord ? Source extends UnknownRecord ? MergeDeepRecord<Destination, Source, DefaultMergeDeepOptions<Options>> : never : Destination extends UnknownArrayOrTuple ? Source extends UnknownArrayOrTuple ? MergeDeepArrayOrTuple<Destination, Source, DefaultMergeDeepOptions<Options>> : never : never>;

/**
Merge two objects or two arrays/tuples recursively into a new type.

- Properties that only exist in one object are copied into the new object.
- Properties that exist in both objects are merged if possible or replaced by the one of the source if not.
- Top-level arrays and tuples are always spread.
- By default, inner arrays and tuples are replaced. See {@link MergeDeepOptions.arrayMergeMode arrayMergeMode} option to change this behaviour.
- By default, individual array/tuple elements are not affected. See {@link MergeDeepOptions.recurseIntoArrays recurseIntoArrays} option to change this behaviour.

@example
```
import type {MergeDeep} from 'type-fest';

type Foo = {
	life: number;
	items: string[];
	a: {b: string; c: boolean; d: number[]};
};

interface Bar {
	name: string;
	items: number[];
	a: {b: number; d: boolean[]};
}

type FooBar = MergeDeep<Foo, Bar>;
// {
// 	life: number;
// 	name: string;
// 	items: number[];
// 	a: {b: number; c: boolean; d: boolean[]};
// }

type FooBar = MergeDeep<Foo, Bar, {arrayMergeMode: 'spread'}>;
// {
// 	life: number;
// 	name: string;
// 	items: (string | number)[];
// 	a: {b: number; c: boolean; d: (number | boolean)[]};
// }
```

@example
```
import type {MergeDeep} from 'type-fest';

// Merge two arrays
type ArrayMerge = MergeDeep<string[], number[]>; // => (string | number)[]

// Merge two tuples
type TupleMerge = MergeDeep<[1, 2, 3], ['a', 'b']>; // => (1 | 2 | 3 | 'a' | 'b')[]

// Merge an array into a tuple
type TupleArrayMerge = MergeDeep<[1, 2, 3], string[]>; // => (string | 1 | 2 | 3)[]

// Merge a tuple into an array
type ArrayTupleMerge = MergeDeep<number[], ['a', 'b']>; // => (number | 'b' | 'a')[]
```

@example
```
import type {MergeDeep, MergeDeepOptions} from 'type-fest';

type Foo = {foo: 'foo'; fooBar: string[]};
type Bar = {bar: 'bar'; fooBar: number[]};

type FooBar = MergeDeep<Foo, Bar>;
// { foo: "foo"; bar: "bar"; fooBar: number[]}

type FooBarSpread = MergeDeep<Foo, Bar, {arrayMergeMode: 'spread'}>;
// { foo: "foo"; bar: "bar"; fooBar: (string | number)[]}

type FooBarArray = MergeDeep<Foo[], Bar[]>;
// (Foo | Bar)[]

type FooBarArrayDeep = MergeDeep<Foo[], Bar[], {recurseIntoArrays: true}>;
// FooBar[]

type FooBarArraySpreadDeep = MergeDeep<Foo[], Bar[], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
// FooBarSpread[]

type FooBarTupleDeep = MergeDeep<[Foo, true, 42], [Bar, 'life'], {recurseIntoArrays: true}>;
// [FooBar, 'life', 42]

type FooBarTupleWithArrayDeep = MergeDeep<[Foo[], true], [Bar[], 'life', 42], {recurseIntoArrays: true}>;
// [FooBar[], 'life', 42]
```

@example
```
import type {MergeDeep, MergeDeepOptions} from 'type-fest';

function mergeDeep<Destination, Source, Options extends MergeDeepOptions = {}>(
	destination: Destination,
	source: Source,
	options?: Options,
): MergeDeep<Destination, Source, Options> {
	// Make your implementation ...
}
```

@experimental This type is marked as experimental because it depends on {@link ConditionalSimplifyDeep} which itself is experimental.

@see {@link MergeDeepOptions}

@category Array
@category Object
@category Utilities
*/
type MergeDeep<Destination, Source, Options extends MergeDeepOptions = {}> = MergeDeepWithDefaultOptions<SimplifyDeepExcludeArray<Destination>, SimplifyDeepExcludeArray<Source>, Options>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/merge-exclusive.d.ts
// Helper type. Not useful on its own.
type Without<FirstType, SecondType> = { [KeyType in Exclude<keyof FirstType, keyof SecondType>]?: never };

/**
Create a type that has mutually exclusive keys.

This type was inspired by [this comment](https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-373782604).

This type works with a helper type, called `Without`. `Without<FirstType, SecondType>` produces a type that has only keys from `FirstType` which are not present on `SecondType` and sets the value type for these keys to `never`. This helper type is then used in `MergeExclusive` to remove keys from either `FirstType` or `SecondType`.

@example
```
import type {MergeExclusive} from 'type-fest';

interface ExclusiveVariation1 {
	exclusive1: boolean;
}

interface ExclusiveVariation2 {
	exclusive2: string;
}

type ExclusiveOptions = MergeExclusive<ExclusiveVariation1, ExclusiveVariation2>;

let exclusiveOptions: ExclusiveOptions;

exclusiveOptions = {exclusive1: true};
//=> Works
exclusiveOptions = {exclusive2: 'hi'};
//=> Works
exclusiveOptions = {exclusive1: true, exclusive2: 'hi'};
//=> Error
```

@category Object
*/
type MergeExclusive<FirstType, SecondType> = (FirstType | SecondType) extends object ? (Without<FirstType, SecondType> & SecondType) | (Without<SecondType, FirstType> & FirstType) : FirstType | SecondType;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/require-exactly-one.d.ts
/**
Create a type that requires exactly one of the given keys and disallows more. The remaining keys are kept as is.

Use-cases:
- Creating interfaces for components that only need one of the keys to display properly.
- Declaring generic keys in a single place for a single use-case that gets narrowed down via `RequireExactlyOne`.

The caveat with `RequireExactlyOne` is that TypeScript doesn't always know at compile time every key that will exist at runtime. Therefore `RequireExactlyOne` can't do anything to prevent extra keys it doesn't know about.

@example
```
import type {RequireExactlyOne} from 'type-fest';

type Responder = {
	text: () => string;
	json: () => string;
	secure: boolean;
};

const responder: RequireExactlyOne<Responder, 'text' | 'json'> = {
	// Adding a `text` key here would cause a compile error.

	json: () => '{"message": "ok"}',
	secure: true
};
```

@category Object
*/
type RequireExactlyOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> = IfNotAnyOrNever<ObjectType, IfNever$1<KeysType, never, _RequireExactlyOne<ObjectType, IfAny$1<KeysType, keyof ObjectType, KeysType>>>>;
type _RequireExactlyOne<ObjectType, KeysType extends keyof ObjectType> = { [Key in KeysType]: (Required<Pick<ObjectType, Key>> & Partial<Record<Exclude<KeysType, Key>, never>>) }[KeysType] & Omit<ObjectType, KeysType>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/require-all-or-none.d.ts
/**
Requires all of the keys in the given object.
*/
type RequireAll<ObjectType, KeysType extends keyof ObjectType> = Required<Pick<ObjectType, KeysType>>;

/**
Create a type that requires all of the given keys or none of the given keys. The remaining keys are kept as is.

Use-cases:
- Creating interfaces for components with mutually-inclusive keys.

The caveat with `RequireAllOrNone` is that TypeScript doesn't always know at compile time every key that will exist at runtime. Therefore `RequireAllOrNone` can't do anything to prevent extra keys it doesn't know about.

@example
```
import type {RequireAllOrNone} from 'type-fest';

type Responder = {
	text?: () => string;
	json?: () => string;
	secure: boolean;
};

const responder1: RequireAllOrNone<Responder, 'text' | 'json'> = {
	secure: true
};

const responder2: RequireAllOrNone<Responder, 'text' | 'json'> = {
	text: () => '{"message": "hi"}',
	json: () => '{"message": "ok"}',
	secure: true
};
```

@category Object
*/
type RequireAllOrNone<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> = IfNotAnyOrNever<ObjectType, IfNever$1<KeysType, ObjectType, _RequireAllOrNone<ObjectType, IfAny$1<KeysType, keyof ObjectType, KeysType>>>>;
type _RequireAllOrNone<ObjectType, KeysType extends keyof ObjectType> = (RequireAll<ObjectType, KeysType> | RequireNone<KeysType>) & Omit<ObjectType, KeysType>; // The rest of the keys.
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/require-one-or-none.d.ts
/**
Create a type that requires exactly one of the given keys and disallows more, or none of the given keys. The remaining keys are kept as is.

@example
```
import type {RequireOneOrNone} from 'type-fest';

type Responder = RequireOneOrNone<{
	text: () => string;
	json: () => string;
	secure: boolean;
}, 'text' | 'json'>;

const responder1: Responder = {
	secure: true
};

const responder2: Responder = {
	text: () => '{"message": "hi"}',
	secure: true
};

const responder3: Responder = {
	json: () => '{"message": "ok"}',
	secure: true
};
```

@category Object
*/
type RequireOneOrNone<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> = IfNotAnyOrNever<ObjectType, IfNever$1<KeysType, ObjectType, _RequireOneOrNone<ObjectType, IfAny$1<KeysType, keyof ObjectType, KeysType>>>>;
type _RequireOneOrNone<ObjectType, KeysType extends keyof ObjectType> = (RequireExactlyOne<ObjectType, KeysType> | RequireNone<KeysType>) & Omit<ObjectType, KeysType>; // Ignore unspecified keys.
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/single-key-object.d.ts
/**
Create a type that only accepts an object with a single key.

@example
```
import type {SingleKeyObject} from 'type-fest';

const someFunction = <T>(parameter: SingleKeyObject<T>) => {};

someFunction({
	value: true
});

someFunction({
	value: true,
	otherKey: true
});
// Error: Argument of type '{value: boolean; otherKey: boolean}' is not assignable to parameter of type 'never'.ts(2345)
```

@category Object
*/
type SingleKeyObject<ObjectType> = IsUnion<keyof ObjectType> extends true ? never : IfEmptyObject<ObjectType, never, ObjectType>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/partial-deep.d.ts
/**
@see {@link PartialDeep}
*/
type PartialDeepOptions = {
  /**
  Whether to affect the individual elements of arrays and tuples.
  	@default false
  */
  readonly recurseIntoArrays?: boolean;

  /**
  Allows `undefined` values in non-tuple arrays.
  	- When set to `true`, elements of non-tuple arrays can be `undefined`.
  - When set to `false`, only explicitly defined elements are allowed in non-tuple arrays, ensuring stricter type checking.
  	@default true
  	@example
  You can prevent `undefined` values in non-tuple arrays by passing `{recurseIntoArrays: true; allowUndefinedInNonTupleArrays: false}` as the second type argument:
  	```
  import type {PartialDeep} from 'type-fest';
  	type Settings = {
  	languages: string[];
  };
  	declare const partialSettings: PartialDeep<Settings, {recurseIntoArrays: true; allowUndefinedInNonTupleArrays: false}>;
  	partialSettings.languages = [undefined]; // Error
  partialSettings.languages = []; // Ok
  ```
  */
  readonly allowUndefinedInNonTupleArrays?: boolean;
};
type DefaultPartialDeepOptions = {
  recurseIntoArrays: false;
  allowUndefinedInNonTupleArrays: true;
};

/**
Create a type from another type with all keys and nested keys set to optional.

Use-cases:
- Merging a default settings/config object with another object, the second object would be a deep partial of the default object.
- Mocking and testing complex entities, where populating an entire object with its keys would be redundant in terms of the mock or test.

@example
```
import type {PartialDeep} from 'type-fest';

const settings: Settings = {
	textEditor: {
		fontSize: 14,
		fontColor: '#000000',
		fontWeight: 400
	},
	autocomplete: false,
	autosave: true
};

const applySavedSettings = (savedSettings: PartialDeep<Settings>) => {
	return {...settings, ...savedSettings};
}

settings = applySavedSettings({textEditor: {fontWeight: 500}});
```

By default, this does not affect elements in array and tuple types. You can change this by passing `{recurseIntoArrays: true}` as the second type argument:

```
import type {PartialDeep} from 'type-fest';

type Settings = {
	languages: string[];
}

const partialSettings: PartialDeep<Settings, {recurseIntoArrays: true}> = {
	languages: [undefined]
};
```

@see {@link PartialDeepOptions}

@category Object
@category Array
@category Set
@category Map
*/
type PartialDeep<T, Options extends PartialDeepOptions = {}> = _PartialDeep<T, ApplyDefaultOptions<PartialDeepOptions, DefaultPartialDeepOptions, Options>>;
type _PartialDeep<T, Options extends Required<PartialDeepOptions>> = T extends BuiltIns | ((new (...arguments_: any[]) => unknown)) ? T : IsNever<keyof T> extends true // For functions with no properties
? T : T extends Map<infer KeyType, infer ValueType> ? PartialMapDeep<KeyType, ValueType, Options> : T extends Set<infer ItemType> ? PartialSetDeep<ItemType, Options> : T extends ReadonlyMap<infer KeyType, infer ValueType> ? PartialReadonlyMapDeep<KeyType, ValueType, Options> : T extends ReadonlySet<infer ItemType> ? PartialReadonlySetDeep<ItemType, Options> : T extends object ? T extends ReadonlyArray<infer ItemType> // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
? Options['recurseIntoArrays'] extends true ? ItemType[] extends T // Test for arrays (non-tuples) specifically
? readonly ItemType[] extends T // Differentiate readonly and mutable arrays
? ReadonlyArray<_PartialDeep<Options['allowUndefinedInNonTupleArrays'] extends false ? ItemType : ItemType | undefined, Options>> : Array<_PartialDeep<Options['allowUndefinedInNonTupleArrays'] extends false ? ItemType : ItemType | undefined, Options>> : PartialObjectDeep<T, Options> // Tuples behave properly
: T // If they don't opt into array testing, just use the original type
: PartialObjectDeep<T, Options> : unknown;

/**
Same as `PartialDeep`, but accepts only `Map`s and as inputs. Internal helper for `PartialDeep`.
*/
type PartialMapDeep<KeyType, ValueType, Options extends Required<PartialDeepOptions>> = {} & Map<_PartialDeep<KeyType, Options>, _PartialDeep<ValueType, Options>>;

/**
Same as `PartialDeep`, but accepts only `Set`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialSetDeep<T, Options extends Required<PartialDeepOptions>> = {} & Set<_PartialDeep<T, Options>>;

/**
Same as `PartialDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialReadonlyMapDeep<KeyType, ValueType, Options extends Required<PartialDeepOptions>> = {} & ReadonlyMap<_PartialDeep<KeyType, Options>, _PartialDeep<ValueType, Options>>;

/**
Same as `PartialDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialReadonlySetDeep<T, Options extends Required<PartialDeepOptions>> = {} & ReadonlySet<_PartialDeep<T, Options>>;

/**
Same as `PartialDeep`, but accepts only `object`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialObjectDeep<ObjectType extends object, Options extends Required<PartialDeepOptions>> = (ObjectType extends ((...arguments_: any) => unknown) ? (...arguments_: Parameters<ObjectType>) => ReturnType<ObjectType> : {}) & ({ [KeyType in keyof ObjectType]?: _PartialDeep<ObjectType[KeyType], Options> });
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/required-deep.d.ts
type ExcludeUndefined<T> = Exclude<T, undefined>;

/**
Create a type from another type with all keys and nested keys set to required.

Use-cases:
- Creating optional configuration interfaces where the underlying implementation still requires all options to be fully specified.
- Modeling the resulting type after a deep merge with a set of defaults.

@example
```
import type {RequiredDeep} from 'type-fest';

type Settings = {
	textEditor?: {
		fontSize?: number | undefined;
		fontColor?: string | undefined;
		fontWeight?: number | undefined;
	}
	autocomplete?: boolean | undefined;
	autosave?: boolean | undefined;
};

type RequiredSettings = RequiredDeep<Settings>;
// type RequiredSettings = {
// 	textEditor: {
// 		fontSize: number;
// 		fontColor: string;
// 		fontWeight: number;
// 	}
// 	autocomplete: boolean;
// 	autosave: boolean;
// }
```

Note that types containing overloaded functions are not made deeply required due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

@category Utilities
@category Object
@category Array
@category Set
@category Map
*/
type RequiredDeep<T, E extends ExcludeUndefined<T> = ExcludeUndefined<T>> = E extends BuiltIns ? E : E extends Map<infer KeyType, infer ValueType> ? Map<RequiredDeep<KeyType>, RequiredDeep<ValueType>> : E extends Set<infer ItemType> ? Set<RequiredDeep<ItemType>> : E extends ReadonlyMap<infer KeyType, infer ValueType> ? ReadonlyMap<RequiredDeep<KeyType>, RequiredDeep<ValueType>> : E extends ReadonlySet<infer ItemType> ? ReadonlySet<RequiredDeep<ItemType>> : E extends WeakMap<infer KeyType, infer ValueType> ? WeakMap<RequiredDeep<KeyType>, RequiredDeep<ValueType>> : E extends WeakSet<infer ItemType> ? WeakSet<RequiredDeep<ItemType>> : E extends Promise<infer ValueType> ? Promise<RequiredDeep<ValueType>> : E extends ((...arguments_: any[]) => unknown) ? {} extends RequiredObjectDeep<E> ? E : HasMultipleCallSignatures<E> extends true ? E : ((...arguments_: Parameters<E>) => ReturnType<E>) & RequiredObjectDeep<E> : E extends object ? E extends Array<infer ItemType> // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
? ItemType[] extends E // Test for arrays (non-tuples) specifically
? Array<RequiredDeep<ItemType>> // Recreate relevant array type to prevent eager evaluation of circular reference
: RequiredObjectDeep<E> // Tuples behave properly
: RequiredObjectDeep<E> : unknown;
type RequiredObjectDeep<ObjectType extends object> = { [KeyType in keyof ObjectType]-?: RequiredDeep<ObjectType[KeyType]> };
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/subtract.d.ts
/**
Returns the difference between two numbers.

Note:
- A or B can only support `-999` ~ `999`.

@example
```
import type {Subtract} from 'type-fest';

Subtract<333, 222>;
//=> 111

Subtract<111, -222>;
//=> 333

Subtract<-111, 222>;
//=> -333

Subtract<18, 96>;
//=> -78

Subtract<PositiveInfinity, 9999>;
//=> PositiveInfinity

Subtract<PositiveInfinity, PositiveInfinity>;
//=> number
```

@category Numeric
*/
// TODO: Support big integer.
type Subtract<A extends number, B extends number> =
// Handle cases when A or B is the actual "number" type
number extends A | B ? number
// Handle cases when A and B are both +/- infinity
: A extends B & (PositiveInfinity | NegativeInfinity) ? number
// Handle cases when A is - infinity or B is + infinity
: A extends NegativeInfinity ? NegativeInfinity : B extends PositiveInfinity ? NegativeInfinity
// Handle cases when A is + infinity or B is - infinity
: A extends PositiveInfinity ? PositiveInfinity : B extends NegativeInfinity ? PositiveInfinity
// Handle case when numbers are equal to each other
: A extends B ? 0
// Handle cases when A or B is 0
: A extends 0 ? ReverseSign<B> : B extends 0 ? A
// Handle remaining regular cases
: SubtractPostChecks<A, B>;
/**
Subtracts two numbers A and B, such that they are not equal and neither of them are 0, +/- infinity or the `number` type
*/
type SubtractPostChecks<A extends number, B extends number, AreNegative = [IsNegative<A>, IsNegative<B>]> = AreNegative extends [false, false] ? SubtractPositives<A, B> : AreNegative extends [true, true]
// When both numbers are negative we subtract the absolute values and then reverse the sign
? ReverseSign<SubtractPositives<NumberAbsolute<A>, NumberAbsolute<B>>>
// When the signs are different we can add the absolute values and then reverse the sign if A < B
: [...BuildTuple<NumberAbsolute<A>>, ...BuildTuple<NumberAbsolute<B>>] extends infer R extends unknown[] ? LessThan<A, B> extends true ? ReverseSign<R['length']> : R['length'] : never;

/**
Subtracts two positive numbers.
*/
type SubtractPositives<A extends number, B extends number> = LessThan<A, B> extends true
// When A < B we can reverse the result of B - A
? ReverseSign<SubtractIfAGreaterThanB<B, A>> : SubtractIfAGreaterThanB<A, B>;

/**
Subtracts two positive numbers A and B such that A > B.
*/
type SubtractIfAGreaterThanB<A extends number, B extends number> =
// This is where we always want to end up and do the actual subtraction
BuildTuple<A> extends [...BuildTuple<B>, ...infer R] ? R['length'] : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/paths.d.ts
/**
Paths options.

@see {@link Paths}
*/
type PathsOptions = {
  /**
  The maximum depth to recurse when searching for paths.
  	@default 10
  */
  maxRecursionDepth?: number;

  /**
  Use bracket notation for array indices and numeric object keys.
  	@default false
  	@example
  ```
  type ArrayExample = {
  	array: ['foo'];
  };
  	type A = Paths<ArrayExample, {bracketNotation: false}>;
  //=> 'array' | 'array.0'
  	type B = Paths<ArrayExample, {bracketNotation: true}>;
  //=> 'array' | 'array[0]'
  ```
  	@example
  ```
  type NumberKeyExample = {
  	1: ['foo'];
  };
  	type A = Paths<NumberKeyExample, {bracketNotation: false}>;
  //=> 1 | '1' | '1.0'
  	type B = Paths<NumberKeyExample, {bracketNotation: true}>;
  //=> '[1]' | '[1][0]'
  ```
  */
  bracketNotation?: boolean;

  /**
  Only include leaf paths in the output.
  	@default false
  	@example
  ```
  type Post = {
  	id: number;
  	author: {
  		id: number;
  		name: {
  			first: string;
  			last: string;
  		};
  	};
  };
  	type AllPaths = Paths<Post, {leavesOnly: false}>;
  //=> 'id' | 'author' | 'author.id' | 'author.name' | 'author.name.first' | 'author.name.last'
  	type LeafPaths = Paths<Post, {leavesOnly: true}>;
  //=> 'id' | 'author.id' | 'author.name.first' | 'author.name.last'
  ```
  	@example
  ```
  type ArrayExample = {
  	array: Array<{foo: string}>;
  	tuple: [string, {bar: string}];
  };
  	type AllPaths = Paths<ArrayExample, {leavesOnly: false}>;
  //=> 'array' | `array.${number}` | `array.${number}.foo` | 'tuple' | 'tuple.0' | 'tuple.1' | 'tuple.1.bar'
  	type LeafPaths = Paths<ArrayExample, {leavesOnly: true}>;
  //=> `array.${number}.foo` | 'tuple.0' | 'tuple.1.bar'
  ```
  */
  leavesOnly?: boolean;

  /**
  Only include paths at the specified depth. By default all paths up to {@link PathsOptions.maxRecursionDepth | `maxRecursionDepth`} are included.
  	Note: Depth starts at `0` for root properties.
  	@default number
  	@example
  ```
  type Post = {
  	id: number;
  	author: {
  		id: number;
  		name: {
  			first: string;
  			last: string;
  		};
  	};
  };
  	type DepthZero = Paths<Post, {depth: 0}>;
  //=> 'id' | 'author'
  	type DepthOne = Paths<Post, {depth: 1}>;
  //=> 'author.id' | 'author.name'
  	type DepthTwo = Paths<Post, {depth: 2}>;
  //=> 'author.name.first' | 'author.name.last'
  	type LeavesAtDepthOne = Paths<Post, {leavesOnly: true; depth: 1}>;
  //=> 'author.id'
  ```
  */
  depth?: number;
};
type DefaultPathsOptions = {
  maxRecursionDepth: 10;
  bracketNotation: false;
  leavesOnly: false;
  depth: number;
};

/**
Generate a union of all possible paths to properties in the given object.

It also works with arrays.

Use-case: You want a type-safe way to access deeply nested properties in an object.

@example
```
import type {Paths} from 'type-fest';

type Project = {
	filename: string;
	listA: string[];
	listB: [{filename: string}];
	folder: {
		subfolder: {
			filename: string;
		};
	};
};

type ProjectPaths = Paths<Project>;
//=> 'filename' | 'listA' | 'listB' | 'folder' | `listA.${number}` | 'listB.0' | 'listB.0.filename' | 'folder.subfolder' | 'folder.subfolder.filename'

declare function open<Path extends ProjectPaths>(path: Path): void;

open('filename'); // Pass
open('folder.subfolder'); // Pass
open('folder.subfolder.filename'); // Pass
open('foo'); // TypeError

// Also works with arrays
open('listA.1'); // Pass
open('listB.0'); // Pass
open('listB.1'); // TypeError. Because listB only has one element.
```

@category Object
@category Array
*/
type Paths<T, Options extends PathsOptions = {}> = _Paths<T, ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, Options>>;
type _Paths<T, Options extends Required<PathsOptions>> = T extends NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> ? never : IsAny<T> extends true ? never : T extends UnknownArray ? number extends T['length']
// We need to handle the fixed and non-fixed index part of the array separately.
? InternalPaths<StaticPartOfArray<T>, Options> | InternalPaths<Array<VariablePartOfArray<T>[number]>, Options> : InternalPaths<T, Options> : T extends object ? InternalPaths<T, Options> : never;
type InternalPaths<T, Options extends Required<PathsOptions>> = Options['maxRecursionDepth'] extends infer MaxDepth extends number ? Required<T> extends infer T ? T extends EmptyObject | readonly [] ? never : { [Key in keyof T]: Key extends string | number // Limit `Key` to string or number.
? (Options['bracketNotation'] extends true ? IsNumberLike<Key> extends true ? `[${Key}]` : (Key | ToString<Key>) : never | Options['bracketNotation'] extends false
// If `Key` is a number, return `Key | `${Key}``, because both `array[0]` and `array['0']` work.
? (Key | ToString<Key>) : never) extends infer TranformedKey extends string | number ?
// 1. If style is 'a[0].b' and 'Key' is a numberlike value like 3 or '3', transform 'Key' to `[${Key}]`, else to `${Key}` | Key
// 2. If style is 'a.0.b', transform 'Key' to `${Key}` | Key
((Options['leavesOnly'] extends true ? MaxDepth extends 0 ? TranformedKey : T[Key] extends EmptyObject | readonly [] | NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> ? TranformedKey : never : TranformedKey) extends infer _TransformedKey
// If `depth` is provided, the condition becomes truthy only when it reaches `0`.
// Otherwise, since `depth` defaults to `number`, the condition is always truthy, returning paths at all depths.
? 0 extends Options['depth'] ? _TransformedKey : never : never) | (
// Recursively generate paths for the current key
GreaterThan<MaxDepth, 0> extends true // Limit the depth to prevent infinite recursion
? _Paths<T[Key], {
  bracketNotation: Options['bracketNotation'];
  maxRecursionDepth: Subtract<MaxDepth, 1>;
  leavesOnly: Options['leavesOnly'];
  depth: Subtract<Options['depth'], 1>;
}> extends infer SubPath ? SubPath extends string | number ? (Options['bracketNotation'] extends true ? SubPath extends `[${any}]` | `[${any}]${string}` ? `${TranformedKey}${SubPath}` // If next node is number key like `[3]`, no need to add `.` before it.
: `${TranformedKey}.${SubPath}` : never) | (Options['bracketNotation'] extends false ? `${TranformedKey}.${SubPath}` : never) : never : never : never) : never : never }[keyof T & (T extends UnknownArray ? number : unknown)] : never : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/pick-deep.d.ts
/**
Pick properties from a deeply-nested object.

It supports recursing into arrays.

Use-case: Distill complex objects down to the components you need to target.

@example
```
import type {PickDeep, PartialDeep} from 'type-fest';

type Configuration = {
	userConfig: {
		name: string;
		age: number;
		address: [
			{
				city1: string;
				street1: string;
			},
			{
				city2: string;
				street2: string;
			}
		]
	};
	otherConfig: any;
};

type NameConfig = PickDeep<Configuration, 'userConfig.name'>;
// type NameConfig = {
// 	userConfig: {
// 		name: string;
// 	}
// };

// Supports optional properties
type User = PickDeep<PartialDeep<Configuration>, 'userConfig.name' | 'userConfig.age'>;
// type User = {
// 	userConfig?: {
// 		name?: string;
// 		age?: number;
// 	};
// };

// Supports array
type AddressConfig = PickDeep<Configuration, 'userConfig.address.0'>;
// type AddressConfig = {
// 	userConfig: {
// 		address: [{
// 			city1: string;
// 			street1: string;
// 		}];
// 	};
// }

// Supports recurse into array
type Street = PickDeep<Configuration, 'userConfig.address.1.street2'>;
// type Street = {
// 	userConfig: {
// 		address: [
// 			unknown,
// 			{street2: string}
// 		];
// 	};
// }
```

@category Object
@category Array
*/
type PickDeep<T, PathUnion extends Paths<T>> = T extends NonRecursiveType ? never : T extends UnknownArray ? UnionToIntersection<{ [P in PathUnion]: InternalPickDeep<T, P> }[PathUnion]> : T extends object ? Simplify<UnionToIntersection<{ [P in PathUnion]: InternalPickDeep<T, P> }[PathUnion]>> : never;
/**
Pick an object/array from the given object/array by one path.
*/
type InternalPickDeep<T, Path extends string | number> = T extends NonRecursiveType ? never : T extends UnknownArray ? PickDeepArray<T, Path> : T extends object ? Simplify<PickDeepObject<T, Path>> : never;

/**
Pick an object from the given object by one path.
*/
type PickDeepObject<RecordType extends object, P extends string | number> = P extends `${infer RecordKeyInPath}.${infer SubPath}` ? ObjectValue<RecordType, RecordKeyInPath> extends infer ObjectV ? IsNever<ObjectV> extends false ? BuildObject<RecordKeyInPath, InternalPickDeep<NonNullable<ObjectV>, SubPath>, RecordType> : never : never : ObjectValue<RecordType, P> extends infer ObjectV ? IsNever<ObjectV> extends false ? BuildObject<P, ObjectV, RecordType> : never : never;

/**
Pick an array from the given array by one path.
*/
type PickDeepArray<ArrayType extends UnknownArray, P extends string | number> =
// Handle paths that are `${number}.${string}`
P extends `${infer ArrayIndex extends number}.${infer SubPath}`
// When `ArrayIndex` is equal to `number`
? number extends ArrayIndex ? ArrayType extends unknown[] ? Array<InternalPickDeep<NonNullable<ArrayType[number]>, SubPath>> : ArrayType extends readonly unknown[] ? ReadonlyArray<InternalPickDeep<NonNullable<ArrayType[number]>, SubPath>> : never
// When `ArrayIndex` is a number literal
: ArrayType extends unknown[] ? [...BuildTuple<ArrayIndex>, InternalPickDeep<NonNullable<ArrayType[ArrayIndex]>, SubPath>] : ArrayType extends readonly unknown[] ? readonly [...BuildTuple<ArrayIndex>, InternalPickDeep<NonNullable<ArrayType[ArrayIndex]>, SubPath>] : never
// When the path is equal to `number`
: P extends `${infer ArrayIndex extends number}`
// When `ArrayIndex` is `number`
? number extends ArrayIndex ? ArrayType
// When `ArrayIndex` is a number literal
: ArrayType extends unknown[] ? [...BuildTuple<ArrayIndex>, ArrayType[ArrayIndex]] : ArrayType extends readonly unknown[] ? readonly [...BuildTuple<ArrayIndex>, ArrayType[ArrayIndex]] : never : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/array-splice.d.ts
/**
The implementation of `SplitArrayByIndex` for fixed length arrays.
*/
type SplitFixedArrayByIndex<T extends UnknownArray, SplitIndex extends number> = SplitIndex extends 0 ? [[], T] : T extends readonly [...BuildTuple<SplitIndex>, ...infer V] ? T extends readonly [...infer U, ...V] ? [U, V] : [never, never] : [never, never];

/**
The implementation of `SplitArrayByIndex` for variable length arrays.
*/
type SplitVariableArrayByIndex<T extends UnknownArray, SplitIndex extends number, T1 = Subtract<SplitIndex, StaticPartOfArray<T>['length']>, T2 = (T1 extends number ? BuildTuple<GreaterThanOrEqual<T1, 0> extends true ? T1 : number, VariablePartOfArray<T>[number]> : [])> = SplitIndex extends 0 ? [[], T] : GreaterThanOrEqual<StaticPartOfArray<T>['length'], SplitIndex> extends true ? [SplitFixedArrayByIndex<StaticPartOfArray<T>, SplitIndex>[0], [...SplitFixedArrayByIndex<StaticPartOfArray<T>, SplitIndex>[1], ...VariablePartOfArray<T>]] : [[...StaticPartOfArray<T>, ...(T2 extends UnknownArray ? T2 : [])], VariablePartOfArray<T>];

/**
Split the given array `T` by the given `SplitIndex`.

@example
```
type A = SplitArrayByIndex<[1, 2, 3, 4], 2>;
// type A = [[1, 2], [3, 4]];

type B = SplitArrayByIndex<[1, 2, 3, 4], 0>;
// type B = [[], [1, 2, 3, 4]];
```
*/
type SplitArrayByIndex<T extends UnknownArray, SplitIndex extends number> = SplitIndex extends 0 ? [[], T] : number extends T['length'] ? SplitVariableArrayByIndex<T, SplitIndex> : SplitFixedArrayByIndex<T, SplitIndex>;

/**
Creates a new array type by adding or removing elements at a specified index range in the original array.

Use-case: Replace or insert items in an array type.

Like [`Array#splice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) but for types.

@example
```
type SomeMonths0 = ['January', 'April', 'June'];
type Mouths0 = ArraySplice<SomeMonths0, 1, 0, ['Feb', 'March']>;
//=> type Mouths0 = ['January', 'Feb', 'March', 'April', 'June'];

type SomeMonths1 = ['January', 'April', 'June'];
type Mouths1 = ArraySplice<SomeMonths1, 1, 1>;
//=> type Mouths1 = ['January', 'June'];

type SomeMonths2 = ['January', 'Foo', 'April'];
type Mouths2 = ArraySplice<SomeMonths2, 1, 1, ['Feb', 'March']>;
//=> type Mouths2 = ['January', 'Feb', 'March', 'April'];
```

@category Array
*/
type ArraySplice<T extends UnknownArray, Start extends number, DeleteCount extends number, Items extends UnknownArray = []> = SplitArrayByIndex<T, Start> extends [infer U extends UnknownArray, infer V extends UnknownArray] ? SplitArrayByIndex<V, DeleteCount> extends [infer _Deleted extends UnknownArray, infer X extends UnknownArray] ? [...U, ...Items, ...X] : never // Should never happen
: never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/literal-union.d.ts
type LiteralStringUnion<T> = LiteralUnion<T, string>;
/**
Allows creating a union type by combining primitive types and literal types without sacrificing auto-completion in IDEs for the literal type part of the union.

Currently, when a union type of a primitive type is combined with literal types, TypeScript loses all information about the combined literals. Thus, when such type is used in an IDE with autocompletion, no suggestions are made for the declared literals.

This type is a workaround for [Microsoft/TypeScript#29729](https://github.com/Microsoft/TypeScript/issues/29729). It will be removed as soon as it's not needed anymore.

@example
```
import type {LiteralUnion} from 'type-fest';

// Before

type Pet = 'dog' | 'cat' | string;

const pet: Pet = '';
// Start typing in your TypeScript-enabled IDE.
// You **will not** get auto-completion for `dog` and `cat` literals.

// After

type Pet2 = LiteralUnion<'dog' | 'cat', string>;

const pet: Pet2 = '';
// You **will** get auto-completion for `dog` and `cat` literals.
```

@category Type
*/
type LiteralUnion<LiteralType, BaseType extends Primitive> = LiteralType | (BaseType & Record<never, never>);
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/union-to-tuple.d.ts
/**
Returns the last element of a union type.

@example
```
type Last = LastOfUnion<1 | 2 | 3>;
//=> 3
```
*/
type LastOfUnion<T> = UnionToIntersection<T extends any ? () => T : never> extends (() => (infer R)) ? R : never;

/**
Convert a union type into an unordered tuple type of its elements.

"Unordered" means the elements of the tuple are not guaranteed to be in the same order as in the union type. The arrangement can appear random and may change at any time.

This can be useful when you have objects with a finite set of keys and want a type defining only the allowed keys, but do not want to repeat yourself.

@example
```
import type {UnionToTuple} from 'type-fest';

type Numbers = 1 | 2 | 3;
type NumbersTuple = UnionToTuple<Numbers>;
//=> [1, 2, 3]
```

@example
```
import type {UnionToTuple} from 'type-fest';

const pets = {
  dog: '🐶',
  cat: '🐱',
  snake: '🐍',
};

type Pet = keyof typeof pets;
//=> 'dog' | 'cat' | 'snake'

const petList = Object.keys(pets) as UnionToTuple<Pet>;
//=> ['dog', 'cat', 'snake']
```

@category Array
*/
type UnionToTuple<T, L = LastOfUnion<T>> = IsNever<T> extends false ? [...UnionToTuple<Exclude<T, L>>, L] : [];
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/omit-deep.d.ts
/**
Omit properties from a deeply-nested object.

It supports recursing into arrays.

It supports removing specific items from an array, replacing each removed item with unknown at the specified index.

Use-case: Remove unneeded parts of complex objects.

Use [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys) if you only need one level deep.

@example
```
import type {OmitDeep} from 'type-fest';

type Info = {
	userInfo: {
		name: string;
		uselessInfo: {
			foo: string;
		};
	};
};

type UsefulInfo = OmitDeep<Info, 'userInfo.uselessInfo'>;
// type UsefulInfo = {
// 	userInfo: {
// 		name: string;
// 	};
// };

// Supports removing multiple paths
type Info1 = {
	userInfo: {
		name: string;
		uselessField: string;
		uselessInfo: {
			foo: string;
		};
	};
};

type UsefulInfo1 = OmitDeep<Info1, 'userInfo.uselessInfo' | 'userInfo.uselessField'>;
// type UsefulInfo1 = {
// 	userInfo: {
// 		name: string;
// 	};
// };

// Supports array
type A = OmitDeep<[1, 'foo', 2], 1>;
// type A = [1, unknown, 2];

// Supports recursing into array

type Info1 = {
	address: [
		{
			street: string
		},
		{
			street2: string,
			foo: string
		};
	];
}
type AddressInfo = OmitDeep<Info1, 'address.1.foo'>;
// type AddressInfo = {
// 	address: [
// 		{
// 			street: string;
// 		},
// 		{
// 			street2: string;
// 		};
// 	];
// };
```

@category Object
@category Array
*/
type OmitDeep<T, PathUnion extends LiteralUnion<Paths<T>, string>> = SimplifyDeep<OmitDeepHelper<T, UnionToTuple<PathUnion>>, UnknownArray>;
/**
Internal helper for {@link OmitDeep}.

Recursively transforms `T` by applying {@link OmitDeepWithOnePath} for each path in `PathTuple`.
*/
type OmitDeepHelper<T, PathTuple extends UnknownArray> = PathTuple extends [infer Path, ...infer RestPaths] ? OmitDeepHelper<OmitDeepWithOnePath<T, Path & (string | number)>, RestPaths> : T;

/**
Omit one path from the given object/array.
*/
type OmitDeepWithOnePath<T, Path extends string | number> = T extends NonRecursiveType ? T : T extends UnknownArray ? SetArrayAccess<OmitDeepArrayWithOnePath<T, Path>, IsArrayReadonly<T>> : T extends object ? OmitDeepObjectWithOnePath<T, Path> : T;

/**
Omit one path from the given object.
*/
type OmitDeepObjectWithOnePath<ObjectT extends object, P extends string | number> = P extends `${infer RecordKeyInPath}.${infer SubPath}` ? { [Key in keyof ObjectT]: IsEqual<RecordKeyInPath, ToString<Key>> extends true ? ExactKey<ObjectT, Key> extends infer RealKey ? RealKey extends keyof ObjectT ? OmitDeepWithOnePath<ObjectT[RealKey], SubPath> : ObjectT[Key] : ObjectT[Key] : ObjectT[Key] } : ExactKey<ObjectT, P> extends infer Key ? IsNever<Key> extends true ? ObjectT : Key extends PropertyKey ? Omit<ObjectT, Key> : ObjectT : ObjectT;

/**
Omit one path from from the given array.

It replaces the item to `unknown` at the given index.

@example
```
type A = OmitDeepArrayWithOnePath<[10, 20, 30, 40], 2>;
//=> type A = [10, 20, unknown, 40];
```
*/
type OmitDeepArrayWithOnePath<ArrayType extends UnknownArray, P extends string | number> =
// Handle paths that are `${number}.${string}`
P extends `${infer ArrayIndex extends number}.${infer SubPath}`
// If `ArrayIndex` is equal to `number`
? number extends ArrayIndex ? Array<OmitDeepWithOnePath<NonNullable<ArrayType[number]>, SubPath>>
// If `ArrayIndex` is a number literal
: ArraySplice<ArrayType, ArrayIndex, 1, [OmitDeepWithOnePath<NonNullable<ArrayType[ArrayIndex]>, SubPath>]>
// If the path is equal to `number`
: P extends `${infer ArrayIndex extends number}`
// If `ArrayIndex` is `number`
? number extends ArrayIndex ? []
// If `ArrayIndex` is a number literal
: ArraySplice<ArrayType, ArrayIndex, 1, [unknown]> : ArrayType;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/is-null.d.ts
/**
Returns a boolean for whether the given type is `null`.

@example
```
import type {IsNull} from 'type-fest';

type NonNullFallback<T, Fallback> = IsNull<T> extends true ? Fallback : T;

type Example1 = NonNullFallback<null, string>;
//=> string

type Example2 = NonNullFallback<number, string>;
//=? number
```

@category Type Guard
@category Utilities
*/
type IsNull<T> = [T] extends [null] ? true : false;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/is-unknown.d.ts
/**
Returns a boolean for whether the given type is `unknown`.

@link https://github.com/dsherret/conditional-type-checks/pull/16

Useful in type utilities, such as when dealing with unknown data from API calls.

@example
```
import type {IsUnknown} from 'type-fest';

// https://github.com/pajecawav/tiny-global-store/blob/master/src/index.ts
type Action<TState, TPayload = void> =
	IsUnknown<TPayload> extends true
		? (state: TState) => TState,
		: (state: TState, payload: TPayload) => TState;

class Store<TState> {
	constructor(private state: TState) {}

	execute<TPayload = void>(action: Action<TState, TPayload>, payload?: TPayload): TState {
		this.state = action(this.state, payload);
		return this.state;
	}

	// ... other methods
}

const store = new Store({value: 1});
declare const someExternalData: unknown;

store.execute(state => ({value: state.value + 1}));
//=> `TPayload` is `void`

store.execute((state, payload) => ({value: state.value + payload}), 5);
//=> `TPayload` is `5`

store.execute((state, payload) => ({value: state.value + payload}), someExternalData);
//=> Errors: `action` is `(state: TState) => TState`
```

@category Utilities
*/
type IsUnknown<T> = (unknown extends T // `T` can be `unknown` or `any`
? IsNull<T> extends false // `any` can be `null`, but `unknown` can't be
? true : false : false);
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/if-unknown.d.ts
/**
An if-else-like type that resolves depending on whether the given type is `unknown`.

@see {@link IsUnknown}

@example
```
import type {IfUnknown} from 'type-fest';

type ShouldBeTrue = IfUnknown<unknown>;
//=> true

type ShouldBeBar = IfUnknown<'not unknown', 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
*/
type IfUnknown<T, TypeIfUnknown = true, TypeIfNotUnknown = false> = (IsUnknown<T> extends true ? TypeIfUnknown : TypeIfNotUnknown);
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/partial-on-undefined-deep.d.ts
/**
@see PartialOnUndefinedDeep
*/
type PartialOnUndefinedDeepOptions = {
  /**
  Whether to affect the individual elements of arrays and tuples.
  	@default false
  */
  readonly recurseIntoArrays?: boolean;
};
type DefaultPartialOnUndefinedDeepOptions = {
  recurseIntoArrays: false;
};

/**
Create a deep version of another type where all keys accepting `undefined` type are set to optional.

This utility type is recursive, transforming at any level deep. By default, it does not affect arrays and tuples items unless you explicitly pass `{recurseIntoArrays: true}` as the second type argument.

Use-cases:
- Make all properties of a type that can be undefined optional to not have to specify keys with undefined value.

@example
```
import type {PartialOnUndefinedDeep} from 'type-fest';

interface Settings {
	optionA: string;
	optionB: number | undefined;
	subOption: {
		subOptionA: boolean;
		subOptionB: boolean | undefined;
	}
};

const testSettings: PartialOnUndefinedDeep<Settings> = {
	optionA: 'foo',
	// 👉 optionB is now optional and can be omitted
	subOption: {
		subOptionA: true,
		// 👉 subOptionB is now optional as well and can be omitted
	},
};
```

@category Object
*/
type PartialOnUndefinedDeep<T, Options extends PartialOnUndefinedDeepOptions = {}> = _PartialOnUndefinedDeep<T, ApplyDefaultOptions<PartialOnUndefinedDeepOptions, DefaultPartialOnUndefinedDeepOptions, Options>>;
type _PartialOnUndefinedDeep<T, Options extends Required<PartialOnUndefinedDeepOptions>> = T extends Record<any, any> | undefined ? { [KeyType in keyof T as undefined extends T[KeyType] ? IfUnknown<T[KeyType], never, KeyType> : never]?: PartialOnUndefinedDeepValue<T[KeyType], Options> } extends infer U // Make a partial type with all value types accepting undefined (and set them optional)
? Merge<{ [KeyType in keyof T as KeyType extends LiteralKeyOf<U> ? never : KeyType]: PartialOnUndefinedDeepValue<T[KeyType], Options> }, U> // Join all remaining keys not treated in U
: never // Should not happen
: T;

/**
Utility type to get the value type by key and recursively call `PartialOnUndefinedDeep` to transform sub-objects.
*/
type PartialOnUndefinedDeepValue<T, Options extends Required<PartialOnUndefinedDeepOptions>> = T extends BuiltIns | ((...arguments_: any[]) => unknown) ? T : T extends ReadonlyArray<infer U> // Test if type is array or tuple
? Options['recurseIntoArrays'] extends true // Check if option is activated
? U[] extends T // Check if array not tuple
? readonly U[] extends T ? ReadonlyArray<_PartialOnUndefinedDeep<U, Options>> // Readonly array treatment
: Array<_PartialOnUndefinedDeep<U, Options>> // Mutable array treatment
: _PartialOnUndefinedDeep<{ [Key in keyof T]: _PartialOnUndefinedDeep<T[Key], Options> }, Options> // Tuple treatment
: T : T extends Record<any, any> | undefined ? _PartialOnUndefinedDeep<T, Options> : unknown;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/undefined-on-partial-deep.d.ts
/**
Create a deep version of another type where all optional keys are set to also accept `undefined`.

Note: This is only needed when the [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes) TSConfig setting is enabled.

Use-cases:
- When `exactOptionalPropertyTypes` is enabled, an object like `{a: undefined}` is not assignable to the type `{a?: number}`. You can use `UndefinedOnPartialDeep<{a?: number}>` to make it assignable.

@example
```
import type {UndefinedOnPartialDeep} from 'type-fest';

interface Settings {
	optionA: string;
	optionB?: number;
	subOption: {
		subOptionA: boolean;
		subOptionB?: boolean;
	}
};

const testSettingsA: Settings = {
	optionA: 'foo',
	optionB: undefined, // TypeScript error if `exactOptionalPropertyTypes` is true.
	subOption: {
		subOptionA: true,
		subOptionB: undefined, // TypeScript error if `exactOptionalPropertyTypes` is true
	},
};

const testSettingsB: UndefinedOnPartialDeep<Settings> = {
	optionA: 'foo',
	optionB: undefined, // 👉 `optionB` can be set to undefined now.
	subOption: {
		subOptionA: true,
		subOptionB: undefined, // 👉 `subOptionB` can be set to undefined now.
	},
};
```
*/
type UndefinedOnPartialDeep<T> =
// Handle built-in type and function
T extends BuiltIns | Function ? T
// Handle tuple and array
: T extends readonly unknown[] ? UndefinedOnPartialList<T>
// Handle map and readonly map
: T extends Map<infer K, infer V> ? Map<K, UndefinedOnPartialDeep<V>> : T extends ReadonlyMap<infer K, infer V> ? ReadonlyMap<K, UndefinedOnPartialDeep<V>>
// Handle set and readonly set
: T extends Set<infer K> ? Set<UndefinedOnPartialDeep<K>> : T extends ReadonlySet<infer K> ? ReadonlySet<UndefinedOnPartialDeep<K>>
// Handle object
: T extends Record<any, any> ? { [KeyType in keyof T]: undefined extends T[KeyType] ? UndefinedOnPartialDeep<T[KeyType]> | undefined : UndefinedOnPartialDeep<T[KeyType]> } : T;
// If T is not builtins / function / array / map / set / object, return T

// Handle tuples and arrays
type UndefinedOnPartialList<T extends readonly unknown[]> = T extends [] ? [] : T extends [infer F, ...infer R] ? [UndefinedOnPartialDeep<F>, ...UndefinedOnPartialDeep<R>] : T extends readonly [infer F, ...infer R] ? readonly [UndefinedOnPartialDeep<F>, ...UndefinedOnPartialDeep<R>] : T extends Array<infer F> ? Array<UndefinedOnPartialDeep<F>> : T extends ReadonlyArray<infer F> ? ReadonlyArray<UndefinedOnPartialDeep<F>> : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/readonly-deep.d.ts
/**
Convert `object`s, `Map`s, `Set`s, and `Array`s and all of their keys/elements into immutable structures recursively.

This is useful when a deeply nested structure needs to be exposed as completely immutable, for example, an imported JSON module or when receiving an API response that is passed around.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/13923) if you want to have this type as a built-in in TypeScript.

@example
```
// data.json
{
	"foo": ["bar"]
}

// main.ts
import type {ReadonlyDeep} from 'type-fest';
import dataJson = require('./data.json');

const data: ReadonlyDeep<typeof dataJson> = dataJson;

export default data;

// test.ts
import data from './main';

data.foo.push('bar');
//=> error TS2339: Property 'push' does not exist on type 'readonly string[]'
```

Note that types containing overloaded functions are not made deeply readonly due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

@category Object
@category Array
@category Set
@category Map
*/
type ReadonlyDeep<T> = T extends BuiltIns ? T : T extends (new (...arguments_: any[]) => unknown) ? T // Skip class constructors
: T extends ((...arguments_: any[]) => unknown) ? {} extends ReadonlyObjectDeep<T> ? T : HasMultipleCallSignatures<T> extends true ? T : ((...arguments_: Parameters<T>) => ReturnType<T>) & ReadonlyObjectDeep<T> : T extends Readonly<ReadonlyMap<infer KeyType, infer ValueType>> ? ReadonlyMapDeep<KeyType, ValueType> : T extends Readonly<ReadonlySet<infer ItemType>> ? ReadonlySetDeep<ItemType> :
// Identify tuples to avoid converting them to arrays inadvertently; special case `readonly [...never[]]`, as it emerges undesirably from recursive invocations of ReadonlyDeep below.
T extends readonly [] | readonly [...never[]] ? readonly [] : T extends readonly [infer U, ...infer V] ? readonly [ReadonlyDeep<U>, ...ReadonlyDeep<V>] : T extends readonly [...infer U, infer V] ? readonly [...ReadonlyDeep<U>, ReadonlyDeep<V>] : T extends ReadonlyArray<infer ItemType> ? ReadonlyArray<ReadonlyDeep<ItemType>> : T extends object ? ReadonlyObjectDeep<T> : unknown;
/**
Same as `ReadonlyDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `ReadonlyDeep`.
*/
type ReadonlyMapDeep<KeyType, ValueType> = {} & Readonly<ReadonlyMap<ReadonlyDeep<KeyType>, ReadonlyDeep<ValueType>>>;

/**
Same as `ReadonlyDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `ReadonlyDeep`.
*/
type ReadonlySetDeep<ItemType> = {} & Readonly<ReadonlySet<ReadonlyDeep<ItemType>>>;

/**
Same as `ReadonlyDeep`, but accepts only `object`s as inputs. Internal helper for `ReadonlyDeep`.
*/
type ReadonlyObjectDeep<ObjectType extends object> = { readonly [KeyType in keyof ObjectType]: ReadonlyDeep<ObjectType[KeyType]> };
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/promisable.d.ts
/**
Create a type that represents either the value or the value wrapped in `PromiseLike`.

Use-cases:
- A function accepts a callback that may either return a value synchronously or may return a promised value.
- This type could be the return type of `Promise#then()`, `Promise#catch()`, and `Promise#finally()` callbacks.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/31394) if you want to have this type as a built-in in TypeScript.

@example
```
import type {Promisable} from 'type-fest';

async function logger(getLogEntry: () => Promisable<string>): Promise<void> {
	const entry = await getLogEntry();
	console.log(entry);
}

logger(() => 'foo');
logger(() => Promise.resolve('bar'));
```

@category Async
*/
type Promisable<T> = T | PromiseLike<T>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/arrayable.d.ts
/**
Create a type that represents either the value or an array of the value.

@see Promisable

@example
```
import type {Arrayable} from 'type-fest';

function bundle(input: string, output: Arrayable<string>) {
	const outputList = Array.isArray(output) ? output : [output];

	// …

	for (const output of outputList) {
		console.log(`write to: ${output}`);
	}
}

bundle('src/index.js', 'dist/index.js');
bundle('src/index.js', ['dist/index.cjs', 'dist/index.mjs']);
```

@category Array
*/
type Arrayable<T> = T
// TODO: Use `readonly T[]` when this issue is resolved: https://github.com/microsoft/TypeScript/issues/17002
| T[];
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/tagged.d.ts
declare const tag: unique symbol;
type TagContainer<Token> = {
  readonly [tag]: Token;
};
type Tag<Token extends PropertyKey, TagMetadata> = TagContainer<{ [K in Token]: TagMetadata }>;

/**
Attach a "tag" to an arbitrary type. This allows you to create distinct types, that aren't assignable to one another, for distinct concepts in your program that should not be interchangeable, even if their runtime values have the same type. (See examples.)

A type returned by `Tagged` can be passed to `Tagged` again, to create a type with multiple tags.

[Read more about tagged types.](https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d)

A tag's name is usually a string (and must be a string, number, or symbol), but each application of a tag can also contain an arbitrary type as its "metadata". See {@link GetTagMetadata} for examples and explanation.

A type `A` returned by `Tagged` is assignable to another type `B` returned by `Tagged` if and only if:
  - the underlying (untagged) type of `A` is assignable to the underlying type of `B`;
	- `A` contains at least all the tags `B` has;
	- and the metadata type for each of `A`'s tags is assignable to the metadata type of `B`'s corresponding tag.

There have been several discussions about adding similar features to TypeScript. Unfortunately, nothing has (yet) moved forward:
	- [Microsoft/TypeScript#202](https://github.com/microsoft/TypeScript/issues/202)
	- [Microsoft/TypeScript#4895](https://github.com/microsoft/TypeScript/issues/4895)
	- [Microsoft/TypeScript#33290](https://github.com/microsoft/TypeScript/pull/33290)

@example
```
import type {Tagged} from 'type-fest';

type AccountNumber = Tagged<number, 'AccountNumber'>;
type AccountBalance = Tagged<number, 'AccountBalance'>;

function createAccountNumber(): AccountNumber {
	// As you can see, casting from a `number` (the underlying type being tagged) is allowed.
	return 2 as AccountNumber;
}

function getMoneyForAccount(accountNumber: AccountNumber): AccountBalance {
	return 4 as AccountBalance;
}

// This will compile successfully.
getMoneyForAccount(createAccountNumber());

// But this won't, because it has to be explicitly passed as an `AccountNumber` type!
// Critically, you could not accidentally use an `AccountBalance` as an `AccountNumber`.
getMoneyForAccount(2);

// You can also use tagged values like their underlying, untagged type.
// I.e., this will compile successfully because an `AccountNumber` can be used as a regular `number`.
// In this sense, the underlying base type is not hidden, which differentiates tagged types from opaque types in other languages.
const accountNumber = createAccountNumber() + 2;
```

@example
```
import type {Tagged} from 'type-fest';

// You can apply multiple tags to a type by using `Tagged` repeatedly.
type Url = Tagged<string, 'URL'>;
type SpecialCacheKey = Tagged<Url, 'SpecialCacheKey'>;

// You can also pass a union of tag names, so this is equivalent to the above, although it doesn't give you the ability to assign distinct metadata to each tag.
type SpecialCacheKey2 = Tagged<string, 'URL' | 'SpecialCacheKey'>;
```

@category Type
*/
type Tagged<Type, TagName extends PropertyKey, TagMetadata = never> = Type & Tag<TagName, TagMetadata>;
/**
Given a type and a tag name, returns the metadata associated with that tag on that type.

In the example below, one could use `Tagged<string, 'JSON'>` to represent "a string that is valid JSON". That type might be useful -- for instance, it communicates that the value can be safely passed to `JSON.parse` without it throwing an exception. However, it doesn't indicate what type of value will be produced on parse (which is sometimes known). `JsonOf<T>` solves this; it represents "a string that is valid JSON and that, if parsed, would produce a value of type T". The type T is held in the metadata associated with the `'JSON'` tag.

This article explains more about [how tag metadata works and when it can be useful](https://medium.com/@ethanresnick/advanced-typescript-tagged-types-improved-with-type-level-metadata-5072fc125fcf).

@example
```
import type {Tagged} from 'type-fest';

type JsonOf<T> = Tagged<string, 'JSON', T>;

function stringify<T>(it: T) {
  return JSON.stringify(it) as JsonOf<T>;
}

function parse<T extends JsonOf<unknown>>(it: T) {
  return JSON.parse(it) as GetTagMetadata<T, 'JSON'>;
}

const x = stringify({ hello: 'world' });
const parsed = parse(x); // The type of `parsed` is { hello: string }
```

@category Type
*/
type GetTagMetadata<Type extends Tag<TagName, unknown>, TagName extends PropertyKey> = Type[typeof tag][TagName];
/**
Revert a tagged type back to its original type by removing all tags.

Why is this necessary?

1. Use a `Tagged` type as object keys
2. Prevent TS4058 error: "Return type of exported function has or is using name X from external module Y but cannot be named"

@example
```
import type {Tagged, UnwrapTagged} from 'type-fest';

type AccountType = Tagged<'SAVINGS' | 'CHECKING', 'AccountType'>;

const moneyByAccountType: Record<UnwrapTagged<AccountType>, number> = {
	SAVINGS: 99,
	CHECKING: 0.1
};

// Without UnwrapTagged, the following expression would throw a type error.
const money = moneyByAccountType.SAVINGS; // TS error: Property 'SAVINGS' does not exist

// Attempting to pass an non-Tagged type to UnwrapTagged will raise a type error.
type WontWork = UnwrapTagged<string>;
```

@category Type
*/
type UnwrapTagged<TaggedType extends Tag<PropertyKey, any>> = RemoveAllTags<TaggedType>;
type RemoveAllTags<T> = T extends Tag<PropertyKey, any> ? { [ThisTag in keyof T[typeof tag]]: T extends Tagged<infer Type, ThisTag, T[typeof tag][ThisTag]> ? RemoveAllTags<Type> : never }[keyof T[typeof tag]] : T;

/**
Note: The `Opaque` type is deprecated in favor of `Tagged`.

Attach a "tag" to an arbitrary type. This allows you to create distinct types, that aren't assignable to one another, for runtime values that would otherwise have the same type. (See examples.)

The generic type parameters can be anything.

Note that `Opaque` is somewhat of a misnomer here, in that, unlike [some alternative implementations](https://github.com/microsoft/TypeScript/issues/4895#issuecomment-425132582), the original, untagged type is not actually hidden. (E.g., functions that accept the untagged type can still be called with the "opaque" version -- but not vice-versa.)

Also note that this implementation is limited to a single tag. If you want to allow multiple tags, use `Tagged` instead.

[Read more about tagged types.](https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d)

There have been several discussions about adding similar features to TypeScript. Unfortunately, nothing has (yet) moved forward:
	- [Microsoft/TypeScript#202](https://github.com/microsoft/TypeScript/issues/202)
	- [Microsoft/TypeScript#15408](https://github.com/Microsoft/TypeScript/issues/15408)
	- [Microsoft/TypeScript#15807](https://github.com/Microsoft/TypeScript/issues/15807)

@example
```
import type {Opaque} from 'type-fest';

type AccountNumber = Opaque<number, 'AccountNumber'>;
type AccountBalance = Opaque<number, 'AccountBalance'>;

// The `Token` parameter allows the compiler to differentiate between types, whereas "unknown" will not. For example, consider the following structures:
type ThingOne = Opaque<string>;
type ThingTwo = Opaque<string>;

// To the compiler, these types are allowed to be cast to each other as they have the same underlying type. They are both `string & { __opaque__: unknown }`.
// To avoid this behaviour, you would instead pass the "Token" parameter, like so.
type NewThingOne = Opaque<string, 'ThingOne'>;
type NewThingTwo = Opaque<string, 'ThingTwo'>;

// Now they're completely separate types, so the following will fail to compile.
function createNewThingOne (): NewThingOne {
	// As you can see, casting from a string is still allowed. However, you may not cast NewThingOne to NewThingTwo, and vice versa.
	return 'new thing one' as NewThingOne;
}

// This will fail to compile, as they are fundamentally different types.
const thingTwo = createNewThingOne() as NewThingTwo;

// Here's another example of opaque typing.
function createAccountNumber(): AccountNumber {
	return 2 as AccountNumber;
}

function getMoneyForAccount(accountNumber: AccountNumber): AccountBalance {
	return 4 as AccountBalance;
}

// This will compile successfully.
getMoneyForAccount(createAccountNumber());

// But this won't, because it has to be explicitly passed as an `AccountNumber` type.
getMoneyForAccount(2);

// You can use opaque values like they aren't opaque too.
const accountNumber = createAccountNumber();

// This will compile successfully.
const newAccountNumber = accountNumber + 2;

// As a side note, you can (and should) use recursive types for your opaque types to make them stronger and hopefully easier to type.
type Person = {
	id: Opaque<number, Person>;
	name: string;
};
```

@category Type
@deprecated Use {@link Tagged} instead
*/
type Opaque<Type, Token = unknown> = Type & TagContainer<Token>;
/**
Note: The `UnwrapOpaque` type is deprecated in favor of `UnwrapTagged`.

Revert an opaque or tagged type back to its original type by removing the readonly `[tag]`.

Why is this necessary?

1. Use an `Opaque` type as object keys
2. Prevent TS4058 error: "Return type of exported function has or is using name X from external module Y but cannot be named"

@example
```
import type {Opaque, UnwrapOpaque} from 'type-fest';

type AccountType = Opaque<'SAVINGS' | 'CHECKING', 'AccountType'>;

const moneyByAccountType: Record<UnwrapOpaque<AccountType>, number> = {
	SAVINGS: 99,
	CHECKING: 0.1
};

// Without UnwrapOpaque, the following expression would throw a type error.
const money = moneyByAccountType.SAVINGS; // TS error: Property 'SAVINGS' does not exist

// Attempting to pass an non-Opaque type to UnwrapOpaque will raise a type error.
type WontWork = UnwrapOpaque<string>;

// Using a Tagged type will work too.
type WillWork = UnwrapOpaque<Tagged<number, 'AccountNumber'>>; // number
```

@category Type
@deprecated Use {@link UnwrapTagged} instead
*/
type UnwrapOpaque<OpaqueType extends TagContainer<unknown>> = OpaqueType extends Tag<PropertyKey, any> ? RemoveAllTags<OpaqueType> : OpaqueType extends Opaque<infer Type, OpaqueType[typeof tag]> ? Type : OpaqueType;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/invariant-of.d.ts
declare const invariantBrand: unique symbol;

/**
Create an [invariant type](https://basarat.gitbook.io/typescript/type-system/type-compatibility#footnote-invariance), which is a type that does not accept supertypes and subtypes.

Use-case:
- Prevent runtime errors that may occur due to assigning subtypes to supertypes.
- Improve type signature of object methods like [`Object.keys()` or `Object.entries()`](https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208) by sealing the object type.

@example
```
import type {InvariantOf} from 'type-fest';

class Animal {
	constructor(public name: string){}
}

class Cat extends Animal {
	meow() {}
}

let animalArray: Animal[] = [animal];
let catArray: Cat[] = [cat];

animalArray = catArray; // Okay if covariant
animalArray.push(new Animal('another animal')); // Pushed an animal into catArray
catArray.forEach(c => c.meow()); // Allowed but, error at runtime

let invariantAnimalArray: InvariantOf<Animal>[] = [animal] as InvariantOf<Animal>[];
let invariantCatArray: InvariantOf<Cat>[] = [cat] as InvariantOf<Cat>[];

invariantAnimalArray = invariantCatArray; // Error: Type 'InvariantOf<Cat>[]' is not assignable to type 'InvariantOf<Animal>[]'.
```

@example
```
import type {InvariantOf} from 'type-fest';

// In covariance (default)

interface FooBar {
	foo: number;
	bar: string
}

interface FooBarBaz extends FooBar {
	baz: boolean
}

declare const fooBar: FooBar
declare const fooBarBaz: FooBarBaz

function keyOfFooBar(fooBar: FooBar) {
	return Object.keys(fooBar) as (keyof FooBar)[]
}

keyOfFooBar(fooBar) //=> (keyof FooBar)[]
keyOfFooBar(fooBarBaz) //=> (keyof FooBar)[] but, (keyof FooBarBaz)[] at runtime

// In invariance

export function invariantOf<Type>(value: Type): InvariantOf<Type> {
	return value as InvariantOf<Type>;
}

function keyOfInvariantFooBar(fooBar: InvariantOf<FooBar>) {
	return Object.keys(fooBar) as (keyof FooBar)[]
}

keyOfInvariantFooBar(invariantOf(fooBar)); // (keyof FooBar)[]
keyOfInvariantFooBar(invariantOf(fooBarBaz)); // Error: Argument of type 'InvariantOf<FooBarBaz>' is not assignable to parameter of type 'InvariantOf<FooBar>'.
```

@category Type
*/
type InvariantOf<Type> = Type & {
  [invariantBrand]: (_: Type) => Type;
};
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/set-optional.d.ts
/**
Create a type that makes the given keys optional. The remaining keys are kept as is. The sister of the `SetRequired` type.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are optional.

@example
```
import type {SetOptional} from 'type-fest';

type Foo = {
	a: number;
	b?: string;
	c: boolean;
}

type SomeOptional = SetOptional<Foo, 'b' | 'c'>;
// type SomeOptional = {
// 	a: number;
// 	b?: string; // Was already optional and still is.
// 	c?: boolean; // Is now optional.
// }
```

@category Object
*/
type SetOptional<BaseType, Keys extends keyof BaseType> = BaseType extends unknown // To distribute `BaseType` when it's a union type.
? Simplify<
// Pick just the keys that are readonly from the base type.
Except<BaseType, Keys> &
// Pick the keys that should be mutable from the base type and make them mutable.
Partial<HomomorphicPick<BaseType, Keys>>> : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/set-readonly.d.ts
/**
Create a type that makes the given keys readonly. The remaining keys are kept as is.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are readonly.

@example
```
import type {SetReadonly} from 'type-fest';

type Foo = {
	a: number;
	readonly b: string;
	c: boolean;
}

type SomeReadonly = SetReadonly<Foo, 'b' | 'c'>;
// type SomeReadonly = {
// 	a: number;
// 	readonly b: string; // Was already readonly and still is.
// 	readonly c: boolean; // Is now readonly.
// }
```

@category Object
*/
type SetReadonly<BaseType, Keys extends keyof BaseType> =
// `extends unknown` is always going to be the case and is used to convert any
// union into a [distributive conditional
// type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
BaseType extends unknown ? Simplify<Except<BaseType, Keys> & Readonly<HomomorphicPick<BaseType, Keys>>> : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/set-required.d.ts
/**
Create a type that makes the given keys required. The remaining keys are kept as is. The sister of the `SetOptional` type.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are required.

@example
```
import type {SetRequired} from 'type-fest';

type Foo = {
	a?: number;
	b: string;
	c?: boolean;
}

type SomeRequired = SetRequired<Foo, 'b' | 'c'>;
// type SomeRequired = {
// 	a?: number;
// 	b: string; // Was already required and still is.
// 	c: boolean; // Is now required.
// }

// Set specific indices in an array to be required.
type ArrayExample = SetRequired<[number?, number?, number?], 0 | 1>;
//=> [number, number, number?]
```

@category Object
*/
type SetRequired<BaseType, Keys extends keyof BaseType> = BaseType extends UnknownArray ? SetArrayRequired<BaseType, Keys> extends infer ResultantArray ? IfArrayReadonly<BaseType, Readonly<ResultantArray>, ResultantArray> : never : Simplify<
// Pick just the keys that are optional from the base type.
Except<BaseType, Keys> &
// Pick the keys that should be required from the base type and make them required.
Required<HomomorphicPick<BaseType, Keys>>>;
/**
Remove the optional modifier from the specified keys in an array.
*/
type SetArrayRequired<TArray extends UnknownArray, Keys, Counter extends any[] = [], Accumulator extends UnknownArray = []> = TArray extends unknown // For distributing `TArray` when it's a union
? keyof TArray & `${number}` extends never
// Exit if `TArray` is empty (e.g., []), or
// `TArray` contains no non-rest elements preceding the rest element (e.g., `[...string[]]` or `[...string[], string]`).
? [...Accumulator, ...TArray] : TArray extends readonly [(infer First)?, ...infer Rest] ? '0' extends OptionalKeysOf<TArray> // If the first element of `TArray` is optional
? `${Counter['length']}` extends `${Keys & (string | number)}` // If the current index needs to be required
? SetArrayRequired<Rest, Keys, [...Counter, any], [...Accumulator, First]>
// If the current element is optional, but it doesn't need to be required,
// then we can exit early, since no further elements can now be made required.
: [...Accumulator, ...TArray] : SetArrayRequired<Rest, Keys, [...Counter, any], [...Accumulator, TArray[0]]> : never // Should never happen, since `[(infer F)?, ...infer R]` is a top-type for arrays.
: never; // Should never happen
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/set-required-deep.d.ts
/**
Create a type that makes the given keys required. You can specify deeply nested key paths. The remaining keys are kept as is.

Use-case: Selectively make nested properties required in complex types like models.

@example
```
import type {SetRequiredDeep} from 'type-fest';

type Foo = {
	a?: number;
	b?: string;
	c?: {
		d?: number
	}[]
}

type SomeRequiredDeep = SetRequiredDeep<Foo, 'a' | `c.${number}.d`>;
// type SomeRequiredDeep = {
// 	a: number; // Is now required
// 	b?: string;
// 	c: {
// 		d: number // Is now required
// 	}[]
// }

// Set specific indices in an array to be required.
type ArrayExample = SetRequiredDeep<{a: [number?, number?, number?]}, 'a.0' | 'a.1'>;
//=> {a: [number, number, number?]}
```

@category Object
*/
type SetRequiredDeep<BaseType, KeyPaths extends Paths<BaseType>> = IsAny<KeyPaths> extends true ? SimplifyDeep<RequiredDeep<BaseType>> : SetRequiredDeepHelper<BaseType, UnionToTuple<KeyPaths>>;
/**
Internal helper for {@link SetRequiredDeep}.

Recursively transforms the `BaseType` by applying {@link SetRequiredDeepSinglePath} for each path in `KeyPathsTuple`.
*/
type SetRequiredDeepHelper<BaseType, KeyPathsTuple extends UnknownArray> = KeyPathsTuple extends [infer KeyPath, ...infer RestPaths] ? SetRequiredDeepHelper<SetRequiredDeepSinglePath<BaseType, KeyPath>, RestPaths> : BaseType;

/**
Makes a single path required in `BaseType`.
*/
type SetRequiredDeepSinglePath<BaseType, KeyPath> = BaseType extends NonRecursiveType ? BaseType : KeyPath extends `${infer Property}.${infer RestPath}` ? { [Key in keyof BaseType]: Property extends `${Key & (string | number)}` ? SetRequiredDeepSinglePath<BaseType[Key], RestPath> : BaseType[Key] } : SetRequired<BaseType, (KeyPath | StringToNumber<KeyPath & string>) & keyof BaseType>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/set-non-nullable.d.ts
/**
Create a type that makes the given keys non-nullable, where the remaining keys are kept as is.

If no keys are given, all keys will be made non-nullable.

Use-case: You want to define a single model where the only thing that changes is whether or not some or all of the keys are non-nullable.

@example
```
import type {SetNonNullable} from 'type-fest';

type Foo = {
	a: number | null;
	b: string | undefined;
	c?: boolean | null;
}

type SomeNonNullable = SetNonNullable<Foo, 'b' | 'c'>;
// type SomeNonNullable = {
// 	a: number | null;
// 	b: string; // Can no longer be undefined.
// 	c?: boolean; // Can no longer be null, but is still optional.
// }

type AllNonNullable = SetNonNullable<Foo>;
// type AllNonNullable = {
// 	a: number; // Can no longer be null.
// 	b: string; // Can no longer be undefined.
// 	c?: boolean; // Can no longer be null, but is still optional.
// }
```

@category Object
*/
type SetNonNullable<BaseType, Keys extends keyof BaseType = keyof BaseType> = { [Key in keyof BaseType]: Key extends Keys ? NonNullable<BaseType[Key]> : BaseType[Key] };
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/value-of.d.ts
/**
Create a union of the given object's values, and optionally specify which keys to get the values from.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/31438) if you want to have this type as a built-in in TypeScript.

@example
```
// data.json
{
	'foo': 1,
	'bar': 2,
	'biz': 3
}

// main.ts
import type {ValueOf} from 'type-fest';
import data = require('./data.json');

export function getData(name: string): ValueOf<typeof data> {
	return data[name];
}

export function onlyBar(name: string): ValueOf<typeof data, 'bar'> {
	return data[name];
}

// file.ts
import {getData, onlyBar} from './main';

getData('foo');
//=> 1

onlyBar('foo');
//=> TypeError ...

onlyBar('bar');
//=> 2
```

@category Object
*/
type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType];
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/async-return-type.d.ts
type AsyncFunction = (...arguments_: any[]) => PromiseLike<unknown>;

/**
Unwrap the return type of a function that returns a `Promise`.

There has been [discussion](https://github.com/microsoft/TypeScript/pull/35998) about implementing this type in TypeScript.

@example
```ts
import type {AsyncReturnType} from 'type-fest';
import {asyncFunction} from 'api';

// This type resolves to the unwrapped return type of `asyncFunction`.
type Value = AsyncReturnType<typeof asyncFunction>;

async function doSomething(value: Value) {}

asyncFunction().then(value => doSomething(value));
```

@category Async
*/
type AsyncReturnType<Target extends AsyncFunction> = Awaited<ReturnType<Target>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/conditional-keys.d.ts
/**
Extract the keys from a type where the value type of the key extends the given `Condition`.

Internally this is used for the `ConditionalPick` and `ConditionalExcept` types.

@example
```
import type {ConditionalKeys} from 'type-fest';

interface Example {
	a: string;
	b: string | number;
	c?: string;
	d: {};
}

type StringKeysOnly = ConditionalKeys<Example, string>;
//=> 'a'
```

To support partial types, make sure your `Condition` is a union of undefined (for example, `string | undefined`) as demonstrated below.

@example
```
import type {ConditionalKeys} from 'type-fest';

type StringKeysAndUndefined = ConditionalKeys<Example, string | undefined>;
//=> 'a' | 'c'
```

@category Object
*/
type ConditionalKeys<Base, Condition> = {
  // Map through all the keys of the given base type.

  // Convert the produced object into a union type of the keys which passed the conditional test.
[Key in keyof Base]-?:
// Pick only keys with types extending the given `Condition` type.
Base[Key] extends Condition
// Retain this key
// If the value for the key extends never, only include it if `Condition` also extends never
? IfNever$1<Base[Key], IfNever$1<Condition, Key, never>, Key>
// Discard this key since the condition fails.
: never }[keyof Base];
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/conditional-except.d.ts
/**
Exclude keys from a shape that matches the given `Condition`.

This is useful when you want to create a new type with a specific set of keys from a shape. For example, you might want to exclude all the primitive properties from a class and form a new shape containing everything but the primitive properties.

@example
```
import type {Primitive, ConditionalExcept} from 'type-fest';

class Awesome {
	name: string;
	successes: number;
	failures: bigint;

	run() {}
}

type ExceptPrimitivesFromAwesome = ConditionalExcept<Awesome, Primitive>;
//=> {run: () => void}
```

@example
```
import type {ConditionalExcept} from 'type-fest';

interface Example {
	a: string;
	b: string | number;
	c: () => void;
	d: {};
}

type NonStringKeysOnly = ConditionalExcept<Example, string>;
//=> {b: string | number; c: () => void; d: {}}
```

@category Object
*/
type ConditionalExcept<Base, Condition> = Except<Base, ConditionalKeys<Base, Condition>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/conditional-pick.d.ts
/**
Pick keys from the shape that matches the given `Condition`.

This is useful when you want to create a new type from a specific subset of an existing type. For example, you might want to pick all the primitive properties from a class and form a new automatically derived type.

@example
```
import type {Primitive, ConditionalPick} from 'type-fest';

class Awesome {
	name: string;
	successes: number;
	failures: bigint;

	run() {}
}

type PickPrimitivesFromAwesome = ConditionalPick<Awesome, Primitive>;
//=> {name: string; successes: number; failures: bigint}
```

@example
```
import type {ConditionalPick} from 'type-fest';

interface Example {
	a: string;
	b: string | number;
	c: () => void;
	d: {};
}

type StringKeysOnly = ConditionalPick<Example, string>;
//=> {a: string}
```

@category Object
*/
type ConditionalPick<Base, Condition> = Pick<Base, ConditionalKeys<Base, Condition>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/conditional-pick-deep.d.ts
/**
Used to mark properties that should be excluded.
*/
declare const conditionalPickDeepSymbol: unique symbol;

/**
Assert the condition according to the {@link ConditionalPickDeepOptions.condition|condition} option.
*/
type AssertCondition<Type, Condition, Options extends ConditionalPickDeepOptions> = Options['condition'] extends 'equality' ? IsEqual<Type, Condition> : Type extends Condition ? true : false;

/**
ConditionalPickDeep options.

@see ConditionalPickDeep
*/
type ConditionalPickDeepOptions = {
  /**
  The condition assertion mode.
  	@default 'extends'
  */
  condition?: 'extends' | 'equality';
};
type DefaultConditionalPickDeepOptions = {
  condition: 'extends';
};

/**
Pick keys recursively from the shape that matches the given condition.

@see ConditionalPick

@example
```
import type {ConditionalPickDeep} from 'type-fest';

interface Example {
	a: string;
	b: string | boolean;
	c: {
		d: string;
		e: {
			f?: string;
			g?: boolean;
			h: string | boolean;
			i: boolean | bigint;
		};
		j: boolean;
	};
}

type StringPick = ConditionalPickDeep<Example, string>;
//=> {a: string; c: {d: string}}

type StringPickOptional = ConditionalPickDeep<Example, string | undefined>;
//=> {a: string; c: {d: string; e: {f?: string}}}

type StringPickOptionalOnly = ConditionalPickDeep<Example, string | undefined, {condition: 'equality'}>;
//=> {c: {e: {f?: string}}}

type BooleanPick = ConditionalPickDeep<Example, boolean | undefined>;
//=> {c: {e: {g?: boolean}; j: boolean}}

type NumberPick = ConditionalPickDeep<Example, number>;
//=> {}

type StringOrBooleanPick = ConditionalPickDeep<Example, string | boolean>;
//=> {
// 	a: string;
// 	b: string | boolean;
// 	c: {
// 		d: string;
// 		e: {
// 			h: string | boolean
// 		};
// 		j: boolean;
// 	};
// }

type StringOrBooleanPickOnly = ConditionalPickDeep<Example, string | boolean, {condition: 'equality'}>;
//=> {b: string | boolean; c: {e: {h: string | boolean}}}
```

@category Object
*/
type ConditionalPickDeep<Type, Condition, Options extends ConditionalPickDeepOptions = {}> = _ConditionalPickDeep<Type, Condition, ApplyDefaultOptions<ConditionalPickDeepOptions, DefaultConditionalPickDeepOptions, Options>>;
type _ConditionalPickDeep<Type, Condition, Options extends Required<ConditionalPickDeepOptions>> = ConditionalSimplifyDeep<ConditionalExcept<{ [Key in keyof Type]: AssertCondition<Type[Key], Condition, Options> extends true ? Type[Key] : IsPlainObject<Type[Key]> extends true ? _ConditionalPickDeep<Type[Key], Condition, Options> : typeof conditionalPickDeepSymbol }, (typeof conditionalPickDeepSymbol | undefined) | EmptyObject>, never, UnknownRecord>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/stringified.d.ts
/**
Create a type with the keys of the given type changed to `string` type.

Use-case: Changing interface values to strings in order to use them in a form model.

@example
```
import type {Stringified} from 'type-fest';

type Car = {
	model: string;
	speed: number;
}

const carForm: Stringified<Car> = {
	model: 'Foo',
	speed: '101'
};
```

@category Object
*/
type Stringified<ObjectType> = { [KeyType in keyof ObjectType]: string };
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/join.d.ts
// The builtin `join` method supports all these natively in the same way that typescript handles them so we can safely accept all of them.
type JoinableItem = string | number | bigint | boolean | undefined | null;

// `null` and `undefined` are treated uniquely in the built-in join method, in a way that differs from the default `toString` that would result in the type `${undefined}`. That's why we need to handle it specifically with this helper.
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join#description
type NullishCoalesce<Value extends JoinableItem, Fallback extends string> = Value extends undefined | null ? NonNullable<Value> | Fallback : Value;

/**
Join an array of strings and/or numbers using the given string as a delimiter.

Use-case: Defining key paths in a nested object. For example, for dot-notation fields in MongoDB queries.

@example
```
import type {Join} from 'type-fest';

// Mixed (strings & numbers) items; result is: 'foo.0.baz'
const path: Join<['foo', 0, 'baz'], '.'> = ['foo', 0, 'baz'].join('.');

// Only string items; result is: 'foo.bar.baz'
const path: Join<['foo', 'bar', 'baz'], '.'> = ['foo', 'bar', 'baz'].join('.');

// Only number items; result is: '1.2.3'
const path: Join<[1, 2, 3], '.'> = [1, 2, 3].join('.');

// Only bigint items; result is '1.2.3'
const path: Join<[1n, 2n, 3n], '.'> = [1n, 2n, 3n].join('.');

// Only boolean items; result is: 'true.false.true'
const path: Join<[true, false, true], '.'> = [true, false, true].join('.');

// Contains nullish items; result is: 'foo..baz..xyz'
const path: Join<['foo', undefined, 'baz', null, 'xyz'], '.'> = ['foo', undefined, 'baz', null, 'xyz'].join('.');

// Partial tuple shapes (rest param last); result is: `prefix.${string}`
const path: Join<['prefix', ...string[]], '.'> = ['prefix'].join('.');

// Partial tuple shapes (rest param first); result is: `${string}.suffix`
const path: Join<[...string[], 'suffix'], '.'> = ['suffix'].join('.');

// Tuples items with nullish unions; result is '.' | 'hello.' | '.world' | 'hello.world'
const path: Join<['hello' | undefined, 'world' | null], '.'> = ['hello', 'world'].join('.');
```

@category Array
@category Template literal
*/
type Join<Items extends readonly JoinableItem[], Delimiter extends string> = Items extends readonly [] ? '' : Items extends readonly [JoinableItem?] ? `${NullishCoalesce<Items[0], ''>}` : Items extends readonly [infer First extends JoinableItem, ...infer Tail extends readonly JoinableItem[]] ? `${NullishCoalesce<First, ''>}${Delimiter}${Join<Tail, Delimiter>}` : Items extends readonly [...infer Head extends readonly JoinableItem[], infer Last extends JoinableItem] ? `${Join<Head, Delimiter>}${Delimiter}${NullishCoalesce<Last, ''>}` : string;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/sum.d.ts
/**
Returns the sum of two numbers.

Note:
- A or B can only support `-999` ~ `999`.

@example
```
import type {Sum} from 'type-fest';

Sum<111, 222>;
//=> 333

Sum<-111, 222>;
//=> 111

Sum<111, -222>;
//=> -111

Sum<PositiveInfinity, -9999>;
//=> PositiveInfinity

Sum<PositiveInfinity, NegativeInfinity>;
//=> number
```

@category Numeric
*/
// TODO: Support big integer.
type Sum<A extends number, B extends number> =
// Handle cases when A or B is the actual "number" type
number extends A | B ? number
// Handle cases when A and B are both +/- infinity
: A extends B & (PositiveInfinity | NegativeInfinity) ? A // A or B could be used here as they are equal
// Handle cases when A and B are opposite infinities
: A | B extends PositiveInfinity | NegativeInfinity ? number
// Handle cases when A is +/- infinity
: A extends PositiveInfinity | NegativeInfinity ? A
// Handle cases when B is +/- infinity
: B extends PositiveInfinity | NegativeInfinity ? B
// Handle cases when A or B is 0 or it's the same number with different signs
: A extends 0 ? B : B extends 0 ? A : A extends ReverseSign<B> ? 0
// Handle remaining regular cases
: SumPostChecks<A, B>;
/**
Adds two numbers A and B, such that they are not equal with different signs and neither of them are 0, +/- infinity or the `number` type
*/
type SumPostChecks<A extends number, B extends number, AreNegative = [IsNegative<A>, IsNegative<B>]> = AreNegative extends [false, false]
// When both numbers are positive we can add them together
? SumPositives<A, B> : AreNegative extends [true, true]
// When both numbers are negative we add the absolute values and then reverse the sign
? ReverseSign<SumPositives<NumberAbsolute<A>, NumberAbsolute<B>>>
// When the signs are different we can subtract the absolute values, remove the sign
// and then reverse the sign if the larger absolute value is negative
: NumberAbsolute<Subtract<NumberAbsolute<A>, NumberAbsolute<B>>> extends infer Result extends number ? TupleMax<[NumberAbsolute<A>, NumberAbsolute<B>]> extends infer Max_ extends number ? Max_ extends A | B
// The larger absolute value is positive, so the result is positive
? Result
// The larger absolute value is negative, so the result is negative
: ReverseSign<Result> : never : never;

/**
Adds two positive numbers.
*/
type SumPositives<A extends number, B extends number> = [...BuildTuple<A>, ...BuildTuple<B>]['length'] extends infer Result extends number ? Result : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/less-than-or-equal.d.ts
/**
 Returns a boolean for whether a given number is less than or equal to another number.

@example
```
import type {LessThanOrEqual} from 'type-fest';

LessThanOrEqual<1, -5>;
//=> false

LessThanOrEqual<1, 1>;
//=> true

LessThanOrEqual<1, 5>;
//=> true
```
*/
type LessThanOrEqual<A extends number, B extends number> = number extends A | B ? never : GreaterThan<A, B> extends true ? false : true;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/array-slice.d.ts
/**
Returns an array slice of a given range, just like `Array#slice()`.

@example
```
import type {ArraySlice} from 'type-fest';

type T0 = ArraySlice<[0, 1, 2, 3, 4]>;
//=> [0, 1, 2, 3, 4]

type T1 = ArraySlice<[0, 1, 2, 3, 4], 0, -1>;
//=> [0, 1, 2, 3]

type T2 = ArraySlice<[0, 1, 2, 3, 4], 1, -2>;
//=> [1, 2]

type T3 = ArraySlice<[0, 1, 2, 3, 4], -2, 4>;
//=> [3]

type T4 = ArraySlice<[0, 1, 2, 3, 4], -2, -1>;
//=> [3]

type T5 = ArraySlice<[0, 1, 2, 3, 4], 0, -999>;
//=> []

function arraySlice<
	const Array_ extends readonly unknown[],
	Start extends number = 0,
	End extends number = Array_['length'],
>(array: Array_, start?: Start, end?: End) {
	return array.slice(start, end) as ArraySlice<Array_, Start, End>;
}

const slice = arraySlice([1, '2', {a: 3}, [4, 5]], 0, -1);

typeof slice;
//=> [1, '2', { readonly a: 3; }]

slice[2].a;
//=> 3

// @ts-expect-error -- TS2493: Tuple type '[1, "2", {readonly a: 3}]' of length '3' has no element at index '3'.
slice[3];
```

@category Array
*/
type ArraySlice<Array_ extends readonly unknown[], Start extends number = never, End extends number = never> = Array_ extends unknown // To distributive type
? And<IsEqual<Start, never>, IsEqual<End, never>> extends true ? Array_ : number extends Array_['length'] ? VariableLengthArraySliceHelper<Array_, Start, End> : ArraySliceHelper<Array_, IsEqual<Start, never> extends true ? 0 : Start, IsEqual<End, never> extends true ? Array_['length'] : End> : never;
// Never happens

type VariableLengthArraySliceHelper<Array_ extends readonly unknown[], Start extends number, End extends number> = And<Not<IsNegative<Start>>, IsEqual<End, never>> extends true ? ArraySplice<Array_, 0, Start> : And<And<Not<IsNegative<Start>>, Not<IsNegative<End>>>, IsEqual<GreaterThan<End, Start>, true>> extends true ? ArraySliceByPositiveIndex<Array_, Start, End> : [];
type ArraySliceHelper<Array_ extends readonly unknown[], Start extends number = 0, End extends number = Array_['length'], TraversedElement extends Array<Array_[number]> = [], Result extends Array<Array_[number]> = [], ArrayLength extends number = Array_['length'], PositiveS extends number = (IsNegative<Start> extends true ? Sum<ArrayLength, Start> extends infer AddResult extends number ? number extends AddResult // (ArrayLength + Start) < 0
? 0 : GreaterThan<AddResult, 0> extends true ? AddResult : 0 : never : Start), PositiveE extends number = (IsNegative<End> extends true ? Sum<ArrayLength, End> : End)> = true extends [IsNegative<PositiveS>, LessThanOrEqual<PositiveE, PositiveS>, GreaterThanOrEqual<PositiveS, ArrayLength>][number] ? [] : ArraySliceByPositiveIndex<Array_, TupleMin<[PositiveS, ArrayLength]>, TupleMin<[PositiveE, ArrayLength]>>;
type ArraySliceByPositiveIndex<Array_ extends readonly unknown[], Start extends number, End extends number, Result extends Array<Array_[number]> = []> = Start extends End ? Result : ArraySliceByPositiveIndex<Array_, Sum<Start, 1>, End, [...Result, Array_[Start]]>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/string-slice.d.ts
/**
Returns a string slice of a given range, just like `String#slice()`.

@see {ArraySlice}

@example
```
import type {StringSlice} from 'type-fest';

StringSlice<'abcde', 0, 2>;
//=> 'ab'

StringSlice<'abcde', 1>;
//=> 'bcde'

StringSlice<'abcde', 0, -1>;
//=> 'abcd'

StringSlice<'abcde', -2, -1>;
//=> 'd'
```

@category String
*/
type StringSlice<S extends string, Start extends number = 0, End extends number = StringToArray<S>['length']> = string extends S ? string : ArraySlice<StringToArray<S>, Start, End> extends infer R extends readonly string[] ? Join<R, ''> : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/fixed-length-array.d.ts
/**
Methods to exclude.
*/
type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';

/**
Create a type that represents an array of the given type and length. The array's length and the `Array` prototype methods that manipulate its length are excluded in the resulting type.

Please participate in [this issue](https://github.com/microsoft/TypeScript/issues/26223) if you want to have a similar type built into TypeScript.

Use-cases:
- Declaring fixed-length tuples or arrays with a large number of items.
- Creating a range union (for example, `0 | 1 | 2 | 3 | 4` from the keys of such a type) without having to resort to recursive types.
- Creating an array of coordinates with a static length, for example, length of 3 for a 3D vector.

Note: This type does not prevent out-of-bounds access. Prefer `ReadonlyTuple` unless you need mutability.

@example
```
import type {FixedLengthArray} from 'type-fest';

type FencingTeam = FixedLengthArray<string, 3>;

const guestFencingTeam: FencingTeam = ['Josh', 'Michael', 'Robert'];

const homeFencingTeam: FencingTeam = ['George', 'John'];
//=> error TS2322: Type string[] is not assignable to type 'FencingTeam'

guestFencingTeam.push('Sam');
//=> error TS2339: Property 'push' does not exist on type 'FencingTeam'
```

@category Array
@see ReadonlyTuple
*/
type FixedLengthArray<Element, Length extends number, ArrayPrototype = [Element, ...Element[]]> = Pick<ArrayPrototype, Exclude<keyof ArrayPrototype, ArrayLengthMutationKeys>> & {
  [index: number]: Element;
  [Symbol.iterator]: () => IterableIterator<Element>;
  readonly length: Length;
};
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/multidimensional-array.d.ts
type Recursive$1<T> = Array<Recursive$1<T>>;

/**
Creates a type that represents a multidimensional array of the given type and dimension.

Use-cases:
- Return a n-dimensional array from functions.
- Declare a n-dimensional array by defining its dimensions rather than declaring `[]` repetitively.
- Infer the dimensions of a n-dimensional array automatically from function arguments.
- Avoid the need to know in advance the dimensions of a n-dimensional array allowing them to be dynamic.

@example
```
import type {MultidimensionalArray} from 'type-fest';

function emptyMatrix<T extends number>(dimensions: T): MultidimensionalArray<unknown, T> {
	const matrix: unknown[] = [];

	let subMatrix = matrix;
	for (let dimension = 1; dimension < dimensions; ++dimension) {
		console.log(`Initializing dimension #${dimension}`);

		subMatrix[0] = [];
		subMatrix = subMatrix[0] as unknown[];
	}

	return matrix as MultidimensionalArray<unknown, T>;
}

const matrix = emptyMatrix(3);

matrix[0][0][0] = 42;
```

@category Array
*/
type MultidimensionalArray<Element, Dimensions extends number> = number extends Dimensions ? Recursive$1<Element> : IsEqual<Dimensions, 0> extends true ? Element : Array<MultidimensionalArray<Element, Subtract<Dimensions, 1>>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/multidimensional-readonly-array.d.ts
type Recursive<T> = ReadonlyArray<Recursive<T>>;

/**
Creates a type that represents a multidimensional readonly array that of the given type and dimension.

Use-cases:
- Return a n-dimensional array from functions.
- Declare a n-dimensional array by defining its dimensions rather than declaring `[]` repetitively.
- Infer the dimensions of a n-dimensional array automatically from function arguments.
- Avoid the need to know in advance the dimensions of a n-dimensional array allowing them to be dynamic.

@example
```
import type {MultidimensionalReadonlyArray} from 'type-fest';

function emptyMatrix<T extends number>(dimensions: T): MultidimensionalReadonlyArray<unknown, T> {
	const matrix: unknown[] = [];

	let subMatrix = matrix;
	for (let dimension = 1; dimension < dimensions; ++dimension) {
		console.log(`Initializing dimension #${dimension}`);

		subMatrix[0] = [];
		if (dimension < dimensions - 1) {
			subMatrix = subMatrix[0] as unknown[];
		} else {
			subMatrix[0] = 42;
		}
	}

	return matrix as MultidimensionalReadonlyArray<unknown, T>;
}

const matrix = emptyMatrix(3);

const answer = matrix[0][0][0]; // 42
```

@category Array
*/
type MultidimensionalReadonlyArray<Element, Dimensions extends number> = number extends Dimensions ? Recursive<Element> : IsEqual<Dimensions, 0> extends true ? Element : ReadonlyArray<MultidimensionalReadonlyArray<Element, Subtract<Dimensions, 1>>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/iterable-element.d.ts
/**
Get the element type of an `Iterable`/`AsyncIterable`. For example, `Array`, `Set`, `Map`, generator, stream, etc.

This can be useful, for example, if you want to get the type that is yielded in a generator function. Often the return type of those functions are not specified.

This type works with both `Iterable`s and `AsyncIterable`s, so it can be use with synchronous and asynchronous generators.

Here is an example of `IterableElement` in action with a generator function:

@example
```
import type {IterableElement} from 'type-fest';

function * iAmGenerator() {
	yield 1;
	yield 2;
}

type MeNumber = IterableElement<ReturnType<typeof iAmGenerator>>
```

And here is an example with an async generator:

@example
```
import type {IterableElement} from 'type-fest';

async function * iAmGeneratorAsync() {
	yield 'hi';
	yield true;
}

type MeStringOrBoolean = IterableElement<ReturnType<typeof iAmGeneratorAsync>>
```

Many types in JavaScript/TypeScript are iterables. This type works on all types that implement those interfaces.

An example with an array of strings:

@example
```
import type {IterableElement} from 'type-fest';

type MeString = IterableElement<string[]>
```

@example
```
import type {IterableElement} from 'type-fest';

const fruits = new Set(['🍎', '🍌', '🍉'] as const);

type Fruit = IterableElement<typeof fruits>;
//=> '🍎' | '🍌' | '🍉'
```

@category Iterable
*/
type IterableElement<TargetIterable> = TargetIterable extends Iterable<infer ElementType> ? ElementType : TargetIterable extends AsyncIterable<infer ElementType> ? ElementType : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/entry.d.ts
type MapKey<BaseType> = BaseType extends Map<infer KeyType, unknown> ? KeyType : never;
type MapValue<BaseType> = BaseType extends Map<unknown, infer ValueType> ? ValueType : never;
type ArrayEntry<BaseType extends readonly unknown[]> = [number, BaseType[number]];
type MapEntry<BaseType> = [MapKey<BaseType>, MapValue<BaseType>];
type ObjectEntry<BaseType> = [keyof BaseType, BaseType[keyof BaseType]];
type SetEntry<BaseType> = BaseType extends Set<infer ItemType> ? [ItemType, ItemType] : never;
/**
Many collections have an `entries` method which returns an array of a given object's own enumerable string-keyed property [key, value] pairs. The `Entry` type will return the type of that collection's entry.

For example the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries|`Object`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries|`Map`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries|`Array`}, and {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries|`Set`} collections all have this method. Note that `WeakMap` and `WeakSet` do not have this method since their entries are not enumerable.

@see `Entries` if you want to just access the type of the array of entries (which is the return of the `.entries()` method).

@example
```
import type {Entry} from 'type-fest';

interface Example {
	someKey: number;
}

const manipulatesEntry = (example: Entry<Example>) => [
	// Does some arbitrary processing on the key (with type information available)
	example[0].toUpperCase(),

	// Does some arbitrary processing on the value (with type information available)
	example[1].toFixed(),
];

const example: Example = {someKey: 1};
const entry = Object.entries(example)[0] as Entry<Example>;
const output = manipulatesEntry(entry);

// Objects
const objectExample = {a: 1};
const objectEntry: Entry<typeof objectExample> = ['a', 1];

// Arrays
const arrayExample = ['a', 1];
const arrayEntryString: Entry<typeof arrayExample> = [0, 'a'];
const arrayEntryNumber: Entry<typeof arrayExample> = [1, 1];

// Maps
const mapExample = new Map([['a', 1]]);
const mapEntry: Entry<typeof mapExample> = ['a', 1];

// Sets
const setExample = new Set(['a', 1]);
const setEntryString: Entry<typeof setExample> = ['a', 'a'];
const setEntryNumber: Entry<typeof setExample> = [1, 1];
```

@category Object
@category Map
@category Array
@category Set
*/
type Entry<BaseType> = BaseType extends Map<unknown, unknown> ? MapEntry<BaseType> : BaseType extends Set<unknown> ? SetEntry<BaseType> : BaseType extends readonly unknown[] ? ArrayEntry<BaseType> : BaseType extends object ? ObjectEntry<BaseType> : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/entries.d.ts
type ArrayEntries<BaseType extends readonly unknown[]> = Array<ArrayEntry<BaseType>>;
type MapEntries<BaseType> = Array<MapEntry<BaseType>>;
type ObjectEntries<BaseType> = Array<ObjectEntry<BaseType>>;
type SetEntries<BaseType extends Set<unknown>> = Array<SetEntry<BaseType>>;

/**
Many collections have an `entries` method which returns an array of a given object's own enumerable string-keyed property [key, value] pairs. The `Entries` type will return the type of that collection's entries.

For example the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries|`Object`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries|`Map`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries|`Array`}, and {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries|`Set`} collections all have this method. Note that `WeakMap` and `WeakSet` do not have this method since their entries are not enumerable.

@see `Entry` if you want to just access the type of a single entry.

@example
```
import type {Entries} from 'type-fest';

interface Example {
	someKey: number;
}

const manipulatesEntries = (examples: Entries<Example>) => examples.map(example => [
	// Does some arbitrary processing on the key (with type information available)
	example[0].toUpperCase(),

	// Does some arbitrary processing on the value (with type information available)
	example[1].toFixed()
]);

const example: Example = {someKey: 1};
const entries = Object.entries(example) as Entries<Example>;
const output = manipulatesEntries(entries);

// Objects
const objectExample = {a: 1};
const objectEntries: Entries<typeof objectExample> = [['a', 1]];

// Arrays
const arrayExample = ['a', 1];
const arrayEntries: Entries<typeof arrayExample> = [[0, 'a'], [1, 1]];

// Maps
const mapExample = new Map([['a', 1]]);
const mapEntries: Entries<typeof mapExample> = [['a', 1]];

// Sets
const setExample = new Set(['a', 1]);
const setEntries: Entries<typeof setExample> = [['a', 'a'], [1, 1]];
```

@category Object
@category Map
@category Set
@category Array
*/
type Entries<BaseType> = BaseType extends Map<unknown, unknown> ? MapEntries<BaseType> : BaseType extends Set<unknown> ? SetEntries<BaseType> : BaseType extends readonly unknown[] ? ArrayEntries<BaseType> : BaseType extends object ? ObjectEntries<BaseType> : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/set-return-type.d.ts
/**
Create a function type with a return type of your choice and the same parameters as the given function type.

Use-case: You want to define a wrapped function that returns something different while receiving the same parameters. For example, you might want to wrap a function that can throw an error into one that will return `undefined` instead.

@example
```
import type {SetReturnType} from 'type-fest';

type MyFunctionThatCanThrow = (foo: SomeType, bar: unknown) => SomeOtherType;

type MyWrappedFunction = SetReturnType<MyFunctionThatCanThrow, SomeOtherType | undefined>;
//=> type MyWrappedFunction = (foo: SomeType, bar: unknown) => SomeOtherType | undefined;
```

@category Function
*/
type SetReturnType<Function_ extends (...arguments_: any[]) => any, TypeToReturn> =
// Just using `Parameters<Fn>` isn't ideal because it doesn't handle the `this` fake parameter.
Function_ extends ((this: infer ThisArgument, ...arguments_: infer Arguments) => any) ? (
// If a function did not specify the `this` fake parameter, it will be inferred to `unknown`.
// We want to detect this situation just to display a friendlier type upon hovering on an IntelliSense-powered IDE.
IsUnknown<ThisArgument> extends true ? (...arguments_: Arguments) => TypeToReturn : (this: ThisArgument, ...arguments_: Arguments) => TypeToReturn) : (
// This part should be unreachable, but we make it meaningful just in case…
(...arguments_: Parameters<Function_>) => TypeToReturn);
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/set-parameter-type.d.ts
/**
Create an array that replaces the given `TArray`'s elements with the given `TObject`'s values at the given indices.

`TArray` and `TObject` supports tailing spread array like `[string, ...boolean[]]`, but does not support `[string, ...boolean[], number]`.

@example:
```ts
// object
type A = MergeObjectToArray<[string, number], {0: boolean}>;
//=> [boolean, number]

// array
type B = MergeObjectToArray<[string, number], [boolean]>;
//=> [boolean, number]

// tailing spread array
type C = MergeObjectToArray<[string, ...boolean[]], {1: number}>;
//=> [string, ...number[]]

type D = MergeObjectToArray<[string, ...boolean[]], [number, ...string[]]>;
//=> [number, ...string[]]
```
*/
type MergeObjectToArray<TArray extends UnknownArray, TObject, TArrayCopy extends UnknownArray = TArray> =
// If `TObject` is an array like `[0, 1, 2]`
TObject extends UnknownArray
// If `TObject` is a variable length array, we should use `TObject`'s type as the result type.
? number extends TObject['length'] ? TObject : { [K in keyof TArray]: number extends K ? VariablePartOfArray<TArray>[number] : K extends keyof TObject ? TObject[K] : TArray[K] } : TObject extends object
// If `TObject` is a object witch key is number like `{0: string, 1: number}`
? { [K in keyof TArray]: K extends `${infer NumberK extends number}` ? NumberK extends keyof TObject ? TObject[NumberK] : TArray[K] : number extends K
// If array key `K` is `number`, means it's a rest parameter, we should set the rest parameter type to corresponding type in `TObject`.
// example: `MergeObjectToParamterArray<[string, ...boolean[]], {1: number}>` => `[string, ...number[]]`
? StaticPartOfArray<TArrayCopy>['length'] extends keyof TObject ? TObject[StaticPartOfArray<TArrayCopy>['length']] : TArray[K] : never } : never;

/**
Create a function that replaces some parameters with the given parameters.

The parameters that are not specified will be kept as-is.

Note:
- This type will ignore the given function's generic type.
- If you change the parameter type that return type depends on, the return type will not change:
	```
	const fn = (a: number) => a;
	//=> fn: (a: number) => number;

 	// We change type of `a` to `string`, but return type is still `number`.
	type Fn = SetParameterType<typeof fn, {0: string}>;
 	//=> (a: string) => number;
	```

Use-case:
- Define a wrapped function that receives something different while returning the same type.
- Mocking and testing.
- Overload function type. (See example)

@example
```
import type {SetParameterType} from 'type-fest';

type HandleMessage = (data: Data, message: string, ...arguments: any[]) => void;

type HandleOk = SetParameterType<HandleMessage, {0: SuccessData, 1: 'ok'}>;
//=> type HandleOk = (data: SuccessData, message: 'ok') => void;

// Another way to define the parameters to replace.
type HandleError = SetParameterType<HandleMessage, [data: ErrorData, message: 'error']>;
//=> type HandleError = (data: ErrorData, message: 'error') => void;

// Change single parameter type.
type HandleWarn = SetParameterType<HandleMessage, {1: 'warn'}>;
//=> type HandleWarn = (data: Data, message: 'warn') => void;

// Change rest parameter type.

// Way 1: Input full parameter type.
type HandleLog = SetParameterType<HandleMessage, [data: Data, message: 'log', ...arguments: string[]]>;
//=> type HandleLog = (data: Data, message: 'log', ...arguments: string[]) => void;

// Way 2: Input rest parameter type by Object index.
type HandleLog2 = SetParameterType<HandleMessage, {2: string}>;
//=> type HandleLog2 = (data: Data, message: string, ...arguments: string[]) => void;
```

@category Function
*/
type SetParameterType<Function_ extends (...arguments_: any[]) => unknown, P extends Record<number, unknown>> =
// Just using `Parameters<Fn>` isn't ideal because it doesn't handle the `this` fake parameter.
Function_ extends ((this: infer ThisArgument, ...arguments_: infer Arguments) => unknown) ? (
// If a function did not specify the `this` fake parameter, it will be inferred to `unknown`.
// We want to detect this situation just to display a friendlier type upon hovering on an IntelliSense-powered IDE.
IsUnknown<ThisArgument> extends true ? (...arguments_: MergeObjectToArray<Arguments, P>) => ReturnType<Function_> : (this: ThisArgument, ...arguments_: MergeObjectToArray<Arguments, P>) => ReturnType<Function_>) : Function_;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/asyncify.d.ts
/**
Create an async version of the given function type, by boxing the return type in `Promise` while keeping the same parameter types.

Use-case: You have two functions, one synchronous and one asynchronous that do the same thing. Instead of having to duplicate the type definition, you can use `Asyncify` to reuse the synchronous type.

@example
```
import type {Asyncify} from 'type-fest';

// Synchronous function.
function getFooSync(someArg: SomeType): Foo {
	// …
}

type AsyncifiedFooGetter = Asyncify<typeof getFooSync>;
//=> type AsyncifiedFooGetter = (someArg: SomeType) => Promise<Foo>;

// Same as `getFooSync` but asynchronous.
const getFooAsync: AsyncifiedFooGetter = (someArg) => {
	// TypeScript now knows that `someArg` is `SomeType` automatically.
	// It also knows that this function must return `Promise<Foo>`.
	// If you have `@typescript-eslint/promise-function-async` linter rule enabled, it will even report that "Functions that return promises must be async.".

	// …
}
```

@category Async
*/
type Asyncify<Function_ extends (...arguments_: any[]) => any> = SetReturnType<Function_, Promise<Awaited<ReturnType<Function_>>>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/jsonify.d.ts
// Note: The return value has to be `any` and not `unknown` so it can match `void`.
type NotJsonable = ((...arguments_: any[]) => any) | undefined | symbol;
type NeverToNull<T> = IsNever<T> extends true ? null : T;
type UndefinedToNull<T> = T extends undefined ? null : T;

// Handles tuples and arrays
type JsonifyList<T extends UnknownArray> = T extends readonly [] ? [] : T extends readonly [infer F, ...infer R] ? [NeverToNull<Jsonify<F>>, ...JsonifyList<R>] : IsUnknown<T[number]> extends true ? [] : Array<T[number] extends NotJsonable ? null : Jsonify<UndefinedToNull<T[number]>>>;
type FilterJsonableKeys<T extends object> = { [Key in keyof T]: T[Key] extends NotJsonable ? never : Key }[keyof T];

/**
JSON serialize objects (not including arrays) and classes.
*/
type JsonifyObject<T extends object> = { [Key in keyof Pick<T, FilterJsonableKeys<T>>]: Jsonify<T[Key]> };

/**
Transform a type to one that is assignable to the `JsonValue` type.

This includes:
1. Transforming JSON `interface` to a `type` that is assignable to `JsonValue`.
2. Transforming non-JSON value that is *jsonable* to a type that is assignable to `JsonValue`, where *jsonable* means the non-JSON value implements the `.toJSON()` method that returns a value that is assignable to `JsonValue`.

@remarks

An interface cannot be structurally compared to `JsonValue` because an interface can be re-opened to add properties that may not be satisfy `JsonValue`.

@example
```
import type {Jsonify, JsonValue} from 'type-fest';

interface Geometry {
	type: 'Point' | 'Polygon';
	coordinates: [number, number];
}

const point: Geometry = {
	type: 'Point',
	coordinates: [1, 1]
};

const problemFn = (data: JsonValue) => {
	// Does something with data
};

problemFn(point); // Error: type Geometry is not assignable to parameter of type JsonValue because it is an interface

const fixedFn = <T>(data: Jsonify<T>) => {
	// Does something with data
};

fixedFn(point); // Good: point is assignable. Jsonify<T> transforms Geometry into value assignable to JsonValue
fixedFn(new Date()); // Error: As expected, Date is not assignable. Jsonify<T> cannot transforms Date into value assignable to JsonValue
```

Non-JSON values such as `Date` implement `.toJSON()`, so they can be transformed to a value assignable to `JsonValue`:

@example
```
import type {Jsonify} from 'type-fest';

const time = {
	timeValue: new Date()
};

// `Jsonify<typeof time>` is equivalent to `{timeValue: string}`
const timeJson = JSON.parse(JSON.stringify(time)) as Jsonify<typeof time>;
```

@link https://github.com/Microsoft/TypeScript/issues/1897#issuecomment-710744173

@category JSON
*/
type Jsonify<T> = IsAny<T> extends true ? any : T extends PositiveInfinity | NegativeInfinity ? null : T extends JsonPrimitive ? T :
// Any object with toJSON is special case
T extends {
  toJSON(): infer J;
} ? (() => J) extends (() => JsonValue // Is J assignable to JsonValue?
) ? J // Then T is Jsonable and its Jsonable value is J
: Jsonify<J> // Maybe if we look a level deeper we'll find a JsonValue
:
// Instanced primitives are objects
T extends Number ? number : T extends String ? string : T extends Boolean ? boolean : T extends Map<any, any> | Set<any> ? EmptyObject : T extends TypedArray ? Record<string, number> : T extends NotJsonable ? never // Non-JSONable type union was found not empty
: T extends UnknownArray ? JsonifyList<T> : T extends object ? JsonifyObject<UndefinedToOptional<T>> // JsonifyObject recursive call for its children
: never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/jsonifiable.d.ts
type JsonifiableObject = { [Key in string]?: Jsonifiable } | {
  toJSON: () => Jsonifiable;
};
type JsonifiableArray = readonly Jsonifiable[];

/**
Matches a value that can be losslessly converted to JSON.

Can be used to type values that you expect to pass to `JSON.stringify`.

`undefined` is allowed in object fields (for example, `{a?: number}`) as a special case even though `JSON.stringify({a: undefined})` is `{}` because it makes this class more widely useful and checking for undefined-but-present values is likely an anti-pattern.

@example
```
import type {Jsonifiable} from 'type-fest';

// @ts-expect-error
const error: Jsonifiable = {
    map: new Map([['a', 1]]),
};

JSON.stringify(error);
//=> {"map": {}}

const good: Jsonifiable = {
    number: 3,
    date: new Date(),
    missing: undefined,
}

JSON.stringify(good);
//=> {"number": 3, "date": "2022-10-17T22:22:35.920Z"}
```

@category JSON
*/
type Jsonifiable = JsonPrimitive | JsonifiableObject | JsonifiableArray;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/find-global-type.d.ts
/**
Tries to find the type of a global with the given name.

Limitations: Due to peculiarities with the behavior of `globalThis`, "globally defined" only includes `var` declarations in `declare global` blocks, not `let` or `const` declarations.

@example
```
import type {FindGlobalType} from 'type-fest';

declare global {
	const foo: number; // let and const don't work
	var bar: string;   // var works
}

type FooType = FindGlobalType<'foo'>     //=> never (let/const don't work)
type BarType = FindGlobalType<'bar'>     //=> string
type OtherType = FindGlobalType<'other'> //=> never (no global named 'other')
```

@category Utilities
*/
type FindGlobalType<Name extends string> = typeof globalThis extends Record<Name, infer T> ? T : never;
/**
Tries to find one or more types from their globally-defined constructors.

Use-case: Conditionally referencing DOM types only when the DOM library present.

*Limitations:* Due to peculiarities with the behavior of `globalThis`, "globally defined" has a narrow definition in this case. Declaring a class in a `declare global` block won't work, instead you must declare its type using an interface and declare its constructor as a `var` (*not* `let`/`const`) inside the `declare global` block.

@example
```
import type {FindGlobalInstanceType} from 'type-fest';

class Point {
	constructor(public x: number, public y: number) {}
}

type PointLike = Point | FindGlobalInstanceType<'DOMPoint'>;
```

@example
```
import type {FindGlobalInstanceType} from 'type-fest';

declare global {
	// Class syntax won't add the key to `globalThis`
	class Foo {}

	// interface + constructor style works
	interface Bar {}
	var Bar: new () => Bar; // Not let or const
}

type FindFoo = FindGlobalInstanceType<'Foo'>; // Doesn't work
type FindBar = FindGlobalInstanceType<'Bar'>; // Works
```

@category Utilities
*/
type FindGlobalInstanceType<Name extends string> = Name extends string ? typeof globalThis extends Record<Name, abstract new (...arguments: any[]) => infer T> ? T : never : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/structured-cloneable.d.ts
type StructuredCloneablePrimitive = string | number | bigint | boolean | null | undefined | Boolean | Number | String;
type StructuredCloneableData = ArrayBuffer | DataView | Date | Error | RegExp | TypedArray | FindGlobalInstanceType<
// DOM or Node types
'Blob' | 'File'
// DOM exclusive types
| 'AudioData' | 'CropTarget' | 'CryptoKey' | 'DOMException' | 'DOMMatrix' | 'DOMMatrixReadOnly' | 'DOMPoint' | 'DOMPointReadOnly' | 'DOMQuad' | 'DOMRect' | 'DOMRectReadOnly' | 'FileList' | 'FileSystemDirectoryHandle' | 'FileSystemFileHandle' | 'FileSystemHandle' | 'GPUCompilationInfo' | 'GPUCompilationMessage' | 'ImageBitmap' | 'ImageData' | 'RTCCertificate' | 'VideoFrame'>;
type StructuredCloneableCollection = readonly StructuredCloneable[] | {
  readonly [key: string]: StructuredCloneable;
  readonly [key: number]: StructuredCloneable;
} | ReadonlyMap<StructuredCloneable, StructuredCloneable> | ReadonlySet<StructuredCloneable>;

/**
Matches a value that can be losslessly cloned using `structuredClone`.

Note:
- Custom error types will be cloned as the base `Error` type

@see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm

@example
```
import type {StructuredCloneable} from 'type-fest';

class CustomClass {}

// @ts-expect-error
const error: StructuredCloneable = {
    custom: new CustomClass(),
};

structuredClone(error);
//=> {custom: {}}

const good: StructuredCloneable = {
    number: 3,
    date: new Date(),
    map: new Map<string, number>(),
}

good.map.set('key', 1);

structuredClone(good);
//=> {number: 3, date: Date(2022-10-17 22:22:35.920), map: Map {'key' -> 1}}
```

@category Structured clone
*/
type StructuredCloneable = StructuredCloneablePrimitive | StructuredCloneableData | StructuredCloneableCollection;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/schema.d.ts
/**
Create a deep version of another object type where property values are recursively replaced into a given value type.

Use-cases:
- Form validation: Define how each field should be validated.
- Form settings: Define configuration for input fields.
- Parsing: Define types that specify special behavior for specific fields.

@example
```
import type {Schema} from 'type-fest';

interface User {
	id: string;
	name: {
		firstname: string;
		lastname: string;
	};
	created: Date;
	active: boolean;
	passwordHash: string;
	attributes: ['Foo', 'Bar']
}

type UserMask = Schema<User, 'mask' | 'hide' | 'show'>;

const userMaskSettings: UserMask = {
	id: 'show',
	name: {
		firstname: 'show',
		lastname: 'mask',
	},
	created: 'show',
	active: 'show',
	passwordHash: 'hide',
	attributes: ['mask', 'show']
}
```

@category Object
*/
type Schema<ObjectType, ValueType, Options extends SchemaOptions = {}> = ObjectType extends string ? ValueType : ObjectType extends Map<unknown, unknown> ? ValueType : ObjectType extends Set<unknown> ? ValueType : ObjectType extends ReadonlyMap<unknown, unknown> ? ValueType : ObjectType extends ReadonlySet<unknown> ? ValueType : ObjectType extends Array<infer U> ? Options['recurseIntoArrays'] extends false | undefined ? ValueType : Array<Schema<U, ValueType>> : ObjectType extends ((...arguments_: unknown[]) => unknown) ? ValueType : ObjectType extends Date ? ValueType : ObjectType extends Function ? ValueType : ObjectType extends RegExp ? ValueType : ObjectType extends object ? SchemaObject<ObjectType, ValueType, Options> : ValueType;
/**
Same as `Schema`, but accepts only `object`s as inputs. Internal helper for `Schema`.
*/
type SchemaObject<ObjectType extends object, K, Options extends SchemaOptions> = { [KeyType in keyof ObjectType]: ObjectType[KeyType] extends readonly unknown[] | unknown[] ? Options['recurseIntoArrays'] extends false | undefined ? K : Schema<ObjectType[KeyType], K, Options> : Schema<ObjectType[KeyType], K, Options> | K };

/**
@see Schema
*/
type SchemaOptions = {
  /**
  By default, this affects elements in array and tuple types. You can change this by passing `{recurseIntoArrays: false}` as the third type argument:
  - If `recurseIntoArrays` is set to `true` (default), array elements will be recursively processed as well.
  - If `recurseIntoArrays` is set to `false`, arrays will not be recursively processed, and the entire array will be replaced with the given value type.
  	@example
  ```
  type UserMask = Schema<User, 'mask' | 'hide' | 'show', {recurseIntoArrays: false}>;
  	const userMaskSettings: UserMask = {
  	id: 'show',
  	name: {
  		firstname: 'show',
  		lastname: 'mask',
  	},
  	created: 'show',
  	active: 'show',
  	passwordHash: 'hide',
  	attributes: 'hide'
  }
  ```
  	@default true
  */
  readonly recurseIntoArrays?: boolean | undefined;
};
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/literal-to-primitive.d.ts
/**
Given a [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) return the {@link Primitive | primitive type} it belongs to, or `never` if it's not a primitive.

Use-case: Working with generic types that may be literal types.

@example
```
import type {LiteralToPrimitive} from 'type-fest';

// No overloads needed to get the correct return type
function plus<T extends number | bigint | string>(x: T, y: T): LiteralToPrimitive<T> {
	return x + (y as any);
}

plus('a', 'b'); // string
plus(1, 2); // number
plus(1n, 2n); // bigint
```

@category Type
*/
type LiteralToPrimitive<T> = T extends number ? number : T extends bigint ? bigint : T extends string ? string : T extends boolean ? boolean : T extends symbol ? symbol : T extends null ? null : T extends undefined ? undefined : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/literal-to-primitive-deep.d.ts
/**
Like `LiteralToPrimitive` except it converts literal types inside an object or array deeply.

For example, given a constant object, it returns a new object type with the same keys but with all the values converted to primitives.

@see LiteralToPrimitive

Use-case: Deal with data that is imported from a JSON file.

@example
```
import type {LiteralToPrimitiveDeep, TsConfigJson} from 'type-fest';
import tsconfig from 'path/to/tsconfig.json';

function doSomethingWithTSConfig(config: LiteralToPrimitiveDeep<TsConfigJson>) { ... }

// No casting is needed to pass the type check
doSomethingWithTSConfig(tsconfig);

// If LiteralToPrimitiveDeep is not used, you need to cast the imported data like this:
doSomethingWithTSConfig(tsconfig as TsConfigJson);
```

@category Type
@category Object
*/
type LiteralToPrimitiveDeep<T> = T extends object ? T extends Array<infer U> ? Array<LiteralToPrimitiveDeep<U>> : { [K in keyof OmitIndexSignature<T>]: LiteralToPrimitiveDeep<T[K]> } : LiteralToPrimitive<T>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/string-key-of.d.ts
/**
Get keys of the given type as strings.

Number keys are converted to strings.

Use-cases:
- Get string keys from a type which may have number keys.
- Makes it possible to index using strings retrieved from template types.

@example
```
import type {StringKeyOf} from 'type-fest';

type Foo = {
	1: number,
	stringKey: string,
};

type StringKeysOfFoo = StringKeyOf<Foo>;
//=> '1' | 'stringKey'
```

@category Object
*/
type StringKeyOf<BaseType> = `${Extract<keyof BaseType, string | number>}`;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/exact.d.ts
/**
Create a type from `ParameterType` and `InputType` and change keys exclusive to `InputType` to `never`.
- Generate a list of keys that exists in `InputType` but not in `ParameterType`.
- Mark these excess keys as `never`.
*/
type ExactObject<ParameterType, InputType> = { [Key in keyof ParameterType]: Exact<ParameterType[Key], ObjectValue<InputType, Key>> } & Record<Exclude<keyof InputType, KeysOfUnion<ParameterType>>, never>;

/**
Create a type that does not allow extra properties, meaning it only allows properties that are explicitly declared.

This is useful for function type-guarding to reject arguments with excess properties. Due to the nature of TypeScript, it does not complain if excess properties are provided unless the provided value is an object literal.

*Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/12936) if you want to have this type as a built-in in TypeScript.*

@example
```
type OnlyAcceptName = {name: string};

function onlyAcceptName(arguments_: OnlyAcceptName) {}

// TypeScript complains about excess properties when an object literal is provided.
onlyAcceptName({name: 'name', id: 1});
//=> `id` is excess

// TypeScript does not complain about excess properties when the provided value is a variable (not an object literal).
const invalidInput = {name: 'name', id: 1};
onlyAcceptName(invalidInput); // No errors
```

Having `Exact` allows TypeScript to reject excess properties.

@example
```
import {Exact} from 'type-fest';

type OnlyAcceptName = {name: string};

function onlyAcceptNameImproved<T extends Exact<OnlyAcceptName, T>>(arguments_: T) {}

const invalidInput = {name: 'name', id: 1};
onlyAcceptNameImproved(invalidInput); // Compilation error
```

[Read more](https://stackoverflow.com/questions/49580725/is-it-possible-to-restrict-typescript-object-to-contain-only-properties-defined)

@category Utilities
*/
type Exact<ParameterType, InputType> =
// Before distributing, check if the two types are equal and if so, return the parameter type immediately
IsEqual<ParameterType, InputType> extends true ? ParameterType
// If the parameter is a primitive, return it as is immediately to avoid it being converted to a complex type
: ParameterType extends Primitive ? ParameterType
// If the parameter is an unknown, return it as is immediately to avoid it being converted to a complex type
: IsUnknown<ParameterType> extends true ? unknown
// If the parameter is a Function, return it as is because this type is not capable of handling function, leave it to TypeScript
: ParameterType extends Function ? ParameterType
// Convert union of array to array of union: A[] & B[] => (A & B)[]
: ParameterType extends unknown[] ? Array<Exact<ArrayElement<ParameterType>, ArrayElement<InputType>>>
// In TypeScript, Array is a subtype of ReadonlyArray, so always test Array before ReadonlyArray.
: ParameterType extends readonly unknown[] ? ReadonlyArray<Exact<ArrayElement<ParameterType>, ArrayElement<InputType>>> : ExactObject<ParameterType, InputType>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/readonly-tuple.d.ts
/**
Creates a read-only tuple of type `Element` and with the length of `Length`.

@private
@see `ReadonlyTuple` which is safer because it tests if `Length` is a specific finite number.
*/
type BuildTupleHelper<Element, Length extends number, Rest extends Element[]> = Rest['length'] extends Length ? readonly [...Rest] :
// Terminate with readonly array (aka tuple)
BuildTupleHelper<Element, Length, [Element, ...Rest]>;

/**
Create a type that represents a read-only tuple of the given type and length.

Use-cases:
- Declaring fixed-length tuples with a large number of items.
- Creating a range union (for example, `0 | 1 | 2 | 3 | 4` from the keys of such a type) without having to resort to recursive types.
- Creating a tuple of coordinates with a static length, for example, length of 3 for a 3D vector.

@example
```
import {ReadonlyTuple} from 'type-fest';

type FencingTeam = ReadonlyTuple<string, 3>;

const guestFencingTeam: FencingTeam = ['Josh', 'Michael', 'Robert'];

const homeFencingTeam: FencingTeam = ['George', 'John'];
//=> error TS2322: Type string[] is not assignable to type 'FencingTeam'

guestFencingTeam.push('Sam');
//=> error TS2339: Property 'push' does not exist on type 'FencingTeam'
```

@category Utilities
*/
type ReadonlyTuple<Element, Length extends number> = number extends Length
// Because `Length extends number` and `number extends Length`, then `Length` is not a specific finite number.
? readonly Element[] // It's not fixed length.
: BuildTupleHelper<Element, Length, []>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/override-properties.d.ts
/**
Override existing properties of the given type. Similar to `Merge`, but enforces that the original type has the properties you want to override.

This is useful when you want to override existing properties with a different type and make sure that these properties really exist in the original.

@example
```
type Foo = {
	a: string
	b: string
}
type Bar = OverrideProperties<Foo, {b: number}>
//=> {a: string, b: number}

type Baz = OverrideProperties<Foo, {c: number}>
// Error, type '{ c: number; }' does not satisfy the constraint '{ c: never; }'

type Fizz = OverrideProperties<Foo, {b: number; c: number}>
// Error, type '{ b: number; c: number; }' does not satisfy the constraint '{ b: number; c: never; }'
```

@category Object
*/
type OverrideProperties<TOriginal,
// This first bit where we use `Partial` is to enable autocomplete
// and the second bit with the mapped type is what enforces that we don't try
// to override properties that doesn't exist in the original type.
TOverride extends Partial<Record<keyof TOriginal, unknown>> & { [Key in keyof TOverride]: Key extends keyof TOriginal ? TOverride[Key] : never }> = Merge<TOriginal, TOverride>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/has-optional-keys.d.ts
/**
Creates a type that represents `true` or `false` depending on whether the given type has any optional fields.

This is useful when you want to create an API whose behavior depends on the presence or absence of optional fields.

@example
```
import type {HasOptionalKeys, OptionalKeysOf} from 'type-fest';

type UpdateService<Entity extends object> = {
	removeField: HasOptionalKeys<Entity> extends true
		? (field: OptionalKeysOf<Entity>) => Promise<void>
		: never
}
```

@category Utilities
*/
type HasOptionalKeys<BaseType extends object> = OptionalKeysOf<BaseType> extends never ? false : true;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/writable-keys-of.d.ts
/**
Extract all writable keys from the given type.

This is useful when you want to create a new type that contains writable keys only.

@example
```
import type {WritableKeysOf} from 'type-fest';

interface User {
	name: string;
	surname: string;
	readonly id: number;
}

type UpdateRequest<Entity extends object> = Pick<Entity, WritableKeysOf<Entity>>;

const update1: UpdateRequest<User> = {
	name: 'Alice',
	surname: 'Acme',
};
```

@category Utilities
*/
type WritableKeysOf<T> = T extends unknown // For distributing `T`
? (keyof { [P in keyof T as IsEqual<{ [Q in P]: T[P] }, { readonly [Q in P]: T[P] }> extends false ? P : never]: never }) & keyof T // Intersect with `keyof T` to ensure result of `WritableKeysOf<T>` is always assignable to `keyof T`
: never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/readonly-keys-of.d.ts
/**
Extract all readonly keys from the given type.

This is useful when you want to create a new type that contains readonly keys only.

@example
```
import type {ReadonlyKeysOf} from 'type-fest';

interface User {
	name: string;
	surname: string;
	readonly id: number;
}

type UpdateResponse<Entity extends object> = Pick<Entity, ReadonlyKeysOf<Entity>>;

const update1: UpdateResponse<User> = {
    id: 123,
};
```

@category Utilities
*/
type ReadonlyKeysOf<T> = T extends unknown // For distributing `T`
? Exclude<keyof T, WritableKeysOf<T>> : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/has-readonly-keys.d.ts
/**
Creates a type that represents `true` or `false` depending on whether the given type has any readonly fields.

This is useful when you want to create an API whose behavior depends on the presence or absence of readonly fields.

@example
```
import type {HasReadonlyKeys, ReadonlyKeysOf} from 'type-fest';

type UpdateService<Entity extends object> = {
	removeField: HasReadonlyKeys<Entity> extends true
		? (field: ReadonlyKeysOf<Entity>) => Promise<void>
		: never
}
```

@category Utilities
*/
type HasReadonlyKeys<BaseType extends object> = ReadonlyKeysOf<BaseType> extends never ? false : true;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/has-writable-keys.d.ts
/**
Creates a type that represents `true` or `false` depending on whether the given type has any writable fields.

This is useful when you want to create an API whose behavior depends on the presence or absence of writable fields.

@example
```
import type {HasWritableKeys, WritableKeysOf} from 'type-fest';

type UpdateService<Entity extends object> = {
	removeField: HasWritableKeys<Entity> extends true
		? (field: WritableKeysOf<Entity>) => Promise<void>
		: never
}
```

@category Utilities
*/
type HasWritableKeys<BaseType extends object> = WritableKeysOf<BaseType> extends never ? false : true;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/spread.d.ts
type SpreadObject<FirstType extends object, SecondType extends object> = { [Key in keyof FirstType]: Key extends keyof SecondType ? FirstType[Key] | Required<SecondType>[Key] : FirstType[Key] } & Pick<SecondType, RequiredKeysOf<SecondType> | Exclude<keyof SecondType, keyof FirstType>>;
type TupleOrArray = readonly [...unknown[]];
type SpreadTupleOrArray<FirstType extends TupleOrArray, SecondType extends TupleOrArray> = Array<FirstType[number] | SecondType[number]>;
type Spreadable = object | TupleOrArray;

/**
Mimic the type inferred by TypeScript when merging two objects or two arrays/tuples using the spread syntax.

@example
```
import type {Spread} from 'type-fest';

type Foo = {
	a: number;
	b?: string;
};

type Bar = {
	b?: number;
	c: boolean;
};

const foo = {a: 1, b: '2'};
const bar = {c: false};
const fooBar = {...foo, ...bar};

type FooBar = Spread<Foo, Bar>;
// type FooBar = {
// 	a: number;
// 	b?: string | number | undefined;
// 	c: boolean;
// }

const baz = (argument: FooBar) => {
	// Do something
}

baz(fooBar);
```

@example
```
import type {Spread} from 'type-fest';

const foo = [1, 2, 3];
const bar = ['4', '5', '6'];

const fooBar = [...foo, ...bar];
type FooBar = Spread<typeof foo, typeof bar>;
// FooBar = (string | number)[]

const baz = (argument: FooBar) => {
	// Do something
};

baz(fooBar);
```

@category Object
*/
type Spread<FirstType extends Spreadable, SecondType extends Spreadable> = FirstType extends TupleOrArray ? SecondType extends TupleOrArray ? SpreadTupleOrArray<FirstType, SecondType> : Simplify<SpreadObject<FirstType, SecondType>> : Simplify<SpreadObject<FirstType, SecondType>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/is-tuple.d.ts
/**
@see {@link IsTuple}
*/
type IsTupleOptions = {
  /**
  Consider only fixed length arrays as tuples.
  	- When set to `true` (default), arrays with rest elements (e.g., `[1, ...number[]]`) are _not_ considered as tuples.
  - When set to `false`, arrays with at least one non-rest element (e.g., `[1, ...number[]]`) are considered as tuples.
  	@default true
  	@example
  ```ts
  import type {IsTuple} from 'type-fest';
  	type Example1 = IsTuple<[number, ...number[]], {fixedLengthOnly: true}>;
  //=> false
  	type Example2 = IsTuple<[number, ...number[]], {fixedLengthOnly: false}>;
  //=> true
  ```
  */
  fixedLengthOnly?: boolean;
};
type DefaultIsTupleOptions = {
  fixedLengthOnly: true;
};

/**
Returns a boolean for whether the given array is a tuple.

Use-case:
- If you want to make a conditional branch based on the result of whether an array is a tuple or not.

Note: `IsTuple` returns `boolean` when instantiated with a union of tuple and non-tuple (e.g., `IsTuple<[1, 2] | number[]>`).

@example
```ts
import type {IsTuple} from 'type-fest';

type Tuple = IsTuple<[1, 2, 3]>;
//=> true

type NotTuple = IsTuple<number[]>;
//=> false

type TupleWithOptionalItems = IsTuple<[1?, 2?]>;
//=> true

type RestItemsNotAllowed = IsTuple<[1, 2, ...number[]]>;
//=> false

type RestItemsAllowed = IsTuple<[1, 2, ...number[]], {fixedLengthOnly: false}>;
//=> true
```

@see {@link IsTupleOptions}

@category Type Guard
@category Utilities
*/
type IsTuple<TArray extends UnknownArray, Options extends IsTupleOptions = {}> = _IsTuple<TArray, ApplyDefaultOptions<IsTupleOptions, DefaultIsTupleOptions, Options>>;
type _IsTuple<TArray extends UnknownArray, Options extends Required<IsTupleOptions>> = IfAny$1<TArray, boolean, IfNever$1<TArray, false, TArray extends unknown // For distributing `TArray`
? number extends TArray['length'] ? Options['fixedLengthOnly'] extends false ? IfNever$1<keyof TArray & `${number}`, TArray extends readonly [...any, any] ? true : false,
// To handle cases where a non-rest element follows a rest element, e.g., `[...number[], number]`
true> : false : true : false>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/tuple-to-object.d.ts
/**
Transforms a tuple into an object, mapping each tuple index to its corresponding type as a key-value pair.

Note: Tuple labels are [lost in the transformation process](https://stackoverflow.com/a/70398429/11719314). For example, `TupleToObject<[x: number, y: number]>` produces `{0: number; 1: number}`, and not `{x: number; y: number}`.

@example
```
type Example1 = TupleToObject<[number, string, boolean]>;
//=> { 0: number; 1: string; 2: boolean }

// Tuples with optional indices
type Example2 = TupleToObject<[number, string?, boolean?]>;
//=> { 0: number; 1?: string; 2?: boolean }

// Readonly tuples
type Example3 = TupleToObject<readonly [number, string?]>;
//=> { readonly 0: number; readonly 1?: string }

// Non-tuple arrays get transformed into index signatures
type Example4 = TupleToObject<string[]>;
//=> { [x: number]: string }

// Tuples with rest elements
type Example5 = TupleToObject<[number, string, ...boolean[]]>;
//=> { [x: number]: number | string | boolean; 0: number; 1: string }

// Tuple labels are not preserved
type Example6 = TupleToObject<[x: number, y: number]>;
//=> { 0: number; 1: number }
```

@category Array
*/
type TupleToObject<TArray extends UnknownArray> = IfAny$1<TArray, any, { [Key in keyof TArray as Key & (`${number}` | (IsTuple<TArray> extends true ? never : number))]: TArray[Key] }>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/tuple-to-union.d.ts
/**
Convert a tuple/array into a union type of its elements.

This can be useful when you have a fixed set of allowed values and want a type defining only the allowed values, but do not want to repeat yourself.

@example
```
import type {TupleToUnion} from 'type-fest';

const destinations = ['a', 'b', 'c'] as const;

type Destination = TupleToUnion<typeof destinations>;
//=> 'a' | 'b' | 'c'

function verifyDestination(destination: unknown): destination is Destination {
	return destinations.includes(destination as any);
}

type RequestBody = {
	deliverTo: Destination;
};

function verifyRequestBody(body: unknown): body is RequestBody {
	const deliverTo = (body as any).deliverTo;
	return typeof body === 'object' && body !== null && verifyDestination(deliverTo);
}
```

Alternatively, you may use `typeof destinations[number]`. If `destinations` is a tuple, there is no difference. However if `destinations` is a string, the resulting type will the union of the characters in the string. Other types of `destinations` may result in a compile error. In comparison, TupleToUnion will return `never` if a tuple is not provided.

@example
```
const destinations = ['a', 'b', 'c'] as const;

type Destination = typeof destinations[number];
//=> 'a' | 'b' | 'c'

const erroringType = new Set(['a', 'b', 'c']);

type ErroringType = typeof erroringType[number];
//=> Type 'Set<string>' has no matching index signature for type 'number'. ts(2537)

const numberBool: { [n: number]: boolean } = { 1: true };

type NumberBool = typeof numberBool[number];
//=> boolean
```

@category Array
*/
type TupleToUnion<ArrayType> = ArrayType extends readonly unknown[] ? ArrayType[number] : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/int-range.d.ts
/**
Generate a union of numbers.

The numbers are created from the given `Start` (inclusive) parameter to the given `End` (exclusive) parameter.

You skip over numbers using the `Step` parameter (defaults to `1`). For example, `IntRange<0, 10, 2>` will create a union of `0 | 2 | 4 | 6 | 8`.

Note: `Start` or `End` must be non-negative and smaller than `1000`.

Use-cases:
1. This can be used to define a set of valid input/output values. for example:
	```
	type Age = IntRange<0, 120>;
	type FontSize = IntRange<10, 20>;
	type EvenNumber = IntRange<0, 11, 2>; //=> 0 | 2 | 4 | 6 | 8 | 10
	```
2. This can be used to define random numbers in a range. For example, `type RandomNumber = IntRange<0, 100>;`

@example
```
import type {IntRange} from 'type-fest';

// Create union type `0 | 1 | ... | 9`
type ZeroToNine = IntRange<0, 10>;

// Create union type `100 | 200 | 300 | ... | 900`
type Hundreds = IntRange<100, 901, 100>;
```

@see IntClosedRange
*/
type IntRange<Start extends number, End extends number, Step extends number = 1> = PrivateIntRange<Start, End, Step>;
/**
The actual implementation of `IntRange`. It's private because it has some arguments that don't need to be exposed.
*/
type PrivateIntRange<Start extends number, End extends number, Step extends number, Gap extends number = Subtract<Step, 1>,
// The gap between each number, gap = step - 1
List extends unknown[] = BuildTuple<Start, never>,
// The final `List` is `[...StartLengthTuple, ...[number, ...GapLengthTuple], ...[number, ...GapLengthTuple], ... ...]`, so can initialize the `List` with `[...StartLengthTuple]`
EndLengthTuple extends unknown[] = BuildTuple<End>> = Gap extends 0 ?
// Handle the case that without `Step`
List['length'] extends End // The result of "List[length] === End"
? Exclude<List[number], never> // All unused elements are `never`, so exclude them
: PrivateIntRange<Start, End, Step, Gap, [...List, List['length']]>
// Handle the case that with `Step`
: List extends [...(infer U), ...EndLengthTuple] // The result of "List[length] >= End", because the `...BuildTuple<Gap, never>` maybe make `List` too long.
? Exclude<List[number], never> : PrivateIntRange<Start, End, Step, Gap, [...List, List['length'], ...BuildTuple<Gap, never>]>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/int-closed-range.d.ts
/**
Generate a union of numbers.

The numbers are created from the given `Start` (inclusive) parameter to the given `End` (inclusive) parameter.

You skip over numbers using the `Step` parameter (defaults to `1`). For example, `IntClosedRange<0, 10, 2>` will create a union of `0 | 2 | 4 | 6 | 8 | 10`.

Note: `Start` or `End` must be non-negative and smaller than `999`.

Use-cases:
1. This can be used to define a set of valid input/output values. for example:
	```
	type Age = IntClosedRange<0, 120>; //=> 0 | 1 | 2 | ... | 119 | 120
	type FontSize = IntClosedRange<10, 20>; //=> 10 | 11 | ... | 19 | 20
	type EvenNumber = IntClosedRange<0, 10, 2>; //=> 0 | 2 | 4 | 6 | 8 | 10
	```
2. This can be used to define random numbers in a range. For example, `type RandomNumber = IntClosedRange<0, 100>;`

@example
```
import type {IntClosedRange} from 'type-fest';

// Create union type `0 | 1 | ... | 9`
type ZeroToNine = IntClosedRange<0, 9>;

// Create union type `100 | 200 | 300 | ... | 900`
type Hundreds = IntClosedRange<100, 900, 100>;
```

@see IntRange
*/
type IntClosedRange<Start extends number, End extends number, Skip extends number = 1> = IntRange<Start, Sum<End, 1>, Skip>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/array-indices.d.ts
/**
Provides valid indices for a constant array or tuple.

Use-case: This type is useful when working with constant arrays or tuples and you want to enforce type-safety for accessing elements by their indices.

@example
```
import type {ArrayIndices, ArrayValues} from 'type-fest';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

type Weekday = ArrayIndices<typeof weekdays>;
type WeekdayName = ArrayValues<typeof weekdays>;

const getWeekdayName = (day: Weekday): WeekdayName => weekdays[day];
```

@see {@link ArrayValues}

@category Array
*/
type ArrayIndices<Element extends readonly unknown[]> = Exclude<Partial<Element>['length'], Element['length']>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/array-values.d.ts
/**
Provides all values for a constant array or tuple.

Use-case: This type is useful when working with constant arrays or tuples and you want to enforce type-safety with their values.

@example
```
import type {ArrayValues, ArrayIndices} from 'type-fest';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

type WeekdayName = ArrayValues<typeof weekdays>;
type Weekday = ArrayIndices<typeof weekdays>;

const getWeekdayName = (day: Weekday): WeekdayName => weekdays[day];
```

@see {@link ArrayIndices}

@category Array
*/
type ArrayValues<T extends readonly unknown[]> = T[number];
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/set-field-type.d.ts
type SetFieldTypeOptions = {
  /**
  Preserve optional and readonly modifiers for properties being updated.
  	NOTE: Property modifiers will always be preserved for properties that are not being updated.
  	@default true
  */
  preservePropertyModifiers?: boolean;
};
type DefaultSetFieldTypeOptions = {
  preservePropertyModifiers: true;
};

/**
Create a type that changes the type of the given keys.

Use-cases:
- Creating variations of a base model.
- Fixing incorrect external types.

@see `Merge` if you need to change multiple properties to different types.

@example
```
import type {SetFieldType} from 'type-fest';

type MyModel = {
	readonly id: number;
	readonly createdAt: Date;
	updatedAt?: Date;
};

type MyModelApi = SetFieldType<MyModel, 'createdAt' | 'updatedAt', string>;
// {
// 	readonly id: number;
// 	readonly createdAt: string;
// 	updatedAt?: string;
// }

// `preservePropertyModifiers` option can be set to `false` if you want to remove property modifiers for properties being updated
type MyModelApi = SetFieldType<MyModel, 'createdAt' | 'updatedAt', string, {preservePropertyModifiers: false}>;
// {
// 	readonly id: number;
// 	createdAt: string; // no longer readonly
// 	updatedAt: string; // no longer optional
// }
```

@category Object
*/
type SetFieldType<BaseType, Keys extends keyof BaseType, NewType, Options extends SetFieldTypeOptions = {}> = _SetFieldType<BaseType, Keys, NewType, ApplyDefaultOptions<SetFieldTypeOptions, DefaultSetFieldTypeOptions, Options>>;
type _SetFieldType<BaseType, Keys extends keyof BaseType, NewType, Options extends Required<SetFieldTypeOptions>> = Simplify<{ [P in keyof BaseType]: P extends Keys ? NewType : BaseType[P] } & (
// `Record` is used to remove property modifiers
Options['preservePropertyModifiers'] extends false ? Record<Keys, NewType> : unknown)>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/shared-union-fields.d.ts
/**
Create a type with shared fields from a union of object types.

Use-cases:
- You want a safe object type where each key exists in the union object.
- You want to focus on the common fields of the union type and don't want to have to care about the other fields.

@example
```
import type {SharedUnionFields} from 'type-fest';

type Cat = {
	name: string;
	type: 'cat';
	catType: string;
};

type Dog = {
	name: string;
	type: 'dog';
	dogType: string;
};

function displayPetInfo(petInfo: Cat | Dog) {
	// typeof petInfo =>
	// {
	// 	name: string;
	// 	type: 'cat';
	// 	catType: string; // Needn't care about this field, because it's not a common pet info field.
	// } | {
	// 	name: string;
	// 	type: 'dog';
	// 	dogType: string; // Needn't care about this field, because it's not a common pet info field.
	// }

	// petInfo type is complex and have some needless fields

	console.log('name: ', petInfo.name);
	console.log('type: ', petInfo.type);
}

function displayPetInfo(petInfo: SharedUnionFields<Cat | Dog>) {
	// typeof petInfo =>
	// {
	// 	name: string;
	// 	type: 'cat' | 'dog';
	// }

	// petInfo type is simple and clear

	console.log('name: ', petInfo.name);
	console.log('type: ', petInfo.type);
}
```

@see SharedUnionFieldsDeep
@see AllUnionFields

@category Object
@category Union
*/
type SharedUnionFields<Union> = Extract<Union, NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | UnknownArray> extends infer SkippedMembers ? Exclude<Union, SkippedMembers> extends infer RelevantMembers ? SkippedMembers | (IsNever<RelevantMembers> extends true ? never : Simplify<Pick<RelevantMembers, keyof RelevantMembers>>) : never : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/all-union-fields.d.ts
/**
Create a type with all fields from a union of object types.

Use-cases:
- You want a safe object type where each key exists in the union object.

@example
```
import type {AllUnionFields} from 'type-fest';

type Cat = {
	name: string;
	type: 'cat';
	catType: string;
};

type Dog = {
	name: string;
	type: 'dog';
	dogType: string;
};

function displayPetInfo(petInfo: Cat | Dog) {
	// typeof petInfo =>
	// {
	// 	name: string;
	// 	type: 'cat';
	// 	catType: string;
	// } | {
	// 	name: string;
	// 	type: 'dog';
	// 	dogType: string;
	// }

	console.log('name: ', petInfo.name);
	console.log('type: ', petInfo.type);

	// TypeScript complains about `catType` and `dogType` not existing on type `Cat | Dog`.
	console.log('animal type: ', petInfo.catType ?? petInfo.dogType);
}

function displayPetInfo(petInfo: AllUnionFields<Cat | Dog>) {
	// typeof petInfo =>
	// {
	// 	name: string;
	// 	type: 'cat' | 'dog';
	// 	catType?: string;
	// 	dogType?: string;
	// }

	console.log('name: ', petInfo.name);
	console.log('type: ', petInfo.type);

	// No TypeScript error.
	console.log('animal type: ', petInfo.catType ?? petInfo.dogType);
}
```

@see SharedUnionFields

@category Object
@category Union
*/
type AllUnionFields<Union> = Extract<Union, NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | UnknownArray> extends infer SkippedMembers ? Exclude<Union, SkippedMembers> extends infer RelevantMembers ? SkippedMembers | Simplify<
// Include fields that are common in all union members
SharedUnionFields<RelevantMembers> &
// Include readonly fields present in any union member
{ readonly [P in ReadonlyKeysOfUnion<RelevantMembers>]?: ValueOfUnion<RelevantMembers, P & KeysOfUnion<RelevantMembers>> } &
// Include remaining fields that are neither common nor readonly
{ [P in Exclude<KeysOfUnion<RelevantMembers>, ReadonlyKeysOfUnion<RelevantMembers> | keyof RelevantMembers>]?: ValueOfUnion<RelevantMembers, P> }> : never : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/shared-union-fields-deep.d.ts
/**
SharedUnionFieldsDeep options.

@see {@link SharedUnionFieldsDeep}
*/
type SharedUnionFieldsDeepOptions = {
  /**
  When set to true, this option impacts each element within arrays or tuples. If all union values are arrays or tuples, it constructs an array of the shortest possible length, ensuring every element exists in the union array.
  	@default false
  	*/
  recurseIntoArrays?: boolean;
};
type DefaultSharedUnionFieldsDeepOptions = {
  recurseIntoArrays: false;
};

/**
Create a type with shared fields from a union of object types, deeply traversing nested structures.

Use the {@link SharedUnionFieldsDeepOptions `Options`} to specify the behavior for arrays.

Use-cases:
- You want a safe object type where each key exists in the union object.
- You want to focus on the common fields of the union type and don't want to have to care about the other fields.

@example
```
import type {SharedUnionFieldsDeep} from 'type-fest';

type Cat = {
	info: {
		name: string;
		type: 'cat';
		catType: string;
	};
};

type Dog = {
	info: {
		name: string;
		type: 'dog';
		dogType: string;
	};
};

function displayPetInfo(petInfo: (Cat | Dog)['info']) {
	// typeof petInfo =>
	// {
	// 	name: string;
	// 	type: 'cat';
	// 	catType: string; // Needn't care about this field, because it's not a common pet info field.
	// } | {
	// 	name: string;
	// 	type: 'dog';
	// 	dogType: string; // Needn't care about this field, because it's not a common pet info field.
	// }

	// petInfo type is complex and have some needless fields

	console.log('name: ', petInfo.name);
	console.log('type: ', petInfo.type);
}

function displayPetInfo(petInfo: SharedUnionFieldsDeep<Cat | Dog>['info']) {
	// typeof petInfo =>
	// {
	// 	name: string;
	// 	type: 'cat' | 'dog';
	// }

	// petInfo type is simple and clear

	console.log('name: ', petInfo.name);
	console.log('type: ', petInfo.type);
}
```

@see SharedUnionFields

@category Object
@category Union
*/
type SharedUnionFieldsDeep<Union, Options extends SharedUnionFieldsDeepOptions = {}> = ApplyDefaultOptions<SharedUnionFieldsDeepOptions, DefaultSharedUnionFieldsDeepOptions, Options> extends infer OptionsWithDefaults extends Required<SharedUnionFieldsDeepOptions>
// `Union extends` will convert `Union`
// to a [distributive conditionaltype](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
// But this is not what we want, so we need to wrap `Union` with `[]` to prevent it.
? [Union] extends [NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>] ? Union : [Union] extends [UnknownArray] ? OptionsWithDefaults['recurseIntoArrays'] extends true ? SetArrayAccess<SharedArrayUnionFieldsDeep<Union, OptionsWithDefaults>, IsArrayReadonly<Union>> : Union : [Union] extends [object] ? SharedObjectUnionFieldsDeep<Union, OptionsWithDefaults> : Union : never;
/**
Same as `SharedUnionFieldsDeep`, but accepts only `object`s and as inputs. Internal helper for `SharedUnionFieldsDeep`.
*/
type SharedObjectUnionFieldsDeep<Union, Options extends Required<SharedUnionFieldsDeepOptions>> =
// `keyof Union` can extract the same key in union type, if there is no same key, return never.
keyof Union extends infer Keys ? IsNever<Keys> extends false ? { [Key in keyof Union]: Union[Key] extends NonRecursiveType ? Union[Key]
// Remove `undefined` from the union to support optional
// fields, then recover `undefined` if union was already undefined.
: SharedUnionFieldsDeep<Exclude<Union[Key], undefined>, Options> | (undefined extends Required<Union>[Key] ? undefined : never) } : {} : Union;

/**
Same as `SharedUnionFieldsDeep`, but accepts only `UnknownArray`s and as inputs. Internal helper for `SharedUnionFieldsDeep`.
*/
type SharedArrayUnionFieldsDeep<Union extends UnknownArray, Options extends Required<SharedUnionFieldsDeepOptions>> =
// Restore the readonly modifier of the array.
SetArrayAccess<InternalSharedArrayUnionFieldsDeep<Union, Options>, IsArrayReadonly<Union>>;

/**
Internal helper for `SharedArrayUnionFieldsDeep`. Needn't care the `readonly` modifier of arrays.
*/
type InternalSharedArrayUnionFieldsDeep<Union extends UnknownArray, Options extends Required<SharedUnionFieldsDeepOptions>, ResultTuple extends UnknownArray = []> =
// We should build a minimum possible length tuple where each element in the tuple exists in the union tuple.
IsNever<TupleLength<Union>> extends true
// Rule 1: If all the arrays in the union have non-fixed lengths,
// like `Array<string> | [number, ...string[]]`
// we should build a tuple that is [the_fixed_parts_of_union, ...the_rest_of_union[]].
// For example: `InternalSharedArrayUnionFieldsDeep<Array<string> | [number, ...string[]]>`
// => `[string | number, ...string[]]`.
? ResultTuple['length'] extends UnionMax<StaticPartOfArray<Union>['length']> ? [
// The fixed-length part of the tuple.
...ResultTuple,
// The rest of the union.
// Due to `ResultTuple` is the maximum possible fixed-length part of the tuple,
// so we can use `StaticPartOfArray` to get the rest of the union.
...Array<SharedUnionFieldsDeep<VariablePartOfArray<Union>[number], Options>>]
// Build the fixed-length tuple recursively.
: InternalSharedArrayUnionFieldsDeep<Union, Options, [...ResultTuple, SharedUnionFieldsDeep<Union[ResultTuple['length']], Options>]>
// Rule 2: If at least one of the arrays in the union have fixed lengths,
// like `Array<string> | [number, string]`,
// we should build a tuple of the smallest possible length to ensure any
// item in the result tuple exists in the union tuple.
// For example: `InternalSharedArrayUnionFieldsDeep<Array<string> | [number, string]>`
// => `[string | number, string]`.
: ResultTuple['length'] extends UnionMin<TupleLength<Union>> ? ResultTuple
// As above, build tuple recursively.
: InternalSharedArrayUnionFieldsDeep<Union, Options, [...ResultTuple, SharedUnionFieldsDeep<Union[ResultTuple['length']], Options>]>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/if-null.d.ts
/**
An if-else-like type that resolves depending on whether the given type is `null`.

@see {@link IsNull}

@example
```
import type {IfNull} from 'type-fest';

type ShouldBeTrue = IfNull<null>;
//=> true

type ShouldBeBar = IfNull<'not null', 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
*/
type IfNull<T, TypeIfNull = true, TypeIfNotNull = false> = (IsNull<T> extends true ? TypeIfNull : TypeIfNotNull);
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/words.d.ts
type SkipEmptyWord<Word extends string> = Word extends '' ? [] : [Word];
type RemoveLastCharacter<Sentence extends string, Character extends string> = Sentence extends `${infer LeftSide}${Character}` ? SkipEmptyWord<LeftSide> : never;

/**
Words options.

@see {@link Words}
*/
type WordsOptions = {
  /**
  Split on numeric sequence.
  	@default true
  	@example
  ```
  type Example1 = Words<'p2pNetwork', {splitOnNumbers: true}>;
  //=> ["p", "2", "p", "Network"]
  	type Example2 = Words<'p2pNetwork', {splitOnNumbers: false}>;
  //=> ["p2p", "Network"]
  ```
  */
  splitOnNumbers?: boolean;
};
type DefaultWordsOptions = {
  splitOnNumbers: true;
};
/**
Split a string (almost) like Lodash's `_.words()` function.

- Split on each word that begins with a capital letter.
- Split on each {@link WordSeparators}.
- Split on numeric sequence.

@example
```
import type {Words} from 'type-fest';

type Words0 = Words<'helloWorld'>;
//=> ['hello', 'World']

type Words1 = Words<'helloWORLD'>;
//=> ['hello', 'WORLD']

type Words2 = Words<'hello-world'>;
//=> ['hello', 'world']

type Words3 = Words<'--hello the_world'>;
//=> ['hello', 'the', 'world']

type Words4 = Words<'lifeIs42'>;
//=> ['life', 'Is', '42']

type Words5 = Words<'p2pNetwork', {splitOnNumbers: false}>;
//=> ['p2p', 'Network']
```

@category Change case
@category Template literal
*/
type Words<Sentence extends string, Options extends WordsOptions = {}> = WordsImplementation<Sentence, ApplyDefaultOptions<WordsOptions, DefaultWordsOptions, Options>>;
type WordsImplementation<Sentence extends string, Options extends Required<WordsOptions>, LastCharacter extends string = '', CurrentWord extends string = ''> = Sentence extends `${infer FirstCharacter}${infer RemainingCharacters}` ? FirstCharacter extends WordSeparators
// Skip word separator
? [...SkipEmptyWord<CurrentWord>, ...WordsImplementation<RemainingCharacters, Options>] : LastCharacter extends ''
// Fist char of word
? WordsImplementation<RemainingCharacters, Options, FirstCharacter, FirstCharacter>
// Case change: non-numeric to numeric
: [false, true] extends [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>] ? Options['splitOnNumbers'] extends true
// Split on number: push word
? [...SkipEmptyWord<CurrentWord>, ...WordsImplementation<RemainingCharacters, Options, FirstCharacter, FirstCharacter>]
// No split on number: concat word
: WordsImplementation<RemainingCharacters, Options, FirstCharacter, `${CurrentWord}${FirstCharacter}`>
// Case change: numeric to non-numeric
: [true, false] extends [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>] ? Options['splitOnNumbers'] extends true
// Split on number: push word
? [...SkipEmptyWord<CurrentWord>, ...WordsImplementation<RemainingCharacters, Options, FirstCharacter, FirstCharacter>]
// No split on number: concat word
: WordsImplementation<RemainingCharacters, Options, FirstCharacter, `${CurrentWord}${FirstCharacter}`>
// No case change: concat word
: [true, true] extends [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>] ? WordsImplementation<RemainingCharacters, Options, FirstCharacter, `${CurrentWord}${FirstCharacter}`>
// Case change: lower to upper, push word
: [true, true] extends [IsLowerCase<LastCharacter>, IsUpperCase<FirstCharacter>] ? [...SkipEmptyWord<CurrentWord>, ...WordsImplementation<RemainingCharacters, Options, FirstCharacter, FirstCharacter>]
// Case change: upper to lower, brings back the last character, push word
: [true, true] extends [IsUpperCase<LastCharacter>, IsLowerCase<FirstCharacter>] ? [...RemoveLastCharacter<CurrentWord, LastCharacter>, ...WordsImplementation<RemainingCharacters, Options, FirstCharacter, `${LastCharacter}${FirstCharacter}`>]
// No case change: concat word
: WordsImplementation<RemainingCharacters, Options, FirstCharacter, `${CurrentWord}${FirstCharacter}`> : [...SkipEmptyWord<CurrentWord>];
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/camel-case.d.ts
/**
CamelCase options.

@see {@link CamelCase}
*/
type CamelCaseOptions = {
  /**
  Whether to preserved consecutive uppercase letter.
  	@default true
  */
  preserveConsecutiveUppercase?: boolean;
};
type DefaultCamelCaseOptions = {
  preserveConsecutiveUppercase: true;
};
/**
Convert an array of words to camel-case.
*/
type CamelCaseFromArray<Words extends string[], Options extends Required<CamelCaseOptions>, OutputString extends string = ''> = Words extends [infer FirstWord extends string, ...infer RemainingWords extends string[]] ? Options['preserveConsecutiveUppercase'] extends true ? `${Capitalize<FirstWord>}${CamelCaseFromArray<RemainingWords, Options>}` : `${Capitalize<Lowercase<FirstWord>>}${CamelCaseFromArray<RemainingWords, Options>}` : OutputString;

/**
Convert a string literal to camel-case.

This can be useful when, for example, converting some kebab-cased command-line flags or a snake-cased database result.

By default, consecutive uppercase letter are preserved. See {@link CamelCaseOptions.preserveConsecutiveUppercase preserveConsecutiveUppercase} option to change this behaviour.

@example
```
import type {CamelCase} from 'type-fest';

// Simple

const someVariable: CamelCase<'foo-bar'> = 'fooBar';
const preserveConsecutiveUppercase: CamelCase<'foo-BAR-baz', {preserveConsecutiveUppercase: true}> = 'fooBARBaz';

// Advanced

type CamelCasedProperties<T> = {
	[K in keyof T as CamelCase<K>]: T[K]
};

interface RawOptions {
	'dry-run': boolean;
	'full_family_name': string;
	foo: number;
	BAR: string;
	QUZ_QUX: number;
	'OTHER-FIELD': boolean;
}

const dbResult: CamelCasedProperties<RawOptions> = {
	dryRun: true,
	fullFamilyName: 'bar.js',
	foo: 123,
	bar: 'foo',
	quzQux: 6,
	otherField: false
};
```

@category Change case
@category Template literal
*/
type CamelCase<Type, Options extends CamelCaseOptions = {}> = Type extends string ? string extends Type ? Type : Uncapitalize<CamelCaseFromArray<Words<Type extends Uppercase<Type> ? Lowercase<Type> : Type>, ApplyDefaultOptions<CamelCaseOptions, DefaultCamelCaseOptions, Options>>> : Type;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/camel-cased-properties.d.ts
/**
Convert object properties to camel case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see CamelCasedPropertiesDeep
@see CamelCase

@example
```
import type {CamelCasedProperties} from 'type-fest';

interface User {
	UserId: number;
	UserName: string;
}

const result: CamelCasedProperties<User> = {
	userId: 1,
	userName: 'Tom',
};

const preserveConsecutiveUppercase: CamelCasedProperties<{fooBAR: string}, {preserveConsecutiveUppercase: false}> = {
	fooBar: 'string',
};
```

@category Change case
@category Template literal
@category Object
*/
type CamelCasedProperties<Value, Options extends CamelCaseOptions = {}> = Value extends Function ? Value : Value extends Array<infer U> ? Value : { [K in keyof Value as CamelCase<K, ApplyDefaultOptions<CamelCaseOptions, DefaultCamelCaseOptions, Options>>]: Value[K] };
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/camel-cased-properties-deep.d.ts
/**
Convert object properties to camel case recursively.

This can be useful when, for example, converting some API types from a different style.

@see CamelCasedProperties
@see CamelCase

@example
```
import type {CamelCasedPropertiesDeep} from 'type-fest';

interface User {
	UserId: number;
	UserName: string;
}

interface UserWithFriends {
	UserInfo: User;
	UserFriends: User[];
}

const result: CamelCasedPropertiesDeep<UserWithFriends> = {
	userInfo: {
		userId: 1,
		userName: 'Tom',
	},
	userFriends: [
		{
			userId: 2,
			userName: 'Jerry',
		},
		{
			userId: 3,
			userName: 'Spike',
		},
	],
};

const preserveConsecutiveUppercase: CamelCasedPropertiesDeep<{fooBAR: { fooBARBiz: [{ fooBARBaz: string }] }}, {preserveConsecutiveUppercase: false}> = {
	fooBar: {
		fooBarBiz: [{
			fooBarBaz: 'string',
		}],
	},
};
```

@category Change case
@category Template literal
@category Object
*/
type CamelCasedPropertiesDeep<Value, Options extends CamelCaseOptions = {}> = _CamelCasedPropertiesDeep<Value, ApplyDefaultOptions<CamelCaseOptions, DefaultCamelCaseOptions, Options>>;
type _CamelCasedPropertiesDeep<Value, Options extends Required<CamelCaseOptions>> = Value extends NonRecursiveType ? Value : Value extends UnknownArray ? CamelCasedPropertiesArrayDeep<Value, Options> : Value extends Set<infer U> ? Set<_CamelCasedPropertiesDeep<U, Options>> : Value extends object ? { [K in keyof Value as CamelCase<K, Options>]: _CamelCasedPropertiesDeep<Value[K], Options> } : Value;

// This is a copy of DelimiterCasedPropertiesArrayDeep (see: delimiter-cased-properties-deep.d.ts).
// These types should be kept in sync.
type CamelCasedPropertiesArrayDeep<Value extends UnknownArray, Options extends Required<CamelCaseOptions>> = Value extends [] ? []
// Trailing spread array
: Value extends [infer U, ...infer V] ? [_CamelCasedPropertiesDeep<U, Options>, ..._CamelCasedPropertiesDeep<V, Options>] : Value extends readonly [infer U, ...infer V] ? readonly [_CamelCasedPropertiesDeep<U, Options>, ..._CamelCasedPropertiesDeep<V, Options>] :
// Leading spread array
Value extends readonly [...infer U, infer V] ? [..._CamelCasedPropertiesDeep<U, Options>, _CamelCasedPropertiesDeep<V, Options>] :
// Array
Value extends Array<infer U> ? Array<_CamelCasedPropertiesDeep<U, Options>> : Value extends ReadonlyArray<infer U> ? ReadonlyArray<_CamelCasedPropertiesDeep<U, Options>> : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/delimiter-case.d.ts
type DefaultDelimiterCaseOptions = Merge<DefaultWordsOptions, {
  splitOnNumbers: false;
}>;
/**
Convert an array of words to delimiter case starting with a delimiter with input capitalization.
*/
type DelimiterCaseFromArray<Words extends string[], Delimiter extends string, OutputString extends string = ''> = Words extends [infer FirstWord extends string, ...infer RemainingWords extends string[]] ? DelimiterCaseFromArray<RemainingWords, Delimiter, `${OutputString}${StartsWith<FirstWord, AsciiPunctuation> extends true ? '' : Delimiter}${FirstWord}`> : OutputString;
type RemoveFirstLetter<S extends string> = S extends `${infer _}${infer Rest}` ? Rest : '';

/**
Convert a string literal to a custom string delimiter casing.

This can be useful when, for example, converting a camel-cased object property to an oddly cased one.

@see KebabCase
@see SnakeCase

@example
```
import type {DelimiterCase} from 'type-fest';

// Simple

const someVariable: DelimiterCase<'fooBar', '#'> = 'foo#bar';
const someVariableNoSplitOnNumbers: DelimiterCase<'p2pNetwork', '#', {splitOnNumbers: false}> = 'p2p#network';

// Advanced

type OddlyCasedProperties<T> = {
	[K in keyof T as DelimiterCase<K, '#'>]: T[K]
};

interface SomeOptions {
	dryRun: boolean;
	includeFile: string;
	foo: number;
}

const rawCliOptions: OddlyCasedProperties<SomeOptions> = {
	'dry#run': true,
	'include#file': 'bar.js',
	foo: 123
};
```

@category Change case
@category Template literal
 */
type DelimiterCase<Value, Delimiter extends string, Options extends WordsOptions = {}> = Value extends string ? IsStringLiteral<Value> extends false ? Value : Lowercase<RemoveFirstLetter<DelimiterCaseFromArray<Words<Value, ApplyDefaultOptions<WordsOptions, DefaultDelimiterCaseOptions, Options>>, Delimiter>>> : Value;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/kebab-case.d.ts
/**
Convert a string literal to kebab-case.

This can be useful when, for example, converting a camel-cased object property to a kebab-cased CSS class name or a command-line flag.

@example
```
import type {KebabCase} from 'type-fest';

// Simple

const someVariable: KebabCase<'fooBar'> = 'foo-bar';
const someVariableNoSplitOnNumbers: KebabCase<'p2pNetwork', {splitOnNumbers: false}> = 'p2p-network';

// Advanced

type KebabCasedProperties<T> = {
	[K in keyof T as KebabCase<K>]: T[K]
};

interface CliOptions {
	dryRun: boolean;
	includeFile: string;
	foo: number;
}

const rawCliOptions: KebabCasedProperties<CliOptions> = {
	'dry-run': true,
	'include-file': 'bar.js',
	foo: 123
};
```

@category Change case
@category Template literal
*/
type KebabCase<Value, Options extends WordsOptions = {}> = DelimiterCase<Value, '-', ApplyDefaultOptions<WordsOptions, DefaultDelimiterCaseOptions, Options>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/delimiter-cased-properties.d.ts
/**
Convert object properties to delimiter case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see DelimiterCase
@see DelimiterCasedPropertiesDeep

@example
```
import type {DelimiterCasedProperties} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

const result: DelimiterCasedProperties<User, '-'> = {
	'user-id': 1,
	'user-name': 'Tom',
};

const splitOnNumbers: DelimiterCasedProperties<{line1: string}, '-', {splitOnNumbers: true}> = {
	'line-1': 'string',
};
```

@category Change case
@category Template literal
@category Object
*/
type DelimiterCasedProperties<Value, Delimiter extends string, Options extends WordsOptions = {}> = Value extends Function ? Value : Value extends Array<infer U> ? Value : { [K in keyof Value as DelimiterCase<K, Delimiter, ApplyDefaultOptions<WordsOptions, DefaultDelimiterCaseOptions, Options>>]: Value[K] };
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/kebab-cased-properties.d.ts
/**
Convert object properties to kebab case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see KebabCase
@see KebabCasedPropertiesDeep

@example
```
import type {KebabCasedProperties} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

const result: KebabCasedProperties<User> = {
	'user-id': 1,
	'user-name': 'Tom',
};

const splitOnNumbers: KebabCasedProperties<{line1: string}, {splitOnNumbers: true}> = {
	'line-1': 'string',
};
```

@category Change case
@category Template literal
@category Object
*/
type KebabCasedProperties<Value, Options extends WordsOptions = {}> = DelimiterCasedProperties<Value, '-', ApplyDefaultOptions<WordsOptions, DefaultDelimiterCaseOptions, Options>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/delimiter-cased-properties-deep.d.ts
/**
Convert object properties to delimiter case recursively.

This can be useful when, for example, converting some API types from a different style.

@see DelimiterCase
@see DelimiterCasedProperties

@example
```
import type {DelimiterCasedPropertiesDeep} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: DelimiterCasedPropertiesDeep<UserWithFriends, '-'> = {
	'user-info': {
	'user-id': 1,
		'user-name': 'Tom',
	},
	'user-friends': [
		{
			'user-id': 2,
			'user-name': 'Jerry',
		},
		{
			'user-id': 3,
			'user-name': 'Spike',
		},
	],
};

const splitOnNumbers: DelimiterCasedPropertiesDeep<{line1: { line2: [{ line3: string }] }}, '-', {splitOnNumbers: true}> = {
	'line-1': {
		'line-2': [
			{
				'line-3': 'string',
			},
		],
	},
};
```

@category Change case
@category Template literal
@category Object
*/
type DelimiterCasedPropertiesDeep<Value, Delimiter extends string, Options extends WordsOptions = {}> = _DelimiterCasedPropertiesDeep<Value, Delimiter, ApplyDefaultOptions<WordsOptions, DefaultDelimiterCaseOptions, Options>>;
type _DelimiterCasedPropertiesDeep<Value, Delimiter extends string, Options extends Required<WordsOptions>> = Value extends NonRecursiveType ? Value : Value extends UnknownArray ? DelimiterCasedPropertiesArrayDeep<Value, Delimiter, Options> : Value extends Set<infer U> ? Set<_DelimiterCasedPropertiesDeep<U, Delimiter, Options>> : Value extends object ? { [K in keyof Value as DelimiterCase<K, Delimiter, Options>]: _DelimiterCasedPropertiesDeep<Value[K], Delimiter, Options> } : Value;

// This is a copy of CamelCasedPropertiesArrayDeep (see: camel-cased-properties-deep.d.ts).
// These types should be kept in sync.
type DelimiterCasedPropertiesArrayDeep<Value extends UnknownArray, Delimiter extends string, Options extends Required<WordsOptions>> = Value extends [] ? []
// Trailing spread array
: Value extends [infer U, ...infer V] ? [_DelimiterCasedPropertiesDeep<U, Delimiter, Options>, ..._DelimiterCasedPropertiesDeep<V, Delimiter, Options>] : Value extends readonly [infer U, ...infer V] ? readonly [_DelimiterCasedPropertiesDeep<U, Delimiter, Options>, ..._DelimiterCasedPropertiesDeep<V, Delimiter, Options>]
// Leading spread array
: Value extends [...infer U, infer V] ? [..._DelimiterCasedPropertiesDeep<U, Delimiter, Options>, _DelimiterCasedPropertiesDeep<V, Delimiter, Options>] : Value extends readonly [...infer U, infer V] ? readonly [..._DelimiterCasedPropertiesDeep<U, Delimiter, Options>, _DelimiterCasedPropertiesDeep<V, Delimiter, Options>]
// Array
: Value extends Array<infer U> ? Array<_DelimiterCasedPropertiesDeep<U, Delimiter, Options>> : Value extends ReadonlyArray<infer U> ? ReadonlyArray<_DelimiterCasedPropertiesDeep<U, Delimiter, Options>> : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/kebab-cased-properties-deep.d.ts
/**
Convert object properties to kebab case recursively.

This can be useful when, for example, converting some API types from a different style.

@see KebabCase
@see KebabCasedProperties

@example
```
import type [KebabCasedPropertiesDeep] from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: KebabCasedPropertiesDeep<UserWithFriends> = {
	'user-info': {
		'user-id': 1,
		'user-name': 'Tom',
	},
	'user-friends': [
		{
			'user-id': 2,
			'user-name': 'Jerry',
		},
		{
			'user-id': 3,
			'user-name': 'Spike',
		},
	],
};

const splitOnNumbers: KebabCasedPropertiesDeep<{line1: { line2: [{ line3: string }] }}, {splitOnNumbers: true}> = {
	'line-1': {
		'line-2': [
			{
				'line-3': 'string',
			},
		],
	},
};
```

@category Change case
@category Template literal
@category Object
*/
type KebabCasedPropertiesDeep<Value, Options extends WordsOptions = {}> = DelimiterCasedPropertiesDeep<Value, '-', ApplyDefaultOptions<WordsOptions, DefaultDelimiterCaseOptions, Options>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/pascal-case.d.ts
/**
Converts a string literal to pascal-case.

@example
```
import type {PascalCase} from 'type-fest';

// Simple

const someVariable: PascalCase<'foo-bar'> = 'FooBar';

// Advanced

type PascalCaseProps<T> = {
	[K in keyof T as PascalCase<K>]: T[K]
};

interface RawOptions {
	'dry-run': boolean;
	'full_family_name': string;
	foo: number;
}

const dbResult: CamelCasedProperties<ModelProps> = {
	DryRun: true,
	FullFamilyName: 'bar.js',
	Foo: 123
};
```

@category Change case
@category Template literal
*/
type PascalCase<Value, Options extends CamelCaseOptions = {}> = _PascalCase<Value, ApplyDefaultOptions<CamelCaseOptions, DefaultCamelCaseOptions, Options>>;
type _PascalCase<Value, Options extends Required<CamelCaseOptions>> = CamelCase<Value, Options> extends string ? Capitalize<CamelCase<Value, Options>> : CamelCase<Value, Options>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/pascal-cased-properties.d.ts
/**
Convert object properties to pascal case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see PascalCase
@see PascalCasedPropertiesDeep

@example
```
import type {PascalCasedProperties} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

const result: PascalCasedProperties<User> = {
	UserId: 1,
	UserName: 'Tom',
};
```

@category Change case
@category Template literal
@category Object
*/
type PascalCasedProperties<Value, Options extends CamelCaseOptions = {}> = Value extends Function ? Value : Value extends Array<infer U> ? Value : { [K in keyof Value as PascalCase<K, ApplyDefaultOptions<CamelCaseOptions, DefaultCamelCaseOptions, Options>>]: Value[K] };
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/pascal-cased-properties-deep.d.ts
/**
Convert object properties to pascal case recursively.

This can be useful when, for example, converting some API types from a different style.

@see PascalCase
@see PascalCasedProperties

@example
```
import type {PascalCasedPropertiesDeep} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: PascalCasedPropertiesDeep<UserWithFriends> = {
	UserInfo: {
		UserId: 1,
		UserName: 'Tom',
	},
	UserFriends: [
		{
			UserId: 2,
			UserName: 'Jerry',
		},
		{
			UserId: 3,
			UserName: 'Spike',
		},
	],
};
```

@category Change case
@category Template literal
@category Object
*/
type PascalCasedPropertiesDeep<Value, Options extends CamelCaseOptions = {}> = _PascalCasedPropertiesDeep<Value, ApplyDefaultOptions<CamelCaseOptions, DefaultCamelCaseOptions, Options>>;
type _PascalCasedPropertiesDeep<Value, Options extends Required<CamelCaseOptions>> = Value extends Function | Date | RegExp ? Value : Value extends Array<infer U> ? Array<_PascalCasedPropertiesDeep<U, Options>> : Value extends Set<infer U> ? Set<_PascalCasedPropertiesDeep<U, Options>> : Value extends object ? { [K in keyof Value as PascalCase<K, Options>]: _PascalCasedPropertiesDeep<Value[K], Options> } : Value;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/snake-case.d.ts
/**
Convert a string literal to snake-case.

This can be useful when, for example, converting a camel-cased object property to a snake-cased SQL column name.

@example
```
import type {SnakeCase} from 'type-fest';

// Simple

const someVariable: SnakeCase<'fooBar'> = 'foo_bar';
const noSplitOnNumbers: SnakeCase<'p2pNetwork'> = 'p2p_network';
const splitOnNumbers: SnakeCase<'p2pNetwork', {splitOnNumbers: true}> = 'p_2_p_network';

// Advanced

type SnakeCasedProperties<T> = {
	[K in keyof T as SnakeCase<K>]: T[K]
};

interface ModelProps {
	isHappy: boolean;
	fullFamilyName: string;
	foo: number;
}

const dbResult: SnakeCasedProperties<ModelProps> = {
	'is_happy': true,
	'full_family_name': 'Carla Smith',
	foo: 123
};
```

@category Change case
@category Template literal
*/
type SnakeCase<Value, Options extends WordsOptions = {}> = DelimiterCase<Value, '_', ApplyDefaultOptions<WordsOptions, DefaultDelimiterCaseOptions, Options>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/snake-cased-properties.d.ts
/**
Convert object properties to snake case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see SnakeCase
@see SnakeCasedPropertiesDeep

@example
```
import type {SnakeCasedProperties} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

const result: SnakeCasedProperties<User> = {
	user_id: 1,
	user_name: 'Tom',
};

const splitOnNumbers: SnakeCasedProperties<{line1: string}, {splitOnNumbers: true}> = {
	'line_1': 'string',
};
```

@category Change case
@category Template literal
@category Object
*/
type SnakeCasedProperties<Value, Options extends WordsOptions = {}> = DelimiterCasedProperties<Value, '_', ApplyDefaultOptions<WordsOptions, DefaultDelimiterCaseOptions, Options>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/snake-cased-properties-deep.d.ts
/**
Convert object properties to snake case recursively.

This can be useful when, for example, converting some API types from a different style.

@see SnakeCase
@see SnakeCasedProperties

@example
```
import type {SnakeCasedPropertiesDeep} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: SnakeCasedPropertiesDeep<UserWithFriends> = {
	user_info: {
		user_id: 1,
		user_name: 'Tom',
	},
	user_friends: [
		{
			user_id: 2,
			user_name: 'Jerry',
		},
		{
			user_id: 3,
			user_name: 'Spike',
		},
	],
};

const splitOnNumbers: SnakeCasedPropertiesDeep<{line1: { line2: [{ line3: string }] }}, {splitOnNumbers: true}> = {
	line_1: {
		line_2: [
			{
				line_3: 'string',
			},
		],
	},
};
```

@category Change case
@category Template literal
@category Object
*/
type SnakeCasedPropertiesDeep<Value, Options extends WordsOptions = {}> = DelimiterCasedPropertiesDeep<Value, '_', ApplyDefaultOptions<WordsOptions, DefaultDelimiterCaseOptions, Options>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/screaming-snake-case.d.ts
/**
Convert a string literal to screaming-snake-case.

This can be useful when, for example, converting a camel-cased object property to a screaming-snake-cased SQL column name.

@example
```
import type {ScreamingSnakeCase} from 'type-fest';

const someVariable: ScreamingSnakeCase<'fooBar'> = 'FOO_BAR';
const someVariableNoSplitOnNumbers: ScreamingSnakeCase<'p2pNetwork', {splitOnNumbers: false}> = 'P2P_NETWORK';

```

@category Change case
@category Template literal
 */
type ScreamingSnakeCase<Value, Options extends WordsOptions = {}> = Value extends string ? Uppercase<SnakeCase<Value, ApplyDefaultOptions<WordsOptions, DefaultDelimiterCaseOptions, Options>>> : Value;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/split.d.ts
/**
Split options.

@see {@link Split}
*/
type SplitOptions = {
  /**
  When enabled, instantiations with non-literal string types (e.g., `string`, `Uppercase<string>`, `on${string}`) simply return back `string[]` without performing any splitting, as the exact structure cannot be statically determined.
  	Note: In the future, this option might be enabled by default, so if you currently rely on this being disabled, you should consider explicitly enabling it.
  	@default false
  	@example
  ```ts
  type Example1 = Split<`foo.${string}.bar`, '.', {strictLiteralChecks: false}>;
  //=> ['foo', string, 'bar']
  	type Example2 = Split<`foo.${string}`, '.', {strictLiteralChecks: true}>;
  //=> string[]
  	type Example3 = Split<'foobarbaz', `b${string}`, {strictLiteralChecks: false}>;
  //=> ['foo', 'r', 'z']
  	type Example4 = Split<'foobarbaz', `b${string}`, {strictLiteralChecks: true}>;
  //=> string[]
  ```
  */
  strictLiteralChecks?: boolean;
};
type DefaultSplitOptions = {
  strictLiteralChecks: false;
};

/**
Represents an array of strings split using a given character or character set.

Use-case: Defining the return type of a method like `String.prototype.split`.

@example
```
import type {Split} from 'type-fest';

declare function split<S extends string, D extends string>(string: S, separator: D): Split<S, D>;

type Item = 'foo' | 'bar' | 'baz' | 'waldo';
const items = 'foo,bar,baz,waldo';
let array: Item[];

array = split(items, ',');
```

@see {@link SplitOptions}

@category String
@category Template literal
*/
type Split<S extends string, Delimiter extends string, Options extends SplitOptions = {}> = SplitHelper<S, Delimiter, ApplyDefaultOptions<SplitOptions, DefaultSplitOptions, Options>>;
type SplitHelper<S extends string, Delimiter extends string, Options extends Required<SplitOptions>, Accumulator extends string[] = []> = S extends string // For distributing `S`
? Delimiter extends string // For distributing `Delimeter`
// If `strictLiteralChecks` is `false` OR `S` and `Delimiter` both are string literals, then perform the split
? Or<Not<Options['strictLiteralChecks']>, And<IsStringLiteral<S>, IsStringLiteral<Delimiter>>> extends true ? S extends `${infer Head}${Delimiter}${infer Tail}` ? SplitHelper<Tail, Delimiter, Options, [...Accumulator, Head]> : Delimiter extends '' ? Accumulator : [...Accumulator, S]
// Otherwise, return `string[]`
: string[] : never // Should never happen
: never; // Should never happen
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/replace.d.ts
type ReplaceOptions = {
  all?: boolean;
};
type DefaultReplaceOptions = {
  all: false;
};

/**
Represents a string with some or all matches replaced by a replacement.

Use-case:
- `kebab-case-path` to `dotted.path.notation`
- Changing date/time format: `01-08-2042` → `01/08/2042`
- Manipulation of type properties, for example, removal of prefixes

@example
```
import {Replace} from 'type-fest';

declare function replace<
	Input extends string,
	Search extends string,
	Replacement extends string
>(
	input: Input,
	search: Search,
	replacement: Replacement
): Replace<Input, Search, Replacement>;

declare function replaceAll<
	Input extends string,
	Search extends string,
	Replacement extends string
>(
	input: Input,
	search: Search,
	replacement: Replacement
): Replace<Input, Search, Replacement, {all: true}>;

// The return type is the exact string literal, not just `string`.

replace('hello ?', '?', '🦄');
//=> 'hello 🦄'

replace('hello ??', '?', '❓');
//=> 'hello ❓?'

replaceAll('10:42:00', ':', '-');
//=> '10-42-00'

replaceAll('__userName__', '__', '');
//=> 'userName'

replaceAll('My Cool Title', ' ', '');
//=> 'MyCoolTitle'
```

@category String
@category Template literal
*/
type Replace<Input extends string, Search extends string, Replacement extends string, Options extends ReplaceOptions = {}> = _Replace<Input, Search, Replacement, ApplyDefaultOptions<ReplaceOptions, DefaultReplaceOptions, Options>>;
type _Replace<Input extends string, Search extends string, Replacement extends string, Options extends Required<ReplaceOptions>, Accumulator extends string = ''> = Search extends string // For distributing `Search`
? Replacement extends string // For distributing `Replacement`
? Input extends `${infer Head}${Search}${infer Tail}` ? Options['all'] extends true ? _Replace<Tail, Search, Replacement, Options, `${Accumulator}${Head}${Replacement}`> : `${Head}${Replacement}${Tail}` : `${Accumulator}${Input}` : never : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/string-repeat.d.ts
/**
Returns a new string which contains the specified number of copies of a given string, just like `String#repeat()`.

@example
```
import {StringRepeat} from 'type-fest';

declare function stringRepeat<
	Input extends string,
	Count extends number
>(input: Input, count: Count): StringRepeat<Input, Count>;

// The return type is the exact string literal, not just `string`.

stringRepeat('foo', 2);
//=> 'foofoo'

stringRepeat('=', 3);
//=> '==='
```

@category String
@category Template literal
*/
type StringRepeat<Input extends string, Count extends number> = StringRepeatHelper<Input, Count>;
type StringRepeatHelper<Input extends string, Count extends number, Counter extends never[] = [], Accumulator extends string = ''> = IsNegative<Count> extends true ? never : Input extends '' ? '' : Count extends Counter['length'] ? Accumulator : IsNumericLiteral<Count> extends false ? string : StringRepeatHelper<Input, Count, [...Counter, never], `${Accumulator}${Input}`>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/includes.d.ts
/**
Returns a boolean for whether the given array includes the given item.

This can be useful if another type wants to make a decision based on whether the array includes that item.

@example
```
import type {Includes} from 'type-fest';

type hasRed<array extends any[]> = Includes<array, 'red'>;
```

@category Array
*/
type Includes<Value extends readonly any[], Item> = Value extends readonly [Value[0], ...infer rest] ? IsEqual<Value[0], Item> extends true ? true : Includes<rest, Item> : false;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/get.d.ts
type GetOptions = {
  /**
  Include `undefined` in the return type when accessing properties.
  	Setting this to `false` is not recommended.
  	@default true
  */
  strict?: boolean;
};
type DefaultGetOptions = {
  strict: true;
};

/**
Like the `Get` type but receives an array of strings as a path parameter.
*/
type GetWithPath<BaseType, Keys, Options extends Required<GetOptions>> = Keys extends readonly [] ? BaseType : Keys extends readonly [infer Head, ...infer Tail] ? GetWithPath<PropertyOf<BaseType, Extract<Head, string>, Options>, Extract<Tail, string[]>, Options> : never;

/**
Adds `undefined` to `Type` if `strict` is enabled.
*/
type Strictify<Type, Options extends Required<GetOptions>> = Options['strict'] extends false ? Type : (Type | undefined);

/**
If `Options['strict']` is `true`, includes `undefined` in the returned type when accessing properties on `Record<string, any>`.

Known limitations:
- Does not include `undefined` in the type on object types with an index signature (for example, `{a: string; [key: string]: string}`).
*/
type StrictPropertyOf<BaseType, Key extends keyof BaseType, Options extends Required<GetOptions>> = Record<string, any> extends BaseType ? string extends keyof BaseType ? Strictify<BaseType[Key], Options> // Record<string, any>
: BaseType[Key] // Record<'a' | 'b', any> (Records with a string union as keys have required properties)
: BaseType[Key];

/**
Splits a dot-prop style path into a tuple comprised of the properties in the path. Handles square-bracket notation.

@example
```
ToPath<'foo.bar.baz'>
//=> ['foo', 'bar', 'baz']

ToPath<'foo[0].bar.baz'>
//=> ['foo', '0', 'bar', 'baz']
```
*/
type ToPath<S extends string> = Split<FixPathSquareBrackets<S>, '.'>;

/**
Replaces square-bracketed dot notation with dots, for example, `foo[0].bar` -> `foo.0.bar`.
*/
type FixPathSquareBrackets<Path extends string> = Path extends `[${infer Head}]${infer Tail}` ? Tail extends `[${string}` ? `${Head}.${FixPathSquareBrackets<Tail>}` : `${Head}${FixPathSquareBrackets<Tail>}` : Path extends `${infer Head}[${infer Middle}]${infer Tail}` ? `${Head}.${FixPathSquareBrackets<`[${Middle}]${Tail}`>}` : Path;

/**
Returns true if `LongString` is made up out of `Substring` repeated 0 or more times.

@example
```
ConsistsOnlyOf<'aaa', 'a'> //=> true
ConsistsOnlyOf<'ababab', 'ab'> //=> true
ConsistsOnlyOf<'aBa', 'a'> //=> false
ConsistsOnlyOf<'', 'a'> //=> true
```
*/
type ConsistsOnlyOf<LongString extends string, Substring extends string> = LongString extends '' ? true : LongString extends `${Substring}${infer Tail}` ? ConsistsOnlyOf<Tail, Substring> : false;

/**
Convert a type which may have number keys to one with string keys, making it possible to index using strings retrieved from template types.

@example
```
type WithNumbers = {foo: string; 0: boolean};
type WithStrings = WithStringKeys<WithNumbers>;

type WithNumbersKeys = keyof WithNumbers;
//=> 'foo' | 0
type WithStringsKeys = keyof WithStrings;
//=> 'foo' | '0'
```
*/
type WithStringKeys<BaseType> = { [Key in StringKeyOf<BaseType>]: UncheckedIndex<BaseType, Key> };

/**
Perform a `T[U]` operation if `T` supports indexing.
*/
type UncheckedIndex<T, U extends string | number> = [T] extends [Record<string | number, any>] ? T[U] : never;

/**
Get a property of an object or array. Works when indexing arrays using number-literal-strings, for example, `PropertyOf<number[], '0'> = number`, and when indexing objects with number keys.

Note:
- Returns `unknown` if `Key` is not a property of `BaseType`, since TypeScript uses structural typing, and it cannot be guaranteed that extra properties unknown to the type system will exist at runtime.
- Returns `undefined` from nullish values, to match the behaviour of most deep-key libraries like `lodash`, `dot-prop`, etc.
*/
type PropertyOf<BaseType, Key extends string, Options extends Required<GetOptions>> = BaseType extends null | undefined ? undefined : Key extends keyof BaseType ? StrictPropertyOf<BaseType, Key, Options>
// Handle arrays and tuples
: BaseType extends readonly unknown[] ? Key extends `${number}`
// For arrays with unknown length (regular arrays)
? number extends BaseType['length'] ? Strictify<BaseType[number], Options>
// For tuples: check if the index is valid
: Key extends keyof BaseType ? Strictify<BaseType[Key & keyof BaseType], Options>
// Out-of-bounds access for tuples
: unknown
// Non-numeric string key for arrays/tuples
: unknown
// Handle array-like objects
: BaseType extends {
  [n: number]: infer Item;
  length: number; // Note: This is needed to avoid being too lax with records types using number keys like `{0: string; 1: boolean}`.
} ? (ConsistsOnlyOf<Key, StringDigit> extends true ? Strictify<Item, Options> : unknown) : Key extends keyof WithStringKeys<BaseType> ? StrictPropertyOf<WithStringKeys<BaseType>, Key, Options> : unknown;

// This works by first splitting the path based on `.` and `[...]` characters into a tuple of string keys. Then it recursively uses the head key to get the next property of the current object, until there are no keys left. Number keys extract the item type from arrays, or are converted to strings to extract types from tuples and dictionaries with number keys.
/**
Get a deeply-nested property from an object using a key path, like Lodash's `.get()` function.

Use-case: Retrieve a property from deep inside an API response or some other complex object.

@example
```
import type {Get} from 'type-fest';
import * as lodash from 'lodash';

const get = <BaseType, Path extends string | readonly string[]>(object: BaseType, path: Path): Get<BaseType, Path> =>
	lodash.get(object, path);

interface ApiResponse {
	hits: {
		hits: Array<{
			_id: string
			_source: {
				name: Array<{
					given: string[]
					family: string
				}>
				birthDate: string
			}
		}>
	}
}

const getName = (apiResponse: ApiResponse) =>
	get(apiResponse, 'hits.hits[0]._source.name');
	//=> Array<{given: string[]; family: string}> | undefined

// Path also supports a readonly array of strings
const getNameWithPathArray = (apiResponse: ApiResponse) =>
	get(apiResponse, ['hits','hits', '0', '_source', 'name'] as const);
	//=> Array<{given: string[]; family: string}> | undefined

// Non-strict mode:
Get<string[], '3', {strict: false}> //=> string
Get<Record<string, string>, 'foo', {strict: true}> // => string
```

@category Object
@category Array
@category Template literal
*/
type Get<BaseType, Path extends readonly string[] | LiteralStringUnion<ToString<Paths<BaseType, {
  bracketNotation: false;
  maxRecursionDepth: 2;
}> | Paths<BaseType, {
  bracketNotation: true;
  maxRecursionDepth: 2;
}>>>, Options extends GetOptions = {}> = GetWithPath<BaseType, Path extends string ? ToPath<Path> : Path, ApplyDefaultOptions<GetOptions, DefaultGetOptions, Options>>;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/last-array-element.d.ts
/**
Extracts the type of the last element of an array.

Use-case: Defining the return type of functions that extract the last element of an array, for example [`lodash.last`](https://lodash.com/docs/4.17.15#last).

@example
```
import type {LastArrayElement} from 'type-fest';

declare function lastOf<V extends readonly any[]>(array: V): LastArrayElement<V>;

const array = ['foo', 2];

typeof lastOf(array);
//=> number

const array = ['foo', 2] as const;

typeof lastOf(array);
//=> 2
```

@category Array
@category Template literal
*/
type LastArrayElement<Elements extends readonly unknown[], ElementBeforeTailingSpreadElement = never> =
// If the last element of an array is a spread element, the `LastArrayElement` result should be `'the type of the element before the spread element' | 'the type of the spread element'`.
Elements extends readonly [] ? ElementBeforeTailingSpreadElement : Elements extends readonly [...infer U, infer V] ? V : Elements extends readonly [infer U, ...infer V]
// If we return `V[number] | U` directly, it would be wrong for `[[string, boolean, object, ...number[]]`.
// So we need to recurse type `V` and carry over the type of the element before the spread element.
? LastArrayElement<V, U> : Elements extends ReadonlyArray<infer U> ? U | ElementBeforeTailingSpreadElement : never;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/global-this.d.ts
/**
Declare locally scoped properties on `globalThis`.

When defining a global variable in a declaration file is inappropriate, it can be helpful to define a `type` or `interface` (say `ExtraGlobals`) with the global variable and then cast `globalThis` via code like `globalThis as unknown as ExtraGlobals`.

Instead of casting through `unknown`, you can update your `type` or `interface` to extend `GlobalThis` and then directly cast `globalThis`.

@example
```
import type {GlobalThis} from 'type-fest';

type ExtraGlobals = GlobalThis & {
	readonly GLOBAL_TOKEN: string;
};

(globalThis as ExtraGlobals).GLOBAL_TOKEN;
```

@category Type
*/
type GlobalThis = typeof globalThis;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/package-json.d.ts
declare namespace PackageJson {
  /**
  A person who has been involved in creating or maintaining the package.
  */
  export type Person = string | {
    name: string;
    url?: string;
    email?: string;
  };
  export type BugsLocation = string | {
    /**
    The URL to the package's issue tracker.
    */
    url?: string;

    /**
    The email address to which issues should be reported.
    */
    email?: string;
  };
  export type DirectoryLocations = {
    [directoryType: string]: JsonValue | undefined;

    /**
    Location for executable scripts. Sugar to generate entries in the `bin` property by walking the folder.
    */
    bin?: string;

    /**
    Location for Markdown files.
    */
    doc?: string;

    /**
    Location for example scripts.
    */
    example?: string;

    /**
    Location for the bulk of the library.
    */
    lib?: string;

    /**
    Location for man pages. Sugar to generate a `man` array by walking the folder.
    */
    man?: string;

    /**
    Location for test files.
    */
    test?: string;
  };
  export type Scripts = {
    /**
    Run **before** the package is published (Also run on local `npm install` without any arguments).
    */
    prepublish?: string;

    /**
    Run both **before** the package is packed and published, and on local `npm install` without any arguments. This is run **after** `prepublish`, but **before** `prepublishOnly`.
    */
    prepare?: string;

    /**
    Run **before** the package is prepared and packed, **only** on `npm publish`.
    */
    prepublishOnly?: string;

    /**
    Run **before** a tarball is packed (on `npm pack`, `npm publish`, and when installing git dependencies).
    */
    prepack?: string;

    /**
    Run **after** the tarball has been generated and moved to its final destination.
    */
    postpack?: string;

    /**
    Run **after** the package is published.
    */
    publish?: string;

    /**
    Run **after** the package is published.
    */
    postpublish?: string;

    /**
    Run **before** the package is installed.
    */
    preinstall?: string;

    /**
    Run **after** the package is installed.
    */
    install?: string;

    /**
    Run **after** the package is installed and after `install`.
    */
    postinstall?: string;

    /**
    Run **before** the package is uninstalled and before `uninstall`.
    */
    preuninstall?: string;

    /**
    Run **before** the package is uninstalled.
    */
    uninstall?: string;

    /**
    Run **after** the package is uninstalled.
    */
    postuninstall?: string;

    /**
    Run **before** bump the package version and before `version`.
    */
    preversion?: string;

    /**
    Run **before** bump the package version.
    */
    version?: string;

    /**
    Run **after** bump the package version.
    */
    postversion?: string;

    /**
    Run with the `npm test` command, before `test`.
    */
    pretest?: string;

    /**
    Run with the `npm test` command.
    */
    test?: string;

    /**
    Run with the `npm test` command, after `test`.
    */
    posttest?: string;

    /**
    Run with the `npm stop` command, before `stop`.
    */
    prestop?: string;

    /**
    Run with the `npm stop` command.
    */
    stop?: string;

    /**
    Run with the `npm stop` command, after `stop`.
    */
    poststop?: string;

    /**
    Run with the `npm start` command, before `start`.
    */
    prestart?: string;

    /**
    Run with the `npm start` command.
    */
    start?: string;

    /**
    Run with the `npm start` command, after `start`.
    */
    poststart?: string;

    /**
    Run with the `npm restart` command, before `restart`. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.
    */
    prerestart?: string;

    /**
    Run with the `npm restart` command. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.
    */
    restart?: string;

    /**
    Run with the `npm restart` command, after `restart`. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.
    */
    postrestart?: string;
  } & Partial<Record<string, string>>;

  /**
  Dependencies of the package. The version range is a string which has one or more space-separated descriptors. Dependencies can also be identified with a tarball or Git URL.
  */
  export type Dependency = Partial<Record<string, string>>;

  /**
  A mapping of conditions and the paths to which they resolve.
  */
  type ExportConditions = {
    // eslint-disable-line @typescript-eslint/consistent-indexed-object-style
    [condition: string]: Exports;
  };

  /**
  Entry points of a module, optionally with conditions and subpath exports.
  */
  export type Exports = null | string | Array<string | ExportConditions> | ExportConditions;

  /**
  Import map entries of a module, optionally with conditions and subpath imports.
  */
  export type Imports = {
    // eslint-disable-line @typescript-eslint/consistent-indexed-object-style
    [key: `#${string}`]: Exports;
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface NonStandardEntryPoints {
    /**
    An ECMAScript module ID that is the primary entry point to the program.
    */
    module?: string;

    /**
    A module ID with untranspiled code that is the primary entry point to the program.
    */
    esnext?: string | {
      [moduleName: string]: string | undefined;
      main?: string;
      browser?: string;
    };

    /**
    A hint to JavaScript bundlers or component tools when packaging modules for client side use.
    */
    browser?: string | Partial<Record<string, string | false>>;

    /**
    Denote which files in your project are "pure" and therefore safe for Webpack to prune if unused.
    	[Read more.](https://webpack.js.org/guides/tree-shaking/)
    */
    sideEffects?: boolean | string[];
  }
  export type TypeScriptConfiguration = {
    /**
    Location of the bundled TypeScript declaration file.
    */
    types?: string;

    /**
    Version selection map of TypeScript.
    */
    typesVersions?: Partial<Record<string, Partial<Record<string, string[]>>>>;

    /**
    Location of the bundled TypeScript declaration file. Alias of `types`.
    */
    typings?: string;
  };

  /**
  An alternative configuration for workspaces.
  */
  export type WorkspaceConfig = {
    /**
    An array of workspace pattern strings which contain the workspace packages.
    */
    packages?: WorkspacePattern[];

    /**
    Designed to solve the problem of packages which break when their `node_modules` are moved to the root workspace directory - a process known as hoisting. For these packages, both within your workspace, and also some that have been installed via `node_modules`, it is important to have a mechanism for preventing the default Yarn workspace behavior. By adding workspace pattern strings here, Yarn will resume non-workspace behavior for any package which matches the defined patterns.
    	[Supported](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/) by Yarn.
    [Not supported](https://github.com/npm/rfcs/issues/287) by npm.
    */
    nohoist?: WorkspacePattern[];
  };

  /**
  A workspace pattern points to a directory or group of directories which contain packages that should be included in the workspace installation process.
  	The patterns are handled with [minimatch](https://github.com/isaacs/minimatch).
  	@example
  `docs` → Include the docs directory and install its dependencies.
  `packages/*` → Include all nested directories within the packages directory, like `packages/cli` and `packages/core`.
  */
  type WorkspacePattern = string;
  export type YarnConfiguration = {
    /**
    If your package only allows one version of a given dependency, and you’d like to enforce the same behavior as `yarn install --flat` on the command-line, set this to `true`.
    	Note that if your `package.json` contains `"flat": true` and other packages depend on yours (e.g. you are building a library rather than an app), those other packages will also need `"flat": true` in their `package.json` or be installed with `yarn install --flat` on the command-line.
    */
    flat?: boolean;

    /**
    Selective version resolutions. Allows the definition of custom package versions inside dependencies without manual edits in the `yarn.lock` file.
    */
    resolutions?: Dependency;
  };
  export type JSPMConfiguration = {
    /**
    JSPM configuration.
    */
    jspm?: PackageJson;
  };

  /**
  Type for [npm's `package.json` file](https://docs.npmjs.com/creating-a-package-json-file). Containing standard npm properties.
  */
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface PackageJsonStandard {
    /**
    The name of the package.
    */
    name?: string;

    /**
    Package version, parseable by [`node-semver`](https://github.com/npm/node-semver).
    */
    version?: string;

    /**
    Package description, listed in `npm search`.
    */
    description?: string;

    /**
    Keywords associated with package, listed in `npm search`.
    */
    keywords?: string[];

    /**
    The URL to the package's homepage.
    */
    homepage?: LiteralUnion<'.', string>;

    /**
    The URL to the package's issue tracker and/or the email address to which issues should be reported.
    */
    bugs?: BugsLocation;

    /**
    The license for the package.
    */
    license?: string;

    /**
    The licenses for the package.
    */
    licenses?: Array<{
      type?: string;
      url?: string;
    }>;
    author?: Person;

    /**
    A list of people who contributed to the package.
    */
    contributors?: Person[];

    /**
    A list of people who maintain the package.
    */
    maintainers?: Person[];

    /**
    The files included in the package.
    */
    files?: string[];

    /**
    Resolution algorithm for importing ".js" files from the package's scope.
    	[Read more.](https://nodejs.org/api/esm.html#esm_package_json_type_field)
    */
    type?: 'module' | 'commonjs';

    /**
    The module ID that is the primary entry point to the program.
    */
    main?: string;

    /**
    Subpath exports to define entry points of the package.
    	[Read more.](https://nodejs.org/api/packages.html#subpath-exports)
    */
    exports?: Exports;

    /**
    Subpath imports to define internal package import maps that only apply to import specifiers from within the package itself.
    	[Read more.](https://nodejs.org/api/packages.html#subpath-imports)
    */
    imports?: Imports;

    /**
    The executable files that should be installed into the `PATH`.
    */
    bin?: string | Partial<Record<string, string>>;

    /**
    Filenames to put in place for the `man` program to find.
    */
    man?: string | string[];

    /**
    Indicates the structure of the package.
    */
    directories?: DirectoryLocations;

    /**
    Location for the code repository.
    */
    repository?: string | {
      type: string;
      url: string;

      /**
      Relative path to package.json if it is placed in non-root directory (for example if it is part of a monorepo).
      	[Read more.](https://github.com/npm/rfcs/blob/latest/implemented/0010-monorepo-subdirectory-declaration.md)
      */
      directory?: string;
    };

    /**
    Script commands that are run at various times in the lifecycle of the package. The key is the lifecycle event, and the value is the command to run at that point.
    */
    scripts?: Scripts;

    /**
    Is used to set configuration parameters used in package scripts that persist across upgrades.
    */
    config?: JsonObject;

    /**
    The dependencies of the package.
    */
    dependencies?: Dependency;

    /**
    Additional tooling dependencies that are not required for the package to work. Usually test, build, or documentation tooling.
    */
    devDependencies?: Dependency;

    /**
    Dependencies that are skipped if they fail to install.
    */
    optionalDependencies?: Dependency;

    /**
    Dependencies that will usually be required by the package user directly or via another dependency.
    */
    peerDependencies?: Dependency;

    /**
    Indicate peer dependencies that are optional.
    */
    peerDependenciesMeta?: Partial<Record<string, {
      optional: true;
    }>>;

    /**
    Package names that are bundled when the package is published.
    */
    bundledDependencies?: string[];

    /**
    Alias of `bundledDependencies`.
    */
    bundleDependencies?: string[];

    /**
    Engines that this package runs on.
    */
    engines?: { [EngineName in 'npm' | 'node' | string]?: string };

    /**
    @deprecated
    */
    engineStrict?: boolean;

    /**
    Operating systems the module runs on.
    */
    os?: Array<LiteralUnion<'aix' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32' | '!aix' | '!darwin' | '!freebsd' | '!linux' | '!openbsd' | '!sunos' | '!win32', string>>;

    /**
    CPU architectures the module runs on.
    */
    cpu?: Array<LiteralUnion<'arm' | 'arm64' | 'ia32' | 'mips' | 'mipsel' | 'ppc' | 'ppc64' | 's390' | 's390x' | 'x32' | 'x64' | '!arm' | '!arm64' | '!ia32' | '!mips' | '!mipsel' | '!ppc' | '!ppc64' | '!s390' | '!s390x' | '!x32' | '!x64', string>>;

    /**
    If set to `true`, a warning will be shown if package is installed locally. Useful if the package is primarily a command-line application that should be installed globally.
    	@deprecated
    */
    preferGlobal?: boolean;

    /**
    If set to `true`, then npm will refuse to publish it.
    */
    private?: boolean;

    /**
    A set of config values that will be used at publish-time. It's especially handy to set the tag, registry or access, to ensure that a given package is not tagged with 'latest', published to the global public registry or that a scoped module is private by default.
    */
    publishConfig?: PublishConfig;

    /**
    Describes and notifies consumers of a package's monetary support information.
    	[Read more.](https://github.com/npm/rfcs/blob/latest/accepted/0017-add-funding-support.md)
    */
    funding?: string | {
      /**
      The type of funding.
      */
      type?: LiteralUnion<'github' | 'opencollective' | 'patreon' | 'individual' | 'foundation' | 'corporation', string>;

      /**
      The URL to the funding page.
      */
      url: string;
    };

    /**
    Used to configure [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) / [Yarn workspaces](https://classic.yarnpkg.com/docs/workspaces/).
    	Workspaces allow you to manage multiple packages within the same repository in such a way that you only need to run your install command once in order to install all of them in a single pass.
    	Please note that the top-level `private` property of `package.json` **must** be set to `true` in order to use workspaces.
    */
    workspaces?: WorkspacePattern[] | WorkspaceConfig;
  }

  /**
  Type for [`package.json` file used by the Node.js runtime](https://nodejs.org/api/packages.html#nodejs-packagejson-field-definitions).
  */
  export type NodeJsStandard = {
    /**
    Defines which package manager is expected to be used when working on the current project. It can set to any of the [supported package managers](https://nodejs.org/api/corepack.html#supported-package-managers), and will ensure that your teams use the exact same package manager versions without having to install anything else than Node.js.
    	__This field is currently experimental and needs to be opted-in; check the [Corepack](https://nodejs.org/api/corepack.html) page for details about the procedure.__
    	@example
    ```json
    {
    	"packageManager": "<package manager name>@<version>"
    }
    ```
    */
    packageManager?: string;
  };
  export type PublishConfig = {
    /**
    Additional, less common properties from the [npm docs on `publishConfig`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#publishconfig).
    */
    [additionalProperties: string]: JsonValue | undefined;

    /**
    When publishing scoped packages, the access level defaults to restricted. If you want your scoped package to be publicly viewable (and installable) set `--access=public`. The only valid values for access are public and restricted. Unscoped packages always have an access level of public.
    */
    access?: 'public' | 'restricted';

    /**
    The base URL of the npm registry.
    	Default: `'https://registry.npmjs.org/'`
    */
    registry?: string;

    /**
    The tag to publish the package under.
    	Default: `'latest'`
    */
    tag?: string;
  };
}

/**
Type for [npm's `package.json` file](https://docs.npmjs.com/creating-a-package-json-file). Also includes types for fields used by other popular projects, like TypeScript and Yarn.

@category File
*/
type PackageJson = JsonObject & PackageJson.NodeJsStandard & PackageJson.PackageJsonStandard & PackageJson.NonStandardEntryPoints & PackageJson.TypeScriptConfiguration & PackageJson.YarnConfiguration & PackageJson.JSPMConfiguration;
//#endregion
//#region node_modules/.pnpm/type-fest@4.41.0/node_modules/type-fest/source/tsconfig-json.d.ts
declare namespace TsConfigJson {
  namespace CompilerOptions {
    export type JSX = 'preserve' | 'react' | 'react-jsx' | 'react-jsxdev' | 'react-native';
    export type Module = 'CommonJS' | 'AMD' | 'System' | 'UMD' | 'ES6' | 'ES2015' | 'ES2020' | 'ES2022' | 'ESNext' | 'Node16' | 'Node18' | 'NodeNext' | 'Preserve' | 'None'
    // Lowercase alternatives
    | 'commonjs' | 'amd' | 'system' | 'umd' | 'es6' | 'es2015' | 'es2020' | 'es2022' | 'esnext' | 'node16' | 'node18' | 'nodenext' | 'preserve' | 'none';
    export type NewLine = 'CRLF' | 'LF'
    // Lowercase alternatives
    | 'crlf' | 'lf';
    export type Target = 'ES3' | 'ES5' | 'ES6' | 'ES2015' | 'ES2016' | 'ES2017' | 'ES2018' | 'ES2019' | 'ES2020' | 'ES2021' | 'ES2022' | 'ES2023' | 'ES2024' | 'ESNext'
    // Lowercase alternatives
    | 'es3' | 'es5' | 'es6' | 'es2015' | 'es2016' | 'es2017' | 'es2018' | 'es2019' | 'es2020' | 'es2021' | 'es2022' | 'es2023' | 'es2024' | 'esnext';

    // eslint-disable-next-line unicorn/prevent-abbreviations
    export type Lib = 'ES5' | 'ES6' | 'ES7' | 'ES2015' | 'ES2015.Collection' | 'ES2015.Core' | 'ES2015.Generator' | 'ES2015.Iterable' | 'ES2015.Promise' | 'ES2015.Proxy' | 'ES2015.Reflect' | 'ES2015.Symbol.WellKnown' | 'ES2015.Symbol' | 'ES2016' | 'ES2016.Array.Include' | 'ES2017' | 'ES2017.ArrayBuffer' | 'ES2017.Date' | 'ES2017.Intl' | 'ES2017.Object' | 'ES2017.SharedMemory' | 'ES2017.String' | 'ES2017.TypedArrays' | 'ES2018' | 'ES2018.AsyncGenerator' | 'ES2018.AsyncIterable' | 'ES2018.Intl' | 'ES2018.Promise' | 'ES2018.Regexp' | 'ES2019' | 'ES2019.Array' | 'ES2019.Object' | 'ES2019.String' | 'ES2019.Symbol' | 'ES2020' | 'ES2020.BigInt' | 'ES2020.Promise' | 'ES2020.String' | 'ES2020.Symbol.WellKnown' | 'ES2020.SharedMemory' | 'ES2020.Intl' | 'ES2021' | 'ES2021.Intl' | 'ES2021.Promise' | 'ES2021.String' | 'ES2021.WeakRef' | 'ES2022' | 'ES2022.Array' | 'ES2022.Error' | 'ES2022.Intl' | 'ES2022.Object' | 'ES2022.RegExp' | 'ES2022.String' | 'ES2023' | 'ES2023.Array' | 'ES2023.Collection' | 'ES2023.Intl' | 'ES2024' | 'ES2024.ArrayBuffer' | 'ES2024.Collection' | 'ES2024.Object' | 'ES2024.Promise' | 'ES2024.Regexp' | 'ES2024.SharedMemory' | 'ES2024.String' | 'ESNext' | 'ESNext.Array' | 'ESNext.AsyncIterable' | 'ESNext.BigInt' | 'ESNext.Collection' | 'ESNext.Decorators' | 'ESNext.Disposable' | 'ESNext.Intl' | 'ESNext.Iterator' | 'ESNext.Promise' | 'ESNext.String' | 'ESNext.Symbol' | 'ESNext.WeakRef' | 'DOM' | 'DOM.Iterable' | 'ScriptHost' | 'WebWorker' | 'WebWorker.AsyncIterable' | 'WebWorker.ImportScripts' | 'WebWorker.Iterable'
    // Lowercase alternatives
    | 'es5' | 'es6' | 'es7' | 'es2015' | 'es2015.collection' | 'es2015.core' | 'es2015.generator' | 'es2015.iterable' | 'es2015.promise' | 'es2015.proxy' | 'es2015.reflect' | 'es2015.symbol.wellknown' | 'es2015.symbol' | 'es2016' | 'es2016.array.include' | 'es2017' | 'es2017.arraybuffer' | 'es2017.date' | 'es2017.intl' | 'es2017.object' | 'es2017.sharedmemory' | 'es2017.string' | 'es2017.typedarrays' | 'es2018' | 'es2018.asyncgenerator' | 'es2018.asynciterable' | 'es2018.intl' | 'es2018.promise' | 'es2018.regexp' | 'es2019' | 'es2019.array' | 'es2019.object' | 'es2019.string' | 'es2019.symbol' | 'es2020' | 'es2020.bigint' | 'es2020.promise' | 'es2020.string' | 'es2020.symbol.wellknown' | 'es2020.sharedmemory' | 'es2020.intl' | 'es2021' | 'es2021.intl' | 'es2021.promise' | 'es2021.string' | 'es2021.weakref' | 'es2022' | 'es2022.array' | 'es2022.error' | 'es2022.intl' | 'es2022.object' | 'es2022.regexp' | 'es2022.string' | 'es2023' | 'es2023.array' | 'es2023.collection' | 'es2023.intl' | 'es2024' | 'es2024.arraybuffer' | 'es2024.collection' | 'es2024.object' | 'es2024.promise' | 'es2024.regexp' | 'es2024.sharedmemory' | 'es2024.string' | 'esnext' | 'esnext.array' | 'esnext.asynciterable' | 'esnext.bigint' | 'esnext.collection' | 'esnext.decorators' | 'esnext.disposable' | 'esnext.intl' | 'esnext.iterator' | 'esnext.promise' | 'esnext.string' | 'esnext.symbol' | 'esnext.weakref' | 'dom' | 'dom.iterable' | 'scripthost' | 'webworker' | 'webworker.asynciterable' | 'webworker.importscripts' | 'webworker.iterable';
    export type Plugin = {
      /**
      Plugin name.
      */
      name: string;
    };
    export type ImportsNotUsedAsValues = 'remove' | 'preserve' | 'error';
    export type FallbackPolling = 'fixedPollingInterval' | 'priorityPollingInterval' | 'dynamicPriorityPolling' | 'fixedInterval' | 'priorityInterval' | 'dynamicPriority' | 'fixedChunkSize';
    export type WatchDirectory = 'useFsEvents' | 'fixedPollingInterval' | 'dynamicPriorityPolling' | 'fixedChunkSizePolling';
    export type WatchFile = 'fixedPollingInterval' | 'priorityPollingInterval' | 'dynamicPriorityPolling' | 'useFsEvents' | 'useFsEventsOnParentDirectory' | 'fixedChunkSizePolling';
    export type ModuleResolution = 'classic' | 'node' | 'node10' | 'node16' | 'nodenext' | 'bundler'
    // Pascal-cased alternatives
    | 'Classic' | 'Node' | 'Node10' | 'Node16' | 'NodeNext' | 'Bundler';
    export type ModuleDetection = 'auto' | 'legacy' | 'force';
    export type IgnoreDeprecations = '5.0';
  }
  export type CompilerOptions = {
    /**
    The character set of the input files.
    	@default 'utf8'
    @deprecated This option will be removed in TypeScript 5.5.
    */
    charset?: string;

    /**
    Enables building for project references.
    	@default true
    */
    composite?: boolean;

    /**
    Generates corresponding d.ts files.
    	@default false
    */
    declaration?: boolean;

    /**
    Specify output directory for generated declaration files.
    */
    declarationDir?: string;

    /**
    Show diagnostic information.
    	@default false
    */
    diagnostics?: boolean;

    /**
    Reduce the number of projects loaded automatically by TypeScript.
    	@default false
    */
    disableReferencedProjectLoad?: boolean;

    /**
    Enforces using indexed accessors for keys declared using an indexed type.
    	@default false
    */
    noPropertyAccessFromIndexSignature?: boolean;

    /**
    Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.
    	@default false
    */
    emitBOM?: boolean;

    /**
    Only emit `.d.ts` declaration files.
    	@default false
    */
    emitDeclarationOnly?: boolean;

    /**
    Differentiate between undefined and not present when type checking.
    	@default false
    */
    exactOptionalPropertyTypes?: boolean;

    /**
    Enable incremental compilation.
    	@default `composite`
    */
    incremental?: boolean;

    /**
    Specify file to store incremental compilation information.
    	@default '.tsbuildinfo'
    */
    tsBuildInfoFile?: string;

    /**
    Emit a single file with source maps instead of having a separate file.
    	@default false
    */
    inlineSourceMap?: boolean;

    /**
    Emit the source alongside the sourcemaps within a single file.
    	Requires `--inlineSourceMap` to be set.
    	@default false
    */
    inlineSources?: boolean;

    /**
    Specify what JSX code is generated.
    	@default 'preserve'
    */
    jsx?: CompilerOptions.JSX;

    /**
    Specifies the object invoked for `createElement` and `__spread` when targeting `'react'` JSX emit.
    	@default 'React'
    */
    reactNamespace?: string;

    /**
    Specify the JSX factory function to use when targeting React JSX emit, e.g. `React.createElement` or `h`.
    	@default 'React.createElement'
    */
    jsxFactory?: string;

    /**
    Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'.
    	@default 'React.Fragment'
    */
    jsxFragmentFactory?: string;

    /**
    Specify module specifier used to import the JSX factory functions when using `jsx: react-jsx*`.
    	@default 'react'
    */
    jsxImportSource?: string;

    /**
    Print names of files part of the compilation.
    	@default false
    */
    listFiles?: boolean;

    /**
    Specifies the location where debugger should locate map files instead of generated locations.
    */
    mapRoot?: string;

    /**
    Specify module code generation: 'None', 'CommonJS', 'AMD', 'System', 'UMD', 'ES6', 'ES2015' or 'ESNext'. Only 'AMD' and 'System' can be used in conjunction with `--outFile`. 'ES6' and 'ES2015' values may be used when targeting 'ES5' or lower.
    	@default ['ES3', 'ES5'].includes(target) ? 'CommonJS' : 'ES6'
    */
    module?: CompilerOptions.Module;

    /**
    Specifies module resolution strategy: 'node' (Node) or 'classic' (TypeScript pre 1.6).
    	@default ['AMD', 'System', 'ES6'].includes(module) ? 'classic' : 'node'
    */
    moduleResolution?: CompilerOptions.ModuleResolution;

    /**
    Specifies the end of line sequence to be used when emitting files: 'crlf' (Windows) or 'lf' (Unix).
    	@default 'LF'
    */
    newLine?: CompilerOptions.NewLine;

    /**
    Disable full type checking (only critical parse and emit errors will be reported).
    	@default false
    */
    noCheck?: boolean;

    /**
    Do not emit output.
    	@default false
    */
    noEmit?: boolean;

    /**
    Do not generate custom helper functions like `__extends` in compiled output.
    	@default false
    */
    noEmitHelpers?: boolean;

    /**
    Do not emit outputs if any type checking errors were reported.
    	@default false
    */
    noEmitOnError?: boolean;

    /**
    Warn on expressions and declarations with an implied 'any' type.
    	@default false
    */
    noImplicitAny?: boolean;

    /**
    Raise error on 'this' expressions with an implied any type.
    	@default false
    */
    noImplicitThis?: boolean;

    /**
    Report errors on unused locals.
    	@default false
    */
    noUnusedLocals?: boolean;

    /**
    Report errors on unused parameters.
    	@default false
    */
    noUnusedParameters?: boolean;

    /**
    Do not include the default library file (lib.d.ts).
    	@default false
    */
    noLib?: boolean;

    /**
    Do not add triple-slash references or module import targets to the list of compiled files.
    	@default false
    */
    noResolve?: boolean;

    /**
    Disable strict checking of generic signatures in function types.
    	@default false
    @deprecated This option will be removed in TypeScript 5.5.
    */
    noStrictGenericChecks?: boolean;

    /**
    @deprecated use `skipLibCheck` instead.
    */
    skipDefaultLibCheck?: boolean;

    /**
    Skip type checking of declaration files.
    	@default false
    */
    skipLibCheck?: boolean;

    /**
    Concatenate and emit output to single file.
    */
    outFile?: string;

    /**
    Redirect output structure to the directory.
    */
    outDir?: string;

    /**
    Do not erase const enum declarations in generated code.
    	@default false
    */
    preserveConstEnums?: boolean;

    /**
    Do not resolve symlinks to their real path; treat a symlinked file like a real one.
    	@default false
    */
    preserveSymlinks?: boolean;

    /**
    Keep outdated console output in watch mode instead of clearing the screen.
    	@default false
    */
    preserveWatchOutput?: boolean;

    /**
    Stylize errors and messages using color and context (experimental).
    	@default true // Unless piping to another program or redirecting output to a file.
    */
    pretty?: boolean;

    /**
    Do not emit comments to output.
    	@default false
    */
    removeComments?: boolean;

    /**
    Specifies the root directory of input files.
    	Use to control the output directory structure with `--outDir`.
    */
    rootDir?: string;

    /**
    Unconditionally emit imports for unresolved files.
    	@default false
    */
    isolatedModules?: boolean;

    /**
    Require sufficient annotation on exports so other tools can trivially generate declaration files.
    	@default false
    */
    isolatedDeclarations?: boolean;

    /**
    Generates corresponding '.map' file.
    	@default false
    */
    sourceMap?: boolean;

    /**
    Specifies the location where debugger should locate TypeScript files instead of source locations.
    */
    sourceRoot?: string;

    /**
    Suppress excess property checks for object literals.
    	@default false
    @deprecated This option will be removed in TypeScript 5.5.
    */
    suppressExcessPropertyErrors?: boolean;

    /**
    Suppress noImplicitAny errors for indexing objects lacking index signatures.
    	@default false
    @deprecated This option will be removed in TypeScript 5.5.
    */
    suppressImplicitAnyIndexErrors?: boolean;

    /**
    Do not emit declarations for code that has an `@internal` annotation.
    */
    stripInternal?: boolean;

    /**
    Specify ECMAScript target version.
    	@default 'es3'
    */
    target?: CompilerOptions.Target;

    /**
    Default catch clause variables as `unknown` instead of `any`.
    	@default false
    */
    useUnknownInCatchVariables?: boolean;

    /**
    Watch input files.
    	@default false
    @deprecated Use watchOptions instead.
    */
    watch?: boolean;

    /**
    Specify the polling strategy to use when the system runs out of or doesn't support native file watchers.
    	@deprecated Use watchOptions.fallbackPolling instead.
    */
    fallbackPolling?: CompilerOptions.FallbackPolling;

    /**
    Specify the strategy for watching directories under systems that lack recursive file-watching functionality.
    	@default 'useFsEvents'
    @deprecated Use watchOptions.watchDirectory instead.
    */
    watchDirectory?: CompilerOptions.WatchDirectory;

    /**
    Specify the strategy for watching individual files.
    	@default 'useFsEvents'
    @deprecated Use watchOptions.watchFile instead.
    */
    watchFile?: CompilerOptions.WatchFile;

    /**
    Enables experimental support for ES7 decorators.
    	@default false
    */
    experimentalDecorators?: boolean;

    /**
    Emit design-type metadata for decorated declarations in source.
    	@default false
    */
    emitDecoratorMetadata?: boolean;

    /**
    Do not report errors on unused labels.
    	@default false
    */
    allowUnusedLabels?: boolean;

    /**
    Report error when not all code paths in function return a value.
    	@default false
    */
    noImplicitReturns?: boolean;

    /**
    Add `undefined` to a type when accessed using an index.
    	@default false
    */
    noUncheckedIndexedAccess?: boolean;

    /**
    Report error if failed to find a source file for a side effect import.
    	@default false
    */
    noUncheckedSideEffectImports?: boolean;

    /**
    Report errors for fallthrough cases in switch statement.
    	@default false
    */
    noFallthroughCasesInSwitch?: boolean;

    /**
    Ensure overriding members in derived classes are marked with an override modifier.
    	@default false
    */
    noImplicitOverride?: boolean;

    /**
    Do not report errors on unreachable code.
    	@default false
    */
    allowUnreachableCode?: boolean;

    /**
    Disallow inconsistently-cased references to the same file.
    	@default true
    */
    forceConsistentCasingInFileNames?: boolean;

    /**
    Emit a v8 CPU profile of the compiler run for debugging.
    	@default 'profile.cpuprofile'
    */
    generateCpuProfile?: string;

    /**
    Generates an event trace and a list of types.
    */
    generateTrace?: boolean;

    /**
    Base directory to resolve non-relative module names.
    */
    baseUrl?: string;

    /**
    Specify path mapping to be computed relative to baseUrl option.
    */
    paths?: Record<string, string[]>;

    /**
    List of TypeScript language server plugins to load.
    */
    plugins?: CompilerOptions.Plugin[];

    /**
    Specify list of root directories to be used when resolving modules.
    */
    rootDirs?: string[];

    /**
    Specify list of directories for type definition files to be included.
    */
    typeRoots?: string[];

    /**
    Type declaration files to be included in compilation.
    */
    types?: string[];

    /**
    Enable tracing of the name resolution process.
    	@default false
    */
    traceResolution?: boolean;

    /**
    Allow javascript files to be compiled.
    	@default false
    */
    allowJs?: boolean;

    /**
    Do not truncate error messages.
    	@default false
    */
    noErrorTruncation?: boolean;

    /**
    Allow default imports from modules with no default export. This does not affect code emit, just typechecking.
    	@default module === 'system' || esModuleInterop
    */
    allowSyntheticDefaultImports?: boolean;

    /**
    Do not emit `'use strict'` directives in module output.
    	@default false
    @deprecated This option will be removed in TypeScript 5.5.
    */
    noImplicitUseStrict?: boolean;

    /**
    Enable to list all emitted files.
    	@default false
    */
    listEmittedFiles?: boolean;

    /**
    Disable size limit for JavaScript project.
    	@default false
    */
    disableSizeLimit?: boolean;

    /**
    List of library files to be included in the compilation.
    */
    lib?: CompilerOptions.Lib[];

    /**
    Enable strict null checks.
    	@default false
    */
    strictNullChecks?: boolean;

    /**
    The maximum dependency depth to search under `node_modules` and load JavaScript files. Only applicable with `--allowJs`.
    	@default 0
    */
    maxNodeModuleJsDepth?: number;

    /**
    Import emit helpers (e.g. `__extends`, `__rest`, etc..) from tslib.
    	@default false
    */
    importHelpers?: boolean;

    /**
    Specify emit/checking behavior for imports that are only used for types.
    	@default 'remove'
    @deprecated Use `verbatimModuleSyntax` instead.
    */
    importsNotUsedAsValues?: CompilerOptions.ImportsNotUsedAsValues;

    /**
    Parse in strict mode and emit `'use strict'` for each source file.
    	@default false
    */
    alwaysStrict?: boolean;

    /**
    Enable all strict type checking options.
    	@default false
    */
    strict?: boolean;

    /**
    Enable stricter checking of of the `bind`, `call`, and `apply` methods on functions.
    	@default false
    */
    strictBindCallApply?: boolean;

    /**
    Provide full support for iterables in `for-of`, spread, and destructuring when targeting `ES5` or `ES3`.
    	@default false
    */
    downlevelIteration?: boolean;

    /**
    Report errors in `.js` files.
    	@default false
    */
    checkJs?: boolean;

    /**
    Built-in iterators are instantiated with a `TReturn` type of undefined instead of `any`.
    	@default false
    */
    strictBuiltinIteratorReturn?: boolean;

    /**
    Disable bivariant parameter checking for function types.
    	@default false
    */
    strictFunctionTypes?: boolean;

    /**
    Ensure non-undefined class properties are initialized in the constructor.
    	@default false
    */
    strictPropertyInitialization?: boolean;

    /**
    Emit `__importStar` and `__importDefault` helpers for runtime Babel ecosystem compatibility and enable `--allowSyntheticDefaultImports` for typesystem compatibility.
    	@default false
    */
    esModuleInterop?: boolean;

    /**
    Allow accessing UMD globals from modules.
    	@default false
    */
    allowUmdGlobalAccess?: boolean;

    /**
    Resolve `keyof` to string valued property names only (no numbers or symbols).
    	@default false
    @deprecated This option will be removed in TypeScript 5.5.
    */
    keyofStringsOnly?: boolean;

    /**
    Emit ECMAScript standard class fields.
    	@default false
    */
    useDefineForClassFields?: boolean;

    /**
    Generates a sourcemap for each corresponding `.d.ts` file.
    	@default false
    */
    declarationMap?: boolean;

    /**
    Include modules imported with `.json` extension.
    	@default false
    */
    resolveJsonModule?: boolean;

    /**
    Have recompiles in '--incremental' and '--watch' assume that changes within a file will only affect files directly depending on it.
    	@default false
    */
    assumeChangesOnlyAffectDirectDependencies?: boolean;

    /**
    Output more detailed compiler performance information after building.
    	@default false
    */
    extendedDiagnostics?: boolean;

    /**
    Print names of files that are part of the compilation and then stop processing.
    	@default false
    */
    listFilesOnly?: boolean;

    /**
    Disable preferring source files instead of declaration files when referencing composite projects.
    	@default true if composite, false otherwise
    */
    disableSourceOfProjectReferenceRedirect?: boolean;

    /**
    Opt a project out of multi-project reference checking when editing.
    	@default false
    */
    disableSolutionSearching?: boolean;

    /**
    Print names of files which TypeScript sees as a part of your project and the reason they are part of the compilation.
    	@default false
    */
    explainFiles?: boolean;

    /**
    Preserve unused imported values in the JavaScript output that would otherwise be removed.
    	@default true
    @deprecated Use `verbatimModuleSyntax` instead.
    */
    preserveValueImports?: boolean;

    /**
    List of file name suffixes to search when resolving a module.
    */
    moduleSuffixes?: string[];

    /**
    Control what method is used to detect module-format JS files.
    	@default 'auto'
    */
    moduleDetection?: CompilerOptions.ModuleDetection;

    /**
    Allows TypeScript files to import each other with a TypeScript-specific extension like .ts, .mts, or .tsx.
    	@default false
    */
    allowImportingTsExtensions?: boolean;

    /**
    Forces TypeScript to consult the exports field of package.json files if it ever reads from a package in node_modules.
    	@default false
    */
    resolvePackageJsonExports?: boolean;

    /**
    Forces TypeScript to consult the imports field of package.json files when performing a lookup that starts with # from a file whose ancestor directory contains a package.json.
    	@default false
    */
    resolvePackageJsonImports?: boolean;

    /**
    Suppress errors for file formats that TypeScript does not understand.
    	@default false
    */
    allowArbitraryExtensions?: boolean;

    /**
    List of additional conditions that should succeed when TypeScript resolves from package.json.
    */
    customConditions?: string[];

    /**
    Anything that uses the type modifier is dropped entirely.
    	@default false
    */
    verbatimModuleSyntax?: boolean;

    /**
    Suppress deprecation warnings
    */
    ignoreDeprecations?: CompilerOptions.IgnoreDeprecations;

    /**
    Do not allow runtime constructs that are not part of ECMAScript.
    	@default false
    */
    erasableSyntaxOnly?: boolean;

    /**
    Enable lib replacement.
    	@default true
    */
    libReplacement?: boolean;
  };
  namespace WatchOptions {
    export type WatchFileKind = 'FixedPollingInterval' | 'PriorityPollingInterval' | 'DynamicPriorityPolling' | 'FixedChunkSizePolling' | 'UseFsEvents' | 'UseFsEventsOnParentDirectory';
    export type WatchDirectoryKind = 'UseFsEvents' | 'FixedPollingInterval' | 'DynamicPriorityPolling' | 'FixedChunkSizePolling';
    export type PollingWatchKind = 'FixedInterval' | 'PriorityInterval' | 'DynamicPriority' | 'FixedChunkSize';
  }
  export type WatchOptions = {
    /**
    Specify the strategy for watching individual files.
    	@default 'UseFsEvents'
    */
    watchFile?: WatchOptions.WatchFileKind | Lowercase<WatchOptions.WatchFileKind>;

    /**
    Specify the strategy for watching directories under systems that lack recursive file-watching functionality.
    	@default 'UseFsEvents'
    */
    watchDirectory?: WatchOptions.WatchDirectoryKind | Lowercase<WatchOptions.WatchDirectoryKind>;

    /**
    Specify the polling strategy to use when the system runs out of or doesn't support native file watchers.
    */
    fallbackPolling?: WatchOptions.PollingWatchKind | Lowercase<WatchOptions.PollingWatchKind>;

    /**
    Enable synchronous updates on directory watchers for platforms that don't support recursive watching natively.
    */
    synchronousWatchDirectory?: boolean;

    /**
    Specifies a list of directories to exclude from watch.
    */
    excludeDirectories?: string[];

    /**
    Specifies a list of files to exclude from watch.
    */
    excludeFiles?: string[];
  };

  /**
  Auto type (.d.ts) acquisition options for this project.
  */
  export type TypeAcquisition = {
    /**
    Enable auto type acquisition.
    */
    enable?: boolean;

    /**
    Specifies a list of type declarations to be included in auto type acquisition. For example, `['jquery', 'lodash']`.
    */
    include?: string[];

    /**
    Specifies a list of type declarations to be excluded from auto type acquisition. For example, `['jquery', 'lodash']`.
    */
    exclude?: string[];

    /**
    Disable infering what types should be added based on filenames in a project.
    */
    disableFilenameBasedTypeAcquisition?: boolean;
  };
  export type References = {
    /**
    A normalized path on disk.
    */
    path: string;

    /**
    The path as the user originally wrote it.
    */
    originalPath?: string;

    /**
    True if the output of this reference should be prepended to the output of this project.
    	Only valid for `--outFile` compilations.
    @deprecated This option will be removed in TypeScript 5.5.
    */
    prepend?: boolean;

    /**
    True if it is intended that this reference form a circularity.
    */
    circular?: boolean;
  };
}

/**
Type for [TypeScript's `tsconfig.json` file](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) (TypeScript 3.7).

@category File
*/
type TsConfigJson = {
  /**
  Instructs the TypeScript compiler how to compile `.ts` files.
  */
  compilerOptions?: TsConfigJson.CompilerOptions;

  /**
  Instructs the TypeScript compiler how to watch files.
  */
  watchOptions?: TsConfigJson.WatchOptions;

  /**
  Auto type (.d.ts) acquisition options for this project.
  */
  typeAcquisition?: TsConfigJson.TypeAcquisition;

  /**
  Enable Compile-on-Save for this project.
  */
  compileOnSave?: boolean;

  /**
  Path to base configuration file to inherit from.
  */
  extends?: string | string[];

  /**
  If no `files` or `include` property is present in a `tsconfig.json`, the compiler defaults to including all files in the containing directory and subdirectories except those specified by `exclude`. When a `files` property is specified, only those files and those specified by `include` are included.
  */
  files?: string[];

  /**
  Specifies a list of files to be excluded from compilation. The `exclude` property only affects the files included via the `include` property and not the `files` property.
  	Glob patterns require TypeScript version 2.0 or later.
  */
  exclude?: string[];

  /**
  Specifies a list of glob patterns that match files to be included in compilation.
  	If no `files` or `include` property is present in a `tsconfig.json`, the compiler defaults to including all files in the containing directory and subdirectories except those specified by `exclude`.
  */
  include?: string[];

  /**
  Referenced projects.
  */
  references?: TsConfigJson.References[];
};
//#endregion
//#region src/types/omit-by-key.d.ts
type OmitByKey<ObjectType, KeysType extends keyof ObjectType> = Except<ObjectType, KeysType, {
  requireExactProps: true;
}>;
//#endregion
//#region src/types/yield-type.d.ts
type YieldType<TargetGeneratorFn extends Fn<Generator | AsyncGenerator>> = IterableElement<ReturnType<TargetGeneratorFn>>;
//#endregion
export { type AbstractClass, type AbstractConstructor, type AllUnionFields, type And, type ArrayIndices, type ArraySlice, type ArraySplice, type ArrayTail, type ArrayValues, type Arrayable, type AsyncFn, type AsyncFnWithThis, type AsyncReturnType, type Asyncify, type CamelCase, type CamelCasedProperties, type CamelCasedPropertiesDeep, type Class, type ConditionalExcept, type ConditionalKeys, type ConditionalPick, type ConditionalPickDeep, type ConditionalPickDeepOptions, type Constructor, type DelimiterCase, type DelimiterCasedProperties, type DelimiterCasedPropertiesDeep, type DistributedOmit, type DistributedPick, type EmptyObject, type Entries, type Entry, type Exact, type Except, type FindGlobalInstanceType, type FindGlobalType, type Finite, type FixedLengthArray, type Float, type Fn, type FnWithThis, type Get, type GetTagMetadata, type GlobalThis, type GreaterThan, type GreaterThanOrEqual, type HasOptionalKeys, type HasReadonlyKeys, type HasRequiredKeys, type HasWritableKeys, type IfAny$1 as IfAny, type IfEmptyObject, type IfNever$1 as IfNever, type IfNull, type IfUnknown, type Includes, type IntClosedRange, type IntRange, type Integer, type InvariantOf, type IsAny, type IsBooleanLiteral, type IsEmptyObject, type IsEqual, type IsFloat, type IsInteger, type IsLiteral, type IsNegative, type IsNever, type IsNull, type IsNumericLiteral, type IsStringLiteral, type IsSymbolLiteral, type IsTuple, type IsUnknown, type IterableElement, type Join, type JsonArray, type JsonObject, type JsonPrimitive, type JsonValue, type Jsonifiable, type Jsonify, type KebabCase, type KebabCasedProperties, type KebabCasedPropertiesDeep, type KeysOfUnion, type LastArrayElement, type LessThan, type LessThanOrEqual, type LiteralToPrimitive, type LiteralToPrimitiveDeep, type LiteralUnion, type Merge, type MergeDeep, type MergeDeepOptions, type MergeExclusive, type MultidimensionalArray, type MultidimensionalReadonlyArray, type Negative, type NegativeFloat, type NegativeInfinity, type NegativeInteger, type NonEmptyObject, type NonEmptyString, type NonEmptyTuple, type NonNegative, type NonNegativeInteger, type Nullable, type OmitByKey, type OmitDeep, type OmitIndexSignature, type Opaque, type OptionalKeysOf, type Or, type OverrideProperties, type PackageJson, type PartialDeep, type PartialDeepOptions, type PartialOnUndefinedDeep, type PartialOnUndefinedDeepOptions, type PascalCase, type PascalCasedProperties, type PascalCasedPropertiesDeep, type Paths, type PickDeep, type PickIndexSignature, type PositiveInfinity, type Primitive, type Promisable, type ReadonlyDeep, type ReadonlyKeysOf, type ReadonlyTuple, type Replace, type RequireAllOrNone, type RequireAtLeastOne, type RequireExactlyOne, type RequireOneOrNone, type RequiredDeep, type RequiredKeysOf, type Schema, type SchemaOptions, type ScreamingSnakeCase, type SetFieldType, type SetNonNullable, type SetOptional, type SetParameterType, type SetReadonly, type SetRequired, type SetRequiredDeep, type SetReturnType, type SharedUnionFields, type SharedUnionFieldsDeep, type Simplify, type SimplifyDeep, type SingleKeyObject, type SnakeCase, type SnakeCasedProperties, type SnakeCasedPropertiesDeep, type Split, type Spread, type StringKeyOf, type StringRepeat, type StringSlice, type Stringified, type StructuredCloneable, type Subtract, type Sum, type SyncFn, type SyncFnWithThis, type Tagged, type TaggedUnion, type Trim, type TsConfigJson, type TupleToObject, type TupleToUnion, type TypedArray, type UndefinedOnPartialDeep, type UnionToIntersection, type UnionToTuple, type UnknownArray, type UnknownMap, type UnknownRecord, type UnknownSet, type UnwrapOpaque, type UnwrapTagged, type ValueOf, type Words, type Writable, type WritableDeep, type WritableKeysOf, type YieldType };