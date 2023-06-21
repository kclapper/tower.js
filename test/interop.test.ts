/* eslint @typescript-eslint/no-explicit-any: "off" */

import {describe, expect, test} from '@jest/globals';
import {
    BoxedNumber,
} from '../src/tower';

// Please forgive this helper function for
// confusing the typechecker.

const makeNumber = function(x: any): number {
    return BoxedNumber.makeInstance(x) as unknown as number;
}

describe('string', () => {
    test('coercion', () => {
        expect(String(makeNumber({num: 5}))).toBe("5.0");
        expect(String(makeNumber({num: 5, den: 1}))).toBe("5");
        expect(String(makeNumber({num: 5, den: 2}))).toBe("5/2");
        expect(String(makeNumber({num: 5, den: 1, imagNum: 3, imagDen: 1}))).toBe("5+3i");
        expect(String(makeNumber({num: 5, den: 2, imagNum: 3, imagDen: 2}))).toBe("5/2+3/2i");
        expect(String(makeNumber({num: 5, imagNum: 3}))).toBe("5.0+3.0i");
    });
    test('concatenation', () => {
        expect("Hello" + makeNumber({num: 5})).toBe("Hello5");
    });
    test('template string', () => {
        expect(`${makeNumber({num: 5})}`).toBe("5.0");
    });
});

describe('addition', () => {
    test('inexact', () => {
        expect(5 + makeNumber({num: 5})).toBe(10);
        expect(5 + makeNumber({num: 5.5})).toBe(10.5);
    });
    test('exact', () => {
        expect(5 + makeNumber({num: 5, den: 1})).toBe(10);
        expect(5 + makeNumber({num: 11, den: 2})).toBe(10.5);
    });
    test('complex', () => {
        expect(5 + makeNumber({num: 5, imagNum: 2})).toBe(NaN);
    });
});

describe('subtraction', () => {
    test('inexact', () => {
        expect(5 - makeNumber({num: 5})).toBe(0);
        expect(5 - makeNumber({num: 5.5})).toBe(-0.5);
    });
    test('exact', () => {
        expect(5 - makeNumber({num: 5, den: 1})).toBe(0);
        expect(5 - makeNumber({num: 11, den: 2})).toBe(-0.5);
    });
    test('complex', () => {
        expect(5 - makeNumber({num: 5, imagNum: 2})).toBe(NaN);
    });
});

describe('multiplication', () => {
    test('inexact', () => {
        expect(5 * makeNumber({num: 5})).toBe(25);
        expect(5 * makeNumber({num: 5.5})).toBe(27.5);
    });
    test('exact', () => {
        expect(5 * makeNumber({num: 5, den: 1})).toBe(25);
        expect(5 * makeNumber({num: 11, den: 2})).toBe(27.5);
    });
    test('complex', () => {
        expect(5 * makeNumber({num: 5, imagNum: 2})).toBe(NaN);
    });
});

describe('division', () => {
    test('inexact', () => {
        expect(5 / makeNumber({num: 5})).toBe(1);
        expect(5 / makeNumber({num: 5.5})).toBe(0.9090909090909091);
    });
    test('exact', () => {
        expect(5 / makeNumber({num: 5, den: 1})).toBe(1);
        expect(5 / makeNumber({num: 11, den: 2})).toBe(0.9090909090909091);
    });
    test('complex', () => {
        expect(5 / makeNumber({num: 5, imagNum: 2})).toBe(NaN);
    });
});

describe('comparison', () => {
    test('inexact', () => {
        expect(5 > makeNumber({num: 5})).toBe(false);
        expect(5 >= makeNumber({num: 5})).toBe(true);
        expect(5 <= makeNumber({num: 5.5})).toBe(true);
    });
    test('exact', () => {
        expect(5 > makeNumber({num: 5, den: 1})).toBe(false);
        expect(5 >= makeNumber({num: 5, den: 1})).toBe(true);
        expect(5 <= makeNumber({num: 11, den: 2})).toBe(true);
    });
    test('complex', () => {
        expect(5 < makeNumber({num: 5, imagNum: 2})).toBe(false);
    });
});
