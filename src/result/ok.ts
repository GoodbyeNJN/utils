import { never } from "./common";
import { Result } from "./result";

export class Ok<T = unknown> extends Result<T, never> {
    constructor(value: T) {
        super(true, never, value);
    }
}
