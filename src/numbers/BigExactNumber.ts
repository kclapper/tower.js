import {
    JSInteger,
    Number,
    BoxedNumber,
    ExactNumber,
    RealNumber,

    InexactNumber,
    SmallExactNumber,
    ComplexNumber,

    bigExpt,
    isSafeInteger,

    EXACT_ZERO
} from './index';

export class BigExactNumber implements Number {
    public readonly num: bigint;
    public readonly den: bigint;

    constructor(num: bigint, den: bigint = 1n) {
        if (typeof num === 'bigint' && typeof den === 'bigint') {
            // Only the numerator can be negative.
            if (den < 0) {
                num *= -1n;
                den *= -1n;
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

    private gcd(a: bigint, b: bigint): bigint {
        let t: bigint;
        while (b !== 0n) {
            t = a;
            a = b;
            b = t % b;
        }

        if (a < 0n) {
            return -1n * a;
        }

        return a;
    }

    public isInexact(): boolean {
        return false;
    }
    public isExact(): boolean {
        return true;
    }

    public toInexact(): InexactNumber {
        const result = Number(this.num) / Number(this.den);
        return new InexactNumber(result);
    }
    public toExact(): ExactNumber {
        return this;
    }
    public toSmallExact(): SmallExactNumber {
        return new SmallExactNumber(Number(this.num), Number(this.den));
    }
    public toComplex(): ComplexNumber {
        return new ComplexNumber(this, EXACT_ZERO);
    }
    public toFixnum(): JSInteger {
        return this.num / this.den;
    }

    public isInteger(): boolean {
        return this.den === 1n;
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
        return this.num === 0n;
    }
    public isNegativeZero(): boolean {
        return false;
    }
    public isPositive(): boolean {
        return this.num > 0n;
    }
    public isNegative(): boolean {
        return this.num < 0n;
    }
    public isEven(): boolean {
        return this.den === 1n && this.num % 2n === 0n;
    }
    public isFinite(): boolean {
        return true;
    }
    public isNaN(): boolean {
        return false;
    }

    public toString(): string {
        const numStr = this.num.toString().slice(0, -1);
        const denStr = this.den.toString().slice(0, -1);

        if (this.den === 1n) {
            return numStr;
        }

        return `${numStr}/${denStr}`;
    }
    public toSignedString(): string {
        if (this.isNegative()) {
            return this.toString();
        }
        return "+" + this.toString();
    }
    [Symbol.toPrimitive](hint: string): number | bigint | string {
        if (hint === 'string') {
            return this.toString();
        }

        if (this.den === 1n) {
            return this.num;
        }

        return Number(this.num) / Number(this.den);
    }

    public greaterThan(other: BoxedNumber): boolean {
        if (other instanceof InexactNumber) {
            if (other.isNaN()) {
                return false;
            } else if (!other.isFinite()) {
                return !other.isPositive();
            }
            return this.greaterThan(other.toExact());

        } else if (other instanceof SmallExactNumber) {
            return this.greaterThan(other.toBigExact());

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().greaterThan(other);

        } else {
            const thisVal = this.num * other.den;
            const otherVal = other.num * this.den;
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

        } else if (other instanceof SmallExactNumber) {
            return this.greaterThanOrEqual(other.toBigExact());

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().greaterThanOrEqual(other);

        } else {
            const thisVal = this.num * other.den;
            const otherVal = other.num * this.den;
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

        } else if (other instanceof SmallExactNumber) {
            return this.lessThan(other.toBigExact());

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().lessThan(other);

        } else {
            const thisVal = this.num * other.den;
            const otherVal = other.num * this.den;
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

        } else if (other instanceof SmallExactNumber) {
            return this.lessThanOrEqual(other.toBigExact());

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().lessThanOrEqual(other);

        } else {
            const thisVal = this.num * other.den;
            const otherVal = other.num * this.den;
            return thisVal <= otherVal;
        }
    }
    public equals(other: BoxedNumber): boolean {
        if (other instanceof InexactNumber) {
            if (!other.isFinite()) {
                return false;
            }
            return this.equals(other.toExact());

        } else if (other instanceof SmallExactNumber) {
            return this.equals(other.toBigExact());

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().equals(other);

        } else {
            const thisVal = this.num * other.den;
            const otherVal = other.num * this.den;
            return thisVal === otherVal;
        }
    }

    public add(other: RealNumber): RealNumber;
    public add(other: ComplexNumber): ComplexNumber;
    public add(other: BoxedNumber): BoxedNumber;
    public add(other: BoxedNumber): BoxedNumber {
        if (other instanceof InexactNumber) {
            return this.toInexact().add(other);

        } else if (other instanceof SmallExactNumber) {
            return this.add(other.toBigExact());

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().add(other);

        } else {
            const num = (this.num * other.den) + (other.num * this.den);
            const den = this.den * other.den;

            if (isSafeInteger(num) && isSafeInteger(den)) {
                return new SmallExactNumber(Number(num), Number(den));
            }

            return new BigExactNumber(num, den);
        }
    }
    public subtract(other: RealNumber): RealNumber;
    public subtract(other: ComplexNumber): ComplexNumber;
    public subtract(other: BoxedNumber): BoxedNumber;
    public subtract(other: BoxedNumber): BoxedNumber {
        if (other instanceof InexactNumber) {
            return this.toInexact().subtract(other);

        } else if (other instanceof SmallExactNumber) {
            return this.subtract(other.toBigExact());

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().subtract(other);

        } else {
            const num = (this.num * other.den) - (other.num * this.den);
            const den = this.den * other.den;

            if (isSafeInteger(num) && isSafeInteger(den)) {
                return new SmallExactNumber(Number(num), Number(den));
            }

            return new BigExactNumber(num, den);
        }
    }
    public multiply(other: RealNumber): RealNumber;
    public multiply(other: ComplexNumber): ComplexNumber;
    public multiply(other: BoxedNumber): BoxedNumber;
    public multiply(other: BoxedNumber): BoxedNumber {
        if ((other.isExact() && other.isZero()) || this.isZero()) {
            return EXACT_ZERO;
        }

        if (other instanceof InexactNumber) {
            return this.toInexact().multiply(other);

        } else if (other instanceof SmallExactNumber) {
            return this.multiply(other.toBigExact());

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().multiply(other);

        } else {
            const num = this.num * other.num;
            const den = this.den * other.den;

            if (isSafeInteger(num) && isSafeInteger(den)) {
                return new SmallExactNumber(Number(num), Number(den));
            }

            return new BigExactNumber(num, den);
        }
    }
    public divide(other: RealNumber): RealNumber;
    public divide(other: ComplexNumber): ComplexNumber;
    public divide(other: BoxedNumber): BoxedNumber;
    public divide(other: BoxedNumber): BoxedNumber {
        if (this.isZero()) {
            return EXACT_ZERO;
        }

        if (other instanceof InexactNumber) {
            return this.toInexact().divide(other);

        } else if (other instanceof SmallExactNumber) {
            return this.divide(other.toBigExact());

        } else if (other instanceof ComplexNumber) {
            return this.toComplex().divide(other);

        } else {
            const num = this.num * other.den;
            const den = this.den * other.num;

            if (isSafeInteger(num) && isSafeInteger(den)) {
                return new SmallExactNumber(Number(num), Number(den));
            }

            return new BigExactNumber(num, den);
        }
    }

    public numerator(): RealNumber {
        return new BigExactNumber(this.num);
    }
    public denominator(): RealNumber {
        return new BigExactNumber(this.den)
    }

    public integerSqrt(): BoxedNumber {
        return this.sqrt().floor();
    }
    public sqrt(): BoxedNumber {
        return this.toSmallExact().sqrt();
    }
    public abs(): RealNumber {
        if (this.isNegative()) {
            return new BigExactNumber(this.num * -1n, this.den);
        } else {
            return this;
        }
    }
    public floor(): RealNumber {
        if (this.den === 1n) {
            return this;
        } else {
            return new BigExactNumber(this.num / this.den);
        }
    }
    public ceiling(): RealNumber {
        if (this.den === 1n) {
            return this;
        } else {
            return new BigExactNumber((this.num / this.den) + 1n);
        }
    }
    public round(): RealNumber {
        if (this.den === 1n) {
            return this;
        } else {
            const floor = this.floor();
            const floordiff = this.subtract(floor).abs();

            const ceil = this.ceiling();
            const ceildiff = ceil.subtract(this).abs();

            if (ceildiff.greaterThanOrEqual(floordiff)) {
                return ceil;
            } else {
                return floor;
            }
        }
    }

    public conjugate(): BoxedNumber {
        return this;
    }
    public magnitude(): BoxedNumber {
        return this;
    }
    public realPart(): RealNumber {
        return this;
    }
    public imaginaryPart(): RealNumber {
        return EXACT_ZERO;
    }
    public angle(): BoxedNumber {
        return new BigExactNumber(0n);
    }

    public log(): BoxedNumber {
        if (this.isNegative()) {
            return this.toComplex().log();
        }
        return this.toInexact().log();
    }
    public expt(power: BoxedNumber): BoxedNumber {
        if (power instanceof ComplexNumber) {
            return this.toComplex().expt(power);
        }

        if (power.isExact() && power.isInteger() && !power.isNegative()) {
            const exp = BigInt(power.toFixnum());
            const num = bigExpt(this.num, exp);
            const den = bigExpt(this.den, exp);

            if (isSafeInteger(num) && isSafeInteger(den)) {
                return new SmallExactNumber(Number(num), Number(den));
            }

            return new BigExactNumber(num, den);
        }

        return this.toInexact().expt(power);
    }
    public exp(): BoxedNumber {
        return this.toSmallExact().exp();
    }

    public tan(): BoxedNumber {
        return this.toSmallExact().tan();
    }
    public cos(): BoxedNumber {
        return this.toSmallExact().cos();
    }
    public sin(): BoxedNumber {
        return this.toSmallExact().sin();
    }
    public atan(): BoxedNumber {
        return this.toSmallExact().atan();
    }
    public acos(): BoxedNumber {
        return this.toSmallExact().acos();
    }
    public asin(): BoxedNumber {
        return this.toSmallExact().asin();
    }
}
