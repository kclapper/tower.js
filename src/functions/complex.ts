import {
    RacketNumber,
    BoxedNumber,
    INEXACT_ZERO,
    EXACT_ZERO,
    EXACT_I,
    INF,
    NEG_INF,
    ComplexNumber,
    isRealNumber,
    RealNumber,
} from '../numbers/index';
import {
    isReal,
    isZero,
    isPositive,
    add,
    multiply,
    abs,
    sin,
    cos,
    boxNumber,
    isExact,
    isInexact,
    exactToInexact,
} from './index';
import {
    normalize
} from './util';

export function makeRectangular(real: RacketNumber, imag: RacketNumber): RacketNumber {
    real = boxNumber(real);
    imag = boxNumber(imag);

    if (!isRealNumber(real) || !isRealNumber(imag)) {
        throw new TypeError("makeRectangular arguments must be real numbers");
    }

    if (imag.equals(EXACT_ZERO) && imag.isExact()) {
        return normalize(real);
    }

    if (isInexact(real) && isExact(imag)) {
        imag = exactToInexact(imag);
        imag = boxNumber(imag) as RealNumber;
        return new ComplexNumber(real, imag);
    }

    if (isInexact(imag) && isExact(real)) {
        real = exactToInexact(real);
        real = boxNumber(real) as RealNumber;
        return new ComplexNumber(real, imag);
    }

    return new ComplexNumber(real, imag);
}

export function makePolar(r: RacketNumber, theta: RacketNumber): RacketNumber {
    return add(multiply(r, cos(theta)), multiply(r, sin(theta), EXACT_I));
}

export function magnitude(n: RacketNumber): RacketNumber {
    if (!isReal(n)) {
        n = n as BoxedNumber;

        if (containsInfinity(n)) {
            return Infinity;
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
        return isPositive(n) ? 0n : Math.PI;
    }

    // We know n is a complex number if it's not real
    n = n as ComplexNumber;
    if (containsInfinity(n)) {
        const real = n.realPart();
        const imag = n.imaginaryPart();

        if (real.equals(INF) && imag.equals(INF)) {
            return Math.PI / 4;
        } else if (real.equals(INF) && imag.equals(NEG_INF)) {
            return -1 * (Math.PI / 4);
        } else if (real.equals(NEG_INF) && imag.equals(NEG_INF)) {
            return -3 * (Math.PI / 4);
        } else if (real.equals(NEG_INF) && imag.equals(INF)) {
            return 3 * (Math.PI / 4);
        }

        // One of the two is not infinity
        if (real.equals(INF)) {
            return normalize(INEXACT_ZERO.multiply(imag));
        } else if (real.equals(NEG_INF)) {
            return imag.isPositive() ? Math.PI : -Math.PI;
        } else if (imag.equals(INF)) {
            return Math.PI / 2;
        } else {
            return -(Math.PI / 2);
        }
    }

    return normalize(n.angle());
}

export function realPart(n: RacketNumber): RacketNumber {
    if (isReal(n)) {
        return normalize(n);
    }
    return normalize((n as ComplexNumber).realPart());
}

export function imaginaryPart(n: RacketNumber): RacketNumber {
    if (isReal(n)) {
        return 0n;
    }
    return normalize((n as ComplexNumber).imaginaryPart());
}

export function conjugate(n: RacketNumber): RacketNumber {
    if (isReal(n)) {
        return normalize(n);
    }
    return (n as ComplexNumber).conjugate();
}
