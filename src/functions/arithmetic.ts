import {
    BoxedNumber
} from '../numbers/BoxedNumber';
import {
    ONE,
    I
} from '../numbers/constants';
import {
    RacketNumber,
} from '../numbers/main';
import {
    makeMultiArity,
    normalize,
    matchTypes
} from './util';
import {
    isNegative,
    isPositive,
    isExact
} from './predicates';

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
