import {
    RacketNumber,
    BoxedNumber
} from '../tower';
import {
    isSafeInteger
} from '../util';

export function normalize(x: RacketNumber): RacketNumber {
    // Don't keep BoxedNumbers if unnecessary
    if (x instanceof BoxedNumber
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
    if (x instanceof BoxedNumber) {
        if (typeof y === 'bigint') {
            return [x, BoxedNumber.makeInstance({num: y, den: 1n})]
        } else {
            return [x, BoxedNumber.makeInstance({num: y as number, den: 1})];
        }

    } else if (typeof x === 'bigint') {
        if (y instanceof BoxedNumber) {
           return [BoxedNumber.makeInstance({num: x, den: 1n}), y];
        } else {
            return [x, BigInt(y)];
        }

    } else if (typeof x === 'number') {
        if (y instanceof BoxedNumber) {
            return [BoxedNumber.makeInstance({num: x, den: 1}), y];
        } else {
            return [BigInt(x), y];
        }

    } else {
       throw new TypeError(`Cannot match values ${x} ${y}`);
    }
}

export * from '../util';
