import {
    BoxedNumber,
    EXACT_HALF,
    INF,
    NAN,
    NEG_INF,
} from '../numbers/BoxedNumber';
import {
    ONE,
    I,
    EXACT_ZERO,
    INEXACT_ZERO,
    INEXACT_ONE,
} from '../numbers/constants';
import {
    RacketNumber,
} from '../numbers/main';
import {
    makeMultiArity,
    normalize,
    matchTypes,
    fastExpt,
    isSafeInteger,
    shouldBeBigInt,
} from './util';
import {
    isNegative,
    isPositive,
    isExact,
    isZero
} from './predicates';
import {
    exactToInexact
} from './misc';

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
        let quotient = n.divide(k as BoxedNumber).floor();
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
    let negn = isNegative(n);
    let negk = isNegative(k);

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
            let result = Math.sqrt(n);
            if (Number.isInteger(result)) {
                return BoxedNumber.makeInstance({num: 0, den: 1, imagNum: result, imagDen: 1});
            } else {
                return BoxedNumber.makeInstance({num: 0, imagNum: result});
            }
        } else {
            let result = Math.sqrt(n);
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
        let result = integerSqrt(multiply(n, -1));
        if (isExact(result)) {
            return multiply(result, I);
        } else {
            return multiply(result, BoxedNumber.makeInstance({num: 0, imagNum: 1}));
        }
    }
    let result = floor(sqrt(n));
    if (isExact(n) && result instanceof BoxedNumber) {
        return result.toFixnum();
    } else {
        return result;
    }
}

export function expt(z: RacketNumber, w: RacketNumber): RacketNumber {
    [z, w] = matchTypes(z, w);

    if (z instanceof BoxedNumber) {
        w = w as BoxedNumber;

        if (w.isInexact() && w.equals(INEXACT_ZERO)) {
            return INEXACT_ONE;

        } else if (w.isExact() && w.equals(EXACT_HALF)) {
            return sqrt(z);

        } else if (w.isNaN()) {
            return w.isReal() ? NAN : BoxedNumber.makeInstance({num: NaN, imagNum: NaN});

        } else if (z.isNegativeZero() && w.isNegative()) {
            return w.isEven() ? INF : NEG_INF;

        } else if (!z.isFinite() && !z.isNaN() && z.isNegative() && w.isInteger() && w.isNegative()) {
            return w.isEven() ? INEXACT_ZERO : BoxedNumber.makeInstance({num: -0});

        } else if (!z.isFinite() && !z.isNaN() && z.isPositive() && w.isInteger() && w.isPositive()) {
            return w.isEven() ? INF : NEG_INF;

        }

        return normalize(z.expt(w as BoxedNumber));

    } else if (typeof z === 'number') {
        let result = Math.pow(z, w as number);

        if (!Number.isFinite(result)) {
            return BoxedNumber.makeInstance({num: result});
        }

        if (shouldBeBigInt(result)) {
            return expt(BigInt(z as number), BigInt(w as number));
        }

        return result;

    } else {
        // TODO: Rename this function
        return fastExpt(z, w as bigint);
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
            let isExact = x.isExact() && y.isExact();

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


            let num = gcd(an, bn);
            let den = lcm(ad, bd);

            let result = divide(num, den);

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
        let product = multiply(x, y);
        let den = gcd(x, y);
        let result = abs(divide(product, den));
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
