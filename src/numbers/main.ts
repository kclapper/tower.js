import { Integer } from './Integer';
import { Rational } from './Rational';
import { Real } from './Real';
import { Complex } from './Complex';

export type JSNumber = number | bigint;

export function isJSNumber(n: any): n is JSNumber {
    return typeof n === 'number' || typeof n === 'bigint';
}

export type JSInteger = JSNumber;

export function isJSInteger(n: any): n is JSInteger {
    return Number.isInteger(n) || typeof n === 'bigint';
}

export function integerIsOne(n: JSInteger): boolean {
    let isInteger = isJSInteger(n);
    let isOne = typeof n === 'bigint' ? n === 1n : n === 1;
    return isInteger && isOne;
}

export function numberIsRational(n: JSNumber): boolean {
    let isBigInt = typeof n === 'bigint';
    let isRationalFloat = Number.isFinite(n) && !Number.isNaN(n);
    return isBigInt || isRationalFloat;
}

export enum Level {
    INTEGER,
    RATIONAL,
    REAL,
    COMPLEX
}

export type TowerNumber = JSInteger | Complex;

export interface BoxedNumber {
    readonly level: Level;

    toString(): string;
    fromString(str: string): BoxedNumber;

    liftTo(other: TowerNumber): BoxedNumber;

    isFinite(): boolean;
    isInteger(): boolean;
    isRational(): boolean;
    isReal(): boolean;
    isExact(): boolean;
    isPositive(): boolean;

    toExact(): BoxedNumber;
    toFixnum(): JSInteger;

    greaterThan(other: BoxedNumber): boolean;
    greaterThanOrEqual(other: BoxedNumber): boolean;
    lessThan(other: BoxedNumber): boolean;
    lessThanOrEqual(other: BoxedNumber): boolean;
    equals(other: BoxedNumber): boolean;

    add(other: BoxedNumber): BoxedNumber;
    subtract(other: BoxedNumber): BoxedNumber;
    multiply(other: BoxedNumber): BoxedNumber;
    divide(other: BoxedNumber): BoxedNumber;

    numerator(): BoxedNumber;
    denominator(): BoxedNumber;

    integerSqrt(): BoxedNumber;
    sqrt(): BoxedNumber;
    abs(): BoxedNumber;
    floor(): BoxedNumber;
    ceiling(): BoxedNumber;
    round(): BoxedNumber;

    conjugate(): BoxedNumber;
    magnitude(): BoxedNumber;
    imaginaryPart(): JSNumber;
    realPart(): JSNumber;

    log(): BoxedNumber;
    expt(power: BoxedNumber): BoxedNumber;
    exp(): BoxedNumber;

    angle(): BoxedNumber;
    atan(): BoxedNumber;
    cos(): BoxedNumber;
    sin(): BoxedNumber;
    acos(): BoxedNumber;
    asin(): BoxedNumber;
}
