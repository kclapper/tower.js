import {describe, expect, test} from '@jest/globals';
import {
    BoxedNumber,
    INEXACT_ONE,
    PI,
    INF,
    NEG_INF,
    sin,
    cos,
    tan,
    asin,
    acos,
    atan,
    sinh,
    cosh,
    tanh,
} from '../src/tower';

const makeInstance = BoxedNumber.makeInstance;

describe('sin', () => {
    test('racket docs examples', () => {
        expect(sin(makeInstance({num: 3.14159})))
            .toEqual(makeInstance({num: 2.65358979335273e-6}));
        expect(sin(makeInstance({num: 1, imagNum: 5})))
            .toEqual(makeInstance({num: 62.44551846769653, imagNum: 40.0921657779984}));
    });
    test('special values', () => {
        expect(sin(0)).toBe(0);
        expect(sin(PI))
            .toEqual(makeInstance({num: 1.2246467991473532e-16}));
        expect(sin(1))
            .toEqual(makeInstance({num: 0.8414709848078965}));
    });
    test('bigint', () => {
        expect(sin(BigInt(0))).toBe(0);
    });
});

describe('cos', () => {
    test('racket docs examples', () => {
        expect(cos(makeInstance({num: 3.14159})))
            .toEqual(makeInstance({num: -0.9999999999964793}));
        expect(cos(makeInstance({num: 1, imagNum: 5})))
            .toEqual(makeInstance({num: 40.095806306298826, imagNum: -62.43984868079963}));
    });
    test('special values', () => {
        expect(cos(0)).toBe(1);
        expect(cos(PI))
            .toEqual(makeInstance({num: -1}));
        expect(cos(1))
            .toEqual(makeInstance({num: 0.5403023058681398}));
    });
    test('bigint', () => {
        expect(cos(BigInt(0))).toBe(1);
    });
});

describe('tan', () => {
    test('racket docs examples', () => {
        expect(tan(makeInstance({num: 0.7854})))
            .toEqual(makeInstance({num: 1.0000036732118496}));
        expect(tan(makeInstance({num: 1, imagNum: 5})))
            .toEqual(makeInstance({num: 8.256719834227923e-5, imagNum: 1.0000377833796006}));
    });
    test('special values', () => {
        expect(tan(0)).toBe(0);
        expect(tan(PI))
            .toEqual(makeInstance({num: -1.2246467991473532e-16}));
        expect(tan(1))
            .toEqual(makeInstance({num: 1.5574077246549023}));
    });
    test('bigint', () => {
        expect(tan(BigInt(0))).toBe(0);
    });
});

describe('asin', () => {
    test('racket docs examples', () => {
        expect(asin(makeInstance({num: 0.25})))
            .toEqual(makeInstance({num: 0.25268025514207865}));
        expect(asin(makeInstance({num: 1, imagNum: 5})))
            .toEqual(makeInstance({num: 0.19379313655493208, imagNum: 2.3309746530493123}));
    });
    test('special values', () => {
        expect(asin(0)).toBe(0);
        expect(asin(PI))
            .toEqual(makeInstance({num: 1.5707963267948966, imagNum: -1.811526272460853}));
        expect(asin(1))
            .toEqual(makeInstance({num: 1.5707963267948966}));
    });
    test('bigint', () => {
        expect(asin(BigInt(0))).toBe(0);
    });
});

describe('acos', () => {
    test('racket docs examples', () => {
        expect(acos(makeInstance({num: 0.25})))
            .toEqual(makeInstance({num: 1.318116071652818}));
        expect(acos(makeInstance({num: 1, imagNum: 5})))
            .toEqual(makeInstance({num: 1.3770031902399649, imagNum: -2.330974653049312}));
    });
    test('special values', () => {
        expect(acos(0))
            .toEqual(makeInstance({num: 1.5707963267948966}));
        expect(acos(PI))
            .toEqual(makeInstance({num: 0, imagNum: 1.8115262724608532}));
        expect(acos(1))
            .toBe(0);
    });
    test('bigint', () => {
        expect(acos(BigInt(0)))
            .toEqual(makeInstance({num: 1.5707963267948966}));
    });
});

describe('atan', () => {
    test('racket docs examples', () => {
        expect(atan(makeInstance({num: 0.5})))
            .toEqual(makeInstance({num: 0.4636476090008061}));
        expect(atan(2, 1))
            .toEqual(makeInstance({num: 1.1071487177940904}));
        expect(atan(-2, -1))
            .toEqual(makeInstance({num: -2.0344439357957027}));
        expect(atan(makeInstance({num: 1, imagNum: 5})))
            .toEqual(makeInstance({num: 1.530881333938778, imagNum: 0.19442614214700213}));
        expect(atan(INF, NEG_INF))
            .toEqual(makeInstance({num: 2.356194490192345}));
    });
    test('atan2', () => {
        expect(atan(1, 1))
            .toEqual(makeInstance({num: 0.7853981633974483}));
        expect(atan(1, -1))
            .toEqual(makeInstance({num: 2.356194490192345}));
        expect(atan(-1, -1))
            .toEqual(makeInstance({num: -2.356194490192345}));
        expect(atan(-1, 1))
            .toEqual(makeInstance({num: -0.7853981633974483}));
    });
    test('special values', () => {
        expect(atan(0))
            .toBe(0);
        expect(atan(PI))
            .toEqual(makeInstance({num: 1.2626272556789115}));
        expect(atan(1))
            .toEqual(makeInstance({num: 0.7853981633974483}));
        expect(atan(INF, NEG_INF))
            .toEqual(makeInstance({num: 2.356194490192345}));
        expect(atan(INF, INF))
            .toEqual(makeInstance({num: 0.7853981633974483}));
        expect(atan(NEG_INF, INF))
            .toEqual(makeInstance({num: -0.7853981633974483}));
        expect(atan(NEG_INF, NEG_INF))
            .toEqual(makeInstance({num: -2.356194490192345}));
    });
    test('bigint', () => {
        expect(atan(BigInt(0)))
            .toBe(0);
    });
});

describe('sinh', () => {
    test('racket docs examples from other functions', () => {
        expect(sinh(makeInstance({num: 0.25})))
            .toEqual(makeInstance({num: 0.25261231680816826}));
        expect(sinh(makeInstance({num: 1, imagNum: 5})))
            .toEqual(makeInstance({num: 0.3333601389479929, imagNum: -1.4796974784869428}));
    });
    test('special values', () => {
        expect(sinh(0)).toBe(0);
        expect(sinh(PI))
            .toEqual(makeInstance({num: 11.548739357257748}));
        expect(sinh(1))
            .toEqual(makeInstance({num: 1.1752011936438014}));
    });
    test('bigint', () => {
        expect(sinh(BigInt(0)))
            .toBe(0);
    });
});

describe('cosh', () => {
    test('racket docs examples from other functions', () => {
        expect(cosh(makeInstance({num: 0.25})))
            .toEqual(makeInstance({num: 1.0314130998795732}));
        expect(cosh(makeInstance({num: 1, imagNum: 5})))
            .toEqual(makeInstance({num: 0.43771362521767454, imagNum: -1.1269289521981367}));
    });
    test('special values', () => {
        expect(cosh(0)).toEqual(INEXACT_ONE);
        expect(cosh(PI))
            .toEqual(makeInstance({num: 11.591953275521519}));
        expect(cosh(1))
            .toEqual(makeInstance({num: 1.5430806348152437}));
    });
    test('bigint', () => {
        expect(cosh(BigInt(0)))
            .toEqual(INEXACT_ONE);
    });
});

describe('tanh', () => {
    test('racket docs examples from other functions', () => {
        expect(tanh(makeInstance({num: 0.25})))
            .toEqual(makeInstance({num: 0.24491866240370913}));
        expect(tanh(makeInstance({num: 1, imagNum: 5})))
            .toEqual(makeInstance({num: 1.2407479829240697, imagNum: -0.1861094776473041}));
    });
    test('special values', () => {
        expect(tanh(0)).toBe(0);
        expect(tanh(PI))
            .toEqual(makeInstance({num: 0.99627207622075}));
        expect(tanh(1))
            .toEqual(makeInstance({num: 0.7615941559557649}));
    });
    test('bigint', () => {
        expect(tanh(BigInt(0)))
            .toBe(0);
    });
});
