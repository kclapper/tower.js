# Creating Numbers

Numbers are primarily created by parsing strings. The Racket string representation of a number will be 
parsed into it's Tower.js equivalent. For example:

```typescript
import { fromString } from 'tower.js';

const exactFive = fromString('5');
const inexactFive = fromString('5.0');

const exactComplex = fromString('5+3i'); 
const inexactComplex = fromString('5.0+3.0i'); 
```

Boxed numbers can also be created using their respective classes. 

```typescript 
import { 
    SmallExactNumber,
    InexactNumber,
    ComplexNumber
} from 'tower.js';

const exactFive = new SmallExactNumber(5);
const exactHalf = new SmallExactNumber(1, 2);

const inexactFive = new InexactNumber(5);

const exactComplex = new ComplexNumber(exactFive, half); // 5+1/2i
```

### InexactNumber

Takes a single `number` in the constructor. 

```typescript
const inexactFive = new InexactNumber(5);
```

### SmallExactNumber

Takes either a single `number` or a separate numerator and
denominator in the constructor. 

```typescript 
const exactFive = new SmallExactNumber(5);
const exactHalf = new SmallExactNumber(1, 2);
```

### BigExactNumber

Takes either a single `bigint` or a separate numerator and
denominator in the constructor. A `BigExactNumber` can be arbitrarily
large.

```typescript 
const exactFive = new BigExactNumber(5n);
const exactHalf = new BigExactNumber(1n, 2n);
```

### ComplexNumber

Takes two other boxed numbers representing the real and imaginary
parts.

```typescript
const exactFive = new SmallExactNumber(5);
const exactHalf = new SmallExactNumber(1, 2);

const complex = new ComplexNumber(exactFive, exactHalf); // 5+1/2i
```

## Constants

For convenience, the following constants are available also: 

Exact Numbers:

- `EXACT_ZERO` (or `ZERO`)
- `EXACT_ONE` (or `ONE`)
- `EXACT_HALF` (or `HALF`)
- `EXACT_TWO` (or `TWO`)
- `EXACT_NEG_ONE` (or `NEG_ONE`)

Inexact Numbers:

- `INEXACT_ZERO`
- `INEXACT_NEG_ZERO`
- `INEXACT_ONE`
- `INEXACT_HALF`
- `INEXACT_TWO`
- `INEXACT_NEG_ONE`
- `PI` 
- `INF` 
- `NEG_INF` 
- `NAN` 

Complex Numbers:

- `EXACT_I` ( or `I` )
- `EXACT_NEG_I` (or `NEG_I`)
- `INEXACT_I`
- `INEXACT_NEG_I`


## Functions

A few functions are available to create `RacketNumber`s as well.

### fromString 

Parses a string to a `RacketNumber`. The string representation of 
a Racket number will be turned into the corresponding `RacketNumber`.

```typescript
import { fromString } from 'tower.js';

const exactFive = fromString('5');
const inexactFive = fromString('5.0');

const exactComplex = fromString('5+3i'); 
const inexactComplex = fromString('5.0+3.0i'); 
```

### makeExact

Makes an exact number from an integer `number` numerator and optional denominator.

```typescript
const exactFive = makeExact(5);
const exactHalf = makeExact(1, 2);
```

### makeComplex

Equivalent to `makeRectangular`. Makes a complex number from 
two `RacketNumber`s.

```typescript
const exactFive = makeExact(5);
const exactHalf = makeExact(1, 2);

const complex = makeComplex(exactFive, exactHalf);
```
