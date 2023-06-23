import {
    RacketNumber,
} from '../tower';
import {
    normalize
} from './util';

export function bitwiseOr(...operands: RacketNumber[]): RacketNumber {
    operands = operands.map(normalize);

    for (const param of operands) {
        if (typeof param !== 'number' && typeof param !== 'bigint') {
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
        if (typeof param !== 'number' && typeof param !== 'bigint') {
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
        if (typeof param !== 'number' && typeof param !== 'bigint') {
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

    if (typeof n !== 'number' && typeof n !== 'bigint') {
        throw new TypeError("bitwise operators only defined for integers.");
    }

    return normalize(~n);
}
