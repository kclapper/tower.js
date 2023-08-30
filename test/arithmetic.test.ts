import {
    fromString,
    add,
    subtract,
    multiply,
    divide,
    quotient,
    remainder,
    modulo,
    sqr,
    sqrt,
    integerSqrt,
    expt,
    exp,
    log,
    numerator,
    denominator,
    gcd,
    lcm,
    abs,
    floor,
    ceiling,
    round,
} from '../src/tower';

describe('+ operator', () => {
    test('no arguments', () => {
        expect(add())
            .toEqual(fromString("0"));
    });
    test('one argument', () => {
        expect(add(fromString("5")))
            .toEqual(fromString("5"));
    });
    test('exact numbers', () => {
        expect(add(fromString("1"), fromString("1")))
            .toEqual(fromString("2"));
    });
    test('inexact numbers', () => {
        expect(add(fromString("1.0"), fromString("1.0")))
            .toEqual(fromString("2.0"));
        expect(add(fromString("1"),
                   fromString("2.5")))
            .toEqual(fromString("3.5"));
    });
    test('Mixed precision', () => {
        expect(add(fromString("1"), fromString("1.0")))
            .toEqual(fromString("2.0"));
        expect(add(fromString("1.0"), fromString("1")))
            .toEqual(fromString("2.0"));
    });
    test('Multi arity', () => {
        expect(add(fromString("1.0"),
                   fromString("1"),
                   fromString("1.0"),
                   fromString("3.5")))
            .toEqual(fromString("6.5"));
    });
    test('big numbers', () => {
        expect(add(fromString(`${Number.MAX_SAFE_INTEGER}`),
                   fromString("2")))
            .toEqual(fromString(`${BigInt(Number.MAX_SAFE_INTEGER) + 2n}`));
        expect(add(fromString(`${Number.MAX_SAFE_INTEGER}`),
                   fromString(`2.0`)))
            .toEqual(fromString(`${BigInt(Number.MAX_SAFE_INTEGER) + 2n}.0`));
    });
    test('complex numbers', () => {
        const x = fromString("1.0+3.0i");
        const y = fromString("5.0+2.0i");
        const z = fromString("1+2i");
        const w = fromString("2+4i");

        expect(add(x, y))
            .toEqual(fromString("6.0+5.0i"));
        expect(add(z, w))
            .toEqual(fromString("3+6i"));
        expect(add(x, z))
            .toEqual(fromString("2.0+5.0i"));
        expect(add(x, fromString("1.0")))
            .toEqual(fromString("2.0+3.0i"));
        expect(add(fromString("1.0"), fromString("0+1i")))
            .toEqual(fromString("1.0+1.0i"));
    });
});

describe('- operator', () => {
    test('one argument', () => {
        expect(subtract(fromString(`1.0`)))
            .toEqual(fromString(`-1.0`));
        expect(subtract(fromString(`1`)))
            .toEqual(fromString(`-1`));
    });
    test('exact numbers', () => {
        expect(subtract(fromString(`1`), fromString(`1`)))
            .toEqual(fromString(`0`));
    });
    test('inexact numbers', () => {
        expect(subtract(fromString(`1.0`), fromString(`2.0`)))
            .toEqual(fromString(`-1.0`));
        expect(subtract(fromString(`1.0`), fromString(`1.0`)))
            .toEqual(fromString(`0.0`));
        expect(subtract(fromString(`1.0`),
                   fromString(`2.5`)))
            .toEqual(fromString(`-1.5`));
    });
    test('Mixed precision', () => {
        expect(subtract(fromString(`1`), fromString(`1.0`)))
            .toEqual(fromString(`0.0`));
        expect(subtract(fromString(`1.0`), fromString(`1.0`)))
            .toEqual(fromString(`0.0`));
    });
    test('Multi arity', () => {
        expect(subtract(fromString(`1.0`),
                        fromString(`1`),
                        fromString(`1.0`),
                        fromString(`3.5`)))
            .toEqual(fromString(`-4.5`));
    });
    test('big numbers', () => {
        expect(subtract(fromString(`${Number.MIN_SAFE_INTEGER}`), fromString(`2.0`)))
            .toEqual(fromString(`${BigInt(Number.MIN_SAFE_INTEGER) - 2n}.0`));
        expect(subtract(fromString(`${Number.MIN_SAFE_INTEGER}`), fromString(`2`)))
            .toEqual(fromString(`${BigInt(Number.MIN_SAFE_INTEGER) - BigInt(2)}`));
    })
    test('complex numbers', () => {
        const x = fromString("1.0+3.0i");
        const y = fromString("5.0+2.0i");
        const z = fromString("1+2i");
        const w = fromString("2+4i");

        expect(subtract(x, y))
            .toEqual(fromString("-4.0+1.0i"));
        expect(subtract(z, w))
            .toEqual(fromString("-1-2i"));
        expect(subtract(x, z))
            .toEqual(fromString("0.0+1.0i"));
        expect(subtract(x, fromString(`1.0`)))
            .toEqual(fromString("0.0+3.0i"));
        expect(subtract(fromString("1.0"), fromString("0+1i")))
            .toEqual(fromString("1.0-1.0i"));
    });
});

describe('* operator', () => {
    test('no arguments', () => {
        expect(multiply())
            .toEqual(fromString('1'));
    });
    test('one argument', () => {
        expect(multiply(fromString(`5.0`)))
            .toEqual(fromString('5.0'));
        expect(multiply(fromString(`1`)))
            .toEqual(fromString('1'));
    });

    test('exact numbers', () => {
        expect(multiply(fromString(`1`), fromString(`2`)))
            .toEqual(fromString('2'));
        expect(multiply(fromString(`1`), fromString("0+1i")))
            .toEqual(fromString("0+1i"));
    });
    test('inexact numbers', () => {
        expect(multiply(fromString(`1.0`), fromString(`1.0`)))
            .toEqual(fromString('1.0'));
        expect(multiply(fromString(`1.0`),
                   fromString(`2.5`)))
            .toEqual(fromString('2.5'));
    });
    test('Mixed precision', () => {
        expect(multiply(fromString("1"), fromString("1.0")))
            .toEqual(fromString('1.0'));
        expect(multiply(fromString(`1.0`), fromString("1.0")))
            .toEqual(fromString('1.0'));
        expect(multiply(fromString("0.0"), fromString(`1.0`)))
            .toEqual(fromString('0.0'));
        expect(multiply(fromString("0"), fromString(`1.0`)))
            .toEqual(fromString('0'));
    });
    test('Multi arity', () => {
        expect(multiply(fromString(`1.0`),
                        fromString("1"),
                        fromString("1.0"),
                        fromString(`3.5`)))
            .toEqual(fromString('3.5'));
    });
    test('big numbers', () => {
        expect(multiply(fromString(`${Number.MAX_SAFE_INTEGER}`),
                        fromString('2')))
            .toEqual(fromString(`${BigInt(Number.MAX_SAFE_INTEGER) * 2n}`));
        expect(multiply(fromString(`${Number.MAX_SAFE_INTEGER}`),
                        fromString('2')))
            .toEqual(fromString(`${BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)}`));
    })
    test('complex numbers', () => {
        const x = fromString('1.0+3.0i');
        const y = fromString('5.0+2.0i');
        const z = fromString('1+2i');
        const w = fromString('2+4i');

        expect(multiply(x, y))
            .toEqual(fromString('-1.0+17i'));
        expect(multiply(z, w))
            .toEqual(fromString('-6+8i'));
        expect(multiply(x, z))
            .toEqual(fromString('-5.0+5.0i'));
        expect(multiply(x, fromString(`1.0`)))
            .toEqual(fromString('1.0+3.0i'));
        expect(multiply(fromString('3.0'), fromString(`0+1i`)))
            .toEqual(fromString('0.0+3.0i'));
        expect(multiply(fromString("0"), fromString('0.0+1.0i')))
            .toEqual(fromString("0"));
        expect(multiply(fromString(`0+1i`), fromString('0.0+1.0i')))
            .toEqual(fromString('-1.0+0.0i'));
    });
});

describe('/ operator', () => {
    test('one argument', () => {
        expect(divide(fromString(`2.0`)))
            .toEqual(fromString(`0.5`));
        expect(divide(fromString("2")))
            .toEqual(fromString(`1/2`));
    });
    test('exact numbers', () => {
        expect(divide(fromString("1"), fromString("1")))
            .toEqual(fromString("1"));
        expect(divide(fromString("1"), fromString("2")))
            .toEqual(fromString(`1/2`));
    });
    test('inexact numbers', () => {
        expect(divide(fromString("1.0"), fromString("1.0")))
            .toEqual(fromString(`1.0`));
        expect(divide(fromString(`1.0`), fromString(`1.0`)))
            .toEqual(fromString(`1.0`));
        expect(divide(fromString(`1.0`),
                      fromString(`2.5`)))
            .toEqual(fromString(`${1 / 2.5}`));
    });
    test('Mixed precision', () => {
        expect(divide(fromString("1"), fromString("1.0")))
            .toEqual(fromString(`1.0`));
        expect(divide(fromString(`1.0`), fromString("1")))
            .toEqual(fromString(`1.0`));
    });
    test('Multi arity', () => {
        expect(divide(fromString(`1.0`),
                      fromString("1"),
                      fromString("1.0"),
                      fromString(`3.5`)))
            .toEqual(fromString(`${1 / 3.5}`));
    });
    test('big numbers', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(10);
        const arg = fromString(`${bignumber}/3`);
        const expected = fromString(`${bignumber}/6`);
        expect(divide(arg, fromString("2")))
            .toEqual(expected);
    });
    test('complex numbers', () => {
        const x = fromString('1.0+3.0i');
        const y = fromString('5.0+2.0i');
        const z = fromString('1+2i');
        const w = fromString('2+4i');

        expect(divide(x, y))
            .toEqual(fromString("0.37931034482758624+0.4482758620689655i"));
        expect(divide(z, w))
            .toEqual(fromString(`1/2+0i`));
        expect(divide(x, z))
            .toEqual(fromString(`1.4+0.2i`));
        expect(divide(x, fromString(`1.0`)))
            .toEqual(fromString(`1.0+3.0i`));
    });
});

describe('quotient', () => {
    test('exact numbers', () => {
        expect(quotient(fromString("1"), fromString("1")))
            .toEqual(fromString("1"));
    });
    test('inexact numbers', () => {
        expect(quotient(fromString(`1.0`), fromString(`2.0`)))
            .toEqual(fromString(`0.0`));
        expect(quotient(fromString("1.0"), fromString("1.0")))
            .toEqual(fromString(`1.0`));
        expect(quotient(fromString("1.0"),
                        fromString(`2.5`)))
            .toEqual(fromString(`0.0`));
    });
    test('Mixed precision', () => {
        expect(quotient(fromString("1"), fromString("1.0")))
            .toEqual(fromString(`1.0`));
        expect(quotient(fromString(`1.0`), fromString("1.0")))
            .toEqual(fromString(`1.0`));
    });
    test('big numbers', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER) * 10n;
        const arg = fromString(`${bignumber}`);
        expect(quotient(quotient(arg, fromString(`10`)), fromString("1"))) // HACK: extra divide by 1 to get from big
            .toEqual(fromString(`${Number.MAX_SAFE_INTEGER}`));            // exact number to small exact number.
    })
});

describe('remainder', () => {
    test('racket docs tests', () => {
       expect(remainder(fromString(`10.0`), fromString(`3.0`)))
           .toEqual(fromString(`1.0`));
       expect(remainder(fromString(`-10.0`), fromString(`3.0`)))
           .toEqual(fromString(`-1.0`));
       expect(remainder(fromString(`10.0`), fromString(`-3.0`)))
           .toEqual(fromString(`1.0`));
       expect(remainder(fromString(`-10.0`), fromString(`-3.0`)))
           .toEqual(fromString(`-1.0`));
    });
    test('exact numbers', () => {
        expect(remainder(fromString("1"), fromString("1")))
            .toEqual(fromString("0"));
        expect(remainder(fromString(`3/2`),
                      fromString("1")))
            .toEqual(fromString("1/2"));
    });
    test('inexact numbers', () => {
        expect(remainder(fromString(`1.0`), fromString(`2.0`)))
            .toEqual(fromString(`1.0`));
        expect(remainder(fromString("1.0"), fromString("1.0")))
            .toEqual(fromString("0.0"));
        expect(remainder(fromString(`2.5`),
                         fromString("1.0")))
            .toEqual(fromString(`0.5`));
    });
    test('Mixed precision', () => {
        expect(remainder(fromString("1"), fromString("1.0")))
            .toEqual(fromString("0.0"));
        expect(remainder(fromString("1.0"), fromString("1")))
            .toEqual(fromString("0.0"));
    });
    test('big numbers', () => {
        let bignumber = (BigInt(Number.MAX_SAFE_INTEGER) * 2n) + 1n;
        let arg = fromString(`${bignumber}`);
        expect(remainder(arg, fromString("2")))
            .toEqual(fromString("1"));

        bignumber = (BigInt(Number.MIN_SAFE_INTEGER) * 2n) - 1n;
        arg = fromString(`${bignumber}`);
        expect(remainder(arg, fromString("2")))
            .toEqual(fromString("-1"));
    })
});

describe('modulo', () => {
    test('racket docs tests', () => {
       expect(modulo(fromString(`10.0`), fromString(`3.0`)))
           .toEqual(fromString("1.0"));
       expect(modulo(fromString(`-10.0`), fromString(`3.0`)))
           .toEqual(fromString(`2.0`));
       expect(modulo(fromString(`10.0`), fromString(`-3.0`)))
           .toEqual(fromString(`-2.0`));
       expect(modulo(fromString(`-10.0`), fromString(`-3.0`)))
           .toEqual(fromString(`-1.0`));
    });
    test('exact numbers', () => {
        expect(modulo(fromString("1"), fromString("1")))
            .toEqual(fromString("0"));
        expect(modulo(fromString(`3/2`),
                      fromString("1")))
            .toEqual(fromString(`1/2`));
    });
    test('inexact numbers', () => {
        expect(modulo(fromString("1.0"), fromString(`2.0`)))
            .toEqual(fromString("1.0"));
        expect(modulo(fromString("1.0"), fromString("1.0")))
            .toEqual(fromString("0.0"));
        expect(modulo(fromString(`2.5`),
                      fromString("1.0")))
            .toEqual(fromString(`0.5`));
    });
    test('Mixed precision', () => {
        expect(modulo(fromString("1"), fromString("1.0")))
            .toEqual(fromString("0.0"));
        expect(modulo(fromString("1.0"), fromString("1.0")))
            .toEqual(fromString("0.0"));
    });
    test('big numbers', () => {
        let bignumber = (BigInt(Number.MAX_SAFE_INTEGER) * 2n) + 1n;
        let arg = fromString(`${bignumber}`);
        expect(modulo(arg, fromString("2")))
            .toEqual(fromString("1"));

        bignumber = (BigInt(Number.MIN_SAFE_INTEGER) * 2n) - 1n;
        arg = fromString(`${bignumber}`);
        expect(modulo(arg, fromString("2")))
            .toEqual(fromString("1"));
    })
});

describe('sqr', () => {
    test('exact numbers', () => {
        expect(sqr(fromString("1")))
            .toEqual(fromString("1"));
        expect(sqr(fromString(`3/2`)))
            .toEqual(fromString(`9/4`));
    });
    test('inexact numbers', () => {
        expect(sqr(fromString(`2.0`)))
            .toEqual(fromString(`4.0`));
        expect(sqr(fromString(`-1.0`)))
            .toEqual(fromString("1.0"));
        expect(sqr(fromString("1.0")))
            .toEqual(fromString("1.0"));
        expect(sqr(fromString(`2.5`)))
            .toEqual(fromString(`${2.5 * 2.5}`));
    });
    test('big numbers', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = fromString(`${bignumber}`);
        expect((sqr(arg)))
            .toEqual(fromString(`${bignumber * bignumber}`));
    });
    test('complex numbers', () => {
        expect(sqr(fromString("0+1i")))
            .toEqual(fromString("-1"));
    })
});

describe('sqrt', () => {
    test('exact numbers', () => {
        expect(sqrt(fromString("1")))
            .toEqual(fromString("1"));
        expect(sqrt(fromString(`3/2`)))
            .toEqual(fromString(`${Math.sqrt(3 / 2)}`));
        expect(sqrt(fromString("-1")))
            .toEqual(fromString("0+1i"));
    });
    test('inexact numbers', () => {
        expect(sqrt(fromString(`4.0`)))
            .toEqual(fromString(`2.0`));
        expect(sqrt(fromString("1.0")))
            .toEqual(fromString("1.0"));
        expect(sqrt(fromString(`2.5`)))
            .toEqual(fromString(`${Math.sqrt(2.5)}`));
    });
    test('big numbers', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = fromString(`${bignumber}`);
        expect(sqrt(multiply(arg, arg)))
            .toEqual(fromString(`${Number.MAX_SAFE_INTEGER}`));
    });
    test('complex numbers', () => {
        expect(sqrt(fromString("0+1i")))
            .toEqual(fromString(`0.7071067811865475+0.7071067811865475i`));
        expect(sqrt(fromString(`25.0-10.0i`)))
            .toEqual(fromString(`5.095381439876338-0.9812808047833506i`));
    });
});

describe('integer-sqrt', () => {
    test('racket docs examples', () => {
       expect(integerSqrt(fromString(`4.0`)))
        .toEqual(fromString(`2.0`));
       expect(integerSqrt(fromString(`-4.0`)))
           .toEqual(fromString("0.0+2.0i"));
       expect(integerSqrt(fromString(`-4`)))
           .toEqual(fromString("0+2i"));
       expect(integerSqrt(fromString(`5.0`)))
        .toEqual(fromString(`2.0`));
    });
    test('exact numbers', () => {
        expect(integerSqrt(fromString(`4`)))
            .toEqual(fromString("2"));
        expect(() => integerSqrt(fromString(`9/2`)))
            .toThrow();
    });
    test('inexact numbers', () => {
        expect(integerSqrt(fromString(`4.0`)))
            .toEqual(fromString(`2.0`));
        expect(integerSqrt(fromString(`-1.0`)))
            .toEqual(fromString("0.0+1.0i"));
        expect(integerSqrt(fromString(`101.0`)))
            .toEqual(fromString(`10.0`));
        expect(integerSqrt(fromString("1.0")))
            .toEqual(fromString("1.0"));
    });
    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = fromString(`${bignumber}`);
        expect((integerSqrt(add(multiply(arg, arg), fromString("1")))))
            .toEqual(fromString(`${Number.MAX_SAFE_INTEGER}`));
    });
});

describe('expt', () => {
    test('racket docs examples: 0 base', () => {
        expect(expt(fromString("0"), fromString("0")))
            .toEqual(fromString('1'));
        expect(expt(fromString("0"), fromString(`0.0`)))
            .toEqual(fromString('1.0'));
        expect(expt(fromString("0"), fromString("+nan.0")))
            .toEqual(fromString('+nan.0'));
        expect(expt(fromString("0"), fromString(`5.0`)))
            .toEqual(fromString('0'));
    });
    test('racket docs examples: Exact 1/2 exponent', () => {
        expect(expt(fromString(`9`), fromString("1/2")))
            .toEqual(fromString('3'));
        expect(expt(fromString(`9`), fromString(`0.5`)))
            .toEqual(fromString('3.0'));
        expect(expt(fromString(`16`), fromString("1/4")))
            .toEqual(fromString('2.0'));
        expect(expt(fromString(`16`), fromString(`0.25`)))
            .toEqual(fromString('2.0'));
    });
    test('racket docs examples: Inexact zero base', () => {
        expect(expt(fromString(`0.0`), fromString("1")))
            .toEqual(fromString('0.0'));
        expect(expt(fromString(`0.0`), fromString("-1")))
            .toEqual(fromString('+inf.0'));
    });
    test('racket docs examples: Negative zero base', () => {
        expect(expt(fromString(`-0.0`), fromString("-1")))
            .toEqual(fromString('-inf.0'));
        expect(expt(fromString(`-0.0`), fromString("-1")))
            .toEqual(fromString('-inf.0'));
        expect(expt(fromString(`-0.0`), fromString(`-3`)))
            .toEqual(fromString('-inf.0'));
        expect(expt(fromString(`-0.0`), fromString(`-2`)))
            .toEqual(fromString('+inf.0'));
        expect(expt(fromString(`-0.0`), fromString("1")))
            .toEqual(fromString('-0.0'));
        expect(expt(fromString(`-0.0`), fromString(`3`)))
            .toEqual(fromString('-0.0'));
        expect(expt(fromString(`-0.0`), fromString(`2`)))
            .toEqual(fromString('0.0'));
    });
    test('racket docs examples: Infinite exponent', () => {
        expect(expt(fromString("2"), fromString("-inf.0")))
            .toEqual(fromString('0.0'));
        expect(expt(fromString(`0.5`), fromString("-inf.0")))
            .toEqual(fromString('+inf.0'));

        expect(expt(fromString(`2.0`), fromString("+inf.0")))
            .toEqual(fromString('+inf.0'));
        expect(expt(fromString(`0.5`), fromString("+inf.0")))
            .toEqual(fromString('0.0'));
    });
    test('racket docs examples: Infinite base', () => {
        expect(expt(fromString("-inf.0"), fromString("-1")))
            .toEqual(fromString('-0.0'));
        expect(expt(fromString("-inf.0"), fromString(`-2`)))
            .toEqual(fromString('0.0'));
        expect(expt(fromString("-inf.0"), fromString("1")))
            .toEqual(fromString('-inf.0'));
        expect(expt(fromString("-inf.0"), fromString("2")))
            .toEqual(fromString('+inf.0'));

        expect(expt(fromString('+inf.0'), fromString("-1")))
            .toEqual(fromString('0.0'));
        expect(expt(fromString("+inf.0"), fromString("2")))
            .toEqual(fromString('+inf.0'));
    });
    test('racket docs examples', () => {
        expect(expt(fromString("2"), fromString(`3`)))
            .toEqual(fromString('8'));
        expect(expt(fromString(`4`), fromString(`0.5`)))
            .toEqual(fromString('2.0'));
        expect(expt(fromString("+inf.0"), fromString("0")))
            .toEqual(fromString('1'));
    });
    test('mixed precision', () => {
        expect(expt(fromString(`2`), fromString(`2.0`)))
            .toEqual(fromString('4.0'));
    });
    test('bigints', () => {
        expect(expt(fromString(`100`), fromString("2")))
            .toEqual(fromString('10000'));
        expect(expt(fromString(`100`), fromString(`2`)))
            .toEqual(fromString('10000'));
        expect(typeof expt(fromString(`49.0`), fromString(`5000.0`)) === 'bigint').toEqual(false);
    });
    test('complex numbers', () => {
        expect(expt(fromString(`5+3i`),
                    fromString("2")))
            .toEqual(fromString(`16+30i`));
        expect(expt(fromString(`5.0+3.0i`),
                    fromString("2")))
            .toEqual(fromString(`16.0+30.0i`));
        expect(expt(fromString(`5.0+3.0i`),
                    fromString(`2.0`)))
            .toEqual(fromString(`16.000000000000004+30.000000000000007i`));
        expect(expt(fromString(`5+3i`),
                    fromString(`5+3i`)))
            .toEqual(fromString(`-182.81777310243467+1319.6714172143932i`))
        expect(expt(fromString(`5+3i`),
                    fromString(`-7-9i`)))
            .toEqual(fromString(`0.0003929046784149532-0.00040617442897733556i`))
    });
});

describe('exp', () => {
    test('inexact numbers', () => {
        expect(exp(fromString(`2.0`)))
            .toEqual(fromString(`7.38905609893065`));
        expect(exp(fromString(`-2.0`)))
            .toEqual(fromString(`0.1353352832366127`));
        expect(exp(fromString("0.0")))
            .toEqual(fromString("1.0"));
        expect(exp(fromString("2.0")))
            .toEqual(fromString(`7.38905609893065`));
    });
    test('exact numbers', () => {
        expect(exp(fromString("2")))
            .toEqual(fromString(`7.38905609893065`));
    });
    test('complex numbers', () => {
        expect(exp(fromString(`2.0+3.0i`)))
            .toEqual(fromString(`-7.315110094901103+1.0427436562359045i`))
        expect(exp(fromString(`2+3i`)))
            .toEqual(fromString(`-7.315110094901103+1.0427436562359045i`))
        expect(exp(fromString(`2.0-3.0i`)))
            .toEqual(fromString(`-7.315110094901103-1.0427436562359045i`))
    });
    test('racket docs examples', () => {
        expect(exp(fromString("0")))
            .toEqual(fromString("1"));
        expect(exp(fromString(`2+3i`)))
            .toEqual(fromString(`-7.315110094901103+1.0427436562359045i`));
        expect(exp(fromString("1")))
            .toEqual(fromString(`2.718281828459045`));
    });
});

describe('log', () => {
    test('inexact numbers', () => {
        expect(log(fromString(`2.0`)))
            .toEqual(fromString(`0.6931471805599453`));
        expect(log(fromString("2.0"), fromString("2")))
            .toEqual(fromString("1.0"));
    });
    test('exact numbers', () => {
        expect(log(fromString("2")))
            .toEqual(fromString(`0.6931471805599453`));
        expect(log(fromString(`-2`)))
            .toEqual(fromString(`0.6931471805599453+3.141592653589793i`));
        expect(log(fromString("2"), fromString("2")))
            .toEqual(fromString("1.0"));
        expect(log(fromString("2"), fromString(`-3`)))
            .toEqual(fromString(`0.06874882335131484-0.19659419488678306i`));
        expect(log(fromString("2")))
            .toEqual(fromString(`0.6931471805599453`));
    });
    test('complex numbers', () => {
        expect(log(fromString(`2.0+3.0i`)))
            .toEqual(fromString(`1.2824746787307684+0.982793723247329i`));
        expect(log(fromString(`2+3i`)))
            .toEqual(fromString(`1.2824746787307684+0.982793723247329i`));
        expect(log(fromString(`2.0-3.0i`)))
            .toEqual(fromString(`1.2824746787307684-0.982793723247329i`));
        expect(log(fromString(`2.0-3.0i`),
                   fromString("2")))
            .toEqual(fromString(`1.850219859070546-1.417871630745722i`));
        expect(log(fromString(`-25/17`), fromString(`-2/17`)))
            .toEqual(fromString(`0.6259226233474083-0.549141310867687i`));
        expect(log(fromString(`-1.4705882352941178-0.11764705882352941i`)))
            .toEqual(fromString(`0.38885228429400426-3.061762667877556i`));
    });
    test('racket docs examples', () => {
        expect(log(exp(fromString("1"))))
            .toEqual(fromString("1.0"));
        expect(log(fromString("1")))
            .toEqual(fromString("0"));
        expect(log(fromString(`100`), fromString(`10`)))
            .toEqual(fromString(`2.0`));
        expect(log(fromString(`8`), fromString("2")))
            .toEqual(fromString(`3.0`));
        expect(log(fromString(`5`), fromString(`5`)))
            .toEqual(fromString("1.0"));
    });
    test('big numbers', () => {
        const bignum = BigInt(Number.MAX_SAFE_INTEGER) * 5n;
        const arg = fromString(`${bignum}`);

        expect(log(arg))
            .toEqual(fromString(`38.346238482111204`));
        expect(log(arg, arg))
            .toEqual(fromString("1.0"));
    });
});

describe('numerator', () => {
    test('inexact numbers', () => {
        expect(numerator(fromString("1.0")))
            .toEqual(fromString("1.0"));
        expect(numerator(fromString(`2.0`)))
            .toEqual(fromString(`2.0`));
        expect(numerator(fromString(`-2.0`)))
            .toEqual(fromString(`-2.0`));
        expect(numerator(fromString("2.0")))
            .toEqual(fromString(`2.0`));
        expect(numerator(fromString("1.0")))
            .toEqual(fromString("1.0"));
        expect(numerator(fromString(`-2.0`)))
            .toEqual(fromString(`-2.0`));
    });
    test('Exact numbers', () => {
        expect(numerator(fromString("2")))
            .toEqual(fromString("2"));
        expect(numerator(fromString("1/2")))
            .toEqual(fromString("1"));
        expect(numerator(fromString("2")))
            .toEqual(fromString("2"));
        expect(numerator(fromString(`-2`)))
            .toEqual(fromString(`-2`));
    });
});

describe('denominator', () => {
    test('inexact numbers', () => {
        expect(denominator(fromString("1.0")))
            .toEqual(fromString("1.0"));
        expect(denominator(fromString(`2.0`)))
            .toEqual(fromString("1.0"));
        expect(denominator(fromString(`-2.0`)))
            .toEqual(fromString("1.0"));
        expect(denominator(fromString("2.0")))
            .toEqual(fromString("1.0"));
        expect(denominator(fromString("0.5")))
            .toEqual(fromString(`2.0`));
        expect(denominator(fromString(`-2.0`)))
            .toEqual(fromString("1.0"));
    });
    test('Exact numbers', () => {
        expect(denominator(fromString("2")))
            .toEqual(fromString("1"));
        expect(denominator(fromString("1/2")))
            .toEqual(fromString("2"));
        expect(denominator(fromString(`-2`)))
            .toEqual(fromString("1"));
    });
});

describe('gcd', () => {
    test('racket docs examples', () => {
        expect(gcd(fromString(`10`)))
            .toEqual(fromString(`10`));
        expect(gcd(fromString(`12`), fromString(`81.0`)))
            .toEqual(fromString(`3.0`));
        expect(gcd(fromString("1/2"), fromString("1/3")))
            .toEqual(fromString("1/6"));
    });
    test('inexact numbers', () => {
        expect(gcd(fromString(`4.0`), fromString(`18.0`)))
            .toEqual(fromString(`2.0`));
        expect(gcd(fromString(`7.0`), fromString(`18.0`)))
            .toEqual(fromString("1.0"));
        expect(gcd(fromString(`-4.0`), fromString(`18.0`)))
            .toEqual(fromString(`2.0`));
        expect(gcd(fromString(`4.0`), fromString(`18.0`)))
            .toEqual(fromString(`2.0`));
        expect(gcd(fromString(`-4.0`), fromString(`18.0`)))
            .toEqual(fromString(`2.0`));
        expect(gcd(fromString(`7.0`), fromString(`18.0`)))
            .toEqual(fromString("1.0"));
        expect(gcd(fromString(`0.125`), fromString(`0.5`)))
            .toEqual(fromString(`0.125`));
    });
    test('Exact numbers', () => {
        expect(gcd(fromString(`4`), fromString(`18`)))
            .toEqual(fromString("2"));
        expect(gcd(fromString(`-4`), fromString(`18`)))
            .toEqual(fromString("2"));
        expect(gcd(fromString(`7`), fromString(`18`)))
            .toEqual(fromString("1"));

        expect(gcd(fromString(`4/7`), fromString(`18/41`)))
            .toEqual(fromString(`2/287`));
        expect(gcd(fromString(`4/7`), fromString(`18`)))
            .toEqual(fromString(`2/7`));
    });
    test('mixed precision', () => {
        expect(gcd(fromString(`4.0`), fromString(`18`)))
            .toEqual(fromString(`2.0`));
        expect(gcd(fromString(`-4.0`), fromString(`18`)))
            .toEqual(fromString(`2.0`));
    });
    test('multi-arity', () => {
        expect(gcd())
            .toEqual(fromString("0"));
        expect(gcd(fromString(`4.0`), fromString(`18`), fromString(`36`)))
            .toEqual(fromString(`2.0`));
        expect(gcd(fromString(`7`), fromString(`14`), fromString(`49`)))
            .toEqual(fromString(`7`));
    });
});

describe('lcm', () => {
    test('racket docs examples', () => {
        expect(lcm(fromString(`10`)))
            .toEqual(fromString(`10`));
        expect(lcm(fromString(`3.0`), fromString(`4.0`)))
            .toEqual(fromString(`12.0`));
        expect(lcm(fromString("1/2"), fromString("2/3")))
            .toEqual(fromString("2"));
    });
    test('inexact numbers', () => {
        expect(lcm(fromString(`4.0`), fromString(`18.0`)))
            .toEqual(fromString(`36.0`));
        expect(lcm(fromString(`7.0`), fromString(`18.0`)))
            .toEqual(fromString(`126.0`));
        expect(lcm(fromString(`-4.0`), fromString(`18.0`)))
            .toEqual(fromString(`36.0`));
        expect(lcm(fromString(`4.0`), fromString(`18.0`)))
            .toEqual(fromString(`36.0`));
        expect(lcm(fromString(`-4.0`), fromString(`18.0`)))
            .toEqual(fromString(`36.0`));
        expect(lcm(fromString(`7.0`), fromString(`18.0`)))
            .toEqual(fromString(`126.0`));
        expect(lcm(fromString(`0.125`), fromString(`0.5`)))
            .toEqual(fromString(`0.5`));
    });
    test('Exact numbers', () => {
        expect(lcm(fromString(`4`), fromString(`18`)))
            .toEqual(fromString(`36`));
        expect(lcm(fromString(`-4`), fromString(`18`)))
            .toEqual(fromString(`36`));
        expect(lcm(fromString(`7`), fromString(`18`)))
            .toEqual(fromString(`126`));

        expect(lcm(fromString(`4/7`), fromString(`18/41`)))
            .toEqual(fromString(`36`));
        expect(lcm(fromString(`4/7`), fromString(`18`)))
            .toEqual(fromString(`36`));
    });
    test('mixed exactness', () => {
        expect(lcm(fromString(`4.0`), fromString(`18.0`)))
            .toEqual(fromString(`36.0`));
        expect(lcm(fromString(`-4.0`), fromString(`18`)))
            .toEqual(fromString(`36.0`));
    });
    test('multi-arity', () => {
        expect(lcm())
            .toEqual(fromString("1"));
        expect(lcm(fromString(`-10.0`)))
            .toEqual(fromString(`10.0`));
        expect(lcm(fromString(`4.0`), fromString(`18.0`), fromString(`36.0`)))
            .toEqual(fromString(`36.0`));
        expect(lcm(fromString(`7.0`), fromString(`14`), fromString(`49.0`)))
            .toEqual(fromString(`98.0`));
    });
});

describe('abs', () => {
    test('exact numbers', () => {
        expect(abs(fromString("1")))
            .toEqual(fromString("1"));
        expect(abs(fromString(`-1`)))
            .toEqual(fromString("1"));
        expect(abs(fromString(`3/2`)))
            .toEqual(fromString(`3/2`));
    });
    test('inexact numbers', () => {
        expect(abs(fromString(`-2.0`)))
            .toEqual(fromString(`2.0`));
        expect(abs(fromString("1.0")))
            .toEqual(fromString("1.0"));
        expect(abs(fromString(`-1.0`)))
            .toEqual(fromString("1.0"));
        expect(abs(fromString(`-2.5`)))
            .toEqual(fromString(`2.5`));
    });
    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MIN_SAFE_INTEGER);
        const arg = fromString(`${bignumber}`);
        expect(abs(arg))
            .toEqual(fromString(`${Number.MAX_SAFE_INTEGER}`));
    });
});

describe('floor', () => {
    test('exact numbers', () => {
        expect(floor(fromString("1")))
            .toEqual(fromString("1"));
        expect(floor(fromString(`-1`)))
            .toEqual(fromString("-1"));
        expect(floor(fromString(`3/2`)))
            .toEqual(fromString("1"));
    });
    test('inexact numbers', () => {
        expect(floor(fromString(`-2.0`)))
            .toEqual(fromString(`-2.0`));
        expect(floor(fromString("1.0")))
            .toEqual(fromString("1.0"));
        expect(floor(fromString(`1.5`)))
            .toEqual(fromString("1.0"));
        expect(floor(fromString("1.0")))
            .toEqual(fromString("1.0"));
        expect(floor(fromString(`-2.5`)))
            .toEqual(fromString(`-3.0`));
    });
    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = fromString(`${bignumber}/2`);
        expect(floor(arg))
            .toEqual(fromString(`4503599627370495`));
    });
});

describe('ceiling', () => {
    test('exact numbers', () => {
        expect(ceiling(fromString("1")))
            .toEqual(fromString("1"));
        expect(ceiling(fromString(`-1`)))
            .toEqual(fromString("-1"));
        expect(ceiling(fromString(`3/2`)))
            .toEqual(fromString("2"));
    });
    test('inexact numbers', () => {
        expect(ceiling(fromString(`-2.0`)))
            .toEqual(fromString(`-2.0`));
        expect(ceiling(fromString("1.0")))
            .toEqual(fromString("1.0"));
        expect(ceiling(fromString(`1.5`)))
            .toEqual(fromString(`2.0`));
        expect(ceiling(fromString("1.0")))
            .toEqual(fromString("1.0"));
        expect(ceiling(fromString(`-2.5`)))
            .toEqual(fromString(`-2.0`));
    });
    test('big numbers', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = fromString(`${bignumber}/2`);
        expect(ceiling(arg))
            .toEqual(fromString(`4503599627370496`));
    });
});

describe('round', () => {
    test('exact numbers', () => {
        expect(round(fromString("1")))
            .toEqual(fromString("1"));
        expect(round(fromString(`-1`)))
            .toEqual(fromString("-1"));
        expect(round(fromString(`3/2`)))
            .toEqual(fromString("2"));
    });
    test('inexact numbers', () => {
        expect(round(fromString(`-2.0`)))
            .toEqual(fromString(`-2.0`));
        expect(round(fromString("1.0")))
            .toEqual(fromString("1.0"));
        expect(round(fromString("1.0")))
            .toEqual(fromString("1.0"));
        expect(round(fromString(`-2.5`)))
            .toEqual(fromString(`-2.0`));
    });
    test('big numbers', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = fromString(`${bignumber}/2`);
        expect(round(arg))
            .toEqual(fromString(`4503599627370496`));
    });
});
