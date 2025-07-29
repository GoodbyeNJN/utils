/* eslint-disable @typescript-eslint/method-signature-style */

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
    type PartialByKey<BaseType, Keys extends keyof BaseType> = Types.SetOptional<BaseType, Keys>;
    type RequiredByKey<BaseType, Keys extends keyof BaseType> = Types.SetRequired<BaseType, Keys>;

    type YieldType<TargetGeneratorFn extends Fn<Generator | AsyncGenerator>> =
        Types.YieldType<TargetGeneratorFn>;

    type Primitive = Types.Primitive;
    type Promisable<T> = Types.Promisable<T>;

    type PackageJson = Types.PackageJson;
    type TsConfigJson = Types.TsConfigJson;
}
