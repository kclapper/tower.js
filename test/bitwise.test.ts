import {
    bitwiseOr,
    bitwiseXor,
    bitwiseAnd,
    bitwiseNot,
    arithmeticShift
} from '../src/tower';

test('bitwiseOr', () => {
    expect(bitwiseOr(1, 2)).toBe(3);
    expect(bitwiseOr(-32, 1)).toBe(-31);
    expect(bitwiseOr(-32, 1, 2)).toBe(-29);

    const bignumber = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2);
    expect(bitwiseOr(bignumber, 0)).toBe(bignumber);
    expect(bitwiseOr(bignumber, 0, bignumber)).toBe(bignumber);
});

test('bitwiseXor', () => {
    expect(bitwiseXor(1, 5)).toBe(4);
    expect(bitwiseXor(-32, -1)).toBe(31);
    expect(bitwiseXor(-32, 1, 2)).toBe(-29);

    const bignumber = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2);
    expect(bitwiseXor(bignumber, 0)).toBe(bignumber);
    expect(bitwiseXor(bignumber, 0, bignumber)).toBe(0);
});

test('bitwiseAnd', () => {
    expect(bitwiseAnd(1, 2)).toBe(0);
    expect(bitwiseAnd(-32, -1)).toBe(-32);
    expect(bitwiseAnd(-32, 1, 2)).toBe(0);

    const bignumber = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2);
    expect(bitwiseAnd(bignumber, bignumber)).toBe(bignumber);
    expect(bitwiseAnd(bignumber, 0, bignumber)).toBe(0);
});

test('bitwiseNot', () => {
    expect(bitwiseNot(5)).toBe(-6);
    expect(bitwiseNot(-1)).toBe(0);

    const arg = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
    const expected = BigInt(Number.MIN_SAFE_INTEGER) - BigInt(2);
    expect(bitwiseNot(arg)).toBe(expected);
});

test('arithmeticShift', () => {
    expect(arithmeticShift(1, 10)).toBe(1024);
    expect(arithmeticShift(255, -3)).toBe(31);

    const arg = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2);
    const expected = arg << BigInt(5);
    expect(arithmeticShift(arg, 5)).toBe(expected);
});
