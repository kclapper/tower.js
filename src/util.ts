import {
    JSInteger
} from './tower';

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

export function bigExpt(n: bigint, k: bigint): bigint {
    let acc = 1n;
    while (true) {
        if (k === 0n) {
            return acc;
        }

        if (k % 2n === 0n) {
            n = n * n;
            k = k / 2n;
        } else {
            acc = acc * n;
            k = k - 1n;
        }
    }
}
