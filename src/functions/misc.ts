import {
    RacketNumber,
    BoxedNumber,
} from '../tower';
import {
    normalize
} from './util';

export function inexactToExact(n: RacketNumber): RacketNumber {
    if (n instanceof BoxedNumber) {
        return normalize(n.toExact());
    }
    return n;
}
export const toExact = inexactToExact; // For backwards compatibility

export function exactToInexact(n: RacketNumber): RacketNumber {
    if (n instanceof BoxedNumber) {
        return n.toInexact();
    }
    return BoxedNumber.makeInstance({num: Number(n)});
}
export const toInexact = exactToInexact; // For backwards compatibility

export function numberToString(n: RacketNumber): string {
    if (n instanceof BoxedNumber || typeof n === 'number') {
        return n.toString();
    }

    return n.toString().slice(0, -1);
}
