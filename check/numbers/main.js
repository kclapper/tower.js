"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Level = void 0;
var Level;
(function (Level) {
    Level[Level["INTEGER"] = 0] = "INTEGER";
    Level[Level["RATIONAL"] = 1] = "RATIONAL";
    Level[Level["REAL"] = 2] = "REAL";
    Level[Level["COMPLEX"] = 3] = "COMPLEX";
})(Level || (exports.Level = Level = {}));
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
