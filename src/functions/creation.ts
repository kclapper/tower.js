import {
    RacketNumber,
    BoxedNumber,
    JSInteger,
    JSNumber,
    makeRectangular,
    NAN,
    INF,
    NEG_INF
} from '../tower';
import {
    normalize,
} from './util';

export function toFixnum(n: RacketNumber): JSInteger {
    if (n instanceof BoxedNumber) {
        return n.toFixnum();
    }
    return n;
}

export function fromJSNumber(n: JSNumber): RacketNumber {
    if (typeof n === 'bigint') {
        return n;
    } else {
        return Number.isInteger(n) ? n : BoxedNumber.makeInstance({num: n});
    }
}

export function boxFixnum(n: JSInteger): BoxedNumber {
    return typeof n === 'number' ? BoxedNumber.makeInstance({num: n, den: 1}) : BoxedNumber.makeInstance({num: n, den: 1n});
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

        return BoxedNumber.makeInstance({num: Number(realStr), imagNum: Number(imagStr)});
    }

    if (str === '+nan.0' || str === '-nan.0' || str === '+nan.f' || str === '-nan.f' ) {
        return NAN;
    } else if (str === '+inf.0' || str === '+inf.f') {
        return INF;
    } else if (str === '-inf.0' || str === '-inf.f') {
        return NEG_INF;
    } else if (str === '-0.0') {
        return BoxedNumber.makeInstance({num: -0.0});
    }

    if (str.match(decimalRegexp) || str.match(scientificRegexp)) {
        return BoxedNumber.makeInstance({num: Number(str)});
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
    const [num, den] = parseFraction(str) as [number, number];
    return BoxedNumber.makeInstance({num: num, den: den});
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
    return normalize(BoxedNumber.makeInstance({num: num as number, den: den as number}));
}

export function makeComplexNumber(num: JSNumber, imagNum: JSNumber, den?: JSInteger, imagDen?: JSInteger): RacketNumber {
    return normalize(BoxedNumber.makeInstance({num: num as number, den: den as number, imagNum: imagNum as number, imagDen: imagDen as number}));
}

// For backwards compatibility with js-numbers.
export function makeFloat(n: number): RacketNumber {
    return normalize(BoxedNumber.makeInstance({num: n}));
}
export function makeRational(n: number, d: number): RacketNumber {
    return normalize(BoxedNumber.makeInstance({num: n, den: d}));
}
export function makeComplex(real: RacketNumber, imag: RacketNumber): RacketNumber {
    return  makeRectangular(real, imag);
}
