import {
    EXACT_NEG_ONE,
    bitwiseOr,
    bitwiseXor,
    bitwiseAnd,
    bitwiseNot,
    arithmeticShift,
    fromString
} from '../src/tower';

test('bitwiseOr', () => {
    expect(bitwiseOr(fromString("1"), fromString("2")))
        .toEqual(fromString(`3`));
    expect(bitwiseOr(fromString("-32"), fromString("1")))
        .toEqual(fromString(`-31`));
    expect(bitwiseOr(fromString("-32"), fromString("1"), fromString("2")))
        .toEqual(fromString(`-29`));

    const bignumber = fromString(`${BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)}`);
    expect(bitwiseOr(bignumber, fromString("0")))
        .toEqual(bignumber);
    expect(bitwiseOr(bignumber, fromString("0"), bignumber))
        .toEqual(bignumber);
});

test('bitwiseXor', () => {
    expect(bitwiseXor(fromString("1"), fromString("5")))
        .toEqual(fromString(`4`));
    expect(bitwiseXor(fromString("-32"), EXACT_NEG_ONE))
        .toEqual(fromString(`31`));
    expect(bitwiseXor(fromString("-32"), fromString("1"), fromString("2")))
        .toEqual(fromString(`-29`));

    const bignumber = fromString(`${BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)}`);
    expect(bitwiseXor(bignumber, fromString("0")))
        .toEqual(bignumber);
    expect(bitwiseXor(bignumber, fromString("0"), bignumber))
        .toEqual(fromString("0"));
});

test('bitwiseAnd', () => {
    expect(bitwiseAnd(fromString("1"), fromString("2")))
        .toEqual(fromString("0"));
    expect(bitwiseAnd(fromString("-32"), fromString("-1")))
        .toEqual(fromString("-32"));
    expect(bitwiseAnd(fromString("-32"), fromString("1"), fromString("2")))
        .toEqual(fromString("0"));

    const bignumber = fromString(`${BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2)}`);
    expect(bitwiseAnd(bignumber, bignumber))
        .toEqual(bignumber);
    expect(bitwiseAnd(bignumber, fromString("0"), bignumber))
        .toEqual(fromString("0"));
});

test('bitwiseNot', () => {
    expect(bitwiseNot(fromString("5")))
        .toEqual(fromString(`-6`));
    expect(bitwiseNot(fromString("-1")))
        .toEqual(fromString("0"));

    const arg = fromString(`${BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1)}`);
    const expected = fromString(`${BigInt(Number.MIN_SAFE_INTEGER) - BigInt(2)}`);
    expect(bitwiseNot(arg))
        .toEqual(expected);
});

test('arithmeticShift', () => {
    expect(arithmeticShift(fromString("1"), fromString(`10`)))
        .toEqual(fromString(`1024`));
    expect(arithmeticShift(fromString(`255`), fromString(`-3`)))
        .toEqual(fromString(`31`));

    const arg = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2);
    const expected = arg << BigInt(5);
    expect(arithmeticShift(fromString(`${arg}`), fromString("5")))
        .toEqual(fromString(`${expected}`));
});
