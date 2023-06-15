// In order to have a separate file for constants, they
// have to be defined in the Value.ts and BoxedNumber.ts
// files. Otherwise we get a circular import that causes an
// error.

export {
    ZERO_VAL,
    ONE_VAL,
    TWO_VAL,
    NEG_ONE_VAL,
    PI_VAL,
    INF_VAL,
    NEG_INF_VAL,
    NAN_VAL
} from './Value';
export {
    ZERO,
    ONE,
    HALF,
    TWO,
    NEG_ONE,
    I,
    NEG_I,
    EXACT_ZERO,
    EXACT_HALF,
    EXACT_ONE,
    EXACT_TWO,
    EXACT_NEG_ONE,
    EXACT_I,
    EXACT_NEG_I,
    INEXACT_ZERO,
    INEXACT_HALF,
    INEXACT_ONE,
    INEXACT_TWO,
    INEXACT_NEG_ONE,
    INEXACT_I,
    INEXACT_NEG_I,
    PI,
    INF,
    NEG_INF,
    NAN
} from './BoxedNumber';
