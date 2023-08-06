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

type Normalizable = (...n: RacketNumber[]) => RacketNumber;
type Normalized<F extends Normalizable> = (...n: Parameters<F>) => RacketNumber;
export function normalized<Func extends Normalizable>(fn: Func): Normalized<Func> {
    return function(...nums: RacketNumber[]): RacketNumber {
        for (let i = 0; i < nums.length; i++) {
            const n = nums[i];
            if (n instanceof InexactNumber) {
                nums[i] = n.num;
            }
        }

        const result = fn(...nums);

        if (result instanceof InexactNumber) {
            return result.num;
        }
        return result;
    }
}

export function normalize(x: RacketNumber): RacketNumber {
    if (x instanceof InexactNumber) {
        return x.num;
    }
    return x;
}

export function makeCompatible(x: RacketNumber, y: RacketNumber): [RacketNumber, RacketNumber] {
    if (typeof x === 'number' && typeof y === 'object') {
        x = new InexactNumber(x);
    }
    if (typeof y === 'number' && typeof x === 'object') {
        y = new InexactNumber(y);
    }
    return [x, y];
}

// DEPRECATED
export function boxIfNecessary(x: RacketNumber, y: RacketNumber): RacketNumber[] {
    // Check if they're already the same
    if ((isJSNumber(x) && isJSNumber(y)) || (isBoxedNumber(x) && isBoxedNumber(y))) {
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
