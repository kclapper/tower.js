import {
    isJSInteger,
    fastExpt
} from './util';
import {
    InexactNumber,
    SmallExactNumber,
    BigExactNumber,
    Value,
} from './Value';
import {
    RacketNumber,
    JSInteger,
    JSNumber,
    Level,
} from './main';
import {
    ZERO_VAL,
    TWO_VAL,
    ZERO,
    ONE,
    TWO,
    NEG_ONE,
    HALF,
    PI,
    I,
    NEG_I,
    NEG_INF
} from './constants';

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
    }

    // TODO: imaginary part should be optional
    public static makeInstance(real: JSNumber): BoxedNumber;

    public static makeInstance(real: bigint, imag: bigint): BoxedNumber;
    public static makeInstance(real: bigint, realDen: bigint): BoxedNumber;
    public static makeInstance(real: bigint, realDen: bigint, imag: bigint, imagDen: bigint): BoxedNumber;

    public static makeInstance(real: number, imag: number): BoxedNumber;
    public static makeInstance(real: number, realDen: number): BoxedNumber;
    public static makeInstance(real: number, realDen: number, imag: number,  imagDen: number): BoxedNumber;

    public static makeInstance(real: JSNumber, realDen?: JSInteger, imag?: JSNumber, imagDen?: JSInteger): BoxedNumber {
        let isReal = imag === undefined;
        if (isReal && imagDen !== undefined) {
           throw new Error("Must specify both a numerator and denominator.");
        }
        if (typeof real === 'number') {
            imag = 0;
        } else {
            imag = 0n;
        }

        let denominatorsExist = realDen !== undefined && imagDen !== undefined;
        if (!denominatorsExist && (realDen !== undefined || imagDen !== undefined)) {
            throw new Error("Real and imaginary part must be the same exactness.")
        }

        let componentsAreIntegers;
        if (denominatorsExist) {
            componentsAreIntegers = isJSInteger(real)
                && isJSInteger(imag)
                && isJSInteger(realDen)
                && isJSInteger(imagDen);
        } else {
            componentsAreIntegers = isJSInteger(real)
                && isJSInteger(imag);
        }


        let typesAreSame;
        if (denominatorsExist) {
            typesAreSame = typeof real === typeof imag
                && typeof realDen === typeof imagDen
                && typeof real === typeof realDen;
        } else {
            typesAreSame = typeof real === typeof imag;
        }
        if (!typesAreSame) {
            throw new TypeError("All makeInstance arguments must be the same type.")
        }

        let isBig = typeof real === 'bigint';

        let realVal, imagVal;
        if (denominatorsExist) {
            if (componentsAreIntegers && isBig) {
                realVal = new BigExactNumber(real as bigint, realDen as bigint);
                imagVal = new BigExactNumber(imag as bigint, imagDen as bigint);
            } else if (componentsAreIntegers) {
                realVal = new SmallExactNumber(real as number, realDen as number);
                imagVal = new SmallExactNumber(imag as number, imagDen as number);
            } else {
                throw new TypeError("Numerator and denominator must be integers.")
            }
        } else {
            if (componentsAreIntegers && isBig) {
                realVal = new BigExactNumber(real as bigint);
                imagVal = new BigExactNumber(imag as bigint);
            } else if (componentsAreIntegers) {
                realVal = new SmallExactNumber(real as number);
                imagVal = new SmallExactNumber(imag as number);
            } else {
                realVal = new InexactNumber(real as number);
                imagVal = new InexactNumber(imag as number);
            }
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
        return this.real.isInteger() && this.imag.isInteger();
    }
    public isRational(): boolean {
        return this.isFinite();
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
    public isPositive(): boolean {
        if (!this.isReal()) {
            throw new TypeError("Not defined for complex numbers.");
        }
        return this.real.isPositive();
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
