import {
    RacketNumber,
    RealNumber,
    ComplexNumber,
    isExactInteger,
    boxNumber,
    SmallExactNumber,
    BigExactNumber,
} from '../tower';
import {
    normalize,
    normalized,
    isJSInteger,
    isSafeInteger
} from './util';

export function bitwiseOr(...operands: RacketNumber[]): RacketNumber {
    for (const param of operands) {
        if (!isExactInteger(param)) {
            throw new TypeError("bitwise operators only defined for exact integers.");
        }
    }

    let acc = 0n;
    for (let param of operands) {
        if (param instanceof ComplexNumber) {
            param = param.toReal();
        }
        param = param as RealNumber;
        acc |= BigInt(param.num);
    }

    if (isSafeInteger(acc)) {
        return new SmallExactNumber(Number(acc));
    }

    return new BigExactNumber(acc);
}

export function bitwiseXor(...operands: RacketNumber[]): RacketNumber {
    for (const param of operands) {
        if (!isExactInteger(param)) {
            throw new TypeError("bitwise operators only defined for exact integers.");
        }
    }

    let acc = 0n;
    for (let param of operands) {
        if (param instanceof ComplexNumber) {
            param = param.toReal();
        }

        param = param as RealNumber;

        acc ^= BigInt(param.num);
    }

    if (isSafeInteger(acc)) {
        return new SmallExactNumber(Number(acc));
    }

    return new BigExactNumber(acc);
}

export function bitwiseAnd(...operands: RacketNumber[]): RacketNumber {
    for (const param of operands) {
        if (!isExactInteger(param)) {
            throw new TypeError("bitwise operators only defined for exact integers.");
        }
    }

    let acc = -1n;
    for (let param of operands) {
        if (param instanceof ComplexNumber) {
            param = param.toReal();
        }

        param = param as RealNumber;

        acc &= BigInt(param.num);
    }

    if (isSafeInteger(acc)) {
        return new SmallExactNumber(Number(acc));
    }

    return new BigExactNumber(acc);
}

export function bitwiseNot(n: RacketNumber): RacketNumber {
    if (!isExactInteger(n)) {
        throw new TypeError("bitwise operators only defined for exact integers.");
    }

    if (n instanceof ComplexNumber) {
        n = n.toReal();
    }

    n = n as RealNumber;

    const result = ~BigInt(n.num);

    if (isSafeInteger(result)) {
        return new SmallExactNumber(Number(result));
    }

    return new BigExactNumber(result);
}

export function arithmeticShift(n: RacketNumber, m: RacketNumber): RacketNumber {
    if (!isExactInteger(n) || !isExactInteger(m)) {
        throw new TypeError("bitwise operators only defined for integers.");
    }

    if (n instanceof ComplexNumber) {
        n = n.toReal();
    }
    n = n as RealNumber;

    if (m instanceof ComplexNumber) {
        m = m.toReal();
    }
    m = m as RealNumber;

    let result;
    const x = BigInt(n.num);
    const y = BigInt(m.num);

    if (y < 0n) {
        result = x >> -y;
    } else {
        result = x << y;
    }

    if (isSafeInteger(result)) {
        return new SmallExactNumber(Number(result));
    }

    return new BigExactNumber(result);
}
