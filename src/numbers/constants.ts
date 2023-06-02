import {
    InexactNumber,
    SmallExactNumber,
    BigExactNumber
} from './Value';
import { Integer } from './Integer';
import { Rational } from './Rational';
import { Real } from './Real';
import { Complex } from './Complex';


/////////////////////// Values ///////////////////////
export const ZERO_VAL = new SmallExactNumber(0);
export const ONE_VAL = new SmallExactNumber(1);
export const TWO_VAL = new SmallExactNumber(2);

export const NEG_ONE_VAL = new SmallExactNumber(-1);

export const PI_VAL = new InexactNumber(Math.PI);

export const INF_VAL = new InexactNumber(Number.POSITIVE_INFINITY);
export const NEG_INF_VAL = new InexactNumber(Number.NEGATIVE_INFINITY);
export const NAN_VAL = new InexactNumber(Number.NaN);



/////////////////////// Numbers ///////////////////////
export const ZERO = new Integer(ZERO_VAL);
export const ONE = new Integer(ONE_VAL);
export const TWO = new Integer(TWO_VAL);

export const HALF = ONE.divide(TWO);

export const NEG_ONE = new Integer(NEG_ONE_VAL);

export const I = new Complex(ZERO_VAL, ONE_VAL);
export const NEG_I = new Complex(ZERO_VAL, NEG_ONE_VAL);

export const PI = new Rational(PI_VAL);

export const INF = new Real(INF_VAL);
export const NEG_INF = new Real(NEG_INF_VAL);
export const NAN = new Real(NAN_VAL);
