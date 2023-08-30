import {
    fromString,
    isNumber,
    isComplex,
    isReal,
    isRational,
    isInteger,
    isExactInteger,
    isExactNonNegativeInteger,
    isExactPositiveInteger,
    isInexactReal,
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
    test('Integer', () => {
        expect(isNumber(fromString("0")))
            .toBe(true);
    });
    test('Rational', () => {
        expect(isNumber(fromString(`1.5`)))
            .toBe(true);
        expect(isNumber(fromString(`10.0`)))
            .toBe(true);
        expect(isNumber(fromString(`10.5`)))
            .toBe(true);
    });
    test('Real', () => {
        expect(isNumber(fromString("+inf.0")))
            .toBe(true);
        expect(isNumber(fromString("+inf.0")))
            .toBe(true);
    });
    test('+nan.0', () => {
        expect(isNumber(fromString("+nan.0")))
            .toBe(true);
        expect(isNumber(fromString("+nan.0")))
            .toBe(true);
    });
    test('Complex', () => {
        expect(isNumber(fromString("0+1i")))
            .toBe(true);
    });
});

describe('isComplex()', () => {
    test('Non-number', () => {
        expect(isComplex("Not a number"))
            .toBe(false);
    });
    test('Integer', () => {
        expect(isComplex(fromString("0")))
            .toBe(true);
    });
    test('Rational', () => {
        expect(isComplex(fromString(`1.5`)))
            .toBe(true);
    });
    test('Real', () => {
        expect(isComplex(fromString("+inf.0")))
            .toBe(true);
    });
    test('+nan.0', () => {
        expect(isComplex(fromString("+nan.0")))
            .toBe(true);
    });
    test('Complex', () => {
        expect(isComplex(fromString("0+1i")))
            .toBe(true);
    });
});

describe('isReal()', () => {
    test('Non-number', () => {
        expect(isReal("Not a number"))
            .toBe(false);
    });
    test('Integer', () => {
        expect(isReal(fromString("0")))
            .toBe(true);
    });
    test('Rational', () => {
        expect(isReal(fromString(`1.5`)))
            .toBe(true);
    });
    test('Real', () => {
        expect(isReal(fromString("+inf.0")))
            .toBe(true);
    });
    test('+nan.0', () => {
        expect(isReal(fromString("+nan.0")))
            .toBe(true);
    });
    test('Complex', () => {
        expect(isReal(fromString("0+1i")))
            .toBe(false);
    });
});

describe('isRational()', () => {
    test('Non-number', () => {
        expect(isRational("Not a number"))
            .toBe(false);
    });
    test('Integer', () => {
        expect(isRational(fromString("0")))
            .toBe(true);
    });
    test('Rational', () => {
        expect(isRational(fromString(`1.5`)))
            .toBe(true);
    });
    test('Real', () => {
        expect(isRational(fromString("+inf.0")))
            .toBe(false);
    });
    test('+nan.0', () => {
        expect(isRational(fromString("+nan.0")))
            .toBe(false);
    });
    test('Complex', () => {
        expect(isRational(fromString("0+1i")))
            .toBe(false);
    });
});

describe('isInteger()', () => {
    test('Non-number', () => {
        expect(isInteger("Not a number"))
            .toBe(false);
    });
    test('Integer', () => {
        expect(isInteger(fromString("0")))
            .toBe(true);
    });
    test('Rational', () => {
        expect(isInteger(fromString(`1.5`)))
            .toBe(false);
    });
    test('Real', () => {
        expect(isInteger(fromString("+inf.0")))
            .toBe(false);
    });
    test('+nan.0', () => {
        expect(isInteger(fromString("+nan.0")))
            .toBe(false);
    });
    test('Complex', () => {
        expect(isInteger(fromString("0+1i")))
            .toBe(false);
    });
});

describe('isExactInteger()', () => {
    test('Non-number', () => {
        expect(isExactInteger("Not a number"))
            .toBe(false);
    });
    test('Exact Integer', () => {
        expect(isExactInteger(fromString("0")))
            .toBe(true);
    });
    test('Inexact Integer', () => {
        expect(isExactInteger(fromString(`0.0`)))
            .toBe(false);
    });
    test('Rational', () => {
        expect(isExactInteger(fromString(`1.5`)))
            .toBe(false);
    });
    test('Real', () => {
        expect(isExactInteger(fromString("+inf.0")))
            .toBe(false);
    });
    test('+nan.0', () => {
        expect(isExactInteger(fromString("+nan.0")))
            .toBe(false);
    });
    test('Complex', () => {
        expect(isExactInteger(fromString("0+1i")))
            .toBe(false);
    });
});

describe('isExactNonNegativeInteger()', () => {
    test('Non-number', () => {
        expect(isExactNonNegativeInteger("Not a number"))
            .toBe(false);
    });
    test('Exact Positive Integer', () => {
        expect(isExactNonNegativeInteger(fromString("1")))
            .toBe(true);
    });
    test('Exact Zero', () => {
        expect(isExactNonNegativeInteger(fromString("0")))
            .toBe(true);
    });
    test('Negative Exact Integer', () => {
        expect(isExactNonNegativeInteger(fromString("-1")))
            .toBe(false);
    });
    test('Inexact Integer', () => {
        expect(isExactNonNegativeInteger(fromString(`0.0`)))
            .toBe(false);
    });
    test('Rational', () => {
        expect(isExactNonNegativeInteger(fromString(`1.5`)))
            .toBe(false);
        expect(isExactNonNegativeInteger(fromString(`10.0`)))
            .toBe(false);
        expect(isExactNonNegativeInteger(fromString(`10.5`)))
            .toBe(false);
    });
    test('Real', () => {
        expect(isExactNonNegativeInteger(fromString("+inf.0")))
            .toBe(false);
    });
    test('+nan.0', () => {
        expect(isExactNonNegativeInteger(fromString("+nan.0")))
            .toBe(false);
    });
    test('Complex', () => {
        expect(isExactNonNegativeInteger(fromString("0+1i")))
            .toBe(false);
    });
});

describe('isExactPositiveInteger()', () => {
    test('Non-number', () => {
        expect(isExactPositiveInteger("Not a number"))
            .toBe(false);
    });
    test('Exact Positive Integer', () => {
        expect(isExactPositiveInteger(fromString("1")))
            .toBe(true);
    });
    test('Exact Zero', () => {
        expect(isExactPositiveInteger(fromString("0")))
            .toBe(false);
    });
    test('Negative Exact Integer', () => {
        expect(isExactPositiveInteger(fromString("-1")))
            .toBe(false);
    });
    test('Inexact Integer', () => {
        expect(isExactPositiveInteger(fromString(`0.0`)))
            .toBe(false);
    });
    test('Rational', () => {
        expect(isExactPositiveInteger(fromString(`1.5`)))
            .toBe(false);
    });
    test('Real', () => {
        expect(isExactPositiveInteger(fromString("+inf.0")))
            .toBe(false);
    });
    test('+nan.0', () => {
        expect(isExactPositiveInteger(fromString("+nan.0")))
            .toBe(false);
    });
    test('Complex', () => {
        expect(isExactPositiveInteger(fromString("0+1i")))
            .toBe(false);
    });
});

describe('isInexactReal()', () => {
    test('Non-number', () => {
        expect(isInexactReal("Not a number"))
            .toBe(false);
    });
    test('Exact Integer', () => {
        expect(isInexactReal(fromString("1")))
            .toBe(false);
    });
    test('Inexact Integer', () => {
        expect(isInexactReal(fromString(`0.0`)))
            .toBe(true);
    });
    test('Inexact Rational', () => {
        expect(isInexactReal(fromString(`1.5`)))
            .toBe(true);
    });
    test('Inexact Real', () => {
        expect(isInexactReal(fromString("+inf.0")))
            .toBe(true);
    });
    test('Exact Real', () => {
        expect(isInexactReal(fromString(`3/2`)))
            .toBe(false);
    });
    test('+nan.0', () => {
        expect(isInexactReal(fromString("+nan.0")))
            .toBe(true);
    });
    test('Complex', () => {
        expect(isInexactReal(fromString("0+1i")))
            .toBe(false);
    });
});

describe('isFlonum()', () => {
    test('Non-number', () => {
        expect(isFlonum("Not a number"))
            .toBe(false);
    });
    test('Exact Integer', () => {
        expect(isFlonum(fromString("1")))
            .toBe(false);
    });
    test('Inexact Integer', () => {
        expect(isFlonum(fromString("0.0")))
            .toBe(true);
    });
    test('Inexact Rational', () => {
        expect(isFlonum(fromString("1.5")))
            .toBe(true);
    });
    test('Inexact Real', () => {
        expect(isFlonum(fromString("+inf.0")))
            .toBe(true);
    });
    test('Exact Real', () => {
        expect(isFlonum(fromString("3/2")))
            .toBe(false);
    });
    test('+nan.0', () => {
        expect(isFlonum(fromString("+nan.0")))
            .toBe(true);
    });
    test('Complex', () => {
        expect(isFlonum(fromString("0+1i")))
            .toBe(false);
    });
});

describe('isZero()', () => {
    test('Exact Integer', () => {
        expect(isZero(fromString("1")))
            .toBe(false);
    });
    test('Exact Zero', () => {
        expect(isZero(fromString("0")))
            .toBe(true);
    });
    test('Inexact Integer', () => {
        expect(isZero(fromString("1.0")))
            .toBe(false);
        expect(isZero(fromString("0.0")))
            .toBe(true);
    });
    test('Inexact Zero', () => {
        expect(isZero(fromString("0.0")))
            .toBe(true);
    });
    test('Inexact Rational', () => {
        expect(isZero(fromString("1.5")))
            .toBe(false);
        expect(isZero(fromString("10.0")))
            .toBe(false);
        expect(isZero(fromString("10.5")))
            .toBe(false);
    });
    test('Inexact Real', () => {
        expect(isZero(fromString("+inf.0")))
            .toBe(false);
    });
    test('Exact Real', () => {
        expect(isZero(fromString("3/2")))
            .toBe(false);
    });
    test('+nan.0', () => {
        expect(isZero(fromString("+nan.0")))
            .toBe(false);
    });
    test('Complex', () => {
        expect(isZero(fromString("0+1i")))
            .toBe(false);
    });
    test('Complex Zero', () => {
        expect(isZero(fromString("0.0+0.0i")))
            .toBe(true);
    });
});

describe('isPositive()', () => {
    test('Numbers', () => {
        expect(isPositive(fromString("0.0")))
            .toBe(false);
        expect(isPositive(fromString("1.0")))
            .toBe(true);
        expect(isPositive(fromString("-1.0")))
            .toBe(false);
        expect(isPositive(fromString("10.0")))
            .toBe(true);
        expect(isPositive(fromString("10.5")))
            .toBe(true);
        expect(isPositive(fromString("+inf.0")))
            .toBe(true);
        expect(isPositive(fromString("-inf.0")))
            .toBe(false);
        expect(isPositive(fromString("+nan.0")))
            .toBe(false);
    });
    test('Exact Positive Integer', () => {
        expect(isPositive(fromString("1")))
            .toBe(true);
    });
    test('Exact Zero', () => {
        expect(isPositive(fromString("0")))
            .toBe(false);
    });
    test('Exact Negative Integer', () => {
        expect(isPositive(fromString("-1")))
            .toBe(false);
    });
    test('Inexact Positive Integer', () => {
        expect(isPositive(fromString("1.0")))
            .toBe(true);
    });
    test('Inexact Zero', () => {
        expect(isPositive(fromString("0.0")))
            .toBe(false);
    });
    test('Inexact Negative Integer', () => {
        expect(isPositive(fromString("-1.0")))
            .toBe(false);
    });
    test('Positive +inf.0', () => {
        expect(isPositive(fromString("+inf.0")))
            .toBe(true);
    });
    test('Negative +inf.0', () => {
        expect(isPositive(fromString("-inf.0")))
            .toBe(false);
    });
    test('+nan.0', () => {
        expect(isPositive(fromString("+nan.0")))
            .toBe(false);
    });
});

describe('isNegative()', () => {
    test('Numbers', () => {
        expect(isNegative(fromString("0.0")))
            .toBe(false);
        expect(isNegative(fromString("1.0")))
            .toBe(false);
        expect(isNegative(fromString("-1.0")))
            .toBe(true);
        expect(isNegative(fromString("10.0")))
            .toBe(false);
        expect(isNegative(fromString("10.5")))
            .toBe(false);
        expect(isNegative(fromString("+inf.0")))
            .toBe(false);
        expect(isNegative(fromString("-inf.0")))
            .toBe(true);
        expect(isNegative(fromString("+nan.0")))
            .toBe(false);
    });
    test('Exact Positive Integer', () => {
        expect(isNegative(fromString("1")))
            .toBe(false);
    });
    test('Exact Zero', () => {
        expect(isNegative(fromString("0")))
            .toBe(false);
    });
    test('Exact Negative Integer', () => {
        expect(isNegative(fromString("-1")))
            .toBe(true);
    });
    test('Inexact Positive Integer', () => {
        expect(isNegative(fromString("1.0")))
            .toBe(false);
    });
    test('Inexact Zero', () => {
        expect(isNegative(fromString("0.0")))
            .toBe(false);
    });
    test('Inexact Negative Integer', () => {
        expect(isNegative(fromString("-1.0")))
            .toBe(true);
    });
    test('+inf.0', () => {
        expect(isNegative(fromString("+inf.0")))
            .toBe(false);
    });
    test('-inf.0', () => {
        expect(isNegative(fromString("-inf.0")))
            .toBe(true);
    });
    test('+nan.0', () => {
        expect(isNegative(fromString("+nan.0")))
            .toBe(false);
    });
});

describe('isEven()', () => {
    test('Numbers', () => {
        expect(isEven(fromString("0.0")))
            .toBe(true);
        expect(isEven(fromString("1.0")))
            .toBe(false);
        expect(isEven(fromString("-1.0")))
            .toBe(false);
        expect(isEven(fromString("10.0")))
            .toBe(true);
        expect(() => isEven(fromString("+inf.0")))
            .toThrow();
        expect(() => isEven(fromString("-inf.0")))
            .toThrow();
        expect(() => isEven(fromString("+nan.0")))
            .toThrow();
        expect(isEven(fromString(`2.0`)))
            .toBe(true);
        expect(isEven(fromString(`3.0`)))
            .toBe(false);
    });
    test('Exact Even Integer', () => {
        expect(isEven(fromString("2")))
            .toBe(true);
    });
    test('Exact Zero', () => {
        expect(isEven(fromString("0")))
            .toBe(true);
    });
    test('Exact Odd Integer', () => {
        expect(isEven(fromString("1")))
            .toBe(false);
    });
    test('Inexact Even Integer', () => {
        expect(isEven(fromString(`2.0`)))
            .toBe(true);
    });
    test('Inexact Zero', () => {
        expect(isEven(fromString("0.0")))
            .toBe(true);
    });
    test('Inexact Odd Integer', () => {
        expect(isEven(fromString(`3.0`)))
            .toBe(false);
    });
});

describe('isOdd()', () => {
    test('Numbers', () => {
        expect(isOdd(fromString("0.0")))
            .toBe(false);
        expect(isOdd(fromString("1.0")))
            .toBe(true);
        expect(isOdd(fromString("-1.0")))
            .toBe(true);
        expect(isOdd(fromString("10.0")))
            .toBe(false);
        expect(() => isOdd(fromString("+inf.0")))
            .toThrow();
        expect(() => isOdd(fromString("-inf.0")))
            .toThrow();
        expect(() => isOdd(fromString("+nan.0")))
            .toThrow();
        expect(isOdd(fromString("2.0")))
            .toBe(false);
        expect(isOdd(fromString("3.0")))
            .toBe(true);
    });
    test('Exact Even Integer', () => {
        expect(isOdd(fromString("2")))
            .toBe(false);
    });
    test('Exact Zero', () => {
        expect(isOdd(fromString("0")))
            .toBe(false);
    });
    test('Exact Odd Integer', () => {
        expect(isOdd(fromString("1")))
            .toBe(true);
    });
    test('Inexact Even Integer', () => {
        expect(isOdd(fromString("2.0")))
            .toBe(false);
    });
    test('Inexact Zero', () => {
        expect(isOdd(fromString("0.0")))
            .toBe(false);
    });
    test('Inexact Odd Integer', () => {
        expect(isOdd(fromString("3.0")))
            .toBe(true);
    });
});

describe('isExact()', () => {
    test('Numbers', () => {
        expect(isExact(fromString("0.0")))
            .toBe(false);
        expect(isExact(fromString("1.0")))
            .toBe(false);
        expect(isExact(fromString("-1.0")))
            .toBe(false);
        expect(isExact(fromString("10.0")))
            .toBe(false);
        expect(isExact(fromString("10.5")))
            .toBe(false);
        expect(isExact(fromString("+inf.0")))
            .toBe(false);
        expect(isExact(fromString("-inf.0")))
            .toBe(false);
        expect(isExact(fromString("+nan.0")))
            .toBe(false);
        expect(isExact(fromString("2.0")))
            .toBe(false);
        expect(isExact(fromString("3.0")))
            .toBe(false);
    });
    test('Exact Integer', () => {
        expect(isExact(fromString("0")))
            .toBe(true);
    });
    test('Inexact Integer', () => {
        expect(isExact(fromString("0.0")))
            .toBe(false);
    });
    test('Exact Rational', () => {
        expect(isExact(fromString("3/2")))
            .toBe(true);
    });
    test('Inexact Rational', () => {
        expect(isExact(fromString("1.5")))
            .toBe(false);
    });
    test('+inf.0', () => {
        expect(isExact(fromString("+inf.0")))
            .toBe(false);
    });
    test('+nan.0', () => {
        expect(isExact(fromString("+nan.0")))
            .toBe(false);
    });
    test('Exact Complex', () => {
        expect(isExact(fromString("0+1i")))
            .toBe(true);
    });
    test('Inxact Complex', () => {
        expect(isExact(fromString("0.0+1.0i")))
            .toBe(false);
    });
});

describe('isInexact()', () => {
    test('Numbers', () => {
        expect(isInexact(fromString("0.0")))
            .toBe(true);
        expect(isInexact(fromString("1.0")))
            .toBe(true);
        expect(isInexact(fromString("-1.0")))
            .toBe(true);
        expect(isInexact(fromString("10.0")))
            .toBe(true);
        expect(isInexact(fromString("10.5")))
            .toBe(true);
        expect(isInexact(fromString("+inf.0")))
            .toBe(true);
        expect(isInexact(fromString("-inf.0")))
            .toBe(true);
        expect(isInexact(fromString("+nan.0")))
            .toBe(true);
        expect(isInexact(fromString("2.0")))
            .toBe(true);
        expect(isInexact(fromString("3.0")))
            .toBe(true);
    });
    test('Exact Integer', () => {
        expect(isInexact(fromString("0")))
            .toBe(false);
    });
    test('Inexact Integer', () => {
        expect(isInexact(fromString("0.0")))
            .toBe(true);
    });
    test('Exact Rational', () => {
        expect(isInexact(fromString("3/2")))
            .toBe(false);
    });
    test('Inexact Rational', () => {
        expect(isInexact(fromString("1.5")))
            .toBe(true);
    });
    test('+inf.0', () => {
        expect(isInexact(fromString("+inf.0")))
            .toBe(true);
    });
    test('+nan.0', () => {
        expect(isInexact(fromString("+nan.0")))
            .toBe(true);
    });
    test('Exact Complex', () => {
        expect(isInexact(fromString("0+1i")))
            .toBe(false);
    });
    test('Inxact Complex', () => {
        expect(isInexact(fromString("0.0+1.0i")))
            .toBe(true);
    });
});

test('isRacketNumber', () => {
    expect(isRacketNumber(fromString(`5.0`)))
        .toBe(true);
    expect(isRacketNumber(fromString("1")))
        .toBe(true);
    expect(isRacketNumber(Math.PI))
        .toBe(true);
    expect(isRacketNumber(5n))
        .toBe(true);
});

test('isFinite', () => {
    expect(isFinite(fromString(`5.0`)))
        .toBe(true);
    expect(isFinite(fromString("+inf.0")))
        .toBe(false);
    expect(isFinite(fromString("+inf.0")))
        .toBe(false);
    expect(isFinite(fromString("+nan.0")))
        .toBe(false);
    expect(isFinite(fromString("1")))
        .toBe(true);
});

test('isNaN', () => {
    expect(isNaN(fromString(`5.0`)))
        .toBe(false);
    expect(isNaN(fromString("+inf.0")))
        .toBe(false);
    expect(isNaN(fromString("+inf.0")))
        .toBe(false);
    expect(isNaN(fromString("+nan.0")))
        .toBe(true);
    expect(isNaN(fromString("1")))
        .toBe(false);
});

test('isNegativeZero', () => {
    expect(isNegativeZero(fromString("5.0")))
        .toBe(false);
    expect(isNegativeZero(fromString("+inf.0")))
        .toBe(false);
    expect(isNegativeZero(fromString("+inf.0")))
        .toBe(false);
    expect(isNegativeZero(fromString("+nan.0")))
        .toBe(false);
    expect(isNegativeZero(fromString("1")))
        .toBe(false);
    expect(isNegativeZero(fromString(`-0.0`)))
        .toBe(true)
    expect(isNegativeZero(fromString(`-0.0`)))
        .toBe(true)
});
