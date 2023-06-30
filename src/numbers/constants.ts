import {
    InexactNumber,
    SmallExactNumber,
    ComplexNumber
} from './index';

/////////////////////// Exact ///////////////////////
export const EXACT_ZERO = new SmallExactNumber(0, 1);
export const EXACT_HALF = new SmallExactNumber(1, 2);
export const EXACT_ONE = new SmallExactNumber(1, 1);
export const EXACT_TWO = new SmallExactNumber(2, 1);
export const EXACT_NEG_ONE = new SmallExactNumber(-1, 1);

export const ZERO = EXACT_ZERO;
export const ONE = EXACT_ONE;
export const HALF = EXACT_HALF;
export const TWO = EXACT_TWO;
export const NEG_ONE = EXACT_NEG_ONE;

/////////////////////// Inexact ///////////////////////
export const INEXACT_ZERO = new InexactNumber(0);
export const INEXACT_NEG_ZERO = new InexactNumber(-0);
export const INEXACT_HALF = new InexactNumber(0.5);
export const INEXACT_ONE = new InexactNumber(1);
export const INEXACT_TWO = new InexactNumber(2);
export const INEXACT_NEG_ONE = new InexactNumber(-1);

export const PI = new InexactNumber(Math.PI);

export const INF = new InexactNumber(Infinity);
export const NEG_INF = new InexactNumber(-Infinity);

export const NAN = new InexactNumber(NaN);

/////////////////////// Complex ///////////////////////
export const EXACT_I = new ComplexNumber(ZERO, ONE);
export const EXACT_NEG_I = new ComplexNumber(ZERO, NEG_ONE);

export const INEXACT_I = new ComplexNumber(INEXACT_ZERO, INEXACT_ONE);
export const INEXACT_NEG_I = new ComplexNumber(INEXACT_ZERO, INEXACT_NEG_ONE);

export const I = EXACT_I
export const NEG_I = EXACT_NEG_I;


//////// Backwards Compatibility with js-numbers //////
export const zero = EXACT_ZERO;
export const one = EXACT_ONE;
export const two = EXACT_TWO;
export const negative_one = EXACT_NEG_ONE;

export const pi = PI;
export const e = new InexactNumber(Math.E);
export const nan = NAN;
export const negative_inf = NEG_INF;
export const inf = INF;
export const negative_zero = INEXACT_NEG_ZERO;

export const i = EXACT_I
export const negative_i = EXACT_NEG_I;
