import { Complex } from './Complex';
import { Integer } from './Integer';
import { Real } from './Real';
import { Value } from './Value';
import { NEG_ONE_VAL, ZERO, ZERO_VAL } from './constants';
import {
    TowerNumber,
    JSInteger,
    Level,
    isJSInteger
} from './main';

export class Rational extends Real {
    public readonly level: Level;

    constructor(n: Value) {
        if (!n.isFinite()) {
            throw new TypeError("Rational cannot be constructed with irrational value.");
        }

        super(n);
        this.level = Level.RATIONAL;
    }

    public static makeInstance(n: number): Rational;
    public static makeInstance(n: bigint): Rational;
    public static makeInstance(n: number, d: number): Rational;
    public static makeInstance(n: bigint, d: bigint): Rational;
    public static makeInstance(n: JSInteger, d?: JSInteger): Rational {
        // HACK: 'as number' here is just to appease the type checker.
        return super.makeInstance(n as number, d as number) as Rational;
    }

    public liftTo(other: TowerNumber): Complex {
        if (isJSInteger(other)) {
            throw new TypeError("Cannot lift to lower level.")
        }

        switch (other.level) {
            case Level.INTEGER:
                throw new TypeError("Cannot lift to lower level.");
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
    public toExact(): Real {
        return new Real(this.n.toExact());
    }
    public toFixNum(): JSInteger {
        return this.n.toFixnum();
    }

    public greaterThan(other: Rational): boolean {
        return this.n.greaterThan(other.n);
    }
    public greaterThanOrEqual(other: Rational): boolean {
        return this.n.greaterThanOrEqual(other.n);
    }
    public lessThan(other: Rational): boolean {
        return this.n.lessThan(other.n);
    }
    public lessThanOrEqual(other: Rational): boolean {
        return this.n.lessThanOrEqual(other.n);
    }
    public equals(other: Rational): boolean {
        return this.n.equals(other.n);
    }

    public add(other: Rational): Rational {
        return new Rational(this.n.add(other.n));
    }
    public subtract(other: Rational): Rational {
        return new Rational(this.n.subtract(other.n));
    }
    public multiply(other: Rational): Rational {
        return new Rational(this.n.multiply(other.n));
    }
    public divide(other: Rational): Rational {
        return new Rational(this.n.divide(other.n));
    }

    public numerator(): Rational {
        return new Rational(this.n.numerator());
    }
    public denominator(): Rational {
        return new Rational(this.n.denominator());
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
    public abs(): Rational {
        return new Rational(this.n.abs());
    }
    public floor(): Rational {
        return new Rational(this.n.floor());
    }
    public ceiling(): Rational {
        return new Rational(this.n.ceiling());
    }
    public round(): Rational {
        return new Rational(this.n.round());
    }

    public conjugate(): Rational {
        return this;
    }
    public magnitude(): Rational {
        return this;
    }
    public realPart(): Rational {
        return this;
    }
    public imaginaryPart(): Integer {
        return ZERO;
    }

    public log(): Rational {
        return new Rational(this.n.log());
    }
    public expt(power: Rational): Rational {
        return new Rational(this.n.expt(power.n));
    }
    public exp(): Rational {
        return new Rational(this.n.exp());
    }

    public angle(): Rational {
        return new Rational(this.n.angle());
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
