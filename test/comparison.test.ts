import {
    fromString,
    equals,
    approxEquals,
    greaterThan,
    greaterThanOrEqual,
    lessThan,
    lessThanOrEqual,
} from '../src/tower';

describe('equals', () => {
    test('racket docs examples', () => {
        expect(equals(fromString("1")))
            .toBe(true);
        expect(equals(fromString("1"), fromString(`1.0`)))
            .toBe(true);
        expect(equals(fromString("1"), fromString("2")))
            .toBe(false);

        const x = fromString('2+3i');
        expect(equals(x, x, x))
            .toBe(true);
    });
    test('Inexact numbers', () => {
        expect(equals(fromString(`5.0`), fromString(`5.0`)))
            .toBe(true);
        expect(equals(fromString(`3.0`), fromString(`5.0`)))
            .toBe(false);
        expect(equals(fromString("1.0"), fromString("1.0")))
            .toBe(true);
        expect(equals(fromString("0.0"), fromString("1.0")))
            .toBe(false);
        expect(equals(fromString("+inf.0"), fromString("+inf.0")))
            .toBe(true)
        expect(equals(fromString("-inf.0"), fromString("-inf.0")))
            .toBe(true)
        expect(equals(fromString("+nan.0"), fromString("+nan.0")))
            .toBe(false)
    });
    test('Exact numbers', () => {
        expect(equals(fromString("1"), fromString("1")))
            .toBe(true);
        expect(equals(fromString("0"), fromString("1")))
            .toBe(false);
    });
    test('Complex numbers', () => {
        expect(equals(fromString("0+1i"), fromString("0+1i")))
            .toBe(true);
        expect(equals(fromString("0-1i"), fromString("0+1i")))
            .toBe(false);
    });
    test('multi-arity', () => {
        expect(equals(fromString("5.0"), fromString("5.0"), fromString("5")))
            .toBe(true);
        expect(equals(fromString(`3.0`), fromString("5.0"), fromString("5")))
            .toBe(false);
    });
    test('NaN', () => {
        expect(equals(fromString(`5.0`), fromString("+nan.0")))
            .toBe(false);
        expect(equals(fromString("+nan.0"), fromString("+nan.0")))
            .toBe(false);
    });
});

describe('approxEquals', () => {
    test('Inexact numbers', () => {
        expect(approxEquals(fromString(`5.0`), fromString(`6.0`), fromString(`1.0`)))
            .toBe(true);
        expect(approxEquals(fromString(`3.0`), fromString(`5.0`), fromString(`1.0`)))
            .toBe(false);
        expect(approxEquals(fromString("1.0"), fromString("1.0"), fromString("0.0")))
            .toBe(true);
        expect(approxEquals(fromString("0.0"), fromString("1.0"), fromString("0.5")))
            .toBe(false);
    });
    test('Exact numbers', () => {
        expect(approxEquals(fromString("1"), fromString("1"), fromString("0")))
            .toBe(true);
        expect(approxEquals(fromString("0"), fromString("1"), fromString("1/2")))
            .toBe(false);
    });
    test('bigint', () => {
        const big3 = fromString("3");
        const big5 = fromString("5");
        expect(approxEquals(big5, big5, fromString("0")))
            .toBe(true);
        expect(approxEquals(big3, big5, fromString("2")))
            .toBe(true);
        expect(approxEquals(big3, big5, fromString("1")))
            .toBe(false);
    });
});

describe('lessThan', () => {
    test('racket docs examples', () => {
        expect(lessThan(fromString("1")))
            .toBe(true);
        expect(lessThan(fromString("1"), fromString("1")))
            .toBe(false);
        expect(lessThan(fromString("1"), fromString("2"), fromString("3")))
            .toBe(true);
        expect(lessThan(fromString("1"), fromString("+inf.0")))
            .toBe(true);
        expect(lessThan(fromString("1"), fromString("+nan.0")))
            .toBe(false);
    });
    test('Inexact numbers', () => {
        expect(lessThan(fromString(`5.0`), fromString(`5.0`)))
            .toBe(false);
        expect(lessThan(fromString(`3.0`), fromString(`5.0`)))
            .toBe(true);
        expect(lessThan(fromString("1.0"), fromString("1.0")))
            .toBe(false);
        expect(lessThan(fromString("0.0"), fromString("1.0")))
            .toBe(true);
        expect(lessThan(fromString("1.0"), fromString("0.0")))
            .toBe(false);
    });
    test('Exact numbers', () => {
        expect(lessThan(fromString("1"), fromString("1")))
            .toBe(false);
        expect(lessThan(fromString("0"), fromString("1")))
            .toBe(true);
        expect(lessThan(fromString("1"), fromString("0")))
            .toBe(false);
    });
    test('bigint', () => {
        const big3 = fromString(`3`);
        const big5 = fromString(`5`);
        expect(lessThan(big5, big5))
            .toBe(false);
        expect(lessThan(big3, big5))
            .toBe(true);
        expect(lessThan(big5, big3))
            .toBe(false);
    });
    test('multi-arity', () => {
        const big5 = fromString(`5`);
        const small5 = fromString(`5.0`);
        expect(lessThan(fromString(`5.0`), small5, big5))
            .toBe(false);
        expect(lessThan(fromString(`3.0`), small5, fromString(`6.0`)))
            .toBe(true);
    });
    test('NaN', () => {
        expect(lessThan(fromString(`5.0`), fromString("+nan.0")))
            .toBe(false);
        expect(lessThan(fromString("+nan.0"), fromString(`5.0`)))
            .toBe(false);
        expect(lessThan(fromString("+nan.0"), fromString("+nan.0")))
            .toBe(false);
    });
});

describe('lessThanOrEqual', () => {
    test('racket docs examples', () => {
        expect(lessThanOrEqual(fromString("1")))
            .toBe(true);
        expect(lessThanOrEqual(fromString("1"), fromString("1")))
            .toBe(true);
        expect(lessThanOrEqual(fromString("1"), fromString("2"), fromString(`3`)))
            .toBe(true);
        expect(lessThanOrEqual(fromString("1"), fromString("2"), fromString("1")))
            .toBe(false);
        expect(lessThanOrEqual(fromString("1"), fromString("+inf.0")))
            .toBe(true);
        expect(lessThanOrEqual(fromString("1"), fromString("+nan.0")))
            .toBe(false);
    });
    test('Inexact numbers', () => {
        expect(lessThanOrEqual(fromString(`5.0`), fromString(`5.0`)))
            .toBe(true);
        expect(lessThanOrEqual(fromString(`3.0`), fromString(`5.0`)))
            .toBe(true);
        expect(lessThanOrEqual(fromString("1.0"), fromString("1.0")))
            .toBe(true);
        expect(lessThanOrEqual(fromString("0.0"), fromString("1.0")))
            .toBe(true);
        expect(lessThanOrEqual(fromString("1.0"), fromString("0.0")))
            .toBe(false);
    });
    test('Exact numbers', () => {
        expect(lessThanOrEqual(fromString("1"), fromString("1")))
            .toBe(true);
        expect(lessThanOrEqual(fromString("0"), fromString("1")))
            .toBe(true);
        expect(lessThanOrEqual(fromString("1"), fromString("0")))
            .toBe(false);
    });
    test('big numbers', () => {
        const big3 = fromString(`3`);
        const big5 = fromString(`5`);
        expect(lessThanOrEqual(big5, big5))
            .toBe(true);
        expect(lessThanOrEqual(big3, big5))
            .toBe(true);
        expect(lessThanOrEqual(big5, big3))
            .toBe(false);
    });
    test('multi-arity', () => {
        const big5 = fromString(`5`);
        const small5 = fromString(`5.0`);
        expect(lessThanOrEqual(fromString(`5.0`), small5, big5))
            .toBe(true);
        expect(lessThanOrEqual(fromString(`3.0`), small5, fromString(`6.0`)))
            .toBe(true);
    });
    test('NaN', () => {
        expect(lessThanOrEqual(fromString(`5.0`), fromString("+nan.0")))
            .toBe(false);
        expect(lessThanOrEqual(fromString("+nan.0"), fromString(`5.0`)))
            .toBe(false);
        expect(lessThanOrEqual(fromString("+nan.0"), fromString("+nan.0")))
            .toBe(false);
    });
});

describe('greaterThan', () => {
    test('racket docs examples', () => {
        expect(greaterThan(fromString("1")))
            .toBe(true);
        expect(greaterThan(fromString("1"), fromString("1")))
            .toBe(false);
        expect(greaterThan(fromString(`3`), fromString("2"), fromString("1")))
            .toBe(true);
        expect(greaterThan(fromString("+inf.0"), fromString("1")))
            .toBe(true);
        expect(greaterThan(fromString("+nan.0"), fromString("1")))
            .toBe(false);
    });
    test('Inexact numbers', () => {
        expect(greaterThan(fromString(`5.0`), fromString(`5.0`)))
            .toBe(false);
        expect(greaterThan(fromString(`3.0`), fromString(`5.0`)))
            .toBe(false);
        expect(greaterThan(fromString(`5.0`), fromString(`3.0`)))
            .toBe(true);
        expect(greaterThan(fromString("1.0"), fromString("1.0")))
            .toBe(false);
        expect(greaterThan(fromString("0.0"), fromString("1.0")))
            .toBe(false);
        expect(greaterThan(fromString("1.0"), fromString("0.0")))
            .toBe(true);
    });
    test('Exact numbers', () => {
        expect(greaterThan(fromString("1"), fromString("1")))
            .toBe(false);
        expect(greaterThan(fromString("0"), fromString("1")))
            .toBe(false);
        expect(greaterThan(fromString("1"), fromString("0")))
            .toBe(true);
    });
    test('big numbers', () => {
        const big3 = fromString(`3`);
        const big5 = fromString(`5`);
        expect(greaterThan(big5, big5))
            .toBe(false);
        expect(greaterThan(big3, big5))
            .toBe(false);
        expect(greaterThan(big5, big3))
            .toBe(true);
    });
    test('multi-arity', () => {
        const big5 = fromString(`5`);
        const small5 = fromString(`5.0`);
        expect(greaterThan(fromString(`5.0`), small5, big5))
            .toBe(false);
        expect(greaterThan(fromString(`6.0`), small5, fromString(`3.0`)))
            .toBe(true);
        expect(greaterThan(fromString(`3.0`), small5, fromString(`6.0`)))
            .toBe(false);
    });
    test('NaN', () => {
        expect(greaterThan(fromString(`5.0`), fromString("+nan.0")))
            .toBe(false);
        expect(greaterThan(fromString("+nan.0"), fromString(`5.0`)))
            .toBe(false);
        expect(greaterThan(fromString("+nan.0"), fromString("+nan.0")))
            .toBe(false);
    });
});

describe('greaterThanOrEqual', () => {
    test('racket docs examples', () => {
        expect(greaterThanOrEqual(fromString("1")))
            .toBe(true);
        expect(greaterThanOrEqual(fromString("1"), fromString("1")))
            .toBe(true);
        expect(greaterThanOrEqual(fromString(`3`), fromString("2"), fromString("1")))
            .toBe(true);
        expect(greaterThanOrEqual(fromString("1"), fromString("2"), fromString("1")))
            .toBe(false);
        expect(greaterThanOrEqual(fromString("+inf.0"), fromString("1")))
            .toBe(true);
        expect(greaterThanOrEqual(fromString("+nan.0"), fromString("1")))
            .toBe(false);
    });
    test('Inexact numbers', () => {
        expect(greaterThanOrEqual(fromString(`5.0`), fromString(`5.0`)))
            .toBe(true);
        expect(greaterThanOrEqual(fromString(`3.0`), fromString(`5.0`)))
            .toBe(false);
        expect(greaterThanOrEqual(fromString(`5.0`), fromString(`3.0`)))
            .toBe(true);
        expect(greaterThanOrEqual(fromString("1.0"), fromString("1.0")))
            .toBe(true);
        expect(greaterThanOrEqual(fromString("0.0"), fromString("1.0")))
            .toBe(false);
        expect(greaterThanOrEqual(fromString("1.0"), fromString("0.0")))
            .toBe(true);
    });
    test('Exact numbers', () => {
        expect(greaterThanOrEqual(fromString("1"), fromString("1")))
            .toBe(true);
        expect(greaterThanOrEqual(fromString("0"), fromString("1")))
            .toBe(false);
        expect(greaterThanOrEqual(fromString("1"), fromString("0")))
            .toBe(true);
    });
    test('big numbers', () => {
        const big3 = fromString(`3`);
        const big5 = fromString(`5`);
        expect(greaterThanOrEqual(big5, big5))
            .toBe(true);
        expect(greaterThanOrEqual(big3, big5))
            .toBe(false);
        expect(greaterThanOrEqual(big5, big3))
            .toBe(true);
    });
    test('multi-arity', () => {
        const big5 = fromString(`5`);
        const small5 = fromString(`5.0`);
        expect(greaterThanOrEqual(fromString(`5.0`), small5, big5))
            .toBe(true);
        expect(greaterThanOrEqual(fromString(`3.0`), small5, fromString(`6.0`)))
            .toBe(false);
        expect(greaterThanOrEqual(fromString(`6.0`), small5, fromString(`3.0`)))
            .toBe(true);
    });
    test('NaN', () => {
        expect(greaterThanOrEqual(fromString(`5.0`), fromString("+nan.0")))
            .toBe(false);
        expect(greaterThanOrEqual(fromString("+nan.0"), fromString(`5.0`)))
            .toBe(false);
        expect(greaterThanOrEqual(fromString("+nan.0"), fromString("+nan.0")))
            .toBe(false);
    });
});
