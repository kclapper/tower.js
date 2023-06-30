import {
    JSInteger,
    JSNumber,
    BoxedNumber,
    RealNumber,
    ExactNumber,
    isJSInteger,

    SmallExactNumber,
    BigExactNumber
} from './index';

export function integerIsOne(n: JSInteger): boolean {
    const isInteger = isJSInteger(n);
    const isOne = typeof n === 'bigint' ? n === 1n : n === 1;
    return isInteger && isOne;
}

export function numberIsRational(n: JSNumber): boolean {
    const isBigInt = typeof n === 'bigint';
    const isRationalFloat = Number.isFinite(n) && !Number.isNaN(n);
    return isBigInt || isRationalFloat;
}

export function matchExactness(x: RealNumber, y: RealNumber): RealNumber[] {
    x = !y.isExact() ? x.toInexact() : x;
    y = !x.isExact() ? y.toInexact() : y;
    return [x, y];
}

export function isExactReal(n: BoxedNumber): n is ExactNumber {
    return n instanceof SmallExactNumber || n instanceof BigExactNumber;
}

export * from '../util';
