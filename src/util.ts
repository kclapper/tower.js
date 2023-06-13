import {
    JSInteger
} from './numbers/main';

export function isSafeInteger(n: JSInteger): boolean {
    const max = Number.MAX_SAFE_INTEGER;
    const min = Number.MIN_SAFE_INTEGER;

    if (typeof n === 'number') {
        return n >= min && n <= max;
    } else {
        return n >= BigInt(min) && n <= BigInt(max);
    }
}
