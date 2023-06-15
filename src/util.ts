import {
    JSInteger
} from './numbers/main';

export function isSafeInteger(n: JSInteger): boolean {
    const max = Number.MAX_SAFE_INTEGER;
    const min = Number.MIN_SAFE_INTEGER;

    if (typeof n === 'number') {
        return Number.isFinite(n) && n >= min && n <= max;
    } else {
        return n >= BigInt(min) && n <= BigInt(max);
    }
}

export function shouldBeBigInt(n: number): boolean {
    return Number.isFinite(n) && !isSafeInteger(n);
}

// TODO: Make it so it automatically escalates to bigint.
export function fastExpt(n: JSInteger, k: JSInteger): JSInteger {
    let zero, one, two;
    if (typeof n === 'number' && typeof k === 'number') {
        zero = 0;
        one = 1;
        two = 2;
    } else if (typeof n === 'bigint' && typeof k === 'bigint') {
        zero = 0n;
        one = 1n;
        two = 2n;
    } else {
        throw new TypeError("n and k types must match.");
    }

    // HACK: need to cast to number even though ops are defined for both
    // number and bigint.
    n = n as number;
    k = k as number;
    zero = zero as number;
    one = one as number;
    two = two as number;

    let acc = one;
    while (true) {
        if (k === zero) {
            return acc;
        }

        if (k % two === zero) {
            n = n * n;
            k = k / two;
        } else {
            acc = acc * n;
            k = k - one;
        }
    }
}
