import {
  fromString,
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


function factorial(n) {
  const nums = Array(n);
  for (let i = 1; i <= n; i++) {
    nums[i-1] = fromString(i.toString());
  }
  return multiply(...nums);
}

const FOUR = fromString("4");
const _1103 = fromString("1103");
const _26390 = fromString("26390");
const _396 = fromString("396");

function ramSeries(terms) {
  const factor = divide(multiply(TWO, sqrt(TWO)), fromString("9801"));
  let sum = ZERO;
  for (let i = 0; i < terms; i++) {
    let k = new SmallExactNumber(i);

    let numerator = factorial(multiply(FOUR, k));
    numerator = multiply(numerator, add(_1103, multiply(_26390, k)))

    let denominator = multiply(expt(factorial(k), FOUR), expt(_396, multiply(FOUR, k)));

    sum = add(sum, divide(numerator, denominator));
  }

  return multiply(factor, sum);
}

console.log(divide(1, ramSeries(100)));
