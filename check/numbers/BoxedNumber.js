"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoxedNumber = void 0;
var util_1 = require("./util");
var Value_1 = require("./Value");
var main_1 = require("./main");
var constants_1 = require("./constants");
var BoxedNumber = /** @class */ (function () {
    function BoxedNumber(real, imag) {
        this.real = real;
        if (imag === undefined) {
            this.imag = constants_1.ZERO_VAL;
        }
        else {
            this.imag = imag;
        }
        var level;
        if (this.isInteger()) {
            level = main_1.Level.INTEGER;
        }
        else if (this.isRational()) {
            level = main_1.Level.RATIONAL;
        }
        else if (this.isReal()) {
            level = main_1.Level.REAL;
        }
        else {
            level = main_1.Level.COMPLEX;
        }
        this.level = level;
    }
    BoxedNumber.makeInstance = function (real, realDen, imag, imagDen) {
        var isReal = imag === undefined;
        if (isReal && imagDen !== undefined) {
            throw new Error("Must specify both a numerator and denominator.");
        }
        if (typeof real === 'number') {
            imag = 0;
        }
        else {
            imag = 0n;
        }
        var denominatorsExist = realDen !== undefined && imagDen !== undefined;
        if (!denominatorsExist && (realDen !== undefined || imagDen !== undefined)) {
            throw new Error("Real and imaginary part must be the same exactness.");
        }
        var componentsAreIntegers;
        if (denominatorsExist) {
            componentsAreIntegers = (0, util_1.isJSInteger)(real)
                && (0, util_1.isJSInteger)(imag)
                && (0, util_1.isJSInteger)(realDen)
                && (0, util_1.isJSInteger)(imagDen);
        }
        else {
            componentsAreIntegers = (0, util_1.isJSInteger)(real)
                && (0, util_1.isJSInteger)(imag);
        }
        var typesAreSame;
        if (denominatorsExist) {
            typesAreSame = typeof real === typeof imag
                && typeof realDen === typeof imagDen
                && typeof real === typeof realDen;
        }
        else {
            typesAreSame = typeof real === typeof imag;
        }
        if (!typesAreSame) {
            throw new TypeError("All makeInstance arguments must be the same type.");
        }
        var isBig = typeof real === 'bigint';
        var realVal, imagVal;
        if (denominatorsExist) {
            if (componentsAreIntegers && isBig) {
                realVal = new Value_1.BigExactNumber(real, realDen);
                imagVal = new Value_1.BigExactNumber(imag, imagDen);
            }
            else if (componentsAreIntegers) {
                realVal = new Value_1.SmallExactNumber(real, realDen);
                imagVal = new Value_1.SmallExactNumber(imag, imagDen);
            }
            else {
                throw new TypeError("Numerator and denominator must be integers.");
            }
        }
        else {
            if (componentsAreIntegers && isBig) {
                realVal = new Value_1.BigExactNumber(real);
                imagVal = new Value_1.BigExactNumber(imag);
            }
            else if (componentsAreIntegers) {
                realVal = new Value_1.SmallExactNumber(real);
                imagVal = new Value_1.SmallExactNumber(imag);
            }
            else {
                realVal = new Value_1.InexactNumber(real);
                imagVal = new Value_1.InexactNumber(imag);
            }
        }
        return new BoxedNumber(realVal, imagVal);
    };
    BoxedNumber.prototype.toString = function () {
        if (this.isReal()) {
            return this.real.toString();
        }
        else {
            return this.real.toString() + this.imag.toSignedString() + "i";
        }
    };
    BoxedNumber.prototype.liftTo = function (other) {
        return this;
        // switch (other.level) {
        // case Level.INTEGER:
        // throw new TypeError("Cannot lift to lower level.")
        // case Level.RATIONAL:
        // throw new TypeError("Cannot lift to lower level.")
        // case Level.REAL:
        // throw new TypeError("Cannot lift to lower level.")
        // case Level.COMPLEX:
        // return this;
        // default:
        // let _exaustiveSearch: never = other.level;
        // return other;
        // }
    };
    // protected static matchLevel(first: BoxedNumber, second: BoxedNumber): BoxedNumber[] {
    // if (first.level === second.level) {
    // return [second, second];
    // } else if (first.level > second.level) {
    //
    // }
    // }
    BoxedNumber.prototype.isInteger = function () {
        return this.real.isInteger() && this.imag.isInteger();
    };
    BoxedNumber.prototype.isRational = function () {
        return this.isFinite();
    };
    BoxedNumber.prototype.isFinite = function () {
        return this.real.isFinite() && this.imag.isFinite();
    };
    BoxedNumber.prototype.isReal = function () {
        return this.imag.isZero() && this.imag.isExact();
    };
    BoxedNumber.prototype.isComplex = function () {
        return true;
    };
    BoxedNumber.prototype.isExact = function () {
        return this.real.isExact() && this.imag.isExact();
    };
    BoxedNumber.prototype.isInexact = function () {
        return !this.isExact();
    };
    BoxedNumber.prototype.isPositive = function () {
        if (!this.isReal()) {
            throw new TypeError("Not defined for complex numbers.");
        }
        return this.real.isPositive();
    };
    // public canBeFixnum(): boolean {
    // return this.isReal() && this.isInteger() && this.isExact();
    // }
    BoxedNumber.prototype.toExact = function () {
        return new BoxedNumber(this.real.toExact(), this.imag.toExact());
    };
    BoxedNumber.prototype.toFixnum = function () {
        if (!this.isReal()) {
            throw new TypeError("Not defined for complex numbers.");
        }
        return this.real.toFixnum();
    };
    BoxedNumber.prototype.greaterThan = function (other) {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Greater than not defined for complex numbers.");
        }
        return this.real.greaterThan(other.real);
    };
    BoxedNumber.prototype.greaterThanOrEqual = function (other) {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Greater than or equal not defined for complex numbers.");
        }
        return this.real.greaterThanOrEqual(other.real);
    };
    BoxedNumber.prototype.lessThan = function (other) {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Less than not defined for complex numbers.");
        }
        return this.real.lessThan(other.real);
    };
    BoxedNumber.prototype.lessThanOrEqual = function (other) {
        if (!this.isReal() || !other.isReal()) {
            throw new Error("Less than or equal not defined for complex numbers.");
        }
        return this.real.lessThanOrEqual(other.real);
    };
    BoxedNumber.prototype.equals = function (other) {
        return this.real.equals(other.real) && this.imag.equals(other.imag);
    };
    BoxedNumber.prototype.add = function (other) {
        return new BoxedNumber(this.real.add(other.real), this.imag.add(other.imag));
    };
    BoxedNumber.prototype.subtract = function (other) {
        return new BoxedNumber(this.real.subtract(other.real), this.imag.subtract(other.imag));
    };
    BoxedNumber.prototype.multiply = function (other) {
        var real = this.real.multiply(other.real).subtract(this.imag.multiply(other.imag));
        var imag = this.real.multiply(other.imag).add(this.imag.multiply(other.real));
        return new BoxedNumber(real, imag);
    };
    BoxedNumber.prototype.divide = function (other) {
        // If the other value is real, just do primitive division
        if (other.isReal()) {
            var real = this.real.divide(other.real);
            var imag = this.imag.divide(other.real);
            return new BoxedNumber(real, imag);
        }
        var a, b, c, d, r, x, y;
        if (this.isInexact() || other.isInexact()) {
            // http://portal.acm.org/citation.cfm?id=1039814
            // We currently use Smith's method, though we should
            // probably switch over to Priest's method.
            a = this.real;
            b = this.imag;
            c = other.real;
            d = other.imag;
            if (d.abs().lessThanOrEqual(c.abs())) {
                r = d.divide(c);
                x = a.add(b.multiply(r)).divide(c.add(d.multiply(r)));
                y = b.subtract(a.multiply(r)).divide(c.add(d.multiply(r)));
            }
            else {
                r = c.divide(d);
                x = a.multiply(r).add(b).divide(c.multiply(r).add(d));
                y = b.multiply(r).subtract(a).divide(c.multiply(r).add(d));
            }
            return new BoxedNumber(x, y);
        }
        else {
            var con = other.conjugate();
            var up = this.multiply(con);
            // Down is guaranteed to be real by this point.
            var down = other.multiply(con).realPart();
            var real = up.realPart().divide(down).real;
            var imag = up.imaginaryPart().divide(down).real;
            return new BoxedNumber(real, imag);
        }
    };
    BoxedNumber.prototype.numerator = function () {
        if (!this.isReal()) {
            throw new Error("Numerator not defined for complex numbers.");
        }
        return new BoxedNumber(this.real.numerator());
    };
    BoxedNumber.prototype.denominator = function () {
        if (!this.isReal()) {
            throw new Error("Denominator not defined for complex numbers.");
        }
        return new BoxedNumber(this.real.denominator());
    };
    BoxedNumber.prototype.integerSqrt = function () {
        if (this.isInteger()) {
            return new BoxedNumber(this.real.integerSqrt());
        }
        else {
            throw new Error("IntegerSqrt only defined for integers.");
        }
    };
    BoxedNumber.prototype.sqrt = function () {
        if (this.isReal()) {
            return new BoxedNumber(this.real.sqrt());
        }
        // http://en.wikipedia.org/wiki/Square_root#Square_roots_of_negative_and_complex_numbers
        var mag = this.magnitude().real;
        var r_plus_x = mag.add(this.real);
        var real = r_plus_x.divide(new Value_1.SmallExactNumber(2)).sqrt();
        var imag = this.imag.divide(r_plus_x.multiply(new Value_1.SmallExactNumber(2)).sqrt());
        return new BoxedNumber(real, imag);
    };
    BoxedNumber.prototype.abs = function () {
        if (!this.isReal()) {
            throw new Error("abs is not defined for complex numbers.");
        }
        return new BoxedNumber(this.real.abs());
    };
    BoxedNumber.prototype.floor = function () {
        if (!this.isReal()) {
            throw new Error("floor is not defined for complex numbers.");
        }
        return new BoxedNumber(this.real.floor());
    };
    BoxedNumber.prototype.ceiling = function () {
        if (!this.isReal()) {
            throw new Error("ceiling is not defined for complex numbers.");
        }
        return new BoxedNumber(this.real.ceiling());
    };
    BoxedNumber.prototype.round = function () {
        if (!this.isReal()) {
            throw new Error("round is not defined for complex numbers.");
        }
        return new BoxedNumber(this.real.round());
    };
    BoxedNumber.prototype.conjugate = function () {
        return new BoxedNumber(this.real, new Value_1.SmallExactNumber(0).subtract(this.imag));
    };
    BoxedNumber.prototype.magnitude = function () {
        var realSqr = this.real.multiply(this.real);
        var imagSqr = this.imag.multiply(this.imag);
        var sum = realSqr.add(imagSqr);
        return new BoxedNumber(sum.sqrt());
    };
    BoxedNumber.prototype.realPart = function () {
        return new BoxedNumber(this.real);
    };
    BoxedNumber.prototype.imaginaryPart = function () {
        return new BoxedNumber(this.imag);
    };
    BoxedNumber.prototype.log = function () {
        var mag = this.magnitude();
        var theta = this.angle();
        return mag.log().add(theta.multiply(constants_1.I));
    };
    BoxedNumber.prototype.expt = function (power) {
        if (this.isExact() && this.isInteger() && power.greaterThanOrEqual(constants_1.ZERO)) {
            var n = this.real.toFixnum();
            var k = power.real.toFixnum();
            var result = (0, util_1.fastExpt)(n, k);
            var resultValue = void 0;
            if (typeof result === 'number') {
                resultValue = new Value_1.SmallExactNumber(result);
            }
            else {
                resultValue = new Value_1.BigExactNumber(result);
            }
            return new BoxedNumber(resultValue);
        }
        var expo = power.multiply(this.log());
        return expo.exp();
    };
    BoxedNumber.prototype.exp = function () {
        var r = new BoxedNumber(this.real.exp());
        var cos_a = new BoxedNumber(this.imag.cos());
        var sin_a = new BoxedNumber(this.imag.sin());
        return r.multiply(cos_a.add(sin_a.multiply(constants_1.I)));
    };
    BoxedNumber.prototype.angle = function () {
        if (this.isReal()) {
            return new BoxedNumber(this.real.angle());
        }
        if (this.real.equals(constants_1.ZERO_VAL)) {
            var halfPI = constants_1.PI.divide(constants_1.TWO);
            if (this.imag.greaterThan(constants_1.ZERO_VAL)) {
                return halfPI;
            }
            else {
                return halfPI.multiply(constants_1.NEG_ONE);
            }
        }
        var tmp = this.imaginaryPart().abs().divide(this.realPart().abs()).atan();
        if (this.realPart().greaterThan(constants_1.ZERO)) {
            if (this.imaginaryPart().greaterThan(constants_1.ZERO)) {
                return tmp;
            }
            else {
                return tmp.multiply(constants_1.NEG_ONE);
            }
        }
        else {
            if (this.imaginaryPart().greaterThan(constants_1.ZERO)) {
                return constants_1.PI.subtract(tmp);
            }
            else {
                return tmp.subtract(constants_1.PI);
            }
        }
    };
    BoxedNumber.prototype.atan = function () {
        if (this.equals(constants_1.I) || this.equals(constants_1.NEG_I)) {
            return constants_1.NEG_INF;
        }
        return constants_1.I.multiply(constants_1.HALF.multiply(constants_1.I.add(this).divide(constants_1.I.add(constants_1.ZERO.subtract(this))).log()));
    };
    BoxedNumber.prototype.cos = function () {
        if (this.isReal()) {
            return new BoxedNumber(this.real.cos());
        }
        var iz = this.multiply(constants_1.I);
        var iz_negate = iz.multiply(constants_1.NEG_ONE);
        return iz.exp().add(iz_negate.exp()).divide(constants_1.TWO);
    };
    BoxedNumber.prototype.sin = function () {
        if (this.isReal()) {
            return new BoxedNumber(this.real.sin());
        }
        var iz = this.multiply(constants_1.I);
        var iz_negate = iz.multiply(constants_1.NEG_ONE);
        var z2 = new BoxedNumber(constants_1.ZERO_VAL, constants_1.TWO_VAL);
        var exp_negate = iz.exp().subtract(iz_negate.exp());
        var result = exp_negate.divide(z2);
        return result;
    };
    BoxedNumber.prototype.acos = function () {
        if (this.isReal()) {
            return new BoxedNumber(this.real.acos());
        }
        var pi_half = constants_1.PI.divide(constants_1.TWO);
        var iz = this.multiply(constants_1.I);
        var root = constants_1.ONE.subtract(this.multiply(this)).sqrt();
        var l = iz.add(root).log().multiply(constants_1.I);
        return pi_half.add(l);
    };
    BoxedNumber.prototype.asin = function () {
        if (this.isReal()) {
            return new BoxedNumber(this.real.asin());
        }
        var oneNegateThisSq = constants_1.ONE.subtract(this.multiply(this));
        var sqrtOneNegateThisSq = oneNegateThisSq.sqrt();
        return constants_1.TWO.multiply(this.divide(constants_1.ONE.add(sqrtOneNegateThisSq)).atan());
    };
    return BoxedNumber;
}());
exports.BoxedNumber = BoxedNumber;
