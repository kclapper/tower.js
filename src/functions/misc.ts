import {
    RacketNumber,
    isBoxedNumber,
} from '../numbers/index';
import {
    boxNumber
} from './index';
import {
    normalize
} from './util';

export function inexactToExact(n: RacketNumber): RacketNumber {
    if (typeof n === 'bigint') {
        return n;
    }
    if (isBoxedNumber(n)) {
        return n.toExact();
    }
    return normalize(boxNumber(n).toExact());
}
export const toExact = inexactToExact; // For backwards compatibility

export function exactToInexact(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.toInexact());
    }
    return Number(n);
}
export const toInexact = exactToInexact; // For backwards compatibility

export function numberToString(n: RacketNumber): string {
    if (typeof n === 'number') {
        if (Number.isInteger(n)) {
            return n.toString() + ".0";
        }
        if (Number.isNaN(n)) {
            return "+nan.0";
        }
        if (n === Infinity) {
            return "+inf.0";
        }
        if (n === -Infinity) {
            return "-inf.0";
        }
    }
    return n.toString();
}
