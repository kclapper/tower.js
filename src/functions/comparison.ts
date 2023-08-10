import {
    RacketNumber,
    isBoxedNumber,
    BoxedNumber,
} from '../numbers/index';
import {
    subtract,
    abs
} from './index';
import {
    makeCompatible
} from './util';

type NumberCompare = (x: number, y: number) => boolean;
type BoxedNumberCompare = (x: BoxedNumber, y: BoxedNumber) => boolean;

const makeMultiArity = function (fnForNumbers: NumberCompare,
                                 fnForBoxedNumbers: BoxedNumberCompare) {
    return function(...args: RacketNumber[]): boolean {
        if (args.length < 2) {
            throw new Error("Must be called with at least two arguments.")
        }

        for (let i = 0; i < args.length - 1; i++) {
            let x = args[i];
            let y = args[i+1];

            [x, y] = makeCompatible(x, y);

            if (typeof x === 'number' && !fnForNumbers(x, y as number)) {
                return false;
            } else if (isBoxedNumber(x) && !fnForBoxedNumbers(x as BoxedNumber, y as BoxedNumber)) {
                return false;
            }
        }
        return true;
    }
}

export function equals(...nums: RacketNumber[]): boolean {
    if (nums.length === 1) {
        return true;
    }
    return equalComp(...nums);
}

const equalComp = makeMultiArity(
    (x: number, y: number) => x === y,
    (x: BoxedNumber, y: BoxedNumber) => x.equals(y)
);

// This is provided for compatibility with the original js-numbers library
export function eqv(x: RacketNumber, y: RacketNumber): boolean {
    return equals(x, y);
}

// This is provided for compatibility with the original js-numbers library
export function approxEquals(x: RacketNumber, y: RacketNumber, delta: RacketNumber): boolean {
    return lessThanOrEqual(abs(subtract(x, y)), abs(delta));
}

export function greaterThan(...nums: RacketNumber[]): boolean {
    if (nums.length === 1) {
        return true;
    }
    return gtComp(...nums);
}

const gtComp = makeMultiArity(
    (x: number, y: number) => x > y,
    (x: BoxedNumber, y: BoxedNumber) => x.greaterThan(y)
);

export function greaterThanOrEqual(...nums: RacketNumber[]): boolean {
    if (nums.length === 1) {
        return true;
    }
    return gteComp(...nums);
}

const gteComp = makeMultiArity(
    (x: number, y: number) => x >= y,
    (x: BoxedNumber, y: BoxedNumber) => x.greaterThanOrEqual(y)
);

export function lessThan(...nums: RacketNumber[]): boolean {
    if (nums.length === 1) {
        return true;
    }
    return ltComp(...nums);
}

const ltComp = makeMultiArity(
    (x: number, y: number) => x < y,
    (x: BoxedNumber, y: BoxedNumber) => x.lessThan(y)
);

export function lessThanOrEqual(...nums: RacketNumber[]): boolean {
    if (nums.length === 1) {
        return true;
    }
    return lteComp(...nums);
}

const lteComp = makeMultiArity(
    (x: number, y: number) => x <= y,
    (x: BoxedNumber, y: BoxedNumber) => x.lessThanOrEqual(y)
);
