import {describe, expect, test} from '@jest/globals';
import {
    BoxedNumber,
    NEG_ONE,
    ZERO,
    ONE,
    TWO,
    I,
    INF,
    NEG_INF,
    NAN,
    isNumber,
    isComplex,
    isReal,
    isRational,
    isInteger,
    isExactInteger,
    isExactNonNegativeInteger,
    isExactPositiveInteger,
    isInexactReal,
    isFixnum,
    isFlonum,
    isZero,
    isPositive,
    isNegative,
    isEven,
    isOdd,
    isExact,
    isInexact
} from '../src/tower';

const makeInstance = BoxedNumber.makeInstance;

describe('isNumber()', () => {
    test('Non-number', () => {
        expect(isNumber("Not a number")).toBe(false);
    });
    test('Unboxed number: number', () => {
        expect(isNumber(10)).toBe(true);
    });
    test('Unboxed number: bigint', () => {
        expect(isNumber(BigInt(10))).toBe(true);
    });
    test('Boxed number: Integer', () => {
        expect(isNumber(ZERO)).toBe(true);
    });
    test('Boxed number: Rational', () => {
        expect(isNumber(makeInstance({num: 1.5}))).toBe(true);
    });
    test('Boxed number: Real', () => {
        expect(isNumber(INF)).toBe(true);
    });
    test('Boxed number: NAN', () => {
        expect(isNumber(NAN)).toBe(true);
    });
    test('Boxed number: Complex', () => {
        expect(isNumber(I)).toBe(true);
    });
});

describe('isComplex()', () => {
    test('Non-number', () => {
        expect(isComplex("Not a number")).toBe(false);
    });
    test('Unboxed number: number', () => {
        expect(isComplex(10)).toBe(true);
    });
    test('Unboxed number: bigint', () => {
        expect(isComplex(BigInt(10))).toBe(true);
    });
    test('Boxed number: Integer', () => {
        expect(isComplex(ZERO)).toBe(true);
    });
    test('Boxed number: Rational', () => {
        expect(isComplex(makeInstance({num: 1.5}))).toBe(true);
    });
    test('Boxed number: Real', () => {
        expect(isComplex(INF)).toBe(true);
    });
    test('Boxed number: NAN', () => {
        expect(isComplex(NAN)).toBe(true);
    });
    test('Boxed number: Complex', () => {
        expect(isComplex(I)).toBe(true);
    });
});

describe('isReal()', () => {
    test('Non-number', () => {
        expect(isReal("Not a number")).toBe(false);
    });
    test('Unboxed number: number', () => {
        expect(isReal(10)).toBe(true);
    });
    test('Unboxed number: bigint', () => {
        expect(isReal(BigInt(10))).toBe(true);
    });
    test('Boxed number: Integer', () => {
        expect(isReal(ZERO)).toBe(true);
    });
    test('Boxed number: Rational', () => {
        expect(isReal(makeInstance({num: 1.5}))).toBe(true);
    });
    test('Boxed number: Real', () => {
        expect(isReal(INF)).toBe(true);
    });
    test('Boxed number: NAN', () => {
        expect(isReal(NAN)).toBe(true);
    });
    test('Boxed number: Complex', () => {
        expect(isReal(I)).toBe(false);
    });
});

describe('isRational()', () => {
    test('Non-number', () => {
        expect(isRational("Not a number")).toBe(false);
    });
    test('Unboxed number: number', () => {
        expect(isRational(10)).toBe(true);
    });
    test('Unboxed number: bigint', () => {
        expect(isRational(BigInt(10))).toBe(true);
    });
    test('Boxed number: Integer', () => {
        expect(isRational(ZERO)).toBe(true);
    });
    test('Boxed number: Rational', () => {
        expect(isRational(makeInstance({num: 1.5}))).toBe(true);
    });
    test('Boxed number: Real', () => {
        expect(isRational(INF)).toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isRational(NAN)).toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isRational(I)).toBe(false);
    });
});

describe('isInteger()', () => {
    test('Non-number', () => {
        expect(isInteger("Not a number")).toBe(false);
    });
    test('Unboxed number: number', () => {
        expect(isInteger(10)).toBe(true);
    });
    test('Unboxed number: bigint', () => {
        expect(isInteger(BigInt(10))).toBe(true);
    });
    test('Boxed number: Integer', () => {
        expect(isInteger(ZERO)).toBe(true);
    });
    test('Boxed number: Rational', () => {
        expect(isInteger(makeInstance({num: 1.5}))).toBe(false);
    });
    test('Boxed number: Real', () => {
        expect(isInteger(INF)).toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isInteger(NAN)).toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isInteger(I)).toBe(false);
    });
});

describe('isExactInteger()', () => {
    test('Non-number', () => {
        expect(isExactInteger("Not a number")).toBe(false);
    });
    test('Unboxed number: number', () => {
        expect(isExactInteger(10)).toBe(true);
    });
    test('Unboxed number: bigint', () => {
        expect(isExactInteger(BigInt(10))).toBe(true);
    });
    test('Boxed number: Exact Integer', () => {
        expect(isExactInteger(ZERO)).toBe(true);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isExactInteger(makeInstance({num: 0}))).toBe(false);
    });
    test('Boxed number: Rational', () => {
        expect(isExactInteger(makeInstance({num: 1.5}))).toBe(false);
    });
    test('Boxed number: Real', () => {
        expect(isExactInteger(INF)).toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isExactInteger(NAN)).toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isExactInteger(I)).toBe(false);
    });
});

describe('isExactNonNegativeInteger()', () => {
    test('Non-number', () => {
        expect(isExactNonNegativeInteger("Not a number")).toBe(false);
    });
    test('Unboxed number: number', () => {
        expect(isExactNonNegativeInteger(10)).toBe(true);
    });
    test('Unboxed number: bigint', () => {
        expect(isExactNonNegativeInteger(BigInt(10))).toBe(true);
    });
    test('Boxed number: Exact Positive Integer', () => {
        expect(isExactNonNegativeInteger(ONE)).toBe(true);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isExactNonNegativeInteger(ZERO)).toBe(true);
    });
    test('Boxed number: Negative Exact Integer', () => {
        expect(isExactNonNegativeInteger(NEG_ONE)).toBe(false);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isExactNonNegativeInteger(makeInstance({num: 0}))).toBe(false);
    });
    test('Boxed number: Rational', () => {
        expect(isExactNonNegativeInteger(makeInstance({num: 1.5}))).toBe(false);
    });
    test('Boxed number: Real', () => {
        expect(isExactNonNegativeInteger(INF)).toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isExactNonNegativeInteger(NAN)).toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isExactNonNegativeInteger(I)).toBe(false);
    });
});

describe('isExactPositiveInteger()', () => {
    test('Non-number', () => {
        expect(isExactPositiveInteger("Not a number")).toBe(false);
    });
    test('Unboxed number: number', () => {
        expect(isExactPositiveInteger(10)).toBe(true);
    });
    test('Unboxed number: bigint', () => {
        expect(isExactPositiveInteger(BigInt(10))).toBe(true);
    });
    test('Boxed number: Exact Positive Integer', () => {
        expect(isExactPositiveInteger(ONE)).toBe(true);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isExactPositiveInteger(ZERO)).toBe(false);
    });
    test('Boxed number: Negative Exact Integer', () => {
        expect(isExactPositiveInteger(NEG_ONE)).toBe(false);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isExactPositiveInteger(makeInstance({num: 0}))).toBe(false);
    });
    test('Boxed number: Rational', () => {
        expect(isExactPositiveInteger(makeInstance({num: 1.5}))).toBe(false);
    });
    test('Boxed number: Real', () => {
        expect(isExactPositiveInteger(INF)).toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isExactPositiveInteger(NAN)).toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isExactPositiveInteger(I)).toBe(false);
    });
});

describe('isInexactReal()', () => {
    test('Non-number', () => {
        expect(isInexactReal("Not a number")).toBe(false);
    });
    test('Unboxed number: number', () => {
        expect(isInexactReal(10)).toBe(false);
    });
    test('Unboxed number: bigint', () => {
        expect(isInexactReal(BigInt(10))).toBe(false);
    });
    test('Boxed number: Exact Integer', () => {
        expect(isInexactReal(ONE)).toBe(false);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isInexactReal(makeInstance({num: 0}))).toBe(true);
    });
    test('Boxed number: Inexact Rational', () => {
        expect(isInexactReal(makeInstance({num: 1.5}))).toBe(true);
    });
    test('Boxed number: Inexact Real', () => {
        expect(isInexactReal(INF)).toBe(true);
    });
    test('Boxed number: Exact Real', () => {
        expect(isInexactReal(makeInstance({num: 3, den: 2}))).toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isInexactReal(NAN)).toBe(true);
    });
    test('Boxed number: Complex', () => {
        expect(isInexactReal(I)).toBe(false);
    });
});

describe('isFixnum()', () => {
    test('Non-number', () => {
        expect(isFixnum("Not a number")).toBe(false);
    });
    test('Unboxed number: number', () => {
        expect(isFixnum(10)).toBe(true);
    });
    test('Unboxed number: bigint', () => {
        expect(isFixnum(BigInt(10))).toBe(true);
    });
    test('Boxed number: Exact Integer', () => {
        expect(isFixnum(ONE)).toBe(false);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isFixnum(makeInstance({num: 0}))).toBe(false);
    });
    test('Boxed number: Inexact Rational', () => {
        expect(isFixnum(makeInstance({num: 1.5}))).toBe(false);
    });
    test('Boxed number: Inexact Real', () => {
        expect(isFixnum(INF)).toBe(false);
    });
    test('Boxed number: Exact Real', () => {
        expect(isFixnum(makeInstance({num: 3, den: 2}))).toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isFixnum(NAN)).toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isFixnum(I)).toBe(false);
    });
});

describe('isFlonum()', () => {
    test('Non-number', () => {
        expect(isFlonum("Not a number")).toBe(false);
    });
    test('Unboxed number: number', () => {
        expect(isFlonum(10)).toBe(false);
    });
    test('Unboxed number: bigint', () => {
        expect(isFlonum(BigInt(10))).toBe(false);
    });
    test('Boxed number: Exact Integer', () => {
        expect(isFlonum(ONE)).toBe(false);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isFlonum(makeInstance({num: 0}))).toBe(true);
    });
    test('Boxed number: Inexact Rational', () => {
        expect(isFlonum(makeInstance({num: 1.5}))).toBe(true);
    });
    test('Boxed number: Inexact Real', () => {
        expect(isFlonum(INF)).toBe(true);
    });
    test('Boxed number: Exact Real', () => {
        expect(isFlonum(makeInstance({num: 3, den: 2}))).toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isFlonum(NAN)).toBe(true);
    });
    test('Boxed number: Complex', () => {
        expect(isFlonum(I)).toBe(false);
    });
});

describe('isZero()', () => {
    test('Unboxed number: number', () => {
        expect(isZero(10)).toBe(false);
    });
    test('Unboxed number: number zero', () => {
        expect(isZero(0)).toBe(true);
    });
    test('Unboxed number: bigint', () => {
        expect(isZero(BigInt(10))).toBe(false);
    });
    test('Unboxed number: bigint zero', () => {
        expect(isZero(BigInt(0))).toBe(true);
    });
    test('Boxed number: Exact Integer', () => {
        expect(isZero(ONE)).toBe(false);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isZero(ZERO)).toBe(true);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isZero(makeInstance({num: 1}))).toBe(false);
    });
    test('Boxed number: Inexact Zero', () => {
        expect(isZero(makeInstance({num: 0}))).toBe(true);
    });
    test('Boxed number: Inexact Rational', () => {
        expect(isZero(makeInstance({num: 1.5}))).toBe(false);
    });
    test('Boxed number: Inexact Real', () => {
        expect(isZero(INF)).toBe(false);
    });
    test('Boxed number: Exact Real', () => {
        expect(isZero(makeInstance({num: 3, den: 2}))).toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isZero(NAN)).toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isZero(I)).toBe(false);
    });
    test('Boxed number: Complex Zero', () => {
        expect(isZero(makeInstance({num: 0, imagNum: 0}))).toBe(true);
    });
});

describe('isPositive()', () => {
    test('Unboxed number: positive number', () => {
        expect(isPositive(1)).toBe(true);
    });
    test('Unboxed number: number zero', () => {
        expect(isPositive(0)).toBe(false);
    });
    test('Unboxed number: negative number', () => {
        expect(isPositive(-1)).toBe(false);
    });
    test('Unboxed number: positive bigint', () => {
        expect(isPositive(BigInt(1))).toBe(true);
    });
    test('Unboxed number: bigint zero', () => {
        expect(isPositive(BigInt(0))).toBe(false);
    });
    test('Unboxed number: negative bigint', () => {
        expect(isPositive(BigInt(-1))).toBe(false);
    });
    test('Boxed number: Exact Positive Integer', () => {
        expect(isPositive(ONE)).toBe(true);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isPositive(ZERO)).toBe(false);
    });
    test('Boxed number: Exact Negative Integer', () => {
        expect(isPositive(NEG_ONE)).toBe(false);
    });
    test('Boxed number: Inexact Positive Integer', () => {
        expect(isPositive(makeInstance({num: 1}))).toBe(true);
    });
    test('Boxed number: Inexact Zero', () => {
        expect(isPositive(makeInstance({num: 0}))).toBe(false);
    });
    test('Boxed number: Inexact Negative Integer', () => {
        expect(isPositive(makeInstance({num: -1}))).toBe(false);
    });
    test('Boxed number: Positive Infinity', () => {
        expect(isPositive(INF)).toBe(true);
    });
    test('Boxed number: Negative Infinity', () => {
        expect(isPositive(NEG_INF)).toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isPositive(NAN)).toBe(false);
    });
});

describe('isNegative()', () => {
    test('Unboxed number: positive number', () => {
        expect(isNegative(1)).toBe(false);
    });
    test('Unboxed number: number zero', () => {
        expect(isNegative(0)).toBe(false);
    });
    test('Unboxed number: negative number', () => {
        expect(isNegative(-1)).toBe(true);
    });
    test('Unboxed number: positive bigint', () => {
        expect(isNegative(BigInt(1))).toBe(false);
    });
    test('Unboxed number: bigint zero', () => {
        expect(isNegative(BigInt(0))).toBe(false);
    });
    test('Unboxed number: negative bigint', () => {
        expect(isNegative(BigInt(-1))).toBe(true);
    });
    test('Boxed number: Exact Positive Integer', () => {
        expect(isNegative(ONE)).toBe(false);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isNegative(ZERO)).toBe(false);
    });
    test('Boxed number: Exact Negative Integer', () => {
        expect(isNegative(NEG_ONE)).toBe(true);
    });
    test('Boxed number: Inexact Positive Integer', () => {
        expect(isNegative(makeInstance({num: 1}))).toBe(false);
    });
    test('Boxed number: Inexact Zero', () => {
        expect(isNegative(makeInstance({num: 0}))).toBe(false);
    });
    test('Boxed number: Inexact Negative Integer', () => {
        expect(isNegative(makeInstance({num: -1}))).toBe(true);
    });
    test('Boxed number: Positive Infinity', () => {
        expect(isNegative(INF)).toBe(false);
    });
    test('Boxed number: Negative Infinity', () => {
        expect(isNegative(NEG_INF)).toBe(true);
    });
    test('Boxed number: NAN', () => {
        expect(isNegative(NAN)).toBe(false);
    });
});

describe('isEven()', () => {
    test('Unboxed number: Even number', () => {
        expect(isEven(2)).toBe(true);
    });
    test('Unboxed number: number zero', () => {
        expect(isEven(0)).toBe(true);
    });
    test('Unboxed number: Odd number', () => {
        expect(isEven(3)).toBe(false);
    });
    test('Unboxed number: Even bigint', () => {
        expect(isEven(BigInt(2))).toBe(true);
    });
    test('Unboxed number: bigint zero', () => {
        expect(isEven(BigInt(0))).toBe(true);
    });
    test('Unboxed number: Odd bigint', () => {
        expect(isEven(BigInt(3))).toBe(false);
    });
    test('Boxed number: Exact Even Integer', () => {
        expect(isEven(TWO)).toBe(true);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isEven(ZERO)).toBe(true);
    });
    test('Boxed number: Exact Odd Integer', () => {
        expect(isEven(ONE)).toBe(false);
    });
    test('Boxed number: Inexact Even Integer', () => {
        expect(isEven(makeInstance({num: 2}))).toBe(true);
    });
    test('Boxed number: Inexact Zero', () => {
        expect(isEven(makeInstance({num: 0}))).toBe(true);
    });
    test('Boxed number: Inexact Odd Integer', () => {
        expect(isEven(makeInstance({num: 3}))).toBe(false);
    });
});

describe('isOdd()', () => {
    test('Unboxed number: Even number', () => {
        expect(isOdd(2)).toBe(false);
    });
    test('Unboxed number: number zero', () => {
        expect(isOdd(0)).toBe(false);
    });
    test('Unboxed number: Odd number', () => {
        expect(isOdd(3)).toBe(true);
    });
    test('Unboxed number: Even bigint', () => {
        expect(isOdd(BigInt(2))).toBe(false);
    });
    test('Unboxed number: bigint zero', () => {
        expect(isOdd(BigInt(0))).toBe(false);
    });
    test('Unboxed number: Odd bigint', () => {
        expect(isOdd(BigInt(3))).toBe(true);
    });
    test('Boxed number: Exact Even Integer', () => {
        expect(isOdd(TWO)).toBe(false);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isOdd(ZERO)).toBe(false);
    });
    test('Boxed number: Exact Odd Integer', () => {
        expect(isOdd(ONE)).toBe(true);
    });
    test('Boxed number: Inexact Even Integer', () => {
        expect(isOdd(makeInstance({num: 2}))).toBe(false);
    });
    test('Boxed number: Inexact Zero', () => {
        expect(isOdd(makeInstance({num: 0}))).toBe(false);
    });
    test('Boxed number: Inexact Odd Integer', () => {
        expect(isOdd(makeInstance({num: 3}))).toBe(true);
    });
});

describe('isExact()', () => {
    test('Unboxed number: number', () => {
        expect(isExact(10)).toBe(true);
    });
    test('Unboxed number: bigint', () => {
        expect(isExact(BigInt(10))).toBe(true);
    });
    test('Boxed number: Exact Integer', () => {
        expect(isExact(ZERO)).toBe(true);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isExact(makeInstance({num: 0}))).toBe(false);
    });
    test('Boxed number: Exact Rational', () => {
        expect(isExact(makeInstance({num: 3, den: 2}))).toBe(true);
    });
    test('Boxed number: Inexact Rational', () => {
        expect(isExact(makeInstance({num: 1.5}))).toBe(false);
    });
    test('Boxed number: Infinity', () => {
        expect(isExact(INF)).toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isExact(NAN)).toBe(false);
    });
    test('Boxed number: Exact Complex', () => {
        expect(isExact(I)).toBe(true);
    });
    test('Boxed number: Inxact Complex', () => {
        expect(isExact(makeInstance({num: 0, imagNum: 1}))).toBe(false);
    });
});

describe('isInexact()', () => {
    test('Unboxed number: number', () => {
        expect(isInexact(10)).toBe(false);
    });
    test('Unboxed number: bigint', () => {
        expect(isInexact(BigInt(10))).toBe(false);
    });
    test('Boxed number: Exact Integer', () => {
        expect(isInexact(ZERO)).toBe(false);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isInexact(makeInstance({num: 0}))).toBe(true);
    });
    test('Boxed number: Exact Rational', () => {
        expect(isInexact(makeInstance({num: 3, den: 2}))).toBe(false);
    });
    test('Boxed number: Inexact Rational', () => {
        expect(isInexact(makeInstance({num: 1.5}))).toBe(true);
    });
    test('Boxed number: Infinity', () => {
        expect(isInexact(INF)).toBe(true);
    });
    test('Boxed number: NAN', () => {
        expect(isInexact(NAN)).toBe(true);
    });
    test('Boxed number: Exact Complex', () => {
        expect(isInexact(I)).toBe(false);
    });
    test('Boxed number: Inxact Complex', () => {
        expect(isInexact(makeInstance({num: 0, imagNum: 1}))).toBe(true);
    });
});
