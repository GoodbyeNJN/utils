import { isFunction, isObjectType } from "@/remeda";

import { stringify } from "./json";

export const normalizeError = (error: unknown) => {
    if (error instanceof Error) {
        return error;
    }

    if (isObjectType(error) && "toError" in error && isFunction(error.toError)) {
        return error.toError() as Error;
    }

    return new Error(stringify(error));
};

export const getErrorMessage = (error: unknown, message = "Unknown error") =>
    error instanceof Error ? error.message : message;
