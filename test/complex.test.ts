import {
    InexactNumber,
    SmallExactNumber,
    BigExactNumber,
    ComplexNumber,
    EXACT_ONE,
    EXACT_NEG_ONE,
    EXACT_HALF,
    EXACT_ZERO,
    INEXACT_ONE,
    INEXACT_ZERO,
    PI,
    INF,
    NEG_INF,
    makeRectangular,
    makePolar,
    multiply,
    magnitude,
    angle,
    realPart,
    imaginaryPart,
    conjugate
} from '../src/tower';

describe('makeRectangular', () => {
    test('racket docs examples', () => {
        expect(makeRectangular(new SmallExactNumber(3), new InexactNumber(4)))
            .toEqual(new ComplexNumber(new InexactNumber(3),
                                       new InexactNumber(4)));
    });
    test('unboxed', () => {
        expect(makeRectangular(3, 4))
            .toEqual(new ComplexNumber(new InexactNumber(3),
                                       new InexactNumber(4)));
        expect(makeRectangular(3, -4))
            .toEqual(new ComplexNumber(new InexactNumber(3),
                                       new InexactNumber(-4)));
        expect(makeRectangular(3, EXACT_ZERO))
            .toEqual(3);

        const bignumber = new BigExactNumber(BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2));
        expect(makeRectangular(bignumber, bignumber))
            .toEqual(new ComplexNumber(bignumber, bignumber));
    });
    test('boxed numbers: inexact', () => {
        expect(makeRectangular(INEXACT_ONE, INEXACT_ONE))
            .toEqual(new ComplexNumber(INEXACT_ONE, INEXACT_ONE));
        expect(makeRectangular(INEXACT_ONE, INEXACT_ZERO))
            .toEqual(new ComplexNumber(INEXACT_ONE, INEXACT_ZERO));
    });
    test('boxed numbers: exact', () => {
        expect(makeRectangular(EXACT_ONE, EXACT_ONE))
            .toEqual(new ComplexNumber(EXACT_ONE, EXACT_ONE));
        expect(makeRectangular(EXACT_ONE, EXACT_ZERO))
            .toEqual(EXACT_ONE);
    });
    test('bigints', () => {
        expect(makeRectangular(new BigExactNumber(BigInt(5), BigInt(1)), EXACT_ONE))
            .toEqual(new ComplexNumber(new BigExactNumber(5n), EXACT_ONE));
    });
    test('mixed precision', () => {
        expect(makeRectangular(INEXACT_ONE, EXACT_ONE))
            .toEqual(new ComplexNumber(INEXACT_ONE, INEXACT_ONE));
        expect(makeRectangular(EXACT_ONE, INEXACT_ONE))
            .toEqual(new ComplexNumber(INEXACT_ONE, INEXACT_ONE));
    });
});

describe('makePolar', () => {
    test('racket docs examples', () => {
        expect(makePolar(10, multiply(PI, EXACT_HALF)))
            .toEqual(new ComplexNumber(new InexactNumber(6.123233995736766e-16),
                                       new InexactNumber(10)));
        expect(makePolar(10, multiply(PI, new SmallExactNumber(1, 4))))
            .toEqual(new ComplexNumber(new InexactNumber(7.0710678118654755),
                                       new InexactNumber(7.071067811865475)));
    });
    test('unboxed', () => {
        expect(makePolar(3, 4))
            .toEqual(new ComplexNumber(new InexactNumber(-1.960930862590836),
                                       new InexactNumber(-2.2704074859237844)));
        expect(makePolar(3, -4))
            .toEqual(new ComplexNumber(new InexactNumber(-1.960930862590836),
                                       new InexactNumber(2.2704074859237844)));
        expect(makePolar(3, EXACT_ZERO))
            .toEqual(3);
    });
    test('big numbers', () => {
        const bignumber = new BigExactNumber(BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2));
        expect(makePolar(bignumber, bignumber))
            .toEqual(new ComplexNumber(new InexactNumber(-4760410950687404.0),
                                       new InexactNumber(-7646445317608838.0)));
        expect(makePolar(new BigExactNumber(BigInt(5), BigInt(1)), EXACT_ONE))
            .toEqual(new ComplexNumber(new InexactNumber(2.701511529340699),
                                       new InexactNumber(4.207354924039483)));
    })
    test('boxed numbers: inexact', () => {
        expect(makePolar(INEXACT_ONE, INEXACT_ONE))
            .toEqual(new ComplexNumber(new InexactNumber(0.5403023058681398),
                                       new InexactNumber(0.84147098480789651)));
        expect(makePolar(INEXACT_ONE, INEXACT_ZERO))
            .toEqual(new ComplexNumber(INEXACT_ONE, INEXACT_ZERO));
    });
    test('boxed numbers: exact', () => {
        expect(makePolar(EXACT_ONE, EXACT_ONE))
            .toEqual(new ComplexNumber(new InexactNumber(0.5403023058681398),
                                       new InexactNumber(0.84147098480789651)));
        expect(makePolar(EXACT_ONE, EXACT_ZERO))
            .toEqual(EXACT_ONE);
    });
    test('mixed precision', () => {
        expect(makePolar(INEXACT_ONE, EXACT_ONE))
            .toEqual(new ComplexNumber(new InexactNumber(0.5403023058681398),
                                       new InexactNumber(0.84147098480789651)));
        expect(makePolar(EXACT_ONE, INEXACT_ONE))
            .toEqual(new ComplexNumber(new InexactNumber(0.5403023058681398),
                                       new InexactNumber(0.84147098480789651)));
    });
});

describe('magnitude', () => {
    test('racket docs examples', () => {
        expect(magnitude(new SmallExactNumber(-3)))
            .toEqual(new SmallExactNumber(3));
        expect(magnitude(new InexactNumber(3)))
            .toEqual(3);
        expect(magnitude(new ComplexNumber(new SmallExactNumber(3),
                                           new SmallExactNumber(4))))
            .toEqual(new SmallExactNumber(5));
    });
    test('infinity', () => {
        expect(magnitude(new ComplexNumber(INF,
                                           new SmallExactNumber(5))))
            .toEqual(INF);
        expect(magnitude(new ComplexNumber(new SmallExactNumber(5), INF)))
            .toEqual(INF);
        expect(magnitude(new ComplexNumber(NEG_INF,
                                           new SmallExactNumber(5))))
            .toEqual(INF);
        expect(magnitude(new ComplexNumber(new SmallExactNumber(5), NEG_INF)))
            .toEqual(INF);
    });
    test('bigints', () => {
        expect(magnitude(new BigExactNumber(BigInt(5))))
            .toEqual(new BigExactNumber(BigInt(5)));
    });
});

describe('angle', () => {
    test('racket docs examples', () => {
        expect(angle(new SmallExactNumber(-3)))
            .toEqual(Math.PI);
        expect(angle(EXACT_NEG_ONE))
            .toEqual(Math.PI);
        expect(angle(new InexactNumber(3)))
            .toEqual(EXACT_ZERO);
        expect(angle(new ComplexNumber(new SmallExactNumber(3),
                                       new SmallExactNumber(4))))
            .toEqual(0.9272952180016122);
        expect(angle(new ComplexNumber(INF, INF)))
            .toEqual(0.7853981633974483);
    });
    test('infinity', () => {
        expect(angle(new ComplexNumber(INF, NEG_INF)))
            .toEqual(-0.7853981633974483);
        expect(angle(new ComplexNumber(NEG_INF, NEG_INF)))
            .toEqual(-2.356194490192345);
        expect(angle(new ComplexNumber(NEG_INF, INF)))
            .toEqual(2.356194490192345);

        expect(angle(new ComplexNumber(INF, new SmallExactNumber(5))))
            .toEqual(0);
        expect(angle(new ComplexNumber(INF, new SmallExactNumber(-5))))
            .toEqual(-0);
        expect(angle(new ComplexNumber(new SmallExactNumber(5), INF)))
            .toEqual(1.5707963267948966);
        expect(angle(new ComplexNumber(new SmallExactNumber(-5), INF)))
            .toEqual(1.5707963267948966);

        expect(angle(new ComplexNumber(NEG_INF,
                                       new InexactNumber(5))))
            .toEqual(Math.PI);
        expect(angle(new ComplexNumber(NEG_INF,
                                       new InexactNumber(-5))))
            .toEqual(-Math.PI);
        expect(angle(new ComplexNumber(new InexactNumber(5), NEG_INF)))
            .toEqual(-1.5707963267948966);
        expect(angle(new ComplexNumber(new InexactNumber(-5), NEG_INF)))
            .toEqual(-1.5707963267948966);
    });
    test('bigints', () => {
        expect(angle(new BigExactNumber(5n)))
            .toEqual(EXACT_ZERO);
    });
});

describe('realPart', () => {
    test('racket docs examples', () => {
        expect(realPart(new ComplexNumber(new SmallExactNumber(3),
                                          new SmallExactNumber(4))))
            .toEqual(new SmallExactNumber(3));
        expect(realPart(new ComplexNumber(new InexactNumber(3), new InexactNumber(4))))
            .toEqual(3);
        expect(realPart(new InexactNumber(5)))
            .toEqual(5);
    });
    test('infinity', () => {
        expect(realPart(new ComplexNumber(INF, NEG_INF)))
            .toEqual(Infinity);
        expect(realPart(new ComplexNumber(NEG_INF, NEG_INF)))
            .toEqual(-Infinity);
        expect(realPart(new ComplexNumber(NEG_INF, INF)))
            .toEqual(-Infinity);
    });
    test('bigints', () => {
        expect(realPart(new BigExactNumber(5n)))
            .toEqual(new BigExactNumber(5n));
    });
});

describe('imaginaryPart', () => {
    test('racket docs examples', () => {
        expect(imaginaryPart(new ComplexNumber(new SmallExactNumber(3),
                                               new SmallExactNumber(4))))
            .toEqual(new SmallExactNumber(4));
        expect(imaginaryPart(new ComplexNumber(new InexactNumber(3), new InexactNumber(4))))
            .toEqual(4);
        expect(imaginaryPart(new InexactNumber(5)))
            .toEqual(EXACT_ZERO);
        expect(imaginaryPart(new ComplexNumber(new InexactNumber(5), INEXACT_ZERO)))
            .toEqual(0);
    });
    test('infinity', () => {
        expect(imaginaryPart(new ComplexNumber(INF, NEG_INF)))
            .toEqual(-Infinity);
        expect(imaginaryPart(new ComplexNumber(NEG_INF, INF)))
            .toEqual(Infinity);
    });
    test('bigints', () => {
        expect(imaginaryPart(new BigExactNumber(BigInt(5), BigInt(1))))
            .toEqual(EXACT_ZERO);
    });
});

describe('conjugate', () => {
    test('racket docs examples', () => {
        expect(conjugate(EXACT_ONE))
            .toEqual(EXACT_ONE);
        expect(conjugate(new ComplexNumber(new SmallExactNumber(3),
                                           new SmallExactNumber(4))))
            .toEqual(new ComplexNumber(new SmallExactNumber(3),
                                       new SmallExactNumber(-4)));
        expect(conjugate(new ComplexNumber(new InexactNumber(3),
                                           new InexactNumber(4))))
            .toEqual(new ComplexNumber(new InexactNumber(3),
                                       new InexactNumber(-4)));
    });
    test('infinity', () => {
        expect(conjugate(new ComplexNumber(INF, NEG_INF)))
            .toEqual(new ComplexNumber(INF, INF));
        expect(conjugate(new ComplexNumber(INF, INF)))
            .toEqual(new ComplexNumber(INF, NEG_INF));
    });
    test('bigints', () => {
        expect(conjugate(new BigExactNumber(5n)))
            .toEqual(new BigExactNumber(5n));
    });
});
