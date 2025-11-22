import { isBigInt, isBoolean, isError, isNumber, isString, isSymbol } from "@/remeda";

import { stringify } from "./json";

export const normalizeError = (error: unknown, caller?: Function): Error => {
    if (isError(error)) return error;

    let message: string;
    if (
        isString(error) ||
        isNumber(error) ||
        isBigInt(error) ||
        isBoolean(error) ||
        isSymbol(error)
    ) {
        message = error.toString();
    } else if (error === undefined) {
        message = "undefined";
    } else if (error === null) {
        message = "null";
    } else {
        message = stringify(error);
    }

    const e = new Error(message);
    Error.captureStackTrace(e, caller || normalizeError);

    return e;
};

export const getErrorMessage = (error: unknown, message = "Unknown error"): string =>
    error instanceof Error ? error.message : message;
