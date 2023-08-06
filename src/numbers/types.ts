import {
    InexactNumber,
    SmallExactNumber,
    BigExactNumber,
    ComplexNumber
} from './index';

export type RacketNumber = number | BoxedNumber;

export type JSInteger = number | bigint;

export type JSNumber = number | bigint;

export type BoxedNumber = InexactNumber | ExactNumber | ComplexNumber;
export function isBoxedNumber(n: any): n is BoxedNumber {
    return n instanceof InexactNumber
        || n instanceof SmallExactNumber
        || n instanceof BigExactNumber
        || n instanceof ComplexNumber
}

export type ExactNumber = SmallExactNumber | BigExactNumber;

export type RealNumber = InexactNumber | ExactNumber;
export function isRealNumber(n: any): n is RealNumber {
    return n instanceof InexactNumber
        || n instanceof SmallExactNumber
        || n instanceof BigExactNumber
}

export interface Number {
    isInexact(): boolean;
    isExact(): boolean;

    toInexact(): BoxedNumber;
    toExact(): BoxedNumber;
    toComplex(): ComplexNumber;
    toFixnum(): number;

    isInteger(): boolean;
    isRational(): boolean;
    isReal(): boolean;
    isComplex(): boolean;

    isZero(): boolean;
    isNegativeZero(): boolean;
    isPositive(): boolean;
    isNegative(): boolean;
    isEven(): boolean;
    isFinite(): boolean;
    isNaN(): boolean;

    toString(): string;
    toSignedString(): string;
    [Symbol.toPrimitive](hint: string): number | bigint | string;

    greaterThan(other: BoxedNumber): boolean;
    greaterThanOrEqual(other: BoxedNumber): boolean;
    lessThan(other: BoxedNumber): boolean;
    lessThanOrEqual(other: BoxedNumber): boolean;
    equals(other: BoxedNumber): boolean;

    add(other: BoxedNumber): BoxedNumber;
    subtract(other: BoxedNumber): BoxedNumber;
    multiply(other: BoxedNumber): BoxedNumber;
    divide(other: BoxedNumber): BoxedNumber;

    numerator(): RealNumber;
    denominator(): RealNumber;

    integerSqrt(): BoxedNumber;
    sqrt(): BoxedNumber;
    abs(): RealNumber;
    floor(): RealNumber;
    ceiling(): RealNumber;
    round(): RealNumber;

    conjugate(): BoxedNumber;
    magnitude(): BoxedNumber;
    realPart(): RealNumber;
    imaginaryPart(): RealNumber;
    angle(): BoxedNumber;

    log(): BoxedNumber;
    expt(power: BoxedNumber): BoxedNumber;
    exp(): BoxedNumber;

    tan(): BoxedNumber;
    cos(): BoxedNumber;
    sin(): BoxedNumber;
    atan(): BoxedNumber;
    acos(): BoxedNumber;
    asin(): BoxedNumber;
}
