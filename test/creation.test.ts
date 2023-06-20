import {describe, expect, test} from '@jest/globals';
import {
    BoxedNumber,
    toFixnum,
    fromJSNumber,
    boxFixnum
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
