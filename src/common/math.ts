import { clamp } from "@/remeda";

/**
 * @example
 * ```
 * const value = linear(0.5, [0, 2]) // value: 1
 * ```
 */
export const linear = (value: number, range: [min: number, max: number]): number => {
    const [min, max] = range;
    const interpolation = clamp(value, { min: 0.0, max: 1.0 });

    return min + (max - min) * interpolation;
};

/**
 * @example
 * ```
 * const value = scale(0.5, [0, 1], [200, 400]) // value: 300
 * ```
 */
export const scale = (
    value: number,
    inRange: [min: number, max: number],
    outRange: [min: number, max: number],
): number => {
    const [inMin, inMax] = inRange;
    const [outMin, outMax] = outRange;
    const interpolation = (value - inMin) / (inMax - inMin);

    return linear(interpolation, [outMin, outMax]);
};
