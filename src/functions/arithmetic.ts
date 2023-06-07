import {
    BoxedNumber
} from '../numbers/BoxedNumber';
import {
    ZERO,
    ONE
} from '../numbers/constants';
import {
    RacketNumber,
    Level
} from '../numbers/main';

type NumberBinop = (x: number, y: number) => RacketNumber;
type BigIntBinop = (x: bigint, y: bigint) => RacketNumber;
type BoxedNumberBinop = (x: BoxedNumber, y: BoxedNumber) => RacketNumber;

/*
 * Makes a function that operates on RacketNumbers. The function takes
 * at least two arguments and folds the given binary operations from left to right.
 */
function makeMultiArity(fnForNumbers: NumberBinop,
                        fnForBigInts: BigIntBinop,
                        fnForBoxedNumbers: BoxedNumberBinop) {
    return function recur(...args: RacketNumber[]): RacketNumber {
        if (args.length < 2) {
            throw new Error("Must be called with at least two arguments.")
        }

        let x = args[0];
        let y = args[1];

        [x, y] = matchTypes(x, y);

        let result;
        if (typeof x === 'number') {
            result = fnForNumbers(x, y as number);
        } else if (typeof x === 'bigint') {
            result = fnForBigInts(x, y as bigint);
        } else {
            result = fnForBoxedNumbers(x as BoxedNumber, y as BoxedNumber);
        }

        if (args.length === 2) {
            return normalize(result);
        } else {
            return recur(result, ...args.slice(3));
        }
    }
}

export function add(...nums: RacketNumber[]): RacketNumber {
    let adder = makeMultiArity(
        function(x: number, y: number): number {
            return x + y;
        },
        function(x: bigint, y: bigint): bigint {
            return x + y;
        },
        function(x: BoxedNumber, y: BoxedNumber): BoxedNumber {
            return x.add(y);
        }
    );

    if (nums.length === 0) {
        return 0;
    } else if (nums.length === 1) {
        return normalize(nums[0]);
    } else {
        return adder(...nums);
    }
}

function normalize(x: RacketNumber): RacketNumber {
    // Don't keep BoxedNumbers if unnecessary
    if (x instanceof BoxedNumber && x.isInteger() && x.isExact()) {
        x = x.toFixnum();
    }

    // Don't keep bigints if unnecessary
    if (typeof x === 'bigint' && isSafeBigInt(x)) {
        x = Number(x);
    }

    return x;
}

function matchTypes(x: RacketNumber, y: RacketNumber): RacketNumber[] {
    x = normalize(x);
    y = normalize(y);

    // Check if they're already the same
    if (typeof x === typeof y) {
        return [x, y];
    }

    // Make types match
    if (x instanceof BoxedNumber && !(y instanceof BoxedNumber)) {
        return [x, BoxedNumber.makeInstance(y)];

    } else if (y instanceof BoxedNumber && !(x instanceof BoxedNumber)) {
        return [y, BoxedNumber.makeInstance(x)];

    } else if (typeof x === 'bigint' && typeof y === 'number') {
        return [x, BigInt(y)];

    } else if (typeof x === 'number' && typeof y === 'bigint') {
        return [BigInt(x), y];

    } else {
       throw new TypeError(`Cannot match values ${x} ${y}`);
    }
}

function isSafeBigInt(n: bigint): boolean {
    const max = BigInt(Number.MAX_SAFE_INTEGER);
    const min = BigInt(Number.MIN_SAFE_INTEGER);
    return n >= min && n <= max;
}

export function subtract(...nums: RacketNumber[]): RacketNumber {
    return ONE;
}

export function multiply(...nums: RacketNumber[]): RacketNumber {
    return ONE;
}

export function divide(...nums: RacketNumber[]): RacketNumber {
    return ONE;
}

export function modulo(n: RacketNumber, k: RacketNumber): RacketNumber {
    return ONE;
}

export function quotient(n: RacketNumber, k: RacketNumber): RacketNumber {
    return ONE;
}

export function remainder(n: RacketNumber, k: RacketNumber): RacketNumber {
    return ONE;
}

export function sqr(n: RacketNumber): RacketNumber {
    return ONE;
}

export function sqrt(n: RacketNumber): RacketNumber {
    return ONE;
}

export function integerSqrt(n: RacketNumber): RacketNumber {
    return ONE;
}

export function expt(n: RacketNumber, k: RacketNumber): RacketNumber {
    return ONE;
}

export function exp(n: RacketNumber): RacketNumber {
    return ONE;
}

export function log(n: RacketNumber): RacketNumber {
    return ONE;
}

export function numerator(n: RacketNumber): RacketNumber {
    return ONE;
}

export function denominator(n: RacketNumber): RacketNumber {
    return ONE;
}

export function gcd(n: RacketNumber): RacketNumber {
    return ONE;
}

export function lcm(n: RacketNumber): RacketNumber {
    return ONE;
}

export function abs(n: RacketNumber): RacketNumber {
    return ONE;
}

export function floor(n: RacketNumber): RacketNumber {
    return ONE;
}

export function ceiling(n: RacketNumber): RacketNumber {
    return ONE;
}

export function round(n: RacketNumber): RacketNumber {
    return ONE;
}
