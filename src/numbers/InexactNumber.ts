import {
    Number,
    BoxedNumber,
    ExactNumber,
    RealNumber,
    isExactReal,

    SmallExactNumber,
    ComplexNumber,

    EXACT_ZERO,
    INEXACT_ZERO,
    INEXACT_NEG_ONE,
} from './index';

export class InexactNumber implements Number {
    public readonly num: number;

    constructor(num: number) {
        this.num = num;

        // Make it immutable
        Object.freeze(this);
    }

    public isInexact(): boolean {
        return true;
    }
    public isExact(): boolean {
        return false;
    }

    public toInexact(): InexactNumber {
        return this;
    }
    public toExact(): ExactNumber {
        if (!this.isFinite()) {
            throw new Error(`There is no exact representation of ${this}`);
        }
        const stringRep = this.num.toString();
        const match = stringRep.match(/^(.*)\.(.*)$/);
        if (match) {
            const tenToDecimalPlaces = Math.pow(10, match[2].length);
            return new SmallExactNumber(
                Math.round(this.num * tenToDecimalPlaces),
                tenToDecimalPlaces
            );
        } else {
            return new SmallExactNumber(this.num, 1);
        }
    }
    public toComplex(): ComplexNumber {
        return new ComplexNumber(this, EXACT_ZERO);
    }
    public toFixnum(): number {
        return Math.floor(this.num);
    }

    public isInteger(): boolean {
        return Number.isInteger(this.num);
    }
    public isRational(): boolean {
        return this.isFinite();
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
        return Object.is(this.num, -0);
    }
    public isPositive(): boolean {
        return this.num > 0;
    }
    public isNegative(): boolean {
        return this.num < 0;
    }
    public isEven(): boolean {
        return this.num % 2 === 0;
    }
    public isFinite(): boolean {
        return Number.isFinite(this.num);
    }
    public isNaN(): boolean {
        return Number.isNaN(this.num);
    }

    public toString(): string {
        if (Number.isNaN(this.num)) {
            return "+nan.0";
        }

        if (this.num === Infinity) {
            return "+inf.0";
        } else if (this.num === -Infinity) {
            return "-inf.0";
        }

        if (Number.isInteger(this.num)) {
            return this.num.toString() + ".0";
        }

        return this.num.toString();
    }
    public toSignedString(): string {
        if (!Number.isFinite(this.num)) {
            return this.toString();
        }

        if (this.num >= 0) {
            return "+" + this.toString();
        }

        return this.toString();
    }
    public [Symbol.toPrimitive](hint: string): number | string {
        if (hint === 'string') {
            return this.toString();
        }

        return this.num;
    }

    public greaterThan(other: BoxedNumber): boolean {
        if (other instanceof ComplexNumber) {
            throw new TypeError("Not defined for complex numbers");
        }
        if (other.isExact()) {
            if (this.isNaN()) {
                return false;
            } else if (!this.isFinite()) {
                return this.isPositive();
            }
            return this.toExact().greaterThan(other);
        }
        return this.num > other.num;
    }
    public greaterThanOrEqual(other: BoxedNumber): boolean {
        if (other instanceof ComplexNumber) {
            throw new TypeError("Not defined for complex numbers");
        }
        if (other.isExact()) {
            if (this.isNaN()) {
                return false;
            } else if (!this.isFinite()) {
                return this.isPositive();
            }
            return this.toExact().greaterThanOrEqual(other);
        }
        return this.num >= other.num;
    }
    public lessThan(other: BoxedNumber): boolean {
        if (other instanceof ComplexNumber) {
            throw new TypeError("Not defined for complex numbers");
        }
        if (other.isExact()) {
            if (this.isNaN()) {
                return false;
            } else if (!this.isFinite()) {
                return !this.isPositive();
            }
            return this.toExact().lessThan(other);
        }
        return this.num < other.num;
    }
    public lessThanOrEqual(other: BoxedNumber): boolean {
        if (other instanceof ComplexNumber) {
            throw new TypeError("Not defined for complex numbers");
        }
        if (other.isExact()) {
            if (this.isNaN()) {
                return false;
            } else if (!this.isFinite()) {
                return !this.isPositive();
            }
            return this.toExact().lessThanOrEqual(other);
        }
        return this.num <= other.num;
    }
    public equals(other: BoxedNumber): boolean {
        if (this.isNaN()) {
            return false;
        }
        if (other instanceof ComplexNumber) {
            return this.toComplex().equals(other);
        }
        if (!this.isFinite()) {
            return !(other.isExact()) && this.num === other.num;
        }
        if (other.isExact()) {
            return this.toExact().equals(other);
        }
        return this.num === other.num;
    }

    public add(other: RealNumber): RealNumber;
    public add(other: ComplexNumber): ComplexNumber;
    public add(other: BoxedNumber): BoxedNumber;
    public add(other: BoxedNumber): BoxedNumber {
        if (other instanceof ComplexNumber) {
            return this.toComplex().add(other);
        }
        if (isExactReal(other)) {
            return this.add(other.toInexact());
        }
        return new InexactNumber(this.num + other.num);
    }
    public subtract(other: RealNumber): RealNumber;
    public subtract(other: ComplexNumber): ComplexNumber;
    public subtract(other: BoxedNumber): BoxedNumber;
    public subtract(other: BoxedNumber): BoxedNumber {
        if (other instanceof ComplexNumber) {
            return this.toComplex().subtract(other);
        }
        if (isExactReal(other)) {
            return this.subtract(other.toInexact());
        }
        return new InexactNumber(this.num - other.num);
    }
    public multiply(other: RealNumber): RealNumber;
    public multiply(other: ComplexNumber): ComplexNumber;
    public multiply(other: BoxedNumber): BoxedNumber;
    public multiply(other: BoxedNumber): BoxedNumber {
        if (other instanceof ComplexNumber) {
            return this.toComplex().multiply(other);
        }
        if (isExactReal(other)) {
            if (other.isZero()) {
                return EXACT_ZERO;
            }
            return this.multiply(other.toInexact());
        }
        return new InexactNumber(this.num * other.num);
    }
    public divide(other: RealNumber): RealNumber;
    public divide(other: ComplexNumber): ComplexNumber;
    public divide(other: BoxedNumber): BoxedNumber;
    public divide(other: BoxedNumber): BoxedNumber {
        if (other instanceof ComplexNumber) {
            return this.toComplex().divide(other);
        }
        if (this.isZero()) {
            return this;
        }
        if (isExactReal(other)) {
            return this.divide(other.toInexact());
        }
        return new InexactNumber(this.num / other.num);
    }

    public numerator(): RealNumber {
        return this.toExact().numerator().toInexact();
    }
    public denominator(): RealNumber {
        return this.toExact().denominator().toInexact();
    }

    public integerSqrt(): RealNumber {
        return new InexactNumber(Math.floor(Math.sqrt(this.num)));
    }
    public sqrt(): BoxedNumber {
        if (this.isNegative()) {
            const result = this.multiply(INEXACT_NEG_ONE).sqrt() as RealNumber;
            return new ComplexNumber(INEXACT_ZERO, result);
        }
        return new InexactNumber(Math.sqrt(this.num));
    }
    public abs(): RealNumber {
        return new InexactNumber(Math.abs(this.num));
    }
    public floor(): RealNumber {
        return new InexactNumber(Math.floor(this.num));
    }
    public ceiling(): RealNumber {
        return new InexactNumber(Math.ceil(this.num));
    }
    public round(): RealNumber {
        return new InexactNumber(Math.round(this.num));
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
        if (0 === this.num)
            return EXACT_ZERO;
        if (this.num > 0)
            return EXACT_ZERO;
        else
            return new InexactNumber(Math.PI);
    }

    public log(): BoxedNumber {
        if (this.isNegative()) {
            return this.toComplex().log();
        }
        return new InexactNumber(Math.log(this.num));
    }
    public expt(power: BoxedNumber): BoxedNumber {
        if (power instanceof ComplexNumber) {
            return this.toComplex().expt(power);
        }
        if (isExactReal(power)) {
            return this.expt(power.toInexact());
        }
        return new InexactNumber(Math.pow(this.num, power.num));
    }
    public exp(): BoxedNumber {
        return new InexactNumber(Math.exp(this.num))
    }

    public tan(): BoxedNumber {
        return new InexactNumber(Math.tan(this.num));
    }
    public cos(): BoxedNumber {
        return new InexactNumber(Math.cos(this.num));
    }
    public sin(): BoxedNumber {
        return new InexactNumber(Math.sin(this.num));
    }
    public atan(): BoxedNumber {
        return new InexactNumber(Math.atan(this.num));
    }
    public acos(): BoxedNumber {
        if (-1 <= this.num && this.num <= 1) {
            return new InexactNumber(Math.acos(this.num));
        }
        return this.toComplex().acos();
    }
    public asin(): BoxedNumber {
        if (-1 <= this.num && this.num <= 1) {
            return new InexactNumber(Math.asin(this.num));
        }
        return this.toComplex().asin();
    }
}
