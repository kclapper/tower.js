import { BoxedNumber } from './BoxedNumber';

export type RacketNumber = JSInteger | BoxedNumber;

export type JSNumber = number | bigint;

export type JSInteger = JSNumber;

export enum Level {
    INTEGER,
    RATIONAL,
    REAL,
    COMPLEX
}
