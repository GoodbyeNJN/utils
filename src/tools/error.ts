import { isBigInt, isBoolean, isError, isNumber, isObjectType, isString, isSymbol } from "@/fp";

/* #__NO_SIDE_EFFECTS__ */
// oxlint-disable-next-line typescript/no-unsafe-function-type
export const normalizeError = (error: unknown, caller?: Function): Error => {
    if (isError(error)) return error;

    const e = new Error(getErrorMessage(error));
    Error.captureStackTrace(e, caller || normalizeError);

    return e;
};

/* #__NO_SIDE_EFFECTS__ */
export const getErrorMessage = (error: unknown, defaultMessage?: string): string => {
    if (isError(error)) return error.message;
    if (isString(error)) return error;

    if (isNumber(error) || isBoolean(error) || isSymbol(error)) {
        return error.toString();
    }
    if (isBigInt(error)) {
        return error.toString() + "n";
    }

    // Fallback to default message for undefined and null
    if (error === undefined) return defaultMessage ?? "<undefined>";
    if (error === null) return defaultMessage ?? "<null>";

    if (isObjectType(error)) {
        if ("message" in (error as any) && isString((error as any).message)) {
            return (error as any).message;
        }

        try {
            return JSON.stringify(error);
        } catch {}
    }

    // Fallback to default message for other non-primitive types
    return defaultMessage ?? Object.prototype.toString.call(error);
};
