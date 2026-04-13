import { isBigInt, isBoolean, isError, isNumber, isString, isSymbol } from "@/remeda";

import { stringify } from "./json";

export const normalizeError = (error: unknown, caller?: Function): Error => {
    if (isError(error)) return error;

    const e = new Error(getErrorMessage(error));
    Error.captureStackTrace(e, caller || normalizeError);

    return e;
};

export const getErrorMessage = (error: unknown, message?: string): string => {
    if (isError(error)) return error.message;
    if (message !== undefined) return message;

    let msg: string;
    if (
        isString(error) ||
        isNumber(error) ||
        isBigInt(error) ||
        isBoolean(error) ||
        isSymbol(error)
    ) {
        msg = error.toString();
    } else if (error === undefined) {
        msg = "undefined";
    } else if (error === null) {
        msg = "null";
    } else {
        msg = stringify(error);
    }

    return msg;
};
