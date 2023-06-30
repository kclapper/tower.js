import {
    RacketNumber,
    InexactNumber,
    SmallExactNumber,
    makeComplexNumber,
    inexactToExact,
    exactToInexact,
    NAN,
    INF,
    NEG_INF,
    divide,
    fromString,
    numberToString,
} from '../src/tower';

const makeInstance = makeComplexNumber;

describe('inexactToExact', () => {
    test('fixnums', () => {
        expect(inexactToExact(5)).toBe(5);
        expect(inexactToExact(BigInt(5))).toBe(BigInt(5));
    });
    test('boxed numbers', () => {
        expect(inexactToExact(new InexactNumber(5)))
            .toBe(5);
        expect(inexactToExact(new InexactNumber(5.5)))
            .toEqual(new SmallExactNumber(11, 2));
        expect(inexactToExact(new SmallExactNumber(5, 1)))
            .toBe(5);
        expect(inexactToExact(new SmallExactNumber(5, 2)))
            .toEqual(new SmallExactNumber(5, 2));
    });
});

describe('exactToInexact', () => {
    test('fixnums', () => {
        expect(exactToInexact(5))
            .toEqual(new InexactNumber(5));
        expect(exactToInexact(BigInt(5)))
            .toEqual(new InexactNumber(5));
    });
    test('boxed numbers', () => {
        expect(exactToInexact(new InexactNumber(5)))
            .toEqual(new InexactNumber(5));
        expect(exactToInexact(new InexactNumber(5.5)))
            .toEqual(new InexactNumber(5.5));
        expect(exactToInexact(new SmallExactNumber(5, 1)))
            .toEqual(new InexactNumber(5));
        expect(exactToInexact(new SmallExactNumber(5, 2)))
            .toEqual(new InexactNumber(2.5));
    });
});

describe('numberToString', () => {
    test('integer: exact', () => {
        expect(numberToString(new SmallExactNumber(5, 1)))
            .toBe("5");
        expect(numberToString(new SmallExactNumber(5, -1)))
            .toBe("-5");
        expect(numberToString(new SmallExactNumber(-5, 1)))
            .toBe("-5");
        expect(numberToString(new SmallExactNumber(-5, -1)))
            .toBe("5");
    });
    test('integer: inexact', () => {
        expect(numberToString(new InexactNumber(5)))
            .toBe("5.0");
        expect(numberToString(new InexactNumber(-5)))
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
