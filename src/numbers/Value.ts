import {
    isSafeInteger
} from '../util';
import {
    JSInteger,
} from "./main";

export type Value = ExactNumber | InexactNumber;

abstract class AbstractNumber {
    abstract isFinite(): boolean;
    abstract isInexact(): boolean;
    abstract isExact(): boolean;
    abstract isInteger(): boolean;

    abstract toInexact(): InexactNumber;
    abstract toExact(): ExactNumber;
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
    abstract atan(): Value;
    abstract cos(): Value;
    abstract sin(): Value;
    abstract acos(): Value;
    abstract asin(): Value;
}

export class InexactNumber extends AbstractNumber {
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

    toInexact(): InexactNumber {
        return this;
    }
    toExact(): ExactNumber {
        let stringRep = this.num.toString();
        let match = stringRep.match(/^(.*)\.(.*)$/);
        if (match) {
            let intPart = parseInt(match[1]);
            let fracPart = parseInt(match[2]);
            let tenToDecimalPlaces = Math.pow(10, match[2].length);
            return ExactNumber.makeInstance(
                Math.round(this.num * tenToDecimalPlaces),
                tenToDecimalPlaces
            );
        } else {
            return ExactNumber.makeInstance(this.num, 1);
        }
    }
    toFixnum(): JSInteger {
        return Math.floor(this.num);
    }

    toString(): string {
        return this.num.toString();
    }
    toSignedString(): string {
        if (this.num >= 0) {
            return "+" + this.num.toString();
        }
        return this.num.toString();
    }
    [Symbol.toPrimitive](hint: string): number | string {
        if (hint === 'string') {
            return this.toString();
        }

        return this.num;
    }

    greaterThan(other: Value): boolean {
        if (other instanceof ExactNumber) {
            return this.toExact().greaterThan(other);
        }
        return this.num > other.num;
    }
    greaterThanOrEqual(other: Value): boolean {
        if (other instanceof ExactNumber) {
            return this.toExact().greaterThanOrEqual(other);
        }
        return this.num >= other.num;
    }
    lessThan(other: Value): boolean {
        if (other instanceof ExactNumber) {
            return this.toExact().lessThan(other);
        }
        return this.num < other.num;
    }
    lessThanOrEqual(other: Value): boolean {
        if (other instanceof ExactNumber) {
            return this.toExact().lessThanOrEqual(other);
        }
        return this.num <= other.num;
    }
    equals(other: Value): boolean {
        if (this.isNaN()) {
            return false;
        }
        if (!this.isFinite()) {
            return !(other instanceof ExactNumber) && this.num === other.num;
        }
        if (other instanceof ExactNumber) {
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
        if (other instanceof ExactNumber) {
            return this.add(other.toInexact());
        }
        return new InexactNumber(this.num + other.num);
    }
    subtract(other: Value): Value {
        if (other instanceof ExactNumber) {
            return this.subtract(other.toInexact());
        }
        return new InexactNumber(this.num - other.num);
    }
    multiply(other: Value): Value {
        if (other instanceof ExactNumber) {
            if (other.isZero()) {
                return ZERO_VAL;
            }
            return this.multiply(other.toInexact());
        }
        return new InexactNumber(this.num * other.num);
    }
    divide(other: Value): Value {
        if (this.isZero()) {
            return this;
        }
        if (other instanceof ExactNumber) {
            return this.divide(other.toInexact());
        }
        return new InexactNumber(this.num / other.num);
    }

    numerator(): Value {
        return this.toExact().numerator().toInexact();
    }
    denominator(): Value {
        return this.toExact().denominator().toInexact();
    }

    integerSqrt(): Value {
        return new InexactNumber(Math.floor(Math.sqrt(this.num)));
    }
    sqrt(): Value {
        return new InexactNumber(Math.sqrt(this.num));
    }
    abs(): Value {
        return new InexactNumber(Math.abs(this.num));
    }
    floor(): Value {
        return new InexactNumber(Math.floor(this.num));
    }
    ceiling(): Value {
        return new InexactNumber(Math.ceil(this.num));
    }
    round(): Value {
        return new InexactNumber(Math.round(this.num));
    }

    log(): Value {
        return new InexactNumber(Math.log(this.num));
    }
    expt(power: Value): Value {
        if (power instanceof ExactNumber) {
            return this.expt(power.toInexact());
        }
        return new InexactNumber(Math.pow(this.num, power.num));
    }
    exp(): Value {
        return new InexactNumber(Math.exp(this.num))
    }

    angle(): Value {
        if (0 === this.num)
            return EXACT_ZERO;
        if (this.num > 0)
            return EXACT_ZERO;
        else
            return new InexactNumber(Math.PI);
    }
    atan(): Value {
        return new InexactNumber(Math.atan(this.num));
    }
    cos(): Value {
        return new InexactNumber(Math.cos(this.num));
    }
    sin(): Value {
        return new InexactNumber(Math.sin(this.num));
    }
    acos(): Value {
        return new InexactNumber(Math.acos(this.num));
    }
    asin(): Value {
        return new InexactNumber(Math.asin(this.num));
    }
}

export abstract class ExactNumber extends AbstractNumber {
    abstract readonly num: JSInteger;
    abstract readonly den: JSInteger;

    // TODO: Does this ever get used? Can I remove it?
    static makeInstance(num: number, den: number): ExactNumber;
    static makeInstance(num: bigint, den: bigint): ExactNumber;
    static makeInstance(num: JSInteger, den: JSInteger): ExactNumber {
       if (typeof num === 'bigint' && typeof den === 'bigint') {
           return new BigExactNumber(num, den);
       } else if (typeof num === 'number' && typeof den === 'number') {
           return new SmallExactNumber(num, den);
       } else {
           throw new TypeError(`Numberator and denominator types must match, given ${typeof num} and ${typeof den}`)
       }
    }
}

// TODO: Jump too BigExactNumber as necessary
export class SmallExactNumber extends ExactNumber {
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

            let gcd = this.gcd(num, den);
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

    toInexact(): InexactNumber {
        let result = this.num / this.den;
        return new InexactNumber(result);
    }
    toExact(): ExactNumber {
        return this;
    }
    toBigExact(): BigExactNumber {
        return new BigExactNumber(BigInt(this.num), BigInt(this.den));
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
        if (other instanceof InexactNumber) {
            return this.toInexact().greaterThan(other);
        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().greaterThan(other);
        } else {
            let thisVal = this.num * (other.den as number);
            let otherVal = this.den * (other.num as number);
            return thisVal > otherVal;
        }
    }
    greaterThanOrEqual(other: Value): boolean {
        if (other instanceof InexactNumber) {
            return this.toInexact().greaterThanOrEqual(other);
        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().greaterThanOrEqual(other);
        } else {
            let thisVal = this.num * (other.den as number);
            let otherVal = this.den * (other.num as number);
            return thisVal >= otherVal;
        }
    }
    lessThan(other: Value): boolean {
        if (other instanceof InexactNumber) {
            return this.toInexact().lessThan(other);
        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().lessThan(other);
        } else {
            let thisVal = this.num * (other.den as number);
            let otherVal = this.den * (other.num as number);
            return thisVal < otherVal;
        }
    }
    lessThanOrEqual(other: Value): boolean {
        if (other instanceof InexactNumber) {
            return this.toInexact().lessThanOrEqual(other);
        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().lessThanOrEqual(other);
        } else {
            let thisVal = this.num * (other.den as number);
            let otherVal = this.den * (other.num as number);
            return thisVal <= otherVal;
        }
    }
    equals(other: Value): boolean {
        if (other instanceof InexactNumber) {
            return this.toInexact().equals(other);
        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().equals(other);
        } else {
            let thisVal = this.num * (other.den as number);
            let otherVal = this.den * (other.num as number);
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
        if (other instanceof InexactNumber) {
            return this.toInexact().add(other);
        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().add(other);
        } else if (other instanceof SmallExactNumber) {
            let num = (this.num * other.den) + (other.num * this.den);
            let den = this.den * other.den;

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().add(other.toBigExact());
            }

            return new SmallExactNumber(num, den);
        } else {
            throw new Error(`Cannot add ${this} to value ${other}`);
        }
    }
    subtract(other: Value): Value {
        if (other instanceof InexactNumber) {
            return this.toInexact().subtract(other);
        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().subtract(other);
        } else if (other instanceof SmallExactNumber) {
            let num = (this.num * other.den) - (other.num * this.den);
            let den = this.den * other.den;

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().subtract(other.toBigExact());
            }

            return new SmallExactNumber(num, den);
        } else {
            throw new Error(`Cannot subtract ${this} and ${other}`);
        }
    }
    multiply(other: Value): Value {
        if ((other.isExact() && other.isZero()) || this.isZero()) {
            return ZERO_VAL;
        }

        if (other instanceof InexactNumber) {
            return this.toInexact().multiply(other);
        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().multiply(other);
        } else if (other instanceof SmallExactNumber) {
            let num = this.num * other.num;
            let den = this.den * other.den;

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().multiply(other.toBigExact());
            }

            return new SmallExactNumber(num, den);
        } else {
            throw new Error(`Cannot multiply ${this} and ${other}`);
        }
    }
    divide(other: Value): Value {
        if (this.isZero()) {
            return this;
        }

        if (other instanceof InexactNumber) {
            return this.toInexact().multiply(other);
        } else if (other instanceof BigExactNumber) {
            return this.toBigExact().multiply(other);
        } else if (other.isZero()) {
            throw new Error("/: division by zero" + this + other);
        } else if (other instanceof SmallExactNumber) {
            let num = this.num * other.den;
            let den = this.den * other.num;

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().divide(other.toBigExact());
            }

            return new SmallExactNumber(num, den);
        } else {
            throw new Error(`Cannot divide ${this} and ${other}`);
        }
    }

    numerator(): Value {
        return new SmallExactNumber(this.num);
    }
    denominator(): Value {
        return new SmallExactNumber(this.den);
    }

    integerSqrt(): Value {
        return this.sqrt().floor();
    }
    sqrt(): Value {
        if (this.isNegative()) {
            throw new Error("Cannot take square root of negative number " + this);
        }

        let num = Math.sqrt(this.num);
        let den = Math.sqrt(this.den);

        if (num === Math.floor(num) && den === Math.floor(den)) {
           return new SmallExactNumber(num, den);
        } else {
            return new InexactNumber(num / den);
        }
    }
    abs(): Value {
        if (this.isNegative()) {
            return new SmallExactNumber(-1 * this.num, this.den);
        } else {
            return this;
        }
    }
    floor(): Value {
        if (this.den === 1) {
            return this;
        } else {
            return new SmallExactNumber(Math.floor(this.num / this.den));
        }
    }
    ceiling(): Value {
        if (this.den === 1) {
            return this;
        } else {
            return new SmallExactNumber(Math.ceil(this.num / this.den));
        }
    }
    round(): Value {
        if (this.den === 1) {
            return this;
        } else {
            return new SmallExactNumber(Math.round(this.num / this.den));
        }
    }

    log(): Value {
        return new InexactNumber(Math.log(this.num / this.den));
    }
    expt(power: Value): Value {
        power = power.toInexact();
        if (power.isInteger()) {
            let exp = power.num;
            let num = Math.pow(this.num, exp);
            let den = Math.pow(this.den, exp);

            if (!isSafeInteger(num) || !isSafeInteger(den)) {
                return this.toBigExact().expt(power);
            }

            return new SmallExactNumber(num, den);
        } else {
            return this.toInexact().expt(power);
        }
    }
    exp(): Value {
        return new InexactNumber(Math.exp(this.num / this.den));
    }

    angle(): Value {
       if (this.isNegative()) {
           return new InexactNumber(Math.PI);
       } else {
           return new SmallExactNumber(0);
       }
    }
    atan(): Value {
        return new InexactNumber(Math.atan(this.num / this.den));
    }
    cos(): Value {
        return new InexactNumber(Math.cos(this.num / this.den));
    }
    sin(): Value {
        return new InexactNumber(Math.sin(this.num / this.den));
    }
    acos(): Value {
        return new InexactNumber(Math.acos(this.num / this.den));
    }
    asin(): Value {
        return new InexactNumber(Math.asin(this.num / this.den));
    }
}

// TODO: Drop down to SmallExactNumber as Necessary
export class BigExactNumber extends ExactNumber {
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

            let gcd = this.gcd(num, den);
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

    toInexact(): InexactNumber {
        let result = Number(this.num) / Number(this.den);
        return new InexactNumber(result);
    }
    toExact(): ExactNumber {
        return this;
    }
    toSmallExact(): SmallExactNumber {
        return new SmallExactNumber(Number(this.num), Number(this.den));
    }
    toFixnum(): JSInteger {
        return this.num / this.den;
    }

    toString(): string {
        let numStr = this.num.toString().slice(0, -1);
        let denStr = this.den.toString().slice(0, -1);

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
        if (other instanceof InexactNumber) {
            return this.toInexact().greaterThan(other);
        } else if (other instanceof SmallExactNumber) {
            return this.greaterThan(other.toBigExact());
        } else if (other instanceof BigExactNumber) {
            let thisVal = this.num * other.den;
            let otherVal = this.den * other.den;
            return thisVal > otherVal;
        } else {
            throw new Error(`Cannot compare ${this} and ${other}`);
        }
    }
    greaterThanOrEqual(other: Value): boolean {
        if (other instanceof InexactNumber) {
            return this.toInexact().greaterThanOrEqual(other);
        } else if (other instanceof SmallExactNumber) {
            return this.greaterThanOrEqual(other.toBigExact());
        } else if (other instanceof BigExactNumber) {
            let thisVal = this.num * other.den;
            let otherVal = this.den * other.den;
            return thisVal >= otherVal;
        } else {
            throw new Error(`Cannot compare ${this} and ${other}`);
        }
    }
    lessThan(other: Value): boolean {
        if (other instanceof InexactNumber) {
            return this.toInexact().lessThan(other);
        } else if (other instanceof SmallExactNumber) {
            return this.lessThan(other.toBigExact());
        } else if (other instanceof BigExactNumber) {
            let thisVal = this.num * other.den;
            let otherVal = this.den * other.den;
            return thisVal < otherVal;
        } else {
            throw new Error(`Cannot compare ${this} and ${other}`);
        }
    }
    lessThanOrEqual(other: Value): boolean {
        if (other instanceof InexactNumber) {
            return this.toInexact().lessThanOrEqual(other);
        } else if (other instanceof SmallExactNumber) {
            return this.lessThanOrEqual(other.toBigExact());
        } else if (other instanceof BigExactNumber) {
            let thisVal = this.num * other.den;
            let otherVal = this.den * other.den;
            return thisVal <= otherVal;
        } else {
            throw new Error(`Cannot compare ${this} and ${other}`);
        }
    }
    equals(other: Value): boolean {
        if (other instanceof InexactNumber) {
            return this.toInexact().equals(other);
        } else if (other instanceof SmallExactNumber) {
            return this.equals(other.toBigExact());
        } else if (other instanceof BigExactNumber) {
            let thisVal = this.num * other.den;
            let otherVal = this.den * other.den;
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
        if (other instanceof InexactNumber) {
            return this.toInexact().add(other);
        } else if (other instanceof SmallExactNumber) {
            return this.add(other.toBigExact());
        } else if (other instanceof BigExactNumber) {
            let num = (this.num * other.den) + (other.num * this.den);
            let den = this.den * other.den;

            if (isSafeInteger(num) && isSafeInteger(den)) {
                return new SmallExactNumber(Number(num), Number(den));
            }

            return new BigExactNumber(num, den);
        } else {
            throw new Error(`Cannot add ${this} and ${other}`);
        }
    }
    subtract(other: Value): Value {
        if (other instanceof InexactNumber) {
            return this.toInexact().subtract(other);
        } else if (other instanceof SmallExactNumber) {
            return this.subtract(other.toBigExact());
        } else if (other instanceof BigExactNumber) {
            let num = (this.num * other.den) - (other.num * this.den);
            let den = this.den * other.den;

            if (isSafeInteger(num) && isSafeInteger(den)) {
                return new SmallExactNumber(Number(num), Number(den));
            }

            return new BigExactNumber(num, den);
        } else {
            throw new Error(`Cannot subtract ${this} and ${other}`);
        }
    }
    multiply(other: Value): Value {
        if ((other.isExact() && other.isZero()) || this.isZero()) {
            return ZERO_VAL;
        }

        if (other instanceof InexactNumber) {
            return this.toInexact().multiply(other);
        } else if (other instanceof SmallExactNumber) {
            return this.multiply(other.toBigExact());
        } else if (other instanceof BigExactNumber) {
            let num = this.num * other.num;
            let den = this.den * other.den;

            if (isSafeInteger(num) && isSafeInteger(den)) {
                return new SmallExactNumber(Number(num), Number(den));
            }

            return new BigExactNumber(num, den);
        } else {
            throw new Error(`Cannot multiply ${this} and ${other}`);
        }
    }
    divide(other: Value): Value {
        if (this.isZero()) {
            return ZERO_VAL;
        }

        if (other instanceof InexactNumber) {
            return this.toInexact().divide(other);
        } else if (other instanceof SmallExactNumber) {
            return this.divide(other.toBigExact());
        } else if (other instanceof BigExactNumber) {
            let num = this.num * other.den;
            let den = this.den * other.num;

            if (isSafeInteger(num) && isSafeInteger(den)) {
                return new SmallExactNumber(Number(num), Number(den));
            }

            return new BigExactNumber(num, den);
        } else {
            throw new Error(`Cannot divide ${this} and ${other}`);
        }
    }

    numerator(): Value {
        return new BigExactNumber(this.num);
    }
    denominator(): Value {
        return new BigExactNumber(this.den)
    }

    integerSqrt(): Value {
        return this.sqrt().floor();
    }
    sqrt(): Value {
        return this.toSmallExact().sqrt();
    }
    abs(): Value {
        if (this.isNegative()) {
            return new BigExactNumber(this.num * -1n, this.den);
        } else {
            return this;
        }
    }
    floor(): Value {
        if (this.den === 1n) {
            return this;
        } else {
            return new BigExactNumber(this.num / this.den);
        }
    }
    ceiling(): Value {
        if (this.den === 1n) {
            return this;
        } else {
            return new BigExactNumber((this.num / this.den) + 1n);
        }
    }
    round(): Value {
        if (this.den === 1n) {
            return this;
        } else {
            let floor = this.floor();
            let floordiff = this.subtract(floor).abs();

            let ceil = this.ceiling();
            let ceildiff = ceil.subtract(this).abs();

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
            // TODO: This should be computed using squares
            let exp = power.num;
            let result = this;
            for (let i = 1; i < exp; i++) {
                result = result.multiply(this) as this;
            }
            return result;
        }
        return this.toSmallExact().expt(power);
    }
    exp(): Value {
        return this.toSmallExact().exp();
    }

    angle(): Value {
        return new BigExactNumber(0n);
    }
    atan(): Value {
        return this.toSmallExact().atan();
    }
    cos(): Value {
        return this.toSmallExact().cos();
    }
    sin(): Value {
        return this.toSmallExact().sin();
    }
    acos(): Value {
        return this.toSmallExact().acos();
    }
    asin(): Value {
        return this.toSmallExact().asin();
    }
}

const EXACT_ZERO = new SmallExactNumber(0);


/////////////////////// Constants ///////////////////////

// If you add any constants here, make sure to re-export them from
// the constants.ts file as well.

export const ZERO_VAL = new SmallExactNumber(0);
export const ONE_VAL = new SmallExactNumber(1);
export const TWO_VAL = new SmallExactNumber(2);

export const NEG_ONE_VAL = new SmallExactNumber(-1);

export const PI_VAL = new InexactNumber(Math.PI);

export const INF_VAL = new InexactNumber(Number.POSITIVE_INFINITY);
export const NEG_INF_VAL = new InexactNumber(Number.NEGATIVE_INFINITY);
export const NAN_VAL = new InexactNumber(Number.NaN);
