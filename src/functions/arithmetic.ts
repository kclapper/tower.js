import {
    RacketNumber,
    BoxedNumber,
    isBoxedNumber,
    InexactNumber,
    SmallExactNumber,
    BigExactNumber,
    ComplexNumber,
    EXACT_HALF,
    NAN,
    ONE,
    I,
    INEXACT_I,
    EXACT_ZERO,
    INEXACT_ZERO,
    EXACT_NEG_ONE,
} from '../tower';
import {
    normalize,
    boxIfNecessary,
    bigExpt,
    isSafeInteger,
} from './util';
import {
    isNegative,
    isPositive,
    isExact,
    isZero,
} from './predicates';
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

        let acc = args[0];
        let x: RacketNumber, y: RacketNumber;
        for (let i = 1; i < args.length; i++) {
            [x, y] = boxIfNecessary(acc, args[i]);
            if (typeof x === 'number') {
                acc = fnForNumbers(x, y as number);
                if (!Number.isSafeInteger(acc)) {
                    acc = fnForBigInts(BigInt(x), BigInt(y as number));
                }
            } else if (typeof x === 'bigint') {
                acc = fnForBigInts(x, y as bigint);
            } else {
                acc = fnForBoxedNumbers(x, y as BoxedNumber);
            }
        }

        return normalize(acc);
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
            return (new SmallExactNumber(x)).divide(new SmallExactNumber(y));
        },
        function(x: bigint, y: bigint): bigint | BoxedNumber {
            if (x % y === 0n) {
                return x / y;
            }
            return (new BigExactNumber(x)).divide(new BigExactNumber(y));
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
    [n, k] = boxIfNecessary(n, k);

    let result: RacketNumber;
    if (isBoxedNumber(n)) {
        result = n.divide(k as BoxedNumber).floor();
    } else if (typeof n === 'number') {
        result = Math.floor(n / (k as number));
    } else {
        result = n / (k as bigint);
    }

    return normalize(result);
}

export function remainder(n: RacketNumber, k: RacketNumber): RacketNumber {
    [n, k] = boxIfNecessary(n, k);

    let result: RacketNumber;
    if (isBoxedNumber(n)) {
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
    [n, k] = boxIfNecessary(n, k);

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
    if (isBoxedNumber(n)) {
        return normalize(n.multiply(n));
    } else if (typeof n === 'number') {
        return normalize(n * n);
    } else {
        return normalize(n * n);
    }
}

export function sqrt(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.sqrt());

    } else if (typeof n === 'number') {
        if (n < 0) {
            n = -n;
            const result = Math.sqrt(n);
            if (Number.isInteger(result)) {
                return new ComplexNumber(EXACT_ZERO, new SmallExactNumber(result));
            } else {
                return new ComplexNumber(INEXACT_ZERO, new InexactNumber(result));
            }
        } else {
            const result = Math.sqrt(n);
            if (Number.isInteger(result)) {
                return result;
            } else {
                return new InexactNumber(result);
            }
        }

    } else {
        return normalize((new BigExactNumber(n)).sqrt());
    }
}

export function integerSqrt(n: RacketNumber): RacketNumber {
    if (isNegative(n)) {
        const result = integerSqrt(multiply(n, -1));
        if (isExact(result)) {
            return multiply(result, I);
        } else {
            return multiply(result, INEXACT_I);
        }
    }
    const result = floor(sqrt(n));
    if (isExact(n) && isBoxedNumber(result)) {
        return result.toFixnum();
    } else {
        return result;
    }
}

export function expt(z: RacketNumber, w: RacketNumber): RacketNumber {
    [z, w] = boxIfNecessary(z, w);

    // Examine special cases for boxed numbers
    if (isBoxedNumber(z)) {
        w = w as BoxedNumber;

        if (w.isExact() && w.isZero()) {
            return 1n;
        }
        if (w.isInexact() && w.isZero()) {
            return 1;
        }
        if (w.isExact() && w.equals(EXACT_HALF)) {
            return sqrt(z);
        }
        if (w.isNaN()) {
            return w.isReal() ? NaN : new ComplexNumber(NAN, NAN);
        }
        if (z.isNegativeZero() && w.isNegative()) {
            return w.isEven() ? Infinity : -Infinity;
        }
        if (!z.isFinite() && !z.isNaN() && z.isNegative() && w.isInteger() && w.isNegative()) {
            return w.isEven() ? 0 : -0;
        }
        if (!z.isFinite() && !z.isNaN() && z.isPositive() && w.isInteger() && w.isPositive()) {
            return w.isEven() ? Infinity : -Infinity;
        }
        if (z.isExact() && z.isZero() && w.equals(EXACT_NEG_ONE)) {
            throw new TypeError("expt not defined for 0 and -1");
        }
    } else {
        // Examine special cases for unboxed numbers.
        if (w === 0n) {
            return 1n;
        }
        if (w === 0) {
            return 1;
        }
        if (Number.isNaN(w)) {
            return NaN;
        }
        if (Object.is(z, -0)) {
            if (typeof w === 'number' && w < 0) {
                return w % 2 === 0 ? Infinity : -Infinity;
            }
            if (typeof w === 'bigint' && w < 0n) {
                return w % 2n === 0n ? Infinity : -Infinity;
            }
        }
        if (typeof z === 'number' && !Number.isFinite(z) && !Number.isNaN(z)) {
            if (typeof w === 'number' && Number.isInteger(w)) {
                if (z < 0 && w < 0) {
                    return w % 2 === 0 ? 0 : -0;
                }
                if (z > 0 && w > 0) {
                    return w % 2 === 0 ? Infinity : -Infinity;
                }
            }
            if (typeof w === 'bigint') {
                if (z < 0 && w < 0n) {
                    return w % 2n === 0n ? 0 : -0;
                }
                if (z > 0 && w > 0n) {
                    return w % 2n === 0n ? Infinity : -Infinity;
                }
            }
        }
        if (z === 0n && (w === -1 || w === -1n)) {
            throw new TypeError('expt not defined for 0 and -1');
        }
    }

    if (isBoxedNumber(z)) {
        return normalize(z.expt(w as BoxedNumber));

    } else if (typeof z === 'number' || typeof w === 'number') {
        return Math.pow(Number(z), Number(w));

    } else {
        if (isSafeInteger(z) && isSafeInteger(w as bigint)) {
            const result = Math.pow(Number(z), Number(w));
            if (isSafeInteger(result)) {
                return BigInt(result);
            }
        }
        return bigExpt(z, w as bigint);
    }
}

export function exp(n: RacketNumber): RacketNumber {
    if (n === 0 || n === 0n) {
        return 1;
    }

    if (isBoxedNumber(n)) {
        return n.exp();

    } else if (typeof n === 'number') {
        return new InexactNumber(Math.exp(n));

    } else {
        return exp(new BigExactNumber(n));
    }
}

export function log(z: RacketNumber, b?: RacketNumber): RacketNumber {
    let result: RacketNumber;
    if (isBoxedNumber(z)) {
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
            return log(new SmallExactNumber(z), b);
        }
        result = Math.log(z);
        if (b) {
            return divide(result, log(b));
        }
        return new InexactNumber(result);

    } else {
        if (z === 1n) {
            return 0;
        }
        return log(new BigExactNumber(z), b);
    }
}

export function numerator(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.numerator());
    }
    return n;
}

export function denominator(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
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
            if (isBoxedNumber(an)) {
                an = an.toFixnum();
            }
            if (isBoxedNumber(ad)) {
                ad = ad.toFixnum();
            }

            let bn = numerator(y);
            let bd = denominator(y);
            if (isBoxedNumber(bn)) {
                bn = bn.toFixnum();
            }
            if (isBoxedNumber(bd)) {
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
    if (isBoxedNumber(n)) {
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
    if (isBoxedNumber(n)) {
        return normalize(n.floor());
    } else if (typeof n === 'bigint') {
        return normalize(n);
    } else {
        return n;
    }
}

export function ceiling(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.ceiling());
    } else if (typeof n === 'bigint') {
        return normalize(n);
    } else {
        return n;
    }
}

export function round(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.round());
    } else if (typeof n === 'bigint') {
        return normalize(n);
    } else {
        return n;
    }
}
