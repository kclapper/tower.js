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
} from '../src/functions/util';

test('normalized', () => {
    const add1 = normalized((n: RacketNumber): RacketNumber => {
        if (typeof n === 'number') {
            return n + 1;
        }
        return n.add(ONE);
    })

    expect(add1(1))
        .toBe(2);
    expect(add1(new SmallExactNumber(2)))
        .toEqual(new SmallExactNumber(3))
    expect(add1(new InexactNumber(1)))
        .toBe(2);
    expect(add1(new BigExactNumber(1n)))
        .toEqual(new SmallExactNumber(2));
    expect(add1(new SmallExactNumber(2, 3)))
        .toEqual(new SmallExactNumber(5, 3))
    expect(add1(new ComplexNumber(ONE, ONE)))
        .toEqual(new ComplexNumber(new SmallExactNumber(2), ONE))
});
