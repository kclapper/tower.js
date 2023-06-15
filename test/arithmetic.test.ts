import {describe, expect, test} from '@jest/globals';
import {
    BoxedNumber,
    EXACT_ZERO,
    EXACT_HALF,
    EXACT_ONE,
    EXACT_TWO,
    INEXACT_ZERO,
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
} from '../src/tower';

const makeInstance = BoxedNumber.makeInstance;

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
                   makeInstance({num: 2.5})))
            .toEqual(makeInstance({num: 3.5}));
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
                   makeInstance({num: 3.5})))
            .toEqual(makeInstance({num: 6.5}));
    });

    test('big numbers: unboxed', () => {
        expect(add(Number.MAX_SAFE_INTEGER,
                   2))
            .toBe(BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2));

    });
    test('big numbers: boxed', () => {
        expect(add(makeInstance({num: Number.MAX_SAFE_INTEGER, den: 1}),
                   2))
            .toBe(BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2));
    });

    test('complex numbers', () => {
        let x = makeInstance({num: 1, imagNum: 3});
        let y = makeInstance({num: 5, imagNum: 2});
        let z = makeInstance({num: 1, den: 1, imagNum: 2, imagDen: 1});
        let w = makeInstance({num: 2, den: 1, imagNum: 4, imagDen: 1});

        expect(add(x, y)).toEqual(makeInstance({num: 6, imagNum: 5}));
        expect(add(z, w)).toEqual(makeInstance({num: 3, den: 1, imagNum: 6, imagDen: 1}));
        expect(add(x, z)).toEqual(makeInstance({num: 2, imagNum: 5}));
        expect(add(x, 1)).toEqual(makeInstance({num: 2, imagNum: 3}));
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
                   makeInstance({num: 2.5})))
            .toEqual(makeInstance({num: -1.5}));
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
                   makeInstance({num: 3.5})))
            .toEqual(makeInstance({num: -4.5}));
    });

    test('big numbers: unboxed', () => {
        expect(subtract(Number.MIN_SAFE_INTEGER,
                   2))
            .toBe(BigInt(Number.MIN_SAFE_INTEGER) - BigInt(2));

    })
    test('big numbers: boxed', () => {
        expect(subtract(makeInstance({num: Number.MIN_SAFE_INTEGER, den: 1}),
                   2))
            .toBe(BigInt(Number.MIN_SAFE_INTEGER) - BigInt(2));
    })

    test('complex numbers', () => {
        let x = makeInstance({num: 1, imagNum: 3});
        let y = makeInstance({num: 5, imagNum: 2});
        let z = makeInstance({num: 1, den: 1, imagNum: 2, imagDen: 1});
        let w = makeInstance({num: 2, den: 1, imagNum: 4, imagDen: 1});

        expect(subtract(x, y)).toEqual(makeInstance({num: -4, imagNum: 1}));
        expect(subtract(z, w)).toEqual(makeInstance({num: -1, den: 1, imagNum: -2, imagDen: 1}));
        expect(subtract(x, z)).toEqual(makeInstance({num: 0, imagNum: 1}));
        expect(subtract(x, 1)).toEqual(makeInstance({num: 0, imagNum: 3}));
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
    });
    test('fixnums', () => {
        expect(multiply(1, 2)).toBe(2);
    });

    test('inexact integers', () => {
        expect(multiply(INEXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(multiply(INEXACT_ONE,
                   makeInstance({num: 2.5})))
            .toEqual(makeInstance({num: 2.5}));
    });

    test('Mixed precision: boxed', () => {
        expect(multiply(EXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('Mixed precision: with fixnums', () => {
        expect(multiply(1, INEXACT_ONE)).toEqual(INEXACT_ONE);
    });


    test('Multi arity', () => {
        expect(multiply(1,
                   EXACT_ONE,
                   INEXACT_ONE,
                   makeInstance({num: 3.5})))
            .toEqual(makeInstance({num: 3.5}));
    });

    test('big numbers: unboxed', () => {
        expect(multiply(Number.MAX_SAFE_INTEGER,
                        2))
            .toBe(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2));

    })
    test('big numbers: boxed', () => {
        expect(multiply(makeInstance({num: Number.MAX_SAFE_INTEGER, den: 1}),
                        2))
            .toEqual(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2));
    })

    test('complex numbers', () => {
        let x = makeInstance({num: 1, imagNum: 3});
        let y = makeInstance({num: 5, imagNum: 2});
        let z = makeInstance({num: 1, den: 1, imagNum: 2, imagDen: 1});
        let w = makeInstance({num: 2, den: 1, imagNum: 4, imagDen: 1});

        expect(multiply(x, y)).toEqual(makeInstance({num: -1, imagNum: 17}));
        expect(multiply(z, w)).toEqual(makeInstance({num: -6, den: 1, imagNum: 8, imagDen: 1}));
        expect(multiply(x, z)).toEqual(makeInstance({num: -5, imagNum: 5}));
        expect(multiply(x, 1)).toEqual(makeInstance({num: 1, imagNum: 3}));
    });
});

describe('/ operator', () => {
    test('one argument', () => {
        expect(divide(2)).toEqual(makeInstance({num: 1, den: 2}));
    });

    test('exact numbers', () => {
        expect(divide(EXACT_ONE, EXACT_ONE)).toBe(1);
    });
    test('fixnums', () => {
        expect(divide(1, 2)).toEqual(makeInstance({num: 1, den: 2}));
    });

    test('inexact integers', () => {
        expect(divide(INEXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(divide(INEXACT_ONE,
                      makeInstance({num: 2.5})))
            .toEqual(makeInstance({num: 1 / 2.5}));
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
                      makeInstance({num: 3.5})))
            .toEqual(makeInstance({num: 1 / 3.5}));
    });

    test('big numbers: unboxed', () => {
        let arg = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2);
        expect(divide(arg, 2))
            .toBe(Number.MAX_SAFE_INTEGER);
    })
    test('big numbers: boxed', () => {
        let bignumber = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(10);
        let arg = makeInstance({num: bignumber, den: BigInt(3)});
        let expected = makeInstance({num: bignumber, den: BigInt(6)});
        expect(divide(arg, 2))
            .toEqual(expected);
    })

    test('complex numbers', () => {
        let x = makeInstance({num: 1, imagNum: 3});
        let y = makeInstance({num: 5, imagNum: 2});
        let z = makeInstance({num: 1, den: 1, imagNum: 2, imagDen: 1});
        let w = makeInstance({num: 2, den: 1, imagNum: 4, imagDen: 1});

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
                        makeInstance({num: 2.5})))
            .toEqual(makeInstance({num: 0}));
    });

    test('Mixed precision: boxed', () => {
        expect(quotient(EXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('Mixed precision: with fixnums', () => {
        expect(quotient(1, INEXACT_ONE)).toEqual(INEXACT_ONE);
    });


    test('big numbers: unboxed', () => {
        let arg = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2);
        expect(quotient(arg, 2))
            .toBe(Number.MAX_SAFE_INTEGER);
    })
    test('big numbers: boxed', () => {
        let bignumber = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(10);
        let arg = makeInstance({num: bignumber, den: BigInt(1)});
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
        expect(remainder(makeInstance({num: 3, den: 2}),
                      EXACT_ONE))
            .toEqual(makeInstance({num: 1, den: 2}));
    });
    test('fixnums', () => {
        expect(remainder(1, 2)).toBe(1);
    });

    test('inexact integers', () => {
        expect(remainder(INEXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });
    test('inexact decimals', () => {
        expect(remainder(makeInstance({num: 2.5}),
                      INEXACT_ONE))
            .toEqual(makeInstance({num: 0.5}));
    });

    test('Mixed precision: boxed', () => {
        expect(remainder(EXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });
    test('Mixed precision: with fixnums', () => {
        expect(remainder(1, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });

    test('big numbers: unboxed', () => {
        let arg = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        expect(remainder(arg, 2))
            .toBe(1);
    })
    test('big numbers: boxed', () => {
        let bignumber = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        let arg = makeInstance({num: bignumber, den: BigInt(1)});
        expect(remainder(arg, 2))
            .toBe(1);
    })
    test('big numbers: negative boxed', () => {
        let bignumber = (BigInt(Number.MIN_SAFE_INTEGER) * BigInt(2)) - BigInt(1);
        let arg = makeInstance({num: bignumber, den: BigInt(1)});
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
        expect(modulo(makeInstance({num: 3, den: 2}),
                      EXACT_ONE))
            .toEqual(makeInstance({num: 1, den: 2}));
    });
    test('fixnums', () => {
        expect(modulo(1, 2)).toBe(1);
    });

    test('inexact integers', () => {
        expect(modulo(INEXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });
    test('inexact decimals', () => {
        expect(modulo(makeInstance({num: 2.5}),
                      INEXACT_ONE))
            .toEqual(makeInstance({num: 0.5}));
    });

    test('Mixed precision: boxed', () => {
        expect(modulo(EXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });
    test('Mixed precision: with fixnums', () => {
        expect(modulo(1, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });

    test('big numbers: unboxed', () => {
        let arg = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        expect(modulo(arg, 2))
            .toBe(1);
    })
    test('big numbers: boxed', () => {
        let bignumber = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        let arg = makeInstance({num: bignumber, den: BigInt(1)});
        expect(modulo(arg, 2))
            .toBe(1);
    })
    test('big numbers: negative boxed', () => {
        let bignumber = (BigInt(Number.MIN_SAFE_INTEGER) * BigInt(2)) - BigInt(1);
        let arg = makeInstance({num: bignumber, den: BigInt(1)});
        expect(modulo(arg, 2))
            .toBe(1);
    })
});

describe('sqr', () => {
    test('racket docs tests', () => {
       expect(remainder(10, 3)).toBe(1);
       expect(remainder(-10, 3)).toBe(-1);
       expect(remainder(10, -3)).toBe(1);
       expect(remainder(-10, -3)).toBe(-1);
    });
    test('exact numbers', () => {
        expect(remainder(EXACT_ONE, EXACT_ONE)).toBe(0);
        expect(remainder(makeInstance({num: 3, den: 2}),
                      EXACT_ONE))
            .toEqual(makeInstance({num: 1, den: 2}));
    });
    test('fixnums', () => {
        expect(remainder(1, 2)).toBe(1);
    });

    test('inexact integers', () => {
        expect(remainder(INEXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });
    test('inexact decimals', () => {
        expect(remainder(makeInstance({num: 2.5}),
                      INEXACT_ONE))
            .toEqual(makeInstance({num: 0.5}));
    });

    test('Mixed precision: boxed', () => {
        expect(remainder(EXACT_ONE, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });
    test('Mixed precision: with fixnums', () => {
        expect(remainder(1, INEXACT_ONE)).toEqual(INEXACT_ZERO);
    });

    test('big numbers: unboxed', () => {
        let arg = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        expect(remainder(arg, 2))
            .toBe(1);
    })
    test('big numbers: boxed', () => {
        let bignumber = (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)) + BigInt(1);
        let arg = makeInstance({num: bignumber, den: BigInt(1)});
        expect(remainder(arg, 2))
            .toBe(1);
    })
    test('big numbers: negative boxed', () => {
        let bignumber = (BigInt(Number.MIN_SAFE_INTEGER) * BigInt(2)) - BigInt(1);
        let arg = makeInstance({num: bignumber, den: BigInt(1)});
        expect(remainder(arg, 2))
            .toBe(-1);
    })
});

describe('sqr', () => {
    test('exact numbers', () => {
        expect(sqr(EXACT_ONE)).toBe(1);
        expect(sqr(makeInstance({num: 3, den: 2})))
            .toEqual(makeInstance({num: 9, den: 4}));
    });
    test('fixnums', () => {
        expect(sqr(2)).toBe(4);
        expect(sqr(-1)).toBe(1);
    });

    test('inexact integers', () => {
        expect(sqr(INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(sqr(makeInstance({num: 2.5})))
            .toEqual(makeInstance({num: 2.5 * 2.5}));
    });

    test('big numbers: unboxed', () => {
        let arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(sqr(arg))
            .toBe(arg * arg);
    });
    test('big numbers: boxed', () => {
        let bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        let arg = makeInstance({num: bignumber, den: BigInt(1)});
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
        expect(sqrt(makeInstance({num: 3, den: 2})))
            .toEqual(makeInstance({num: Math.sqrt(3 / 2)}));
    });
    test('fixnums', () => {
        expect(sqrt(4)).toBe(2);
        expect(sqrt(-1)).toEqual(EXACT_I);
    });

    test('inexact integers', () => {
        expect(sqrt(INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(sqrt(makeInstance({num: 2.5})))
            .toEqual(makeInstance({num: Math.sqrt(2.5)}));
    });

    test('big numbers: unboxed', () => {
        let arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(sqrt(arg * arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        let bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        let arg = makeInstance({num: bignumber, den: BigInt(1)});
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

describe('sqrt', () => {
    test('exact numbers', () => {
        expect(sqrt(EXACT_ONE)).toBe(1);
        expect(sqrt(makeInstance({num: 3, den: 2})))
            .toEqual(makeInstance({num: Math.sqrt(3 / 2)}));
    });
    test('fixnums', () => {
        expect(sqrt(4)).toBe(2);
        expect(sqrt(-1)).toEqual(EXACT_I);
    });

    test('inexact integers', () => {
        expect(sqrt(INEXACT_ONE)).toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(sqrt(makeInstance({num: 2.5})))
            .toEqual(makeInstance({num: Math.sqrt(2.5)}));
    });

    test('big numbers: unboxed', () => {
        let arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(sqrt(arg * arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        let bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        let arg = makeInstance({num: bignumber, den: BigInt(1)});
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
       expect(integerSqrt(makeInstance({num: 4.0})))
        .toEqual(makeInstance({num: 2.0}));
       expect(integerSqrt(makeInstance({num: -4.0})))
        .toEqual(makeInstance({num: 0.0, imagNum: 2.0}));
       expect(integerSqrt(-4))
        .toEqual(makeInstance({num: 0, den: 1, imagNum: 2, imagDen: 1}));
       expect(integerSqrt(5))
        .toBe(2);
    });
    test('exact numbers', () => {
        expect(integerSqrt(makeInstance({num: 4, den: 1}))).toBe(2);
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
        let arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(integerSqrt((arg * arg) + BigInt(1)))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        let bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        let arg = makeInstance({num: bignumber, den: BigInt(1)});
        expect((integerSqrt(arg.multiply(arg).add(EXACT_ONE))))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
});

// TODO: Continue here and finish the failing tests.
describe('expt', () => {
    test('racket docs examples: 0 base', () => {
        expect(expt(0, 0)).toBe(1);
        expect(expt(0, INEXACT_ZERO))
            .toEqual(INEXACT_ONE);
        expect(expt(0, NAN))
            .toEqual(NAN);
        expect(expt(0, 5)).toBe(0);
    });
    test('racket docs examples: Exact 1/2 exponent', () => {
        expect(expt(9, EXACT_HALF)).toBe(3);
        expect(expt(9, INEXACT_HALF))
            .toEqual(makeInstance({num: 3}));
        expect(expt(16, makeInstance({num: 1, den: 4})))
            .toEqual(makeInstance({num: 2}));
        expect(expt(16, makeInstance({num: 0.25})))
            .toEqual(makeInstance({num: 2}));
    });
    test('racket docs examples: Inexact zero base', () => {
        expect(expt(INEXACT_ZERO, 1))
            .toEqual(INEXACT_ZERO);
        expect(expt(INEXACT_ZERO, -1))
            .toEqual(INF);
    });
    test('racket docs examples: Negative zero base', () => {
        expect(expt(-0, -1))
            .toEqual(NEG_INF);
        expect(expt(makeInstance({num: -0.0}), -1))
            .toEqual(NEG_INF);
        expect(expt(makeInstance({num: -0, den: 1}), -1))
            .toEqual(NEG_INF);
        expect(expt(makeInstance({num: -0.0}), -3))
            .toEqual(NEG_INF);
        expect(expt(makeInstance({num: -0.0}), -2))
            .toEqual(INF);
        expect(expt(makeInstance({num: -0.0}), 1))
            .toEqual(makeInstance({num: -0.0}));
        expect(expt(makeInstance({num: -0.0}), 3))
            .toEqual(makeInstance({num: -0.0}));
        expect(expt(makeInstance({num: -0.0}), 2))
            .toEqual(INEXACT_ZERO);
    });
    test('racket docs examples: Infinite exponent', () => {
        expect(expt(EXACT_TWO, NEG_INF))
            .toEqual(INEXACT_ZERO);
        expect(expt(makeInstance({num: 0.5}), NEG_INF))
            .toEqual(INF);

        expect(expt(EXACT_TWO, INF))
            .toEqual(INF);
        expect(expt(makeInstance({num: 0.5}), INF))
            .toEqual(INEXACT_ZERO);
    });
    test('racket docs examples: Infinite base', () => {
        expect(expt(NEG_INF, -1))
            .toEqual(makeInstance({num: -0}));
        expect(expt(NEG_INF, -2))
            .toEqual(makeInstance({num: 0}));
        expect(expt(NEG_INF, 1))
            .toEqual(NEG_INF);
        expect(expt(NEG_INF, 2))
            .toEqual(INF);

        expect(expt(INF, -1))
            .toEqual(INEXACT_ZERO);
        expect(expt(INF, 2))
            .toEqual(INF);
    });
    test('racket docs examples', () => {
        expect(expt(2, 3)).toBe(8);
        expect(expt(4, makeInstance({num: 0.5})))
            .toEqual(INEXACT_TWO);
        expect(expt(INF, EXACT_ZERO))
            .toBe(1);
    });
    test('boxed numbers', () => {
        expect(expt(EXACT_TWO, INEXACT_TWO))
            .toEqual(makeInstance({num: 4}));
    });
    test('bigints', () => {
        expect(expt(BigInt(100), BigInt(2)))
            .toBe(BigInt(10000));
        expect(expt(makeInstance({num: BigInt(100), den: BigInt(1)}), makeInstance({num: 2, den: 1})))
            .toBe(10000);
    });
    test('complex numbers', () => {
        expect(expt(makeInstance({num: 5,
                                  den: 1,
                                  imagNum: 3,
                                  imagDen: 1}),
                    2))
            .toEqual(makeInstance({num: 16,
                                   den: 1,
                                   imagNum: 30,
                                   imagDen: 1}));
        expect(expt(makeInstance({num: 5,
                                  imagNum: 3}),
                    2))
            .toEqual(makeInstance({num: 16,
                                   imagNum: 30}));
        expect(expt(makeInstance({num: 5,
                                  imagNum: 3}),
                    INEXACT_TWO))
            .toEqual(makeInstance({num: 16.000000000000004,
                                   imagNum: 30.000000000000007}));
        expect(expt(makeInstance({num: 5,
                                  den: 1,
                                  imagNum: 3,
                                  imagDen: 1}),
                    makeInstance({num: 5,
                                  den: 1,
                                  imagNum: 3,
                                  imagDen: 1})))
            .toEqual(makeInstance({num: -182.81777310243467,
                                  imagNum: 1319.6714172143932}))
        expect(expt(makeInstance({num: 5,
                                  den: 1,
                                  imagNum: 3,
                                  imagDen: 1}),
                    makeInstance({num: -7,
                                  den: 1,
                                  imagNum: -9,
                                  imagDen: 1})))
            .toEqual(makeInstance({num: 0.0003929046784149532,
                                  imagNum: -0.00040617442897733556}))
    });
});

describe('exp', () => {
    test('fixnums', () => {
        expect(exp(2))
            .toEqual(makeInstance({num: 7.38905609893065}));
        expect(exp(-2))
            .toEqual(makeInstance({num: 0.1353352832366127}));
    });
    test('boxed numbers', () => {
        expect(exp(EXACT_TWO))
            .toEqual(makeInstance({num: 7.38905609893065}));
        expect(exp(INEXACT_TWO))
            .toEqual(makeInstance({num: 7.38905609893065}));
        expect(exp(INEXACT_ZERO))
            .toEqual(makeInstance({num: 1}));
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
        expect(exp(1)).toEqual(makeInstance({num: 2.718281828459045}));
    });
});

describe('log', () => {
    test('fixnums', () => {
        expect(log(2))
            .toEqual(makeInstance({num: 0.6931471805599453}));
        expect(log(-2))
            .toEqual(makeInstance({num: 0.6931471805599453, imagNum: 3.141592653589793}));
        expect(log(2, 2))
            .toEqual(INEXACT_ONE);
        expect(log(2, -3))
            .toEqual(makeInstance({num: 0.06874882335131484, imagNum: -0.19659419488678306}));
    });
    test('boxed numbers', () => {
        expect(log(EXACT_TWO))
            .toEqual(makeInstance({num: 0.6931471805599453}));
        expect(log(INEXACT_TWO))
            .toEqual(makeInstance({num: 0.6931471805599453}));
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
    });
    test('racket docs examples', () => {
        expect(log(exp(1)))
            .toEqual(INEXACT_ONE);
        expect(log(1))
            .toBe(0);
        expect(log(100, 10))
            .toEqual(INEXACT_TWO);
        expect(log(8, 2))
            .toEqual(makeInstance({num: 3}));
        expect(log(5, 5))
            .toEqual(INEXACT_ONE);
    });
    test('bigints', () => {
        expect(log(exp(BigInt(1))))
            .toEqual(INEXACT_ONE);
        expect(log(BigInt(1)))
            .toBe(0);
        expect(log(BigInt(8), BigInt(2)))
            .toEqual(makeInstance({num: 3}));
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
        expect(numerator(makeInstance({num: BigInt(2), den: BigInt(1)}))).toBe(2);
        expect(numerator(makeInstance({num: BigInt(1), den: BigInt(2)}))).toBe(1);
        expect(numerator(makeInstance({num: -2, den: 1}))).toBe(-2);
    });
    test('boxed numbers: inexact', () => {
        expect(numerator(INEXACT_TWO)).toEqual(INEXACT_TWO);
        expect(numerator(INEXACT_HALF)).toEqual(INEXACT_ONE);
        expect(numerator(makeInstance({num: -2}))).toEqual(makeInstance({num: -2}));
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
        expect(denominator(makeInstance({num: BigInt(2), den: BigInt(1)}))).toBe(1);
        expect(denominator(makeInstance({num: BigInt(1), den: BigInt(2)}))).toBe(2);
        expect(denominator(makeInstance({num: -2, den: 1}))).toBe(1);
    });
    test('boxed numbers: inexact', () => {
        expect(denominator(INEXACT_TWO)).toEqual(INEXACT_ONE);
        expect(denominator(INEXACT_HALF)).toEqual(INEXACT_TWO);
        expect(denominator(makeInstance({num: -2}))).toEqual(INEXACT_ONE);
    });
});

// TODO: Continue from here...
describe.skip('gcd', () => {
    test('racket docs examples', () => {
        expect(gcd(10)).toBe(10);
        expect(gcd(12, makeInstance({num: 81}))).toEqual(makeInstance({num: 3}));
        expect(gcd(makeInstance({num: 1, den: 2}), makeInstance({num: 1, den: 3})))
            .toEqual(makeInstance({num: 3}));
    });
    test('fixnums', () => {
        expect()
    });
    test('boxed numbers: exact', () => {

    });
    test('boxed numbers: inexact', () => {

    });
    test('mixed exactness', () => {

    });
    test('multi-arity', () => {

    });
});

// TODO: Fill in functions above this point

describe('abs', () => {
    test('exact numbers', () => {
        expect(abs(EXACT_ONE)).toBe(1);
        expect(abs(makeInstance({num: -1, den: 1})))
            .toBe(1);
        expect(abs(makeInstance({num: 3, den: 2})))
            .toEqual(makeInstance({num: 3, den: 2}));
    });
    test('fixnums', () => {
        expect(abs(-2)).toBe(2);
        expect(abs(1)).toBe(1);
    });

    test('inexact integers', () => {
        expect(abs(makeInstance({num: -1})))
            .toEqual(INEXACT_ONE);
    });
    test('inexact decimals', () => {
        expect(abs(makeInstance({num: -2.5})))
            .toEqual(makeInstance({num: 2.5}));
    });

    test('big numbers: unboxed', () => {
        let arg = BigInt(Number.MIN_SAFE_INTEGER);
        expect(abs(arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        let bignumber = BigInt(Number.MIN_SAFE_INTEGER);
        let arg = makeInstance({num: bignumber, den: BigInt(1)});
        expect(abs(arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
});

describe('floor', () => {
    test('exact numbers', () => {
        expect(floor(EXACT_ONE)).toBe(1);
        expect(floor(makeInstance({num: -1, den: 1})))
            .toBe(-1);
        expect(floor(makeInstance({num: 3, den: 2})))
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
        expect(floor(makeInstance({num: -2.5})))
            .toEqual(makeInstance({num: -3}));
    });

    test('big numbers: unboxed', () => {
        let arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(floor(arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        let bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        let arg = makeInstance({num: bignumber, den: BigInt(2)});
        expect(floor(arg))
            .toBe(4503599627370495);
    });
});

describe('ceiling', () => {
    test('exact numbers', () => {
        expect(ceiling(EXACT_ONE)).toBe(1);
        expect(ceiling(makeInstance({num: -1, den: 1})))
            .toBe(-1);
        expect(ceiling(makeInstance({num: 3, den: 2})))
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
        expect(ceiling(makeInstance({num: -2.5})))
            .toEqual(makeInstance({num: -2}));
    });

    test('big numbers: unboxed', () => {
        let arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(ceiling(arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        let bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        let arg = makeInstance({num: bignumber, den: BigInt(2)});
        expect(ceiling(arg))
            .toBe(4503599627370496);
    });
});

describe('round', () => {
    test('exact numbers', () => {
        expect(round(EXACT_ONE)).toBe(1);
        expect(round(makeInstance({num: -1, den: 1})))
            .toBe(-1);
        expect(round(makeInstance({num: 3, den: 2})))
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
        expect(round(makeInstance({num: -2.5})))
            .toEqual(makeInstance({num: -2}));
    });

    test('big numbers: unboxed', () => {
        let arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(round(arg))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        let bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        let arg = makeInstance({num: bignumber, den: BigInt(2)});
        expect(round(arg))
            .toBe(4503599627370496);
    });
});
