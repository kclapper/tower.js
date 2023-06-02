import {
    JSInteger
} from './main';

// TODO: Make it so it automatically escalates to bigint.
export function fastExpt(n: JSInteger, k: JSInteger): JSInteger {
    let zero, one, two;
    if (typeof n === 'number' && typeof k === 'number') {
        zero = 0;
        one = 1;
        two = 2;
    } else if (typeof n === 'bigint' && typeof k === 'bigint') {
        zero = 0n;
        one = 1n;
        two = 2n;
    } else {
        throw new TypeError("n and k types must match.");
    }

    let acc = one;
    while (true) {
        if (k === zero) {
            return acc;
        }

        // HACK: need to cast to number even though ops are defined for both
        // number and bigint.
        if ((k as number) % (two as number) === zero) {
            n = (n as number) * (n as number);
            k = (k as number) / (two as number);
        } else {
            acc = (acc as number) * (n as number);
            k = (k as number) - (one as number);
        }
    }
}
