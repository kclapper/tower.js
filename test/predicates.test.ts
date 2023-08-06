import {
    InexactNumber,
    SmallExactNumber,
    ComplexNumber,
    NEG_ONE,
    ZERO,
    ONE,
    TWO,
    I,
    INF,
    NEG_INF,
    NAN,
    INEXACT_ZERO,
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
    isInexact,
    isRacketNumber,
    isFinite,
    isNaN,
    isNegativeZero
} from '../src/tower';

describe('isNumber()', () => {
    test('Non-number', () => {
        expect(isNumber("Not a number"))
            .toBe(false);
    });
    test('Unboxed', () => {
        expect(isNumber(10))
            .toBe(true);
        expect(isNumber(10.5))
            .toBe(true);
        expect(isNumber(Infinity))
            .toBe(true);
        expect(isNumber(NaN))
            .toBe(true);
    });
    test('Boxed number: Integer', () => {
        expect(isNumber(ZERO))
            .toBe(true);
    });
    test('Boxed number: Rational', () => {
        expect(isNumber(new InexactNumber(1.5)))
            .toBe(true);
    });
    test('Boxed number: Real', () => {
        expect(isNumber(INF))
            .toBe(true);
    });
    test('Boxed number: NAN', () => {
        expect(isNumber(NAN))
            .toBe(true);
    });
    test('Boxed number: Complex', () => {
        expect(isNumber(I))
            .toBe(true);
    });
});

describe('isComplex()', () => {
    test('Non-number', () => {
        expect(isComplex("Not a number"))
            .toBe(false);
    });
    test('Unboxed', () => {
        expect(isComplex(10))
            .toBe(true);
        expect(isComplex(10.5))
            .toBe(true);
        expect(isComplex(Infinity))
            .toBe(true);
        expect(isComplex(NaN))
            .toBe(true);
    });
    test('Boxed number: Integer', () => {
        expect(isComplex(ZERO))
            .toBe(true);
    });
    test('Boxed number: Rational', () => {
        expect(isComplex(new InexactNumber(1.5)))
            .toBe(true);
    });
    test('Boxed number: Real', () => {
        expect(isComplex(INF))
            .toBe(true);
    });
    test('Boxed number: NAN', () => {
        expect(isComplex(NAN))
            .toBe(true);
    });
    test('Boxed number: Complex', () => {
        expect(isComplex(I))
            .toBe(true);
    });
});

describe('isReal()', () => {
    test('Non-number', () => {
        expect(isReal("Not a number"))
            .toBe(false);
    });
    test('Unboxed', () => {
        expect(isReal(10))
            .toBe(true);
        expect(isReal(10.5))
            .toBe(true);
        expect(isReal(Infinity))
            .toBe(true);
        expect(isReal(NaN))
            .toBe(true);
    });
    test('Boxed number: Integer', () => {
        expect(isReal(ZERO))
            .toBe(true);
    });
    test('Boxed number: Rational', () => {
        expect(isReal(new InexactNumber(1.5)))
            .toBe(true);
    });
    test('Boxed number: Real', () => {
        expect(isReal(INF))
            .toBe(true);
    });
    test('Boxed number: NAN', () => {
        expect(isReal(NAN))
            .toBe(true);
    });
    test('Boxed number: Complex', () => {
        expect(isReal(I))
            .toBe(false);
    });
});

describe('isRational()', () => {
    test('Non-number', () => {
        expect(isRational("Not a number"))
            .toBe(false);
    });
    test('Unboxed', () => {
        expect(isRational(10))
            .toBe(true);
        expect(isRational(10.5))
            .toBe(true);
        expect(isRational(Infinity))
            .toBe(false);
        expect(isRational(NaN))
            .toBe(false);
    });
    test('Boxed number: Integer', () => {
        expect(isRational(ZERO))
            .toBe(true);
    });
    test('Boxed number: Rational', () => {
        expect(isRational(new InexactNumber(1.5)))
            .toBe(true);
    });
    test('Boxed number: Real', () => {
        expect(isRational(INF))
            .toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isRational(NAN))
            .toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isRational(I))
            .toBe(false);
    });
});

describe('isInteger()', () => {
    test('Non-number', () => {
        expect(isInteger("Not a number"))
            .toBe(false);
    });
    test('Unboxed', () => {
        expect(isInteger(10))
            .toBe(true);
        expect(isInteger(10.5))
            .toBe(false);
        expect(isInteger(Infinity))
            .toBe(false);
        expect(isInteger(NaN))
            .toBe(false);
    });
    test('Boxed number: Integer', () => {
        expect(isInteger(ZERO))
            .toBe(true);
    });
    test('Boxed number: Rational', () => {
        expect(isInteger(new InexactNumber(1.5)))
            .toBe(false);
    });
    test('Boxed number: Real', () => {
        expect(isInteger(INF))
            .toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isInteger(NAN))
            .toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isInteger(I))
            .toBe(false);
    });
});

describe('isExactInteger()', () => {
    test('Non-number', () => {
        expect(isExactInteger("Not a number"))
            .toBe(false);
    });
    test('Unboxed', () => {
        expect(isExactInteger(10))
            .toBe(false);
        expect(isExactInteger(10.5))
            .toBe(false);
        expect(isExactInteger(Infinity))
            .toBe(false);
        expect(isExactInteger(NaN))
            .toBe(false);
    });
    test('Boxed number: Exact Integer', () => {
        expect(isExactInteger(ZERO))
            .toBe(true);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isExactInteger(new InexactNumber(0)))
            .toBe(false);
    });
    test('Boxed number: Rational', () => {
        expect(isExactInteger(new InexactNumber(1.5)))
            .toBe(false);
    });
    test('Boxed number: Real', () => {
        expect(isExactInteger(INF))
            .toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isExactInteger(NAN))
            .toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isExactInteger(I))
            .toBe(false);
    });
});

describe('isExactNonNegativeInteger()', () => {
    test('Non-number', () => {
        expect(isExactNonNegativeInteger("Not a number"))
            .toBe(false);
    });
    test('Unboxed', () => {
        expect(isExactNonNegativeInteger(10))
            .toBe(false);
        expect(isExactNonNegativeInteger(10.5))
            .toBe(false);
        expect(isExactNonNegativeInteger(Infinity))
            .toBe(false);
        expect(isExactNonNegativeInteger(NaN))
            .toBe(false);
    });
    test('Boxed number: Exact Positive Integer', () => {
        expect(isExactNonNegativeInteger(ONE))
            .toBe(true);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isExactNonNegativeInteger(ZERO))
            .toBe(true);
    });
    test('Boxed number: Negative Exact Integer', () => {
        expect(isExactNonNegativeInteger(NEG_ONE))
            .toBe(false);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isExactNonNegativeInteger(new InexactNumber(0)))
            .toBe(false);
    });
    test('Boxed number: Rational', () => {
        expect(isExactNonNegativeInteger(new InexactNumber(1.5)))
            .toBe(false);
    });
    test('Boxed number: Real', () => {
        expect(isExactNonNegativeInteger(INF))
            .toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isExactNonNegativeInteger(NAN))
            .toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isExactNonNegativeInteger(I))
            .toBe(false);
    });
});

describe('isExactPositiveInteger()', () => {
    test('Non-number', () => {
        expect(isExactPositiveInteger("Not a number"))
            .toBe(false);
    });
    test('Unboxed', () => {
        expect(isExactPositiveInteger(10))
            .toBe(false);
        expect(isExactPositiveInteger(10.5))
            .toBe(false);
        expect(isExactPositiveInteger(Infinity))
            .toBe(false);
        expect(isExactPositiveInteger(NaN))
            .toBe(false);
    });
    test('Boxed number: Exact Positive Integer', () => {
        expect(isExactPositiveInteger(ONE))
            .toBe(true);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isExactPositiveInteger(ZERO))
            .toBe(false);
    });
    test('Boxed number: Negative Exact Integer', () => {
        expect(isExactPositiveInteger(NEG_ONE))
            .toBe(false);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isExactPositiveInteger(new InexactNumber(0)))
            .toBe(false);
    });
    test('Boxed number: Rational', () => {
        expect(isExactPositiveInteger(new InexactNumber(1.5)))
            .toBe(false);
    });
    test('Boxed number: Real', () => {
        expect(isExactPositiveInteger(INF))
            .toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isExactPositiveInteger(NAN))
            .toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isExactPositiveInteger(I))
            .toBe(false);
    });
});

describe('isInexactReal()', () => {
    test('Non-number', () => {
        expect(isInexactReal("Not a number"))
            .toBe(false);
    });
    test('Unboxed', () => {
        expect(isInexactReal(10))
            .toBe(true);
        expect(isInexactReal(10.5))
            .toBe(true);
        expect(isInexactReal(Infinity))
            .toBe(true);
        expect(isInexactReal(NaN))
            .toBe(true);
    });
    test('Boxed number: Exact Integer', () => {
        expect(isInexactReal(ONE))
            .toBe(false);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isInexactReal(new InexactNumber(0)))
            .toBe(true);
    });
    test('Boxed number: Inexact Rational', () => {
        expect(isInexactReal(new InexactNumber(1.5)))
            .toBe(true);
    });
    test('Boxed number: Inexact Real', () => {
        expect(isInexactReal(INF))
            .toBe(true);
    });
    test('Boxed number: Exact Real', () => {
        expect(isInexactReal(new SmallExactNumber(3, 2)))
            .toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isInexactReal(NAN))
            .toBe(true);
    });
    test('Boxed number: Complex', () => {
        expect(isInexactReal(I))
            .toBe(false);
    });
});

// DEPRECATED
//describe('isFixnum()', () => {
//    test('Non-number', () => {
//        expect(isFixnum("Not a number"))
//            .toBe(false);
//    });
//    test('Unboxed number: number', () => {
//        expect(isFixnum(10))
//            .toBe(true);
//    });
//    test('Unboxed number: bigint', () => {
//        expect(isFixnum(BigInt(10)))
//            .toBe(true);
//    });
//    test('Boxed number: Exact Integer', () => {
//        expect(isFixnum(ONE))
//            .toBe(false);
//    });
//    test('Boxed number: Inexact Integer', () => {
//        expect(isFixnum(new InexactNumber(0)))
//            .toBe(false);
//    });
//    test('Boxed number: Inexact Rational', () => {
//        expect(isFixnum(new InexactNumber(1.5)))
//            .toBe(false);
//    });
//    test('Boxed number: Inexact Real', () => {
//        expect(isFixnum(INF))
//            .toBe(false);
//    });
//    test('Boxed number: Exact Real', () => {
//        expect(isFixnum(new SmallExactNumber(3, 2)))
//            .toBe(false);
//    });
//    test('Boxed number: NAN', () => {
//        expect(isFixnum(NAN))
//            .toBe(false);
//    });
//    test('Boxed number: Complex', () => {
//        expect(isFixnum(I))
//            .toBe(false);
//    });
//});

describe('isFlonum()', () => {
    test('Non-number', () => {
        expect(isFlonum("Not a number"))
            .toBe(false);
    });
    test('Unboxed', () => {
        expect(isFlonum(10))
            .toBe(true);
        expect(isFlonum(10.5))
            .toBe(true);
        expect(isFlonum(Infinity))
            .toBe(true);
        expect(isFlonum(NaN))
            .toBe(true);
    });
    test('Boxed number: Exact Integer', () => {
        expect(isFlonum(ONE))
            .toBe(false);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isFlonum(new InexactNumber(0)))
            .toBe(false);
    });
    test('Boxed number: Inexact Rational', () => {
        expect(isFlonum(new InexactNumber(1.5)))
            .toBe(false);
    });
    test('Boxed number: Inexact Real', () => {
        expect(isFlonum(INF))
            .toBe(false);
    });
    test('Boxed number: Exact Real', () => {
        expect(isFlonum(new SmallExactNumber(3, 2)))
            .toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isFlonum(NAN))
            .toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isFlonum(I))
            .toBe(false);
    });
});

describe('isZero()', () => {
    test('Unboxed', () => {
        expect(isZero(0))
            .toBe(true);
        expect(isZero(10))
            .toBe(false);
        expect(isZero(10.5))
            .toBe(false);
        expect(isZero(Infinity))
            .toBe(false);
        expect(isZero(NaN))
            .toBe(false);
    });
    test('Boxed number: Exact Integer', () => {
        expect(isZero(ONE))
            .toBe(false);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isZero(ZERO))
            .toBe(true);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isZero(new InexactNumber(1)))
            .toBe(false);
    });
    test('Boxed number: Inexact Zero', () => {
        expect(isZero(new InexactNumber(0)))
            .toBe(true);
    });
    test('Boxed number: Inexact Rational', () => {
        expect(isZero(new InexactNumber(1.5)))
            .toBe(false);
    });
    test('Boxed number: Inexact Real', () => {
        expect(isZero(INF))
            .toBe(false);
    });
    test('Boxed number: Exact Real', () => {
        expect(isZero(new SmallExactNumber(3, 2)))
            .toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isZero(NAN))
            .toBe(false);
    });
    test('Boxed number: Complex', () => {
        expect(isZero(I))
            .toBe(false);
    });
    test('Boxed number: Complex Zero', () => {
        expect(isZero(new ComplexNumber(INEXACT_ZERO, INEXACT_ZERO)))
            .toBe(true);
    });
});

describe('isPositive()', () => {
    test('Unboxed', () => {
        expect(isPositive(0))
            .toBe(false);
        expect(isPositive(1))
            .toBe(true);
        expect(isPositive(-1))
            .toBe(false);
        expect(isPositive(10))
            .toBe(true);
        expect(isPositive(10.5))
            .toBe(true);
        expect(isPositive(Infinity))
            .toBe(true);
        expect(isPositive(-Infinity))
            .toBe(false);
        expect(isPositive(NaN))
            .toBe(false);
    });
    test('Boxed number: Exact Positive Integer', () => {
        expect(isPositive(ONE))
            .toBe(true);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isPositive(ZERO))
            .toBe(false);
    });
    test('Boxed number: Exact Negative Integer', () => {
        expect(isPositive(NEG_ONE))
            .toBe(false);
    });
    test('Boxed number: Inexact Positive Integer', () => {
        expect(isPositive(new InexactNumber(1)))
            .toBe(true);
    });
    test('Boxed number: Inexact Zero', () => {
        expect(isPositive(new InexactNumber(0)))
            .toBe(false);
    });
    test('Boxed number: Inexact Negative Integer', () => {
        expect(isPositive(new InexactNumber(-1)))
            .toBe(false);
    });
    test('Boxed number: Positive Infinity', () => {
        expect(isPositive(INF))
            .toBe(true);
    });
    test('Boxed number: Negative Infinity', () => {
        expect(isPositive(NEG_INF))
            .toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isPositive(NAN))
            .toBe(false);
    });
});

describe('isNegative()', () => {
    test('Unboxed', () => {
        expect(isNegative(0))
            .toBe(false);
        expect(isNegative(1))
            .toBe(false);
        expect(isNegative(-1))
            .toBe(true);
        expect(isNegative(10))
            .toBe(false);
        expect(isNegative(10.5))
            .toBe(false);
        expect(isNegative(Infinity))
            .toBe(false);
        expect(isNegative(-Infinity))
            .toBe(true);
        expect(isNegative(NaN))
            .toBe(false);
    });
    test('Boxed number: Exact Positive Integer', () => {
        expect(isNegative(ONE))
            .toBe(false);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isNegative(ZERO))
            .toBe(false);
    });
    test('Boxed number: Exact Negative Integer', () => {
        expect(isNegative(NEG_ONE))
            .toBe(true);
    });
    test('Boxed number: Inexact Positive Integer', () => {
        expect(isNegative(new InexactNumber(1)))
            .toBe(false);
    });
    test('Boxed number: Inexact Zero', () => {
        expect(isNegative(new InexactNumber(0)))
            .toBe(false);
    });
    test('Boxed number: Inexact Negative Integer', () => {
        expect(isNegative(new InexactNumber(-1)))
            .toBe(true);
    });
    test('Boxed number: Positive Infinity', () => {
        expect(isNegative(INF))
            .toBe(false);
    });
    test('Boxed number: Negative Infinity', () => {
        expect(isNegative(NEG_INF))
            .toBe(true);
    });
    test('Boxed number: NAN', () => {
        expect(isNegative(NAN))
            .toBe(false);
    });
});

describe('isEven()', () => {
    test('Unboxed', () => {
        expect(isEven(0))
            .toBe(true);
        expect(isEven(1))
            .toBe(false);
        expect(isEven(-1))
            .toBe(false);
        expect(isEven(10))
            .toBe(true);
        expect(() => isEven(Infinity))
            .toThrow();
        expect(() => isEven(-Infinity))
            .toThrow();
        expect(() => isEven(NaN))
            .toThrow();
        expect(isEven(2))
            .toBe(true);
        expect(isEven(3))
            .toBe(false);
    });
    test('Boxed number: Exact Even Integer', () => {
        expect(isEven(TWO))
            .toBe(true);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isEven(ZERO))
            .toBe(true);
    });
    test('Boxed number: Exact Odd Integer', () => {
        expect(isEven(ONE))
            .toBe(false);
    });
    test('Boxed number: Inexact Even Integer', () => {
        expect(isEven(new InexactNumber(2)))
            .toBe(true);
    });
    test('Boxed number: Inexact Zero', () => {
        expect(isEven(new InexactNumber(0)))
            .toBe(true);
    });
    test('Boxed number: Inexact Odd Integer', () => {
        expect(isEven(new InexactNumber(3)))
            .toBe(false);
    });
});

describe('isOdd()', () => {
    test('Unboxed', () => {
        expect(isOdd(0))
            .toBe(false);
        expect(isOdd(1))
            .toBe(true);
        expect(isOdd(-1))
            .toBe(true);
        expect(isOdd(10))
            .toBe(false);
        expect(() => isOdd(Infinity))
            .toThrow();
        expect(() => isOdd(-Infinity))
            .toThrow();
        expect(() => isOdd(NaN))
            .toThrow();
        expect(isOdd(2))
            .toBe(false);
        expect(isOdd(3))
            .toBe(true);
    });
    test('Boxed number: Exact Even Integer', () => {
        expect(isOdd(TWO))
            .toBe(false);
    });
    test('Boxed number: Exact Zero', () => {
        expect(isOdd(ZERO))
            .toBe(false);
    });
    test('Boxed number: Exact Odd Integer', () => {
        expect(isOdd(ONE))
            .toBe(true);
    });
    test('Boxed number: Inexact Even Integer', () => {
        expect(isOdd(new InexactNumber(2)))
            .toBe(false);
    });
    test('Boxed number: Inexact Zero', () => {
        expect(isOdd(new InexactNumber(0)))
            .toBe(false);
    });
    test('Boxed number: Inexact Odd Integer', () => {
        expect(isOdd(new InexactNumber(3)))
            .toBe(true);
    });
});

describe('isExact()', () => {
    test('Unboxed', () => {
        expect(isExact(0))
            .toBe(false);
        expect(isExact(1))
            .toBe(false);
        expect(isExact(-1))
            .toBe(false);
        expect(isExact(10))
            .toBe(false);
        expect(isExact(10.5))
            .toBe(false);
        expect(isExact(Infinity))
            .toBe(false);
        expect(isExact(-Infinity))
            .toBe(false);
        expect(isExact(NaN))
            .toBe(false);
        expect(isExact(2))
            .toBe(false);
        expect(isExact(3))
            .toBe(false);
    });
    test('Boxed number: Exact Integer', () => {
        expect(isExact(ZERO))
            .toBe(true);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isExact(new InexactNumber(0)))
            .toBe(false);
    });
    test('Boxed number: Exact Rational', () => {
        expect(isExact(new SmallExactNumber(3, 2)))
            .toBe(true);
    });
    test('Boxed number: Inexact Rational', () => {
        expect(isExact(new InexactNumber(1.5)))
            .toBe(false);
    });
    test('Boxed number: Infinity', () => {
        expect(isExact(INF))
            .toBe(false);
    });
    test('Boxed number: NAN', () => {
        expect(isExact(NAN))
            .toBe(false);
    });
    test('Boxed number: Exact Complex', () => {
        expect(isExact(I))
            .toBe(true);
    });
    test('Boxed number: Inxact Complex', () => {
        expect(isExact(new ComplexNumber(new InexactNumber(0), new InexactNumber(1))))
            .toBe(false);
    });
});

describe('isInexact()', () => {
    test('Unboxed', () => {
        expect(isInexact(0))
            .toBe(true);
        expect(isInexact(1))
            .toBe(true);
        expect(isInexact(-1))
            .toBe(true);
        expect(isInexact(10))
            .toBe(true);
        expect(isInexact(10.5))
            .toBe(true);
        expect(isInexact(Infinity))
            .toBe(true);
        expect(isInexact(-Infinity))
            .toBe(true);
        expect(isInexact(NaN))
            .toBe(true);
        expect(isInexact(2))
            .toBe(true);
        expect(isInexact(3))
            .toBe(true);
    });
    test('Boxed number: Exact Integer', () => {
        expect(isInexact(ZERO))
            .toBe(false);
    });
    test('Boxed number: Inexact Integer', () => {
        expect(isInexact(new InexactNumber(0)))
            .toBe(true);
    });
    test('Boxed number: Exact Rational', () => {
        expect(isInexact(new SmallExactNumber(3, 2)))
            .toBe(false);
    });
    test('Boxed number: Inexact Rational', () => {
        expect(isInexact(new InexactNumber(1.5)))
            .toBe(true);
    });
    test('Boxed number: Infinity', () => {
        expect(isInexact(INF))
            .toBe(true);
    });
    test('Boxed number: NAN', () => {
        expect(isInexact(NAN))
            .toBe(true);
    });
    test('Boxed number: Exact Complex', () => {
        expect(isInexact(I))
            .toBe(false);
    });
    test('Boxed number: Inxact Complex', () => {
        expect(isInexact(new ComplexNumber(new InexactNumber(0), new InexactNumber(1))))
            .toBe(true);
    });
});

test('isRacketNumber', () => {
    expect(isRacketNumber(5))
        .toBe(true);
    expect(isRacketNumber(ONE))
        .toBe(true);
    expect(isRacketNumber(Math.PI))
        .toBe(true);
    expect(isRacketNumber(5n as unknown as number))
        .toBe(false);
});

test('isFinite', () => {
    expect(isFinite(5))
        .toBe(true);
    expect(isFinite(Infinity))
        .toBe(false);
    expect(isFinite(INF))
        .toBe(false);
    expect(isFinite(NAN))
        .toBe(false);
    expect(isFinite(ONE))
        .toBe(true);
});

test('isNaN', () => {
    expect(isNaN(5))
        .toBe(false);
    expect(isNaN(Infinity))
        .toBe(false);
    expect(isNaN(INF))
        .toBe(false);
    expect(isNaN(NAN))
        .toBe(true);
    expect(isNaN(ONE))
        .toBe(false);
});

test('isNegativeZero', () => {
    expect(isNegativeZero(5))
        .toBe(false);
    expect(isNegativeZero(Infinity))
        .toBe(false);
    expect(isNegativeZero(INF))
        .toBe(false);
    expect(isNegativeZero(NAN))
        .toBe(false);
    expect(isNegativeZero(ONE))
        .toBe(false);
    expect(isNegativeZero(-0))
        .toBe(true)
    expect(isNegativeZero(new InexactNumber(-0)))
        .toBe(true)
    expect(isNegativeZero(new ComplexNumber(new InexactNumber(-0))))
        .toBe(true);
});
