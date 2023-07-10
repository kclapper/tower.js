import {
    RacketNumber,
    BoxedNumber,
    isBoxedNumber,
    INEXACT_ZERO,
    EXACT_NEG_ONE,
    EXACT_TWO,
    PI,
    EXACT_I,
    INF,
    NEG_INF,
    isReal,
    isZero,
    isPositive,
    add,
    multiply,
    divide,
    abs,
    sin,
    cos,
    ComplexNumber,
    boxNumber,
    isRealNumber,
} from '../tower'
import {
    normalize
} from './util';

export function makeRectangular(real: RacketNumber, imag: RacketNumber): RacketNumber {
    real = boxNumber(real);
    imag = boxNumber(imag);

    if (!isRealNumber(real) || !isRealNumber(imag)) {
        throw new TypeError("makeRectangular arguments must be real numbers");
    }

    return new ComplexNumber(real, imag);
}

export function makePolar(r: RacketNumber, theta: RacketNumber): RacketNumber {
    return add(multiply(r, cos(theta)), multiply(r, sin(theta), EXACT_I));
}

export function magnitude(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        if (containsInfinity(n)) {
            return INF;
        }
        return normalize(n.magnitude());
    }
    return abs(n);
}

function containsInfinity(n: BoxedNumber): boolean {
    const real = n.realPart();
    const imag = n.imaginaryPart();
    return real.equals(INF)
        || real.equals(NEG_INF)
        || imag.equals(INF)
        || imag.equals(NEG_INF);
}

export function angle(n: RacketNumber): RacketNumber {
    if (isZero(n)) {
        throw new Error("Divide by zero");
    }

    if (isReal(n)) {
        return isPositive(n) ? 0 : PI;
    }

    // We know n is a boxed number if it's not real
    n = n as BoxedNumber;
    if (containsInfinity(n)) {
        const real = n.realPart();
        const imag = n.imaginaryPart();

        if (real.equals(INF) && imag.equals(INF)) {
            return divide(PI, 4);
        } else if (real.equals(INF) && imag.equals(NEG_INF)) {
            return multiply(-1, divide(PI, 4));
        } else if (real.equals(NEG_INF) && imag.equals(NEG_INF)) {
            return multiply(-3, divide(PI, 4));
        } else if (real.equals(NEG_INF) && imag.equals(INF)) {
            return multiply(3, divide(PI, 4));
        }

        // One of the two is not infinity
        if (real.equals(INF)) {
            return INEXACT_ZERO.multiply(imag);
        } else if (real.equals(NEG_INF)) {
            return imag.isPositive() ? PI : PI.multiply(EXACT_NEG_ONE);
        } else if (imag.equals(INF)) {
            return PI.divide(EXACT_TWO);
        } else {
            return PI.divide(EXACT_TWO).multiply(EXACT_NEG_ONE);
        }
    }

    return normalize((n as BoxedNumber).angle());
}

export function realPart(n: RacketNumber): RacketNumber {
    if (isReal(n)) {
        return normalize(n);
    }
    return normalize((n as BoxedNumber).realPart());
}

export function imaginaryPart(n: RacketNumber): RacketNumber {
    if (isReal(n)) {
        return 0;
    }
    return normalize((n as BoxedNumber).imaginaryPart());
}

export function conjugate(n: RacketNumber): RacketNumber {
    if (isReal(n)) {
        return normalize(n);
    }
    return (n as BoxedNumber).conjugate();
}
