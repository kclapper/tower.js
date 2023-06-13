import {
    isJSInteger,
    fastExpt
} from './util';
import {
    InexactNumber,
    SmallExactNumber,
    BigExactNumber,
    Value,
    ZERO_VAL,
    ONE_VAL,
    TWO_VAL,
    NEG_ONE_VAL,
    PI_VAL,
    INF_VAL,
    NEG_INF_VAL,
    NAN_VAL
} from './Value';
import {
    JSInteger,
    JSNumber,
    Level,
} from './main';

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

    public static makeInstance({num}: {num: JSNumber}): BoxedNumber;

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
        let isReal = imagNum === undefined;
        if (isReal && imagDen !== undefined) {
           throw new Error("Must specify both a numerator and denominator.");
        }
        if (imagNum === undefined && typeof num === 'number') {
            imagNum = 0;
        } else if (imagNum === undefined && typeof num === 'bigint') {
            imagNum = 0n;
        }

        let denominatorsExist = den !== undefined && imagDen !== undefined;
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

        let isBig = typeof num === 'bigint';

        let realVal, imagVal;
        if (isReal && isExact && isBig) {
            realVal = new BigExactNumber(num as bigint, den as bigint);
            imagVal = ZERO_VAL;
        } else if (isReal && isExact && !isBig) {
            realVal = new SmallExactNumber(num as number, den as number);
            imagVal = ZERO_VAL;
        } else if (isReal && !isExact) {
            realVal = new InexactNumber(num as number);
            imagVal = ZERO_VAL;
        } else if (!isReal && isExact && isBig) {
            realVal = new BigExactNumber(num as bigint, den as bigint);
            imagVal = new BigExactNumber(imagNum as bigint, imagDen as bigint);
        } else if (!isReal && isExact && !isBig) {
            realVal = new SmallExactNumber(num as number, den as number);
            imagVal = new SmallExactNumber(imagNum as number, imagDen as number);
        } else if (!isReal && !isExact && !isBig) {
            realVal = new InexactNumber(num as number);
            imagVal = new InexactNumber(imagNum as number);
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

    public liftTo(other: BoxedNumber): BoxedNumber {
        return this;
      // switch (other.level) {
            // case Level.INTEGER:
                // throw new TypeError("Cannot lift to lower level.")
            // case Level.RATIONAL:
                // throw new TypeError("Cannot lift to lower level.")
            // case Level.REAL:
                // throw new TypeError("Cannot lift to lower level.")
            // case Level.COMPLEX:
                // return this;
            // default:
                // let _exaustiveSearch: never = other.level;
                // return other;
        // }
    }
    // protected static matchLevel(first: BoxedNumber, second: BoxedNumber): BoxedNumber[] {
        // if (first.level === second.level) {
            // return [second, second];
        // } else if (first.level > second.level) {
//
        // }
    // }

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
    // public canBeFixnum(): boolean {
        // return this.isReal() && this.isInteger() && this.isExact();
    // }

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
        return new BoxedNumber(this.real.add(other.real), this.imag.add(other.imag));
    }
    public subtract(other: BoxedNumber): BoxedNumber {
        return new BoxedNumber(this.real.subtract(other.real), this.imag.subtract(other.imag));
    }
    public multiply(other: BoxedNumber): BoxedNumber {
        let real = this.real.multiply(other.real).subtract(this.imag.multiply(other.imag));
        let imag = this.real.multiply(other.imag).add(this.imag.multiply(other.real));
        return new BoxedNumber(real, imag);
    }
    public divide(other: BoxedNumber): BoxedNumber {
        // If the other value is real, just do primitive division
        if (other.isReal()) {
            let real = this.real.divide(other.real);
            let imag = this.imag.divide(other.real);
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
            var con = other.conjugate();
            var up = this.multiply(con);

            // Down is guaranteed to be real by this point.
            var down = other.multiply(con).realPart();

            let real = up.realPart().divide(down).real;
            let imag = up.imaginaryPart().divide(down).real;
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
            return new BoxedNumber(this.real.sqrt());
        }

        // http://en.wikipedia.org/wiki/Square_root#Square_roots_of_negative_and_complex_numbers
        let mag = this.magnitude().real;
        let r_plus_x = mag.add(this.real);

        let real = r_plus_x.divide(new SmallExactNumber(2)).sqrt();
        let imag = this.imag.divide(r_plus_x.multiply(new SmallExactNumber(2)).sqrt());

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
        return new BoxedNumber(this.real, new SmallExactNumber(0).subtract(this.imag));
    }
    public magnitude(): BoxedNumber {
        let realSqr = this.real.multiply(this.real);
        let imagSqr = this.imag.multiply(this.imag);
        let sum = realSqr.add(imagSqr);
        return new BoxedNumber(sum.sqrt());
    }
    public realPart(): BoxedNumber {
        return new BoxedNumber(this.real);
    }
    public imaginaryPart(): BoxedNumber {
        return new BoxedNumber(this.imag);
    }

    public log(): BoxedNumber {
        let mag = this.magnitude();
        let theta = this.angle();

        return mag.log().add(theta.multiply(I));
    }
    public expt(power: BoxedNumber): BoxedNumber {
        if (this.isExact() && this.isInteger() && power.greaterThanOrEqual(ZERO)) {
            let n = this.real.toFixnum();
            let k = power.real.toFixnum();
            let result = fastExpt(n, k);

            let resultValue;
            if (typeof result === 'number') {
                resultValue = new SmallExactNumber(result);
            } else {
                resultValue = new BigExactNumber(result);
            }

            return new BoxedNumber(resultValue);
        }

        let expo = power.multiply(this.log());
        return expo.exp();
    }
    public exp(): BoxedNumber {
        let r = new BoxedNumber(this.real.exp());
        let cos_a = new BoxedNumber(this.imag.cos());
        let sin_a = new BoxedNumber(this.imag.sin());

        return r.multiply(cos_a.add(sin_a.multiply(I)));
    }

    public angle(): BoxedNumber {
        if (this.isReal()) {
            return new BoxedNumber(this.real.angle());
        }
        if (this.real.equals(ZERO_VAL)) {
            let halfPI = PI.divide(TWO);
            if (this.imag.greaterThan(ZERO_VAL)) {
                return halfPI;
            } else {
                return halfPI.multiply(NEG_ONE);
            }
        }

        let tmp = this.imaginaryPart().abs().divide(this.realPart().abs()).atan();
        if (this.realPart().greaterThan(ZERO)) {
            if (this.imaginaryPart().greaterThan(ZERO)) {
                return tmp;
            } else {
                return tmp.multiply(NEG_ONE);
            }
        } else {
            if (this.imaginaryPart().greaterThan(ZERO)) {
                return PI.subtract(tmp);
            } else {
                return tmp.subtract(PI);
            }
        }
    }
    public atan(): BoxedNumber {
        if (this.equals(I) || this.equals(NEG_I)) {
            return NEG_INF;
        }
        return I.multiply(HALF.multiply(I.add(this).divide(I.add(ZERO.subtract(this))).log()));
    }
    public cos(): BoxedNumber {
        if (this.isReal()) {
            return new BoxedNumber(this.real.cos());
        }
        let iz = this.multiply(I);
        let iz_negate = iz.multiply(NEG_ONE);
        return iz.exp().add(iz_negate.exp()).divide(TWO);
    }
    public sin(): BoxedNumber {
        if (this.isReal()) {
            return new BoxedNumber(this.real.sin());
        }
        let iz = this.multiply(I);
        let iz_negate = iz.multiply(NEG_ONE);
        let z2 = new BoxedNumber(ZERO_VAL, TWO_VAL);
        let exp_negate = iz.exp().subtract(iz_negate.exp());
        let result = exp_negate.divide(z2);
        return result;
    }
    public acos(): BoxedNumber {
        if (this.isReal()) {
            return new BoxedNumber(this.real.acos());
        }
        let pi_half = PI.divide(TWO);
        let iz = this.multiply(I);
        let root = ONE.subtract(this.multiply(this)).sqrt();
        let l = iz.add(root).log().multiply(I);
        return pi_half.add(l);
    }
    public asin(): BoxedNumber {
        if (this.isReal()) {
            return new BoxedNumber(this.real.asin());
        }
        let oneNegateThisSq = ONE.subtract(this.multiply(this));
        let sqrtOneNegateThisSq = oneNegateThisSq.sqrt();
        return TWO.multiply(this.divide(ONE.add(sqrtOneNegateThisSq)).atan());
    }
}

/////////////////////// Constants ///////////////////////
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
