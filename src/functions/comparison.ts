import {
    RacketNumber,
} from '../numbers/main';
import {
    BoxedNumber,
    subtract,
    abs
} from '../tower';
import {
    matchTypes
} from './util';

type NumberCompare = (x: number, y: number) => boolean;
type BigIntCompare = (x: bigint, y: bigint) => boolean;
type BoxedNumberCompare = (x: BoxedNumber, y: BoxedNumber) => boolean;

const makeMultiArity = function (fnForNumbers: NumberCompare,
                                 fnForBigInt: BigIntCompare,
                                 fnForBoxedNumbers: BoxedNumberCompare) {
    return function(...args: RacketNumber[]): boolean {
        if (args.length < 2) {
            throw new Error("Must be called with at least two arguments.")
        }

        for (let i = 0; i < args.length - 1; i++) {
            let x = args[i];
            let y = args[i+1];

            [x, y] = matchTypes(x, y);

            if (typeof x === 'number' && !fnForNumbers(x, y as number)) {
                return false;
            } else if (typeof x === 'bigint' && !fnForBigInt(x, y as bigint)) {
                return false;
            } else if (x instanceof BoxedNumber && !fnForBoxedNumbers(x as BoxedNumber, y as BoxedNumber)) {
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
    const equalComp = makeMultiArity(
        function(x: number, y: number): boolean {
            return x === y;
        },
        function(x: bigint, y: bigint): boolean {
            return x === y;
        },
        function(x: BoxedNumber, y: BoxedNumber): boolean {
            return x.equals(y);
        },
    );

    return equalComp(...nums);
}

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

    const gtComp = makeMultiArity(
        function(x: number, y: number): boolean {
            return x > y;
        },
        function(x: bigint, y: bigint): boolean {
            return x > y;
        },
        function(x: BoxedNumber, y: BoxedNumber): boolean {
            return x.greaterThan(y);
        }
    );

    return gtComp(...nums);
}

export function greaterThanOrEqual(...nums: RacketNumber[]): boolean {
    if (nums.length === 1) {
        return true;
    }

    const gteComp = makeMultiArity(
        function(x: number, y: number): boolean {
            return x >= y;
        },
        function(x: bigint, y: bigint): boolean {
            return x >= y;
        },
        function(x: BoxedNumber, y: BoxedNumber): boolean {
            return x.greaterThanOrEqual(y);
        }
    );

    return gteComp(...nums);
}

export function lessThan(...nums: RacketNumber[]): boolean {
    if (nums.length === 1) {
        return true;
    }

    const ltComp = makeMultiArity(
        function(x: number, y: number): boolean {
            return x < y;
        },
        function(x: bigint, y: bigint): boolean {
            return x < y;
        },
        function(x: BoxedNumber, y: BoxedNumber): boolean {
            return x.lessThan(y);
        }
    );

    return ltComp(...nums);
}

export function lessThanOrEqual(...nums: RacketNumber[]): boolean {
    if (nums.length === 1) {
        return true;
    }

    const lteComp = makeMultiArity(
        function(x: number, y: number): boolean {
            return x <= y;
        },
        function(x: bigint, y: bigint): boolean {
            return x <= y;
        },
        function(x: BoxedNumber, y: BoxedNumber): boolean {
            return x.lessThanOrEqual(y);
        }
    );

    return lteComp(...nums);
}
