import {
    RacketNumber,
    BoxedNumber,
    SmallExactNumber,
    BigExactNumber,
    ComplexNumber,
    InexactNumber,
    makeRectangular,
    ExactNumber,
} from '../tower';

export function boxNumber(n: RacketNumber): BoxedNumber {
    if (typeof n === 'number') {
        return new InexactNumber(n);
    }
    return n;
}

const fractionRegexp = new RegExp("^([+-]?\\d+)/(\\d+)$");
const complexRegexp = new RegExp("^([+-]?[\\d\\w/\\.]*)([+-])([\\d\\w/\\.]*)i$");
const integerRegexp = new RegExp("^[+-]?\\d+$");
const decimalRegexp = new RegExp("^([+-]?\\d*)\\.(\\d*)$");
const scientificRegexp = new RegExp("^([+-]?\\d*\\.?\\d*)[Ee](\\+?\\d+)$");

export function fromString(str: string): RacketNumber | false {
    str = str.toString(); // For backwards compatibility with js-numbers

    const matchExact = str.match(fractionRegexp);
    if (matchExact) {
        return parseExact(str);
    }

    const matchComplex = str.match(complexRegexp);
    if (matchComplex) {
        const realStr = matchComplex[1] || "0";
        const imagStr = matchComplex[2] + (matchComplex[3] || "1");

        if (complexIsExact(matchComplex)) {
            const real = parseExact(realStr);
            const imag = parseExact(imagStr);
            return makeRectangular(real, imag);
        }

        const real = new InexactNumber(Number(realStr));
        const imag = new InexactNumber(Number(imagStr));

        return new ComplexNumber(real, imag);
    }

    if (str === '+nan.0' || str === '-nan.0' || str === '+nan.f' || str === '-nan.f' ) {
        return NaN;
    } else if (str === '+inf.0' || str === '+inf.f') {
        return Infinity;
    } else if (str === '-inf.0' || str === '-inf.f') {
        return -Infinity;
    } else if (str === '-0.0') {
        return -0;
    }

    if (str.match(decimalRegexp) || str.match(scientificRegexp)) {
        return Number(str);
    }

    if (str.match(integerRegexp)) {
        return parseInteger(str);
    }

    return false;
}

function complexIsExact(matched: string[]): boolean {
    const real = matched[1].match(integerRegexp) !== null || matched[1].match(fractionRegexp) !== null;
    const imag = matched[3].match(integerRegexp) !== null || matched[3].match(fractionRegexp) !== null;
    return real && imag;
}

function parseExact(str: string): RacketNumber {
    const matchInteger = str.match(integerRegexp);
    if (matchInteger) {
        return parseInteger(str);
    }
    return parseFraction(str);
}

function parseInteger(str: string): ExactNumber {
    const n = Number(str);
    if (Number.isSafeInteger(n)) {
        return new SmallExactNumber(n);
    }
    return new BigExactNumber(BigInt(str));
}

function parseFraction(str: string): RacketNumber {
    const match = str.match(fractionRegexp);
    if (match) {
        let num = parseInteger(match[1]).num;
        let den = parseInteger(match[2]).num;

        if (typeof num === 'bigint' || typeof den === 'bigint') {
            num = BigInt(num);
            den = BigInt(den);

            return new BigExactNumber(num, den);
        }

        return new SmallExactNumber(num, den);
    }
    throw new Error(`Fraction not found in ${str}`);
}

// For backwards compatibility with js-numbers.
export function makeFloat(n: number): RacketNumber {
    return new InexactNumber(n);
}
export function makeRational(n: number, d: number): RacketNumber {
    if (!Number.isInteger(n) || !Number.isInteger(d)) {
        throw new TypeError("numerator and denominator must be integers.")
    }
    return new SmallExactNumber(n, d);
}
export function makeComplex(real: RacketNumber, imag: RacketNumber): RacketNumber {
    return  makeRectangular(real, imag);
}
