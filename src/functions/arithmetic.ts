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
    EXACT_ZERO,
    EXACT_ONE,
    INEXACT_ZERO,
    EXACT_NEG_ONE,
} from '../numbers/index';
import {
    boxNumber,
    isNegative,
    isPositive,
    isExact,
    isZero,
} from './index';
import {
    normalize,
    normalized,
    makeCompatible,
} from './util';

type NumberBinop = (x: number, y: number) => RacketNumber;
type BoxedNumberBinop = (x: BoxedNumber, y: BoxedNumber) => RacketNumber;

/*
 * Makes a function that operates on RacketNumbers. The function takes
 * at least two arguments and folds the given binary operations from left to right.
 */
function makeMultiArity(fnForNumbers: NumberBinop,
                        fnForBoxedNumbers: BoxedNumberBinop) {
    return function(args: RacketNumber[]): RacketNumber {
        let acc = args[0];
        for (let i = 1; i < args.length; i++) {
            const [x, y] = makeCompatible(acc, args[i]);

            if (typeof x === 'number') {
                acc = fnForNumbers(x, y as number);
            } else {
                acc = fnForBoxedNumbers(x, y as BoxedNumber);
            }
        }

        return acc;
    }
}

export const add = normalized((...nums: RacketNumber[]): RacketNumber => {
    if (nums.length === 0) {
        return EXACT_ZERO;
    }

    if (nums.length === 1) {
        return nums[0];
    }

    return adder(nums);
});

const adder = makeMultiArity(
    (x: number, y: number) => x + y,
    (x: BoxedNumber, y: BoxedNumber) => x.add(y)
);

export const subtract = normalized((...nums: RacketNumber[]): RacketNumber => {
    if (nums.length === 1) {
        return subtracter([EXACT_ZERO, nums[0]]);
    } else {
        return subtracter(nums);
    }
});

const subtracter = makeMultiArity(
    (x: number, y: number) => x - y,
    (x: BoxedNumber, y: BoxedNumber) => x.subtract(y)
);

export const multiply = normalized((...nums: RacketNumber[]): RacketNumber => {
    if (nums.length === 0) {
        return EXACT_ONE;
    }

    if (nums.length === 1) {
        return nums[0];
    }

    return multiplier(nums);
});

const multiplier = makeMultiArity(
    (x: number, y: number) => x * y,
    (x: BoxedNumber, y: BoxedNumber) => x.multiply(y)
);

export const divide = normalized((...nums: RacketNumber[]): RacketNumber => {
    if (nums.length === 1) {
        const arg = nums[0];
        if (typeof arg === 'number') {
            return divider([1, arg]);
        }
        return divider([EXACT_ONE, arg]);
    }

    return divider(nums);
});

const divider = makeMultiArity(
    (x: number, y: number) => x / y,
    (x: BoxedNumber, y: BoxedNumber) => x.divide(y)
);

export function quotient(n: RacketNumber, k: RacketNumber): RacketNumber {
    [n, k] = makeCompatible(n, k);

    let result: RacketNumber;
    if (isBoxedNumber(n)) {
        result = n.divide(k as BoxedNumber).floor();
    } else {
        result = Math.floor(n / (k as number));
    }

    return normalize(result);
}

export function remainder(n: RacketNumber, k: RacketNumber): RacketNumber {
    [n, k] = makeCompatible(n, k);

    let result: RacketNumber;
    if (isBoxedNumber(n)) {
        const quotient = n.divide(k as BoxedNumber).floor();
        result = n.subtract((k as BoxedNumber).multiply(quotient));
    } else {
        result = n % (k as number);
    }

    return normalize(result);
}

export function modulo(n: RacketNumber, k: RacketNumber): RacketNumber {
    [n, k] = makeCompatible(n, k);

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
    }

    return normalize(n * n);
}

export function sqrt(n: RacketNumber): RacketNumber {
    n = normalize(n);

    if (isBoxedNumber(n)) {
        return normalize(n.sqrt());
    }

    if (n < 0) {
        return new ComplexNumber(INEXACT_ZERO, new InexactNumber(Math.sqrt(-n)));
    }

    return Math.sqrt(n);
}

export function integerSqrt(n: RacketNumber): RacketNumber {
    n = normalize(n);

    if (isBoxedNumber(n)) {
        return normalize(n.integerSqrt());
    }

    if (n < 0) {
        return new ComplexNumber(INEXACT_ZERO, new InexactNumber(Math.floor(Math.sqrt(-n))));
    }

    return Math.floor(Math.sqrt(n));
}

export function expt(z: RacketNumber, w: RacketNumber): RacketNumber {
    [z, w] = makeCompatible(normalize(z), normalize(w));

    // Examine special cases for boxed numbers
    if (isBoxedNumber(z)) {
        w = w as BoxedNumber;

        if (w.isExact() && w.isZero()) {
            return ONE;
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

        return normalize(z.expt(w as BoxedNumber));

    } else {
        w = w as number;
        z = z as number;

        // Examine special cases for unboxed numbers.
        if (w === 0) {
            return 1;
        }
        if (Number.isNaN(w)) {
            return NaN;
        }
        if (Object.is(z, -0)) {
            if (w < 0) {
                return w % 2 === 0 ? Infinity : -Infinity;
            }
        }
        if (!Number.isFinite(z) && !Number.isNaN(z)) {
            if (Number.isInteger(w)) {
                if (z < 0 && w < 0) {
                    return w % 2 === 0 ? 0 : -0;
                }
                if (z > 0 && w > 0) {
                    return w % 2 === 0 ? Infinity : -Infinity;
                }
            }
        }

        return Math.pow(z as number, w as number);
    }
}

export function exp(n: RacketNumber): RacketNumber {
    n = normalize(n);

    if (isBoxedNumber(n)) {
        if (n.equals(EXACT_ZERO)) {
            return EXACT_ONE;
        }

        return normalize(n.exp());
    }

    return Math.exp(n);
}

export function log(z: RacketNumber, b?: RacketNumber): RacketNumber {
    let result: RacketNumber;

    if (isBoxedNumber(z)) {
        if (z.isExact() && z.equals(EXACT_ONE)) {
            return EXACT_ZERO;
        }

        result = z.log();

        if (b) {
            result = divide(result, log(b));
        }

        return normalize(result);
    }

    if (z === 1) {
        return 0;
    }

    if (z < 0) {
        return log(new InexactNumber(z), b);
    }

    result = Math.log(z);

    if (b) {
        return divide(result, log(b));
    }

    return result;
}

export function numerator(n: RacketNumber): RacketNumber {
    return normalize(boxNumber(n).numerator());
}

export function denominator(n: RacketNumber): RacketNumber {
    return normalize(boxNumber(n).denominator());
}

export const gcd = normalized((...args: RacketNumber[]): RacketNumber => {
    if (args.length === 0) {
        return EXACT_ZERO;
    }
    if (args.length === 1) {
        return args[0];
    }

    return gcder(args);
});

const gcder = makeMultiArity(
    (x: number, y: number) => {
        let t;
        while (y !== 0) {
            t = x;
            x = y;
            y = t % y;
        }
        return x;
    },
    (x: BoxedNumber, y: BoxedNumber) => {
        const isExact = x.isExact() && y.isExact();

        // The numerator of the result is the gcd of the numerators of the
        // arguments.
        const an = x.numerator();
        const bn = y.numerator();
        let num;
        if (typeof an.num === 'bigint' || typeof bn.num === 'bigint') {
            let x = BigInt(an.num);
            let y = BigInt(bn.num);
            let t;
            while (y !== 0n) {
                t = x;
                x = y;
                y = t % y;
            }
            num = new BigExactNumber(x);

        } else {
            let x = an.num;
            let y = bn.num;
            let t;
            while (y !== 0) {
                t = x;
                x = y;
                y = t % y;
            }

            num = isExact ? new SmallExactNumber(x) : new InexactNumber(x);
        }

        // The denominator of the result is the lcm of the denominators of the
        // arguments.
        const ad = x.denominator();
        const bd = y.denominator();

        if (ad.equals(ONE) && bd.equals(ONE)) {
            return num;
        }

        const den = lcm(ad, bd);

        return divide(num, den);
    }
);

export function lcm(...args: RacketNumber[]): RacketNumber {
    if (args.length === 0) {
        return EXACT_ONE;
    }

    if (args.length === 1) {
        return abs(args[0]);
    }

    for (let i = 0; i < args.length; i++) {
        if (isZero(args[i])) {
            if (isExact(args[i])) {
                return EXACT_ZERO;
            }
            return 0;
        }
    }

    return lcm(binopLcm(args[0], args[1]), ...args.slice(2));
}

function binopLcm(x: RacketNumber, y: RacketNumber): RacketNumber {
    const product = multiply(x, y);
    const den = gcd(x, y);
    const result = abs(divide(product, den));
    return result;
}

export function abs(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.abs());
    }
    return Math.abs(n);
}

export function floor(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.floor());
    } else {
        return Math.floor(n);
    }
}

export function ceiling(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.ceiling());
    } else {
        return Math.ceil(n);
    }
}

export function round(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.round());
    } else {
        return Math.round(n);
    }
}
