import {
    RacketNumber,
    InexactNumber,
    isBoxedNumber,
    SmallExactNumber,
    BigExactNumber,
} from '../tower';
import {
    isJSNumber,
    isSafeInteger
} from '../util';

export function normalize(x: RacketNumber): RacketNumber {
    // Don't keep BoxedNumbers if unnecessary
    if (x instanceof InexactNumber) {
        return x.num;
    }
    if (isBoxedNumber(x) && x.isInteger() && x.isExact()) {
        x = x.toFixnum();
    }

    return x;
}

export function boxIfNecessary(x: RacketNumber, y: RacketNumber): RacketNumber[] {
    // Check if they're already the same
    if (isJSNumber(x) && isJSNumber(y) || isBoxedNumber(x) && isBoxedNumber(y)) {
        return [x, y];
    }

    // Make types match
    if (isBoxedNumber(x)) {
        if (typeof y === 'bigint' && isSafeInteger(y)) {
            return [x, new SmallExactNumber(Number(y))]

        } else if (typeof y === 'bigint') {
            return [x, new BigExactNumber(y)];

        } else {
            return [x, new InexactNumber(y as number)];
        }
    }

    if (isBoxedNumber(y)) {
        if (typeof x === 'bigint' && isSafeInteger(x)) {
           return [new SmallExactNumber(Number(x)), y];

        } else if (typeof x === 'bigint') {
           return [new BigExactNumber(x), y];

        } else {
            return [new InexactNumber(x), y];
        }
    }

    throw new TypeError(`Cannot match values ${x} ${y}`);
}

export * from '../util';
