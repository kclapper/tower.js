---
slug: /
sidebar_position: 1
---

# Overview 

Tower.js is an implementation of the [Racket numeric](https://docs.racket-lang.org/guide/numbers.html)
tower in Typescript. It gives you the ability to use exact numbers, complex numbers, and 
arbitrary precision numbers. This library is based on the [js-numbers](https://github.com/dyoo/js-numbers) library, 
originally written by dyoo.

## Installation

Tower.js can be installed using npm and used from either Javascript or Typescript files.

```bash
npm install tower.js@latest
```

## Types

Tower.js functions operate on `RacketNumber`s.

```typescript
type RacketNumber = number | BoxedNumber;
```

It can either be an unboxed Javascript `number` or one of the boxed number classes. Boxed numbers are
either `InexactNumber`, `SmallExactNumber`, `BigExactNumber`, or `ComplexNumber`. The difference
between `SmallExactNumber` and `BigExactNumber` is that `BigExactNumber` can be arbitrarily large and takes `bigint`s in 
the constructor. Tower.js will use unboxed `number`s where possible
to increase performance.

## Usage 

Tower.js implements many of the Racket numeric functions. For a full list of
available functions and links to their corresponding Racket doc, go to the
[Functions](./functions) page.

```typescript
import { 
    ONE,
    add,
    subtract,
    multiply,
    divide
} from 'tower.js';


const two = add(ONE, ONE);
const three = add(ONE, ONE, ONE);

const one = subtract(three, two);

const six = multiply(three, two, one);

const five = divide(add(six, three, one), two); 
```

Numbers are primarily created by parsing strings. The Racket string representation of a number will be 
parsed into it's Tower.js equivalent. For example:

```typescript
import { fromString } from 'tower.js';

const exactFive = fromString('5');
const inexactFive = fromString('5.0');

const exactComplex = fromString('5+3i'); 
const inexactComplex = fromString('5.0+3.0i'); 
```

For more information on ways to create `RacketNumbers`, see the [Creation page](/creation).

## Example 

Here is an example of factorial using Tower.js.

```typescript 
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

function factorial(n: RacketNumber): RacketNumber {
    if (equals(n, ZERO)) {
        return ONE;
    }
    return multiply(n, subtract(n, ONE));
}

let result = factorial(fromString("5"));
console.log(numberToString(result)); // "20"

result = factorial(fromString("5.0"));
console.log(numberToString(result)); // "20.0"

result = factorial(fromString("5+3i"));
console.log(numberToString(result)); // "11+27i"
```
