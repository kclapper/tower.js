import { isJSInteger } from "../numbers/util";
import {
    RacketNumber,
    isBoxedNumber
} from "../tower";

export function isNumber(x: any): x is RacketNumber {
    const isNumber = typeof x === 'number' && Number.isInteger(x);
    const isBigInt = typeof x === 'bigint';
    const isBoxed = isBoxedNumber(x);
    return isNumber || isBigInt || isBoxed;
}

export const isComplex = isNumber;

export function isReal(x: any): x is RacketNumber {
    const isNumber = typeof x === 'number' && Number.isInteger(x);
    const isBigInt = typeof x === 'bigint';
    const isBoxedReal = isBoxedNumber(x) && x.isReal();
    return isNumber || isBigInt || isBoxedReal;
}

export function isRational(x: any): x is RacketNumber {
    const isNumber = typeof x === 'number' && Number.isInteger(x);
    const isBigInt = typeof x === 'bigint';
    const isBoxedRational = isBoxedNumber(x) && x.isRational();
    return isNumber || isBigInt || isBoxedRational;
}

export function isInteger(x: any): x is RacketNumber {
    const isNumber = typeof x === 'number' && Number.isInteger(x);
    const isBigInt = typeof x === 'bigint';
    const isBoxedInteger = isBoxedNumber(x) && x.isInteger();
    return isNumber || isBigInt || isBoxedInteger;
}

export function isExactInteger(x: any): x is RacketNumber {
    const isNumber = typeof x === 'number' && Number.isInteger(x);
    const isBigInt = typeof x === 'bigint';
    const isBoxedExactInteger = isBoxedNumber(x) && x.isInteger() && x.isExact();
    return isNumber || isBigInt || isBoxedExactInteger;
}

export function isExactNonNegativeInteger(x: any): x is RacketNumber {
    const forNumber = typeof x === 'number' && Number.isInteger(x) && x >= 0;
    const forBigInt = typeof x === 'bigint' && x >= 0n;
    const forBoxed = isBoxedNumber(x) && x.isInteger() && x.isExact() && !x.isNegative();
    return forNumber || forBigInt || forBoxed;
}

export function isExactPositiveInteger(x: any): x is RacketNumber {
    const forNumber = typeof x === 'number' && Number.isInteger(x) && x > 0;
    const forBigInt = typeof x === 'bigint' && x > 0n;
    const forBoxed = isBoxedNumber(x) && x.isInteger() && x.isExact() && x.isPositive();
    return forNumber || forBigInt || forBoxed;
}

export function isInexactReal(x: any): boolean {
    return isBoxedNumber(x) && x.isReal() && x.isInexact();
}

export function isFixnum(x: any): boolean {
    const forNumber = typeof x === 'number' && Number.isInteger(x);
    const forBigInt = typeof x === 'bigint';
    return forNumber || forBigInt;
}

export function isFlonum(x: any): boolean {
    return isBoxedNumber(x) && x.isReal() && x.isInexact();
}

export function isZero(n: RacketNumber): boolean {
    const forNumber = typeof n === 'number' && n === 0;
    const forBigInt = typeof n === 'bigint' && n === 0n;
    const forBoxed = isBoxedNumber(n) && n.isZero();
    return forNumber || forBigInt || forBoxed;
}

export function isPositive(n: RacketNumber): boolean {
    const forNumber = typeof n === 'number' && n > 0;
    const forBigInt = typeof n === 'bigint' && n > 0n;
    const forBoxed = isBoxedNumber(n) && n.isPositive();
    return forNumber || forBigInt || forBoxed;
}

export function isNegative(n: RacketNumber): boolean {
    const forNumber = typeof n === 'number' && n < 0;
    const forBigInt = typeof n === 'bigint' && n < 0n;
    const forBoxed = isBoxedNumber(n) && n.isNegative();
    return forNumber || forBigInt || forBoxed;
}

export function isEven(n: RacketNumber): boolean {
    const forNumber = typeof n === 'number' && n % 2 === 0;
    const forBigInt = typeof n === 'bigint' && n % 2n === 0n;
    const forBoxed = isBoxedNumber(n) && n.isEven();
    return forNumber || forBigInt || forBoxed;
}

export function isOdd(n: RacketNumber): boolean {
    return !isEven(n);
}

export function isExact(n: RacketNumber): boolean {
    const forNumber = typeof n === 'number';
    const forBigInt = typeof n === 'bigint';
    const forBoxed = isBoxedNumber(n) && n.isExact();
    return forNumber || forBigInt || forBoxed;
}

export function isInexact(n: RacketNumber): boolean {
    return isBoxedNumber(n) && n.isInexact();
}

export function isRacketNumber(n: RacketNumber): boolean {
    return isBoxedNumber(n) || isJSInteger(n);
}
export const isSchemeNumber = isRacketNumber; // For backwards compatibility

export function isFinite(n: RacketNumber): boolean {
    if (isBoxedNumber(n)) {
        return n.isFinite();
    } else if (typeof n === 'number') {
        return Number.isFinite(n);
    }
    return true;
}

export function isNaN(n: RacketNumber): boolean {
    if (isBoxedNumber(n)) {
        return n.isNaN();
    }
    return Number.isNaN(n);
}

export function isNegativeZero(n: RacketNumber): boolean {
    if (isBoxedNumber(n)) {
        return n.isNegativeZero();
    }
    return false;
}
