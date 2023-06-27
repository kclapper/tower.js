import {
  add,
  sqrt,
  remainder,
  equals,
  lessThanOrEqual,
  numberToString
} from 'tower.js';

function printNthPrime(n, starting_at = 2) {
  let prime;
  let count = 0;
  for (let i = starting_at; count < n; i = add(i, 1)) {
    if (isPrime(i)) {
      count++;
      prime = i;
    }
  }

  console.log(numberToString(prime));
}

function isPrime(n) {
  const sqrt_n = sqrt(n);
  for (let i = 2; lessThanOrEqual(i, sqrt_n); i = add(i, 1)) {
    if (equals(remainder(n, i), 0)) {
      return false;
    }
  }
  return true;
}

printNthPrime(1, Number.MAX_SAFE_INTEGER);
