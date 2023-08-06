import {
    RacketNumber,
    InexactNumber,
    SmallExactNumber,
    BigExactNumber,
    fromString as createFromString,
    EXACT_ZERO,
    EXACT_HALF,
    EXACT_ONE,
    EXACT_TWO,
    EXACT_NEG_ONE,
    INEXACT_ZERO,
    INEXACT_NEG_ONE,
    INEXACT_ONE,
    INEXACT_HALF,
    INEXACT_TWO,
    EXACT_I,
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
    ComplexNumber,
} from '../src/tower';

// Assume we're gonna give fromString valid strings.
const fromString = createFromString as (str: string) => RacketNumber;

test('Exact constants are exact', () => {
    expect(EXACT_ONE.isExact())
        .toEqual(true);
    expect(EXACT_ONE.isReal())
        .toEqual(true);
});

test('Inexact constants are inexact', () => {
    expect(INEXACT_ONE.isInexact())
        .toEqual(true);
    expect(INEXACT_ONE.isReal())
        .toEqual(true);
});

test('Complex numbers are complex', () => {
    expect(EXACT_I.isComplex())
        .toEqual(true);
    expect(EXACT_I.isReal())
        .toEqual(false);
    expect(EXACT_I.isExact())
        .toEqual(true);
});

describe('+ operator', () => {
    test('no arguments', () => {
        expect(add())
            .toEqual(EXACT_ZERO);
    });
    test('one argument', () => {
        expect(add(5))
            .toEqual(5);
    });

    test('exact numbers', () => {
        expect(add(EXACT_ONE, EXACT_ONE))
            .toEqual(EXACT_TWO);
    });
    test('unboxed', () => {
        expect(add(1, 2))
            .toEqual(3);
    });

    test('inexact integers', () => {
        expect(add(INEXACT_ONE, INEXACT_ONE))
            .toEqual(2);
    });
    test('inexact decimals', () => {
        expect(add(1,
                   new InexactNumber(2.5)))
            .toEqual(3.5);
    });

    test('Mixed precision', () => {
        expect(add(EXACT_ONE, INEXACT_ONE))
            .toEqual(2);
        expect(add(1, EXACT_ONE))
            .toEqual(2);
    });

    test('Multi arity', () => {
        expect(add(1,
                   EXACT_ONE,
                   INEXACT_ONE,
                   new InexactNumber(3.5)))
            .toEqual(6.5);
    });

    test('big numbers', () => {
        expect(add(new BigExactNumber(BigInt(Number.MAX_SAFE_INTEGER)),
                   EXACT_TWO))
            .toEqual(new BigExactNumber(BigInt(Number.MAX_SAFE_INTEGER) + 2n));
        expect(add(new SmallExactNumber(Number.MAX_SAFE_INTEGER),
                   2))
            .toEqual(Number.MAX_SAFE_INTEGER + 2);
    });

    test('complex numbers', () => {
        const x = new ComplexNumber(new InexactNumber(1),
                                    new InexactNumber(3));
        const y = new ComplexNumber(new InexactNumber(5),
                                    new InexactNumber(2));
        const z = new ComplexNumber(new SmallExactNumber(1, 1),
                                    new SmallExactNumber(2, 1));
        const w = new ComplexNumber(new SmallExactNumber(2, 1),
                                    new SmallExactNumber(4, 1));

        expect(add(x, y))
            .toEqual(new ComplexNumber(new InexactNumber(6),
                                       new InexactNumber(5)));
        expect(add(z, w))
            .toEqual(new ComplexNumber(new SmallExactNumber(3),
                                       new SmallExactNumber(6)));
        expect(add(x, z))
            .toEqual(new ComplexNumber(new InexactNumber(2),
                                       new InexactNumber(5)));
        expect(add(x, 1))
            .toEqual(new ComplexNumber(new InexactNumber(2),
                                       new InexactNumber(3)));
        expect(add(INEXACT_ONE, EXACT_I))
            .toEqual(new ComplexNumber(new InexactNumber(1),
                                       new InexactNumber(1)));
    });
});

describe('- operator', () => {
    test('one argument', () => {
        expect(subtract(1))
            .toEqual(-1);
        expect(subtract(EXACT_ONE))
            .toEqual(EXACT_NEG_ONE);
    });

    test('exact numbers', () => {
        expect(subtract(EXACT_ONE, EXACT_ONE))
            .toEqual(EXACT_ZERO);
    });
    test('unboxed', () => {
        expect(subtract(1, 2))
            .toEqual(-1);
    });

    test('inexact integers', () => {
        expect(subtract(INEXACT_ONE, INEXACT_ONE))
            .toEqual(0);
    });
    test('inexact decimals', () => {
        expect(subtract(1,
                   new InexactNumber(2.5)))
            .toEqual(-1.5);
    });

    test('Mixed precision', () => {
        expect(subtract(EXACT_ONE, INEXACT_ONE))
            .toEqual(0);
        expect(subtract(1, INEXACT_ONE))
            .toEqual(0);
    });


    test('Multi arity', () => {
        expect(subtract(1,
                   EXACT_ONE,
                   INEXACT_ONE,
                   new InexactNumber(3.5)))
            .toEqual(-4.5);
    });

    test('big numbers', () => {
        expect(subtract(Number.MIN_SAFE_INTEGER, 2))
            .toEqual(Number.MIN_SAFE_INTEGER - 2);
        expect(subtract(new SmallExactNumber(Number.MIN_SAFE_INTEGER), EXACT_TWO))
            .toEqual(new BigExactNumber(BigInt(Number.MIN_SAFE_INTEGER) - BigInt(2)));
    })

    test('complex numbers', () => {
        const x = new ComplexNumber(new InexactNumber(1),
                                    new InexactNumber(3));
        const y = new ComplexNumber(new InexactNumber(5),
                                    new InexactNumber(2));
        const z = new ComplexNumber(new SmallExactNumber(1, 1),
                                    new SmallExactNumber(2, 1));
        const w = new ComplexNumber(new SmallExactNumber(2, 1),
                                    new SmallExactNumber(4, 1));

        expect(subtract(x, y))
            .toEqual(new ComplexNumber(new InexactNumber(-4),
                                       new InexactNumber(1)));
        expect(subtract(z, w))
            .toEqual(new ComplexNumber(new SmallExactNumber(-1),
                                       new SmallExactNumber(-2)));
        expect(subtract(x, z))
            .toEqual(new ComplexNumber(INEXACT_ZERO, INEXACT_ONE));
        expect(subtract(x, 1))
            .toEqual(new ComplexNumber(INEXACT_ZERO,
                                       new InexactNumber(3)));
        expect(subtract(INEXACT_ONE, EXACT_I))
            .toEqual(new ComplexNumber(INEXACT_ONE,
                                       INEXACT_NEG_ONE));
    });
});

describe('* operator', () => {
    test('no arguments', () => {
        expect(multiply())
            .toEqual(fromString('1'));
    });
    test('one argument', () => {
        expect(multiply(5))
            .toEqual(fromString('5.0'));
        expect(multiply(EXACT_ONE))
            .toEqual(fromString('1'));
    });

    test('exact numbers', () => {
        expect(multiply(EXACT_ONE, EXACT_TWO))
            .toEqual(fromString('2'));
        expect(multiply(EXACT_ONE, EXACT_I))
            .toEqual(EXACT_I);
    });
    test('unboxed', () => {
        expect(multiply(1, 2))
            .toEqual(fromString('2.0'));
    });

    test('inexact integers', () => {
        expect(multiply(INEXACT_ONE, INEXACT_ONE))
            .toEqual(fromString('1.0'));
    });
    test('inexact decimals', () => {
        expect(multiply(1,
                   new InexactNumber(2.5)))
            .toEqual(fromString('2.5'));
    });

    test('Mixed precision', () => {
        expect(multiply(EXACT_ONE, INEXACT_ONE))
            .toEqual(fromString('1.0'));
        expect(multiply(1, INEXACT_ONE))
            .toEqual(fromString('1.0'));
        expect(multiply(INEXACT_ZERO, 1))
            .toEqual(fromString('0.0'));
        expect(multiply(EXACT_ZERO, 1))
            .toEqual(fromString('0'));
    });

    test('Multi arity', () => {
        expect(multiply(1,
                   EXACT_ONE,
                   INEXACT_ONE,
                   new InexactNumber(3.5)))
            .toEqual(fromString('3.5'));
    });

    test('big numbers: unboxed', () => {
        expect(multiply(Number.MAX_SAFE_INTEGER,
                        fromString('2')))
            .toEqual(Number.MAX_SAFE_INTEGER * 2);

    })
    test('big numbers: boxed', () => {
        expect(multiply(new SmallExactNumber(Number.MAX_SAFE_INTEGER),
                        fromString('2')))
            .toEqual(fromString((BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)).toString()));
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
        expect(multiply(x, 1))
            .toEqual(fromString('1.0+3.0i'));
        expect(multiply(fromString('3.0'), EXACT_I))
            .toEqual(fromString('0.0+3.0i'));
        expect(multiply(EXACT_ZERO, fromString('0.0+1.0i')))
            .toEqual(EXACT_ZERO);
        expect(multiply(EXACT_I, fromString('0.0+1.0i')))
            .toEqual(fromString('-1.0+0.0i'));
    });
});

describe('/ operator', () => {
    test('one argument', () => {
        expect(divide(2))
            .toEqual(0.5);
        expect(divide(EXACT_TWO))
            .toEqual(new SmallExactNumber(1, 2));
    });

    test('exact numbers', () => {
        expect(divide(EXACT_ONE, EXACT_ONE))
            .toEqual(EXACT_ONE);
    });
    test('fixnums', () => {
        expect(divide(EXACT_ONE, EXACT_TWO))
            .toEqual(new SmallExactNumber(1, 2));
    });

    test('inexact integers', () => {
        expect(divide(INEXACT_ONE, INEXACT_ONE))
            .toEqual(1);
        expect(divide(1, 1))
            .toEqual(1);
    });
    test('inexact decimals', () => {
        expect(divide(1,
                      2.5))
            .toEqual(1 / 2.5);
    });

    test('Mixed precision: boxed', () => {
        expect(divide(EXACT_ONE, INEXACT_ONE))
            .toEqual(1);
    });
    test('Mixed precision: with fixnums', () => {
        expect(divide(1, EXACT_ONE))
            .toEqual(1);
    });


    test('Multi arity', () => {
        expect(divide(1,
                      EXACT_ONE,
                      INEXACT_ONE,
                      3.5))
            .toEqual(1 / 3.5);
    });

    test('big numbers', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(10);
        const arg = new BigExactNumber(bignumber, BigInt(3));
        const expected = new BigExactNumber(bignumber, BigInt(6));
        expect(divide(arg, EXACT_TWO))
            .toEqual(expected);
    });

    test('complex numbers', () => {
        const x = new ComplexNumber(new InexactNumber(1),
                                    new InexactNumber(3));
        const y = new ComplexNumber(new InexactNumber(5),
                                    new InexactNumber(2));
        const z = new ComplexNumber(new SmallExactNumber(1, 1),
                                    new SmallExactNumber(2, 1));
        const w = new ComplexNumber(new SmallExactNumber(2),
                                    new SmallExactNumber(4));

        expect(divide(x, y))
            .toEqual(new ComplexNumber(new InexactNumber(0.37931034482758624),
                                       new InexactNumber(0.4482758620689655)));
        expect(divide(z, w))
            .toEqual(new ComplexNumber(new SmallExactNumber(1, 2),
                                       new SmallExactNumber(0, 1)));
        expect(divide(x, z))
            .toEqual(new ComplexNumber(new InexactNumber(1.4),
                                       new InexactNumber(0.2)));
        expect(divide(x, 1))
            .toEqual(new ComplexNumber(new InexactNumber(1),
                                       new InexactNumber(3)));
    });
});

describe('quotient', () => {
    test('exact numbers', () => {
        expect(quotient(EXACT_ONE, EXACT_ONE))
            .toEqual(EXACT_ONE);
    });
    test('fixnums', () => {
        expect(quotient(1, 2)).toEqual(0);
    });

    test('inexact integers', () => {
        expect(quotient(INEXACT_ONE, INEXACT_ONE)).toEqual(1);
    });
    test('inexact decimals', () => {
        expect(quotient(INEXACT_ONE,
                        new InexactNumber(2.5)))
            .toEqual(0);
    });

    test('Mixed precision: boxed', () => {
        expect(quotient(EXACT_ONE, INEXACT_ONE)).toEqual(1);
    });
    test('Mixed precision: with fixnums', () => {
        expect(quotient(1, INEXACT_ONE)).toEqual(1);
    });


    test('big numbers', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER) * 10n;
        const arg = new BigExactNumber(bignumber);
        expect(quotient(arg, new BigExactNumber(10n)))
            .toEqual(new BigExactNumber(BigInt(Number.MAX_SAFE_INTEGER)));
    })
});

describe('remainder', () => {
    test('racket docs tests', () => {
       expect(remainder(10, 3))
           .toEqual(1);
       expect(remainder(-10, 3))
           .toEqual(-1);
       expect(remainder(10, -3))
           .toEqual(1);
       expect(remainder(-10, -3))
           .toEqual(-1);
    });
    test('exact numbers', () => {
        expect(remainder(EXACT_ONE, EXACT_ONE))
            .toEqual(EXACT_ZERO);
        expect(remainder(new SmallExactNumber(3, 2),
                      EXACT_ONE))
            .toEqual(EXACT_HALF);
    });
    test('unboxed', () => {
        expect(remainder(1, 2))
            .toEqual(1);
    });

    test('inexact integers', () => {
        expect(remainder(INEXACT_ONE, INEXACT_ONE))
            .toEqual(0);
    });
    test('inexact decimals', () => {
        expect(remainder(new InexactNumber(2.5),
                         INEXACT_ONE))
            .toEqual(0.5);
    });

    test('Mixed precision', () => {
        expect(remainder(EXACT_ONE, INEXACT_ONE))
            .toEqual(0);
        expect(remainder(1, EXACT_ONE))
            .toEqual(0);
    });

    test('big numbers: boxed', () => {
        const bignumber = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect(remainder(arg, EXACT_TWO))
            .toEqual(EXACT_ONE);
    })
    test('big numbers: negative boxed', () => {
        const bignumber = (BigInt(Number.MIN_SAFE_INTEGER) * BigInt(2)) - BigInt(1);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect(remainder(arg, EXACT_TWO))
            .toEqual(EXACT_NEG_ONE);
    })
});

describe('modulo', () => {
    test('racket docs tests', () => {
       expect(modulo(10, 3))
           .toEqual(1);
       expect(modulo(-10, 3))
           .toEqual(2);
       expect(modulo(10, -3))
           .toEqual(-2);
       expect(modulo(-10, -3))
           .toEqual(-1);
    });
    test('exact numbers', () => {
        expect(modulo(EXACT_ONE, EXACT_ONE))
            .toEqual(EXACT_ZERO);
        expect(modulo(new SmallExactNumber(3, 2),
                      EXACT_ONE))
            .toEqual(new SmallExactNumber(1, 2));
    });
    test('unboxed', () => {
        expect(modulo(1, 2))
            .toEqual(1);
    });

    test('inexact integers', () => {
        expect(modulo(INEXACT_ONE, INEXACT_ONE))
            .toEqual(0);
    });
    test('inexact decimals', () => {
        expect(modulo(new InexactNumber(2.5),
                      INEXACT_ONE))
            .toEqual(0.5);
    });

    test('Mixed precision', () => {
        expect(modulo(EXACT_ONE, INEXACT_ONE))
            .toEqual(0);
        expect(modulo(1, INEXACT_ONE))
            .toEqual(0);
    });

    test('big numbers: boxed', () => {
        const bignumber = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect(modulo(arg, EXACT_TWO))
            .toEqual(EXACT_ONE);
    })
    test('big numbers: negative boxed', () => {
        const bignumber = (BigInt(Number.MIN_SAFE_INTEGER) * BigInt(2)) - BigInt(1);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect(modulo(arg, EXACT_TWO))
            .toEqual(EXACT_ONE);
    })
});

describe('sqr', () => {
    test('exact numbers', () => {
        expect(sqr(EXACT_ONE))
            .toEqual(EXACT_ONE);
        expect(sqr(new SmallExactNumber(3, 2)))
            .toEqual(new SmallExactNumber(9, 4));
    });
    test('unboxed', () => {
        expect(sqr(2))
            .toEqual(4);
        expect(sqr(-1))
            .toEqual(1);
    });

    test('inexact integers', () => {
        expect(sqr(INEXACT_ONE))
            .toEqual(1);
    });
    test('inexact decimals', () => {
        expect(sqr(new InexactNumber(2.5)))
            .toEqual(2.5 * 2.5);
    });

    test('big numbers', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect((sqr(arg)))
            .toEqual(new BigExactNumber(bignumber * bignumber));
    });

    test('complex numbers', () => {
        expect(sqr(EXACT_I))
            .toEqual(EXACT_NEG_ONE);
    })
});

describe('sqrt', () => {
    test('exact numbers', () => {
        expect(sqrt(EXACT_ONE))
            .toEqual(EXACT_ONE);
        expect(sqrt(new SmallExactNumber(3, 2)))
            .toEqual(Math.sqrt(3 / 2));
    });
    test('unboxed', () => {
        expect(sqrt(4))
            .toEqual(2);
        expect(sqrt(EXACT_NEG_ONE))
            .toEqual(EXACT_I);
    });

    test('inexact integers', () => {
        expect(sqrt(INEXACT_ONE))
            .toEqual(1);
    });
    test('inexact decimals', () => {
        expect(sqrt(new InexactNumber(2.5)))
            .toEqual(Math.sqrt(2.5));
    });

    test('big numbers', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber);
        expect(sqrt(arg.multiply(arg)))
            .toEqual(new SmallExactNumber(Number.MAX_SAFE_INTEGER));
    });

    test('complex numbers', () => {
        expect(sqrt(EXACT_I))
            .toEqual(new ComplexNumber(new InexactNumber(0.7071067811865475),
                                       new InexactNumber(0.7071067811865475)));
        expect(sqrt(new ComplexNumber(new InexactNumber(25), new InexactNumber(-10))))
            .toEqual(new ComplexNumber(new InexactNumber(5.095381439876338), new InexactNumber(-0.9812808047833506)));
    });
});

describe('integer-sqrt', () => {
    test('racket docs examples', () => {
       expect(integerSqrt(new InexactNumber(4.0)))
        .toEqual(2.0);
       expect(integerSqrt(new InexactNumber(-4.0)))
           .toEqual(new ComplexNumber(new InexactNumber(0),
                                      new InexactNumber(2)));
       expect(integerSqrt(new SmallExactNumber(-4)))
           .toEqual(new ComplexNumber(new SmallExactNumber(0),
                                      new SmallExactNumber(2)));
       expect(integerSqrt(5))
        .toEqual(2);
    });
    test('exact numbers', () => {
        expect(integerSqrt(new SmallExactNumber(4)))
            .toEqual(EXACT_TWO);
    });
    test('unboxed', () => {
        expect(integerSqrt(4))
            .toEqual(2);
        expect(integerSqrt(-1))
            .toEqual(new ComplexNumber(INEXACT_ZERO, INEXACT_ONE));
        expect(integerSqrt(101))
            .toEqual(10);
    });

    test('inexact integers', () => {
        expect(integerSqrt(INEXACT_ONE))
            .toEqual(1);
    });

    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect((integerSqrt(arg.multiply(arg).add(EXACT_ONE))))
            .toEqual(new SmallExactNumber(Number.MAX_SAFE_INTEGER));
    });
});

describe('expt', () => {
    test('racket docs examples: 0 base', () => {
        expect(expt(EXACT_ZERO, EXACT_ZERO))
            .toEqual(fromString('1'));
        expect(expt(EXACT_ZERO, 0))
            .toEqual(fromString('1.0'));
        expect(expt(EXACT_ZERO, NaN))
            .toEqual(fromString('+nan.0'));
        expect(expt(EXACT_ZERO, new SmallExactNumber(5)))
            .toEqual(fromString('0'));
    });
    test('racket docs examples: Exact 1/2 exponent', () => {
        expect(expt(new SmallExactNumber(9), EXACT_HALF))
            .toEqual(fromString('3'));
        expect(expt(new SmallExactNumber(9), 0.5))
            .toEqual(fromString('3.0'));
        expect(expt(new SmallExactNumber(16), new SmallExactNumber(1, 4)))
            .toEqual(fromString('2.0'));
        expect(expt(new SmallExactNumber(16), 0.25))
            .toEqual(fromString('2.0'));
    });
    test('racket docs examples: Inexact zero base', () => {
        expect(expt(0, EXACT_ONE))
            .toEqual(fromString('0.0'));
        expect(expt(0, EXACT_NEG_ONE))
            .toEqual(fromString('+inf.0'));
    });
    test('racket docs examples: Negative zero base', () => {
        expect(expt(-0, EXACT_NEG_ONE))
            .toEqual(fromString('-inf.0'));
        expect(expt(-0, EXACT_NEG_ONE))
            .toEqual(fromString('-inf.0'));
        expect(expt(-0, new SmallExactNumber(-3)))
            .toEqual(fromString('-inf.0'));
        expect(expt(-0, new SmallExactNumber(-2)))
            .toEqual(fromString('+inf.0'));
        expect(expt(-0, EXACT_ONE))
            .toEqual(fromString('-0.0'));
        expect(expt(-0, new SmallExactNumber(3)))
            .toEqual(fromString('-0.0'));
        expect(expt(-0, new SmallExactNumber(2)))
            .toEqual(fromString('0.0'));
    });
    test('racket docs examples: Infinite exponent', () => {
        expect(expt(EXACT_TWO, -Infinity))
            .toEqual(fromString('0.0'));
        expect(expt(0.5, -Infinity))
            .toEqual(fromString('+inf.0'));

        expect(expt(2, Infinity))
            .toEqual(fromString('+inf.0'));
        expect(expt(0.5, Infinity))
            .toEqual(fromString('0.0'));
    });
    test('racket docs examples: Infinite base', () => {
        expect(expt(-Infinity, EXACT_NEG_ONE))
            .toEqual(fromString('-0.0'));
        expect(expt(-Infinity, new SmallExactNumber(-2)))
            .toEqual(fromString('0.0'));
        expect(expt(-Infinity, EXACT_ONE))
            .toEqual(fromString('-inf.0'));
        expect(expt(-Infinity, EXACT_TWO))
            .toEqual(fromString('+inf.0'));

        expect(expt(Infinity, EXACT_NEG_ONE))
            .toEqual(fromString('0.0'));
        expect(expt(Infinity, EXACT_TWO))
            .toEqual(fromString('+inf.0'));
    });
    test('racket docs examples', () => {
        expect(expt(EXACT_TWO, new SmallExactNumber(3)))
            .toEqual(fromString('8'));
        expect(expt(new SmallExactNumber(4), 0.5))
            .toEqual(fromString('2.0'));
        expect(expt(Infinity, EXACT_ZERO))
            .toEqual(fromString('1'));
    });
    test('boxed numbers', () => {
        expect(expt(new SmallExactNumber(2), new InexactNumber(2)))
            .toEqual(fromString('4.0'));
        expect(expt(new SmallExactNumber(2), new InexactNumber(2)))
            .toEqual(fromString('4.0'));
    });
    test('bigints', () => {
        expect(expt(new SmallExactNumber(100), EXACT_TWO))
            .toEqual(fromString('10000'));
        expect(expt(new BigExactNumber(100n), new SmallExactNumber(2)))
            .toEqual(fromString('10000'));
        expect(typeof expt(49, 5000) === 'bigint').toEqual(false);
    });
    test('complex numbers', () => {
        expect(expt(new ComplexNumber(new SmallExactNumber(5),
                                      new SmallExactNumber(3)),
                    EXACT_TWO))
            .toEqual(new ComplexNumber(new SmallExactNumber(16),
                                       new SmallExactNumber(30)));
        expect(expt(new ComplexNumber(new InexactNumber(5),
                                      new InexactNumber(3)),
                    EXACT_TWO))
            .toEqual(new ComplexNumber(new InexactNumber(16),
                                       new InexactNumber(30)));
        expect(expt(new ComplexNumber(new InexactNumber(5),
                                      new InexactNumber(3)),
                    2))
            .toEqual(new ComplexNumber(new InexactNumber(16.000000000000004),
                                       new InexactNumber(30.000000000000007)));
        expect(expt(new ComplexNumber(new SmallExactNumber(5),
                                      new SmallExactNumber(3)),
                    new ComplexNumber(new SmallExactNumber(5),
                                      new SmallExactNumber(3))))
            .toEqual(new ComplexNumber(new InexactNumber(-182.81777310243467),
                                       new InexactNumber(1319.6714172143932)))
        expect(expt(new ComplexNumber(new SmallExactNumber(5),
                                      new SmallExactNumber(3)),
                    new ComplexNumber(new SmallExactNumber(-7),
                                      new SmallExactNumber(-9))))
            .toEqual(new ComplexNumber(new InexactNumber(0.0003929046784149532),
                                       new InexactNumber(-0.00040617442897733556)))
    });
});

describe('exp', () => {
    test('unboxed', () => {
        expect(exp(2))
            .toEqual(7.38905609893065);
        expect(exp(-2))
            .toEqual(0.1353352832366127);
    });
    test('boxed numbers', () => {
        expect(exp(EXACT_TWO))
            .toEqual(7.38905609893065);
        expect(exp(INEXACT_TWO))
            .toEqual(7.38905609893065);
        expect(exp(INEXACT_ZERO))
            .toEqual(1);
    });
    test('complex numbers', () => {
        expect(exp(new ComplexNumber(new InexactNumber(2),
                                     new InexactNumber(3))))
            .toEqual(new ComplexNumber(new InexactNumber(-7.315110094901103),
                                       new InexactNumber(1.0427436562359045)))
        expect(exp(new ComplexNumber(new SmallExactNumber(2),
                                     new SmallExactNumber(3))))
            .toEqual(new ComplexNumber(new InexactNumber(-7.315110094901103),
                                       new InexactNumber(1.0427436562359045)))
        expect(exp(new ComplexNumber(new InexactNumber(2),
                                     new InexactNumber(-3))))
            .toEqual(new ComplexNumber(new InexactNumber(-7.315110094901103),
                                       new InexactNumber(-1.0427436562359045)))
    });
    test('racket docs examples', () => {
        expect(exp(EXACT_ZERO))
            .toEqual(EXACT_ONE);
        expect(exp(new ComplexNumber(new SmallExactNumber(2),
                                     new SmallExactNumber(3))))
            .toEqual(new ComplexNumber(new InexactNumber(-7.315110094901103),
                                       new InexactNumber(1.0427436562359045)));
        expect(exp(EXACT_ONE))
            .toEqual(2.718281828459045);
    });
});

describe('log', () => {
    test('unboxed', () => {
        expect(log(EXACT_TWO))
            .toEqual(0.6931471805599453);
        expect(log(new SmallExactNumber(-2)))
            .toEqual(new ComplexNumber(new InexactNumber(0.6931471805599453),
                                       new InexactNumber(3.141592653589793)));
        expect(log(EXACT_TWO, EXACT_TWO))
            .toEqual(1);
        expect(log(EXACT_TWO, new SmallExactNumber(-3)))
            .toEqual(new ComplexNumber(new InexactNumber(0.06874882335131484),
                                       new InexactNumber(-0.19659419488678306)));
    });
    test('boxed numbers', () => {
        expect(log(EXACT_TWO))
            .toEqual(0.6931471805599453);
        expect(log(2))
            .toEqual(0.6931471805599453);
        expect(log(INEXACT_TWO, EXACT_TWO))
            .toEqual(1);
    });
    test('complex numbers', () => {
        expect(log(new ComplexNumber(new InexactNumber(2),
                                     new InexactNumber(3))))
            .toEqual(new ComplexNumber(new InexactNumber(1.2824746787307684),
                                       new InexactNumber(0.982793723247329)));
        expect(log(new ComplexNumber(new SmallExactNumber(2),
                                     new SmallExactNumber(3))))
            .toEqual(new ComplexNumber(new InexactNumber(1.2824746787307684),
                                       new InexactNumber(0.982793723247329)));
        expect(log(new ComplexNumber(new InexactNumber(2),
                                     new InexactNumber(-3))))
            .toEqual(new ComplexNumber(new InexactNumber(1.2824746787307684),
                                       new InexactNumber(-0.982793723247329)));
        expect(log(new ComplexNumber(new InexactNumber(2),
                                     new InexactNumber(-3)),
                   EXACT_TWO))
            .toEqual(new ComplexNumber(new InexactNumber(1.850219859070546),
                                       new InexactNumber(-1.417871630745722)));
        expect(log(new ComplexNumber(new SmallExactNumber(-25, 17),
                                     new SmallExactNumber(-2, 17))))
            .toEqual(new ComplexNumber(new InexactNumber(0.3888522842940041),
                                       new InexactNumber(-3.061762667877556)));
        expect(log(new ComplexNumber(new InexactNumber(-1.4705882352941178),
                                     new InexactNumber(-0.11764705882352941))))
            .toEqual(new ComplexNumber(new InexactNumber(0.38885228429400426),
                                       new InexactNumber(-3.061762667877556)));
    });
    test('racket docs examples', () => {
        expect(log(exp(EXACT_ONE)))
            .toEqual(1);
        expect(log(EXACT_ONE))
            .toEqual(EXACT_ZERO);
        expect(log(new SmallExactNumber(100), new SmallExactNumber(10)))
            .toEqual(2);
        expect(log(new SmallExactNumber(8), EXACT_TWO))
            .toEqual(3);
        expect(log(new SmallExactNumber(5), new SmallExactNumber(5)))
            .toEqual(1);
    });
    test('big numbers', () => {
        const bignum = BigInt(Number.MAX_SAFE_INTEGER) * 5n;
        const arg = new BigExactNumber(bignum);

        expect(log(arg))
            .toEqual(38.346238482111204);
        expect(log(arg, arg))
            .toEqual(1);
    });
});

describe('numerator', () => {
    test('unboxed', () => {
        expect(numerator(1))
            .toEqual(1);
        expect(numerator(2))
            .toEqual(2);
        expect(numerator(-2))
            .toEqual(-2);
    });
    test('Inexact boxed numbers', () => {
        expect(numerator(INEXACT_TWO))
            .toEqual(2);
        expect(numerator(INEXACT_HALF))
            .toEqual(1);
        expect(numerator(new InexactNumber(-2)))
            .toEqual(-2);
    });
    test('Exact numbers', () => {
        expect(numerator(EXACT_TWO))
            .toEqual(EXACT_TWO);
        expect(numerator(EXACT_HALF))
            .toEqual(EXACT_ONE);
        expect(numerator(new BigExactNumber(BigInt(2), BigInt(1))))
            .toEqual(EXACT_TWO);
        expect(numerator(new BigExactNumber(BigInt(1), BigInt(2))))
            .toEqual(EXACT_ONE);
        expect(numerator(new SmallExactNumber(-2)))
            .toEqual(new SmallExactNumber(-2));
    });
});

describe('denominator', () => {
    test('unboxed', () => {
        expect(denominator(1))
            .toEqual(1);
        expect(denominator(2))
            .toEqual(1);
        expect(denominator(-2))
            .toEqual(1);
    });
    test('Exact numbers', () => {
        expect(denominator(EXACT_TWO))
            .toEqual(EXACT_ONE);
        expect(denominator(EXACT_HALF))
            .toEqual(EXACT_TWO);
        expect(denominator(new BigExactNumber(BigInt(2), BigInt(1))))
            .toEqual(EXACT_ONE);
        expect(denominator(new BigExactNumber(BigInt(1), BigInt(2))))
            .toEqual(EXACT_TWO);
        expect(denominator(new SmallExactNumber(-2, 1)))
            .toEqual(EXACT_ONE);
    });
    test('boxed numbers: inexact', () => {
        expect(denominator(INEXACT_TWO))
            .toEqual(1);
        expect(denominator(INEXACT_HALF))
            .toEqual(2);
        expect(denominator(new InexactNumber(-2)))
            .toEqual(1);
    });
});

describe('gcd', () => {
    test('racket docs examples', () => {
        expect(gcd(new SmallExactNumber(10)))
            .toEqual(new SmallExactNumber(10));
        expect(gcd(new SmallExactNumber(12), 81))
            .toEqual(3);
        expect(gcd(new SmallExactNumber(1, 2), new SmallExactNumber(1, 3)))
            .toEqual(new SmallExactNumber(1, 6));
    });
    test('unboxed', () => {
        expect(gcd(4, 18))
            .toEqual(2);
        expect(gcd(7, 18))
            .toEqual(1);
        expect(gcd(-4, 18))
            .toEqual(2);
    });
    test('Exact numbers', () => {
        expect(gcd(new SmallExactNumber(4, 1), new SmallExactNumber(18, 1)))
            .toEqual(EXACT_TWO);
        expect(gcd(new SmallExactNumber(-4, 1), new SmallExactNumber(18, 1)))
            .toEqual(EXACT_TWO);
        expect(gcd(new SmallExactNumber(7, 1), new SmallExactNumber(18, 1)))
            .toEqual(EXACT_ONE);
        expect(gcd(new BigExactNumber(BigInt(4), BigInt(1)), new BigExactNumber(BigInt(18), BigInt(1))))
            .toEqual(EXACT_TWO);

        expect(gcd(new SmallExactNumber(4, 7), new SmallExactNumber(18, 41)))
            .toEqual(new SmallExactNumber(2, 287));
        expect(gcd(new SmallExactNumber(4, 7), new SmallExactNumber(18, 1)))
            .toEqual(new SmallExactNumber(2, 7));
    });
    test('Inexact boxed numbers', () => {
        expect(gcd(new InexactNumber(4), new InexactNumber(18)))
            .toEqual(2);
        expect(gcd(new InexactNumber(-4), new InexactNumber(18)))
            .toEqual(2);
        expect(gcd(new InexactNumber(7), new InexactNumber(18)))
            .toEqual(1);

        expect(gcd(new InexactNumber(0.125), new InexactNumber(0.5)))
            .toEqual(0.125);
    });
    test('mixed exactness', () => {
        expect(gcd(4, new SmallExactNumber(18)))
            .toEqual(2);
        expect(gcd(-4, new SmallExactNumber(18, 1)))
            .toEqual(2);
    });
    test('multi-arity', () => {
        expect(gcd())
            .toEqual(EXACT_ZERO);
        expect(gcd(4, new SmallExactNumber(18), new SmallExactNumber(36)))
            .toEqual(2);
        expect(gcd(new SmallExactNumber(7), new SmallExactNumber(14, 1), new SmallExactNumber(49)))
            .toEqual(new SmallExactNumber(7));
    });
});

describe('lcm', () => {
    test('racket docs examples', () => {
        expect(lcm(new SmallExactNumber(10)))
            .toEqual(new SmallExactNumber(10));
        expect(lcm(3, new InexactNumber(4.0)))
            .toEqual(12);
        expect(lcm(new SmallExactNumber(1, 2), new SmallExactNumber(2, 3)))
            .toEqual(EXACT_TWO);
    });
    test('unboxed', () => {
        expect(lcm(4, 18))
            .toEqual(36);
        expect(lcm(7, 18))
            .toEqual(126);
        expect(lcm(-4, 18))
            .toEqual(36);
    });
    test('Exact numbers', () => {
        expect(lcm(new SmallExactNumber(4, 1), new SmallExactNumber(18, 1)))
            .toEqual(new SmallExactNumber(36));
        expect(lcm(new SmallExactNumber(-4, 1), new SmallExactNumber(18, 1)))
            .toEqual(new SmallExactNumber(36));
        expect(lcm(new SmallExactNumber(7, 1), new SmallExactNumber(18, 1)))
            .toEqual(new SmallExactNumber(126));
        expect(lcm(new BigExactNumber(BigInt(4), BigInt(1)), new BigExactNumber(BigInt(18), BigInt(1))))
            .toEqual(new SmallExactNumber(36));

        expect(lcm(new SmallExactNumber(4, 7), new SmallExactNumber(18, 41)))
            .toEqual(new SmallExactNumber(36));
        expect(lcm(new SmallExactNumber(4, 7), new SmallExactNumber(18, 1)))
            .toEqual(new SmallExactNumber(36));
    });
    test('Inexact boxed numbers', () => {
        expect(lcm(new InexactNumber(4), new InexactNumber(18)))
            .toEqual(36);
        expect(lcm(new InexactNumber(-4), new InexactNumber(18)))
            .toEqual(36);
        expect(lcm(new InexactNumber(7), new InexactNumber(18)))
            .toEqual(126);

        expect(lcm(new InexactNumber(0.125), new InexactNumber(0.5)))
            .toEqual(0.5);
    });
    test('mixed exactness', () => {
        expect(lcm(new InexactNumber(4), 18))
            .toEqual(36);
        expect(lcm(new InexactNumber(-4), new SmallExactNumber(18, 1)))
            .toEqual(36);
    });
    test('multi-arity', () => {
        expect(lcm())
            .toEqual(EXACT_ONE);
        expect(lcm(-10))
            .toEqual(10);
        expect(lcm(new InexactNumber(4), 18, 36))
            .toEqual(36);
        expect(lcm(7, new SmallExactNumber(14, 1), 49))
            .toEqual(98);
    });
});

describe('abs', () => {
    test('exact numbers', () => {
        expect(abs(EXACT_ONE))
            .toEqual(EXACT_ONE);
        expect(abs(new SmallExactNumber(-1, 1)))
            .toEqual(EXACT_ONE);
        expect(abs(new SmallExactNumber(3, 2)))
            .toEqual(new SmallExactNumber(3, 2));
    });
    test('unboxed', () => {
        expect(abs(-2))
            .toEqual(2);
        expect(abs(1))
            .toEqual(1);
    });

    test('inexact boxed', () => {
        expect(abs(new InexactNumber(-1)))
            .toEqual(1);
        expect(abs(new InexactNumber(-2.5)))
            .toEqual(2.5);
    });

    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MIN_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect(abs(arg))
            .toEqual(new SmallExactNumber(Number.MAX_SAFE_INTEGER));
    });
});

describe('floor', () => {
    test('exact numbers', () => {
        expect(floor(EXACT_ONE))
            .toEqual(EXACT_ONE);
        expect(floor(new SmallExactNumber(-1, 1)))
            .toEqual(EXACT_NEG_ONE);
        expect(floor(new SmallExactNumber(3, 2)))
            .toEqual(EXACT_ONE);
    });
    test('unboxed', () => {
        expect(floor(-2))
            .toEqual(-2);
        expect(floor(1))
            .toEqual(1);
        expect(floor(1.5))
            .toEqual(1);
    });

    test('inexact numbers', () => {
        expect(floor(INEXACT_ONE))
            .toEqual(1);
        expect(floor(new InexactNumber(-2.5)))
            .toEqual(-3);
    });

    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(2));
        expect(floor(arg))
            .toEqual(new BigExactNumber(4503599627370495n));
    });
});

describe('ceiling', () => {
    test('exact numbers', () => {
        expect(ceiling(EXACT_ONE))
            .toEqual(EXACT_ONE);
        expect(ceiling(new SmallExactNumber(-1, 1)))
            .toEqual(EXACT_NEG_ONE);
        expect(ceiling(new SmallExactNumber(3, 2)))
            .toEqual(EXACT_TWO);
    });
    test('unboxed', () => {
        expect(ceiling(-2))
            .toEqual(-2);
        expect(ceiling(1))
            .toEqual(1);
        expect(ceiling(1.5))
            .toEqual(2);
    });

    test('inexact numbers', () => {
        expect(ceiling(INEXACT_ONE))
            .toEqual(1);
        expect(ceiling(new InexactNumber(-2.5)))
            .toEqual(-2);
    });

    test('big numbers', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(2));
        expect(ceiling(arg))
            .toEqual(new BigExactNumber(4503599627370496n));
    });
});

describe('round', () => {
    test('exact numbers', () => {
        expect(round(EXACT_ONE))
            .toEqual(EXACT_ONE);
        expect(round(new SmallExactNumber(-1, 1)))
            .toEqual(EXACT_NEG_ONE);
        expect(round(new SmallExactNumber(3, 2)))
            .toEqual(EXACT_TWO);
    });
    test('unboxed', () => {
        expect(round(-2))
            .toEqual(-2);
        expect(round(1))
            .toEqual(1);
    });

    test('inexact numbers', () => {
        expect(round(INEXACT_ONE))
            .toEqual(1);
        expect(round(new InexactNumber(-2.5)))
            .toEqual(-2);
    });

    test('big numbers', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(2));
        expect(round(arg))
            .toEqual(new BigExactNumber(4503599627370496n));
    });
});
