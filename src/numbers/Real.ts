import { Complex } from './Complex';
import { Value } from './Value';
import { JSInteger } from './main';

export class Real extends Complex {
    protected readonly n: Value;

    constructor(n: Value) {
        super(n);
        this.n = this.real; // Simple alias.
    }

    public static makeInstance(n: number): Real;
    public static makeInstance(n: bigint): Real;
    public static makeInstance(n: number, d: number): Real;
    public static makeInstance(n: bigint, d: bigint): Real;
    public static makeInstance(n: JSInteger, d?: JSInteger): Real {
        if (d !== undefined && typeof n !== typeof d) {
            throw new TypeError("Numerator and denominator must be same type.");
        }

        let zero = typeof n === 'number' ? 0 : 0n;

        if (d !== undefined) {
            return super.makeInstance(n, d);
        }
        super.makeInstance(n, 0)
    }
}
