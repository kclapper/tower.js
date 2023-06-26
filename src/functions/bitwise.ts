import {
    RacketNumber
} from '../tower';
import {
    normalize,
    isJSInteger
} from './util';

export function bitwiseOr(...operands: RacketNumber[]): RacketNumber {
    operands = operands.map(normalize);

    for (const param of operands) {
        if (!isJSInteger(param)) {
            throw new TypeError("bitwise operators only defined for integers.");
        }
    }

    const isBig = operands.reduce((acc, n) => acc || typeof n === 'bigint', false);
    if (isBig) {
        operands = operands.map((n) => BigInt(n as number));
    }

    return normalize(operands.reduce((a, b) => (a as number) | (b as number), isBig ? 0n : 0));
}

export function bitwiseXor(...operands: RacketNumber[]): RacketNumber {
    operands = operands.map(normalize);

    for (const param of operands) {
        if (!isJSInteger(param)) {
            throw new TypeError("bitwise operators only defined for integers.");
        }
    }

    const isBig = operands.reduce((acc, n) => acc || typeof n === 'bigint', false);
    if (isBig) {
        operands = operands.map((n) => BigInt(n as number));
    }

    return normalize(operands.reduce((a, b) => (a as number) ^ (b as number), isBig ? 0n : 0));
}

export function bitwiseAnd(...operands: RacketNumber[]): RacketNumber {
    operands = operands.map(normalize);

    for (const param of operands) {
        if (!isJSInteger(param)) {
            throw new TypeError("bitwise operators only defined for integers.");
        }
    }

    const isBig = operands.reduce((acc, n) => acc || typeof n === 'bigint', false);
    if (isBig) {
        operands = operands.map((n) => BigInt(n as number));
    }

    return normalize(operands.reduce((a, b) => (a as number) & (b as number), isBig ? -1n : -1));
}

export function bitwiseNot(n: RacketNumber): RacketNumber {
    n = normalize(n);

    if (!isJSInteger(n)) {
        throw new TypeError("bitwise operators only defined for integers.");
    }

    return normalize(~n);
}

export function arithmeticShift(n: RacketNumber, m: RacketNumber): RacketNumber {
    n = normalize(n);
    m = normalize(m);

    if (!isJSInteger(n) || !isJSInteger(m)) {
        throw new TypeError("bitwise operators only defined for integers.");
    }

    n = typeof m === 'bigint' ? BigInt(n) : n;
    m = typeof n === 'bigint' ? BigInt(m) : m;

    if (m < (typeof m === 'number' ? 0 : 0n)) {
        return n as number >> -(m as number);
    } else {
        return n as number << (m as number);
    }
}
