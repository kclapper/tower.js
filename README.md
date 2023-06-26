# tower.js

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


// Numbers can be Javascript integers, bigints, or
// tower.js boxed numbers. Javascript integers and 
// bigints are treated as exact integers.
let exactFive = 5;
let exactTen = 10n;

// Numbers can be parsed from strings. Invalid strings 
// will return false (hence the cast).
let inexactFive = fromString("5.0") as RacketNumber;
let complex = fromString("5+3i") as RacketNumber;

// Factorial
function factorial(n: RacketNumber): RacketNumber {
    if (equals(n, 0)) {
        return 1;
    }
    return multiply(n, subtract(n, 1));
}

let result = factorial(exactFive);
console.log(numberToString(result)); // "20"

result = factorial(inexactFive);
console.log(numberToString(result)); // "20.0"

result = factorial(complex);
console.log(numberToString(result)); // 11+27i
```

## Installation

`npm install tower.js`
