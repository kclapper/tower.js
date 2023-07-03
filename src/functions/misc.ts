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
    return n.toString();
}
