export const normalizeError = (error: unknown) => {
    if (error instanceof Error) {
        return error;
    }

    try {
        return new Error(JSON.stringify(error));
    } catch {
        return new Error(String(error));
    }
};

export const getErrorMessage = (error: unknown, message = "Unknown error") =>
    error instanceof Error ? error.message : message;

export const errorToMessage =
    (message = "Unknown error") =>
    (error: unknown) =>
        getErrorMessage(error, message);
