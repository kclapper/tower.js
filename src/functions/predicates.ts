import { isJSInteger } from "../numbers/util";
import {
    RacketNumber,
    isBoxedNumber
} from "../tower";

export function isNumber(x: any): x is RacketNumber {
    const isNumber = typeof x === 'number';
    const isBoxed = isBoxedNumber(x);
    return isNumber || isBoxed;
}

export const isComplex = isNumber;

export function isReal(x: any): x is RacketNumber {
    const isNumber = typeof x === 'number';
    const isBoxedReal = isBoxedNumber(x) && x.isReal();
    return isNumber || isBoxedReal;
}

export function isRational(x: any): x is RacketNumber {
    const isNumber = typeof x === 'number' && Number.isFinite(x);
    const isBoxedRational = isBoxedNumber(x) && x.isRational();
    return isNumber || isBoxedRational;
}

export function isInteger(x: any): x is RacketNumber {
    const isNumber = typeof x === 'number' && Number.isInteger(x);
    const isBoxedInteger = isBoxedNumber(x) && x.isInteger();
    return isNumber || isBoxedInteger;
}

export function isExactInteger(x: any): x is RacketNumber {
    return isBoxedNumber(x) && x.isInteger() && x.isExact();
}

export function isExactNonNegativeInteger(x: any): x is RacketNumber {
    return isBoxedNumber(x) && x.isInteger() && x.isExact() && !x.isNegative();
}

export function isExactPositiveInteger(x: any): x is RacketNumber {
    return isBoxedNumber(x) && x.isInteger() && x.isExact() && x.isPositive();
}

export function isInexactReal(x: any): boolean {
    return typeof x === 'number'
        || (isBoxedNumber(x) && x.isReal() && x.isInexact());
}

// DEPRECATED
export function isFixnum(x: any): boolean {
    return false;
    //const forNumber = typeof x === 'number' && Number.isInteger(x);
    //const forBigInt = typeof x === 'bigint';
    //return forNumber || forBigInt;
}

export function isFlonum(x: any): x is number {
    return typeof x === 'number';
}

export function isZero(n: RacketNumber): boolean {
    const forNumber = typeof n === 'number' && n === 0;
    const forBoxed = isBoxedNumber(n) && n.isZero();
    return forNumber || forBoxed;
}

export function isPositive(n: RacketNumber): boolean {
    const forNumber = typeof n === 'number' && n > 0;
    const forBoxed = isBoxedNumber(n) && n.isPositive();
    return forNumber || forBoxed;
}

export function isNegative(n: RacketNumber): boolean {
    const forNumber = typeof n === 'number' && n < 0;
    const forBoxed = isBoxedNumber(n) && n.isNegative();
    return forNumber || forBoxed;
}

export function isEven(n: RacketNumber): boolean {
    if (!isInteger(n)) {
        throw new TypeError("'isEven' only defined for integers");
    }

    const forNumber = typeof n === 'number' && n % 2 === 0;
    const forBoxed = isBoxedNumber(n) && n.isEven();
    return forNumber || forBoxed;
}

export function isOdd(n: RacketNumber): boolean {
    if (!isInteger(n)) {
        throw new TypeError("'isOdd' only defined for integers");
    }

    return !isEven(n);
}

export function isExact(n: RacketNumber): boolean {
    return isBoxedNumber(n) && n.isExact();
}

export function isInexact(n: RacketNumber): boolean {
    return typeof n === 'number'
        || (isBoxedNumber(n) && n.isInexact());
}

export function isRacketNumber(n: RacketNumber): n is RacketNumber {
    return typeof n === 'number'
        || isBoxedNumber(n);
}
export const isSchemeNumber = isRacketNumber; // For backwards compatibility

export function isFinite(n: RacketNumber): boolean {
    if (isBoxedNumber(n)) {
        return n.isFinite();
    }

    return Number.isFinite(n);
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
    return Object.is(n, -0);
}
