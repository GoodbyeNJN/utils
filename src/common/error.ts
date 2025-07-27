import { isObjectType, isString } from "@/remeda";

export interface ErrorLike extends Partial<Error> {
    message: string;
}

export const isErrorLike = (error: unknown): error is ErrorLike =>
    isObjectType(error) && isString((error as ErrorLike).message);

export const normalizeError = (error: unknown) => {
    if (isErrorLike(error)) {
        return error as Error;
    }

    try {
        return new Error(JSON.stringify(error));
    } catch {
        return new Error(String(error));
    }
};

export const getErrorMessage = (error: unknown, message = "Unknown error") =>
    isErrorLike(error) ? error.message : message;

export const errorToMessage =
    (message = "Unknown error") =>
    (error: unknown) =>
        getErrorMessage(error, message);
