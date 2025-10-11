import { never } from "./common";
import { Result } from "./result";

export class Ok<T = unknown> extends Result<T, never> {
    readonly ok = true;
    private readonly _value: T;

    constructor(value: T) {
        super();
        this._value = value;
    }

    get value(): T {
        return this._value;
    }

    get error(): never {
        return never;
    }
}
