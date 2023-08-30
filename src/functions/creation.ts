import {
    RacketNumber,
    Fixnum,
    Flonum,
    JSInteger,
    BoxedNumber,
    SmallExactNumber,
    BigExactNumber,
    InexactNumber,
    ExactNumber,
    isSafeInteger,
} from '../numbers/index';
import {
    makeRectangular,
} from './index';

export function boxNumber(n: RacketNumber): BoxedNumber {
    if (typeof n === 'number') {
        return new InexactNumber(n);
    }

    if (typeof n === 'bigint') {
        if (isSafeInteger(n)) {
            return new SmallExactNumber(Number(n));
        }
        return new BigExactNumber(n);
    }

    return n;
}

const fractionRegexp = /^([+-]?\d+)\/(\d+)$/;
const integerRegexp = /^[+-]?\d+$/;
const decimalRegexp = /^([+-]?\d*)\.(\d*)$/;
const scientificRegexp = /^([+-]?\d*\.?\d*)[Ee]([+-]?\d+)$/;

const nanRegexp = /^([+-]nan.[0f])$/;
const infRegexp = /^([+-]inf.[0f])$/;

const unsignedNumber = "((\\d+\\/\\d+)|(\\d*(\\.\\d*)?([Ee][+-]?\\d+)?))";
const nonFinite = `(([+-]inf.[0f])|([+-]nan.[0f]))`;
const realPart = `([+-]?${unsignedNumber})|${nonFinite}`;
const imagPart = `([+-]${unsignedNumber})|${nonFinite}`;
const complexRegexp = new RegExp(`^(${realPart})(${imagPart})i$`);

export function fromString(str: string): RacketNumber {
    str = str.toString(); // For backwards compatibility with js-numbers

    const matchExact = str.match(fractionRegexp);
    if (matchExact) {
        return parseExact(str);
    }

    const matchComplex = str.match(complexRegexp);
    if (matchComplex) {
        const realStr = matchComplex[1] || "0";
        const imagStr = matchComplex[11];

        return makeRectangular(fromString(realStr), fromString(imagStr));
    }

    const nanMatch = str.match(nanRegexp);
    if (nanMatch) {
        return NaN;
    }

    const infMatch = str.match(infRegexp);
    if (infMatch) {
        const sign = infMatch[0].charAt(0);
        return sign === '+' ? Infinity : -Infinity;
    }

    if (str === '-0.0') {
        return -0;
    }

    if (str.match(decimalRegexp) || str.match(scientificRegexp)) {
        return Number(str);
    }

    if (str.match(integerRegexp)) {
        return parseInteger(str);
    }

    throw new Error(`Unable to parse a RacketNumber from ${str}`);
}

function parseExact(str: string): RacketNumber {
    const matchInteger = str.match(integerRegexp);
    if (matchInteger) {
        return parseInteger(str);
    }
    return parseFraction(str);
}

function parseInteger(str: string): Fixnum {
    return BigInt(str);
    //const n = Number(str);
    //if (Number.isSafeInteger(n)) {
    //    return new SmallExactNumber(n);
    //}
    //return new BigExactNumber(BigInt(str));
}

function parseFraction(str: string): ExactNumber {
    const match = str.match(fractionRegexp);
    if (match) {
        const num = parseInteger(match[1]);
        const den = parseInteger(match[2]);

        if (isSafeInteger(num) && isSafeInteger(den)) {
            return new SmallExactNumber(Number(num), Number(den));
        }

        return new BigExactNumber(num, den);
    }
    throw new Error(`Fraction not found in ${str}`);
}

// For backwards compatibility with js-numbers.
export function makeFloat(n: number): Flonum {
    return n;
}
export function makeExact(n: JSInteger, d?: JSInteger): RacketNumber {
    if (d !== undefined) {
        if (typeof n !== typeof d) {
            throw new TypeError("numerator and denominator must be same type.");
        }
        if (typeof n === 'number' && (!Number.isInteger(n) || !Number.isInteger(d))) {
            throw new TypeError("numerator and denominator must be integers");
        }

        if (isSafeInteger(n) && isSafeInteger(d)) {
            return new SmallExactNumber(Number(n), Number(d));
        }

        return new BigExactNumber(BigInt(n), BigInt(d));
    }

    if (isSafeInteger(n)) {
        return new SmallExactNumber(Number(n));
    }

    return new BigExactNumber(BigInt(n));
}

// For backwards compatibility with js-numbers.
export function makeRational(n: number, d: number): RacketNumber {
    if (!Number.isInteger(n) || !Number.isInteger(d)) {
        throw new TypeError("numerator and denominator must be integers.")
    }
    return new SmallExactNumber(n, d);
}

export function makeComplex(real: RacketNumber, imag: RacketNumber): RacketNumber {
    return  makeRectangular(real, imag);
}
