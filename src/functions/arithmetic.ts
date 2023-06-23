import {
    RacketNumber,
    BoxedNumber,
    EXACT_HALF,
    INF,
    NAN,
    NEG_INF,
    ONE,
    I,
    EXACT_ZERO,
    INEXACT_ZERO,
    INEXACT_ONE,
} from '../tower';
import {
    normalize,
    matchTypes,
    bigExpt,
    shouldBeBigInt,
} from './util';
import {
    isNegative,
    isPositive,
    isExact,
    isInexact,
    isZero,
    isEven,
    isInteger,
    isReal,
    isFinite,
    isNaN,
    isNegativeZero
} from './predicates';
import {
    equals
} from './comparison';
import {
    exactToInexact
} from './misc';

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
            if (!Number.isSafeInteger(result)) {
                result = fnForBigInts(BigInt(x), BigInt(y as number));
            }
        } else if (typeof x === 'bigint') {
            result = fnForBigInts(x, y as bigint);
        } else {
            result = fnForBoxedNumbers(x, y as BoxedNumber);
        }

        if (args.length === 2) {
            return normalize(result);
        } else {
            return recur(result, ...args.slice(2));
        }
    }
}

export function add(...nums: RacketNumber[]): RacketNumber {
    const adder = makeMultiArity(
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

export function subtract(...nums: RacketNumber[]): RacketNumber {
    const subtracter = makeMultiArity(
        function(x: number, y: number): number {
            return x - y;
        },
        function(x: bigint, y: bigint): bigint {
            return x - y;
        },
        function(x: BoxedNumber, y: BoxedNumber): BoxedNumber {
            return x.subtract(y);
        }
    );

    if (nums.length === 1) {
        return subtracter(0, nums[0]);
    } else {
        return subtracter(...nums);
    }
}

export function multiply(...nums: RacketNumber[]): RacketNumber {
    const multiplier = makeMultiArity(
        function(x: number, y: number): number {
            return x * y;
        },
        function(x: bigint, y: bigint): bigint {
            return x * y;
        },
        function(x: BoxedNumber, y: BoxedNumber): BoxedNumber {
            return x.multiply(y);
        }
    );

    if (nums.length === 0) {
        return 1;
    } else if (nums.length === 1) {
        return normalize(nums[0]);
    } else {
        return multiplier(...nums);
    }
}

export function divide(...nums: RacketNumber[]): RacketNumber {
    const divider = makeMultiArity(
        function(x: number, y: number): number | BoxedNumber {
            if (x % y === 0) {
                return x / y;
            }
            return BoxedNumber.makeInstance({num: x, den: 1}).divide(BoxedNumber.makeInstance({num: y, den: 1}));
        },
        function(x: bigint, y: bigint): bigint | BoxedNumber {
            if (x % y === 0n) {
                return x / y;
            }
            return BoxedNumber.makeInstance({num: x, den: 1n}).divide(BoxedNumber.makeInstance({num: y, den: 1n}));
        },
        function(x: BoxedNumber, y: BoxedNumber): BoxedNumber {
            return x.divide(y);
        }
    );

    if (nums.length === 1) {
        return divider(1, nums[0]);
    } else {
        return divider(...nums);
    }
}

export function quotient(n: RacketNumber, k: RacketNumber): RacketNumber {
    [n, k] = matchTypes(n, k);

    let result;
    if (n instanceof BoxedNumber) {
        result = n.divide(k as BoxedNumber).floor();
    } else if (typeof n === 'number') {
        result = Math.floor(n / (k as number));
    } else {
        result = n / (k as bigint);
    }

    return normalize(result);
}

export function remainder(n: RacketNumber, k: RacketNumber): RacketNumber {
    [n, k] = matchTypes(n, k);

    let result;
    if (n instanceof BoxedNumber) {
        const quotient = n.divide(k as BoxedNumber).floor();
        result = n.subtract((k as BoxedNumber).multiply(quotient));
    } else if (typeof n === 'number') {
        result = n % (k as number);
    } else {
        result = n % (k as bigint);
    }

    return normalize(result);
}

export function modulo(n: RacketNumber, k: RacketNumber): RacketNumber {
    [n, k] = matchTypes(n, k);

    let result = remainder(n, k);
    const negk = isNegative(k);

    if (negk) {
        if (isPositive(result)) {
            result = add(result, k);
        }
    } else {
        if (isNegative(result)) {
            result = add(result, k);
        }
    }

    return normalize(result);
}

export function sqr(n: RacketNumber): RacketNumber {
    if (n instanceof BoxedNumber) {
        return normalize(n.multiply(n));
    } else if (typeof n === 'number') {
        return normalize(n * n);
    } else {
        return normalize(n * n);
    }
}

export function sqrt(n: RacketNumber): RacketNumber {
    if (n instanceof BoxedNumber) {
        return normalize(n.sqrt());

    } else if (typeof n === 'number') {
        if (n < 0) {
            n = -n;
            const result = Math.sqrt(n);
            if (Number.isInteger(result)) {
                return BoxedNumber.makeInstance({num: 0, den: 1, imagNum: result, imagDen: 1});
            } else {
                return BoxedNumber.makeInstance({num: 0, imagNum: result});
            }
        } else {
            const result = Math.sqrt(n);
            if (Number.isInteger(result)) {
                return result;
            } else {
                return BoxedNumber.makeInstance({num: result});
            }
        }

    } else {
        return normalize(BoxedNumber.makeInstance({num: n, den: 1n}).sqrt());
    }
}

export function integerSqrt(n: RacketNumber): RacketNumber {
    if (isNegative(n)) {
        const result = integerSqrt(multiply(n, -1));
        if (isExact(result)) {
            return multiply(result, I);
        } else {
            return multiply(result, BoxedNumber.makeInstance({num: 0, imagNum: 1}));
        }
    }
    const result = floor(sqrt(n));
    if (isExact(n) && result instanceof BoxedNumber) {
        return result.toFixnum();
    } else {
        return result;
    }
}

export function expt(z: RacketNumber, w: RacketNumber): RacketNumber {
    if (isInexact(w) && equals(w, INEXACT_ZERO)) {
        return INEXACT_ONE;

    } else if (isExact(w) && equals(w, EXACT_HALF)) {
        return sqrt(z);

    } else if (isNaN(w)) {
        return isReal(w) ? NAN : BoxedNumber.makeInstance({num: NaN, imagNum: NaN});

    } else if (isNegativeZero(z) && isNegative(w)) {
        return isEven(w) ? INF : NEG_INF;

    } else if (!isFinite(z) && !isNaN(z) && isNegative(z) && isInteger(w) && isNegative(w)) {
        return isEven(w) ? INEXACT_ZERO : BoxedNumber.makeInstance({num: -0});

    } else if (!isFinite(z) && !isNaN(z) && isPositive(z) && isInteger(w) && isPositive(w)) {
        return isEven(w) ? INF : NEG_INF;

    }

    [z, w] = matchTypes(z, w);

    if (z instanceof BoxedNumber) {
        return normalize(z.expt(w as BoxedNumber));

    } else if (typeof z === 'number') {
        const result = Math.pow(z, w as number);

        if (shouldBeBigInt(result) || !Number.isFinite(result)) {
            return bigExpt(BigInt(z), BigInt(w as number));
        }

        return result;

    } else {
        return bigExpt(z, w as bigint);
    }
}

export function exp(n: RacketNumber): RacketNumber {
    if (n === 0 || n === 0n) {
        return 1;
    }

    if (n instanceof BoxedNumber) {
        return n.exp();

    } else if (typeof n === 'number') {
        return BoxedNumber.makeInstance({num: Math.exp(n)});

    } else {
        return exp(BoxedNumber.makeInstance({num: n, den: 1n}));
    }
}

export function log(z: RacketNumber, b?: RacketNumber): RacketNumber {
    let result;
    if (z instanceof BoxedNumber) {
        if (z.isExact() && z.equals(ONE)) {
            return 0;
        }
        result = z.log();
        if (b) {
            result = divide(result, log(b));
        }
        return result;

    } else if (typeof z === 'number') {
        if (z === 1) {
            return 0;
        }
        if (z < 0) {
            return log(BoxedNumber.makeInstance({num: z, den: 1}), b);
        }
        result = Math.log(z);
        if (b) {
            return divide(result, log(b));
        }
        return BoxedNumber.makeInstance({num: result});

    } else {
        if (z === 1n) {
            return 0;
        }
        return log(BoxedNumber.makeInstance({num: z, den: 1n}), b);
    }
}

export function numerator(n: RacketNumber): RacketNumber {
    if (n instanceof BoxedNumber) {
        return normalize(n.numerator());
    }
    return n;
}

export function denominator(n: RacketNumber): RacketNumber {
    if (n instanceof BoxedNumber) {
        return normalize(n.denominator());
    }
    return 1;
}

export function gcd(...args: RacketNumber[]): RacketNumber {
    if (args.length === 0) {
        return 0;
    }
    if (args.length === 1) {
        return args[0];
    }

    const gcder = makeMultiArity(
        function(x: number, y: number): number {
            let t;
            while (y !== 0) {
                t = x;
                x = y;
                y = t % y;
            }
            return x;
        },
        function(x: bigint, y: bigint): bigint {
            let t;
            while (y !== 0n) {
                t = x;
                x = y;
                y = t % y;
            }
            return x;
        },
        function(x: BoxedNumber, y: BoxedNumber): RacketNumber {
            const isExact = x.isExact() && y.isExact();

            let an = numerator(x);
            let ad = denominator(x);
            if (an instanceof BoxedNumber) {
                an = an.toFixnum();
            }
            if (ad instanceof BoxedNumber) {
                ad = ad.toFixnum();
            }

            let bn = numerator(y);
            let bd = denominator(y);
            if (bn instanceof BoxedNumber) {
                bn = bn.toFixnum();
            }
            if (bd instanceof BoxedNumber) {
                bd = bd.toFixnum();
            }


            const num = gcd(an, bn);
            const den = lcm(ad, bd);

            const result = divide(num, den);

            return isExact? result : exactToInexact(result);
        }
    );

    return gcder(...args);
}

export function lcm(...args: RacketNumber[]): RacketNumber {
    if (args.length === 0) {
        return 1;
    }

    if (args.length === 1) {
        return abs(args[0]);
    }

    for (let i = 0; i < args.length; i++) {
        if (isZero(args[i])) {
            if (isExact(args[i])) {
                return EXACT_ZERO;
            }
            return INEXACT_ZERO;
        }
    }

    const binopLcm = function(x: RacketNumber, y: RacketNumber): RacketNumber {
        const product = multiply(x, y);
        const den = gcd(x, y);
        const result = abs(divide(product, den));
        return result;
    }

    return lcm(binopLcm(args[0], args[1]), ...args.slice(2));
}

export function abs(n: RacketNumber): RacketNumber {
    if (n instanceof BoxedNumber) {
        return normalize(n.abs());
    } else if (typeof n === 'number') {
        return Math.abs(n);
    } else if (typeof n === 'bigint' && n >= 0n) {
        return normalize(n);
    } else {
        return normalize(n * -1n);
    }
}

export function floor(n: RacketNumber): RacketNumber {
    if (n instanceof BoxedNumber) {
        return normalize(n.floor());
    } else if (typeof n === 'bigint') {
        return normalize(n);
    } else {
        return n;
    }
}

export function ceiling(n: RacketNumber): RacketNumber {
    if (n instanceof BoxedNumber) {
        return normalize(n.ceiling());
    } else if (typeof n === 'bigint') {
        return normalize(n);
    } else {
        return n;
    }
}

export function round(n: RacketNumber): RacketNumber {
    if (n instanceof BoxedNumber) {
        return normalize(n.round());
    } else if (typeof n === 'bigint') {
        return normalize(n);
    } else {
        return n;
    }
}
