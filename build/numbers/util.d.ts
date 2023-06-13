import { JSInteger, JSNumber } from './main';
export declare function isJSNumber(n: any): n is JSNumber;
export declare function isJSInteger(n: any): n is JSInteger;
export declare function integerIsOne(n: JSInteger): boolean;
export declare function numberIsRational(n: JSNumber): boolean;
export declare function fastExpt(n: JSInteger, k: JSInteger): JSInteger;
