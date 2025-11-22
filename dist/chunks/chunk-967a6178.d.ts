import { AsyncFn, NonEmptyTuple, SyncFn } from "./chunk-ea0120e4.js";

//#region src/result/types.d.ts
type ExtractOkTypes<T extends readonly Result[]> = { [K in keyof T]: T[K] extends Result<infer U, unknown> ? U : never };
type ExtractErrTypes<T extends readonly Result[]> = { [K in keyof T]: T[K] extends Result<unknown, infer E> ? E : never };
type InferOkType<R> = R extends Result<infer T, unknown> ? T : never;
type InferErrType<R> = R extends Result<unknown, infer E> ? E : never;
type ResultAll<T extends readonly Result[]> = IsLiteralArray<T> extends 1 ? Traverse<T> : Result<ExtractOkTypes<T>, ExtractErrTypes<T>[number]>;
type ResultAllSettled<T extends readonly Result[]> = IsLiteralArray<T> extends 1 ? TraverseWithAllErrors<T> : Result<ExtractOkTypes<T>, ExtractErrTypes<T>[number][]>;
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, ...0[]];
type CollectResults<T, Collected extends unknown[] = [], Depth extends number = 50> = [Depth] extends [never] ? [] : T extends [infer H, ...infer Rest] ? H extends Result<infer L, infer R> ? CollectResults<Rest, [...Collected, [L, R]], Prev[Depth]> : never : Collected;
type Transpose<A, Transposed extends unknown[][] = [], Depth extends number = 10> = A extends [infer T, ...infer Rest] ? T extends [infer L, infer R] ? Transposed extends [infer PL, infer PR] ? PL extends unknown[] ? PR extends unknown[] ? Transpose<Rest, [[...PL, L], [...PR, R]], Prev[Depth]> : never : never : Transpose<Rest, [[L], [R]], Prev[Depth]> : Transposed : Transposed;
type Combine<T, Depth extends number = 5> = Transpose<CollectResults<T>, [], Depth> extends [infer L, infer R] ? [UnknownMembersToNever<L>, UnknownMembersToNever<R>] : Transpose<CollectResults<T>, [], Depth> extends [] ? [[], []] : never;
type EmptyArrayToNever<T, NeverArrayToNever extends number = 0> = T extends [] ? never : NeverArrayToNever extends 1 ? T extends [never, ...infer Rest] ? [EmptyArrayToNever<Rest>] extends [never] ? never : T : T : T;
type UnknownMembersToNever<T> = T extends [infer H, ...infer R] ? [[unknown] extends [H] ? never : H, ...UnknownMembersToNever<R>] : T;
type MembersToUnion<T> = T extends unknown[] ? T[number] : never;
type IsLiteralArray<T> = T extends {
  length: infer L;
} ? L extends number ? number extends L ? 0 : 1 : 0 : 0;
type Traverse<T, Depth extends number = 5> = Combine<T, Depth> extends [infer Oks, infer Errs] ? Result<EmptyArrayToNever<Oks, 1>, MembersToUnion<Errs>> : never;
type TraverseWithAllErrors<T, Depth extends number = 5> = Traverse<T, Depth> extends Result<infer Oks, infer Errs> ? Result<Oks, Errs[]> : never;
//#endregion
//#region src/result/result.d.ts
type Ok<T = unknown> = Result<T, never>;
type Err<E = unknown> = Result<never, E>;
declare class Result<T = unknown, E = unknown> {
  #private;
  static ok(): Ok<void>;
  static ok<T>(value: T): Ok<T>;
  static err(): Err<void>;
  static err<E>(error: E): Err<E>;
  static fromValue<T, E = unknown>(data: Promise<T>): Promise<Result<Awaited<T>, E>>;
  static fromValue<T>(data: Promise<T>, onThrow: ErrorConstructor): Promise<Result<Awaited<T>, Error>>;
  static fromValue<T, E>(data: Promise<T>, onThrow: (error: unknown) => E): Promise<Result<Awaited<T>, E>>;
  static fromValue<T, E = unknown>(data: T): Result<T, E>;
  static fromValue<T>(data: T, onThrow: ErrorConstructor): Result<T, Error>;
  static fromValue<T, E>(data: T, onThrow: (error: unknown) => E): Result<T, E>;
  static fromCallable<T, E = unknown>(callable: SyncFn<T>): Result<T, E>;
  static fromCallable<T>(callable: SyncFn<T>, onThrow: ErrorConstructor): Result<T, Error>;
  static fromCallable<T, E>(callable: SyncFn<T>, onThrow: (error: unknown) => E): Result<T, E>;
  static fromCallable<T, E = unknown>(callable: AsyncFn<T>): Promise<Result<Awaited<T>, E>>;
  static fromCallable<T>(callable: AsyncFn<T>, onThrowOrReject: ErrorConstructor): Promise<Result<Awaited<T>, Error>>;
  static fromCallable<T, E>(callable: AsyncFn<T>, onThrowOrReject: (error: unknown) => E): Promise<Result<Awaited<T>, E>>;
  static all<T extends NonEmptyTuple<Result>>(results: T): ResultAll<T>;
  static all<T extends readonly Result[]>(results: T): ResultAll<T>;
  static allSettled<T extends NonEmptyTuple<Result>>(results: T): ResultAllSettled<T>;
  static allSettled<T extends readonly Result[]>(results: T): ResultAllSettled<T>;
  private constructor();
  /**
   * Check if `Result` is `OK`
   */
  isOk(): this is Ok<T>;
  /**
   * Check if `Result` is `OK` and the value matches the predicate
   */
  isOkAnd(predicate: (value: T) => boolean): this is Ok<T>;
  /**
   * Check if `Result` is `Err`
   */
  isErr(): this is Err<E>;
  /**
   * Check if `Result` is `Err` and the error matches the predicate
   */
  isErrAnd(predicate: (error: E) => boolean): this is Err<E>;
  /**
   * Maps `Result<T, E>` to `Result<U, E>`
   */
  map<U>(fn: (value: T) => U): Result<U, E>;
  /**
   * Maps `Result<T, E>` to `Result<T, F>`
   */
  mapErr<F>(fn: (error: E) => F): Result<T, F>;
  /**
   * Returns a new `Result` by combining the current `Result` with another `Result`
   */
  and<R extends Result<unknown, E>>(result: R): Result<InferOkType<R>, E>;
  and<U>(result: Result<U, E>): Result<U, E>;
  /**
   * Maps `Result<T, E>` to `Result<U, E | F>` with a function that returns a `Result`
   */
  andThen<R extends Result>(fn: (value: T) => R): Result<InferOkType<R>, InferErrType<R> | E>;
  andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;
  /**
   * Returns a new `Result` by combining the current `Result` with another `Result`
   */
  or<R extends Result<T, unknown>>(result: R): Result<T, InferErrType<R>>;
  or<F>(result: Result<T, F>): Result<T, F>;
  /**
   * Maps `Result<T, E>` to `Result<T | U, F>` with a function that returns a `Result`
   */
  orElse<R extends Result>(fn: (error: E) => R): Result<InferOkType<R> | T, InferErrType<R>>;
  orElse<U, F>(fn: (error: E) => Result<U, F>): Result<T | U, F>;
  /**
   * Calls the function with the value if `Result` is `Ok` and returns the result unchanged
   */
  inspect(fn: (value: T) => unknown): Result<T, E>;
  /**
   * Calls the function with the error if `Result` is `Err` and returns the result unchanged
   */
  inspectErr(fn: (error: E) => unknown): Result<T, E>;
  /**
   * Unwrap the `Ok` value, or throw an error if `Result` is `Err`
   */
  unwrap(): T;
  /**
   * Unwrap the `Err` value, or throw an error if `Result` is `Ok`
   */
  unwrapErr(): E;
  /**
   * Unwrap the `Ok` value, or return the provided value if `Result` is `Err`
   */
  unwrapOr(defaultValue: T): T;
  /**
   * Unwrap the `Ok` value, or compute it from a function if `Result` is `Err`
   */
  unwrapOrElse(defaultValueGetter: (error: E) => T): T;
  /**
   * Matches the `Result` variant and executes the corresponding function
   */
  match<U, F = U>(ok: (value: T) => U, err: (error: E) => F): U | F;
  /**
   * Returns an iterable object that yields the `Ok` value and `Err` value
   */
  iter(): [ok: boolean, error: E, value: T];
  [Symbol.iterator](): Generator<Err<E>, T>;
  context(context: string): this;
  toString(): string;
}
declare const ok: typeof Result.ok;
declare const err: typeof Result.err;
//#endregion
//#region src/result/helper.d.ts
declare function safeTry<T, E, This>(body: (this: This) => Generator<Err<E>, Result<T, E>>, self?: This): Result<T, E>;
declare function safeTry<YieldErr extends Err, GeneratorReturnResult extends Result, This>(body: (this: This) => Generator<YieldErr, GeneratorReturnResult>, self?: This): Result<InferOkType<GeneratorReturnResult>, InferErrType<YieldErr> | InferErrType<GeneratorReturnResult>>;
declare function safeTry<T, E, This>(body: (this: This) => AsyncGenerator<Err<E>, Result<T, E>>, self?: This): Promise<Result<T, E>>;
declare function safeTry<YieldErr extends Err, GeneratorReturnResult extends Result, This>(body: (this: This) => AsyncGenerator<YieldErr, GeneratorReturnResult>, self?: This): Promise<Result<InferOkType<GeneratorReturnResult>, InferErrType<YieldErr> | InferErrType<GeneratorReturnResult>>>;
//#endregion
export { type Err, type ExtractErrTypes, type ExtractOkTypes, type InferErrType, type InferOkType, type Ok, Result, type ResultAll, type ResultAllSettled, err, ok, safeTry };