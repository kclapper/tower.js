import {
    JSInteger,
    JSNumber,
    Level,
} from './types';
import {
    InexactValue,
    SmallExactValue,
    BigExactValue,
    Value,
    ZERO_VAL,
    TWO_VAL,
    NEG_ONE_VAL,
} from './Value';
import {
    isJSInteger,
    matchExactness
} from './util';

export class BoxedNumber {
    public readonly level: Level;

    public readonly real: Value;
    public readonly imag: Value;

    constructor(real: Value, imag?: Value) {
        this.real = real;

        if (imag === undefined) {
            this.imag = ZERO_VAL;
        } else {
            this.imag = imag;
        }

        let level;
        if (this.isInteger()) {
            level = Level.INTEGER;
        } else if (this.isRational()) {
            level = Level.RATIONAL;
        } else if (this.isReal()) {
            level = Level.REAL;
        } else {
            level = Level.COMPLEX;
        }
        this.level = level;

        // Make it immutable
        Object.freeze(this);
    }

    public static makeInstance({num}: {num: number}): BoxedNumber;

    public static makeInstance({num, imagNum}: {num: bigint, imagNum: bigint}): BoxedNumber;
    public static makeInstance({num, den}: {num: bigint, den: bigint}): BoxedNumber;
    public static makeInstance({num, den, imagNum, imagDen}:
                               {num: bigint, den: bigint, imagNum: bigint, imagDen: bigint}): BoxedNumber;

    public static makeInstance({num, imagNum}: {num: number, imagNum: number}): BoxedNumber;
    public static makeInstance({num, den}: {num: number, den: number}): BoxedNumber;
    public static makeInstance({num, den, imagNum,  imagDen}:
                               {num: number, den: number, imagNum: number, imagDen: number}): BoxedNumber;

    public static makeInstance({num, den, imagNum, imagDen}:
                               {num: JSNumber, den?: JSInteger, imagNum?: JSNumber, imagDen?: JSInteger}): BoxedNumber {
        const isReal = imagNum === undefined;
        if (isReal && imagDen !== undefined) {
           throw new Error("Must specify both a numerator and denominator.");
        }

        const denominatorsExist = den !== undefined && imagDen !== undefined;
        if (!isReal && !denominatorsExist && (den !== undefined || imagDen !== undefined)) {
            throw new Error("Real and imaginary part must be the same exactness.")
        }

        let isExact;
        if (isReal) {
            isExact = den !== undefined
                && isJSInteger(num)
                && isJSInteger(den);
        } else {
            isExact = den !== undefined
                && isJSInteger(num)
                && isJSInteger(den)
                && imagDen != undefined
                && isJSInteger(imagNum)
                && isJSInteger(imagDen);
        }

        if (!isExact && typeof num === 'bigint') {
            throw new TypeError("bigints can only be used with exact numbers");
        }

        let typesAreSame;
        if (isReal && isExact) {
            typesAreSame = typeof num === typeof den;
        } else if (isReal && !isExact) {
            typesAreSame = true;
        } else if (!isReal && isExact) {
            typesAreSame = typeof num === typeof imagNum
                && typeof den === typeof imagDen
                && typeof num === typeof den;
        } else {
            typesAreSame = typeof num === typeof imagNum;
        }
        if (!typesAreSame) {
            throw new TypeError("All makeInstance arguments must be the same type.")
        }

        const isBig = typeof num === 'bigint';

        let realVal, imagVal;
        if (isReal && isExact && isBig) {
            realVal = new BigExactValue(num as bigint, den as bigint);
            imagVal = ZERO_VAL;
        } else if (isReal && isExact && !isBig) {
            realVal = new SmallExactValue(num as number, den as number);
            imagVal = ZERO_VAL;
        } else if (isReal && !isExact) {
            realVal = new InexactValue(num as number);
            imagVal = ZERO_VAL;
        } else if (!isReal && isExact && isBig) {
            realVal = new BigExactValue(num as bigint, den as bigint);
            imagVal = new BigExactValue(imagNum as bigint, imagDen as bigint);
        } else if (!isReal && isExact && !isBig) {
            realVal = new SmallExactValue(num as number, den as number);
            imagVal = new SmallExactValue(imagNum as number, imagDen as number);
        } else if (!isReal && !isExact && !isBig) {
            realVal = new InexactValue(num as number);
            imagVal = new InexactValue(imagNum as number);
        } else {
            // Should never get here
            throw new Error(`Error creating BoxedNumber`);
        }

        return new BoxedNumber(realVal, imagVal);
    }

    public toString(): string {
        if (this.isReal()) {
            return this.real.toString();
        } else {
            return this.real.toString() + this.imag.toSignedString() + "i";
        }
    }
    public [Symbol.toPrimitive](hint: string): number | bigint | string {
        if (hint === 'string') {
            return this.toString();
        }

        if (!this.isReal()) {
            return Number.NaN;
        }

        const primitive = this.real[Symbol.toPrimitive](hint);

        if (hint === 'number' && typeof primitive === 'bigint') {
            return Number(primitive);
        } else if (hint === 'default' && typeof primitive === 'bigint') {
            return Number(primitive);
        } else if (hint === 'bigint' && typeof primitive === 'number') {
            return BigInt(primitive);
        }

        return primitive;
    }

    public isInteger(): boolean {
        return this.isRational() && this.real.isInteger();
    }
    public isRational(): boolean {
        return this.isReal() && this.isFinite();
    }
    public isFinite(): boolean {
        return this.real.isFinite() && this.imag.isFinite();
    }
    public isReal(): boolean {
        return this.imag.isZero() && this.imag.isExact();
    }
    public isComplex(): boolean {
        return true;
    }
    public isExact(): boolean {
        return this.real.isExact() && this.imag.isExact();
    }
    public isInexact(): boolean {
        return !this.isExact();
    }
    public isZero(): boolean {
        return this.real.isZero() && this.imag.isZero();
    }
    public isNegativeZero(): boolean {
        return this.isReal() && this.real.isNegativeZero();
    }
    public isPositive(): boolean {
        if (!this.isReal()) {
            throw new TypeError("Not defined for complex numbers.");
        }
        return this.real.isPositive();
    }
    public isNegative(): boolean {
        if (!this.isReal()) {
            throw new TypeError("Not defined for complex numbers.");
        }
        return this.real.isNegative();
    }
    public isEven(): boolean {
        if (!this.isInteger()) {
            throw new TypeError("Only defined for Integers.")
        }
        return this.real.isEven();
    }
    public isNaN(): boolean {
        return this.real.isNaN() || this.imag.isNaN();
    }

    public toInexact(): BoxedNumber {
        if (this.isInexact()) {
            return this;
        }
        if (this.isReal()) {
            return new BoxedNumber(this.real.toInexact());
        }
        return new BoxedNumber(this.real.toInexact(), this.imag.toInexact());
    }
    public toExact(): BoxedNumber {
        return new BoxedNumber(this.real.toExact(), this.imag.toExact());
    }
    public toFixnum(): JSInteger {
        if (!this.isReal()) {
            throw new TypeError("Not defined for complex numbers.");
        }
        return this.real.toFixnum();
    }

    public greaterThan(other: BoxedNumber): boolean {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Greater than not defined for complex numbers.");
        }
        return this.real.greaterThan(other.real);
    }
    public greaterThanOrEqual(other: BoxedNumber): boolean {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Greater than or equal not defined for complex numbers.");
        }
        return this.real.greaterThanOrEqual(other.real);
    }
    public lessThan(other: BoxedNumber): boolean {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Less than not defined for complex numbers.");
        }
        return this.real.lessThan(other.real);
    }
    public lessThanOrEqual(other: BoxedNumber): boolean {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Less than or equal not defined for complex numbers.");
        }
        return this.real.lessThanOrEqual(other.real);
    }
    public equals(other: BoxedNumber): boolean {
        return this.real.equals(other.real) && this.imag.equals(other.imag);
    }

    public add(other: BoxedNumber): BoxedNumber {
        if (this.isReal() && other.isReal()) {
            return new BoxedNumber(this.real.add(other.real));
        }

        let real = this.real.add(other.real);
        let imag = this.imag.add(other.imag);

        [real, imag] = matchExactness(real, imag);

        return new BoxedNumber(real, imag);
    }
    public subtract(other: BoxedNumber): BoxedNumber {
        if (this.isReal() && other.isReal()) {
            return new BoxedNumber(this.real.subtract(other.real));
        }

        let real = this.real.subtract(other.real);
        let imag = this.imag.subtract(other.imag);

        [real, imag] = matchExactness(real, imag);

        return new BoxedNumber(real, imag);
    }
    public multiply(other: BoxedNumber): BoxedNumber {
        let real = this.real.multiply(other.real).subtract(this.imag.multiply(other.imag));
        const imag = this.real.multiply(other.imag).add(this.imag.multiply(other.real));

        real = !imag.isExact() ? real.toInexact() : real;

        return new BoxedNumber(real, imag);
    }
    public divide(other: BoxedNumber): BoxedNumber {
        // If the other value is real, just do primitive division
        if (other.isReal()) {
            const real = this.real.divide(other.real);
            const imag = this.imag.divide(other.real);
            return new BoxedNumber(real, imag);
        }

        let a, b, c, d, r, x, y;
        if (this.isInexact() || other.isInexact()) {
            // http://portal.acm.org/citation.cfm?id=1039814
            // We currently use Smith's method, though we should
            // probably switch over to Priest's method.
            a = this.real;
            b = this.imag;
            c = other.real;
            d = other.imag;
            if (d.abs().lessThanOrEqual(c.abs())) {
                r = d.divide(c);
                x = a.add(b.multiply(r)).divide(c.add(d.multiply(r)));
                y = b.subtract(a.multiply(r)).divide(c.add(d.multiply(r)));
            } else {
                r = c.divide(d);
                x = a.multiply(r).add(b).divide(c.multiply(r).add(d));
                y = b.multiply(r).subtract(a).divide(c.multiply(r).add(d));
            }
            return new BoxedNumber(x, y);
        } else {
            const con = other.conjugate();
            const up = this.multiply(con);

            // Down is guaranteed to be real by this point.
            const down = other.multiply(con).realPart();

            const real = up.realPart().divide(down).real;
            const imag = up.imaginaryPart().divide(down).real;
            return new BoxedNumber(real, imag);
        }
    }

    public numerator(): BoxedNumber {
        if (!this.isReal()) {
            throw new Error("Numerator not defined for complex numbers.");
        }
        return new BoxedNumber(this.real.numerator());
    }
    public denominator(): BoxedNumber {
        if (!this.isReal()) {
            throw new Error("Denominator not defined for complex numbers.");
        }
        return new BoxedNumber(this.real.denominator());
    }

    public integerSqrt(): BoxedNumber {
        if (this.isInteger()) {
            return new BoxedNumber(this.real.integerSqrt());
        } else {
            throw new Error("IntegerSqrt only defined for integers.");
        }
    }
    public sqrt(): BoxedNumber {
        if (this.isReal()) {
            if (this.isNegative()) {
                const imag = this.real.multiply(NEG_ONE_VAL).sqrt();
                const real = this.isExact() ? ZERO_VAL : new InexactValue(0);
                return new BoxedNumber(real, imag);
            } else {
                return new BoxedNumber(this.real.sqrt());
            }
        }

        // http://en.wikipedia.org/wiki/Square_root#Square_roots_of_negative_and_complex_numbers
        const mag = this.magnitude().real;
        const r_plus_x = mag.add(this.real);

        const real = r_plus_x.divide(new SmallExactValue(2)).sqrt();
        const imag = this.imag.divide(r_plus_x.multiply(TWO_VAL).sqrt());

        return new BoxedNumber(real, imag);
    }
    public abs(): BoxedNumber {
        if (!this.isReal()) {
            throw new Error("abs is not defined for complex numbers.");
        }
        return new BoxedNumber(this.real.abs());
    }
    public floor(): BoxedNumber {
        if (!this.isReal()) {
            throw new Error("floor is not defined for complex numbers.");
        }
        return new BoxedNumber(this.real.floor());
    }
    public ceiling(): BoxedNumber {
        if (!this.isReal()) {
            throw new Error("ceiling is not defined for complex numbers.");
        }
        return new BoxedNumber(this.real.ceiling());
    }
    public round(): BoxedNumber {
        if (!this.isReal()) {
            throw new Error("round is not defined for complex numbers.");
        }
        return new BoxedNumber(this.real.round());
    }

    public conjugate(): BoxedNumber {
        return new BoxedNumber(this.real, new SmallExactValue(0).subtract(this.imag));
    }
    public magnitude(): BoxedNumber {
        const realSqr = this.real.multiply(this.real);
        const imagSqr = this.imag.multiply(this.imag);
        const sum = realSqr.add(imagSqr);
        return new BoxedNumber(sum.sqrt());
    }
    public realPart(): BoxedNumber {
        return new BoxedNumber(this.real);
    }
    public imaginaryPart(): BoxedNumber {
        return new BoxedNumber(this.imag);
    }

    public log(): BoxedNumber {
        if (this.isReal() && this.isPositive()) {
            return new BoxedNumber(this.real.log());
        }

        const mag = this.magnitude().real;
        const mag_log = new BoxedNumber(mag.log());

        const theta = this.angle();

        return mag_log.add(theta.multiply(I));
    }
    public expt(power: BoxedNumber): BoxedNumber {
        if (power.isExact() && power.isInteger() && power.greaterThanOrEqual(ZERO)) {
            // HACK: k can be a bigint or a number so we need some gross casting.
            let n: BoxedNumber = this;
            let k: number = power.toFixnum() as number;

            const isNumber = typeof k === 'number';
            const zero = (isNumber ? 0 : 0n) as number;
            const one = (isNumber ? 1 : 1n) as number;
            const two = (isNumber ? 2 : 2n) as number;

            let acc: BoxedNumber = ONE;

            while (k !== zero) {
                if (k % two === zero) {
                    n = n.multiply(n);
                    k = k / two;
                } else {
                    acc = acc.multiply(n);
                    k = k - one;
                }
            }
            return acc;
        }

        const expo = power.multiply(this.log());
        return expo.exp();
    }
    public exp(): BoxedNumber {
        if (this.isReal()) {
            return new BoxedNumber(this.real.exp());
        }

        const r = new BoxedNumber(this.real.exp());
        const cos_a = new BoxedNumber(this.imag.cos());
        const sin_a = new BoxedNumber(this.imag.sin());

        return r.multiply(cos_a.add(sin_a.multiply(I)));
    }

    public angle(): BoxedNumber {
        if (this.isReal()) {
            return new BoxedNumber(this.real.angle());
        }
        if (this.real.isZero()) {
            const halfPI = PI.divide(TWO);
            if (this.imag.isPositive()) {
                return halfPI;
            } else {
                return halfPI.multiply(NEG_ONE);
            }
        }

        const tmp = this.imaginaryPart().abs().divide(this.realPart().abs()).atan();
        if (this.real.isPositive()) {
            if (this.imag.isPositive()) {
                return tmp;
            } else {
                return tmp.multiply(NEG_ONE);
            }
        } else {
            if (this.imag.isPositive()) {
                return PI.subtract(tmp);
            } else {
                return tmp.subtract(PI);
            }
        }
    }
    public tan(): BoxedNumber {
        if (this.isReal()) {
            return new BoxedNumber(this.real.tan());
        }
        return this.sin().divide(this.cos());
    }
    public cos(): BoxedNumber {
        if (this.isReal()) {
            return new BoxedNumber(this.real.cos());
        }
        const iz = this.multiply(I);
        const iz_negate = iz.multiply(NEG_ONE);
        return iz.exp().add(iz_negate.exp()).divide(TWO);
    }
    public sin(): BoxedNumber {
        if (this.isReal()) {
            return new BoxedNumber(this.real.sin());
        }
        const iz = this.multiply(I);
        const iz_negate = iz.multiply(NEG_ONE);
        const z2 = new BoxedNumber(ZERO_VAL, TWO_VAL);
        const exp_negate = iz.exp().subtract(iz_negate.exp());
        const result = exp_negate.divide(z2);
        return result;
    }
    public atan(): BoxedNumber {
        if (this.isZero()) {
            return ZERO;
        }
        if (this.isReal()) {
            return new BoxedNumber(this.real.atan());
        }
        if (this.equals(I) || this.equals(NEG_I)) {
            return NEG_INF;
        }

        let result;
        result = ZERO.subtract(this);
        result = I.add(result);
        result = I.add(this).divide(result);
        result = result.log();
        result = HALF.multiply(result);
        result = I.multiply(result);

        return result;
    }
    public acos(): BoxedNumber {
        if (this.isReal() && this.greaterThanOrEqual(NEG_ONE) && this.lessThanOrEqual(ONE)) {
            return new BoxedNumber(this.real.acos());
        }
        const pi_half = PI.divide(TWO);
        const iz = this.multiply(I);
        const root = ONE.subtract(this.multiply(this)).sqrt();
        const l = iz.add(root).log().multiply(I);
        return pi_half.add(l);
    }
    public asin(): BoxedNumber {
        if (this.isReal() && this.greaterThanOrEqual(NEG_ONE) && this.lessThanOrEqual(ONE)) {
            return new BoxedNumber(this.real.asin());
        }
        const oneNegateThisSq = ONE.subtract(this.multiply(this));
        const sqrtOneNegateThisSq = oneNegateThisSq.sqrt();
        return TWO.multiply(this.divide(ONE.add(sqrtOneNegateThisSq)).atan());
    }
}

/////////////////////// Constants ///////////////////////

export const EXACT_ZERO = BoxedNumber.makeInstance({num: 0, den: 1});
export const EXACT_HALF = BoxedNumber.makeInstance({num: 1, den: 2});
export const EXACT_ONE = BoxedNumber.makeInstance({num: 1, den: 1});
export const EXACT_TWO = BoxedNumber.makeInstance({num: 2, den: 1});
export const EXACT_NEG_ONE = BoxedNumber.makeInstance({num: -1, den: 1});
export const EXACT_I = BoxedNumber.makeInstance({num: 0, den: 1, imagNum: 1, imagDen: 1});
export const EXACT_NEG_I = BoxedNumber.makeInstance({num: 0, den: 1, imagNum: -1, imagDen: 1});

export const INEXACT_ZERO = BoxedNumber.makeInstance({num: 0});
export const INEXACT_NEG_ZERO = BoxedNumber.makeInstance({num: -0});
export const INEXACT_HALF = BoxedNumber.makeInstance({num: 0.5});
export const INEXACT_ONE = BoxedNumber.makeInstance({num: 1});
export const INEXACT_TWO = BoxedNumber.makeInstance({num: 2});
export const INEXACT_NEG_ONE = BoxedNumber.makeInstance({num: -1});
export const INEXACT_I = BoxedNumber.makeInstance({num: 0, imagNum: 1});
export const INEXACT_NEG_I = BoxedNumber.makeInstance({num: 0, imagNum: -1});

export const ZERO = EXACT_ZERO;
export const ONE = EXACT_ONE;
export const HALF = EXACT_HALF;
export const TWO = EXACT_TWO;
export const NEG_ONE = EXACT_NEG_ONE;
export const I = EXACT_I
export const NEG_I = EXACT_NEG_I;

export const PI = BoxedNumber.makeInstance({num: Math.PI});

export const INF = BoxedNumber.makeInstance({num: Number.POSITIVE_INFINITY});
export const NEG_INF = BoxedNumber.makeInstance({num: Number.NEGATIVE_INFINITY});

export const NAN = BoxedNumber.makeInstance({num: Number.NaN});

// For backwards compatibility with js-numbers
export const zero = EXACT_ZERO;
export const one = EXACT_ONE;
export const two = EXACT_TWO;
export const negative_one = EXACT_NEG_ONE;
export const i = EXACT_I
export const negative_i = EXACT_NEG_I;
export const pi = PI;
export const e = BoxedNumber.makeInstance({num: Math.E});
export const nan = NAN;
export const negative_inf = NEG_INF;
export const inf = INF;
export const negative_zero = INEXACT_NEG_ZERO;
