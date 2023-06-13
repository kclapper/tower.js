"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastExpt = exports.numberIsRational = exports.integerIsOne = exports.isJSInteger = exports.isJSNumber = void 0;
function isJSNumber(n) {
    return typeof n === 'number' || typeof n === 'bigint';
}
exports.isJSNumber = isJSNumber;
function isJSInteger(n) {
    return Number.isInteger(n) || typeof n === 'bigint';
}
exports.isJSInteger = isJSInteger;
function integerIsOne(n) {
    var isInteger = isJSInteger(n);
    var isOne = typeof n === 'bigint' ? n === 1n : n === 1;
    return isInteger && isOne;
}
exports.integerIsOne = integerIsOne;
function numberIsRational(n) {
    var isBigInt = typeof n === 'bigint';
    var isRationalFloat = Number.isFinite(n) && !Number.isNaN(n);
    return isBigInt || isRationalFloat;
}
exports.numberIsRational = numberIsRational;
// TODO: Make it so it automatically escalates to bigint.
function fastExpt(n, k) {
    var zero, one, two;
    if (typeof n === 'number' && typeof k === 'number') {
        zero = 0;
        one = 1;
        two = 2;
    }
    else if (typeof n === 'bigint' && typeof k === 'bigint') {
        zero = 0n;
        one = 1n;
        two = 2n;
    }
    else {
        throw new TypeError("n and k types must match.");
    }
    var acc = one;
    while (true) {
        if (k === zero) {
            return acc;
        }
        // HACK: need to cast to number even though ops are defined for both
        // number and bigint.
        if (k % two === zero) {
            n = n * n;
            k = k / two;
        }
        else {
            acc = acc * n;
            k = k - one;
        }
    }
}
exports.fastExpt = fastExpt;
