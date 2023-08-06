import {
    JSInteger,
    Number,
    BoxedNumber,
    ExactNumber,
    RealNumber,

    isSafeInteger,

    InexactNumber,
    BigExactNumber,
    ComplexNumber,

    INEXACT_ZERO,

    EXACT_ZERO,
    EXACT_NEG_ONE,
} from './index';

export class SmallExactNumber implements Number {
    public readonly num: number;
    public readonly den: number;

    constructor(num: number, den: number = 1) {
        if (!Number.isInteger(num) && !Number.isInteger(den)) {
            throw new TypeError("Exact number can only be constructed from integers.")
        }

        if (typeof num === 'number' && typeof den === 'number') {
            // Only the numerator can be negative.
            if (den < 0) {
                num *= -1;
                den *= -1;
            }

            if (Object.is(num, -0)) {
                num = 0;
            }

            const gcd = this.gcd(num, den);
            this.num = num / gcd;
            this.den = den / gcd;

        } else {
            throw new TypeError("Exact value numerator and denominator types must match")
        }

        // Make it immutable
        Object.freeze(this);
    }

    private gcd(a: number, b: number): number {
        let t;
        while (b !== 0) {
            t = a;
            a = b;
            b = t % b;
        }
        return Math.abs(a);
    }

    public isExact(): boolean {
        return true;
    }
    public isInexact(): boolean {
        return false;
    }

    public toInexact(): InexactNumber {
        const result = this.num / this.den;
        return new InexactNumber(result);
    }
    public toExact(): ExactNumber {
        return this;
    }
    public toBigExact(): BigExactNumber {
        return new BigExactNumber(BigInt(this.num), BigInt(this.den));
    }
    public toComplex(): ComplexNumber {
        return new ComplexNumber(this, EXACT_ZERO);
    }
    public toFixnum(): number {
        return Math.floor(this.num / this.den);
    }

    public isInteger(): boolean {
        return this.den === 1;
    }
    public isRational(): boolean {
        return true;
    }
    public isReal(): boolean {
        return true;
    }
    public isComplex(): boolean {
        return true;
    }

    public isZero(): boolean {
        return this.num === 0;
    }
    public isNegativeZero(): boolean {
        return false;
    }
    public isPositive(): boolean {
        return this.num > 0;
    }
    public isNegative(): boolean {
        return this.num < 0;
    }
    public isEven(): boolean {
        return this.den === 1 && this.num % 2 === 0;
    }
    public isFinite(): boolean {
        return true;
    }
    public isNaN(): boolean {
        return false;
    }

    public toString(): string {
        if (this.den === 1) {
            return this.num.toString();
        }

        return `${this.num}/${this.den}`;
    }
    public toSignedString(): string {
        if (this.isPositive() || this.isZero()) {
            return "+" + this.toString();
        }
        return this.toString();
    }
    public [Symbol.toPrimitive](hint: string): number | bigint | string {
        if (hint === 'string') {
            return this.toString();
        }

        if (hint === 'bigint' && this.den === 1) {
            return BigInt(this.num);
        }

        return this.num / this.den;
    }


    public greaterThan(other: BoxedNumber): boolean {
        if (other instanceof InexactNumber) {
            if (other.isNaN()) {
                return false;
            } else if (!other.isFinite()) {
                return !other.isPositive();
            }
            return this.greaterThan(other.toExact());

        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().greaterThan(other);

        } else if (other instanceof ComplexNumber) {
            throw new TypeError("Not defined for complex numbers.");

        } else {
            const thisVal = this.num * (other.den as number);
            const otherVal = (other.num as number) * this.den;
            return thisVal > otherVal;
        }
    }
    public greaterThanOrEqual(other: BoxedNumber): boolean {
        if (other instanceof InexactNumber) {
            if (other.isNaN()) {
                return false;
            } else if (!other.isFinite()) {
                return !other.isPositive();
            }
            return this.greaterThanOrEqual(other.toExact());

        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().greaterThanOrEqual(other);

        } else if (other instanceof ComplexNumber) {
            throw new TypeError("Not defined for complex numbers.");

        } else {
            const thisVal = this.num * (other.den as number);
            const otherVal = (other.num as number) * this.den;
            return thisVal >= otherVal;
        }
    }
    public lessThan(other: BoxedNumber): boolean {
        if (other instanceof InexactNumber) {
            if (other.isNaN()) {
                return false;
            } else if (!other.isFinite()) {
                return other.isPositive();
            }
            return this.lessThan(other.toExact());

        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().lessThan(other);

        } else if (other instanceof ComplexNumber) {
            throw new TypeError("Not defined for complex numbers.");

        } else {
            const thisVal = this.num * (other.den as number);
            const otherVal = (other.num as number) * this.den;
            return thisVal < otherVal;
        }
    }
    public lessThanOrEqual(other: BoxedNumber): boolean {
        if (other instanceof InexactNumber) {
            if (other.isNaN()) {
                return false;
            } else if (!other.isFinite()) {
                return other.isPositive();
            }
            return this.lessThanOrEqual(other.toExact());

        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().lessThanOrEqual(other);

        } else if (other instanceof ComplexNumber) {
            throw new TypeError("Not defined for complex numbers.");

        } else {
            const thisVal = this.num * (other.den as number);
            const otherVal = (other.num as number) * this.den;
            return thisVal <= otherVal;
        }
    }
    public equals(other: BoxedNumber): boolean {
        if (other instanceof InexactNumber) {
            if (!other.isFinite()) {
                return false;
            }
            return this.equals(other.toExact());

        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().equals(other);

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().equals(other);

        } else {
            const thisVal = this.num * (other.den as number);
            const otherVal = (other.num as number) * this.den;
            return thisVal === otherVal;
        }
    }

    public add(other: RealNumber): RealNumber;
    public add(other: ComplexNumber): ComplexNumber;
    public add(other: BoxedNumber): BoxedNumber;
    public add(other: BoxedNumber): BoxedNumber {
        if (other instanceof InexactNumber) {
            return this.toInexact().add(other);

        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().add(other);

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().add(other);

        } else {
            const num = (this.num * other.den) + (other.num * this.den);
            const den = this.den * other.den;

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().add(other.toBigExact());
            }

            return new SmallExactNumber(num, den);
        }
    }
    public subtract(other: RealNumber): RealNumber;
    public subtract(other: ComplexNumber): ComplexNumber;
    public subtract(other: BoxedNumber): BoxedNumber;
    public subtract(other: BoxedNumber): BoxedNumber {
        if (other instanceof InexactNumber) {
            return this.toInexact().subtract(other);

        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().subtract(other);

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().subtract(other);

        } else {
            const num = (this.num * other.den) - (other.num * this.den);
            const den = this.den * other.den;

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().subtract(other.toBigExact());
            }

            return new SmallExactNumber(num, den);
        }
    }
    public multiply(other: RealNumber): RealNumber;
    public multiply(other: ComplexNumber): ComplexNumber;
    public multiply(other: BoxedNumber): BoxedNumber;
    public multiply(other: BoxedNumber): BoxedNumber {
        if (this.isZero() || (other.isExact() && other.isZero())) {
            return EXACT_ZERO;
        }

        if (other instanceof InexactNumber) {
            return this.toInexact().multiply(other);

        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().multiply(other);

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().multiply(other);

        } else {
            const num = this.num * other.num;
            const den = this.den * other.den;

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().multiply(other.toBigExact());
            }

            return new SmallExactNumber(num, den);
        }
    }
    public divide(other: RealNumber): RealNumber;
    public divide(other: ComplexNumber): ComplexNumber;
    public divide(other: BoxedNumber): BoxedNumber;
    public divide(other: BoxedNumber): BoxedNumber {
        if (this.isZero()) {
            return this;
        }

        if (other instanceof InexactNumber) {
            return this.toInexact().divide(other);

        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().divide(other);

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().divide(other);

        } else if (other.isZero()) {
            throw new Error("/: division by zero" + this + other);

        } else {
            const num = this.num * other.den;
            const den = this.den * other.num;

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().divide(other.toBigExact());
            }

            return new SmallExactNumber(num, den);
        }
    }

    public numerator(): RealNumber {
        return new SmallExactNumber(this.num);
    }
    public denominator(): RealNumber {
        return new SmallExactNumber(this.den);
    }

    public integerSqrt(): BoxedNumber {
        if (this.isNegative()) {
            const n = this.multiply(EXACT_NEG_ONE);
            const sqrt = n.sqrt().realPart().floor();
            const zero = sqrt.isExact() ? EXACT_ZERO : INEXACT_ZERO;
            return new ComplexNumber(zero, sqrt);
        }
        return this.sqrt().realPart().floor();
    }
    public sqrt(): BoxedNumber {
        if (this.isNegative()) {
            const n = this.multiply(EXACT_NEG_ONE);
            const sqrt = n.sqrt().realPart();

            if (sqrt.isExact()) {
                return new ComplexNumber(EXACT_ZERO, sqrt);
            }
            return new ComplexNumber(INEXACT_ZERO, sqrt);
        }

        const num = Math.sqrt(this.num);
        const den = Math.sqrt(this.den);

        if (num === Math.floor(num) && den === Math.floor(den)) {
           return new SmallExactNumber(num, den);
        } else {
            return new InexactNumber(num / den);
        }
    }
    public abs(): RealNumber {
        if (this.isNegative()) {
            return new SmallExactNumber(-1 * this.num, this.den);
        } else {
            return this;
        }
    }
    public floor(): RealNumber {
        if (this.den === 1) {
            return this;
        } else {
            return new SmallExactNumber(Math.floor(this.num / this.den));
        }
    }
    public ceiling(): RealNumber {
        if (this.den === 1) {
            return this;
        } else {
            return new SmallExactNumber(Math.ceil(this.num / this.den));
        }
    }
    public round(): RealNumber {
        if (this.den === 1) {
            return this;
        } else {
            return new SmallExactNumber(Math.round(this.num / this.den));
        }
    }

    public conjugate(): BoxedNumber {
        return this;
    }
    public magnitude(): BoxedNumber {
        return this.abs();
    }
    public realPart(): RealNumber {
        return this;
    }
    public imaginaryPart(): RealNumber {
        return EXACT_ZERO;
    }
    public angle(): BoxedNumber {
       if (this.isNegative()) {
           return new InexactNumber(Math.PI);
       } else {
           return new SmallExactNumber(0);
       }
    }

    public log(): BoxedNumber {
        if (this.isNegative()) {
            return this.toComplex().log();
        }
        return new InexactNumber(Math.log(this.num / this.den));
    }
    public expt(power: BoxedNumber): BoxedNumber {
        if (power instanceof ComplexNumber) {
            return this.toComplex().expt(power);
        }

        if (power.isExact() && power.isInteger() && !power.isNegative()) {
            const exp = power.toFixnum();

            if (typeof exp === 'bigint') {
                return this.toBigExact().expt(power);
            }

            const num = Math.pow(this.num, exp);
            const den = Math.pow(this.den, exp);

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().expt(power);
            }

            return new SmallExactNumber(num, den);
        }

        return this.toInexact().expt(power);
    }
    public exp(): BoxedNumber {
        return new InexactNumber(Math.exp(this.num / this.den));
    }

    public tan(): BoxedNumber {
        return new InexactNumber(Math.tan(this.num / this.den));
    }
    public cos(): BoxedNumber {
        return new InexactNumber(Math.cos(this.num / this.den));
    }
    public sin(): BoxedNumber {
        return new InexactNumber(Math.sin(this.num / this.den));
    }
    public atan(): BoxedNumber {
        return new InexactNumber(Math.atan(this.num / this.den));
    }
    public acos(): BoxedNumber {
        return new InexactNumber(Math.acos(this.num / this.den));
    }
    public asin(): BoxedNumber {
        return new InexactNumber(Math.asin(this.num / this.den));
    }
}

