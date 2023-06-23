import {
    BoxedNumber,
    inexactToExact,
    exactToInexact,
} from '../src/tower';

const makeInstance = BoxedNumber.makeInstance;

describe('inexactToExact', () => {
    test('fixnums', () => {
        expect(inexactToExact(5)).toBe(5);
        expect(inexactToExact(BigInt(5))).toBe(BigInt(5));
    });
    test('boxed numbers', () => {
        expect(inexactToExact(makeInstance({num: 5})))
            .toBe(5);
        expect(inexactToExact(makeInstance({num: 5.5})))
            .toEqual(makeInstance({num: 11, den: 2}));
        expect(inexactToExact(makeInstance({num: 5, den: 1})))
            .toBe(5);
        expect(inexactToExact(makeInstance({num: 5, den: 2})))
            .toEqual(makeInstance({num: 5, den: 2}));
    });
});

describe('exactToInexact', () => {
    test('fixnums', () => {
        expect(exactToInexact(5))
            .toEqual(makeInstance({num: 5}));
        expect(exactToInexact(BigInt(5)))
            .toEqual(makeInstance({num: 5}));
    });
    test('boxed numbers', () => {
        expect(exactToInexact(makeInstance({num: 5})))
            .toEqual(makeInstance({num: 5}));
        expect(exactToInexact(makeInstance({num: 5.5})))
            .toEqual(makeInstance({num: 5.5}));
        expect(exactToInexact(makeInstance({num: 5, den: 1})))
            .toEqual(makeInstance({num: 5}));
        expect(exactToInexact(makeInstance({num: 5, den: 2})))
            .toEqual(makeInstance({num: 2.5}));
    });
});
