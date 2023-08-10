# tower.js

[![Test tower.js](https://github.com/kclapper/tower.js/actions/workflows/test.yml/badge.svg?event=push)](https://github.com/kclapper/tower.js/actions/workflows/test.yml)

A Typescript implementation of [the Racket numeric
tower](https://docs.racket-lang.org/reference/numbers.html). This is a rewrite
of the [js-numbers library by Danny Yoo](https://github.com/dyoo/js-numbers).

This library is meant to be used in a functional style and mainly consists of
functions that mirror their counterpart from Racket. Racket numbers are
represented as either Javascript numbers, bigints, or a custom class. These
numbers should be manipulated with the library functions instead of with
Javascript operators, functions, or with the methods on the custom class.

## Example

``` typescript
// factorial.js
import {
    RacketNumber,
    numberToString,
    fromString,
    multiply,
    subtract,
    equals,
    ZERO,
    ONE,
} from 'tower.js';


// Numbers can be Javascript numbers or
// tower.js boxed numbers. Javascript numbers
// are treated as inexact real numbers.
let inexactFive = 5;

// Numbers can be parsed from strings. Invalid strings 
// will return false (hence the cast).
let inexactFive = fromString("5.0") as RacketNumber;
let exactFive = fromString("5") as RacketNumber;
let complex = fromString("5+3i") as RacketNumber;

// Factorial
function factorial(n: RacketNumber): RacketNumber {
    if (equals(n, ZERO)) {
        return ONE;
    }
    return multiply(n, subtract(n, ONE));
}

let result = factorial(exactFive);
console.log(numberToString(result)); // "20"

result = factorial(inexactFive);
console.log(numberToString(result)); // "20.0"

result = factorial(complex);
console.log(numberToString(result)); // "11+27i"
```

## Installation

`npm install tower.js`
