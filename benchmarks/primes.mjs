import {
  fromString,
  makeExact,
  BigExactNumber,
  equals,
  lessThan,
  add,
  divide,
  remainder,
  ZERO,
  ONE,
  TWO
} from 'tower.js';
import jsNums from './js-numbers.cjs';
import { Benchmark } from './util.js';

const p = 50575709n;
const q = 66560987n;

const composite = q * p;

const factoring = new Benchmark("Factoring a prime number");
factoring.add('tower.js', () => {
  const n = fromString(composite.toString());

  let p_guess;
  let q_guess;

  for (let i = TWO; lessThan(i, n); i = add(ONE, i)) {
    if (equals(ZERO, remainder(n, i))) {
      p_guess = i;
      q_guess = divide(n, i);

      //console.log(p_guess.toString(), q_guess.toString());
      //console.log(equals(p_guess, makeExact(p)) || equals(p_guess, makeExact(q)));

      return p_guess;
    }
  }
});
factoring.add('js-numbers', () => {
  const n = jsNums.fromString(composite.toString());

  let p_guess;
  let q_guess;

  for (let i = 2; jsNums.lessThan(i, n); i = jsNums.add(i, 1)) {
    if (jsNums.equals(0, jsNums.remainder(n, i))) {
      p_guess = i;
      q_guess = jsNums.divide(n, i);

      return p_guess;
    }
  }
});
factoring.run(1);
