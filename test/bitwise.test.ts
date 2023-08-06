import {
    EXACT_ZERO,
    EXACT_ONE,
    EXACT_TWO,
    EXACT_NEG_ONE,
    bitwiseOr,
    bitwiseXor,
    bitwiseAnd,
    bitwiseNot,
    arithmeticShift,
    SmallExactNumber,
    BigExactNumber
} from '../src/tower';

test('bitwiseOr', () => {
    expect(bitwiseOr(EXACT_ONE, EXACT_TWO))
        .toEqual(new SmallExactNumber(3));
    expect(bitwiseOr(new SmallExactNumber(-32), new SmallExactNumber(1)))
        .toEqual(new SmallExactNumber(-31));
    expect(bitwiseOr(new SmallExactNumber(-32), EXACT_ONE, EXACT_TWO))
        .toEqual(new SmallExactNumber(-29));

    const bignumber = new BigExactNumber(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2));
    expect(bitwiseOr(bignumber, EXACT_ZERO))
        .toEqual(bignumber);
    expect(bitwiseOr(bignumber, EXACT_ZERO, bignumber))
        .toEqual(bignumber);
});

test('bitwiseXor', () => {
    expect(bitwiseXor(EXACT_ONE, new SmallExactNumber(5)))
        .toEqual(new SmallExactNumber(4));
    expect(bitwiseXor(new SmallExactNumber(-32), EXACT_NEG_ONE))
        .toEqual(new SmallExactNumber(31));
    expect(bitwiseXor(new SmallExactNumber(-32), EXACT_ONE, EXACT_TWO))
        .toEqual(new SmallExactNumber(-29));

    const bignumber = new BigExactNumber(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2));
    expect(bitwiseXor(bignumber, EXACT_ZERO))
        .toEqual(bignumber);
    expect(bitwiseXor(bignumber, EXACT_ZERO, bignumber))
        .toEqual(EXACT_ZERO);
});

test('bitwiseAnd', () => {
    expect(bitwiseAnd(EXACT_ONE, EXACT_TWO))
        .toEqual(EXACT_ZERO);
    expect(bitwiseAnd(new SmallExactNumber(-32), EXACT_NEG_ONE))
        .toEqual(new SmallExactNumber(-32));
    expect(bitwiseAnd(new SmallExactNumber(-32), EXACT_ONE, EXACT_TWO))
        .toEqual(EXACT_ZERO);

    const bignumber = new BigExactNumber(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2));
    expect(bitwiseAnd(bignumber, bignumber))
        .toEqual(bignumber);
    expect(bitwiseAnd(bignumber, EXACT_ZERO, bignumber))
        .toEqual(EXACT_ZERO);
});

test('bitwiseNot', () => {
    expect(bitwiseNot(new SmallExactNumber(5)))
        .toEqual(new SmallExactNumber(-6));
    expect(bitwiseNot(EXACT_NEG_ONE))
        .toEqual(EXACT_ZERO);

    const arg = new BigExactNumber(BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1));
    const expected = new BigExactNumber(BigInt(Number.MIN_SAFE_INTEGER) - BigInt(2));
    expect(bitwiseNot(arg))
        .toEqual(expected);
});

test('arithmeticShift', () => {
    expect(arithmeticShift(EXACT_ONE, new SmallExactNumber(10)))
        .toEqual(new SmallExactNumber(1024));
    expect(arithmeticShift(new SmallExactNumber(255), new SmallExactNumber(-3)))
        .toEqual(new SmallExactNumber(31));

    const arg = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2);
    const expected = arg << BigInt(5);
    expect(arithmeticShift(new BigExactNumber(arg), new SmallExactNumber(5)))
        .toEqual(new BigExactNumber(expected));
});
