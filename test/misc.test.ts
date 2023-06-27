import {
    RacketNumber,
    BoxedNumber,
    inexactToExact,
    exactToInexact,
    NAN,
    INF,
    NEG_INF,
    divide,
    fromString,
    numberToString,
} from '../src/tower';

const makeInstance = BoxedNumber.makeInstance;

describe('inexactToExact', () => {
    test('fixnums', () => {
        expect(inexactToExact(5)).toBe(5);
        expect(inexactToExact(BigInt(5))).toBe(BigInt(5));
    });
    test('boxed numbers', () => {
        expect(inexactToExact(makeInstance({num: 5})))
            .toBe(5);
        expect(inexactToExact(makeInstance({num: 5.5})))
            .toEqual(makeInstance({num: 11, den: 2}));
        expect(inexactToExact(makeInstance({num: 5, den: 1})))
            .toBe(5);
        expect(inexactToExact(makeInstance({num: 5, den: 2})))
            .toEqual(makeInstance({num: 5, den: 2}));
    });
});

describe('exactToInexact', () => {
    test('fixnums', () => {
        expect(exactToInexact(5))
            .toEqual(makeInstance({num: 5}));
        expect(exactToInexact(BigInt(5)))
            .toEqual(makeInstance({num: 5}));
    });
    test('boxed numbers', () => {
        expect(exactToInexact(makeInstance({num: 5})))
            .toEqual(makeInstance({num: 5}));
        expect(exactToInexact(makeInstance({num: 5.5})))
            .toEqual(makeInstance({num: 5.5}));
        expect(exactToInexact(makeInstance({num: 5, den: 1})))
            .toEqual(makeInstance({num: 5}));
        expect(exactToInexact(makeInstance({num: 5, den: 2})))
            .toEqual(makeInstance({num: 2.5}));
    });
});

describe('numberToString', () => {
    test('integer: exact', () => {
        expect(numberToString(makeInstance({num: 5, den: 1})))
            .toBe("5");
        expect(numberToString(makeInstance({num: 5, den: -1})))
            .toBe("-5");
        expect(numberToString(makeInstance({num: -5, den: 1})))
            .toBe("-5");
        expect(numberToString(makeInstance({num: -5, den: -1})))
            .toBe("5");
    });
    test('integer: inexact', () => {
        expect(numberToString(makeInstance({num: 5})))
            .toBe("5.0");
        expect(numberToString(makeInstance({num: -5})))
            .toBe("-5.0");
    });
    test('real', () => {
        expect(numberToString(NAN)).toBe("+nan.0");
        expect(numberToString(INF)).toBe("+inf.0");
        expect(numberToString(NEG_INF)).toBe("-inf.0");
    });
    test('complex: exact', () => {
        expect(numberToString(makeInstance({num: 5, den: 1, imagNum: 3, imagDen: 7})))
            .toBe("5+3/7i");
        expect(numberToString(makeInstance({num: 5, den: -1, imagNum: 3, imagDen: -7})))
            .toBe("-5-3/7i");
        expect(numberToString(makeInstance({num: 5, den: 1, imagNum: 3, imagDen: -7})))
            .toBe("5-3/7i");
        expect(numberToString(makeInstance({num: -5, den: 1, imagNum: -3, imagDen: 7})))
            .toBe("-5-3/7i");
        expect(numberToString(makeInstance({num: -5, den: -1, imagNum: -3, imagDen: -7})))
            .toBe("5+3/7i");
        expect(numberToString(divide(fromString("1-3i") as RacketNumber,
                                     fromString("1+3i") as RacketNumber,
                                     2,
                                     5)))
            .toBe("-2/25-3/50i");
    });
    test('complex: inexact', () => {
        expect(numberToString(makeInstance({num: 5, imagNum: 3})))
            .toBe("5.0+3.0i");
        expect(numberToString(makeInstance({num: 5, imagNum: -3})))
            .toBe("5.0-3.0i");
        expect(numberToString(makeInstance({num: -5, imagNum: 3})))
            .toBe("-5.0+3.0i");
        expect(numberToString(makeInstance({num: -5, imagNum: -3,})))
            .toBe("-5.0-3.0i");
        expect(numberToString(makeInstance({num: NaN, imagNum: NaN})))
            .toBe("+nan.0+nan.0i");
    });
});
