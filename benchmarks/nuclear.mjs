import {
  fromString,
  inexactToExact,
  exactToInexact,
  SmallExactNumber,
  equals,
  add,
  subtract,
  multiply,
  divide,
  expt,
  sqrt,
  ZERO,
  ONE,
  TWO
} from 'tower.js';


const Na = fromString("602214150000000000000000"); // atoms per mole

const U235a = inexactToExact(fromString("235.0439301")); // grams per mole

const onekg = fromString("1000") // grams

const atomsU235 = multiply(Na, divide(onekg, U235a));

console.log(atomsU235);

const jsVersion = 602214150000000000000000 * (1000 / 235.0439301);

console.log(jsVersion);
