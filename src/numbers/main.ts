import { BoxedNumber } from './BoxedNumber';
import { Complex } from './Complex';

export type RacketNumber = JSInteger | BoxedNumber;

// export type BoxedNumber = Complex;

export type JSNumber = number | bigint;

export type JSInteger = JSNumber;

export enum Level {
    INTEGER,
    RATIONAL,
    REAL,
    COMPLEX
}
export { Integer } from './Integer';
export { Rational } from './Rational';
export { Real } from './Real';
export { Complex } from './Complex';

// export abstract class BoxedNumber {
//     abstract readonly level: Level;
//
//     abstract toString(): string;
//     // abstract fromString(str: string): BoxedNumber;
//
//     abstract liftTo(other: BoxedNumber): BoxedNumber;
//
//     abstract isFinite(): boolean;
//     abstract isInteger(): boolean;
//     abstract isRational(): boolean;
//     abstract isReal(): boolean;
//     abstract isExact(): boolean;
//     abstract isPositive(): boolean;
//     abstract canBeFixnum(): boolean;
//
//     abstract toExact(): BoxedNumber;
//     abstract toFixnum(): JSInteger;
//
//     abstract greaterThan(other: BoxedNumber): boolean;
//     abstract greaterThanOrEqual(other: BoxedNumber): boolean;
//     abstract lessThan(other: BoxedNumber): boolean;
//     abstract lessThanOrEqual(other: BoxedNumber): boolean;
//     abstract equals(other: BoxedNumber): boolean;
//
//     abstract add(other: BoxedNumber): BoxedNumber;
//     abstract subtract(other: BoxedNumber): BoxedNumber;
//     abstract multiply(other: BoxedNumber): BoxedNumber;
//     abstract divide(other: BoxedNumber): BoxedNumber;
//
//     abstract numerator(): BoxedNumber;
//     abstract denominator(): BoxedNumber;
//
//     abstract integerSqrt(): BoxedNumber;
//     abstract sqrt(): BoxedNumber;
//     abstract abs(): BoxedNumber;
//     abstract floor(): BoxedNumber;
//     abstract ceiling(): BoxedNumber;
//     abstract round(): BoxedNumber;
//
//     abstract conjugate(): BoxedNumber;
//     abstract magnitude(): BoxedNumber;
//     abstract imaginaryPart(): BoxedNumber;
//     abstract realPart(): BoxedNumber;
//
//     abstract log(): BoxedNumber;
//     abstract expt(power: BoxedNumber): BoxedNumber;
//     abstract exp(): BoxedNumber;
//
//     abstract angle(): BoxedNumber;
//     abstract atan(): BoxedNumber;
//     abstract cos(): BoxedNumber;
//     abstract sin(): BoxedNumber;
//     abstract acos(): BoxedNumber;
//     abstract asin(): BoxedNumber;
// }
