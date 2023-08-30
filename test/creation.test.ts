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
    expect(boxNumber(5n))
        .toEqual(new SmallExactNumber(5));
    expect(boxNumber(BigInt(Number.MAX_SAFE_INTEGER) + 5n))
        .toEqual(new BigExactNumber(BigInt(Number.MAX_SAFE_INTEGER) + 5n));
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
            .toEqual(5n);
        expect(fromString("0"))
            .toEqual(0n);
        expect(fromString("-10"))
            .toEqual(-10n);
        expect(fromString((BigInt(Number.MAX_SAFE_INTEGER) + 5n).toString()))
            .toEqual(BigInt(Number.MAX_SAFE_INTEGER) + 5n);
    });
    test("fraction", () => {
        expect(fromString("9/7"))
            .toEqual(new SmallExactNumber(9, 7));
        expect(fromString(`${BigInt(Number.MAX_SAFE_INTEGER) + 5n}/${BigInt(Number.MAX_SAFE_INTEGER) + 5n}`))
            .toEqual(new BigExactNumber(BigInt(Number.MAX_SAFE_INTEGER) + 5n,
                                        BigInt(Number.MAX_SAFE_INTEGER) + 5n));
    });
    test("decimal", () => {
        expect(fromString("5.5"))
            .toBe(5.5);
        expect(fromString("5.0"))
            .toBe(5);
    });
    test('scientific', () => {
        expect(fromString("1.5e+9"))
            .toEqual(1.5e+9);
        expect(fromString("1.5e-9"))
            .toEqual(1.5e-9);
    })
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
        expect(fromString(`8.256719834227923e-5+1.0000377833796006i`))
            .toEqual(new ComplexNumber(new InexactNumber(8.256719834227923e-5),
                                       new InexactNumber(1.0000377833796006)));
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

        expect(fromString("+inf.0-inf.0i"))
            .toEqual(new ComplexNumber(new InexactNumber(Infinity),
                                       new InexactNumber(-Infinity)));
        expect(fromString("-inf.0+inf.0i"))
            .toEqual(new ComplexNumber(new InexactNumber(-Infinity),
                                       new InexactNumber(Infinity)));

        expect(fromString("+nan.0-nan.0i"))
            .toEqual(new ComplexNumber(new InexactNumber(NaN),
                                       new InexactNumber(NaN)));
        expect(fromString("-nan.0+nan.0i"))
            .toEqual(new ComplexNumber(new InexactNumber(NaN),
                                       new InexactNumber(NaN)));

        expect(fromString("+nan.0-inf.0i"))
            .toEqual(new ComplexNumber(new InexactNumber(NaN),
                                       new InexactNumber(-Infinity)));
        expect(fromString("+inf.0-nan.0i"))
            .toEqual(new ComplexNumber(new InexactNumber(Infinity),
                                       new InexactNumber(NaN)));
        expect(fromString("+inf.f-nan.fi"))
            .toEqual(new ComplexNumber(new InexactNumber(Infinity),
                                       new InexactNumber(NaN)));
        expect(fromString("+inf.f-inf.0i"))
            .toEqual(new ComplexNumber(new InexactNumber(Infinity),
                                       new InexactNumber(-Infinity)));
        expect(fromString("+inf.f-inf.0i"))
            .toEqual(new ComplexNumber(new InexactNumber(Infinity),
                                       new InexactNumber(-Infinity)));

        expect(Object.is(-0.0, fromString("-0.0"))).toBe(true);
    });
    test("big numbers", () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER) + 2n;
        const bignumberstr = bignumber.toString();

        expect(fromString(bignumberstr))
            .toEqual(bignumber);
        expect(fromString(`${bignumberstr}/${7}`))
            .toEqual(new BigExactNumber(bignumber, 7n));
        expect(fromString(`${bignumberstr}+${bignumberstr}i`))
            .toEqual(new ComplexNumber(new BigExactNumber(bignumber),
                                       new BigExactNumber(bignumber)));
    });
});
