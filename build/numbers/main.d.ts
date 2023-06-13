import { BoxedNumber } from './BoxedNumber';
export type RacketNumber = JSInteger | BoxedNumber;
export type JSNumber = number | bigint;
export type JSInteger = JSNumber;
export declare enum Level {
    INTEGER = 0,
    RATIONAL = 1,
    REAL = 2,
    COMPLEX = 3
}
