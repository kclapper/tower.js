import {
    InexactNumber,
    SmallExactNumber,
    BigExactNumber
} from './Value';
import { BoxedNumber } from './BoxedNumber';


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
export const ZERO = new BoxedNumber(ZERO_VAL);
export const ONE = new BoxedNumber(ONE_VAL);
export const TWO = new BoxedNumber(TWO_VAL);

export const HALF = ONE.divide(TWO);

export const NEG_ONE = new BoxedNumber(NEG_ONE_VAL);

export const I = new BoxedNumber(ZERO_VAL, ONE_VAL);
export const NEG_I = new BoxedNumber(ZERO_VAL, NEG_ONE_VAL);

export const PI = new BoxedNumber(PI_VAL);

export const INF = new BoxedNumber(INF_VAL);
export const NEG_INF = new BoxedNumber(NEG_INF_VAL);
export const NAN = new BoxedNumber(NAN_VAL);
