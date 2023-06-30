import {
    InexactNumber,
    BigExactNumber,
    makeComplexNumber,
    EXACT_I,
    EXACT_NEG_I,
    EXACT_ONE,
    EXACT_HALF,
    EXACT_ZERO,
    INEXACT_ZERO,
    INEXACT_ONE,
    INEXACT_HALF,
    NAN,
    INF,
    equals,
    approxEquals,
    greaterThan,
    greaterThanOrEqual,
    lessThan,
    lessThanOrEqual,
} from '../src/tower';

const makeInstance = makeComplexNumber;

describe('equals', () => {
    test('racket docs examples', () => {
        expect(equals(1)).toBe(true);
        expect(equals(1, new InexactNumber(1))).toBe(true);
        expect(equals(1, 2)).toBe(false);

        const x = makeInstance({num: 2, den: 1, imagNum: 3, imagDen: 1});
        expect(equals(x, x, x)).toBe(true);
    });
    test('fixnums', () => {
        expect(equals(5, 5)).toBe(true);
        expect(equals(5, BigInt(5))).toBe(true);
        expect(equals(3, 5)).toBe(false);
    });
    test('boxed numbers: exact', () => {
        expect(equals(EXACT_ONE, EXACT_ONE)).toBe(true);
        expect(equals(EXACT_ZERO, EXACT_ONE)).toBe(false);
    });
    test('boxed numbers: inexact', () => {
        expect(equals(INEXACT_ONE, INEXACT_ONE)).toBe(true);
        expect(equals(INEXACT_ZERO, INEXACT_ONE)).toBe(false);
    });
    test('boxed numbers: complex', () => {
        expect(equals(EXACT_I, EXACT_I)).toBe(true);
        expect(equals(EXACT_NEG_I, EXACT_I)).toBe(false);
    });
    test('bigint', () => {
        const big3 = new BigExactNumber(BigInt(3), BigInt(1));
        const big5 = new BigExactNumber(BigInt(5), BigInt(1));
        expect(equals(big5, big5)).toBe(true);
        expect(equals(big3, big5)).toBe(false);
    });
    test('multi-arity', () => {
        const big5 = new BigExactNumber(BigInt(5), BigInt(1));
        const small5 = new InexactNumber(5);
        expect(equals(5, small5, big5)).toBe(true);
        expect(equals(3, small5, big5)).toBe(false);
    });
    test('NaN', () => {
        expect(equals(5, NAN)).toBe(false);
        expect(equals(NAN, NAN)).toBe(false);
    });
});

describe('approxEquals', () => {
    test('fixnums', () => {
        expect(approxEquals(5, 6, 1)).toBe(true);
        expect(approxEquals(5, BigInt(5), 1)).toBe(true);
        expect(approxEquals(3, 5, 1)).toBe(false);
    });
    test('boxed numbers: exact', () => {
        expect(approxEquals(EXACT_ONE, EXACT_ONE, 0)).toBe(true);
        expect(approxEquals(EXACT_ZERO, EXACT_ONE, EXACT_HALF)).toBe(false);
    });
    test('boxed numbers: inexact', () => {
        expect(approxEquals(INEXACT_ONE, INEXACT_ONE, INEXACT_ZERO)).toBe(true);
        expect(approxEquals(INEXACT_ZERO, INEXACT_ONE, INEXACT_HALF)).toBe(false);
    });
    test('bigint', () => {
        const big3 = new BigExactNumber(BigInt(3), BigInt(1));
        const big5 = new BigExactNumber(BigInt(5), BigInt(1));
        expect(approxEquals(big5, big5, BigInt(0))).toBe(true);
        expect(approxEquals(big3, big5, BigInt(2))).toBe(true);
        expect(approxEquals(big3, big5, BigInt(1))).toBe(false);
    });
});

describe('lessThan', () => {
    test('racket docs examples', () => {
        expect(lessThan(1)).toBe(true);
        expect(lessThan(1, 1)).toBe(false);
        expect(lessThan(1, 2, 3)).toBe(true);
        expect(lessThan(1, INF)).toBe(true);
        expect(lessThan(1, NAN)).toBe(false);
    });
    test('fixnums', () => {
        expect(lessThan(5, 5)).toBe(false);
        expect(lessThan(5, BigInt(5))).toBe(false);
        expect(lessThan(5, BigInt(6))).toBe(true);
        expect(lessThan(3, 5)).toBe(true);
    });
    test('boxed numbers: exact', () => {
        expect(lessThan(EXACT_ONE, EXACT_ONE)).toBe(false);
        expect(lessThan(EXACT_ZERO, EXACT_ONE)).toBe(true);
        expect(lessThan(EXACT_ONE, EXACT_ZERO)).toBe(false);
    });
    test('boxed numbers: inexact', () => {
        expect(lessThan(INEXACT_ONE, INEXACT_ONE)).toBe(false);
        expect(lessThan(INEXACT_ZERO, INEXACT_ONE)).toBe(true);
        expect(lessThan(INEXACT_ONE, INEXACT_ZERO)).toBe(false);
    });
    test('bigint', () => {
        const big3 = new BigExactNumber(BigInt(3), BigInt(1));
        const big5 = new BigExactNumber(BigInt(5), BigInt(1));
        expect(lessThan(big5, big5)).toBe(false);
        expect(lessThan(big3, big5)).toBe(true);
        expect(lessThan(big5, big3)).toBe(false);
    });
    test('multi-arity', () => {
        const big5 = new BigExactNumber(BigInt(5), BigInt(1));
        const small5 = new InexactNumber(5);
        expect(lessThan(5, small5, big5)).toBe(false);
        expect(lessThan(3, small5, 6)).toBe(true);
    });
    test('NaN', () => {
        expect(lessThan(5, NAN)).toBe(false);
        expect(lessThan(NAN, 5)).toBe(false);
        expect(lessThan(NAN, NAN)).toBe(false);
    });
});

describe('lessThanOrEqual', () => {
    test('racket docs examples', () => {
        expect(lessThanOrEqual(1)).toBe(true);
        expect(lessThanOrEqual(1, 1)).toBe(true);
        expect(lessThanOrEqual(1, 2, 3)).toBe(true);
        expect(lessThanOrEqual(1, 2, 1)).toBe(false);
        expect(lessThanOrEqual(1, INF)).toBe(true);
        expect(lessThanOrEqual(1, NAN)).toBe(false);
    });
    test('fixnums', () => {
        expect(lessThanOrEqual(5, 5)).toBe(true);
        expect(lessThanOrEqual(5, BigInt(5))).toBe(true);
        expect(lessThanOrEqual(5, BigInt(6))).toBe(true);
        expect(lessThanOrEqual(3, 5)).toBe(true);
    });
    test('boxed numbers: exact', () => {
        expect(lessThanOrEqual(EXACT_ONE, EXACT_ONE)).toBe(true);
        expect(lessThanOrEqual(EXACT_ZERO, EXACT_ONE)).toBe(true);
        expect(lessThanOrEqual(EXACT_ONE, EXACT_ZERO)).toBe(false);
    });
    test('boxed numbers: inexact', () => {
        expect(lessThanOrEqual(INEXACT_ONE, INEXACT_ONE)).toBe(true);
        expect(lessThanOrEqual(INEXACT_ZERO, INEXACT_ONE)).toBe(true);
        expect(lessThanOrEqual(INEXACT_ONE, INEXACT_ZERO)).toBe(false);
    });
    test('bigint', () => {
        const big3 = new BigExactNumber(BigInt(3), BigInt(1));
        const big5 = new BigExactNumber(BigInt(5), BigInt(1));
        expect(lessThanOrEqual(big5, big5)).toBe(true);
        expect(lessThanOrEqual(big3, big5)).toBe(true);
        expect(lessThanOrEqual(big5, big3)).toBe(false);
    });
    test('multi-arity', () => {
        const big5 = new BigExactNumber(BigInt(5), BigInt(1));
        const small5 = new InexactNumber(5);
        expect(lessThanOrEqual(5, small5, big5)).toBe(true);
        expect(lessThanOrEqual(3, small5, 6)).toBe(true);
    });
    test('NaN', () => {
        expect(lessThanOrEqual(5, NAN)).toBe(false);
        expect(lessThanOrEqual(NAN, 5)).toBe(false);
        expect(lessThanOrEqual(NAN, NAN)).toBe(false);
    });
});

describe('greaterThan', () => {
    test('racket docs examples', () => {
        expect(greaterThan(1)).toBe(true);
        expect(greaterThan(1, 1)).toBe(false);
        expect(greaterThan(3, 2, 1)).toBe(true);
        expect(greaterThan(INF, 1)).toBe(true);
        expect(greaterThan(NAN, 1)).toBe(false);
    });
    test('fixnums', () => {
        expect(greaterThan(5, 5)).toBe(false);
        expect(greaterThan(5, BigInt(5))).toBe(false);
        expect(greaterThan(5, BigInt(6))).toBe(false);
        expect(greaterThan(3, 5)).toBe(false);
        expect(greaterThan(5, 3)).toBe(true);
    });
    test('boxed numbers: exact', () => {
        expect(greaterThan(EXACT_ONE, EXACT_ONE)).toBe(false);
        expect(greaterThan(EXACT_ZERO, EXACT_ONE)).toBe(false);
        expect(greaterThan(EXACT_ONE, EXACT_ZERO)).toBe(true);
    });
    test('boxed numbers: inexact', () => {
        expect(greaterThan(INEXACT_ONE, INEXACT_ONE)).toBe(false);
        expect(greaterThan(INEXACT_ZERO, INEXACT_ONE)).toBe(false);
        expect(greaterThan(INEXACT_ONE, INEXACT_ZERO)).toBe(true);
    });
    test('bigint', () => {
        const big3 = new BigExactNumber(BigInt(3), BigInt(1));
        const big5 = new BigExactNumber(BigInt(5), BigInt(1));
        expect(greaterThan(big5, big5)).toBe(false);
        expect(greaterThan(big3, big5)).toBe(false);
        expect(greaterThan(big5, big3)).toBe(true);
    });
    test('multi-arity', () => {
        const big5 = new BigExactNumber(BigInt(5), BigInt(1));
        const small5 = new InexactNumber(5);
        expect(greaterThan(5, small5, big5)).toBe(false);
        expect(greaterThan(6, small5, 3)).toBe(true);
        expect(greaterThan(3, small5, 6)).toBe(false);
    });
    test('NaN', () => {
        expect(greaterThan(5, NAN)).toBe(false);
        expect(greaterThan(NAN, 5)).toBe(false);
        expect(greaterThan(NAN, NAN)).toBe(false);
    });
});

describe('greaterThanOrEqual', () => {
    test('racket docs examples', () => {
        expect(greaterThanOrEqual(1)).toBe(true);
        expect(greaterThanOrEqual(1, 1)).toBe(true);
        expect(greaterThanOrEqual(3, 2, 1)).toBe(true);
        expect(greaterThanOrEqual(1, 2, 1)).toBe(false);
        expect(greaterThanOrEqual(INF, 1)).toBe(true);
        expect(greaterThanOrEqual(NAN, 1)).toBe(false);
    });
    test('fixnums', () => {
        expect(greaterThanOrEqual(5, 5)).toBe(true);
        expect(greaterThanOrEqual(5, BigInt(5))).toBe(true);
        expect(greaterThanOrEqual(5, BigInt(6))).toBe(false);
        expect(greaterThanOrEqual(3, 5)).toBe(false);
        expect(greaterThanOrEqual(5, 3)).toBe(true);
    });
    test('boxed numbers: exact', () => {
        expect(greaterThanOrEqual(EXACT_ONE, EXACT_ONE)).toBe(true);
        expect(greaterThanOrEqual(EXACT_ZERO, EXACT_ONE)).toBe(false);
        expect(greaterThanOrEqual(EXACT_ONE, EXACT_ZERO)).toBe(true);
    });
    test('boxed numbers: inexact', () => {
        expect(greaterThanOrEqual(INEXACT_ONE, INEXACT_ONE)).toBe(true);
        expect(greaterThanOrEqual(INEXACT_ZERO, INEXACT_ONE)).toBe(false);
        expect(greaterThanOrEqual(INEXACT_ONE, INEXACT_ZERO)).toBe(true);
    });
    test('bigint', () => {
        const big3 = new BigExactNumber(BigInt(3), BigInt(1));
        const big5 = new BigExactNumber(BigInt(5), BigInt(1));
        expect(greaterThanOrEqual(big5, big5)).toBe(true);
        expect(greaterThanOrEqual(big3, big5)).toBe(false);
        expect(greaterThanOrEqual(big5, big3)).toBe(true);
    });
    test('multi-arity', () => {
        const big5 = new BigExactNumber(BigInt(5), BigInt(1));
        const small5 = new InexactNumber(5);
        expect(greaterThanOrEqual(5, small5, big5)).toBe(true);
        expect(greaterThanOrEqual(3, small5, 6)).toBe(false);
        expect(greaterThanOrEqual(6, small5, 3)).toBe(true);
    });
    test('NaN', () => {
        expect(greaterThanOrEqual(5, NAN)).toBe(false);
        expect(greaterThanOrEqual(NAN, 5)).toBe(false);
        expect(greaterThanOrEqual(NAN, NAN)).toBe(false);
    });
});
