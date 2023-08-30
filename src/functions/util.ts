import {
    RacketNumber,
    InexactNumber,
    ComplexNumber,
    SmallExactNumber,
    BigExactNumber
} from '../numbers/index';
import {
    boxNumber
} from './index';

type Normalizable = (...n: RacketNumber[]) => RacketNumber;
type Normalized<F extends Normalizable> = (...n: Parameters<F>) => RacketNumber;
export function normalized<Func extends Normalizable>(fn: Func): Normalized<Func> {
    return function(...nums: RacketNumber[]): RacketNumber {
        for (let i = 0; i < nums.length; i++) {
            nums[i] = normalize(nums[i]);
        }

        const result = fn(...nums);

        return normalize(result);
    }
}

export function normalize(x: RacketNumber): RacketNumber {
    if (typeof x === 'number' || typeof x === 'bigint') {
        return x;
    }
    if (x instanceof InexactNumber) {
        return x.num;
    }
    if (x instanceof SmallExactNumber && x.den === 1) {
        return BigInt(x.num);
    }
    if (x instanceof BigExactNumber && x.den === 1n) {
        return x.num;
    }
    if (x instanceof ComplexNumber && x.isReal()) {
        return normalize(x.realPart());
    }
    return x;
}

export function makeCompatible(x: RacketNumber, y: RacketNumber): [RacketNumber, RacketNumber] {
    if (typeof x === typeof y) {
        return [x, y];
    }
    if (typeof x === 'object' && typeof y !== 'object') {
        return [x, boxNumber(y)];
    }
    if (typeof x !== 'object' && typeof y === 'object') {
        return [boxNumber(x), y];
    }
    return [Number(x), Number(y)];
}

export * from '../util';
