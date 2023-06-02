type Value = number | string;
declare class Complex {
    private imag;
    private real;
    constructor(real: Value, imag: Value);
}
