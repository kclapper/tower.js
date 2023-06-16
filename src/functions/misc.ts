import {
    BoxedNumber,
    RacketNumber
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

export function exactToInexact(n: RacketNumber): RacketNumber {
    if (n instanceof BoxedNumber) {
        return n.toInexact();
    }
    return BoxedNumber.makeInstance({num: n});
}
