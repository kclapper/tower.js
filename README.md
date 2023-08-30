# tower.js

[![Test tower.js](https://github.com/kclapper/tower.js/actions/workflows/test.yml/badge.svg?event=push)](https://github.com/kclapper/tower.js/actions/workflows/test.yml)

A Typescript implementation of [the Racket numeric
tower](https://docs.racket-lang.org/reference/numbers.html). This is a rewrite
of the [js-numbers library by Danny Yoo](https://github.com/dyoo/js-numbers).

Tower.js is an implementation of the [Racket numeric](https://docs.racket-lang.org/guide/numbers.html)
tower in Typescript. It gives you the ability to use exact numbers, complex numbers, and 
arbitrary precision numbers. This library is based on the [js-numbers](https://github.com/dyoo/js-numbers) library, 
originally written by dyoo.

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

// Numbers can be Javascript numbers, bigints, or
// tower.js boxed numbers. 

// Javascript numbers are treated as 
// inexact real numbers.
let inexactTwo = 2;

// Javascript bigints are treated as 
// exact integers.
let exactTwo = 2n;

// Numbers can be parsed from strings.
let inexactFive = fromString("5.0");
let exactFive = fromString("5");
let complex = fromString("5+3i");

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

`npm install tower.js@latest`

## Documentation 

Documentation can be found at this repositories [Github Pages site](https://kclapper.github.io/tower.js/).

## Bugs and Contributing 

Bug reports are appreciated, please open an Issue on this repository. If you'd
like to fix an issue or have a contribution to suggest, feel free to open a pull
request. If the contribution is large, you should open a draft PR first to
suggest it first before writing all of the code.
