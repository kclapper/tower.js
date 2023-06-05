import { fastExpt } from './util';
import {
    InexactNumber,
    SmallExactNumber,
    BigExactNumber,
    Value,
} from './Value';
import {
    TowerNumber,
    BoxedNumber,
    JSInteger,
    Level,
    isJSInteger,
    isJSNumber,
} from './main';
import { Integer } from './Integer';
import { Rational } from './Rational';
import { Real } from './Real';
import {
    ZERO_VAL,
    ONE_VAL,
    TWO_VAL,
    ZERO,
    ONE,
    TWO,
    HALF,
    NEG_ONE,
    PI,
    I,
    NEG_I,
    INF,
    NEG_INF
} from './constants';


export class Complex {
    public readonly level: Level;

    public readonly real: Value;
    public readonly imag: Value;

    constructor(real: Value, imag?: Value) {
        this.level = Level.COMPLEX;
        this.real = real;

        if (imag === undefined) {
            this.imag = this.real.multiply(new SmallExactNumber(0));
        } else {
            this.imag = imag;
        }
    }

    public static makeInstance(real: bigint, imag: bigint): Complex;
    public static makeInstance(real: number, imag: number): Complex;
    public static makeInstance(real: bigint, imag: bigint, realDen: bigint, imagDen: bigint): Complex;
    public static makeInstance(real: number, imag: number, realDen: number, imagDen: number): Complex;
    public static makeInstance(real: JSInteger, imag: JSInteger, realDen?: JSInteger, imagDen?: JSInteger): Complex {
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

        return new Complex(realVal, imagVal);
    }

    public toString(): string {
        return this.real.toString() + this.imag.toSignedString() + "i";
    }

    public liftTo(other: TowerNumber): Complex {
        if (isJSInteger(other)) {
            throw new TypeError("Cannot lift to lower level.")
        }

        switch (other.level) {
            case Level.INTEGER:
                throw new TypeError("Cannot lift to lower level.")
            case Level.RATIONAL:
                throw new TypeError("Cannot lift to lower level.")
            case Level.REAL:
                throw new TypeError("Cannot lift to lower level.")
            case Level.COMPLEX:
                return this;
            default:
                let _exaustiveSearch: never = other.level;
                return other;
        }
    }

    public isFinite(): boolean {
        return this.real.isFinite() && this.imag.isFinite();
    }
    public isInteger(): this is Integer {
        return this.real.isInteger() && this.imag.isInteger();
    }
    public isRational(): this is Rational {
        return this.isFinite();
    }
    public isReal(): this is Real {
        return this.imag.isZero();
    }
    public isExact(): boolean {
        return this.real.isExact() && this.imag.isExact();
    }
    public isInexact(): boolean {
        return !this.isExact();
    }
    public isPositive(): boolean {
        if (this.imag.isZero()) {
            throw new TypeError("Not defined for complex numbers.");
        }
        return this.real.isPositive();
    }
    public toExact(): Complex {
        return new Complex(this.real.toExact(), this.imag.toExact());
    }
    public toFixNum(): JSInteger {
        if (!this.isReal()) {
            throw new TypeError("Not defined for complex numbers.");
        }
        return this.real.toFixnum();
    }

    public greaterThan(other: Complex): boolean {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Greater than not defined for complex numbers.");
        }
        return this.real.greaterThan(other.real);
    }
    public greaterThanOrEqual(other: Complex): boolean {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Greater than or equal not defined for complex numbers.");
        }
        return this.real.greaterThanOrEqual(other.real);
    }
    public lessThan(other: Complex): boolean {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Less than not defined for complex numbers.");
        }
        return this.real.lessThan(other.real);
    }
    public lessThanOrEqual(other: Complex): boolean {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Less than or equal not defined for complex numbers.");
        }
        return this.real.lessThanOrEqual(other.real);
    }
    public equals(other: Complex): boolean {
        return this.real.equals(other.real) && this.imag.equals(other.imag);
    }

    public add(other: Complex): Complex {
        return new Complex(this.real.add(other.real), this.imag.add(other.imag));
    }
    public subtract(other: Complex): Complex {
        return new Complex(this.real.subtract(other.real), this.imag.subtract(other.imag));
    }
    public multiply(other: Complex): Complex {
        let real = this.real.multiply(other.real).subtract(this.imag.multiply(other.imag));
        let imag = this.real.multiply(other.imag).add(this.imag.multiply(other.real));
        return new Complex(real, imag);
    }
    public divide(other: Complex): Complex {
        let a, b, c, d, r, x, y;

        // If the other value is real, just do primitive division
        if (other.isReal()) {
            let real = this.real.divide(other.real);
            let imag = this.imag.divide(other.real);
            return new Complex(real, imag);
        }

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
            return new Complex(x, y);
        } else {
            var con = other.conjugate();
            var up = this.multiply(con);

            // Down is guaranteed to be real by this point.
            var down = other.multiply(con).realPart();

            let real = up.realPart().divide(down).real;
            let imag = up.imaginaryPart().divide(down).real;
            return new Complex(real, imag);
        }
    }

    public numerator(): Real {
        if (!this.isReal()) {
            throw new Error("Numerator not defined for complex numbers.");
        }
        return new Real(this.real.numerator());
    }
    public denominator(): Real {
        if (!this.isReal()) {
            throw new Error("Denominator not defined for complex numbers.");
        }
        return new Real(this.real.denominator());
    }

    public integerSqrt(): Integer {
        if (this.isInteger()) {
            return new Integer(this.real.integerSqrt());
        } else {
            throw new Error("IntegerSqrt only defined for integers.");
        }
    }
    public sqrt(): Complex {
        if (this.isReal()) {
            return new Complex(this.real.sqrt());
        }

        // http://en.wikipedia.org/wiki/Square_root#Square_roots_of_negative_and_complex_numbers
        let mag = this.magnitude().real;
        let r_plus_x = mag.add(this.real);

        let real = r_plus_x.divide(new SmallExactNumber(2)).sqrt();
        let imag = this.imag.divide(r_plus_x.multiply(new SmallExactNumber(2)).sqrt());

        return new Complex(real, imag);
    }
    public abs(): Real {
        if (!this.isReal()) {
            throw new Error("abs is not defined for complex numbers.");
        }
        return new Real(this.real.abs());
    }
    public floor(): Real {
        if (!this.isReal()) {
            throw new Error("floor is not defined for complex numbers.");
        }
        return new Real(this.real.floor());
    }
    public ceiling(): Real {
        if (!this.isReal()) {
            throw new Error("ceiling is not defined for complex numbers.");
        }
        return new Real(this.real.ceiling());
    }
    public round(): Real {
        if (!this.isReal()) {
            throw new Error("round is not defined for complex numbers.");
        }
        return new Real(this.real.round());
    }

    public conjugate(): Complex {
        return new Complex(this.real, new SmallExactNumber(0).subtract(this.imag));
    }
    public magnitude(): Real {
        let realSqr = this.real.multiply(this.real);
        let imagSqr = this.imag.multiply(this.imag);
        let sum = realSqr.add(imagSqr);
        return new Real(sum.sqrt());
    }
    public realPart(): Real {
        return new Real(this.real);
    }
    public imaginaryPart(): Real {
        return new Real(this.imag);
    }

    public log(): Complex {
        let mag = this.magnitude();
        let theta = this.angle();

        return mag.log().add(theta.multiply(I));
    }
    public expt(power: Complex): Complex {
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

            return new Integer(resultValue);
        }

        let expo = power.multiply(this.log());
        return expo.exp();
    }
    public exp(): Complex {
        let r = new Complex(this.real.exp());
        let cos_a = new Complex(this.imag.cos());
        let sin_a = new Complex(this.imag.sin());

        return r.multiply(cos_a.add(sin_a.multiply(I)));
    }

    public angle(): Real {
        if (this.isReal()) {
            return new Real(this.real.angle());
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
    public atan(): Complex {
        if (this.equals(I) || this.equals(NEG_I)) {
            return NEG_INF;
        }
        return I.multiply(HALF.multiply(I.add(this).divide(I.add(ZERO.subtract(this))).log()));
    }
    public cos(): Complex {
        if (this.isReal()) {
            return new Real(this.real.cos());
        }
        let iz = this.multiply(I);
        let iz_negate = iz.multiply(NEG_ONE);
        return iz.exp().add(iz_negate.exp()).divide(TWO);
    }
    public sin(): Complex {
        if (this.isReal()) {
            return new Real(this.real.sin());
        }
        let iz = this.multiply(I);
        let iz_negate = iz.multiply(NEG_ONE);
        let z2 = new Complex(ZERO_VAL, TWO_VAL);
        let exp_negate = iz.exp().subtract(iz_negate.exp());
        let result = exp_negate.divide(z2);
        return result;
    }
    public acos(): Complex {
        if (this.isReal()) {
            return new Real(this.real.acos());
        }
        let pi_half = PI.divide(TWO);
        let iz = this.multiply(I);
        let root = ONE.subtract(this.multiply(this)).sqrt();
        let l = iz.add(root).log().multiply(I);
        return pi_half.add(l);
    }
    public asin(): Complex {
        if (this.isReal()) {
            return new Real(this.real.asin());
        }
        let oneNegateThisSq = ONE.subtract(this.multiply(this));
        let sqrtOneNegateThisSq = oneNegateThisSq.sqrt();
        return TWO.multiply(this.divide(ONE.add(sqrtOneNegateThisSq)).atan());
    }
}
