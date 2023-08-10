import {
    RacketNumber,
    InexactNumber,
    isBoxedNumber,
    EXACT_ZERO,
    EXACT_ONE,
    EXACT_TWO,
    EXACT_NEG_ONE,
    PI,
    INF,
    NEG_INF,
} from "../numbers/index";
import {
    isExact,
    isNaN,
    add,
    subtract,
    multiply,
    divide,
    exp,
    isPositive,
    isNegative,
    isZero,
    equals,
} from './index';
import {
    normalize
} from './util';

function isOne(n: RacketNumber): boolean {
    if (isBoxedNumber(n)) {
        return n.equals(EXACT_ONE);
    }
    return Number(n) === 1;
}

export function sin(n: RacketNumber): RacketNumber {
    if (isExact(n) && isZero(n)) {
        return EXACT_ZERO;
    }

    if (isBoxedNumber(n)) {
        return normalize(n.sin());
    }

    return Math.sin(n);
}

export function cos(n: RacketNumber): RacketNumber {
    if (isExact(n) && isZero(n)) {
        return EXACT_ONE;
    }

    if (isBoxedNumber(n)) {
        return normalize(n.cos());
    }

    return Math.cos(n);
}

export function tan(n: RacketNumber): RacketNumber {
    if (isExact(n) && isZero(n)) {
        return EXACT_ZERO;
    }

    if (isBoxedNumber(n)) {
        return normalize(n.tan());
    }

    return Math.tan(n);
}

export function asin(n: RacketNumber): RacketNumber {
    if (isExact(n) && isZero(n)) {
        return EXACT_ZERO;
    }

    if (isBoxedNumber(n)) {
        return normalize(n.asin());
    }

    if (-1 <= n && n <= 1) {
        return Math.asin(n);
    }
    return (new InexactNumber(n)).asin();
}

export function acos(n: RacketNumber): RacketNumber {
    if (isExact(n) && isOne(n)) {
        return EXACT_ZERO;
    }

    if (isBoxedNumber(n)) {
        return normalize(n.acos());

    }

    if (-1 <= n && n <= 1) {
        return Math.acos(n);
    }

    return (new InexactNumber(n)).acos();
}

export const atan2 = atan; // For backwards compatibility with js-numbers

export function atan(y: RacketNumber, x?: RacketNumber): RacketNumber {
    if (x === undefined && isExact(y) && isZero(y)) {
        return EXACT_ZERO;
    }

    if (x === undefined) {
        return atan1(y);
    }

    // https://en.wikipedia.org/wiki/Atan2
    const arg = divide(y, x);

    if (isNaN(arg)) {
        if (equals(y, INF) && equals(x, INF)) {
            return Math.PI / 4;

        } else if (equals(y, INF) && equals(x, NEG_INF)) {
            return 3 * (Math.PI / 4);

        } else if (equals(y, NEG_INF) && equals(x, NEG_INF)) {
            return -3 * (Math.PI / 4);

        } else if (equals(y, NEG_INF) && equals(x, INF)) {
            return -1 * (Math.PI / 4);
        }
    }

    if (isPositive(x)) {
        return atan1(arg);

    } else if (isNegative(x) && (isPositive(y) || isZero(y))) {
        return add(atan1(arg), PI);

    } else if (isNegative(x) && isNegative(y)) {
        return subtract(atan1(arg), PI);

    } else if (isZero(x) && isPositive(y)) {
        return divide(PI, EXACT_TWO);

    } else if (isZero(x) && isNegative(y)) {
        return subtract(EXACT_ZERO, divide(PI, EXACT_TWO));

    } else  {
        throw new Error("atan not defined for coordinates (0, 0)");
    }
}

function atan1(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.atan());

    } else if (n === Infinity) {
        return 884279719003555 / 562949953421312;

    } else if (n === -Infinity) {
        return -884279719003555 / 562949953421312;
    }

    return Math.atan(n);
}

export function sinh(n: RacketNumber): RacketNumber {
    return divide(subtract(exp(n), exp(multiply(n, EXACT_NEG_ONE))), EXACT_TWO);
}

export function cosh(n: RacketNumber): RacketNumber {
    if (isZero(n)) {
        return 1; // Racket returns inexact 1 here.
    }
    return divide(add(exp(n), exp(multiply(n, EXACT_NEG_ONE))), EXACT_TWO);
}

export function tanh(n: RacketNumber): RacketNumber {
    return divide(subtract(exp(multiply(EXACT_TWO, n)), EXACT_ONE), add(exp(multiply(EXACT_TWO, n)), EXACT_ONE))
}
