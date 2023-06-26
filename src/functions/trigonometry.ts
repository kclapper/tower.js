import {
    RacketNumber,
    BoxedNumber,
    isExact,
    EXACT_ONE,
    INEXACT_ONE,
    PI,
    INF,
    NEG_INF,
    add,
    subtract,
    multiply,
    divide,
    exp,
    isPositive,
    isNegative,
    isZero,
    equals,
} from "../tower";

function isOne(n: RacketNumber): boolean {
    if (n instanceof BoxedNumber) {
        return n.equals(EXACT_ONE);
    }
    return Number(n) === 1;
}

export function sin(n: RacketNumber): RacketNumber {
    if (isExact(n) && isZero(n)) {
        return 0;
    }

    if (n instanceof BoxedNumber) {
        return n.sin();
    } else if (typeof n === 'number') {
        return BoxedNumber.makeInstance({num: Math.sin(n)});
    } else {
        return BoxedNumber.makeInstance({num: Math.sin(Number(n))});
    }
}

export function cos(n: RacketNumber): RacketNumber {
    if (isExact(n) && isZero(n)) {
        return 1;
    }

    if (n instanceof BoxedNumber) {
        return n.cos();
    } else if (typeof n === 'number') {
        return BoxedNumber.makeInstance({num: Math.cos(n)})
    } else {
        return BoxedNumber.makeInstance({num: Math.cos(Number(n))});
    }
}

export function tan(n: RacketNumber): RacketNumber {
    if (isExact(n) && isZero(n)) {
        return 0;
    }

    if (n instanceof BoxedNumber) {
        return n.tan();
    } else if (typeof n === 'number') {
        return BoxedNumber.makeInstance({num: Math.tan(n)})
    } else {
        return BoxedNumber.makeInstance({num: Math.tan(Number(n))});
    }
}

export function asin(n: RacketNumber): RacketNumber {
    if (isExact(n) && isZero(n)) {
        return 0;
    }

    if (n instanceof BoxedNumber) {
        return n.asin();

    } else if (typeof n === 'number') {
        if (-1 <= n && n <= 1) {
            return BoxedNumber.makeInstance({num: Math.asin(n)})
        }
        return BoxedNumber.makeInstance({num: n, den: 1}).asin();

    } else {
        if (-1n <= n && n <= 1n) {
            return BoxedNumber.makeInstance({num: Math.asin(Number(n))})
        }
        return BoxedNumber.makeInstance({num: n, den: 1n}).asin();
    }
}

export function acos(n: RacketNumber): RacketNumber {
    if (isExact(n) && isOne(n)) {
        return 0;
    }

    if (n instanceof BoxedNumber) {
        return n.acos();

    } else if (typeof n === 'number') {
        if (-1 <= n && n <= 1) {
            return BoxedNumber.makeInstance({num: Math.acos(n)})
        }
        return BoxedNumber.makeInstance({num: n, den: 1}).acos();

    } else {
        if (-1n <= n && n <= 1n) {
            return BoxedNumber.makeInstance({num: Math.acos(Number(n))})
        }
        return BoxedNumber.makeInstance({num: n, den: 1n}).acos();
    }
}

export const atan2 = atan; // For backwards compatibility with js-numbers

export function atan(y: RacketNumber, x?: RacketNumber): RacketNumber {
    if (x === undefined && isExact(y) && isZero(y)) {
        return 0;
    }

    if (x === undefined) {
        return atan1(y);
    }

    // https://en.wikipedia.org/wiki/Atan2
    const arg = divide(y, x);

    if (arg instanceof BoxedNumber && arg.isNaN()) {
        if (equals(y, INF) && equals(x, INF)) {
            return divide(PI, 4);
        } else if (equals(y, INF) && equals(x, NEG_INF)) {
            return multiply(3, divide(PI, 4));
        } else if (equals(y, NEG_INF) && equals(x, NEG_INF)) {
            return multiply(-3, divide(PI, 4));
        } else if (equals(y, NEG_INF) && equals(x, INF)) {
            return multiply(-1, divide(PI, 4));
        }
    }

    if (isPositive(x)) {
        return atan1(arg);
    } else if (isNegative(x) && (isPositive(y) || isZero(y))) {
        return add(atan1(arg), PI);
    } else if (isNegative(x) && isNegative(y)) {
        return subtract(atan1(arg), PI);
    } else if (isZero(x) && isPositive(y)) {
        return divide(PI, 2);
    } else if (isZero(x) && isNegative(y)) {
        return subtract(0, divide(PI, 2));
    } else  {
        throw new Error("atan not defined for coordinates (0, 0)");
    }
}

function atan1(n: RacketNumber): RacketNumber {
    if (n instanceof BoxedNumber) {
        return n.atan();
    } else if (n === Infinity) {
        return BoxedNumber.makeInstance({num: 884279719003555 / 562949953421312});
    } else if (n === -Infinity) {
        return BoxedNumber.makeInstance({num: -884279719003555 / 562949953421312});
    } else if (typeof n === 'number') {
        return BoxedNumber.makeInstance({num: Math.atan(n)})
    } else {
        return BoxedNumber.makeInstance({num: Math.atan(Number(n))});
    }
}

export function sinh(n: RacketNumber): RacketNumber {
    return divide(subtract(exp(n), exp(multiply(n, -1))), 2);
}

export function cosh(n: RacketNumber): RacketNumber {
    if (isZero(n)) {
        return INEXACT_ONE; // Racket returns inexact 1 here.
    }
    return divide(add(exp(n), exp(multiply(n, -1))), 2);
}

export function tanh(n: RacketNumber): RacketNumber {
    return divide(subtract(exp(multiply(2, n)), 1), add(exp(multiply(2, n)), 1))
}
