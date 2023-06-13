"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigExactNumber = exports.SmallExactNumber = exports.ExactNumber = exports.InexactNumber = void 0;
var AbstractNumber = /** @class */ (function () {
    function AbstractNumber() {
    }
    return AbstractNumber;
}());
var InexactNumber = /** @class */ (function (_super) {
    __extends(InexactNumber, _super);
    function InexactNumber(num) {
        var _this = _super.call(this) || this;
        _this.num = num;
        return _this;
    }
    InexactNumber.prototype.isFinite = function () {
        return Number.isFinite(this.num);
    };
    InexactNumber.prototype.isInexact = function () {
        return true;
    };
    InexactNumber.prototype.isExact = function () {
        return false;
    };
    InexactNumber.prototype.isInteger = function () {
        return Number.isInteger(this.num);
    };
    InexactNumber.prototype.toInexact = function () {
        return this;
    };
    InexactNumber.prototype.toExact = function () {
        var stringRep = this.num.toString();
        var match = stringRep.match(/^(.*)\.(.*)$/);
        if (match) {
            var intPart = parseInt(match[1]);
            var fracPart = parseInt(match[2]);
            var tenToDecimalPlaces = Math.pow(10, match[2].length);
            return ExactNumber.makeInstance(Math.round(this.num * tenToDecimalPlaces), tenToDecimalPlaces);
        }
        else {
            return ExactNumber.makeInstance(this.num, 1);
        }
    };
    InexactNumber.prototype.toFixnum = function () {
        return Math.floor(this.num);
    };
    InexactNumber.prototype.toString = function () {
        return this.num.toString();
    };
    InexactNumber.prototype.toSignedString = function () {
        if (this.num >= 0) {
            return "+" + this.num.toString();
        }
        return this.num.toString();
    };
    InexactNumber.prototype.greaterThan = function (other) {
        if (other instanceof ExactNumber) {
            return this.toExact().greaterThan(other);
        }
        return this.num > other.num;
    };
    InexactNumber.prototype.greaterThanOrEqual = function (other) {
        if (other instanceof ExactNumber) {
            return this.toExact().greaterThanOrEqual(other);
        }
        return this.num >= other.num;
    };
    InexactNumber.prototype.lessThan = function (other) {
        if (other instanceof ExactNumber) {
            return this.toExact().lessThan(other);
        }
        return this.num < other.num;
    };
    InexactNumber.prototype.lessThanOrEqual = function (other) {
        if (other instanceof ExactNumber) {
            return this.toExact().lessThanOrEqual(other);
        }
        return this.num <= other.num;
    };
    InexactNumber.prototype.equals = function (other) {
        if (other instanceof ExactNumber) {
            return this.toExact().equals(other);
        }
        return this.num === other.num;
    };
    InexactNumber.prototype.isZero = function () {
        return this.num === 0;
    };
    InexactNumber.prototype.isPositive = function () {
        return this.num > 0;
    };
    InexactNumber.prototype.isNegative = function () {
        return this.num < 0;
    };
    InexactNumber.prototype.add = function (other) {
        if (other instanceof ExactNumber) {
            return this.add(other.toInexact());
        }
        return new InexactNumber(this.num + other.num);
    };
    InexactNumber.prototype.subtract = function (other) {
        if (other instanceof ExactNumber) {
            return this.subtract(other.toInexact());
        }
        return new InexactNumber(this.num - other.num);
    };
    InexactNumber.prototype.multiply = function (other) {
        if (other instanceof ExactNumber) {
            return this.multiply(other.toInexact());
        }
        return new InexactNumber(this.num * other.num);
    };
    InexactNumber.prototype.divide = function (other) {
        if (other instanceof ExactNumber) {
            return this.divide(other.toInexact());
        }
        return new InexactNumber(this.num / other.num);
    };
    InexactNumber.prototype.numerator = function () {
        return this.toExact().numerator();
    };
    InexactNumber.prototype.denominator = function () {
        return this.toExact().denominator();
    };
    InexactNumber.prototype.integerSqrt = function () {
        return new InexactNumber(Math.floor(Math.sqrt(this.num)));
    };
    InexactNumber.prototype.sqrt = function () {
        return new InexactNumber(Math.sqrt(this.num));
    };
    InexactNumber.prototype.abs = function () {
        return new InexactNumber(Math.abs(this.num));
    };
    InexactNumber.prototype.floor = function () {
        return new InexactNumber(Math.floor(this.num));
    };
    InexactNumber.prototype.ceiling = function () {
        return new InexactNumber(Math.ceil(this.num));
    };
    InexactNumber.prototype.round = function () {
        return new InexactNumber(Math.round(this.num));
    };
    InexactNumber.prototype.log = function () {
        return new InexactNumber(Math.log(this.num));
    };
    InexactNumber.prototype.expt = function (power) {
        if (power instanceof ExactNumber) {
            return this.expt(power.toInexact());
        }
        return new InexactNumber(Math.pow(this.num, power.num));
    };
    InexactNumber.prototype.exp = function () {
        return new InexactNumber(Math.exp(this.num));
    };
    InexactNumber.prototype.angle = function () {
        if (0 === this.num)
            return EXACT_ZERO;
        if (this.num > 0)
            return EXACT_ZERO;
        else
            return new InexactNumber(Math.PI);
    };
    InexactNumber.prototype.atan = function () {
        return new InexactNumber(Math.atan(this.num));
    };
    InexactNumber.prototype.cos = function () {
        return new InexactNumber(Math.cos(this.num));
    };
    InexactNumber.prototype.sin = function () {
        return new InexactNumber(Math.sin(this.num));
    };
    InexactNumber.prototype.acos = function () {
        return new InexactNumber(Math.acos(this.num));
    };
    InexactNumber.prototype.asin = function () {
        return new InexactNumber(Math.asin(this.num));
    };
    return InexactNumber;
}(AbstractNumber));
exports.InexactNumber = InexactNumber;
var ExactNumber = /** @class */ (function (_super) {
    __extends(ExactNumber, _super);
    function ExactNumber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExactNumber.makeInstance = function (num, den) {
        if (typeof num === 'bigint' && typeof den === 'bigint') {
            return new BigExactNumber(num, den);
        }
        else if (typeof num === 'number' && typeof den === 'number') {
            return new SmallExactNumber(num, den);
        }
        else {
            throw new TypeError("Numberator and denominator types must match, given ".concat(typeof num, " and ").concat(typeof den));
        }
    };
    return ExactNumber;
}(AbstractNumber));
exports.ExactNumber = ExactNumber;
function isUnsafeInteger(n) {
    return n > Number.MAX_SAFE_INTEGER || n < Number.MIN_SAFE_INTEGER;
}
function isSafeInteger(n) {
    var max = BigInt(Number.MAX_SAFE_INTEGER);
    var min = BigInt(Number.MIN_SAFE_INTEGER);
    return n < max && n > min;
}
// TODO: Jump too BigExactNumber as necessary
var SmallExactNumber = /** @class */ (function (_super) {
    __extends(SmallExactNumber, _super);
    function SmallExactNumber(num, den) {
        if (den === void 0) { den = 1; }
        var _this = _super.call(this) || this;
        if (!Number.isInteger(num) && !Number.isInteger(den)) {
            throw new TypeError("Exact number can only be constructed from integers.");
        }
        if (typeof num === 'number' && typeof den === 'number') {
            // Only the numerator can be negative.
            if (den < 0) {
                num *= -1;
                den *= -1;
            }
            var gcd = _this.gcd(num, den);
            _this.num = num / gcd;
            _this.den = den / gcd;
        }
        else {
            throw new TypeError("Exact value numerator and denominator types must match");
        }
        return _this;
    }
    SmallExactNumber.prototype.gcd = function (a, b) {
        var t;
        while (b !== 0) {
            t = a;
            a = b;
            b = t % b;
        }
        return a;
    };
    SmallExactNumber.prototype.isFinite = function () {
        return true;
    };
    SmallExactNumber.prototype.isInexact = function () {
        return false;
    };
    SmallExactNumber.prototype.isExact = function () {
        return true;
    };
    SmallExactNumber.prototype.isInteger = function () {
        return this.den === 1;
    };
    SmallExactNumber.prototype.toInexact = function () {
        var result = this.num / this.den;
        return new InexactNumber(result);
    };
    SmallExactNumber.prototype.toExact = function () {
        return this;
    };
    SmallExactNumber.prototype.toBigExact = function () {
        return new BigExactNumber(BigInt(this.num), BigInt(this.den));
    };
    SmallExactNumber.prototype.toFixnum = function () {
        return Math.floor(this.num / this.den);
    };
    SmallExactNumber.prototype.toString = function () {
        var num = Math.abs(this.num).toString();
        var den = Math.abs(this.den).toString();
        if (this.isPositive() || this.isZero()) {
            return "".concat(num, "/").concat(den);
        }
        else {
            return "-".concat(num, "/").concat(den);
        }
    };
    SmallExactNumber.prototype.toSignedString = function () {
        if (this.isPositive() || this.isZero()) {
            return "+" + this.toString();
        }
        return this.toString();
    };
    SmallExactNumber.prototype.greaterThan = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().greaterThan(other);
        }
        else if (other instanceof BigExactNumber) {
            return this.toBigExact().greaterThan(other);
        }
        else {
            var thisVal = this.num * other.den;
            var otherVal = this.den * other.den;
            return thisVal > otherVal;
        }
    };
    SmallExactNumber.prototype.greaterThanOrEqual = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().greaterThanOrEqual(other);
        }
        else if (other instanceof BigExactNumber) {
            return this.toBigExact().greaterThanOrEqual(other);
        }
        else {
            var thisVal = this.num * other.den;
            var otherVal = this.den * other.den;
            return thisVal >= otherVal;
        }
    };
    SmallExactNumber.prototype.lessThan = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().lessThan(other);
        }
        else if (other instanceof BigExactNumber) {
            return this.toBigExact().lessThan(other);
        }
        else {
            var thisVal = this.num * other.den;
            var otherVal = this.den * other.den;
            return thisVal < otherVal;
        }
    };
    SmallExactNumber.prototype.lessThanOrEqual = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().lessThanOrEqual(other);
        }
        else if (other instanceof BigExactNumber) {
            return this.toBigExact().lessThanOrEqual(other);
        }
        else {
            var thisVal = this.num * other.den;
            var otherVal = this.den * other.den;
            return thisVal <= otherVal;
        }
    };
    SmallExactNumber.prototype.equals = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().equals(other);
        }
        else if (other instanceof BigExactNumber) {
            return this.toBigExact().equals(other);
        }
        else {
            var thisVal = this.num * other.den;
            var otherVal = this.den * other.den;
            return thisVal === otherVal;
        }
    };
    SmallExactNumber.prototype.isZero = function () {
        return this.num === 0;
    };
    SmallExactNumber.prototype.isPositive = function () {
        return this.num > 0;
    };
    SmallExactNumber.prototype.isNegative = function () {
        return this.num < 0;
    };
    SmallExactNumber.prototype.add = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().add(other);
        }
        else if (other instanceof BigExactNumber) {
            return this.toBigExact().add(other);
        }
        else if (other instanceof SmallExactNumber) {
            var num = (this.num * other.den) + (other.num * this.den);
            var den = this.den * other.den;
            if (isUnsafeInteger(num) || isUnsafeInteger(den)) {
                return this.toBigExact().add(other.toBigExact());
            }
            return new SmallExactNumber(num, den);
        }
        else {
            throw new Error("Cannot add ".concat(this, " to value ").concat(other));
        }
    };
    SmallExactNumber.prototype.subtract = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().subtract(other);
        }
        else if (other instanceof BigExactNumber) {
            return this.toBigExact().subtract(other);
        }
        else if (other instanceof SmallExactNumber) {
            var num = (this.num * other.den) - (other.num * this.den);
            var den = this.den * other.den;
            if (isUnsafeInteger(num) || isUnsafeInteger(den)) {
                return this.toBigExact().subtract(other.toBigExact());
            }
            return new SmallExactNumber(num, den);
        }
        else {
            throw new Error("Cannot subtract ".concat(this, " and ").concat(other));
        }
    };
    SmallExactNumber.prototype.multiply = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().multiply(other);
        }
        else if (other instanceof BigExactNumber) {
            return this.toBigExact().multiply(other);
        }
        else if (other instanceof SmallExactNumber) {
            var num = this.num * other.num;
            var den = this.den * other.den;
            if (isUnsafeInteger(num) || isUnsafeInteger(den)) {
                return this.toBigExact().multiply(other.toBigExact());
            }
            return new SmallExactNumber(num, den);
        }
        else {
            throw new Error("Cannot multiply ".concat(this, " and ").concat(other));
        }
    };
    SmallExactNumber.prototype.divide = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().multiply(other);
        }
        else if (other instanceof BigExactNumber) {
            return this.toBigExact().multiply(other);
        }
        else if (other.isZero()) {
            throw new Error("/: division by zero" + this + other);
        }
        else if (other instanceof SmallExactNumber) {
            var num = this.num * other.den;
            var den = this.den * other.num;
            if (isUnsafeInteger(num) || isUnsafeInteger(den)) {
                return this.toBigExact().divide(other.toBigExact());
            }
            return new SmallExactNumber(num, den);
        }
        else {
            throw new Error("Cannot divide ".concat(this, " and ").concat(other));
        }
    };
    SmallExactNumber.prototype.numerator = function () {
        return new SmallExactNumber(this.num);
    };
    SmallExactNumber.prototype.denominator = function () {
        return new SmallExactNumber(this.den);
    };
    SmallExactNumber.prototype.integerSqrt = function () {
        return this.sqrt().floor();
    };
    SmallExactNumber.prototype.sqrt = function () {
        if (this.isNegative()) {
            throw new Error("Cannot take square root of negative number " + this);
        }
        var num = Math.sqrt(this.num);
        var den = Math.sqrt(this.den);
        if (num === Math.floor(num) && den === Math.floor(den)) {
            return new SmallExactNumber(num, den);
        }
        else {
            return new InexactNumber(num / den);
        }
    };
    SmallExactNumber.prototype.abs = function () {
        if (this.isNegative()) {
            return new SmallExactNumber(-1 * this.num, this.den);
        }
        else {
            return this;
        }
    };
    SmallExactNumber.prototype.floor = function () {
        if (this.den === 1) {
            return this;
        }
        else {
            return new SmallExactNumber(Math.floor(this.num / this.den));
        }
    };
    SmallExactNumber.prototype.ceiling = function () {
        if (this.den === 1) {
            return this;
        }
        else {
            return new SmallExactNumber(Math.ceil(this.num / this.den));
        }
    };
    SmallExactNumber.prototype.round = function () {
        if (this.den === 1) {
            return this;
        }
        else {
            return new SmallExactNumber(Math.round(this.num / this.den));
        }
    };
    SmallExactNumber.prototype.log = function () {
        return new InexactNumber(Math.log(this.num / this.den));
    };
    SmallExactNumber.prototype.expt = function (power) {
        power = power.toInexact();
        if (power.isInteger()) {
            var exp = power.num;
            var num = Math.pow(this.num, exp);
            var den = Math.pow(this.den, exp);
            if (isUnsafeInteger(num) || isUnsafeInteger(den)) {
                return this.toBigExact().expt(power);
            }
            return new SmallExactNumber(num, den);
        }
        else {
            return this.toInexact().expt(power);
        }
    };
    SmallExactNumber.prototype.exp = function () {
        return new InexactNumber(Math.exp(this.num / this.den));
    };
    SmallExactNumber.prototype.angle = function () {
        if (this.isNegative()) {
            return new InexactNumber(Math.PI);
        }
        else {
            return new SmallExactNumber(0);
        }
    };
    SmallExactNumber.prototype.atan = function () {
        return new InexactNumber(Math.atan(this.num / this.den));
    };
    SmallExactNumber.prototype.cos = function () {
        return new InexactNumber(Math.cos(this.num / this.den));
    };
    SmallExactNumber.prototype.sin = function () {
        return new InexactNumber(Math.sin(this.num / this.den));
    };
    SmallExactNumber.prototype.acos = function () {
        return new InexactNumber(Math.acos(this.num / this.den));
    };
    SmallExactNumber.prototype.asin = function () {
        return new InexactNumber(Math.asin(this.num / this.den));
    };
    return SmallExactNumber;
}(ExactNumber));
exports.SmallExactNumber = SmallExactNumber;
// TODO: Drop down to SmallExactNumber as Necessary
var BigExactNumber = /** @class */ (function (_super) {
    __extends(BigExactNumber, _super);
    function BigExactNumber(num, den) {
        if (den === void 0) { den = 1n; }
        var _this = _super.call(this) || this;
        if (typeof num === 'bigint' && typeof den === 'bigint') {
            // Only the numerator can be negative.
            if (den < 0) {
                num *= -1n;
                den *= -1n;
            }
            var gcd = _this.gcd(num, den);
            _this.num = num / gcd;
            _this.den = den / gcd;
        }
        else {
            throw new TypeError("Exact value numerator and denominator types must match");
        }
        return _this;
    }
    BigExactNumber.prototype.gcd = function (a, b) {
        var t;
        while (b !== 0n) {
            t = a;
            a = b;
            b = t % b;
        }
        return a;
    };
    BigExactNumber.prototype.bigintAbs = function (n) {
        if (n < 0n) {
            return -1n * n;
        }
        return n;
    };
    BigExactNumber.prototype.isFinite = function () {
        return true;
    };
    BigExactNumber.prototype.isInexact = function () {
        return false;
    };
    BigExactNumber.prototype.isExact = function () {
        return true;
    };
    BigExactNumber.prototype.isInteger = function () {
        return this.den === 1n;
    };
    BigExactNumber.prototype.toInexact = function () {
        var result = Number(this.num) / Number(this.den);
        return new InexactNumber(result);
    };
    BigExactNumber.prototype.toExact = function () {
        return this;
    };
    BigExactNumber.prototype.toSmallExact = function () {
        return new SmallExactNumber(Number(this.num), Number(this.den));
    };
    BigExactNumber.prototype.toFixnum = function () {
        return this.toInexact().toFixnum();
    };
    BigExactNumber.prototype.toString = function () {
        var num = this.bigintAbs(this.num).toString().slice(0, -1);
        var den = this.bigintAbs(this.den).toString().slice(0, -1);
        return "".concat(num, "/").concat(den);
    };
    BigExactNumber.prototype.toSignedString = function () {
        if (this.isNegative()) {
            return this.toString();
        }
        return "+" + this.toString();
    };
    BigExactNumber.prototype.greaterThan = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().greaterThan(other);
        }
        else if (other instanceof SmallExactNumber) {
            return this.greaterThan(other.toBigExact());
        }
        else if (other instanceof BigExactNumber) {
            var thisVal = this.num * other.den;
            var otherVal = this.den * other.den;
            return thisVal > otherVal;
        }
        else {
            throw new Error("Cannot compare ".concat(this, " and ").concat(other));
        }
    };
    BigExactNumber.prototype.greaterThanOrEqual = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().greaterThanOrEqual(other);
        }
        else if (other instanceof SmallExactNumber) {
            return this.greaterThanOrEqual(other.toBigExact());
        }
        else if (other instanceof BigExactNumber) {
            var thisVal = this.num * other.den;
            var otherVal = this.den * other.den;
            return thisVal >= otherVal;
        }
        else {
            throw new Error("Cannot compare ".concat(this, " and ").concat(other));
        }
    };
    BigExactNumber.prototype.lessThan = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().lessThan(other);
        }
        else if (other instanceof SmallExactNumber) {
            return this.lessThan(other.toBigExact());
        }
        else if (other instanceof BigExactNumber) {
            var thisVal = this.num * other.den;
            var otherVal = this.den * other.den;
            return thisVal < otherVal;
        }
        else {
            throw new Error("Cannot compare ".concat(this, " and ").concat(other));
        }
    };
    BigExactNumber.prototype.lessThanOrEqual = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().lessThanOrEqual(other);
        }
        else if (other instanceof SmallExactNumber) {
            return this.lessThanOrEqual(other.toBigExact());
        }
        else if (other instanceof BigExactNumber) {
            var thisVal = this.num * other.den;
            var otherVal = this.den * other.den;
            return thisVal <= otherVal;
        }
        else {
            throw new Error("Cannot compare ".concat(this, " and ").concat(other));
        }
    };
    BigExactNumber.prototype.equals = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().equals(other);
        }
        else if (other instanceof SmallExactNumber) {
            return this.equals(other.toBigExact());
        }
        else if (other instanceof BigExactNumber) {
            var thisVal = this.num * other.den;
            var otherVal = this.den * other.den;
            return thisVal === otherVal;
        }
        else {
            throw new Error("Cannot compare ".concat(this, " and ").concat(other));
        }
    };
    BigExactNumber.prototype.isZero = function () {
        return this.num === 0n;
    };
    BigExactNumber.prototype.isPositive = function () {
        return this.num > 0n;
    };
    BigExactNumber.prototype.isNegative = function () {
        return this.num < 0n;
    };
    BigExactNumber.prototype.add = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().add(other);
        }
        else if (other instanceof SmallExactNumber) {
            return this.add(other.toBigExact());
        }
        else if (other instanceof BigExactNumber) {
            var num = (this.num * other.den) + (other.num * this.den);
            var den = this.den * other.den;
            if (isSafeInteger(num) && isSafeInteger(den)) {
                return this.toSmallExact().add(other.toSmallExact());
            }
            return new BigExactNumber(num, den);
        }
        else {
            throw new Error("Cannot add ".concat(this, " and ").concat(other));
        }
    };
    BigExactNumber.prototype.subtract = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().add(other);
        }
        else if (other instanceof SmallExactNumber) {
            return this.add(other.toBigExact());
        }
        else if (other instanceof BigExactNumber) {
            var num = (this.num * other.den) - (other.num * this.den);
            var den = this.den * other.den;
            if (isSafeInteger(num) && isSafeInteger(den)) {
                return this.toSmallExact().subtract(other.toSmallExact());
            }
            return new BigExactNumber(num, den);
        }
        else {
            throw new Error("Cannot subtract ".concat(this, " and ").concat(other));
        }
    };
    BigExactNumber.prototype.multiply = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().add(other);
        }
        else if (other instanceof SmallExactNumber) {
            return this.add(other.toBigExact());
        }
        else if (other instanceof BigExactNumber) {
            var num = this.num * other.num;
            var den = this.den * other.den;
            if (isSafeInteger(num) && isSafeInteger(den)) {
                return this.toSmallExact().multiply(other.toSmallExact());
            }
            return new BigExactNumber(num, den);
        }
        else {
            throw new Error("Cannot multiply ".concat(this, " and ").concat(other));
        }
    };
    BigExactNumber.prototype.divide = function (other) {
        if (other instanceof InexactNumber) {
            return this.toInexact().add(other);
        }
        else if (other instanceof SmallExactNumber) {
            return this.add(other.toBigExact());
        }
        else if (other instanceof BigExactNumber) {
            var num = this.num * other.den;
            var den = this.den * other.num;
            if (isSafeInteger(num) && isSafeInteger(den)) {
                return this.toSmallExact().divide(other.toSmallExact());
            }
            return new BigExactNumber(num, den);
        }
        else {
            throw new Error("Cannot divide ".concat(this, " and ").concat(other));
        }
    };
    BigExactNumber.prototype.numerator = function () {
        return new BigExactNumber(this.num);
    };
    BigExactNumber.prototype.denominator = function () {
        return new BigExactNumber(this.den);
    };
    BigExactNumber.prototype.integerSqrt = function () {
        return this.sqrt().floor();
    };
    BigExactNumber.prototype.sqrt = function () {
        return this.toSmallExact().sqrt();
    };
    BigExactNumber.prototype.abs = function () {
        if (this.isNegative()) {
            return new BigExactNumber(this.num * -1n, this.den);
        }
        else {
            return this;
        }
    };
    BigExactNumber.prototype.floor = function () {
        if (this.den === 1n) {
            return this;
        }
        else {
            return new BigExactNumber(this.num / this.den);
        }
    };
    BigExactNumber.prototype.ceiling = function () {
        if (this.den === 1n) {
            return this;
        }
        else {
            return new BigExactNumber((this.num / this.den) + 1n);
        }
    };
    BigExactNumber.prototype.round = function () {
        if (this.den === 1n) {
            return this;
        }
        else {
            var floor = this.floor();
            var floordiff = this.subtract(floor);
            var ceil = this.ceiling();
            var ceildiff = ceil.subtract(this);
            if (ceildiff.greaterThan(floordiff)) {
                return ceil;
            }
            else {
                return floor;
            }
        }
    };
    BigExactNumber.prototype.log = function () {
        return this.toSmallExact().log();
    };
    BigExactNumber.prototype.expt = function (power) {
        power = power.toInexact();
        if (power.isInteger()) {
            var exp = power.num;
            var result = this;
            for (var i = 1; i < exp; i++) {
                result = result.multiply(this);
            }
            return result;
        }
        return this.toSmallExact().expt(power);
    };
    BigExactNumber.prototype.exp = function () {
        return this.toSmallExact().exp();
    };
    BigExactNumber.prototype.angle = function () {
        return new BigExactNumber(0n);
    };
    BigExactNumber.prototype.atan = function () {
        return this.toSmallExact().atan();
    };
    BigExactNumber.prototype.cos = function () {
        return this.toSmallExact().cos();
    };
    BigExactNumber.prototype.sin = function () {
        return this.toSmallExact().sin();
    };
    BigExactNumber.prototype.acos = function () {
        return this.toSmallExact().acos();
    };
    BigExactNumber.prototype.asin = function () {
        return this.toSmallExact().asin();
    };
    return BigExactNumber;
}(ExactNumber));
exports.BigExactNumber = BigExactNumber;
var EXACT_ZERO = new SmallExactNumber(0);
