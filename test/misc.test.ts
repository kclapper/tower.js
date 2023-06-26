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

describe('toString', () => {
    test('integer: exact', () => {
        expect(makeInstance({num: 5, den: 1}).toString())
            .toBe("5");
        expect(makeInstance({num: 5, den: -1}).toString())
            .toBe("-5");
        expect(makeInstance({num: -5, den: 1}).toString())
            .toBe("-5");
        expect(makeInstance({num: -5, den: -1}).toString())
            .toBe("5");
    });
    test('integer: inexact', () => {
        expect(makeInstance({num: 5}).toString())
            .toBe("5.0");
        expect(makeInstance({num: -5}).toString())
            .toBe("-5.0");
    });
    test('real', () => {
        expect(NAN.toString()).toBe("+nan.0");
        expect(INF.toString()).toBe("+inf.0");
        expect(NEG_INF.toString()).toBe("-inf.0");
    });
    test('complex: exact', () => {
        expect(makeInstance({num: 5, den: 1, imagNum: 3, imagDen: 7}).toString())
            .toBe("5+3/7i");
        expect(makeInstance({num: 5, den: -1, imagNum: 3, imagDen: -7}).toString())
            .toBe("-5-3/7i");
        expect(makeInstance({num: 5, den: 1, imagNum: 3, imagDen: -7}).toString())
            .toBe("5-3/7i");
        expect(makeInstance({num: -5, den: 1, imagNum: -3, imagDen: 7}).toString())
            .toBe("-5-3/7i");
        expect(makeInstance({num: -5, den: -1, imagNum: -3, imagDen: -7}).toString())
            .toBe("5+3/7i");
        expect(divide(fromString("1-3i") as RacketNumber,
                      fromString("1+3i") as RacketNumber,
                      2,
                      5).toString())
            .toBe("-2/25-3/50i");
    });
    test('complex: inexact', () => {
        expect(makeInstance({num: 5, imagNum: 3}).toString())
            .toBe("5.0+3.0i");
        expect(makeInstance({num: 5, imagNum: -3}).toString())
            .toBe("5.0-3.0i");
        expect(makeInstance({num: -5, imagNum: 3}).toString())
            .toBe("-5.0+3.0i");
        expect(makeInstance({num: -5, imagNum: -3,}).toString())
            .toBe("-5.0-3.0i");
        expect(makeInstance({num: NaN, imagNum: NaN}).toString())
            .toBe("+nan.0+nan.0i");
    });
});
