import {
    BoxedNumber
} from '../numbers/BoxedNumber';
import {
    ONE
} from '../numbers/constants';
import {
    RacketNumber,
} from '../numbers/main';
import {
    makeMultiArity,
    normalize,
    matchTypes
} from './util';

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

export function modulo(n: RacketNumber, k: RacketNumber): RacketNumber {
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
