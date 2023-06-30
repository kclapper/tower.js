/* eslint @typescript-eslint/no-explicit-any: "off" */

import {
    makeComplexNumber,
    InexactNumber,
    SmallExactNumber,
} from '../src/tower';

// Please forgive this helper function for
// confusing the typechecker.

const makeNumber = function(x: any): number {
    return makeComplexNumber(x) as unknown as number;
}

describe('string', () => {
    test('coercion', () => {
        expect(String(new InexactNumber(5))).toBe("5.0");
        expect(String(new SmallExactNumber(5, 1))).toBe("5");
        expect(String(new SmallExactNumber(5, 2))).toBe("5/2");
        expect(String(makeNumber({num: 5, den: 1, imagNum: 3, imagDen: 1}))).toBe("5+3i");
        expect(String(makeNumber({num: 5, den: 2, imagNum: 3, imagDen: 2}))).toBe("5/2+3/2i");
        expect(String(makeNumber({num: 5, imagNum: 3}))).toBe("5.0+3.0i");
    });
    test('concatenation', () => {
        expect("Hello" + new InexactNumber(5)).toBe("Hello5");
    });
    test('template string', () => {
        expect(`${new InexactNumber(5) as unknown as number}`).toBe("5.0");
    });
});

describe('addition', () => {
    test('inexact', () => {
        expect(5 + (new InexactNumber(5) as unknown as number)).toBe(10);
        expect(5 + (new InexactNumber(5.5) as unknown as number)).toBe(10.5);
    });
    test('exact', () => {
        expect(5 + (new SmallExactNumber(5, 1) as unknown as number)).toBe(10);
        expect(5 + (new SmallExactNumber(11, 2) as unknown as number)).toBe(10.5);
    });
    test('complex', () => {
        expect(5 + makeNumber({num: 5, imagNum: 2})).toBe(NaN);
    });
});

describe('subtraction', () => {
    test('inexact', () => {
        expect(5 - (new InexactNumber(5) as unknown as number)).toBe(0);
        expect(5 - (new InexactNumber(5.5) as unknown as number)).toBe(-0.5);
    });
    test('exact', () => {
        expect(5 - (new SmallExactNumber(5, 1) as unknown as number)).toBe(0);
        expect(5 - (new SmallExactNumber(11, 2) as unknown as number)).toBe(-0.5);
    });
    test('complex', () => {
        expect(5 - makeNumber({num: 5, imagNum: 3})).toBe(NaN);
    });
});

describe('multiplication', () => {
    test('inexact', () => {
        expect(5 * (new InexactNumber(5) as unknown as number)).toBe(25);
        expect(5 * (new InexactNumber(5.5) as unknown as number)).toBe(27.5);
    });
    test('exact', () => {
        expect(5 * (new SmallExactNumber(5, 1) as unknown as number)).toBe(25);
        expect(5 * (new SmallExactNumber(11, 2) as unknown as number)).toBe(27.5);
    });
    test('complex', () => {
        expect(5 * makeNumber({num: 5, imagNum: 2})).toBe(NaN);
    });
});

describe('division', () => {
    test('inexact', () => {
        expect(5 / (new InexactNumber(5) as unknown as number)).toBe(1);
        expect(5 / (new InexactNumber(5.5) as unknown as number)).toBe(0.9090909090909091);
    });
    test('exact', () => {
        expect(5 / (new SmallExactNumber(5, 1) as unknown as number)).toBe(1);
        expect(5 / (new SmallExactNumber(11, 2) as unknown as number)).toBe(0.9090909090909091);
    });
    test('complex', () => {
        expect(5 / makeNumber({num: 5, imagNum: 2})).toBe(NaN);
    });
});

describe('comparison', () => {
    test('inexact', () => {
        expect(5 > (new InexactNumber(5) as unknown as number)).toBe(false);
        expect(5 >= (new InexactNumber(5) as unknown as number)).toBe(true);
        expect(5 <= (new InexactNumber(5.5) as unknown as number)).toBe(true);
    });
    test('exact', () => {
        expect(5 > (new SmallExactNumber(5, 1) as unknown as number)).toBe(false);
        expect(5 >= (new SmallExactNumber(5, 1) as unknown as number)).toBe(true);
        expect(5 <= (new SmallExactNumber(11, 2) as unknown as number)).toBe(true);
    });
    test('complex', () => {
        expect(5 < makeNumber({num: 5, imagNum: 2})).toBe(false);
    });
});
