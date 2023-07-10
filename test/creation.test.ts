import {
    InexactNumber,
    SmallExactNumber,
    BigExactNumber,
    ComplexNumber,
    makeComplexNumber,
    toFixnum,
    fromJSNumber,
    boxNumber,
    fromString,
    EXACT_ZERO,
    INEXACT_ZERO,
    EXACT_I,
    INEXACT_I,
    makeNumber,
} from '../src/tower';

// TODO:
test('toFixnum', () => {
    expect(toFixnum(5)).toBe(5);
    expect(toFixnum(BigInt(5))).toBe(BigInt(5));
    expect(toFixnum(new SmallExactNumber(5, 7)))
        .toBe(0);
});

// TODO:
test('fromJSNumber', () => {
    expect(fromJSNumber(5)).toBe(5);
    expect(fromJSNumber(BigInt(5))).toBe(BigInt(5));
    expect(fromJSNumber(5.5))
        .toEqual(new InexactNumber(5.5));
});

test('boxNumber', () => {
    expect(boxNumber(5)).toEqual(new InexactNumber(5));
    expect(boxNumber(5n)).toEqual(new SmallExactNumber(5, 1));
    expect(boxNumber(new SmallExactNumber(1))).toEqual(new SmallExactNumber(1));
});

describe('fromString', () => {
    test("incorrect", () => {
        expect(fromString("A")).toBe(false);
    });
    test("integer", () => {
        expect(fromString("5")).toBe(5n);
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
            .toBe(bignumber);
        expect(fromString(`${bignumberstr}/${7}`))
            .toEqual(new BigExactNumber(bignumber, 7n));
        expect(fromString(`${bignumberstr}+${bignumberstr}i`))
            .toEqual(new ComplexNumber(new BigExactNumber(bignumber),
                                       new BigExactNumber(bignumber)));
    });
});

// TODO:
test('makeNumber', () => {
    expect(makeNumber(5, 1)).toBe(5);
    expect(makeNumber(5))
        .toEqual(5);
    expect(makeNumber(5, 2))
        .toEqual(new SmallExactNumber(5, 2));
    expect(makeNumber(BigInt(5), BigInt(1))).toBe(5);
    expect(makeNumber(BigInt(5), BigInt(2)))
        .toEqual(new BigExactNumber(BigInt(5), BigInt(2)));
});

// TODO:
test('makeComplexNumber', () => {
    expect(makeComplexNumber({num: 0, den: 1}))
        .toEqual(new ComplexNumber(EXACT_ZERO, EXACT_ZERO));
    expect(makeComplexNumber({num: 0}))
        .toEqual(new ComplexNumber(INEXACT_ZERO, EXACT_ZERO));
    expect(makeComplexNumber({num: 0, den: 1, imagNum: 1, imagDen: 1}))
        .toEqual(EXACT_I);
    expect(makeComplexNumber({num: 0, imagNum: 1}))
        .toEqual(INEXACT_I);
    expect(makeComplexNumber({num: BigInt(1), den: BigInt(1)}))
        .toEqual(new ComplexNumber(new BigExactNumber(BigInt(1)), EXACT_ZERO));
});
