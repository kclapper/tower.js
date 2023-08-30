import {
    inexactToExact,
    exactToInexact,
    divide,
    fromString,
    numberToString,
} from '../src/tower';

describe('inexactToExact', () => {
    test('inexact numbers', () => {
        expect(inexactToExact(fromString("5.0")))
            .toEqual(fromString(`5`));
        expect(inexactToExact(fromString(`5.5`)))
            .toEqual(fromString(`11/2`));
        expect(inexactToExact(fromString(`5.0`)))
            .toEqual(fromString(`5`));
        expect(inexactToExact(fromString(`5.5`)))
            .toEqual(fromString(`11/2`));
    });
    test('exact numbers', () => {
        expect(inexactToExact(fromString(`5`)))
            .toEqual(fromString(`5`));
        expect(inexactToExact(fromString(`5/2`)))
            .toEqual(fromString(`5/2`));
    });
});

describe('exactToInexact', () => {
    test('inexact numbers', () => {
        expect(exactToInexact(fromString(`5.0`)))
            .toEqual(fromString(`5.0`));
        expect(exactToInexact(fromString(`5.0`)))
            .toEqual(fromString(`5.0`));
        expect(exactToInexact(fromString(`5.5`)))
            .toEqual(fromString(`5.5`));
    });
    test('exact numbers', () => {
        expect(exactToInexact(fromString(`5`)))
            .toEqual(fromString(`5.0`));
        expect(exactToInexact(fromString(`5/2`)))
            .toEqual(fromString(`2.5`));
    });
});

describe('numberToString', () => {
    test('inexact numbers', () => {
        expect(numberToString(fromString(`5.0`)))
            .toEqual("5.0");
        expect(numberToString(fromString(`-5.0`)))
            .toEqual("-5.0");
        expect(numberToString(fromString(`5.0`)))
            .toEqual("5.0");
        expect(numberToString(fromString(`-5.0`)))
            .toEqual("-5.0");
    });
    test('exact numbers', () => {
        expect(numberToString(fromString(`5`)))
            .toEqual("5");
        expect(numberToString(fromString(`5`)))
            .toEqual("5");
        expect(numberToString(fromString(`-5`)))
            .toEqual("-5");
        expect(numberToString(fromString(`-5`)))
            .toEqual("-5");
        expect(numberToString(fromString(`5`)))
            .toEqual("5");
        expect(numberToString(fromString(`-5/2`)))
            .toEqual("-5/2");
    });
    test('non-finite numbers', () => {
        expect(numberToString(fromString("+nan.0")))
            .toEqual("+nan.0");
        expect(numberToString(fromString("+inf.0")))
            .toEqual("+inf.0");
        expect(numberToString(fromString("-inf.0")))
            .toEqual("-inf.0");
    });
    test('complex: exact', () => {
        expect(numberToString(fromString(`5+3/7i`)))
            .toEqual("5+3/7i");
        expect(numberToString(fromString(`-5-3/7i`)))
            .toEqual("-5-3/7i");
        expect(numberToString(fromString(`5-3/7i`)))
            .toEqual("5-3/7i");
        expect(numberToString(fromString(`-5-3/7i`)))
            .toEqual("-5-3/7i");
        expect(numberToString(fromString(`5+3/7i`)))
            .toEqual("5+3/7i");
        expect(numberToString(divide(fromString("1-3i"),
                                     fromString("1+3i"),
                                     fromString("2"),
                                     fromString(`5`))))
            .toEqual("-2/25-3/50i");
    });
    test('complex: inexact', () => {
        expect(numberToString(fromString(`5.0+3.0i`)))
            .toEqual("5.0+3.0i");
        expect(numberToString(fromString(`5.0-3.0i`)))
            .toEqual("5.0-3.0i");
        expect(numberToString(fromString(`-5.0+3.0i`)))
            .toEqual("-5.0+3.0i");
        expect(numberToString(fromString(`-5.0-3.0i`)))
            .toEqual("-5.0-3.0i");
        expect(numberToString(fromString("+nan.0+nan.0i")))
            .toEqual("+nan.0+nan.0i");
    });
});
