import {
    fromString,
    makeRectangular,
    makePolar,
    multiply,
    magnitude,
    angle,
    realPart,
    imaginaryPart,
    conjugate
} from '../src/tower';

describe('makeRectangular', () => {
    test('racket docs examples', () => {
        expect(makeRectangular(fromString(`3`), fromString(`4.0`)))
            .toEqual(fromString("3.0+4.0i"));
    });
    test('inexact numbers', () => {
        expect(makeRectangular(fromString("3.0"), fromString(`4.0`)))
            .toEqual(fromString("3.0+4.0i"));
        expect(makeRectangular(fromString("3.0"), fromString(`-4.0`)))
            .toEqual(fromString("3.0-4.0i"));
        expect(makeRectangular(fromString("3.0"), fromString(`0`)))
            .toEqual(fromString("3.0"));
        expect(makeRectangular(fromString("1.0"), fromString("1.0")))
            .toEqual(fromString("1.0+1.0i"));
        expect(makeRectangular(fromString("1.0"), fromString("0.0")))
            .toEqual(fromString("1.0+0.0i"));

        const bignumber = fromString(`${BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2)}`);
        expect(makeRectangular(bignumber, bignumber))
            .toEqual(fromString(`${bignumber}+${bignumber}i`));
    });
    test('exact numbers', () => {
        expect(makeRectangular(fromString("1"), fromString("1")))
            .toEqual(fromString("1+1i"));
        expect(makeRectangular(fromString("1"), fromString("0")))
            .toEqual(fromString("1"));
        expect(makeRectangular(fromString(`5`), fromString("1")))
            .toEqual(fromString("5+1i"));
    });
    test('mixed precision', () => {
        expect(makeRectangular(fromString("1.0"), fromString("1")))
            .toEqual(fromString("1.0+1.0i"));
        expect(makeRectangular(fromString("1"), fromString("1.0")))
            .toEqual(fromString("1.0+1.0i"));
    });
});

describe('makePolar', () => {
    test('racket docs examples', () => {
        expect(makePolar(fromString(`10.0`), multiply(fromString(`${Math.PI}`), fromString("1/2"))))
            .toEqual(fromString(`6.123233995736766e-16+10.0i`));
        expect(makePolar(fromString(`10.0`), multiply(fromString(`${Math.PI}`), fromString(`1/4`))))
            .toEqual(fromString(`7.0710678118654755+7.071067811865475i`));
    });
    test('inexact numbers', () => {
        expect(makePolar(fromString(`3.0`), fromString(`4.0`)))
            .toEqual(fromString(`-1.960930862590836-2.2704074859237844i`));
        expect(makePolar(fromString(`3.0`), fromString(`-4.0`)))
            .toEqual(fromString(`-1.960930862590836+2.2704074859237844i`));
        expect(makePolar(fromString(`3.0`), fromString("0")))
            .toEqual(fromString(`3.0`));
        expect(makePolar(fromString("1.0"), fromString("1.0")))
            .toEqual(fromString(`0.5403023058681398+0.84147098480789651i`));
        expect(makePolar(fromString("1.0"), fromString("0.0")))
            .toEqual(fromString("1.0+0.0i"));
    });
    test('big numbers', () => {
        const bignumber = fromString(`${BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2)}`);
        expect(makePolar(bignumber, bignumber))
            .toEqual(fromString(`-4760410950687404.0-7646445317608838.0i`));
        expect(makePolar(fromString(`5`), fromString("1")))
            .toEqual(fromString(`2.701511529340699+4.207354924039483i`));
    })
    test('exact numbers', () => {
        expect(makePolar(fromString("1"), fromString("1")))
            .toEqual(fromString(`0.5403023058681398+0.84147098480789651i`));
        expect(makePolar(fromString("1"), fromString("0")))
            .toEqual(fromString("1"));
    });
    test('mixed precision', () => {
        expect(makePolar(fromString("1.0"), fromString("1")))
            .toEqual(fromString(`0.5403023058681398+0.84147098480789651i`));
        expect(makePolar(fromString("1"), fromString("1.0")))
            .toEqual(fromString(`0.5403023058681398+0.84147098480789651i`));
    });
});

describe('magnitude', () => {
    test('racket docs examples', () => {
        expect(magnitude(fromString(`-3`)))
            .toEqual(fromString(`3`));
        expect(magnitude(fromString(`3.0`)))
            .toEqual(fromString(`3.0`));
        expect(magnitude(fromString(`3+4i`)))
            .toEqual(fromString(`5`));
    });
    test('infinity', () => {
        expect(magnitude(fromString("+inf.0+5i")))
            .toEqual(fromString("+inf.0"));
        expect(magnitude(fromString("5+inf.0i")))
            .toEqual(fromString("+inf.0"));
        expect(magnitude(fromString("-inf.0+5i")))
            .toEqual(fromString("+inf.0"));
        expect(magnitude(fromString("5-inf.0i")))
            .toEqual(fromString("+inf.0"));
    });
    test('exact numbers', () => {
        expect(magnitude(fromString(`5`)))
            .toEqual(fromString(`5`));
    });
});

describe('angle', () => {
    test('racket docs examples', () => {
        expect(angle(fromString(`-3`)))
            .toEqual(fromString(`${Math.PI}`));
        expect(angle(fromString("-1")))
            .toEqual(fromString(`${Math.PI}`));
        expect(angle(fromString(`3.0`)))
            .toEqual(fromString("0"));
        expect(angle(fromString(`3+4i`)))
            .toEqual(fromString(`0.9272952180016122`));
        expect(angle(fromString("+inf.0+inf.0i")))
            .toEqual(fromString(`0.7853981633974483`));
    });
    test('infinity', () => {
        expect(angle(fromString("+inf.0-inf.0i")))
            .toEqual(fromString(`-0.7853981633974483`));
        expect(angle(fromString("-inf.0-inf.0i")))
            .toEqual(fromString(`-2.356194490192345`));
        expect(angle(fromString("-inf.0+inf.0i")))
            .toEqual(fromString(`2.356194490192345`));

        expect(angle(fromString("+inf.0+5i")))
            .toEqual(fromString(`0.0`));
        expect(angle(fromString("+inf.0-5i")))
            .toEqual(fromString(`-0.0`));
        expect(angle(fromString("5+inf.0i")))
            .toEqual(fromString(`1.5707963267948966`));
        expect(angle(fromString("-5+inf.0i")))
            .toEqual(fromString(`1.5707963267948966`));

        expect(angle(fromString("-inf.0+5i")))
            .toEqual(fromString(`${Math.PI}`));
        expect(angle(fromString("-inf.0-5.0i")))
            .toEqual(fromString(`${-Math.PI}`));
        expect(angle(fromString("5.0-inf.0i")))
            .toEqual(fromString(`-1.5707963267948966`));
        expect(angle(fromString("-5.0-inf.0i")))
            .toEqual(fromString(`-1.5707963267948966`));
    });
    test('exact numbers', () => {
        expect(angle(fromString(`5`)))
            .toEqual(fromString("0"));
    });
});

describe('realPart', () => {
    test('racket docs examples', () => {
        expect(realPart(fromString(`3+4i`)))
            .toEqual(fromString(`3`));
        expect(realPart(fromString(`3.0+4.0i`)))
            .toEqual(fromString(`3.0`));
        expect(realPart(fromString(`5.0`)))
            .toEqual(fromString(`5.0`));
    });
    test('infinity', () => {
        expect(realPart(fromString("+inf.0-inf.0i")))
            .toEqual(fromString("+inf.0"));
        expect(realPart(fromString("-inf.0-inf.0i")))
            .toEqual(fromString("-inf.0"));
        expect(realPart(fromString("-inf.0+inf.0i")))
            .toEqual(fromString("-inf.0"));
    });
    test('exact numbers', () => {
        expect(realPart(fromString(`5`)))
            .toEqual(fromString(`5`));
    });
});

describe('imaginaryPart', () => {
    test('racket docs examples', () => {
        expect(imaginaryPart(fromString(`3+4i`)))
            .toEqual(fromString(`4`));
        expect(imaginaryPart(fromString(`3.0+4.0i`)))
            .toEqual(fromString(`4.0`));
        expect(imaginaryPart(fromString(`5.0`)))
            .toEqual(fromString("0"));
        expect(imaginaryPart(fromString("5.0+0.0i")))
            .toEqual(fromString(`0.0`));
    });
    test('infinity', () => {
        expect(imaginaryPart(fromString("+inf.0-inf.0i")))
            .toEqual(fromString("-inf.0"));
        expect(imaginaryPart(fromString("-inf.0+inf.0i")))
            .toEqual(fromString("+inf.0"));
    });
    test('exact numbers', () => {
        expect(imaginaryPart(fromString(`5`)))
            .toEqual(fromString("0"));
    });
});

describe('conjugate', () => {
    test('racket docs examples', () => {
        expect(conjugate(fromString("1")))
            .toEqual(fromString("1"));
        expect(conjugate(fromString(`3+4i`)))
            .toEqual(fromString(`3-4i`));
        expect(conjugate(fromString(`3.0+4.0i`)))
            .toEqual(fromString(`3.0-4.0i`));
    });
    test('infinity', () => {
        expect(conjugate(fromString("+inf.0-inf.0i")))
            .toEqual(fromString("+inf.0+inf.0i"));
        expect(conjugate(fromString("+inf.0+inf.0i")))
            .toEqual(fromString("+inf.0-inf.0i"));
    });
    test('exact numbers', () => {
        expect(conjugate(fromString(`5`)))
            .toEqual(fromString(`5`));
    });
});
