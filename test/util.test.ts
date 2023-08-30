import {
    RacketNumber,
    InexactNumber,
    SmallExactNumber,
    BigExactNumber,
    ComplexNumber,
    ONE
} from '../src/tower';
import {
    normalized,
    makeCompatible
} from '../src/functions/util';

test('normalized', () => {
    const add1 = normalized((n: RacketNumber): RacketNumber => {
        if (typeof n === 'number') {
            return n + 1;
        }
        if (typeof n === 'bigint') {
            return n + 1n;
        }
        return n.add(ONE);
    })

    expect(add1(1))
        .toBe(2);
    expect(add1(new SmallExactNumber(2)))
        .toEqual(3n)
    expect(add1(new InexactNumber(1)))
        .toBe(2);
    expect(add1(new BigExactNumber(1n)))
        .toEqual(2n);
    expect(add1(new SmallExactNumber(2, 3)))
        .toEqual(new SmallExactNumber(5, 3))
    expect(add1(new ComplexNumber(ONE, ONE)))
        .toEqual(new ComplexNumber(new SmallExactNumber(2), ONE))
});

test('makeCompatible', () => {
    expect(makeCompatible(1, 1n))
        .toEqual([1, 1]);
    expect(makeCompatible(1, ONE))
        .toEqual([new InexactNumber(1), ONE]);
    expect(makeCompatible(1n, ONE))
        .toEqual([new SmallExactNumber(1), ONE]);
});
