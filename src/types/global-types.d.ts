/* eslint-disable @typescript-eslint/method-signature-style */

import type { NonFalsy } from "./utils/non-falsy";
import type { WidenLiteral } from "./utils/widen-literal";
import type * as Types from "@goodbyenjn/utils/types";

declare global {
    class ObjectConstructor {
        /**
         * Returns the names of the enumerable string properties and methods of an object.
         * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
         */
        keys<T = {}>(o: T): (keyof T)[];

        /**
         * Returns an array of key/values of the enumerable own properties of an object
         * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
         */
        entries<T>(o: T): Types.Entries<T>;

        /**
         * Returns an object created by key-value entries for properties and methods
         * @param entries An iterable object that contains key-value entries for properties and methods.
         */
        fromEntries<T>(entries: Types.Entries<T>): T;

        /**
         * Determines whether an object has a property with the specified name.
         * @param o An object.
         * @param v A property name.
         */
        hasOwn<T, K extends keyof T>(o: T, v: K): o is T & Types.SetRequired<T, K>;
        hasOwn<Key extends PropertyKey>(o: object, v: Key): o is { [K in Key]: unknown };
    }
}

interface MapWithExistsKey<K, V, ExistsKey extends K> extends Map<K, V> {
    /**
     * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
     * @returns Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
     */
    get: ((k: ExistsKey) => V) & ((k: K) => V | undefined);
}

declare global {
    interface Map<K, V> {
        /**
         * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
         */
        has<ExistsKey extends K>(key: ExistsKey): this is MapWithExistsKey<K, V, ExistsKey>;
        has(key: K): boolean;
    }
}

declare global {
    interface Array<T> {
        /**
         * Returns the elements of an array that meet the condition specified in a callback function.
         * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
         * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
         */
        filter<S extends T>(predicate: BooleanConstructor, thisArg?: any): NonFalsy<NoInfer<S>>[];
        /**
         * Determines whether an array includes a certain element, returning true or false as appropriate.
         * @param searchElement The element to search for.
         * @param fromIndex The position in this array at which to begin searching for searchElement.
         */
        includes(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): boolean;
        /**
         * Returns the index of the first occurrence of a value in an array, or -1 if it is not present.
         * @param searchElement The value to locate in the array.
         * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
         */
        indexOf(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): number;
        /**
         * Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present.
         * @param searchElement The value to locate in the array.
         * @param fromIndex The array index at which to begin searching backward. If fromIndex is omitted, the search starts at the last index in the array.
         */
        lastIndexOf(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): number;
    }

    interface ReadonlyArray<T> {
        /**
         * Returns the elements of an array that meet the condition specified in a callback function.
         * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
         * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
         */
        filter<S extends T>(predicate: BooleanConstructor, thisArg?: any): NonFalsy<NoInfer<S>>[];
        /**
         * Determines whether an array includes a certain element, returning true or false as appropriate.
         * @param searchElement The element to search for.
         * @param fromIndex The position in this array at which to begin searching for searchElement.
         */
        includes(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): boolean;
        /**
         * Returns the index of the first occurrence of a value in an array.
         * @param searchElement The value to locate in the array.
         * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
         */
        indexOf(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): number;
        /**
         * Returns the index of the last occurrence of a specified value in an array.
         * @param searchElement The value to locate in the array.
         * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
         */
        lastIndexOf(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): number;
    }
}

declare global {
    type AsyncFn<Return = any, Args extends readonly any[] = any[]> = Types.AsyncFn<Return, Args>;
    type AsyncFnWithThis<
        Return = any,
        Args extends readonly any[] = any[],
        This = unknown,
    > = Types.AsyncFnWithThis<Return, Args, This>;
    type Fn<Return = any, Args extends readonly any[] = any[]> = Types.Fn<Return, Args>;
    type FnWithThis<
        Return = any,
        Args extends readonly any[] = any[],
        This = unknown,
    > = Types.FnWithThis<Return, Args, This>;
    type SyncFn<Return = any, Args extends readonly any[] = any[]> = Types.SyncFn<Return, Args>;
    type SyncFnWithThis<
        Return = any,
        Args extends readonly any[] = any[],
        This = unknown,
    > = Types.SyncFnWithThis<Return, Args, This>;
    type TemplateFn<Return = any> = Types.TemplateFn<Return>;

    type Entries<BaseType> = Types.Entries<BaseType>;
    type Entry<BaseType> = Types.Entry<BaseType>;

    type LiteralUnion<LiteralType, BaseType extends Primitive> = Types.LiteralUnion<
        LiteralType,
        BaseType
    >;

    type OmitByKey<ObjectType, KeysType extends keyof ObjectType> = Types.OmitByKey<
        ObjectType,
        KeysType
    >;
    type SetNullable<BaseType, Keys extends keyof BaseType> = Types.SetNullable<BaseType, Keys>;
    type SetOptional<BaseType, Keys extends keyof BaseType> = Types.SetOptional<BaseType, Keys>;
    type SetRequired<BaseType, Keys extends keyof BaseType> = Types.SetRequired<BaseType, Keys>;

    type Nullable<T> = Types.Nullable<T>;
    type Optional<T> = Types.Optional<T>;

    type YieldType<TargetGeneratorFn extends Fn<Generator | AsyncGenerator>> =
        Types.YieldType<TargetGeneratorFn>;

    type Primitive = Types.Primitive;
    type Promisable<T> = Types.Promisable<T>;

    type PackageJson = Types.PackageJson;
    type TsConfigJson = Types.TsConfigJson;
}
