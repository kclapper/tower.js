import {
    RacketNumber,
    InexactNumber,
} from '../tower';

type Normalizable = (...n: RacketNumber[]) => RacketNumber;
type Normalized<F extends Normalizable> = (...n: Parameters<F>) => RacketNumber;
export function normalized<Func extends Normalizable>(fn: Func): Normalized<Func> {
    return function(...nums: RacketNumber[]): RacketNumber {
        for (let i = 0; i < nums.length; i++) {
            const n = nums[i];
            if (n instanceof InexactNumber) {
                nums[i] = n.num;
            }
        }

        const result = fn(...nums);

        if (result instanceof InexactNumber) {
            return result.num;
        }
        return result;
    }
}

export function normalize(x: RacketNumber): RacketNumber {
    if (x instanceof InexactNumber) {
        return x.num;
    }
    return x;
}

export function makeCompatible(x: RacketNumber, y: RacketNumber): [RacketNumber, RacketNumber] {
    if (typeof x === 'number' && typeof y === 'object') {
        x = new InexactNumber(x);
    }
    if (typeof y === 'number' && typeof x === 'object') {
        y = new InexactNumber(y);
    }
    return [x, y];
}

export * from '../util';
