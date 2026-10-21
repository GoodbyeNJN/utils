import { styleText } from "node:util";

import { isSymbol } from "@/fp";

import type { UnknownArray } from "@/types";

type NonArrayable<T> = T extends UnknownArray ? T[number] : T;
type BaseStyleFunction = (format: any, text: string, ...args: any[]) => string;

export type Styled<T extends BaseStyleFunction> = {
    (text: Parameters<T>[1]): ReturnType<T>;
    (template: TemplateStringsArray, ...values: any[]): ReturnType<T>;
} & { [key in NonArrayable<Parameters<T>[0]>]: Styled<T> };

export const createStyled = <T extends BaseStyleFunction>(
    style: T,
    formats: any[] = [],
    ...args: any[]
): Styled<T> => {
    return new Proxy<any>(
        (raw: any, ...substitutions: any[]) => {
            const text = raw.raw ? String.raw({ raw }, ...substitutions) : raw;

            return style(formats, text, ...args);
        },

        {
            get: (_, format) => {
                const newFormats = [...formats];
                if (!isSymbol(format)) {
                    newFormats.push(format);
                }

                return createStyled(style, newFormats, ...args);
            },
        },
    );
};

export const styled: Styled<typeof styleText> = createStyled(styleText);
