/* eslint @typescript-eslint/no-explicit-any: "off" */

import {
    InexactNumber,
    SmallExactNumber,
    fromString
} from '../src/tower';

describe('string', () => {
    test('coercion', () => {
        expect(String(new InexactNumber(5)))
            .toBe("5.0");
        expect(String(new SmallExactNumber(5)))
            .toBe("5");
        expect(String(new SmallExactNumber(5, 2)))
            .toBe("5/2");
        expect(String(fromString(`5+3i`)))
            .toBe("5+3i");
        expect(String(fromString(`5/2+3/2i`)))
            .toBe("5/2+3/2i");
        expect(String(fromString("5.0+3.0i")))
            .toBe("5.0+3.0i");
    });
    test('concatenation', () => {
        expect("Hello" + new InexactNumber(5))
            .toBe("Hello5");
    });
    test('template string', () => {
        expect(`${new InexactNumber(5) as unknown as number}`)
            .toBe("5.0");
    });
});

describe('addition', () => {
    test('inexact', () => {
        expect(5 + (new InexactNumber(5) as unknown as number))
            .toBe(10);
        expect(5 + (new InexactNumber(5.5) as unknown as number))
            .toBe(10.5);
    });
    test('exact', () => {
        expect(5 + (new SmallExactNumber(5) as unknown as number))
            .toBe(10);
        expect(5 + (new SmallExactNumber(11, 2) as unknown as number))
            .toBe(10.5);
    });
    test('complex', () => {
        expect(5 + (fromString("5.0+2.0i") as unknown as number))
            .toBe(NaN);
    });
});

describe('subtraction', () => {
    test('inexact', () => {
        expect(5 - (new InexactNumber(5) as unknown as number))
            .toBe(0);
        expect(5 - (new InexactNumber(5.5) as unknown as number))
            .toBe(-0.5);
    });
    test('exact', () => {
        expect(5 - (new SmallExactNumber(5) as unknown as number))
            .toBe(0);
        expect(5 - (new SmallExactNumber(11, 2) as unknown as number))
            .toBe(-0.5);
    });
    test('complex', () => {
        expect(5 - (fromString("5.0+3.0i") as unknown as number))
            .toBe(NaN);
    });
});

describe('multiplication', () => {
    test('inexact', () => {
        expect(5 * (new InexactNumber(5) as unknown as number))
            .toBe(25);
        expect(5 * (new InexactNumber(5.5) as unknown as number))
            .toBe(27.5);
    });
    test('exact', () => {
        expect(5 * (new SmallExactNumber(5) as unknown as number))
            .toBe(25);
        expect(5 * (new SmallExactNumber(11, 2) as unknown as number))
            .toBe(27.5);
    });
    test('complex', () => {
        expect(5 * (fromString("5.0+3.0i") as unknown as number))
            .toBe(NaN);
    });
});

describe('division', () => {
    test('inexact', () => {
        expect(5 / (new InexactNumber(5) as unknown as number))
            .toBe(1);
        expect(5 / (new InexactNumber(5.5) as unknown as number))
            .toBe(0.9090909090909091);
    });
    test('exact', () => {
        expect(5 / (new SmallExactNumber(5) as unknown as number))
            .toBe(1);
        expect(5 / (new SmallExactNumber(11, 2) as unknown as number))
            .toBe(0.9090909090909091);
    });
    test('complex', () => {
        expect(5 / (fromString("5.0+3.0i") as unknown as number))
            .toBe(NaN);
    });
});

describe('comparison', () => {
    test('inexact', () => {
        expect(5 > (new InexactNumber(5) as unknown as number))
            .toBe(false);
        expect(5 >= (new InexactNumber(5) as unknown as number))
            .toBe(true);
        expect(5 <= (new InexactNumber(5.5) as unknown as number))
            .toBe(true);
    });
    test('exact', () => {
        expect(5 > (new SmallExactNumber(5) as unknown as number))
            .toBe(false);
        expect(5 >= (new SmallExactNumber(5) as unknown as number))
            .toBe(true);
        expect(5 <= (new SmallExactNumber(11, 2) as unknown as number))
            .toBe(true);
    });
    test('complex', () => {
        expect(5 < (fromString("5.0+3.0i") as unknown as number))
            .toBe(false);
    });
});
