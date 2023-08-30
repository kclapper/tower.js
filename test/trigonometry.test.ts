import {
    fromString,
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
        expect(sin(fromString(`3.14159`)))
            .toEqual(fromString(`2.65358979335273e-6`));
        expect(sin(fromString(`1.0+5.0i`)))
            .toEqual(fromString(`62.44551846769653+40.0921657779984i`));
    });
    test('special values', () => {
        expect(sin(fromString("0")))
            .toEqual(fromString("0"));
        expect(sin(fromString(`${Math.PI}`)))
            .toEqual(fromString(`1.2246467991473532e-16`));
        expect(sin(fromString("1")))
            .toEqual(fromString(`0.8414709848078965`));
    });
});

describe('cos', () => {
    test('racket docs examples', () => {
        expect(cos(fromString(`3.14159`)))
            .toEqual(fromString(`-0.9999999999964793`));
        expect(cos(fromString(`1.0+5.0i`)))
            .toEqual(fromString(`40.095806306298826-62.43984868079963i`));
    });
    test('special values', () => {
        expect(cos(fromString("0")))
            .toEqual(fromString("1"));
        expect(cos(fromString(`${Math.PI}`)))
            .toEqual(fromString(`-1.0`));
        expect(cos(fromString("1")))
            .toEqual(fromString(`0.5403023058681398`));
    });
});

describe('tan', () => {
    test('racket docs examples', () => {
        expect(tan(fromString(`0.7854`)))
            .toEqual(fromString(`1.0000036732118496`));
        expect(tan(fromString(`1.0+5.0i`)))
            .toEqual(fromString(`8.256719834227923e-5+1.0000377833796006i`));
    });
    test('special values', () => {
        expect(tan(fromString("0")))
            .toEqual(fromString("0"));
        expect(tan(fromString(`${Math.PI}`)))
            .toEqual(fromString(`-1.2246467991473532e-16`));
        expect(tan(fromString(`1.0`)))
            .toEqual(fromString(`1.5574077246549023`));
    });
});

describe('asin', () => {
    test('racket docs examples', () => {
        expect(asin(fromString(`0.25`)))
            .toEqual(fromString(`0.25268025514207865`));
        expect(asin(fromString(`1.0+5.0i`)))
            .toEqual(fromString(`0.19379313655493208+2.3309746530493123i`));
    });
    test('special values', () => {
        expect(asin(fromString("0")))
            .toEqual(fromString("0"));
        expect(asin(fromString(`${Math.PI}`)))
            .toEqual(fromString(`1.5707963267948966-1.811526272460853i`));
        expect(asin(fromString("1")))
            .toEqual(fromString(`1.5707963267948966`));
    });
});

describe('acos', () => {
    test('racket docs examples', () => {
        expect(acos(fromString(`0.25`)))
            .toEqual(fromString(`1.318116071652818`));
        expect(acos(fromString(`1.0+5.0i`)))
            .toEqual(fromString(`1.3770031902399649-2.330974653049312i`));
    });
    test('special values', () => {
        expect(acos(fromString("0")))
            .toEqual(fromString(`1.5707963267948966`));
        expect(acos(fromString(`${Math.PI}`)))
            .toEqual(fromString(`0.0+1.8115262724608532i`));
        expect(acos(fromString("1")))
            .toEqual(fromString("0"));
    });
});

describe('atan', () => {
    test('racket docs examples', () => {
        expect(atan(fromString(`0.5`)))
            .toEqual(fromString(`0.4636476090008061`));
        expect(atan(fromString(`2.0`), fromString(`1.0`)))
            .toEqual(fromString(`1.1071487177940904`));
        expect(atan(fromString(`-2.0`), fromString(`-1.0`)))
            .toEqual(fromString(`-2.0344439357957027`));
        expect(atan(fromString(`1.0+5.0i`)))
            .toEqual(fromString(`1.530881333938778+0.19442614214700213i`));
        expect(atan(fromString("+inf.0"), fromString("-inf.0")))
            .toEqual(fromString(`2.356194490192345`));
    });
    test('atan2', () => {
        expect(atan(fromString(`1.0`), fromString(`1.0`)))
            .toEqual(fromString(`0.7853981633974483`));
        expect(atan(fromString(`1.0`), fromString(`-1.0`)))
            .toEqual(fromString(`2.356194490192345`));
        expect(atan(fromString(`-1.0`), fromString(`-1.0`)))
            .toEqual(fromString(`-2.356194490192345`));
        expect(atan(fromString(`-1.0`), fromString(`1.0`)))
            .toEqual(fromString(`-0.7853981633974483`));
        expect(atan(fromString(`0.0`), fromString(`-1.0`)))
            .toEqual(fromString(`${Math.PI}`));
    });
    test('special values', () => {
        expect(atan(fromString(`0.0`)))
            .toEqual(fromString(`0.0`));
        expect(atan(fromString(`${Math.PI}`)))
            .toEqual(fromString(`1.2626272556789115`));
        expect(atan(fromString(`1.0`)))
            .toEqual(fromString(`0.7853981633974483`));
        expect(atan(fromString("+inf.0"), fromString("-inf.0")))
            .toEqual(fromString(`2.356194490192345`));
        expect(atan(fromString("+inf.0"), fromString("+inf.0")))
            .toEqual(fromString(`0.7853981633974483`));
        expect(atan(fromString("-inf.0"), fromString("+inf.0")))
            .toEqual(fromString(`-0.7853981633974483`));
        expect(atan(fromString("-inf.0"), fromString("-inf.0")))
            .toEqual(fromString(`-2.356194490192345`));
    });
});

describe('sinh', () => {
    test('racket docs examples from other functions', () => {
        expect(sinh(fromString(`0.25`)))
            .toEqual(fromString(`0.25261231680816826`));
        expect(sinh(fromString(`1.0+5.0i`)))
            .toEqual(fromString(`0.3333601389479929-1.4796974784869428i`));
    });
    test('special values', () => {
        expect(sinh(fromString("0")))
            .toEqual(fromString("0"));
        expect(sinh(fromString(`${Math.PI}`)))
            .toEqual(fromString(`11.548739357257748`));
        expect(sinh(fromString("1")))
            .toEqual(fromString(`1.1752011936438014`));
    });
});

describe('cosh', () => {
    test('racket docs examples from other functions', () => {
        expect(cosh(fromString(`0.25`)))
            .toEqual(fromString(`1.0314130998795732`));
        expect(cosh(fromString(`1.0+5.0i`)))
            .toEqual(fromString(`0.43771362521767454-1.1269289521981367i`));
    });
    test('special values', () => {
        expect(cosh(fromString("0")))
            .toEqual(fromString(`1.0`));
        expect(cosh(fromString(`${Math.PI}`)))
            .toEqual(fromString(`11.591953275521519`));
        expect(cosh(fromString("1")))
            .toEqual(fromString(`1.5430806348152437`));
    });
});

describe('tanh', () => {
    test('racket docs examples from other functions', () => {
        expect(tanh(fromString(`0.25`)))
            .toEqual(fromString(`0.24491866240370913`));
        expect(tanh(fromString(`1.0+5.0i`)))
            .toEqual(fromString(`1.2407479829240697-0.1861094776473041i`));
    });
    test('special values', () => {
        expect(tanh(fromString("0")))
            .toEqual(fromString("0"));
        expect(tanh(fromString(`${Math.PI}`)))
            .toEqual(fromString(`0.99627207622075`));
        expect(tanh(fromString("1")))
            .toEqual(fromString(`0.7615941559557649`));
    });
});
