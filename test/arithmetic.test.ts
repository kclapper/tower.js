import {
    makeComplexNumber,
    InexactNumber,
    SmallExactNumber,
    BigExactNumber,
    EXACT_ZERO,
    EXACT_HALF,
    EXACT_ONE,
    EXACT_TWO,
    INEXACT_ZERO,
    INEXACT_NEG_ZERO,
    INEXACT_ONE,
    INEXACT_HALF,
    INEXACT_TWO,
    EXACT_I,
    INF,
    NEG_INF,
    NAN,
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

const makeInstance = makeComplexNumber;

test('Exact constants are exact', () => {
    expect(EXACT_ONE.isExact()).toBe(true);
    expect(EXACT_ONE.isReal()).toBe(true);
});

test('Inexact constants are inexact', () => {
    expect(INEXACT_ONE.isInexact()).toBe(true);
    expect(INEXACT_ONE.isReal()).toBe(true);
});

test('Complex numbers are complex', () => {
    expect(EXACT_I.isComplex()).toBe(true);
    expect(EXACT_I.isReal()).toBe(false);
    expect(EXACT_I.isExact()).toBe(true);
});

describe('+ operator', () => {
    test('no arguments', () => {
        expect(add()).toBe(0);
    });
    test('one argument', () => {
        expect(add(5)).toBe(5);
    });

    test('exact numbers', () => {
        expect(add(EXACT_ONE, EXACT_ONE)).toBe(2);
    });
    test('fixnums', () => {
        expect(add(1, 2)).toBe(3);
    });

    test('inexact integers', () => {
        expect(add(INEXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_TWO);
    });
    test('inexact decimals', () => {
        expect(add(INEXACT_ONE,
                   new InexactNumber(2.5)))
            .toEqual(new InexactNumber(3.5));
    });

    test('Mixed precision: boxed', () => {
        expect(add(EXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_TWO);
    });
    test('Mixed precision: with fixnums', () => {
        expect(add(1, INEXACT_ONE)).toEqual(INEXACT_TWO);
    });


    test('Multi arity', () => {
        expect(add(1,
                   EXACT_ONE,
                   INEXACT_ONE,
                   new InexactNumber(3.5)))
            .toEqual(new InexactNumber(6.5));
    });

    test('big numbers: unboxed', () => {
        expect(add(Number.MAX_SAFE_INTEGER,
                   2))
            .toBe(BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2));

    });
    test('big numbers: boxed', () => {
        expect(add(new SmallExactNumber(Number.MAX_SAFE_INTEGER),
                   2))
            .toBe(BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2));
    });

    test('complex numbers', () => {
        const x = makeInstance({num: 1, imagNum: 3});
        const y = makeInstance({num: 5, imagNum: 2});
        const z = makeInstance({num: 1, den: 1, imagNum: 2, imagDen: 1});
        const w = makeInstance({num: 2, den: 1, imagNum: 4, imagDen: 1});

        expect(add(x, y))
            .toEqual(makeInstance({num: 6, imagNum: 5}));
        expect(add(z, w))
            .toEqual(makeInstance({num: 3, den: 1, imagNum: 6, imagDen: 1}));
        expect(add(x, z))
            .toEqual(makeInstance({num: 2, imagNum: 5}));
        expect(add(x, 1))
            .toEqual(makeInstance({num: 2, imagNum: 3}));
        expect(add(INEXACT_ONE, EXACT_I))
            .toEqual(makeInstance({num:1, imagNum: 1}));
    });
});

describe('- operator', () => {
    test('one argument', () => {
        expect(subtract(1)).toBe(-1);
    });

    test('exact numbers', () => {
        expect(subtract(EXACT_ONE, EXACT_ONE)).toBe(0);
    });
    test('fixnums', () => {
        expect(subtract(1, 2)).toBe(-1);
    });

    test('inexact integers', () => {
        expect(subtract(INEXACT_ONE, INEXACT_ONE))
            .toEqual(INEXACT_ZERO);
    });
    test('inexact decimals', () => {
        expect(subtract(INEXACT_ONE,
                   new InexactNumber(2.5)))
            .toEqual(new InexactNumber(-1.5));
    });

    test('Mixed precision: boxed', () => {
        expect(subtract(EXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });
    test('Mixed precision: with fixnums', () => {
        expect(subtract(1, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });


    test('Multi arity', () => {
        expect(subtract(1,
                   EXACT_ONE,
                   INEXACT_ONE,
                   new InexactNumber(3.5)))
            .toEqual(new InexactNumber(-4.5));
    });

    test('big numbers: unboxed', () => {
        expect(subtract(Number.MIN_SAFE_INTEGER,
                   2))
            .toBe(BigInt(Number.MIN_SAFE_INTEGER) - BigInt(2));

    })
    test('big numbers: boxed', () => {
        expect(subtract(new SmallExactNumber(Number.MIN_SAFE_INTEGER),
                   2))
            .toBe(BigInt(Number.MIN_SAFE_INTEGER) - BigInt(2));
    })

    test('complex numbers', () => {
        const x = makeInstance({num: 1, imagNum: 3});
        const y = makeInstance({num: 5, imagNum: 2});
        const z = makeInstance({num: 1, den: 1, imagNum: 2, imagDen: 1});
        const w = makeInstance({num: 2, den: 1, imagNum: 4, imagDen: 1});

        expect(subtract(x, y)).toEqual(makeInstance({num: -4, imagNum: 1}));
        expect(subtract(z, w)).toEqual(makeInstance({num: -1, den: 1, imagNum: -2, imagDen: 1}));
        expect(subtract(x, z)).toEqual(makeInstance({num: 0, imagNum: 1}));
        expect(subtract(x, 1)).toEqual(makeInstance({num: 0, imagNum: 3}));
        expect(subtract(INEXACT_ONE, EXACT_I))
            .toEqual(makeInstance({num:1, imagNum: -1}));
    });
});

describe('* operator', () => {
    test('no arguments', () => {
        expect(multiply()).toBe(1);
    });
    test('one argument', () => {
        expect(multiply(5)).toBe(5);
    });

    test('exact numbers', () => {
        expect(multiply(EXACT_ONE, EXACT_ONE)).toBe(1);
        expect(multiply(EXACT_ONE, EXACT_I)).toEqual(EXACT_I);
    });
    test('fixnums', () => {
        expect(multiply(1, 2)).toBe(2);
    });

    test('inexact integers', () => {
        expect(multiply(INEXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(multiply(INEXACT_ONE,
                   new InexactNumber(2.5)))
            .toEqual(new InexactNumber(2.5));
    });

    test('Mixed precision', () => {
        expect(multiply(EXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ONE);
        expect(multiply(1, INEXACT_ONE)).toEqual(INEXACT_ONE);
        expect(multiply(INEXACT_ZERO, 1)).toEqual(INEXACT_ZERO);
        expect(multiply(EXACT_ZERO, 1)).toEqual(0);
    });

    test('Multi arity', () => {
        expect(multiply(1,
                   EXACT_ONE,
                   INEXACT_ONE,
                   new InexactNumber(3.5)))
            .toEqual(new InexactNumber(3.5));
    });

    test('big numbers: unboxed', () => {
        expect(multiply(Number.MAX_SAFE_INTEGER,
                        2))
            .toBe(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2));

    })
    test('big numbers: boxed', () => {
        expect(multiply(new SmallExactNumber(Number.MAX_SAFE_INTEGER),
                        2))
            .toEqual(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2));
    })

    test('complex numbers', () => {
        const x = makeInstance({num: 1, imagNum: 3});
        const y = makeInstance({num: 5, imagNum: 2});
        const z = makeInstance({num: 1, den: 1, imagNum: 2, imagDen: 1});
        const w = makeInstance({num: 2, den: 1, imagNum: 4, imagDen: 1});

        expect(multiply(x, y)).toEqual(makeInstance({num: -1, imagNum: 17}));
        expect(multiply(z, w)).toEqual(makeInstance({num: -6, den: 1, imagNum: 8, imagDen: 1}));
        expect(multiply(x, z)).toEqual(makeInstance({num: -5, imagNum: 5}));
        expect(multiply(x, 1)).toEqual(makeInstance({num: 1, imagNum: 3}));
        expect(multiply(makeInstance({num: 3}), EXACT_I)).toEqual(makeInstance({num: 0, imagNum: 3}));
        expect(multiply(EXACT_ZERO, makeInstance({num: 0, imagNum: 1}))).toBe(0);
        expect(multiply(EXACT_I, makeInstance({num: 0, imagNum: 1})))
            .toEqual(makeInstance({num: -1, imagNum: 0}));
    });
});

describe('/ operator', () => {
    test('one argument', () => {
        expect(divide(2)).toEqual(new SmallExactNumber(1, 2));
    });

    test('exact numbers', () => {
        expect(divide(EXACT_ONE, EXACT_ONE)).toBe(1);
    });
    test('fixnums', () => {
        expect(divide(1, 2)).toEqual(new SmallExactNumber(1, 2));
    });

    test('inexact integers', () => {
        expect(divide(INEXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(divide(INEXACT_ONE,
                      new InexactNumber(2.5)))
            .toEqual(new InexactNumber(1 / 2.5));
    });

    test('Mixed precision: boxed', () => {
        expect(divide(EXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('Mixed precision: with fixnums', () => {
        expect(divide(1, INEXACT_ONE)).toEqual(INEXACT_ONE);
    });


    test('Multi arity', () => {
        expect(divide(1,
                      EXACT_ONE,
                      INEXACT_ONE,
                      new InexactNumber(3.5)))
            .toEqual(new InexactNumber(1 / 3.5));
    });

    test('big numbers: unboxed', () => {
        const arg = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2);
        expect(divide(arg, 2))
            .toBe(Number.MAX_SAFE_INTEGER);
    })
    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(10);
        const arg = new BigExactNumber(bignumber, BigInt(3));
        const expected = new BigExactNumber(bignumber, BigInt(6));
        expect(divide(arg, 2))
            .toEqual(expected);
    })

    test('complex numbers', () => {
        const x = makeInstance({num: 1, imagNum: 3});
        const y = makeInstance({num: 5, imagNum: 2});
        const z = makeInstance({num: 1, den: 1, imagNum: 2, imagDen: 1});
        const w = makeInstance({num: 2, den: 1, imagNum: 4, imagDen: 1});

        expect(divide(x, y)).toEqual(makeInstance({num: 0.37931034482758624, imagNum: 0.4482758620689655}));
        expect(divide(z, w)).toEqual(makeInstance({num: 1, den: 2, imagNum: 0, imagDen: 1}));
        expect(divide(x, z)).toEqual(makeInstance({num: 1.4, imagNum: 0.2}));
        expect(divide(x, 1)).toEqual(makeInstance({num: 1, imagNum: 3}));
    });
});

describe('quotient', () => {
    test('exact numbers', () => {
        expect(quotient(EXACT_ONE, EXACT_ONE)).toBe(1);
    });
    test('fixnums', () => {
        expect(quotient(1, 2)).toBe(0);
    });

    test('inexact integers', () => {
        expect(quotient(INEXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(quotient(INEXACT_ONE,
                        new InexactNumber(2.5)))
            .toEqual(INEXACT_ZERO);
    });

    test('Mixed precision: boxed', () => {
        expect(quotient(EXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('Mixed precision: with fixnums', () => {
        expect(quotient(1, INEXACT_ONE)).toEqual(INEXACT_ONE);
    });


    test('big numbers: unboxed', () => {
        const arg = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2);
        expect(quotient(arg, 2))
            .toBe(Number.MAX_SAFE_INTEGER);
    })
    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(10);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect(quotient(arg, 10))
            .toEqual(Number.MAX_SAFE_INTEGER);
    })
});

describe('remainder', () => {
    test('racket docs tests', () => {
       expect(remainder(10, 3)).toBe(1);
       expect(remainder(-10, 3)).toBe(-1);
       expect(remainder(10, -3)).toBe(1);
       expect(remainder(-10, -3)).toBe(-1);
    });
    test('exact numbers', () => {
        expect(remainder(EXACT_ONE, EXACT_ONE)).toBe(0);
        expect(remainder(new SmallExactNumber(3, 2),
                      EXACT_ONE))
            .toEqual(EXACT_HALF);
    });
    test('fixnums', () => {
        expect(remainder(1, 2)).toBe(1);
    });

    test('inexact integers', () => {
        expect(remainder(INEXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });
    test('inexact decimals', () => {
        expect(remainder(new InexactNumber(2.5),
                      INEXACT_ONE))
            .toEqual(new InexactNumber(0.5));
    });

    test('Mixed precision: boxed', () => {
        expect(remainder(EXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });
    test('Mixed precision: with fixnums', () => {
        expect(remainder(1, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });

    test('big numbers: unboxed', () => {
        const arg = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        expect(remainder(arg, 2))
            .toBe(1);
    })
    test('big numbers: boxed', () => {
        const bignumber = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect(remainder(arg, 2))
            .toBe(1);
    })
    test('big numbers: negative boxed', () => {
        const bignumber = (BigInt(Number.MIN_SAFE_INTEGER) * BigInt(2)) - BigInt(1);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect(remainder(arg, 2))
            .toBe(-1);
    })
});

describe('modulo', () => {
    test('racket docs tests', () => {
       expect(modulo(10, 3)).toBe(1);
       expect(modulo(-10, 3)).toBe(2);
       expect(modulo(10, -3)).toBe(-2);
       expect(modulo(-10, -3)).toBe(-1);
    });
    test('exact numbers', () => {
        expect(modulo(EXACT_ONE, EXACT_ONE)).toBe(0);
        expect(modulo(new SmallExactNumber(3, 2),
                      EXACT_ONE))
            .toEqual(new SmallExactNumber(1, 2));
    });
    test('fixnums', () => {
        expect(modulo(1, 2)).toBe(1);
    });

    test('inexact integers', () => {
        expect(modulo(INEXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });
    test('inexact decimals', () => {
        expect(modulo(new InexactNumber(2.5),
                      INEXACT_ONE))
            .toEqual(new InexactNumber(0.5));
    });

    test('Mixed precision: boxed', () => {
        expect(modulo(EXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });
    test('Mixed precision: with fixnums', () => {
        expect(modulo(1, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });

    test('big numbers: unboxed', () => {
        const arg = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        expect(modulo(arg, 2))
            .toBe(1);
    })
    test('big numbers: boxed', () => {
        const bignumber = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect(modulo(arg, 2))
            .toBe(1);
    })
    test('big numbers: negative boxed', () => {
        const bignumber = (BigInt(Number.MIN_SAFE_INTEGER) * BigInt(2)) - BigInt(1);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect(modulo(arg, 2))
            .toBe(1);
    })
});

describe('remainder', () => {
    test('racket docs tests', () => {
       expect(remainder(10, 3)).toBe(1);
       expect(remainder(-10, 3)).toBe(-1);
       expect(remainder(10, -3)).toBe(1);
       expect(remainder(-10, -3)).toBe(-1);
    });
    test('exact numbers', () => {
        expect(remainder(EXACT_ONE, EXACT_ONE)).toBe(0);
        expect(remainder(new SmallExactNumber(3, 2),
                      EXACT_ONE))
            .toEqual(new SmallExactNumber(1, 2));
    });
    test('fixnums', () => {
        expect(remainder(1, 2)).toBe(1);
    });

    test('inexact integers', () => {
        expect(remainder(INEXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });
    test('inexact decimals', () => {
        expect(remainder(new InexactNumber(2.5),
                      INEXACT_ONE))
            .toEqual(new InexactNumber(0.5));
    });

    test('Mixed precision: boxed', () => {
        expect(remainder(EXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });
    test('Mixed precision: with fixnums', () => {
        expect(remainder(1, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });

    test('big numbers: unboxed', () => {
        const arg = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        expect(remainder(arg, 2))
            .toBe(1);
    })
    test('big numbers: boxed', () => {
        const bignumber = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect(remainder(arg, 2))
            .toBe(1);
    })
    test('big numbers: negative boxed', () => {
        const bignumber = (BigInt(Number.MIN_SAFE_INTEGER) * BigInt(2)) - BigInt(1);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect(remainder(arg, 2))
            .toBe(-1);
    })
});

describe('sqr', () => {
    test('exact numbers', () => {
        expect(sqr(EXACT_ONE)).toBe(1);
        expect(sqr(new SmallExactNumber(3, 2)))
            .toEqual(new SmallExactNumber(9, 4));
    });
    test('fixnums', () => {
        expect(sqr(2)).toBe(4);
        expect(sqr(-1)).toBe(1);
    });

    test('inexact integers', () => {
        expect(sqr(INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(sqr(new InexactNumber(2.5)))
            .toEqual(new InexactNumber(2.5 * 2.5));
    });

    test('big numbers: unboxed', () => {
        const arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(sqr(arg))
            .toBe(arg * arg);
    });
    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect((sqr(arg)))
            .toBe((bignumber * bignumber));
    });

    test('complex numbers', () => {
        expect(sqr(EXACT_I)).toEqual(-1);
    })
});

describe('sqrt', () => {
    test('exact numbers', () => {
        expect(sqrt(EXACT_ONE)).toBe(1);
        expect(sqrt(new SmallExactNumber(3, 2)))
            .toEqual(new InexactNumber(Math.sqrt(3 / 2)));
    });
    test('fixnums', () => {
        expect(sqrt(4)).toBe(2);
        expect(sqrt(-1)).toEqual(EXACT_I);
    });

    test('inexact integers', () => {
        expect(sqrt(INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(sqrt(new InexactNumber(2.5)))
            .toEqual(new InexactNumber(Math.sqrt(2.5)));
    });

    test('big numbers: unboxed', () => {
        const arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(sqrt(arg * arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect((sqrt(arg.multiply(arg))))
            .toBe(Number.MAX_SAFE_INTEGER);
    });

    test('complex numbers', () => {
        expect(sqrt(EXACT_I))
            .toEqual(makeInstance({
                num: 0.7071067811865475,
                imagNum: 0.7071067811865475
            }));
        expect(sqrt(makeInstance({num: 25, imagNum: -10})))
            .toEqual(makeInstance({num: 5.095381439876338, imagNum: -0.9812808047833506}));
    });
});

describe('sqrt', () => {
    test('exact numbers', () => {
        expect(sqrt(EXACT_ONE)).toBe(1);
        expect(sqrt(new SmallExactNumber(3, 2)))
            .toEqual(new InexactNumber(Math.sqrt(3 / 2)));
    });
    test('fixnums', () => {
        expect(sqrt(4)).toBe(2);
        expect(sqrt(-1)).toEqual(EXACT_I);
    });

    test('inexact integers', () => {
        expect(sqrt(INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(sqrt(new InexactNumber(2.5)))
            .toEqual(new InexactNumber(Math.sqrt(2.5)));
    });

    test('big numbers: unboxed', () => {
        const arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(sqrt(arg * arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect((sqrt(arg.multiply(arg))))
            .toBe(Number.MAX_SAFE_INTEGER);
    });

    test('complex numbers', () => {
        expect(sqrt(EXACT_I))
            .toEqual(makeInstance({
                num: 0.7071067811865475,
                imagNum: 0.7071067811865475
            }));
    });
});

describe('integer-sqrt', () => {
    test('racket docs examples', () => {
       expect(integerSqrt(new InexactNumber(4.0)))
        .toEqual(new InexactNumber(2.0));
       expect(integerSqrt(new InexactNumber(-4.0)))
        .toEqual(makeInstance({num: 0.0, imagNum: 2.0}));
       expect(integerSqrt(-4))
        .toEqual(makeInstance({num: 0, den: 1, imagNum: 2, imagDen: 1}));
       expect(integerSqrt(5))
        .toBe(2);
    });
    test('exact numbers', () => {
        expect(integerSqrt(new SmallExactNumber(4, 1))).toBe(2);
    });
    test('fixnums', () => {
        expect(integerSqrt(4)).toBe(2);
        expect(integerSqrt(-1)).toEqual(EXACT_I);
        expect(integerSqrt(101)).toBe(10);
    });

    test('inexact integers', () => {
        expect(integerSqrt(INEXACT_ONE)).toEqual(INEXACT_ONE);
    });

    test('big numbers: unboxed', () => {
        const arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(integerSqrt((arg * arg) + BigInt(1)))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect((integerSqrt(arg.multiply(arg).add(EXACT_ONE))))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
});

describe.only('expt', () => {
    test('racket docs examples: 0 base', () => {
        expect(expt(0n, 0n)).toBe(1n);
        expect(expt(0n, 0))
            .toEqual(1);
        expect(expt(0n, NaN))
            .toEqual(NaN);
        expect(expt(0n, 5n)).toBe(0n);
    });
    test('racket docs examples: Exact 1/2 exponent', () => {
        expect(expt(9n, EXACT_HALF)).toBe(3n);
        expect(expt(9n, 0.5))
            .toEqual(3);
        expect(expt(16n, new SmallExactNumber(1, 4)))
            .toEqual(2);
        expect(expt(16n, 0.25))
            .toEqual(2);
    });
    test('racket docs examples: Inexact zero base', () => {
        expect(expt(0, 1n))
            .toEqual(0);
        expect(expt(0, -1n))
            .toEqual(Infinity);
    });
    test('racket docs examples: Negative zero base', () => {
        expect(expt(-0, -1n))
            .toEqual(-Infinity);
        expect(expt(-0, -1n))
            .toEqual(-Infinity);
        expect(expt(-0, -3n))
            .toEqual(-Infinity);
        expect(expt(-0, -2n))
            .toEqual(Infinity);
        expect(expt(-0, 1n))
            .toEqual(-0);
        expect(expt(-0, 3n))
            .toEqual(-0);
        expect(expt(-0, 2n))
            .toEqual(0);
    });
    test('racket docs examples: Infinite exponent', () => {
        expect(expt(2n, -Infinity))
            .toEqual(0);
        expect(expt(0.5, -Infinity))
            .toEqual(Infinity);

        expect(expt(2, Infinity))
            .toEqual(Infinity);
        expect(expt(0.5, Infinity))
            .toEqual(0);
    });
    test('racket docs examples: Infinite base', () => {
        expect(expt(-Infinity, -1n))
            .toEqual(-0);
        expect(expt(-Infinity, -2n))
            .toEqual(0);
        expect(expt(-Infinity, 1n))
            .toEqual(-Infinity);
        expect(expt(-Infinity, 2n))
            .toEqual(Infinity);

        expect(expt(Infinity, -1n))
            .toEqual(0);
        expect(expt(Infinity, 2n))
            .toEqual(Infinity);
    });
    test('racket docs examples', () => {
        expect(expt(2n, 3n)).toBe(8n);
        expect(expt(4n, 0.5))
            .toEqual(2);
        expect(expt(Infinity, 0n))
            .toBe(1n);
    });
    test('boxed numbers', () => {
        expect(expt(new SmallExactNumber(2), new InexactNumber(2)))
            .toEqual(4);
        expect(expt(new SmallExactNumber(2), new InexactNumber(2)))
            .toEqual(4);
    });
    test('bigints', () => {
        expect(expt(100n, 2n))
            .toBe(10000n);
        expect(expt(new BigExactNumber(100n), new SmallExactNumber(2)))
            .toBe(10000n);
        expect(typeof expt(49, 5000) === 'bigint').toBe(false);
    });
    test('complex numbers', () => {
        expect(expt(new ComplexNumber(new SmallExactNumber(5),
                                      new SmallExactNumber(3)),
                    2n))
            .toEqual(new ComplexNumber(new SmallExactNumber(16),
                                       new SmallExactNumber(30)));
        expect(expt(new ComplexNumber(new InexactNumber(5),
                                      new InexactNumber(3)),
                    2n))
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
    test('fixnums', () => {
        expect(exp(2))
            .toEqual(new InexactNumber(7.38905609893065));
        expect(exp(-2))
            .toEqual(new InexactNumber(0.1353352832366127));
    });
    test('boxed numbers', () => {
        expect(exp(EXACT_TWO))
            .toEqual(new InexactNumber(7.38905609893065));
        expect(exp(INEXACT_TWO))
            .toEqual(new InexactNumber(7.38905609893065));
        expect(exp(INEXACT_ZERO))
            .toEqual(new InexactNumber(1));
    });
    test('complex numbers', () => {
        expect(exp(makeInstance({num: 2, imagNum: 3})))
            .toEqual(makeInstance({num: -7.315110094901103, imagNum: 1.0427436562359045}))
        expect(exp(makeInstance({num: 2, den: 1, imagNum: 3, imagDen: 1})))
            .toEqual(makeInstance({num: -7.315110094901103, imagNum: 1.0427436562359045}))
        expect(exp(makeInstance({num: 2, imagNum: -3})))
            .toEqual(makeInstance({num: -7.315110094901103, imagNum: -1.0427436562359045}))
    });
    test('racket docs examples', () => {
        expect(exp(0)).toBe(1);
        expect(exp(makeInstance({num: 2, den: 1, imagNum: 3, imagDen: 1})))
            .toEqual(makeInstance({num: -7.315110094901103, imagNum: 1.0427436562359045}));
        expect(exp(1)).toEqual(new InexactNumber(2.718281828459045));
    });
});

describe('log', () => {
    test('fixnums', () => {
        expect(log(2))
            .toEqual(new InexactNumber(0.6931471805599453));
        expect(log(-2))
            .toEqual(makeInstance({num: 0.6931471805599453, imagNum: 3.141592653589793}));
        expect(log(2, 2))
            .toEqual(INEXACT_ONE);
        expect(log(2, -3))
            .toEqual(makeInstance({num: 0.06874882335131484, imagNum: -0.19659419488678306}));
    });
    test('boxed numbers', () => {
        expect(log(EXACT_TWO))
            .toEqual(new InexactNumber(0.6931471805599453));
        expect(log(INEXACT_TWO))
            .toEqual(new InexactNumber(0.6931471805599453));
        expect(log(INEXACT_TWO, EXACT_TWO))
            .toEqual(INEXACT_ONE);
    });
    test('complex numbers', () => {
        expect(log(makeInstance({num: 2, imagNum: 3})))
            .toEqual(makeInstance({num: 1.2824746787307684, imagNum: 0.982793723247329}));
        expect(log(makeInstance({num: 2, den: 1, imagNum: 3, imagDen: 1})))
            .toEqual(makeInstance({num: 1.2824746787307684, imagNum: 0.982793723247329}));
        expect(log(makeInstance({num: 2, imagNum: -3})))
            .toEqual(makeInstance({num: 1.2824746787307684, imagNum: -0.982793723247329}));
        expect(log(makeInstance({num: 2, imagNum: -3}), 2))
            .toEqual(makeInstance({num: 1.850219859070546, imagNum: -1.417871630745722}));
        expect(log(makeInstance({num: -25, den: 17, imagNum: -2, imagDen: 17})))
            .toEqual(makeInstance({num: 0.3888522842940041, imagNum: -3.061762667877556}));
        expect(log(makeInstance({num: -1.4705882352941178, imagNum: -0.11764705882352941})))
            .toEqual(makeInstance({num: 0.38885228429400426, imagNum: -3.061762667877556}));
    });
    test('racket docs examples', () => {
        expect(log(exp(1)))
            .toEqual(INEXACT_ONE);
        expect(log(1))
            .toBe(0);
        expect(log(100, 10))
            .toEqual(INEXACT_TWO);
        expect(log(8, 2))
            .toEqual(new InexactNumber(3));
        expect(log(5, 5))
            .toEqual(INEXACT_ONE);
    });
    test('bigints', () => {
        expect(log(exp(BigInt(1))))
            .toEqual(INEXACT_ONE);
        expect(log(BigInt(1)))
            .toBe(0);
        expect(log(BigInt(8), BigInt(2)))
            .toEqual(new InexactNumber(3));
        expect(log(BigInt(5), BigInt(5)))
            .toEqual(INEXACT_ONE);
    });
});

describe('numerator', () => {
    test('fixnums', () => {
        expect(numerator(1)).toBe(1);
        expect(numerator(2)).toBe(2);
        expect(numerator(-2)).toBe(-2);
        expect(numerator(BigInt(2))).toBe(BigInt(2));
        expect(numerator(BigInt(-2))).toBe(BigInt(-2));
    });
    test('boxed numbers: exact', () => {
        expect(numerator(EXACT_TWO)).toBe(2);
        expect(numerator(EXACT_HALF)).toBe(1);
        expect(numerator(new BigExactNumber(BigInt(2), BigInt(1)))).toBe(2);
        expect(numerator(new BigExactNumber(BigInt(1), BigInt(2)))).toBe(1);
        expect(numerator(new SmallExactNumber(-2, 1))).toBe(-2);
    });
    test('boxed numbers: inexact', () => {
        expect(numerator(INEXACT_TWO)).toEqual(INEXACT_TWO);
        expect(numerator(INEXACT_HALF)).toEqual(INEXACT_ONE);
        expect(numerator(new InexactNumber(-2))).toEqual(new InexactNumber(-2));
    });
});

describe('denominator', () => {
    test('fixnums', () => {
        expect(denominator(1)).toBe(1);
        expect(denominator(2)).toBe(1);
        expect(denominator(-2)).toBe(1);
        expect(denominator(BigInt(2))).toBe(1);
        expect(denominator(BigInt(-2))).toBe(1);
    });
    test('boxed numbers: exact', () => {
        expect(denominator(EXACT_TWO)).toBe(1);
        expect(denominator(EXACT_HALF)).toBe(2);
        expect(denominator(new BigExactNumber(BigInt(2), BigInt(1)))).toBe(1);
        expect(denominator(new BigExactNumber(BigInt(1), BigInt(2)))).toBe(2);
        expect(denominator(new SmallExactNumber(-2, 1))).toBe(1);
    });
    test('boxed numbers: inexact', () => {
        expect(denominator(INEXACT_TWO)).toEqual(INEXACT_ONE);
        expect(denominator(INEXACT_HALF)).toEqual(INEXACT_TWO);
        expect(denominator(new InexactNumber(-2))).toEqual(INEXACT_ONE);
    });
});

describe('gcd', () => {
    test('racket docs examples', () => {
        expect(gcd(10)).toBe(10);
        expect(gcd(12, new InexactNumber(81))).toEqual(new InexactNumber(3));
        expect(gcd(new SmallExactNumber(1, 2), new SmallExactNumber(1, 3)))
            .toEqual(new SmallExactNumber(1, 6));
    });
    test('fixnums', () => {
        expect(gcd(4, 18)).toBe(2);
        expect(gcd(7, 18)).toBe(1);
        expect(gcd(-4, 18)).toBe(2);
        expect(gcd(BigInt(4), BigInt(18))).toBe(2);
        expect(gcd(BigInt(-4), BigInt(18))).toBe(2);
        expect(gcd(BigInt(7), BigInt(18))).toBe(1);
    });
    test('boxed numbers: exact', () => {
        expect(gcd(new SmallExactNumber(4, 1), new SmallExactNumber(18, 1)))
            .toBe(2);
        expect(gcd(new SmallExactNumber(-4, 1), new SmallExactNumber(18, 1)))
            .toBe(2);
        expect(gcd(new SmallExactNumber(7, 1), new SmallExactNumber(18, 1)))
            .toBe(1);
        expect(gcd(new BigExactNumber(BigInt(4), BigInt(1)), new BigExactNumber(BigInt(18), BigInt(1))))
            .toBe(2);

        expect(gcd(new SmallExactNumber(4, 7), new SmallExactNumber(18, 41)))
            .toEqual(new SmallExactNumber(2, 287));
        expect(gcd(new SmallExactNumber(4, 7), new SmallExactNumber(18, 1)))
            .toEqual(new SmallExactNumber(2, 7));
    });
    test('boxed numbers: inexact', () => {
        expect(gcd(new InexactNumber(4), new InexactNumber(18)))
            .toEqual(new InexactNumber(2));
        expect(gcd(new InexactNumber(-4), new InexactNumber(18)))
            .toEqual(new InexactNumber(2));
        expect(gcd(new InexactNumber(7), new InexactNumber(18)))
            .toEqual(new InexactNumber(1));

        expect(gcd(new InexactNumber(0.125), new InexactNumber(0.5)))
            .toEqual(new InexactNumber(0.125));
    });
    test('mixed exactness', () => {
        expect(gcd(new InexactNumber(4), 18))
            .toEqual(new InexactNumber(2));
        expect(gcd(new InexactNumber(-4), new SmallExactNumber(18, 1)))
            .toEqual(new InexactNumber(2));
    });
    test('multi-arity', () => {
        expect(gcd()).toBe(0);
        expect(gcd(new InexactNumber(4), 18, 36))
            .toEqual(new InexactNumber(2));
        expect(gcd(7, new SmallExactNumber(14, 1), 49))
            .toBe(7);
    });
});

describe('lcm', () => {
    test('racket docs examples', () => {
        expect(lcm(10)).toBe(10);
        expect(lcm(3, new InexactNumber(4.0))).toEqual(new InexactNumber(12));
        expect(lcm(new SmallExactNumber(1, 2), new SmallExactNumber(2, 3)))
            .toEqual(2);
    });
    test('fixnums', () => {
        expect(lcm(4, 18)).toBe(36);
        expect(lcm(7, 18)).toBe(126);
        expect(lcm(-4, 18)).toBe(36);
        expect(lcm(BigInt(4), BigInt(18))).toBe(36);
        expect(lcm(BigInt(-4), BigInt(18))).toBe(36);
        expect(lcm(BigInt(7), BigInt(18))).toBe(126);
    });
    test('boxed numbers: exact', () => {
        expect(lcm(new SmallExactNumber(4, 1), new SmallExactNumber(18, 1)))
            .toBe(36);
        expect(lcm(new SmallExactNumber(-4, 1), new SmallExactNumber(18, 1)))
            .toBe(36);
        expect(lcm(new SmallExactNumber(7, 1), new SmallExactNumber(18, 1)))
            .toBe(126);
        expect(lcm(new BigExactNumber(BigInt(4), BigInt(1)), new BigExactNumber(BigInt(18), BigInt(1))))
            .toBe(36);

        expect(lcm(new SmallExactNumber(4, 7), new SmallExactNumber(18, 41)))
            .toEqual(36);
        expect(lcm(new SmallExactNumber(4, 7), new SmallExactNumber(18, 1)))
            .toEqual(36);
    });
    test('boxed numbers: inexact', () => {
        expect(lcm(new InexactNumber(4), new InexactNumber(18)))
            .toEqual(new InexactNumber(36));
        expect(lcm(new InexactNumber(-4), new InexactNumber(18)))
            .toEqual(new InexactNumber(36));
        expect(lcm(new InexactNumber(7), new InexactNumber(18)))
            .toEqual(new InexactNumber(126));

        expect(lcm(new InexactNumber(0.125), new InexactNumber(0.5)))
            .toEqual(new InexactNumber(0.5));
    });
    test('mixed exactness', () => {
        expect(lcm(new InexactNumber(4), 18))
            .toEqual(new InexactNumber(36));
        expect(lcm(new InexactNumber(-4), new SmallExactNumber(18, 1)))
            .toEqual(new InexactNumber(36));
    });
    test('multi-arity', () => {
        expect(lcm()).toBe(1);
        expect(lcm(-10)).toBe(10);
        expect(lcm(new InexactNumber(4), 18, 36))
            .toEqual(new InexactNumber(36));
        expect(lcm(7, new SmallExactNumber(14, 1), 49))
            .toBe(98);
    });
});

describe('abs', () => {
    test('exact numbers', () => {
        expect(abs(EXACT_ONE)).toBe(1);
        expect(abs(new SmallExactNumber(-1, 1)))
            .toBe(1);
        expect(abs(new SmallExactNumber(3, 2)))
            .toEqual(new SmallExactNumber(3, 2));
    });
    test('fixnums', () => {
        expect(abs(-2)).toBe(2);
        expect(abs(1)).toBe(1);
    });

    test('inexact integers', () => {
        expect(abs(new InexactNumber(-1)))
            .toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(abs(new InexactNumber(-2.5)))
            .toEqual(new InexactNumber(2.5));
    });

    test('big numbers: unboxed', () => {
        const arg = BigInt(Number.MIN_SAFE_INTEGER);
        expect(abs(arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MIN_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(1));
        expect(abs(arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
});

describe('floor', () => {
    test('exact numbers', () => {
        expect(floor(EXACT_ONE)).toBe(1);
        expect(floor(new SmallExactNumber(-1, 1)))
            .toBe(-1);
        expect(floor(new SmallExactNumber(3, 2)))
            .toEqual(1);
    });
    test('fixnums', () => {
        expect(floor(-2)).toBe(-2);
        expect(floor(1)).toBe(1);
    });

    test('inexact integers', () => {
        expect(floor(INEXACT_ONE))
            .toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(floor(new InexactNumber(-2.5)))
            .toEqual(new InexactNumber(-3));
    });

    test('big numbers: unboxed', () => {
        const arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(floor(arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(2));
        expect(floor(arg))
            .toBe(4503599627370495);
    });
});

describe('ceiling', () => {
    test('exact numbers', () => {
        expect(ceiling(EXACT_ONE)).toBe(1);
        expect(ceiling(new SmallExactNumber(-1, 1)))
            .toBe(-1);
        expect(ceiling(new SmallExactNumber(3, 2)))
            .toEqual(2);
    });
    test('fixnums', () => {
        expect(ceiling(-2)).toBe(-2);
        expect(ceiling(1)).toBe(1);
    });

    test('inexact integers', () => {
        expect(ceiling(INEXACT_ONE))
            .toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(ceiling(new InexactNumber(-2.5)))
            .toEqual(new InexactNumber(-2));
    });

    test('big numbers: unboxed', () => {
        const arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(ceiling(arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(2));
        expect(ceiling(arg))
            .toBe(4503599627370496);
    });
});

describe('round', () => {
    test('exact numbers', () => {
        expect(round(EXACT_ONE)).toBe(1);
        expect(round(new SmallExactNumber(-1, 1)))
            .toBe(-1);
        expect(round(new SmallExactNumber(3, 2)))
            .toEqual(2);
    });
    test('fixnums', () => {
        expect(round(-2)).toBe(-2);
        expect(round(1)).toBe(1);
    });

    test('inexact integers', () => {
        expect(round(INEXACT_ONE))
            .toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(round(new InexactNumber(-2.5)))
            .toEqual(new InexactNumber(-2));
    });

    test('big numbers: unboxed', () => {
        const arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(round(arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        const bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        const arg = new BigExactNumber(bignumber, BigInt(2));
        expect(round(arg))
            .toBe(4503599627370496);
    });
});
