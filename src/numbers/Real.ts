import { Integer } from './Integer';
import { Complex } from './Complex';
import {
    BigExactNumber,
    InexactNumber,
    SmallExactNumber,
    Value
} from './Value';
import {
    TowerNumber,
    JSInteger,
    Level,
    isJSInteger
} from './main';
import { NEG_ONE_VAL, ZERO, ZERO_VAL } from './constants';

export class Real extends Complex {
    public readonly level: Level;

    protected readonly n: Value;

    constructor(n: Value) {
        super(n);
        this.level = Level.REAL;
        this.n = this.real; // Simple alias.
    }

    public static makeInstance(n: number): Real;
    public static makeInstance(n: bigint): Real;
    public static makeInstance(n: number, d: number): Real;
    public static makeInstance(n: bigint, d: bigint): Real;
    public static makeInstance(n: JSInteger, d?: JSInteger): Real {
        if (typeof n !== typeof d) {
            throw new TypeError("All makeInstance arguments must be the same type.")
        }

        let componentsAreIntegers = d !== undefined ? isJSInteger(n) && isJSInteger(d) : isJSInteger(n);
        let isBig = typeof n === 'bigint';

        let val;
        if (d !== undefined) {
            if (componentsAreIntegers && isBig) {
                val = new BigExactNumber(n as bigint, d as bigint);
            } else if (componentsAreIntegers) {
                val = new SmallExactNumber(n as number, d as number);
            } else {
                throw new TypeError("Numerator and denominator must be integers.")
            }
        } else {
            if (componentsAreIntegers && isBig) {
                val = new BigExactNumber(n as bigint);
            } else if (componentsAreIntegers) {
                val = new SmallExactNumber(n as number);
            } else {
                val = new InexactNumber(n as number);
            }
        }

        return new Real(val);
    }

    public toString(): string {
        return this.n.toString();
    }

    public liftTo(other: TowerNumber): Complex {
        if (isJSInteger(other)) {
            throw new TypeError("Cannot lift to lower level.")
        }

        switch (other.level) {
            case Level.INTEGER:
                throw new TypeError("Cannot lift to lower level.");
            case Level.RATIONAL:
                throw new TypeError("Cannot lift to lower level.");
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
        return this.n.isFinite();
    }
    public isInteger(): boolean {
        return this.n.isInteger();
    }
    public isRational(): boolean {
        return this.isFinite();
    }
    public isReal(): boolean {
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

    public greaterThan(other: Real): boolean {
        return this.n.greaterThan(other.n);
    }
    public greaterThanOrEqual(other: Real): boolean {
        return this.n.greaterThanOrEqual(other.n);
    }
    public lessThan(other: Real): boolean {
        return this.n.lessThan(other.n);
    }
    public lessThanOrEqual(other: Real): boolean {
        return this.n.lessThanOrEqual(other.n);
    }
    public equals(other: Real): boolean {
        return this.n.equals(other.n);
    }

    public add(other: Real): Real {
        return new Real(this.n.add(other.n));
    }
    public subtract(other: Real): Real {
        return new Real(this.n.subtract(other.n));
    }
    public multiply(other: Real): Real {
        return new Real(this.n.multiply(other.n));
    }
    public divide(other: Real): Real {
        return new Real(this.n.divide(other.n));
    }

    public numerator(): Real {
        return new Real(this.n.numerator());
    }
    public denominator(): Real {
        return new Real(this.n.denominator());
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
            return new Real(this.n.sqrt());
        }
    }
    public abs(): Real {
        return new Real(this.n.abs());
    }
    public floor(): Real {
        return new Real(this.n.floor());
    }
    public ceiling(): Real {
        return new Real(this.n.ceiling());
    }
    public round(): Real {
        return new Real(this.n.round());
    }

    public conjugate(): Real {
        return this;
    }
    public magnitude(): Real {
        return this;
    }
    public realPart(): Real {
        return this;
    }
    public imaginaryPart(): Integer {
        return ZERO;
    }

    public log(): Real {
        return new Real(this.n.log());
    }
    public expt(power: Real): Real {
        return new Real(this.n.expt(power.n));
    }
    public exp(): Real {
        return new Real(this.n.exp());
    }

    public angle(): Real {
        return new Real(this.n.angle());
    }
    public atan(): Real {
        return new Real(this.n.atan());
    }
    public cos(): Real {
        return new Real(this.n.cos());
    }
    public sin(): Real {
        return new Real(this.n.sin());
    }
    public acos(): Real {
        return new Real(this.n.acos());
    }
    public asin(): Real {
        return new Real(this.n.asin());
    }
}
