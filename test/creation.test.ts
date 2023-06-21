import {describe, expect, test} from '@jest/globals';
import {
    BoxedNumber,
    toFixnum,
    fromJSNumber,
    boxFixnum,
    fromString,
    NAN,
    INF,
    NEG_INF,
    makeNumber,
    makeComplexNumber
} from '../src/tower';

const makeInstance = BoxedNumber.makeInstance;

test('toFixnum', () => {
    expect(toFixnum(5)).toBe(5);
    expect(toFixnum(BigInt(5))).toBe(BigInt(5));
    expect(toFixnum(makeInstance({num: 5, den: 7})))
        .toBe(0);
});

test('fromJSNumber', () => {
    expect(fromJSNumber(5)).toBe(5);
    expect(fromJSNumber(BigInt(5))).toBe(BigInt(5));
    expect(fromJSNumber(5.5))
        .toEqual(makeInstance({num: 5.5}));
});

test('boxFixnum', () => {
    expect(boxFixnum(5)).toEqual(makeInstance({num: 5, den: 1}));
    expect(boxFixnum(BigInt(5))).toEqual(makeInstance({num: BigInt(5), den: BigInt(1)}));
});

describe('fromString', () => {
    test("integer", () => {
        expect(fromString("5")).toBe(5);
    });
    test("fraction", () => {
        expect(fromString("9/7"))
            .toEqual(makeInstance({num: 9, den: 7}));
    });
    test("decimal", () => {
        expect(fromString("5.5"))
            .toEqual(makeInstance({num: 5.5}));
    });
    test("exact complex", () => {
        expect(fromString("9+7i"))
            .toEqual(makeInstance({num: 9, den: 1, imagNum: 7, imagDen: 1}));
        expect(fromString("9-7i"))
            .toEqual(makeInstance({num: 9, den: 1, imagNum: -7, imagDen: 1}));
        expect(fromString("17/3+7i"))
            .toEqual(makeInstance({num: 17, den: 3, imagNum: 7, imagDen: 1}));
        expect(fromString("9-17/3i"))
            .toEqual(makeInstance({num: 9, den: 1, imagNum: -17, imagDen: 3}));
        expect(fromString("17/3-17/3i"))
            .toEqual(makeInstance({num: 17, den: 3, imagNum: -17, imagDen: 3}));
    });
    test("inexact complex", () => {
        expect(fromString("6.7-10i"))
            .toEqual(makeInstance({num: 6.7, imagNum: -10}));
        expect(fromString("6-10.7i"))
            .toEqual(makeInstance({num: 6, imagNum: -10.7}));
        expect(fromString("6.7-10.7i"))
            .toEqual(makeInstance({num: 6.7, imagNum: -10.7}));
    });
    test("special values", () => {
        expect(fromString("+nan.0")).toEqual(NAN);
        expect(fromString("-nan.0")).toEqual(NAN);
        expect(fromString("+nan.f")).toEqual(NAN);
        expect(fromString("-nan.f")).toEqual(NAN);

        expect(fromString("+inf.0")).toEqual(INF);
        expect(fromString("+inf.f")).toEqual(INF);

        expect(fromString("-inf.0")).toEqual(NEG_INF);
        expect(fromString("-inf.f")).toEqual(NEG_INF);

        expect((fromString("-0.0") as BoxedNumber).isNegativeZero()).toBe(true);
    });
    test("big numbers", () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2);
        const bignumberstr = bignumber.toString();

        expect(fromString(bignumberstr))
            .toBe(bignumber);
        expect(fromString(`${bignumberstr}/${7}`))
            .toEqual(makeInstance({num: bignumber, den: BigInt(7)}));
        expect(fromString(`${bignumberstr}+${bignumberstr}i`))
            .toEqual(makeInstance({num: bignumber, den: BigInt(1), imagNum: bignumber, imagDen: BigInt(1)}));
    });
});

test('makeNumber', () => {
    expect(makeNumber(5, 1)).toBe(5);
    expect(makeNumber(5))
        .toEqual(makeInstance({num: 5}));
    expect(makeNumber(5, 2))
        .toEqual(makeInstance({num: 5, den: 2}));
    expect(makeNumber(BigInt(5), BigInt(1))).toBe(5);
    expect(makeNumber(BigInt(5), BigInt(2)))
        .toEqual(makeInstance({num: BigInt(5), den: BigInt(2)}));
});

test('makeComplexNumber', () => {
    expect(makeComplexNumber(5, 1, 3, 2))
        .toEqual(makeInstance({num: 5, den: 3, imagNum: 1, imagDen: 2}));
    expect(makeComplexNumber(5, 1))
        .toEqual(makeInstance({num: 5, imagNum: 1}));
    expect(makeComplexNumber(BigInt(5), BigInt(2), BigInt(1), BigInt(3)))
        .toEqual(makeInstance({num: BigInt(5), den: BigInt(1), imagNum: BigInt(2), imagDen: BigInt(3)}));
});
