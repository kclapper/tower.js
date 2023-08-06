import {
    RacketNumber,
    InexactNumber,
    SmallExactNumber,
    BigExactNumber,
    inexactToExact,
    exactToInexact,
    NAN,
    INF,
    NEG_INF,
    divide,
    fromString,
    numberToString,
    ComplexNumber,
    EXACT_TWO,
} from '../src/tower';

describe('inexactToExact', () => {
    test('unboxed', () => {
        expect(inexactToExact(5))
            .toEqual(new SmallExactNumber(5));
        expect(inexactToExact(5.5))
            .toEqual(new SmallExactNumber(11, 2));
    });
    test('boxed numbers', () => {
        expect(inexactToExact(new InexactNumber(5)))
            .toEqual(new SmallExactNumber(5));
        expect(inexactToExact(new InexactNumber(5.5)))
            .toEqual(new SmallExactNumber(11, 2));
        expect(inexactToExact(new SmallExactNumber(5)))
            .toEqual(new SmallExactNumber(5));
        expect(inexactToExact(new SmallExactNumber(5, 2)))
            .toEqual(new SmallExactNumber(5, 2));
    });
});

describe('exactToInexact', () => {
    test('unboxed', () => {
        expect(exactToInexact(5))
            .toEqual(5);
    });
    test('boxed numbers', () => {
        expect(exactToInexact(new InexactNumber(5)))
            .toEqual(5);
        expect(exactToInexact(new InexactNumber(5.5)))
            .toEqual(5.5);
        expect(exactToInexact(new SmallExactNumber(5, 1)))
            .toEqual(5);
        expect(exactToInexact(new SmallExactNumber(5, 2)))
            .toEqual(2.5);
    });
});

describe('numberToString', () => {
    test('unboxed', () => {
        expect(numberToString(5))
            .toEqual("5.0");
        expect(numberToString(-5))
            .toEqual("-5.0");
    });
    test('integer: exact', () => {
        expect(numberToString(new SmallExactNumber(5, 1)))
            .toEqual("5");
        expect(numberToString(new SmallExactNumber(5, -1)))
            .toEqual("-5");
        expect(numberToString(new SmallExactNumber(-5, 1)))
            .toEqual("-5");
        expect(numberToString(new SmallExactNumber(-5, -1)))
            .toEqual("5");
        expect(numberToString(new BigExactNumber(5n)))
            .toEqual("5");
        expect(numberToString(new BigExactNumber(-5n, 2n)))
            .toEqual("-5/2");
    });
    test('integer: inexact', () => {
        expect(numberToString(new InexactNumber(5)))
            .toEqual("5.0");
        expect(numberToString(new InexactNumber(-5)))
            .toEqual("-5.0");
    });
    test('real', () => {
        expect(numberToString(NAN))
            .toEqual("+nan.0");
        expect(numberToString(INF))
            .toEqual("+inf.0");
        expect(numberToString(NEG_INF))
            .toEqual("-inf.0");
        expect(numberToString(NaN))
            .toEqual("+nan.0");
        expect(numberToString(Infinity))
            .toEqual("+inf.0");
        expect(numberToString(-Infinity))
            .toEqual("-inf.0");
    });
    test('complex: exact', () => {
        expect(numberToString(new ComplexNumber(new SmallExactNumber(5),
                                                new SmallExactNumber(3, 7))))
            .toEqual("5+3/7i");
        expect(numberToString(new ComplexNumber(new SmallExactNumber(5, -1),
                                                new SmallExactNumber(3, -7))))
            .toEqual("-5-3/7i");
        expect(numberToString(new ComplexNumber(new SmallExactNumber(5),
                                                new SmallExactNumber(3, -7))))
            .toEqual("5-3/7i");
        expect(numberToString(new ComplexNumber(new SmallExactNumber(-5),
                                                new SmallExactNumber(-3, 7))))
            .toEqual("-5-3/7i");
        expect(numberToString(new ComplexNumber(new SmallExactNumber(-5, -1),
                                                new SmallExactNumber(-3, -7))))
            .toEqual("5+3/7i");
        expect(numberToString(divide(fromString("1-3i") as RacketNumber,
                                     fromString("1+3i") as RacketNumber,
                                     EXACT_TWO,
                                     new SmallExactNumber(5))))
            .toEqual("-2/25-3/50i");
    });
    test('complex: inexact', () => {
        expect(numberToString(new ComplexNumber(new InexactNumber(5),
                                                new InexactNumber(3))))
            .toEqual("5.0+3.0i");
        expect(numberToString(new ComplexNumber(new InexactNumber(5),
                                                new InexactNumber(-3))))
            .toEqual("5.0-3.0i");
        expect(numberToString(new ComplexNumber(new InexactNumber(-5),
                                                new InexactNumber(3))))
            .toEqual("-5.0+3.0i");
        expect(numberToString(new ComplexNumber(new InexactNumber(-5),
                                                new InexactNumber(-3))))
            .toEqual("-5.0-3.0i");
        expect(numberToString(new ComplexNumber(NAN, NAN)))
            .toEqual("+nan.0+nan.0i");
    });
});
