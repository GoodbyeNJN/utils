interface ParseResult {
    value: string;
    end: number;
}

const parseKey = (input: string, raw = input): ParseResult => {
    if (input.length === 0) {
        return { value: "", end: 0 };
    } else if (/^\s/.test(input)) {
        const { value, end } = parseKey(input.slice(1), raw);
        return { value, end: end + 1 };
    }

    let value = "";
    let end = 0;
    if (input[0] === "'" || input[0] === '"') {
        const slice = input.slice(1);

        const index = slice.indexOf(input[0]);
        if (index === -1 || !slice.slice(index + 1).startsWith("=")) {
            throw new Error(`Failed to parse key from input: ${raw}`);
        }

        value = slice.slice(0, index);
        end = 1 + index + 2;
    } else {
        for (const char of input) {
            if (char === "=") break;

            end += 1;
        }

        value = input.slice(0, end);
        end += 1;
    }

    return { value, end };
};

const parseValue = (input: string, raw = input): ParseResult => {
    if (input.length === 0) {
        return { value: "", end: 0 };
    }

    let value = "";
    let end = 0;
    if (input[0] === "'" || input[0] === '"') {
        const slice = input.slice(1);

        const index = slice.indexOf(input[0]);
        if (
            index === -1 ||
            (slice.slice(index + 1).length !== 0 && !/^\s/.test(slice.slice(index + 1)))
        ) {
            throw new Error(`Failed to parse value from input: ${raw}`);
        }

        value = slice.slice(0, index);
        end = 1 + index + 1;
    } else {
        for (const char of input) {
            if (/\s/.test(char)) break;

            end += 1;
        }

        value = input.slice(0, end);
        end += 1;
    }

    return { value, end };
};

export const parseKeyValuePairs = (input: string): Record<string, string> => {
    const pairs: Record<string, string> = {};

    let offset = 0;

    while (offset < input.length) {
        const key = parseKey(input.slice(offset), input);
        offset += key.end;

        const value = parseValue(input.slice(offset), input);
        offset += value.end;

        pairs[key.value] = value.value;

        if (/^\s*$/.test(input.slice(offset))) break;
    }

    return pairs;
};

export const parseValueToBoolean = (value: unknown, defaultValue: boolean): boolean => {
    const str = String(value).trim().toLowerCase();

    if (/^(?:y|yes|true|1|on)$/.test(str)) return true;
    if (/^(?:n|no|false|0|off)$/.test(str)) return false;

    return defaultValue;
};
