import {describe, expect, test} from '@jest/globals';
import {
    BoxedNumber,
    EXACT_ONE,
    EXACT_NEG_ONE,
    EXACT_HALF,
    EXACT_ZERO,
    INEXACT_ONE,
    INEXACT_ZERO,
    PI,
    INF,
    makeRectangular,
    makePolar,
    multiply,
    magnitude,
    angle,
    realPart,
    imaginaryPart,
    conjugate
} from '../src/tower';

const makeInstance = BoxedNumber.makeInstance;

describe('makeRectangular', () => {
    test('racket docs examples', () => {
        expect(makeRectangular(3, makeInstance({num: 4})))
        .toEqual(makeInstance({num: 3, imagNum: 4}));
    });
    test('fixnums', () => {
        expect(makeRectangular(3, 4))
            .toEqual(makeInstance({num: 3, den: 1, imagNum: 4, imagDen: 1}));
        expect(makeRectangular(3, -4))
            .toEqual(makeInstance(({num: 3, den: 1, imagNum: -4, imagDen: 1})));
        expect(makeRectangular(3, 0))
            .toBe(3);

        const bignumber = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2);
        expect(makeRectangular(bignumber, bignumber))
            .toEqual(makeInstance({num: bignumber,
                                   den: BigInt(1),
                                   imagNum: bignumber,
                                   imagDen: BigInt(1)}));
        expect(makeRectangular(3, BigInt(0)))
            .toBe(3);
        expect(makeRectangular(BigInt(3), 0))
            .toBe(3);
    });
    test('boxed numbers: inexact', () => {
        expect(makeRectangular(INEXACT_ONE, INEXACT_ONE))
            .toEqual(makeInstance({num: 1, imagNum: 1}));
        expect(makeRectangular(INEXACT_ONE, INEXACT_ZERO))
            .toEqual(makeInstance({num: 1, imagNum: 0}));
    });
    test('boxed numbers: exact', () => {
        expect(makeRectangular(EXACT_ONE, EXACT_ONE))
            .toEqual(makeInstance({num: 1, den: 1, imagNum: 1, imagDen: 1}));
        expect(makeRectangular(EXACT_ONE, EXACT_ZERO))
            .toBe(1);
    });
    test('bigints', () => {
        expect(makeRectangular(makeInstance({num: BigInt(5), den: BigInt(1)}), 1))
            .toEqual(makeInstance({num: 5, den: 1, imagNum: 1, imagDen: 1}));
    });
    test('mixed precision', () => {
        expect(makeRectangular(INEXACT_ONE, EXACT_ONE))
            .toEqual(makeInstance({num: 1, imagNum: 1}));
        expect(makeRectangular(EXACT_ONE, INEXACT_ONE))
            .toEqual(makeInstance({num: 1, imagNum: 1}));
    });
});

describe('makeRectangular', () => {
    test('racket docs examples', () => {
        expect(makePolar(10, multiply(PI, EXACT_HALF)))
        .toEqual(makeInstance({num: 6.123233995736766e-16, imagNum: 10}));
        expect(makePolar(10, multiply(PI, makeInstance({num: 1, den: 4}))))
        .toEqual(makeInstance({num: 7.0710678118654755, imagNum: 7.071067811865475}));
    });
    test('fixnums', () => {
        expect(makePolar(3, 4))
            .toEqual(makeInstance({num: -1.960930862590836, imagNum: -2.2704074859237844}));
        expect(makePolar(3, -4))
            .toEqual(makeInstance({num: -1.960930862590836, imagNum: 2.2704074859237844}));
        expect(makePolar(3, 0))
            .toBe(3);

        const bignumber = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2);
        expect(makePolar(bignumber, bignumber))
            .toEqual(makeInstance({num: -4760410950687404.0,
                                   imagNum: -7646445317608838.0}));
        expect(makePolar(3, BigInt(0)))
            .toBe(3);
        expect(makePolar(BigInt(3), 0))
            .toBe(3);
    });
    test('boxed numbers: inexact', () => {
        expect(makePolar(INEXACT_ONE, INEXACT_ONE))
            .toEqual(makeInstance({num: 0.5403023058681398, imagNum: 0.84147098480789651}));
        expect(makePolar(INEXACT_ONE, INEXACT_ZERO))
            .toEqual(makeInstance({num: 1, imagNum: 0}));
    });
    test('boxed numbers: exact', () => {
        expect(makePolar(EXACT_ONE, EXACT_ONE))
            .toEqual(makeInstance({num: 0.5403023058681398, imagNum: 0.84147098480789651}));
        expect(makePolar(EXACT_ONE, EXACT_ZERO))
            .toBe(1);
    });
    test('bigints', () => {
        expect(makePolar(makeInstance({num: BigInt(5), den: BigInt(1)}), 1))
            .toEqual(makeInstance({num: 2.701511529340699, imagNum: 4.207354924039483}));
    });
    test('mixed precision', () => {
        expect(makePolar(INEXACT_ONE, EXACT_ONE))
            .toEqual(makeInstance({num: 0.5403023058681398, imagNum: 0.84147098480789651}));
        expect(makePolar(EXACT_ONE, INEXACT_ONE))
            .toEqual(makeInstance({num: 0.5403023058681398, imagNum: 0.84147098480789651}));
    });
});

describe('magnitude', () => {
    test('racket docs examples', () => {
        expect(magnitude(-3)).toBe(3);
        expect(magnitude(makeInstance({num: 3})))
            .toEqual(makeInstance({num: 3}));
        expect(magnitude(makeInstance({num: 3, den: 1, imagNum: 4, imagDen: 1})))
            .toEqual(5);
    });
    test('infinity', () => {
        expect(magnitude(makeInstance({num: Infinity, imagNum: 5})))
            .toEqual(INF);
        expect(magnitude(makeInstance({num: 5, imagNum: Infinity})))
            .toEqual(INF);
        expect(magnitude(makeInstance({num: -Infinity, imagNum: 5})))
            .toEqual(INF);
        expect(magnitude(makeInstance({num: 5, imagNum: -Infinity})))
            .toEqual(INF);
    });
    test('bigints', () => {
        expect(magnitude(makeInstance({num: BigInt(5), den: BigInt(1)})))
            .toBe(5);
    });
});

describe('angle', () => {
    test('racket docs examples', () => {
        expect(angle(-3))
            .toEqual(PI);
        expect(angle(-1))
            .toEqual(PI);
        expect(angle(makeInstance({num: 3})))
            .toBe(0);
        expect(angle(makeInstance({num: 3, den: 1, imagNum: 4, imagDen: 1})))
            .toEqual(makeInstance({num: 0.9272952180016122}));
        expect(angle(makeInstance({num: Infinity, imagNum: Infinity})))
            .toEqual(makeInstance({num: 0.7853981633974483}));
    });
    test('infinity', () => {
        expect(angle(makeInstance({num: Infinity, imagNum: -Infinity})))
            .toEqual(makeInstance({num: -0.7853981633974483}));
        expect(angle(makeInstance({num: -Infinity, imagNum: -Infinity})))
            .toEqual(makeInstance({num: -2.356194490192345}));
        expect(angle(makeInstance({num: -Infinity, imagNum: Infinity})))
            .toEqual(makeInstance({num: 2.356194490192345}));

        expect(angle(makeInstance({num: Infinity, imagNum: 5})))
            .toEqual(INEXACT_ZERO);
        expect(angle(makeInstance({num: Infinity, imagNum: -5})))
            .toEqual(makeInstance({num: -0}));
        expect(angle(makeInstance({num: 5, imagNum: Infinity})))
            .toEqual(makeInstance({num: 1.5707963267948966}));
        expect(angle(makeInstance({num: -5, imagNum: Infinity})))
            .toEqual(makeInstance({num: 1.5707963267948966}));

        expect(angle(makeInstance({num: -Infinity, imagNum: 5})))
            .toEqual(PI);
        expect(angle(makeInstance({num: -Infinity, imagNum: -5})))
            .toEqual(PI.multiply(EXACT_NEG_ONE));
        expect(angle(makeInstance({num: 5, imagNum: -Infinity})))
            .toEqual(makeInstance({num: -1.5707963267948966}));
        expect(angle(makeInstance({num: -5, imagNum: -Infinity})))
            .toEqual(makeInstance({num: -1.5707963267948966}));
    });
    test('bigints', () => {
        expect(angle(makeInstance({num: BigInt(5), den: BigInt(1)})))
            .toBe(0);
    });
});

describe('realPart', () => {
    test('racket docs examples', () => {
        expect(realPart(makeInstance({num: 3, den: 1, imagNum: 4, imagDen: 1})))
            .toEqual(3);
        expect(realPart(makeInstance({num: 3, imagNum: 4})))
            .toEqual(makeInstance({num: 3}));
        expect(realPart(makeInstance({num: 5})))
            .toEqual(makeInstance({num: 5}));
    });
    test('infinity', () => {
        expect(realPart(makeInstance({num: Infinity, imagNum: -Infinity})))
            .toEqual(makeInstance({num: Infinity}));
        expect(realPart(makeInstance({num: -Infinity, imagNum: -Infinity})))
            .toEqual(makeInstance({num: -Infinity}));
        expect(realPart(makeInstance({num: -Infinity, imagNum: Infinity})))
            .toEqual(makeInstance({num: -Infinity}));
    });
    test('bigints', () => {
        expect(realPart(makeInstance({num: BigInt(5), den: BigInt(1)})))
            .toBe(5);
    });
});

describe('imaginaryPart', () => {
    test('racket docs examples', () => {
        expect(imaginaryPart(makeInstance({num: 3, den: 1, imagNum: 4, imagDen: 1})))
            .toEqual(4);
        expect(imaginaryPart(makeInstance({num: 3, imagNum: 4})))
            .toEqual(makeInstance({num: 4}));
        expect(imaginaryPart(makeInstance({num: 5})))
            .toEqual(0);
        expect(imaginaryPart(makeInstance({num: 5, imagNum: 0})))
            .toEqual(INEXACT_ZERO);
    });
    test('infinity', () => {
        expect(imaginaryPart(makeInstance({num: Infinity, imagNum: -Infinity})))
            .toEqual(makeInstance({num: -Infinity}));
        expect(imaginaryPart(makeInstance({num: -Infinity, imagNum: Infinity})))
            .toEqual(makeInstance({num: Infinity}));
    });
    test('bigints', () => {
        expect(imaginaryPart(makeInstance({num: BigInt(5), den: BigInt(1)})))
            .toBe(0);
    });
});

describe('conjugate', () => {
    test('racket docs examples', () => {
        expect(conjugate(1)).toBe(1);
        expect(conjugate(makeInstance({num: 3, den: 1, imagNum: 4, imagDen: 1})))
            .toEqual(makeInstance({num: 3, den: 1, imagNum: -4, imagDen: 1}));
        expect(conjugate(makeInstance({num: 3, imagNum: 4})))
            .toEqual(makeInstance({num: 3, imagNum: -4}));
    });
    test('infinity', () => {
        expect(conjugate(makeInstance({num: Infinity, imagNum: -Infinity})))
            .toEqual(makeInstance({num: Infinity, imagNum: Infinity}));
        expect(conjugate(makeInstance({num: Infinity, imagNum: Infinity})))
            .toEqual(makeInstance({num: Infinity, imagNum: -Infinity}));
    });
    test('bigints', () => {
        expect(conjugate(makeInstance({num: BigInt(5), den: BigInt(1)})))
            .toBe(5);
    });
});
