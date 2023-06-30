import {
    RacketNumber,
    isBoxedNumber,
    SmallExactNumber,
    BigExactNumber,
} from '../tower';
import {
    isSafeInteger
} from '../util';

export function normalize(x: RacketNumber): RacketNumber {
    // Don't keep BoxedNumbers if unnecessary
    if (isBoxedNumber(x)
        && x.isReal()
        && x.isInteger()
        && x.isExact()) {

        x = x.toFixnum();
    }

    // Don't keep bigints if unnecessary
    if (typeof x === 'bigint' && isSafeInteger(x)) {
        x = Number(x);
    }

    return x;
}

export function matchTypes(x: RacketNumber, y: RacketNumber): RacketNumber[] {
    // Check if they're already the same
    if (typeof x === typeof y) {
        return [x, y];
    }

    // Make types match
    if (isBoxedNumber(x)) {
        if (typeof y === 'bigint') {
            return [x, new BigExactNumber(y)]
        } else {
            return [x, new SmallExactNumber(y as number)];
        }

    } else if (typeof x === 'bigint') {
        if (isBoxedNumber(y)) {
           return [new BigExactNumber(x), y];
        } else {
            return [x, BigInt(y)];
        }

    } else if (typeof x === 'number') {
        if (isBoxedNumber(y)) {
            return [new SmallExactNumber(x), y];
        } else {
            return [BigInt(x), y];
        }

    } else {
       throw new TypeError(`Cannot match values ${x} ${y}`);
    }
}

export * from '../util';
