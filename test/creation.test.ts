import {
    InexactNumber,
    SmallExactNumber,
    BigExactNumber,
    ComplexNumber,
    boxNumber,
    fromString
} from '../src/tower';

test('boxNumber', () => {
    expect(boxNumber(5))
        .toEqual(new InexactNumber(5));
    expect(boxNumber(new SmallExactNumber(1)))
        .toEqual(new SmallExactNumber(1));
});

describe('fromString', () => {
    test("incorrect", () => {
        expect(() => fromString("A"))
            .toThrow();
    });
    test("integer", () => {
        expect(fromString("5"))
            .toEqual(new SmallExactNumber(5));
        expect(fromString((BigInt(Number.MAX_SAFE_INTEGER) + 5n).toString()))
            .toEqual(new BigExactNumber(BigInt(Number.MAX_SAFE_INTEGER) + 5n));
    });
    test("fraction", () => {
        expect(fromString("9/7"))
            .toEqual(new SmallExactNumber(9, 7));
    });
    test("decimal", () => {
        expect(fromString("5.5"))
            .toBe(5.5);
    });
    test("exact complex", () => {
        expect(fromString("9+7i"))
            .toEqual(new ComplexNumber(new SmallExactNumber(9),
                                       new SmallExactNumber(7)));
        expect(fromString("9-7i"))
            .toEqual(new ComplexNumber(new SmallExactNumber(9),
                                       new SmallExactNumber(-7)));
        expect(fromString("17/3+7i"))
            .toEqual(new ComplexNumber(new SmallExactNumber(17, 3),
                                       new SmallExactNumber(7)));
        expect(fromString("9-17/3i"))
            .toEqual(new ComplexNumber(new SmallExactNumber(9),
                                       new SmallExactNumber(-17, 3)));
        expect(fromString("17/3-17/3i"))
            .toEqual(new ComplexNumber(new SmallExactNumber(17, 3),
                                       new SmallExactNumber(-17, 3)));
    });
    test("inexact complex", () => {
        expect(fromString("6.7-10i"))
            .toEqual(new ComplexNumber(new InexactNumber(6.7),
                                       new InexactNumber(-10)));
        expect(fromString("6-10.7i"))
            .toEqual(new ComplexNumber(new InexactNumber(6),
                                       new InexactNumber(-10.7)));
        expect(fromString("6.7-10.7i"))
            .toEqual(new ComplexNumber(new InexactNumber(6.7),
                                       new InexactNumber(-10.7)));
    });
    test("special values", () => {
        expect(fromString("+nan.0")).toEqual(NaN);
        expect(fromString("-nan.0")).toEqual(NaN);
        expect(fromString("+nan.f")).toEqual(NaN);
        expect(fromString("-nan.f")).toEqual(NaN);

        expect(fromString("+inf.0")).toEqual(Infinity);
        expect(fromString("+inf.f")).toEqual(Infinity);

        expect(fromString("-inf.0")).toEqual(-Infinity);
        expect(fromString("-inf.f")).toEqual(-Infinity);

        expect(Object.is(-0.0, fromString("-0.0"))).toBe(true);
    });
    test("big numbers", () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER) + 2n;
        const bignumberstr = bignumber.toString();

        expect(fromString(bignumberstr))
            .toEqual(new BigExactNumber(bignumber));
        expect(fromString(`${bignumberstr}/${7}`))
            .toEqual(new BigExactNumber(bignumber, 7n));
        expect(fromString(`${bignumberstr}+${bignumberstr}i`))
            .toEqual(new ComplexNumber(new BigExactNumber(bignumber),
                                       new BigExactNumber(bignumber)));
    });
});
