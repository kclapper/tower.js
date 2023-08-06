import {
    InexactNumber,
    ComplexNumber,
    EXACT_ZERO,
    EXACT_ONE,
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

describe('sin', () => {
    test('racket docs examples', () => {
        expect(sin(new InexactNumber(3.14159)))
            .toEqual(2.65358979335273e-6);
        expect(sin(new ComplexNumber(new InexactNumber(1),
                                     new InexactNumber(5))))
            .toEqual(new ComplexNumber(new InexactNumber(62.44551846769653),
                                       new InexactNumber(40.0921657779984)));
    });
    test('special values', () => {
        expect(sin(EXACT_ZERO))
            .toEqual(EXACT_ZERO);
        expect(sin(PI))
            .toEqual(1.2246467991473532e-16);
        expect(sin(EXACT_ONE))
            .toEqual(0.8414709848078965);
    });
});

describe('cos', () => {
    test('racket docs examples', () => {
        expect(cos(new InexactNumber(3.14159)))
            .toEqual(-0.9999999999964793);
        expect(cos(new ComplexNumber(new InexactNumber(1),
                                     new InexactNumber(5))))
            .toEqual(new ComplexNumber(new InexactNumber(40.095806306298826),
                                       new InexactNumber(-62.43984868079963)));
    });
    test('special values', () => {
        expect(cos(EXACT_ZERO))
            .toEqual(EXACT_ONE);
        expect(cos(PI))
            .toEqual(-1);
        expect(cos(EXACT_ONE))
            .toEqual(0.5403023058681398);
    });
});

describe('tan', () => {
    test('racket docs examples', () => {
        expect(tan(new InexactNumber(0.7854)))
            .toEqual(1.0000036732118496);
        expect(tan(new ComplexNumber(new InexactNumber(1),
                                     new InexactNumber(5))))
            .toEqual(new ComplexNumber(new InexactNumber(8.256719834227923e-5),
                                       new InexactNumber(1.0000377833796006)));
    });
    test('special values', () => {
        expect(tan(EXACT_ZERO))
            .toEqual(EXACT_ZERO);
        expect(tan(PI))
            .toEqual(-1.2246467991473532e-16);
        expect(tan(1))
            .toEqual(1.5574077246549023);
    });
});

describe('asin', () => {
    test('racket docs examples', () => {
        expect(asin(new InexactNumber(0.25)))
            .toEqual(0.25268025514207865);
        expect(asin(new ComplexNumber(new InexactNumber(1),
                                      new InexactNumber(5))))
            .toEqual(new ComplexNumber(new InexactNumber(0.19379313655493208),
                                       new InexactNumber(2.3309746530493123)));
    });
    test('special values', () => {
        expect(asin(EXACT_ZERO))
            .toEqual(EXACT_ZERO);
        expect(asin(PI))
            .toEqual(new ComplexNumber(new InexactNumber(1.5707963267948966),
                                       new InexactNumber(-1.811526272460853)));
        expect(asin(EXACT_ONE))
            .toEqual(1.5707963267948966);
    });
});

describe('acos', () => {
    test('racket docs examples', () => {
        expect(acos(new InexactNumber(0.25)))
            .toEqual(1.318116071652818);
        expect(acos(new ComplexNumber(new InexactNumber(1),
                                      new InexactNumber(5))))
            .toEqual(new ComplexNumber(new InexactNumber(1.3770031902399649),
                                       new InexactNumber(-2.330974653049312)));
    });
    test('special values', () => {
        expect(acos(EXACT_ZERO))
            .toEqual(1.5707963267948966);
        expect(acos(PI))
            .toEqual(new ComplexNumber(new InexactNumber(0),
                                       new InexactNumber(1.8115262724608532)));
        expect(acos(EXACT_ONE))
            .toEqual(EXACT_ZERO);
    });
});

describe('atan', () => {
    test('racket docs examples', () => {
        expect(atan(new InexactNumber(0.5)))
            .toEqual(0.4636476090008061);
        expect(atan(2, 1))
            .toEqual(1.1071487177940904);
        expect(atan(-2, -1))
            .toEqual(-2.0344439357957027);
        expect(atan(new ComplexNumber(new InexactNumber(1),
                                      new InexactNumber(5))))
            .toEqual(new ComplexNumber(new InexactNumber(1.530881333938778),
                                       new InexactNumber(0.19442614214700213)));
        expect(atan(INF, NEG_INF))
            .toEqual(2.356194490192345);
    });
    test('atan2', () => {
        expect(atan(1, 1))
            .toEqual(0.7853981633974483);
        expect(atan(1, -1))
            .toEqual(2.356194490192345);
        expect(atan(-1, -1))
            .toEqual(-2.356194490192345);
        expect(atan(-1, 1))
            .toEqual(-0.7853981633974483);
        expect(atan(0, -1))
            .toEqual(Math.PI);
    });
    test('special values', () => {
        expect(atan(0))
            .toEqual(0);
        expect(atan(PI))
            .toEqual(1.2626272556789115);
        expect(atan(1))
            .toEqual(0.7853981633974483);
        expect(atan(INF, NEG_INF))
            .toEqual(2.356194490192345);
        expect(atan(INF, INF))
            .toEqual(0.7853981633974483);
        expect(atan(NEG_INF, INF))
            .toEqual(-0.7853981633974483);
        expect(atan(NEG_INF, NEG_INF))
            .toEqual(-2.356194490192345);
    });
});

describe('sinh', () => {
    test('racket docs examples from other functions', () => {
        expect(sinh(new InexactNumber(0.25)))
            .toEqual(0.25261231680816826);
        expect(sinh(new ComplexNumber(new InexactNumber(1),
                                      new InexactNumber(5))))
            .toEqual(new ComplexNumber(new InexactNumber(0.3333601389479929),
                                       new InexactNumber(-1.4796974784869428)));
    });
    test('special values', () => {
        expect(sinh(EXACT_ZERO))
            .toEqual(EXACT_ZERO);
        expect(sinh(PI))
            .toEqual(11.548739357257748);
        expect(sinh(EXACT_ONE))
            .toEqual(1.1752011936438014);
    });
});

describe('cosh', () => {
    test('racket docs examples from other functions', () => {
        expect(cosh(new InexactNumber(0.25)))
            .toEqual(1.0314130998795732);
        expect(cosh(new ComplexNumber(new InexactNumber(1),
                                      new InexactNumber(5))))
            .toEqual(new ComplexNumber(new InexactNumber(0.43771362521767454),
                                       new InexactNumber(-1.1269289521981367)));
    });
    test('special values', () => {
        expect(cosh(EXACT_ZERO))
            .toEqual(1);
        expect(cosh(PI))
            .toEqual(11.591953275521519);
        expect(cosh(EXACT_ONE))
            .toEqual(1.5430806348152437);
    });
});

describe('tanh', () => {
    test('racket docs examples from other functions', () => {
        expect(tanh(new InexactNumber(0.25)))
            .toEqual(0.24491866240370913);
        expect(tanh(new ComplexNumber(new InexactNumber(1),
                                      new InexactNumber(5))))
            .toEqual(new ComplexNumber(new InexactNumber(1.2407479829240697),
                                       new InexactNumber(-0.1861094776473041)));
    });
    test('special values', () => {
        expect(tanh(EXACT_ZERO))
            .toEqual(EXACT_ZERO);
        expect(tanh(PI))
            .toEqual(0.99627207622075);
        expect(tanh(EXACT_ONE))
            .toEqual(0.7615941559557649);
    });
});
