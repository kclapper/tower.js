import {describe, expect, test} from '@jest/globals';
import {
    BoxedNumber,
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
    abs,
    floor,
    ceiling,
    round
} from '../src/tower';

const makeInstance = BoxedNumber.makeInstance;

const ExactZero = makeInstance({num: 0, den: 1});
const ExactHalf = makeInstance({num: 1, den: 2});
const ExactOne = makeInstance({num: 1, den: 1});
const ExactTwo = makeInstance({num: 1, den: 1});
test('Exact constants are exact', () => {
    expect(ExactOne.isExact()).toBe(true);
    expect(ExactOne.isReal()).toBe(true);
});

const InexactZero = makeInstance({num: 0});
const InexactHalf = makeInstance({num: 0.5});
const InexactOne = makeInstance({num: 1});
const InexactTwo = makeInstance({num: 2});
test('Inexact constants are inexact', () => {
    expect(InexactOne.isInexact()).toBe(true);
    expect(InexactOne.isReal()).toBe(true);
});

const ExactI = makeInstance({num: 0, den: 1, imagNum: 1, imagDen: 1});
test('Complex numbers are complex', () => {
    expect(ExactI.isComplex()).toBe(true);
    expect(ExactI.isReal()).toBe(false);
    expect(ExactI.isExact()).toBe(true);
});

const INF = makeInstance({num: Number.POSITIVE_INFINITY});
const NEG_INF = makeInstance({num: Number.NEGATIVE_INFINITY});
const NAN = makeInstance({num: Number.NaN});

describe('+ operator', () => {
    test('no arguments', () => {
        expect(add()).toBe(0);
    });
    test('one argument', () => {
        expect(add(5)).toBe(5);
    });

    test('exact numbers', () => {
        expect(add(ExactOne, ExactOne)).toBe(2);
    });
    test('fixnums', () => {
        expect(add(1, 2)).toBe(3);
    });

    test('inexact integers', () => {
        expect(add(InexactOne, InexactOne)).toEqual(InexactTwo);
    });
    test('inexact decimals', () => {
        expect(add(InexactOne,
                   makeInstance({num: 2.5})))
            .toEqual(makeInstance({num: 3.5}));
    });

    test('Mixed precision: boxed', () => {
        expect(add(ExactOne, InexactOne)).toEqual(InexactTwo);
    });
    test('Mixed precision: with fixnums', () => {
        expect(add(1, InexactOne)).toEqual(InexactTwo);
    });


    test('Multi arity', () => {
        expect(add(1,
                   ExactOne,
                   InexactOne,
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
        expect(subtract(ExactOne, ExactOne)).toBe(0);
    });
    test('fixnums', () => {
        expect(subtract(1, 2)).toBe(-1);
    });

    test('inexact integers', () => {
        expect(subtract(InexactOne, InexactOne))
            .toEqual(InexactZero);
    });
    test('inexact decimals', () => {
        expect(subtract(InexactOne,
                   makeInstance({num: 2.5})))
            .toEqual(makeInstance({num: -1.5}));
    });

    test('Mixed precision: boxed', () => {
        expect(subtract(ExactOne, InexactOne)).toEqual(InexactZero);
    });
    test('Mixed precision: with fixnums', () => {
        expect(subtract(1, InexactOne)).toEqual(InexactZero);
    });


    test('Multi arity', () => {
        expect(subtract(1,
                   ExactOne,
                   InexactOne,
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
        expect(multiply(ExactOne, ExactOne)).toBe(1);
    });
    test('fixnums', () => {
        expect(multiply(1, 2)).toBe(2);
    });

    test('inexact integers', () => {
        expect(multiply(InexactOne, InexactOne)).toEqual(InexactOne);
    });
    test('inexact decimals', () => {
        expect(multiply(InexactOne,
                   makeInstance({num: 2.5})))
            .toEqual(makeInstance({num: 2.5}));
    });

    test('Mixed precision: boxed', () => {
        expect(multiply(ExactOne, InexactOne)).toEqual(InexactOne);
    });
    test('Mixed precision: with fixnums', () => {
        expect(multiply(1, InexactOne)).toEqual(InexactOne);
    });


    test('Multi arity', () => {
        expect(multiply(1,
                   ExactOne,
                   InexactOne,
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
        expect(divide(ExactOne, ExactOne)).toBe(1);
    });
    test('fixnums', () => {
        expect(divide(1, 2)).toEqual(makeInstance({num: 1, den: 2}));
    });

    test('inexact integers', () => {
        expect(divide(InexactOne, InexactOne)).toEqual(InexactOne);
    });
    test('inexact decimals', () => {
        expect(divide(InexactOne,
                      makeInstance({num: 2.5})))
            .toEqual(makeInstance({num: 1 / 2.5}));
    });

    test('Mixed precision: boxed', () => {
        expect(divide(ExactOne, InexactOne)).toEqual(InexactOne);
    });
    test('Mixed precision: with fixnums', () => {
        expect(divide(1, InexactOne)).toEqual(InexactOne);
    });


    test('Multi arity', () => {
        expect(divide(1,
                      ExactOne,
                      InexactOne,
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
        expect(quotient(ExactOne, ExactOne)).toBe(1);
    });
    test('fixnums', () => {
        expect(quotient(1, 2)).toBe(0);
    });

    test('inexact integers', () => {
        expect(quotient(InexactOne, InexactOne)).toEqual(InexactOne);
    });
    test('inexact decimals', () => {
        expect(quotient(InexactOne,
                        makeInstance({num: 2.5})))
            .toEqual(makeInstance({num: 0}));
    });

    test('Mixed precision: boxed', () => {
        expect(quotient(ExactOne, InexactOne)).toEqual(InexactOne);
    });
    test('Mixed precision: with fixnums', () => {
        expect(quotient(1, InexactOne)).toEqual(InexactOne);
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
        expect(remainder(ExactOne, ExactOne)).toBe(0);
        expect(remainder(makeInstance({num: 3, den: 2}),
                      ExactOne))
            .toEqual(makeInstance({num: 1, den: 2}));
    });
    test('fixnums', () => {
        expect(remainder(1, 2)).toBe(1);
    });

    test('inexact integers', () => {
        expect(remainder(InexactOne, InexactOne)).toEqual(InexactZero);
    });
    test('inexact decimals', () => {
        expect(remainder(makeInstance({num: 2.5}),
                      InexactOne))
            .toEqual(makeInstance({num: 0.5}));
    });

    test('Mixed precision: boxed', () => {
        expect(remainder(ExactOne, InexactOne)).toEqual(InexactZero);
    });
    test('Mixed precision: with fixnums', () => {
        expect(remainder(1, InexactOne)).toEqual(InexactZero);
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
        expect(modulo(ExactOne, ExactOne)).toBe(0);
        expect(modulo(makeInstance({num: 3, den: 2}),
                      ExactOne))
            .toEqual(makeInstance({num: 1, den: 2}));
    });
    test('fixnums', () => {
        expect(modulo(1, 2)).toBe(1);
    });

    test('inexact integers', () => {
        expect(modulo(InexactOne, InexactOne)).toEqual(InexactZero);
    });
    test('inexact decimals', () => {
        expect(modulo(makeInstance({num: 2.5}),
                      InexactOne))
            .toEqual(makeInstance({num: 0.5}));
    });

    test('Mixed precision: boxed', () => {
        expect(modulo(ExactOne, InexactOne)).toEqual(InexactZero);
    });
    test('Mixed precision: with fixnums', () => {
        expect(modulo(1, InexactOne)).toEqual(InexactZero);
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
        expect(remainder(ExactOne, ExactOne)).toBe(0);
        expect(remainder(makeInstance({num: 3, den: 2}),
                      ExactOne))
            .toEqual(makeInstance({num: 1, den: 2}));
    });
    test('fixnums', () => {
        expect(remainder(1, 2)).toBe(1);
    });

    test('inexact integers', () => {
        expect(remainder(InexactOne, InexactOne)).toEqual(InexactZero);
    });
    test('inexact decimals', () => {
        expect(remainder(makeInstance({num: 2.5}),
                      InexactOne))
            .toEqual(makeInstance({num: 0.5}));
    });

    test('Mixed precision: boxed', () => {
        expect(remainder(ExactOne, InexactOne)).toEqual(InexactZero);
    });
    test('Mixed precision: with fixnums', () => {
        expect(remainder(1, InexactOne)).toEqual(InexactZero);
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
        expect(sqr(ExactOne)).toBe(1);
        expect(sqr(makeInstance({num: 3, den: 2})))
            .toEqual(makeInstance({num: 9, den: 4}));
    });
    test('fixnums', () => {
        expect(sqr(2)).toBe(4);
        expect(sqr(-1)).toBe(1);
    });

    test('inexact integers', () => {
        expect(sqr(InexactOne)).toEqual(InexactOne);
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
        expect(sqr(ExactI)).toEqual(-1);
    })
});

describe('sqrt', () => {
    test('exact numbers', () => {
        expect(sqrt(ExactOne)).toBe(1);
        expect(sqrt(makeInstance({num: 3, den: 2})))
            .toEqual(makeInstance({num: Math.sqrt(3 / 2)}));
    });
    test('fixnums', () => {
        expect(sqrt(4)).toBe(2);
        expect(sqrt(-1)).toEqual(ExactI);
    });

    test('inexact integers', () => {
        expect(sqrt(InexactOne)).toEqual(InexactOne);
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
        expect(sqrt(ExactI))
            .toEqual(makeInstance({
                num: 0.7071067811865475,
                imagNum: 0.7071067811865475
            }));
    });
});

describe('sqrt', () => {
    test('exact numbers', () => {
        expect(sqrt(ExactOne)).toBe(1);
        expect(sqrt(makeInstance({num: 3, den: 2})))
            .toEqual(makeInstance({num: Math.sqrt(3 / 2)}));
    });
    test('fixnums', () => {
        expect(sqrt(4)).toBe(2);
        expect(sqrt(-1)).toEqual(ExactI);
    });

    test('inexact integers', () => {
        expect(sqrt(InexactOne)).toEqual(InexactOne);
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
        expect(sqrt(ExactI))
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
        expect(integerSqrt(-1)).toEqual(ExactI);
        expect(integerSqrt(101)).toBe(10);
    });

    test('inexact integers', () => {
        expect(integerSqrt(InexactOne)).toEqual(InexactOne);
    });

    test('big numbers: unboxed', () => {
        let arg = BigInt(Number.MAX_SAFE_INTEGER);
        expect(integerSqrt((arg * arg) + BigInt(1)))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
    test('big numbers: boxed', () => {
        let bignumber = BigInt(Number.MAX_SAFE_INTEGER);
        let arg = makeInstance({num: bignumber, den: BigInt(1)});
        expect((integerSqrt(arg.multiply(arg).add(ExactOne))))
            .toBe(Number.MAX_SAFE_INTEGER);
    });
});

describe('expt', () => {
    test('racket docs examples', () => {
        expect(expt(0, 0)).toBe(1);
        expect(expt(0, InexactZero))
            .toEqual(InexactOne);
        expect(expt(0, NAN))
            .toEqual(NAN);
        expect(expt(0, 5)).toBe(0);

        expect(expt(9, ExactHalf)).toBe(3);
        expect(expt(9, InexactHalf))
            .toEqual(makeInstance({num: 3}));
        expect(expt(16, makeInstance({num: 1, den: 4})))
            .toEqual(makeInstance({num: 2}));
        expect(expt(16, makeInstance({num: 0.25})))
            .toEqual(makeInstance({num: 2}));

        expect(expt(InexactZero, 1))
            .toEqual(InexactZero);
        expect(expt(InexactZero, -1))
            .toEqual(INF);

        expect(expt(makeInstance({num: -0.0}), -1))
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
            .toEqual(InexactZero);

        expect(expt(ExactTwo, NEG_INF))
            .toEqual(InexactZero);
        expect(expt(makeInstance({num: 0.5}), NEG_INF))
            .toEqual(INF);

        expect(expt(ExactTwo, INF))
            .toEqual(INF);
        expect(expt(makeInstance({num: 0.5}), INF))
            .toEqual(InexactZero);

        expect(expt(NEG_INF, -1))
            .toEqual(makeInstance({num: -0}));
        expect(expt(NEG_INF, -2))
            .toEqual(makeInstance({num: 0}));
        expect(expt(NEG_INF, 1))
            .toEqual(NEG_INF);
        expect(expt(NEG_INF, 2))
            .toEqual(INF);

        expect(expt(INF, -1))
            .toEqual(InexactZero);
        expect(expt(INF, 2))
            .toEqual(INF);

        expect(expt(2, 3)).toBe(8);
        expect(expt(4, makeInstance({num: 0.5})))
            .toEqual(InexactTwo);
        expect(expt(INF, ExactZero))
            .toBe(1);
    });
    // TODO: Continue here. Add more tests for expt to
    // exercise the the various data types.
});

// TODO: Fill in functions above this point

describe('abs', () => {
    test('exact numbers', () => {
        expect(abs(ExactOne)).toBe(1);
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
            .toEqual(InexactOne);
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
        expect(floor(ExactOne)).toBe(1);
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
        expect(floor(InexactOne))
            .toEqual(InexactOne);
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
        expect(ceiling(ExactOne)).toBe(1);
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
        expect(ceiling(InexactOne))
            .toEqual(InexactOne);
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
        expect(round(ExactOne)).toBe(1);
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
        expect(round(InexactOne))
            .toEqual(InexactOne);
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
