import {
    RacketNumber,
    BoxedNumber,
    RealNumber,
    isBoxedNumber,
    SmallExactNumber,
    BigExactNumber,
    ComplexNumber,
    JSInteger,
    JSNumber,
    InexactNumber,
    makeRectangular,
    EXACT_ZERO,
    INEXACT_NEG_ZERO,
    NAN,
    INF,
    NEG_INF,
} from '../tower';
import { isJSInteger, isSafeInteger } from '../util';

export function toFixnum(n: RacketNumber): JSInteger {
    if (isBoxedNumber(n)) {
        return n.toFixnum();
    }
    return n;
}

export function fromJSNumber(n: JSNumber): RacketNumber {
    if (typeof n === 'bigint') {
        return n;
    } else {
        return Number.isInteger(n) ? n : new InexactNumber(n);
    }
}

export function boxFixnum(n: JSInteger): BoxedNumber {
    return typeof n === 'number' ? new SmallExactNumber(n) : new BigExactNumber(n);
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
        return NAN;
    } else if (str === '+inf.0' || str === '+inf.f') {
        return INF;
    } else if (str === '-inf.0' || str === '-inf.f') {
        return NEG_INF;
    } else if (str === '-0.0') {
        return INEXACT_NEG_ZERO;
    }

    if (str.match(decimalRegexp) || str.match(scientificRegexp)) {
        return new InexactNumber(Number(str));
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
    const [num, den] = parseFraction(str);

    if (typeof num === 'number') {
        return new SmallExactNumber(num, den as number);
    } else {
        return new BigExactNumber(num, den as bigint);
    }
}

function parseInteger(str: string): JSInteger {
    const n = Number(str);
    if (Number.isSafeInteger(n)) {
        return n;
    } else if (Number.isInteger(n)) {
        return BigInt(str);
    } else {
        throw new Error(`${str} is not an integer`);
    }
}

function parseFraction(str: string): JSInteger[] {
    const match = str.match(fractionRegexp);
    if (match) {
        let num = parseInteger(match[1]);
        let den = parseInteger(match[2]);

        if (typeof num !== typeof den) {
            num = BigInt(num);
            den = BigInt(den);
        }

        return [num, den];
    }
    throw new Error(`Fraction now found in ${str}`);
}

export function makeNumber(num: JSNumber, den?: JSInteger): RacketNumber {
    if (den === undefined || den === 1 || den === 1n) {
        if (isSafeInteger(num)) {
            return Number(num);
        } else if (typeof num === 'bigint') {
            return num;
        } else if (typeof num === 'number' && Number.isInteger(num)) {
            return BigInt(num);
        } else {
            return new InexactNumber(num);
        }
    }

    if (!isJSInteger(num) || !isJSInteger(den)) {
        throw new TypeError("Numerator and denominator must be integers");
    }

    if (den === 1 || den === 1n) {
        return num;
    }

    if (typeof num !== typeof den) {
        num = BigInt(num);
        den = BigInt(den);
        return new BigExactNumber(num, den);
    }

    if (typeof num === 'bigint') {
        return new BigExactNumber(num, den as bigint);
    }

    return new SmallExactNumber(num, den as number);
}

export function makeComplexNumber({num}: {num: number}): BoxedNumber;

export function makeComplexNumber({num, imagNum}: {num: bigint, imagNum: bigint}): BoxedNumber;
export function makeComplexNumber({num, den}: {num: bigint, den: bigint}): BoxedNumber;
export function makeComplexNumber({num, den, imagNum, imagDen}:
                                  {num: bigint, den: bigint, imagNum: bigint, imagDen: bigint}): BoxedNumber;

export function makeComplexNumber({num, imagNum}: {num: number, imagNum: number}): BoxedNumber;
export function makeComplexNumber({num, den}: {num: number, den: number}): BoxedNumber;
export function makeComplexNumber({num, den, imagNum,  imagDen}:
                                  {num: number, den: number, imagNum: number, imagDen: number}): BoxedNumber;

export function makeComplexNumber({num, den, imagNum, imagDen}:
                                  {num: JSNumber, den?: JSInteger, imagNum?: JSNumber, imagDen?: JSInteger}): BoxedNumber {
        const isReal = imagNum === undefined;
        if (isReal && imagDen !== undefined) {
           throw new Error("Must specify both a numerator and denominator.");
        }

        const denominatorsExist = den !== undefined && imagDen !== undefined;
        if (!isReal && !denominatorsExist && (den !== undefined || imagDen !== undefined)) {
            throw new Error("Real and imaginary part must be the same exactness.")
        }

        let isExact;
        if (isReal) {
            isExact = den !== undefined
                && isJSInteger(num)
                && isJSInteger(den);
        } else {
            isExact = den !== undefined
                && isJSInteger(num)
                && isJSInteger(den)
                && imagDen != undefined
                && isJSInteger(imagNum)
                && isJSInteger(imagDen);
        }

        if (!isExact && typeof num === 'bigint') {
            throw new TypeError("bigints can only be used with exact numbers");
        }

        let typesAreSame: boolean;
        if (isReal && isExact) {
            typesAreSame = typeof num === typeof den;
        } else if (isReal && !isExact) {
            typesAreSame = true;
        } else if (!isReal && isExact) {
            typesAreSame = typeof num === typeof imagNum
                && typeof den === typeof imagDen
                && typeof num === typeof den;
        } else {
            typesAreSame = typeof num === typeof imagNum;
        }
        if (!typesAreSame) {
            throw new TypeError("All makeInstance arguments must be the same type.")
        }

        const isBig = typeof num === 'bigint';

        let realVal: RealNumber, imagVal: RealNumber;
        if (isReal && isExact && isBig) {
            realVal = new BigExactNumber(num as bigint, den as bigint);
            imagVal = EXACT_ZERO;
        } else if (isReal && isExact && !isBig) {
            realVal = new SmallExactNumber(num as number, den as number);
            imagVal = EXACT_ZERO;
        } else if (isReal && !isExact) {
            realVal = new InexactNumber(num as number);
            imagVal = EXACT_ZERO;
        } else if (!isReal && isExact && isBig) {
            realVal = new BigExactNumber(num as bigint, den as bigint);
            imagVal = new BigExactNumber(imagNum as bigint, imagDen as bigint);
        } else if (!isReal && isExact && !isBig) {
            realVal = new SmallExactNumber(num as number, den as number);
            imagVal = new SmallExactNumber(imagNum as number, imagDen as number);
        } else if (!isReal && !isExact && !isBig) {
            realVal = new InexactNumber(num as number);
            imagVal = new InexactNumber(imagNum as number);
        } else {
            // Should never get here
            throw new Error(`Error creating Number`);
        }

        return new ComplexNumber(realVal, imagVal);
    }

// For backwards compatibility with js-numbers.
export function makeFloat(n: number): RacketNumber {
    return new InexactNumber(n);
}
export function makeRational(n: JSInteger, d: JSInteger): RacketNumber {
    return makeNumber(n, d);
}
export function makeComplex(real: RacketNumber, imag: RacketNumber): RacketNumber {
    return  makeRectangular(real, imag);
}
