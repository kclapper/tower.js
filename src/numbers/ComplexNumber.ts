import {
    Number,
    BoxedNumber,
    RealNumber,

    matchExactness,

    ZERO,
    ONE,
    HALF,
    TWO,
    NEG_ONE,

    I,
    NEG_I,

    PI,
    NEG_INF,
} from './index';

export class ComplexNumber implements Number {
    public readonly real: RealNumber;
    public readonly imag: RealNumber;

    constructor(real: RealNumber, imag?: RealNumber) {
        this.real = real;

        if (imag === undefined) {
            this.imag = ZERO;
        } else {
            this.imag = imag;
        }

        // Make it immutable
        Object.freeze(this);
    }

    public isExact(): boolean {
        return this.real.isExact() && this.imag.isExact();
    }
    public isInexact(): boolean {
        return !this.isExact();
    }

    public toInexact(): BoxedNumber {
        if (this.isInexact()) {
            return this;
        }
        if (this.isReal()) {
            return this.real.toInexact();
        }
        return new ComplexNumber(this.real.toInexact(), this.imag.toInexact());
    }
    public toExact(): BoxedNumber {
        if (this.isExact()) {
            return this;
        }
        if (this.isReal()) {
            return this.real.toExact();
        }
        return new ComplexNumber(this.real.toExact(), this.imag.toExact());
    }
    public toReal(): RealNumber {
        if (!this.isReal()) {
            throw new TypeError("Complex number cannot be made real.")
        }
        return this.real;
    }
    public toComplex(): ComplexNumber {
        return this;
    }
    public toFixnum(): number {
        if (!this.isReal()) {
            throw new TypeError("Not defined for complex numbers.");
        }
        return this.real.toFixnum();
    }

    public isInteger(): boolean {
        return this.isRational() && this.real.isInteger();
    }
    public isRational(): boolean {
        return this.isReal() && this.isFinite();
    }
    public isReal(): boolean {
        return this.imag.isZero() && this.imag.isExact();
    }
    public isComplex(): boolean {
        return true;
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
    public isFinite(): boolean {
        return this.real.isFinite() && this.imag.isFinite();
    }
    public isNaN(): boolean {
        return this.real.isNaN() || this.imag.isNaN();
    }

    public toString(): string {
        if (this.isReal()) {
            return this.real.toString();
        } else {
            return this.real.toString() + this.imag.toSignedString() + "i";
        }
    }
    public toSignedString(): string {
        return this.real.toSignedString() + this.imag.toSignedString() + "i";
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
        }

        return primitive;
    }

    public greaterThan(other: BoxedNumber): boolean {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Greater than not defined for complex numbers.");
        }
        return this.real.greaterThan(other);
    }
    public greaterThanOrEqual(other: BoxedNumber): boolean {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Greater than or equal not defined for complex numbers.");
        }
        return this.real.greaterThanOrEqual(other);
    }
    public lessThan(other: BoxedNumber): boolean {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Less than not defined for complex numbers.");
        }
        return this.real.lessThan(other);
    }
    public lessThanOrEqual(other: BoxedNumber): boolean {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Less than or equal not defined for complex numbers.");
        }
        return this.real.lessThanOrEqual(other);
    }
    public equals(other: BoxedNumber): boolean {
        other = other.toComplex();
        return this.real.equals(other.real) && this.imag.equals(other.imag);
    }

    public add(other: BoxedNumber): BoxedNumber {
        let real = this.realPart().add(other.realPart());

        if (this.isReal() && other.isReal()) {
            return real;
        }

        let imag = this.imaginaryPart().add(other.imaginaryPart());

        [real, imag] = matchExactness(real, imag);

        return new ComplexNumber(real, imag);
    }
    public subtract(other: BoxedNumber): BoxedNumber {
        let real = this.realPart().subtract(other.realPart());

        if (this.isReal() && other.isReal()) {
            return real;
        }

        let imag = this.imaginaryPart().subtract(other.imaginaryPart());

        [real, imag] = matchExactness(real, imag);

        return new ComplexNumber(real, imag);
    }
    public multiply(other: BoxedNumber): BoxedNumber {
        const thisReal = this.realPart();
        const thisImag = this.imaginaryPart();
        const otherReal = other.realPart();
        const otherImag = other.imaginaryPart();

        let real = thisReal.multiply(otherReal).subtract(thisImag.multiply(otherImag));
        const imag = thisReal.multiply(otherImag).add(thisImag.multiply(otherReal));

        real = !imag.isExact() ? real.toInexact() : real;

        if (imag.isExact() && imag.isZero()) {
            return real;
        }

        return new ComplexNumber(real, imag);
    }
    public divide(other: BoxedNumber): BoxedNumber {
        // If the other value is real, just do primitive division
        if (other.isReal()) {
            const real = this.realPart().divide(other.realPart());
            const imag = this.imaginaryPart().divide(other.realPart());
            return new ComplexNumber(real, imag);
        }

        let a, b, c, d, r, x, y;
        if (this.isInexact() || other.isInexact()) {
            // http://portal.acm.org/citation.cfm?id=1039814
            // We currently use Smith's method, though we should
            // probably switch over to Priest's method.
            a = this.realPart();
            b = this.imaginaryPart();
            c = other.realPart();
            d = other.imaginaryPart();
            if (d.abs().lessThanOrEqual(c.abs())) {
                r = d.divide(c);
                x = a.add(b.multiply(r)).divide(c.add(d.multiply(r)));
                y = b.subtract(a.multiply(r)).divide(c.add(d.multiply(r)));
            } else {
                r = c.divide(d);
                x = a.multiply(r).add(b).divide(c.multiply(r).add(d));
                y = b.multiply(r).subtract(a).divide(c.multiply(r).add(d));
            }
            return new ComplexNumber(x, y);
        } else {
            const con = other.conjugate();
            const up = this.multiply(con);

            // Down is guaranteed to be real by this point.
            const down = other.multiply(con).realPart();

            const real = up.realPart().divide(down).realPart();
            const imag = up.imaginaryPart().divide(down).realPart();
            return new ComplexNumber(real, imag);
        }
    }

    public numerator(): RealNumber {
        if (!this.isReal()) {
            throw new Error("Numerator not defined for complex numbers.");
        }
        return this.real.numerator();
    }
    public denominator(): RealNumber {
        if (!this.isReal()) {
            throw new Error("Denominator not defined for complex numbers.");
        }
        return this.real.denominator();
    }

    // TODO: Continue here...
    public integerSqrt(): BoxedNumber {
        if (this.isInteger()) {
            return this.real.integerSqrt();
        } else {
            throw new Error("IntegerSqrt only defined for integers.");
        }
    }
    public sqrt(): BoxedNumber {
        if (this.isReal() && !this.isNegative()) {
            return this.real.sqrt();
        }

        // http://en.wikipedia.org/wiki/Square_root#Square_roots_of_negative_and_complex_numbers
        const mag = this.magnitude().realPart();
        const r_plus_x = mag.add(this.real);

        const real = r_plus_x.divide(TWO).sqrt().realPart();
        const imag = this.imag.divide(r_plus_x.multiply(TWO).sqrt()).realPart();

        return new ComplexNumber(real, imag);
    }
    public abs(): RealNumber {
        if (!this.isReal()) {
            throw new Error("abs is not defined for complex numbers.");
        }
        return this.real.abs();
    }
    public floor(): RealNumber {
        if (!this.isReal()) {
            throw new Error("floor is not defined for complex numbers.");
        }
        return this.real.floor();
    }
    public ceiling(): RealNumber {
        if (!this.isReal()) {
            throw new Error("ceiling is not defined for complex numbers.");
        }
        return this.real.ceiling();
    }
    public round(): RealNumber {
        if (!this.isReal()) {
            throw new Error("round is not defined for complex numbers.");
        }
        return this.real.round();
    }

    public conjugate(): BoxedNumber {
        return new ComplexNumber(this.real, ZERO.subtract(this.imag));
    }
    public magnitude(): BoxedNumber {
        const realSqr = this.real.multiply(this.real);
        const imagSqr = this.imag.multiply(this.imag);
        const sum = realSqr.add(imagSqr);
        return sum.sqrt();
    }
    public realPart(): RealNumber {
        return this.real;
    }
    public imaginaryPart(): RealNumber {
        return this.imag;
    }

    public log(): BoxedNumber {
        if (this.isReal() && this.isPositive()) {
            return this.real.log();
        }

        const mag = this.magnitude().realPart();
        const mag_log = mag.log();

        const theta = this.angle();

        return mag_log.add(theta.multiply(I));
    }
    public expt(power: BoxedNumber): BoxedNumber {
        if (power.isExact() && power.isInteger() && power.greaterThanOrEqual(ZERO)) {
            let n: BoxedNumber = this;
            let k: bigint = BigInt(power.toFixnum());

            let acc: BoxedNumber = ONE;

            while (k !== 0n) {
                if (k % 2n === 0n) {
                    n = n.multiply(n);
                    k = k / 2n;
                } else {
                    acc = acc.multiply(n);
                    k = k - 1n;
                }
            }
            return acc;
        }

        const expo = power.multiply(this.log());
        return expo.exp();
    }
    public exp(): BoxedNumber {
        if (this.isReal()) {
            return this.real.exp();
        }

        const r = this.real.exp();
        const cos_a = this.imag.cos();
        const sin_a = this.imag.sin();

        return r.multiply(cos_a.add(sin_a.multiply(I)));
    }

    public angle(): BoxedNumber {
        if (this.isReal()) {
            return this.real.angle();
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
            return this.real.tan();
        }
        return this.sin().divide(this.cos());
    }
    public cos(): BoxedNumber {
        if (this.isReal()) {
            return this.real.cos();
        }
        const iz = this.multiply(I);
        const iz_negate = iz.multiply(NEG_ONE);
        return iz.exp().add(iz_negate.exp()).divide(TWO);
    }
    public sin(): BoxedNumber {
        if (this.isReal()) {
            return this.real.sin();
        }
        const iz = this.multiply(I);
        const iz_negate = iz.multiply(NEG_ONE);
        const z2 = new ComplexNumber(ZERO, TWO);
        const exp_negate = iz.exp().subtract(iz_negate.exp());
        const result = exp_negate.divide(z2);
        return result;
    }
    public atan(): BoxedNumber {
        if (this.isZero()) {
            return ZERO;
        }
        if (this.isReal()) {
            return this.real.atan();
        }
        if (this.equals(I) || this.equals(NEG_I)) {
            return NEG_INF;
        }

        let result: BoxedNumber;
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
            return this.real.acos();
        }
        const pi_half = PI.divide(TWO);
        const iz = this.multiply(I);
        const root = ONE.subtract(this.multiply(this)).sqrt();
        const l = iz.add(root).log().multiply(I);
        return pi_half.add(l);
    }
    public asin(): BoxedNumber {
        if (this.isReal() && this.greaterThanOrEqual(NEG_ONE) && this.lessThanOrEqual(ONE)) {
            return this.real.asin();
        }
        const oneNegateThisSq = ONE.subtract(this.multiply(this));
        const sqrtOneNegateThisSq = oneNegateThisSq.sqrt();
        return TWO.multiply(this.divide(ONE.add(sqrtOneNegateThisSq)).atan());
    }
}

