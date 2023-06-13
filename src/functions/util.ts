import {
    BoxedNumber
} from '../numbers/BoxedNumber';
import {
    RacketNumber,
    JSInteger
} from '../numbers/main';
import {
    isSafeInteger
} from '../util';

type NumberBinop = (x: number, y: number) => RacketNumber;
type BigIntBinop = (x: bigint, y: bigint) => RacketNumber;
type BoxedNumberBinop = (x: BoxedNumber, y: BoxedNumber) => RacketNumber;

/*
 * Makes a function that operates on RacketNumbers. The function takes
 * at least two arguments and folds the given binary operations from left to right.
 */
export function makeMultiArity(fnForNumbers: NumberBinop,
                        fnForBigInts: BigIntBinop,
                        fnForBoxedNumbers: BoxedNumberBinop) {
    return function recur(...args: RacketNumber[]): RacketNumber {
        if (args.length < 2) {
            throw new Error("Must be called with at least two arguments.")
        }

        let x = args[0];
        let y = args[1];

        [x, y] = matchTypes(x, y);

        let result;
        if (typeof x === 'number') {
            result = fnForNumbers(x, y as number);
            if (!Number.isSafeInteger(result)) {
                result = fnForBigInts(BigInt(x), BigInt(y as number));
            }
        } else if (typeof x === 'bigint') {
            result = fnForBigInts(x, y as bigint);
        } else {
            result = fnForBoxedNumbers(x, y as BoxedNumber);
        }

        if (args.length === 2) {
            return normalize(result);
        } else {
            return recur(result, ...args.slice(2));
        }
    }
}

export function normalize(x: RacketNumber): RacketNumber {
    // Don't keep BoxedNumbers if unnecessary
    if (x instanceof BoxedNumber
        && x.isReal()
        && x.isInteger()
        && x.isExact()) {

        x = x.toFixnum();
    }

    // Don't keep bigints if unnecessary
    if (typeof x === 'bigint' && isSafeInteger(x)) {
        x = Number(x);
    }

    return x;
}

export function matchTypes(x: RacketNumber, y: RacketNumber): RacketNumber[] {
    // Check if they're already the same
    if (typeof x === typeof y) {
        return [x, y];
    }

    // Make types match
    if (x instanceof BoxedNumber) {
        if (typeof y === 'bigint') {
            return [x, BoxedNumber.makeInstance({num: y, den: 1n})]
        } else {
            return [x, BoxedNumber.makeInstance({num: y as number, den: 1})];
        }

    } else if (typeof x === 'bigint') {
        if (y instanceof BoxedNumber) {
           return [BoxedNumber.makeInstance({num: x, den: 1n}), y];
        } else {
            return [x, BigInt(y)];
        }

    } else if (typeof x === 'number') {
        if (y instanceof BoxedNumber) {
            return [BoxedNumber.makeInstance({num: x, den: 1}), y];
        } else {
            return [BigInt(x), y];
        }

    } else {
       throw new TypeError(`Cannot match values ${x} ${y}`);
    }
}

export * from '../util';
