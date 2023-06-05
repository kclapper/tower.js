import {
    Value
} from './Value';
import {
    Level,
    JSInteger,
    isJSInteger,
    TowerNumber
} from './main';
import { Rational } from './Rational';
import { Complex } from './Complex';
import { NEG_ONE_VAL, ZERO, ZERO_VAL } from './constants';

export class Integer extends Rational {
    public readonly level: Level;

    constructor(n: Value) {
        if (!n.isFinite() || !n.isInteger()) {
            throw new TypeError("Integer must be constructed with an integer value.");
        }

        super(n);
        this.level = Level.INTEGER;
    }

    public static makeInstance(n: number): Rational;
    public static makeInstance(n: bigint): Rational;
    public static makeInstance(n: number, d: number): Rational;
    public static makeInstance(n: bigint, d: bigint): Rational;
    public static makeInstance(n: JSInteger, d?: JSInteger): Rational {
        // HACK: 'as number' here is just to appease the type checker.
        return super.makeInstance(n as number, d as number) as Integer;
    }

    public liftTo(other: TowerNumber): Complex {
        if (isJSInteger(other)) {
            return this;
        }

        switch (other.level) {
            case Level.INTEGER:
                return this;
            case Level.RATIONAL:
                return this;
            case Level.REAL:
                return this;
            case Level.COMPLEX:
                return this;
            default:
                let _exaustiveSearch: never = other.level;
                return other;
        }
    }

    public isFinite(): boolean {
        return true;
    }
    public isRational(): boolean {
        return true;
    }
    public isExact(): boolean {
        return this.n.isExact();
    }
    public isInexact(): boolean {
        return !this.isExact();
    }
    public isPositive(): boolean {
        return this.n.isPositive();
    }
    public toExact(): Integer {
        return new Integer(this.n.toExact());
    }
    public toFixNum(): JSInteger {
        return this.n.toFixnum();
    }

    public greaterThan(other: Integer): boolean {
        return this.n.greaterThan(other.n);
    }
    public greaterThanOrEqual(other: Integer): boolean {
        return this.n.greaterThanOrEqual(other.n);
    }
    public lessThan(other: Integer): boolean {
        return this.n.lessThan(other.n);
    }
    public lessThanOrEqual(other: Integer): boolean {
        return this.n.lessThanOrEqual(other.n);
    }
    public equals(other: Integer): boolean {
        return this.n.equals(other.n);
    }

    public add(other: Integer): Integer {
        return new Integer(this.n.add(other.n));
    }
    public subtract(other: Integer): Integer {
        return new Integer(this.n.subtract(other.n));
    }
    public multiply(other: Integer): Integer {
        return new Integer(this.n.multiply(other.n));
    }
    public divide(other: Integer): Rational {
        return new Rational(this.n.divide(other.n));
    }

    public numerator(): Integer {
        return new Integer(this.n.numerator());
    }
    public denominator(): Integer {
        return new Integer(this.n.denominator());
    }

    public integerSqrt(): Integer {
        if (this.isInteger()) {
            return new Integer(this.n.integerSqrt());
        } else {
            throw new Error("IntegerSqrt only defined for integers.");
        }
    }
    public sqrt(): Complex {
        if (this.isPositive()) {
            return new Complex(this.n.multiply(NEG_ONE_VAL), ZERO_VAL);
        } else {
            return new Rational(this.n.sqrt());
        }
    }
    public abs(): Integer {
        return new Integer(this.n.abs());
    }
    public floor(): Integer {
        return this;
    }
    public ceiling(): Integer {
        return this;
    }
    public round(): Integer {
        return this;
    }

    public conjugate(): Integer {
        return this;
    }
    public magnitude(): Integer {
        return this;
    }
    public realPart(): Integer {
        return this;
    }
    public imaginaryPart(): Integer {
        return ZERO;
    }

    public log(): Rational {
        return new Rational(this.n.log());
    }
    public expt(power: Integer): Integer {
        return new Integer(this.n.expt(power.n));
    }
    public exp(): Rational {
        return new Rational(this.n.exp());
    }

    public angle(): Integer {
        return new Integer(this.n.angle());
    }
    public atan(): Rational {
        return new Rational(this.n.atan());
    }
    public cos(): Rational {
        return new Rational(this.n.cos());
    }
    public sin(): Rational {
        return new Rational(this.n.sin());
    }
    public acos(): Rational {
        return new Rational(this.n.acos());
    }
    public asin(): Rational {
        return new Rational(this.n.asin());
    }
}
