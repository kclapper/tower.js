import {
    JSInteger,
} from "./types";
import {
    bigExpt,
    isSafeInteger
} from './util';

export type Value = ExactValue | InexactValue;

abstract class AbstractValue {
    abstract isFinite(): boolean;
    abstract isInexact(): boolean;
    abstract isExact(): boolean;
    abstract isInteger(): boolean;

    abstract toInexact(): InexactValue;
    abstract toExact(): ExactValue;
    abstract toFixnum(): JSInteger;

    abstract toString(): string;
    abstract toSignedString(): string;
    abstract [Symbol.toPrimitive](hint: string): number | bigint | string;

    abstract greaterThan(other: Value): boolean;
    abstract greaterThanOrEqual(other: Value): boolean;
    abstract lessThan(other: Value): boolean;
    abstract lessThanOrEqual(other: Value): boolean;
    abstract equals(other: Value): boolean;

    abstract isZero(): boolean;
    abstract isNegativeZero(): boolean;
    abstract isPositive(): boolean;
    abstract isNegative(): boolean;
    abstract isEven(): boolean;
    abstract isNaN(): boolean;

    abstract add(other: Value): Value;
    abstract subtract(other: Value): Value;
    abstract multiply(other: Value): Value;
    abstract divide(other: Value): Value;

    abstract numerator(): Value;
    abstract denominator(): Value;

    abstract integerSqrt(): Value;
    abstract sqrt(): Value;
    abstract abs(): Value;
    abstract floor(): Value;
    abstract ceiling(): Value;
    abstract round(): Value;

    abstract log(): Value;
    abstract expt(power: Value): Value;
    abstract exp(): Value;

    abstract angle(): Value;
    abstract tan(): Value;
    abstract cos(): Value;
    abstract sin(): Value;
    abstract atan(): Value;
    abstract acos(): Value;
    abstract asin(): Value;
}

export class InexactValue extends AbstractValue {
    public num: number;

    constructor(num: number) {
        super();
        this.num = num;

        // Make it immutable
        Object.freeze(this);
    }

    isFinite(): boolean {
        return Number.isFinite(this.num);
    }
    isInexact(): boolean {
        return true;
    }
    isExact(): boolean {
        return false;
    }
    isInteger(): boolean {
        return Number.isInteger(this.num);
    }

    toInexact(): InexactValue {
        return this;
    }
    toExact(): ExactValue {
        if (!this.isFinite()) {
            throw new Error(`There is no exact representation of ${this}`);
        }
        const stringRep = this.num.toString();
        const match = stringRep.match(/^(.*)\.(.*)$/);
        if (match) {
            const tenToDecimalPlaces = Math.pow(10, match[2].length);
            return ExactValue.makeInstance(
                Math.round(this.num * tenToDecimalPlaces),
                tenToDecimalPlaces
            );
        } else {
            return ExactValue.makeInstance(this.num, 1);
        }
    }
    toFixnum(): JSInteger {
        return Math.floor(this.num);
    }

    toString(): string {
        if (Number.isInteger(this.num)) {
            return this.num.toString() + ".0";
        }
        return this.num.toString();
    }
    toSignedString(): string {
        if (this.num >= 0) {
            return "+" + this.toString();
        }
        return this.toString();
    }
    [Symbol.toPrimitive](hint: string): number | string {
        if (hint === 'string') {
            return this.toString();
        }

        return this.num;
    }

    greaterThan(other: Value): boolean {
        if (other instanceof ExactValue) {
            if (this.isNaN()) {
                return false;
            } else if (!this.isFinite()) {
                return this.isPositive();
            }
            return this.toExact().greaterThan(other);
        }
        return this.num > other.num;
    }
    greaterThanOrEqual(other: Value): boolean {
        if (other instanceof ExactValue) {
            if (this.isNaN()) {
                return false;
            } else if (!this.isFinite()) {
                return this.isPositive();
            }
            return this.toExact().greaterThanOrEqual(other);
        }
        return this.num >= other.num;
    }
    lessThan(other: Value): boolean {
        if (other instanceof ExactValue) {
            if (this.isNaN()) {
                return false;
            } else if (!this.isFinite()) {
                return !this.isPositive();
            }
            return this.toExact().lessThan(other);
        }
        return this.num < other.num;
    }
    lessThanOrEqual(other: Value): boolean {
        if (other instanceof ExactValue) {
            if (this.isNaN()) {
                return false;
            } else if (!this.isFinite()) {
                return !this.isPositive();
            }
            return this.toExact().lessThanOrEqual(other);
        }
        return this.num <= other.num;
    }
    equals(other: Value): boolean {
        if (this.isNaN()) {
            return false;
        }
        if (!this.isFinite()) {
            return !(other instanceof ExactValue) && this.num === other.num;
        }
        if (other instanceof ExactValue) {
            return this.toExact().equals(other);
        }
        return this.num === other.num;
    }

    isZero(): boolean {
        return this.num === 0;
    }
    isNegativeZero(): boolean {
        return Object.is(this.num, -0);
    }
    isPositive(): boolean {
        return this.num > 0;
    }
    isNegative(): boolean {
        return this.num < 0;
    }
    isEven(): boolean {
        return this.num % 2 === 0;
    }
    isNaN(): boolean {
        return Number.isNaN(this.num);
    }

    add(other: Value): Value {
        if (other instanceof ExactValue) {
            return this.add(other.toInexact());
        }
        return new InexactValue(this.num + other.num);
    }
    subtract(other: Value): Value {
        if (other instanceof ExactValue) {
            return this.subtract(other.toInexact());
        }
        return new InexactValue(this.num - other.num);
    }
    multiply(other: Value): Value {
        if (other instanceof ExactValue) {
            if (other.isZero()) {
                return ZERO_VAL;
            }
            return this.multiply(other.toInexact());
        }
        return new InexactValue(this.num * other.num);
    }
    divide(other: Value): Value {
        if (this.isZero()) {
            return this;
        }
        if (other instanceof ExactValue) {
            return this.divide(other.toInexact());
        }
        return new InexactValue(this.num / other.num);
    }

    numerator(): Value {
        return this.toExact().numerator().toInexact();
    }
    denominator(): Value {
        return this.toExact().denominator().toInexact();
    }

    integerSqrt(): Value {
        return new InexactValue(Math.floor(Math.sqrt(this.num)));
    }
    sqrt(): Value {
        return new InexactValue(Math.sqrt(this.num));
    }
    abs(): Value {
        return new InexactValue(Math.abs(this.num));
    }
    floor(): Value {
        return new InexactValue(Math.floor(this.num));
    }
    ceiling(): Value {
        return new InexactValue(Math.ceil(this.num));
    }
    round(): Value {
        return new InexactValue(Math.round(this.num));
    }

    log(): Value {
        return new InexactValue(Math.log(this.num));
    }
    expt(power: Value): Value {
        if (power instanceof ExactValue) {
            return this.expt(power.toInexact());
        }
        return new InexactValue(Math.pow(this.num, power.num));
    }
    exp(): Value {
        return new InexactValue(Math.exp(this.num))
    }

    angle(): Value {
        if (0 === this.num)
            return EXACT_ZERO;
        if (this.num > 0)
            return EXACT_ZERO;
        else
            return new InexactValue(Math.PI);
    }
    tan(): Value {
        return new InexactValue(Math.tan(this.num));
    }
    cos(): Value {
        return new InexactValue(Math.cos(this.num));
    }
    sin(): Value {
        return new InexactValue(Math.sin(this.num));
    }
    atan(): Value {
        return new InexactValue(Math.atan(this.num));
    }
    acos(): Value {
        return new InexactValue(Math.acos(this.num));
    }
    asin(): Value {
        return new InexactValue(Math.asin(this.num));
    }
}

export abstract class ExactValue extends AbstractValue {
    abstract readonly num: JSInteger;
    abstract readonly den: JSInteger;

    static makeInstance(num: number, den: number): ExactValue;
    static makeInstance(num: bigint, den: bigint): ExactValue;
    static makeInstance(num: JSInteger, den: JSInteger): ExactValue {
       if (typeof num === 'bigint' && typeof den === 'bigint') {
           return new BigExactValue(num, den);
       } else if (typeof num === 'number' && typeof den === 'number') {
           return new SmallExactValue(num, den);
       } else {
           throw new TypeError(`Numberator and denominator types must match, given ${typeof num} and ${typeof den}`)
       }
    }
}

export class SmallExactValue extends ExactValue {
    public readonly num: number;
    public readonly den: number;

    constructor(num: number, den: number = 1) {
        super();
        if (!Number.isInteger(num) && !Number.isInteger(den)) {
            throw new TypeError("Exact number can only be constructed from integers.")
        }

        if (typeof num === 'number' && typeof den === 'number') {
            // Only the numerator can be negative.
            if (den < 0) {
                num *= -1;
                den *= -1;
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
        return a;
    }

    isFinite(): boolean {
        return true;
    }
    isInexact(): boolean {
        return false;
    }
    isExact(): boolean {
        return true;
    }
    isInteger(): boolean {
        return this.den === 1;
    }

    toInexact(): InexactValue {
        const result = this.num / this.den;
        return new InexactValue(result);
    }
    toExact(): ExactValue {
        return this;
    }
    toBigExact(): BigExactValue {
        return new BigExactValue(BigInt(this.num), BigInt(this.den));
    }
    toFixnum(): JSInteger {
        return Math.floor(this.num / this.den);
    }

    toString(): string {
        if (this.den === 1) {
            return this.num.toString();
        }

        return `${this.num}/${this.den}`;
    }
    toSignedString(): string {
        if (this.isPositive() || this.isZero()) {
            return "+" + this.toString();
        }
        return this.toString();
    }
    [Symbol.toPrimitive](hint: string): number | string {
        if (hint === 'string') {
            return this.toString();
        }

        return this.num / this.den;
    }


    greaterThan(other: Value): boolean {
        if (other instanceof InexactValue) {
            if (other.isNaN()) {
                return false;
            } else if (!other.isFinite()) {
                return !other.isPositive();
            }
            return this.greaterThan(other.toExact());

        } else if (other instanceof BigExactValue) {
            return this.toBigExact().greaterThan(other);

        } else {
            const thisVal = this.num * (other.den as number);
            const otherVal = (other.num as number) * this.den;
            return thisVal > otherVal;
        }
    }
    greaterThanOrEqual(other: Value): boolean {
        if (other instanceof InexactValue) {
            if (other.isNaN()) {
                return false;
            } else if (!other.isFinite()) {
                return !other.isPositive();
            }
            return this.greaterThanOrEqual(other.toExact());

        } else if (other instanceof BigExactValue) {
            return this.toBigExact().greaterThanOrEqual(other);

        } else {
            const thisVal = this.num * (other.den as number);
            const otherVal = (other.num as number) * this.den;
            return thisVal >= otherVal;
        }
    }
    lessThan(other: Value): boolean {
        if (other instanceof InexactValue) {
            if (other.isNaN()) {
                return false;
            } else if (!other.isFinite()) {
                return other.isPositive();
            }
            return this.lessThan(other.toExact());

        } else if (other instanceof BigExactValue) {
            return this.toBigExact().lessThan(other);

        } else {
            const thisVal = this.num * (other.den as number);
            const otherVal = (other.num as number) * this.den;
            return thisVal < otherVal;
        }
    }
    lessThanOrEqual(other: Value): boolean {
        if (other instanceof InexactValue) {
            if (other.isNaN()) {
                return false;
            } else if (!other.isFinite()) {
                return other.isPositive();
            }
            return this.lessThanOrEqual(other.toExact());

        } else if (other instanceof BigExactValue) {
            return this.toBigExact().lessThanOrEqual(other);

        } else {
            const thisVal = this.num * (other.den as number);
            const otherVal = (other.num as number) * this.den;
            return thisVal <= otherVal;
        }
    }
    equals(other: Value): boolean {
        if (other instanceof InexactValue) {
            if (!other.isFinite()) {
                return false;
            }
            return this.equals(other.toExact());

        } else if (other instanceof BigExactValue) {
            return this.toBigExact().equals(other);

        } else {
            const thisVal = this.num * (other.den as number);
            const otherVal = (other.num as number) * this.den;
            return thisVal === otherVal;
        }
    }

    isZero(): boolean {
        return this.num === 0;
    }
    isNegativeZero(): boolean {
        return Object.is(this.num, -0);
    }
    isPositive(): boolean {
        return this.num > 0;
    }
    isNegative(): boolean {
        return this.num < 0;
    }
    isEven(): boolean {
        return this.den === 1 && this.num % 2 === 0;
    }
    isNaN(): boolean {
        return false;
    }

    add(other: Value): Value {
        if (other instanceof InexactValue) {
            return this.toInexact().add(other);
        } else if (other instanceof BigExactValue) {
            return this.toBigExact().add(other);
        } else if (other instanceof SmallExactValue) {
            const num = (this.num * other.den) + (other.num * this.den);
            const den = this.den * other.den;

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().add(other.toBigExact());
            }

            return new SmallExactValue(num, den);
        } else {
            throw new Error(`Cannot add ${this} to value ${other}`);
        }
    }
    subtract(other: Value): Value {
        if (other instanceof InexactValue) {
            return this.toInexact().subtract(other);
        } else if (other instanceof BigExactValue) {
            return this.toBigExact().subtract(other);
        } else if (other instanceof SmallExactValue) {
            const num = (this.num * other.den) - (other.num * this.den);
            const den = this.den * other.den;

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().subtract(other.toBigExact());
            }

            return new SmallExactValue(num, den);
        } else {
            throw new Error(`Cannot subtract ${this} and ${other}`);
        }
    }
    multiply(other: Value): Value {
        if (this.isZero() || (other.isExact() && other.isZero())) {
            return ZERO_VAL;
        }

        if (other instanceof InexactValue) {
            return this.toInexact().multiply(other);
        } else if (other instanceof BigExactValue) {
            return this.toBigExact().multiply(other);
        } else if (other instanceof SmallExactValue) {
            const num = this.num * other.num;
            const den = this.den * other.den;

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().multiply(other.toBigExact());
            }

            return new SmallExactValue(num, den);
        } else {
            throw new Error(`Cannot multiply ${this} and ${other}`);
        }
    }
    divide(other: Value): Value {
        if (this.isZero()) {
            return this;
        }

        if (other instanceof InexactValue) {
            return this.toInexact().divide(other);
        } else if (other instanceof BigExactValue) {
            return this.toBigExact().divide(other);
        } else if (other.isZero()) {
            throw new Error("/: division by zero" + this + other);
        } else if (other instanceof SmallExactValue) {
            const num = this.num * other.den;
            const den = this.den * other.num;

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().divide(other.toBigExact());
            }

            return new SmallExactValue(num, den);
        } else {
            throw new Error(`Cannot divide ${this} and ${other}`);
        }
    }

    numerator(): Value {
        return new SmallExactValue(this.num);
    }
    denominator(): Value {
        return new SmallExactValue(this.den);
    }

    integerSqrt(): Value {
        return this.sqrt().floor();
    }
    sqrt(): Value {
        if (this.isNegative()) {
            throw new Error("Cannot take square root of negative number " + this);
        }

        const num = Math.sqrt(this.num);
        const den = Math.sqrt(this.den);

        if (num === Math.floor(num) && den === Math.floor(den)) {
           return new SmallExactValue(num, den);
        } else {
            return new InexactValue(num / den);
        }
    }
    abs(): Value {
        if (this.isNegative()) {
            return new SmallExactValue(-1 * this.num, this.den);
        } else {
            return this;
        }
    }
    floor(): Value {
        if (this.den === 1) {
            return this;
        } else {
            return new SmallExactValue(Math.floor(this.num / this.den));
        }
    }
    ceiling(): Value {
        if (this.den === 1) {
            return this;
        } else {
            return new SmallExactValue(Math.ceil(this.num / this.den));
        }
    }
    round(): Value {
        if (this.den === 1) {
            return this;
        } else {
            return new SmallExactValue(Math.round(this.num / this.den));
        }
    }

    log(): Value {
        return new InexactValue(Math.log(this.num / this.den));
    }
    expt(power: Value): Value {
        power = power.toInexact();
        if (power.isInteger()) {
            const exp = power.num;
            const num = Math.pow(this.num, exp);
            const den = Math.pow(this.den, exp);

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().expt(power);
            }

            return new SmallExactValue(num, den);
        } else {
            return this.toInexact().expt(power);
        }
    }
    exp(): Value {
        return new InexactValue(Math.exp(this.num / this.den));
    }

    angle(): Value {
       if (this.isNegative()) {
           return new InexactValue(Math.PI);
       } else {
           return new SmallExactValue(0);
       }
    }
    tan(): Value {
        return new InexactValue(Math.tan(this.num / this.den));
    }
    cos(): Value {
        return new InexactValue(Math.cos(this.num / this.den));
    }
    sin(): Value {
        return new InexactValue(Math.sin(this.num / this.den));
    }
    atan(): Value {
        return new InexactValue(Math.atan(this.num / this.den));
    }
    acos(): Value {
        return new InexactValue(Math.acos(this.num / this.den));
    }
    asin(): Value {
        return new InexactValue(Math.asin(this.num / this.den));
    }
}

export class BigExactValue extends ExactValue {
    public readonly num: bigint;
    public readonly den: bigint;

    constructor(num: bigint, den: bigint = 1n) {
        super();
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
        let t;
        while (b !== 0n) {
            t = a;
            a = b;
            b = t % b;
        }
        return a;
    }

    private bigintAbs(n: bigint): bigint {
        if (n < 0n) {
            return -1n * n;
        }
        return n;
    }

    isFinite(): boolean {
        return true;
    }
    isInexact(): boolean {
        return false;
    }
    isExact(): boolean {
        return true;
    }
    isInteger(): boolean {
        return this.den === 1n;
    }

    toInexact(): InexactValue {
        const result = Number(this.num) / Number(this.den);
        return new InexactValue(result);
    }
    toExact(): ExactValue {
        return this;
    }
    toSmallExact(): SmallExactValue {
        return new SmallExactValue(Number(this.num), Number(this.den));
    }
    toFixnum(): JSInteger {
        return this.num / this.den;
    }

    toString(): string {
        const numStr = this.num.toString().slice(0, -1);
        const denStr = this.den.toString().slice(0, -1);

        if (this.den === 1n) {
            return numStr;
        }

        return `${numStr}/${denStr}`;
    }
    toSignedString(): string {
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

    greaterThan(other: Value): boolean {
        if (other instanceof InexactValue) {
            if (other.isNaN()) {
                return false;
            } else if (!other.isFinite()) {
                return !other.isPositive();
            }
            return this.greaterThan(other.toExact());

        } else if (other instanceof SmallExactValue) {
            return this.greaterThan(other.toBigExact());

        } else if (other instanceof BigExactValue) {
            const thisVal = this.num * other.den;
            const otherVal = other.num * this.den;
            return thisVal > otherVal;

        } else {
            throw new Error(`Cannot compare ${this} and ${other}`);
        }
    }
    greaterThanOrEqual(other: Value): boolean {
        if (other instanceof InexactValue) {
            if (other.isNaN()) {
                return false;
            } else if (!other.isFinite()) {
                return !other.isPositive();
            }
            return this.greaterThanOrEqual(other.toExact());

        } else if (other instanceof SmallExactValue) {
            return this.greaterThanOrEqual(other.toBigExact());

        } else if (other instanceof BigExactValue) {
            const thisVal = this.num * other.den;
            const otherVal = other.num * this.den;
            return thisVal >= otherVal;

        } else {
            throw new Error(`Cannot compare ${this} and ${other}`);
        }
    }
    lessThan(other: Value): boolean {
        if (other instanceof InexactValue) {
            if (other.isNaN()) {
                return false;
            } else if (!other.isFinite()) {
                return other.isPositive();
            }
            return this.lessThan(other.toExact());

        } else if (other instanceof SmallExactValue) {
            return this.lessThan(other.toBigExact());

        } else if (other instanceof BigExactValue) {
            const thisVal = this.num * other.den;
            const otherVal = other.num * this.den;
            return thisVal < otherVal;

        } else {
            throw new Error(`Cannot compare ${this} and ${other}`);
        }
    }
    lessThanOrEqual(other: Value): boolean {
        if (other instanceof InexactValue) {
            if (other.isNaN()) {
                return false;
            } else if (!other.isFinite()) {
                return other.isPositive();
            }
            return this.lessThanOrEqual(other.toExact());

        } else if (other instanceof SmallExactValue) {
            return this.lessThanOrEqual(other.toBigExact());

        } else if (other instanceof BigExactValue) {
            const thisVal = this.num * other.den;
            const otherVal = other.num * this.den;
            return thisVal <= otherVal;

        } else {
            throw new Error(`Cannot compare ${this} and ${other}`);
        }
    }
    equals(other: Value): boolean {
        if (other instanceof InexactValue) {
            if (!other.isFinite()) {
                return false;
            }
            return this.equals(other.toExact());

        } else if (other instanceof SmallExactValue) {
            return this.equals(other.toBigExact());

        } else if (other instanceof BigExactValue) {
            const thisVal = this.num * other.den;
            const otherVal = other.num * this.den;
            return thisVal === otherVal;

        } else {
            throw new Error(`Cannot compare ${this} and ${other}`);
        }
    }

    isZero(): boolean {
        return this.num === 0n;
    }
    isNegativeZero(): boolean {
        return false;
    }
    isPositive(): boolean {
        return this.num > 0n;
    }
    isNegative(): boolean {
        return this.num < 0n;
    }
    isEven(): boolean {
        return this.den === 1n && this.num % 2n === 0n;
    }
    isNaN(): boolean {
        return false;
    }

    add(other: Value): Value {
        if (other instanceof InexactValue) {
            return this.toInexact().add(other);
        } else if (other instanceof SmallExactValue) {
            return this.add(other.toBigExact());
        } else if (other instanceof BigExactValue) {
            const num = (this.num * other.den) + (other.num * this.den);
            const den = this.den * other.den;

            if (isSafeInteger(num) && isSafeInteger(den)) {
                return new SmallExactValue(Number(num), Number(den));
            }

            return new BigExactValue(num, den);
        } else {
            throw new Error(`Cannot add ${this} and ${other}`);
        }
    }
    subtract(other: Value): Value {
        if (other instanceof InexactValue) {
            return this.toInexact().subtract(other);
        } else if (other instanceof SmallExactValue) {
            return this.subtract(other.toBigExact());
        } else if (other instanceof BigExactValue) {
            const num = (this.num * other.den) - (other.num * this.den);
            const den = this.den * other.den;

            if (isSafeInteger(num) && isSafeInteger(den)) {
                return new SmallExactValue(Number(num), Number(den));
            }

            return new BigExactValue(num, den);
        } else {
            throw new Error(`Cannot subtract ${this} and ${other}`);
        }
    }
    multiply(other: Value): Value {
        if ((other.isExact() && other.isZero()) || this.isZero()) {
            return ZERO_VAL;
        }

        if (other instanceof InexactValue) {
            return this.toInexact().multiply(other);
        } else if (other instanceof SmallExactValue) {
            return this.multiply(other.toBigExact());
        } else if (other instanceof BigExactValue) {
            const num = this.num * other.num;
            const den = this.den * other.den;

            if (isSafeInteger(num) && isSafeInteger(den)) {
                return new SmallExactValue(Number(num), Number(den));
            }

            return new BigExactValue(num, den);
        } else {
            throw new Error(`Cannot multiply ${this} and ${other}`);
        }
    }
    divide(other: Value): Value {
        if (this.isZero()) {
            return ZERO_VAL;
        }

        if (other instanceof InexactValue) {
            return this.toInexact().divide(other);
        } else if (other instanceof SmallExactValue) {
            return this.divide(other.toBigExact());
        } else if (other instanceof BigExactValue) {
            const num = this.num * other.den;
            const den = this.den * other.num;

            if (isSafeInteger(num) && isSafeInteger(den)) {
                return new SmallExactValue(Number(num), Number(den));
            }

            return new BigExactValue(num, den);
        } else {
            throw new Error(`Cannot divide ${this} and ${other}`);
        }
    }

    numerator(): Value {
        return new BigExactValue(this.num);
    }
    denominator(): Value {
        return new BigExactValue(this.den)
    }

    integerSqrt(): Value {
        return this.sqrt().floor();
    }
    sqrt(): Value {
        return this.toSmallExact().sqrt();
    }
    abs(): Value {
        if (this.isNegative()) {
            return new BigExactValue(this.num * -1n, this.den);
        } else {
            return this;
        }
    }
    floor(): Value {
        if (this.den === 1n) {
            return this;
        } else {
            return new BigExactValue(this.num / this.den);
        }
    }
    ceiling(): Value {
        if (this.den === 1n) {
            return this;
        } else {
            return new BigExactValue((this.num / this.den) + 1n);
        }
    }
    round(): Value {
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

    log(): Value {
        return this.toSmallExact().log();
    }
    expt(power: Value): Value {
        power = power.toInexact();
        if (power.isInteger()) {
            const exp = BigInt(power.num);
            const num = bigExpt(this.num, exp);
            const den = bigExpt(this.den, exp);
            return new BigExactValue(num, den);
        }
        return this.toSmallExact().expt(power);
    }
    exp(): Value {
        return this.toSmallExact().exp();
    }

    angle(): Value {
        return new BigExactValue(0n);
    }
    tan(): Value {
        return this.toSmallExact().tan();
    }
    cos(): Value {
        return this.toSmallExact().cos();
    }
    sin(): Value {
        return this.toSmallExact().sin();
    }
    atan(): Value {
        return this.toSmallExact().atan();
    }
    acos(): Value {
        return this.toSmallExact().acos();
    }
    asin(): Value {
        return this.toSmallExact().asin();
    }
}

const EXACT_ZERO = new SmallExactValue(0);


/////////////////////// Constants ///////////////////////

// If you add any constants here, make sure to re-export them from
// the constants.ts file as well.

export const ZERO_VAL = new SmallExactValue(0);
export const ONE_VAL = new SmallExactValue(1);
export const TWO_VAL = new SmallExactValue(2);

export const NEG_ONE_VAL = new SmallExactValue(-1);

export const PI_VAL = new InexactValue(Math.PI);

export const INF_VAL = new InexactValue(Number.POSITIVE_INFINITY);
export const NEG_INF_VAL = new InexactValue(Number.NEGATIVE_INFINITY);
export const NAN_VAL = new InexactValue(Number.NaN);
