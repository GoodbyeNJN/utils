export type Fn<Return = any, Args extends readonly any[] = any[]> = (...args: Args) => Return;

export type FnWithThis<Return = any, Args extends readonly any[] = any[], This = unknown> = ((
    this: This,
    ...args: Args
) => Return) & {
    prototype: This;
};

export type AsyncFn<Return = any, Args extends readonly any[] = any[]> = (
    ...args: Args
) => PromiseLike<Return>;

export type AsyncFnWithThis<Return = any, Args extends readonly any[] = any[], This = unknown> = ((
    this: This,
    ...args: Args
) => PromiseLike<Return>) & {
    prototype: This;
};

export type SyncFn<Return = any, Args extends readonly any[] = any[]> = (
    ...args: Args
) => Return extends PromiseLike<any> ? never : Return;

export type SyncFnWithThis<Return = any, Args extends readonly any[] = any[], This = unknown> = ((
    this: This,
    ...args: Args
) => Return extends PromiseLike<any> ? never : Return) & {
    prototype: This;
};
