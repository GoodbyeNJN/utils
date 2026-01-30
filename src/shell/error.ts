import { NonZeroExitError } from "tinyexec";

import type { ShellResult } from "./types";
import type { Output } from "tinyexec";

export class ShellNonZeroExitError extends NonZeroExitError {
    override readonly result: ShellResult;

    constructor(result: ShellResult, output?: Output) {
        super(result, output);

        this.result = result;
    }
}
