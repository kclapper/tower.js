import {describe, expect, test} from '@jest/globals';
import {
    add
} from '../src/tower';
import {
    BoxedNumber
} from '../src/numbers/BoxedNumber';

test('+ operator', () => {
    expect(add(1, 2)).toBe(3);
})
