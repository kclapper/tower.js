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
    isSafeInteger,
    bigExpt,
} from '../numbers/index';
import {
    boxNumber,
    isNegative,
    isPositive,
    isExact,
    isZero,
    isReal,
    equals,
    isInexact,
    isInteger,
    isNaN,
    isNegativeZero,
    isEven,
    isFinite,
} from './index';
import {
    normalize,
    normalized,
    makeCompatible,
} from './util';

type NumberBinop = (x: number, y: number) => RacketNumber;
type BigIntBinop = (x: bigint, y: bigint) => RacketNumber;
type BoxedNumberBinop = (x: BoxedNumber, y: BoxedNumber) => RacketNumber;

/*
 * Makes a function that operates on RacketNumbers. The function takes
 * at least two arguments and folds the given binary operations from left to right.
 */
function makeMultiArity(fnForNumbers: NumberBinop,
                        fnForBigInt: BigIntBinop,
                        fnForBoxedNumbers: BoxedNumberBinop) {
    return function(args: RacketNumber[]): RacketNumber {
        let acc = args[0];
        for (let i = 1; i < args.length; i++) {
            const [x, y] = makeCompatible(acc, args[i]);

            if (typeof x === 'number') {
                acc = fnForNumbers(x, y as number);
            } else if (typeof x === 'bigint') {
                acc = fnForBigInt(x, y as bigint);
            } else {
                acc = fnForBoxedNumbers(x, y as BoxedNumber);
            }
        }

        return acc;
    }
}

export const add = normalized((...nums: RacketNumber[]): RacketNumber => {
    if (nums.length === 0) {
        return 0n;
    }

    if (nums.length === 1) {
        return nums[0];
    }

    return adder(nums);
});

const adder = makeMultiArity(
    (x: number, y: number) => x + y,
    (x: bigint, y: bigint) => x + y,
    (x: BoxedNumber, y: BoxedNumber) => x.add(y)
);

export const subtract = normalized((...nums: RacketNumber[]): RacketNumber => {
    if (nums.length === 1) {
        return subtracter([0n, nums[0]]);
    }

    return subtracter(nums);
});

const subtracter = makeMultiArity(
    (x: number, y: number) => x - y,
    (x: bigint, y: bigint) => x - y,
    (x: BoxedNumber, y: BoxedNumber) => x.subtract(y)
);

export const multiply = normalized((...nums: RacketNumber[]): RacketNumber => {
    if (nums.length === 0) {
        return 1n;
    }

    if (nums.length === 1) {
        return nums[0];
    }

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === 0n) {
            return 0n;
        }
    }

    return multiplier(nums);
});

const multiplier = makeMultiArity(
    (x: number, y: number) => x * y,
    (x: bigint, y: bigint) => x * y,
    (x: BoxedNumber, y: BoxedNumber) => x.multiply(y)
);

export const divide = normalized((...nums: RacketNumber[]): RacketNumber => {
    if (nums.length === 1) {
        return divider([1n, nums[0]]);
    }

    return divider(nums);
});

const divider = makeMultiArity(
    (x: number, y: number) => x / y,
    (x: bigint, y: bigint) => {
        if (isSafeInteger(x) && isSafeInteger(y)) {
            return new SmallExactNumber(Number(x), Number(y));
        }
        return new BigExactNumber(x, y);
    },
    (x: BoxedNumber, y: BoxedNumber) => x.divide(y)
);

export function quotient(n: RacketNumber, k: RacketNumber): RacketNumber {
    [n, k] = makeCompatible(n, k);

    let result: RacketNumber;
    if (isBoxedNumber(n)) {
        result = n.divide(k as BoxedNumber).floor();
    } else if (typeof n === 'bigint') {
        result = n / (k as bigint);
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
    } else if (typeof n === 'bigint') {
        result = n % (k as bigint);
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
    n = n as number; // HACK: Can be either number or bigint.
    return normalize(n * n);
}

export function sqrt(n: RacketNumber): RacketNumber {
    if (typeof n === 'bigint') {
        n = boxNumber(n);
    }

    if (isBoxedNumber(n)) {
        return normalize(n.sqrt());
    }

    if (n < 0) {
        return new ComplexNumber(INEXACT_ZERO, new InexactNumber(Math.sqrt(-n)));
    }

    return Math.sqrt(n);
}

export function integerSqrt(n: RacketNumber): RacketNumber {
    //let result = sqrt(n);

    //if (!isReal(result)) {
    //    return makeRectangular(realPart(result), floor(imaginaryPart(result)));
    //}

    //return floor(result);

    if (!isInteger(n)) {
        throw new TypeError("integer-sqrt expected an integer, received: " + n);
    }

    if (typeof n === 'bigint') {
        n = boxNumber(n);
    }

    if (isBoxedNumber(n)) {
        return normalize(n.integerSqrt());
    }

    if (n < 0) {
        return new ComplexNumber(INEXACT_ZERO, new InexactNumber(Math.floor(Math.sqrt(-n))));
    }

    return Math.floor(Math.sqrt(n));
}

export function expt(z: RacketNumber, w: RacketNumber): RacketNumber {
    if (isExact(w) && isZero(w)) {
        return 1n;
    }
    if (isInexact(w) && isZero(w)) {
        return 1;
    }
    if (isExact(w) && equals(w, EXACT_HALF)) {
        return sqrt(z);
    }
    if (isNaN(w)) {
        return isReal(w) ? NaN : new ComplexNumber(NAN, NAN);
    }
    if (isNegativeZero(z) && isNegative(w)) {
        return isEven(w) ? Infinity : -Infinity;
    }
    if (!isFinite(z) && !isNaN(z) && isNegative(z) && isInteger(w) && isNegative(w)) {
        return isEven(w) ? 0 : -0;
    }
    if (!isFinite(z) && !isNaN(z) && isPositive(z) && isInteger(w) && isPositive(w)) {
        return isEven(w) ? Infinity : -Infinity;
    }
    if (isExact(z) && isZero(z) && equals(w, EXACT_NEG_ONE)) {
        throw new TypeError("expt not defined for 0 and -1");
    }
    if (isExact(z) && isZero(z)) {
        return 0n;
    }

    [z, w] = makeCompatible(normalize(z), normalize(w));

    if (isBoxedNumber(z)) {
        return normalize(z.expt(w as BoxedNumber));
    }

    if (typeof z === 'bigint') {
        return bigExpt(z, w as bigint);
    }

    return Math.pow(z, w as number);
}

export function exp(n: RacketNumber): RacketNumber {
    if (typeof n === 'bigint') {
        n = boxNumber(n);
    }

    if (isBoxedNumber(n)) {
        if (n.equals(EXACT_ZERO)) {
            return 1n;
        }

        return normalize(n.exp());
    }

    return Math.exp(n);
}

export function log(z: RacketNumber, b?: RacketNumber): RacketNumber {
    let result: RacketNumber;

    if (typeof z === 'bigint' || typeof b === 'bigint') {
        z = boxNumber(z);
        if (b) {
            b = boxNumber(b);
        }
    }

    if (isBoxedNumber(z)) {
        if (z.isExact() && z.equals(EXACT_ONE)) {
            return 0n;
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
    (x: bigint, y: bigint) => {
        let t;
        while (y !== 0n) {
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
        return 1n;
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
    if (typeof n === 'bigint') {
        return n >= 0n ? n : -n;
    }
    return Math.abs(n);
}

export function floor(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.floor());
    }
    if (typeof n === 'number') {
        return Math.floor(n);
    }
    return n;
}

export function ceiling(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.ceiling());
    }
    if (typeof n === 'number') {
        return Math.ceil(n);
    }
    return n;
}

export function round(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.round());
    }
    if (typeof n === 'number') {
        return Math.round(n);
    }
    return n;
}
