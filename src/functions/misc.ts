import {
    RacketNumber,
    isBoxedNumber,
    InexactNumber
} from '../tower';
import {
    normalize
} from './util';

export function inexactToExact(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return normalize(n.toExact());
    }
    return n;
}
export const toExact = inexactToExact; // For backwards compatibility

export function exactToInexact(n: RacketNumber): RacketNumber {
    if (isBoxedNumber(n)) {
        return n.toInexact();
    }
    return new InexactNumber(Number(n));
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
