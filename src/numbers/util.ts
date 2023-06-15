import {
    JSInteger,
    JSNumber
} from './main';

export function isJSNumber(n: any): n is JSNumber {
    return typeof n === 'number' || typeof n === 'bigint';
}

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


export * from '../util';
