import {describe, expect, test} from '@jest/globals';
import {
    BoxedNumber,
    add,
    subtract,
    multiply,
    divide,
    quotient,
} from '../src/tower';

const makeInstance = BoxedNumber.makeInstance;

const ExactZero = makeInstance({num: 0, den: 1});
const ExactOne = makeInstance({num: 1, den: 1});
const ExactTwo = makeInstance({num: 1, den: 1});
test('Exact constants are exact', () => {
    expect(ExactOne.isExact()).toBe(true);
    expect(ExactOne.isReal()).toBe(true);
});

const InexactZero = makeInstance({num: 0});
const InexactOne = makeInstance({num: 1});
const InexactTwo = makeInstance({num: 2});
test('Inexact constants are inexact', () => {
    expect(InexactOne.isInexact()).toBe(true);
    expect(InexactOne.isReal()).toBe(true);
});

const ExactI = makeInstance({num: 0, den: 0, imagNum: 1, imagDen: 0});
test('Complex numbers are complex', () => {
    expect(ExactI.isComplex()).toBe(true);
    expect(ExactI.isReal()).toBe(false);
    expect(ExactI.isExact()).toBe(true);
});

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
            .toEqual(makeInstance({num: BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2), den: BigInt(1)}));
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
            .toEqual(makeInstance({num: BigInt(Number.MIN_SAFE_INTEGER) - BigInt(2), den: BigInt(1)}));
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
            .toEqual(makeInstance({num: BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2), den: BigInt(1)}));
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

// TODO: Continue here and move on to modulo
