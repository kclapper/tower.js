import {
    RacketNumber,
} from '../numbers/index';
import {
    isExactInteger,
} from './index';
import {
    normalize
} from './util';

export function bitwiseOr(...operands: RacketNumber[]): RacketNumber {
    let acc = 0n;
    for (let i = 0; i < operands.length; i++) {
        const n = operands[i];

        if (!isExactInteger(n)) {
            throw new TypeError("bitwise operators only defined for exact integers.");
        }

        acc |= normalize(n) as bigint;
    }
    return acc;
}

export function bitwiseXor(...operands: RacketNumber[]): RacketNumber {
    let acc = 0n;
    for (let i = 0; i < operands.length; i++) {
        const n = operands[i];

        if (!isExactInteger(n)) {
            throw new TypeError("bitwise operators only defined for exact integers.");
        }

        acc ^= normalize(n) as bigint;
    }
    return acc;
}

export function bitwiseAnd(...operands: RacketNumber[]): RacketNumber {
    let acc = -1n;
    for (let i = 0; i < operands.length; i++) {
        const n = operands[i];

        if (!isExactInteger(n)) {
            throw new TypeError("bitwise operators only defined for exact integers.");
        }

        acc &= normalize(n) as bigint;
    }
    return acc;
}

export function bitwiseNot(n: RacketNumber): RacketNumber {
    if (!isExactInteger(n)) {
        throw new TypeError("bitwise operators only defined for exact integers.");
    }

    n = normalize(n) as bigint;
    return ~n;
}

export function arithmeticShift(n: RacketNumber, m: RacketNumber): RacketNumber {
    if (!isExactInteger(n) || !isExactInteger(m)) {
        throw new TypeError("bitwise operators only defined for integers.");
    }

    n = normalize(n) as bigint;
    m = normalize(m) as bigint;

    if (m < 0n) {
        return n >> -m;
    } else {
        return n << m;
    }
}
