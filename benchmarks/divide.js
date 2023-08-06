import { Benchmark } from './util.js';
import * as tower from 'tower.js';
import jsNums from './js-numbers.cjs';

const exactSmall = new Benchmark('Exact small integers');
exactSmall.add('js-numbers', () => {
  return jsNums.divide(4, 2);
});
exactSmall.add('tower.js', () => {
  return tower.divide(new tower.SmallExactNumber(4), new tower.SmallExactNumber(2));
});
exactSmall.run(100);

const inexactSmall = new Benchmark('Inexact small integers');
inexactSmall.add('js-numbers', () => {
  return jsNums.divide(jsNums.makeFloat(4), jsNums.makeFloat(2));
});
inexactSmall.add('tower.js', () => {
  return tower.divide(4, 2) + '.0';
});
inexactSmall.add('javascript', () => {
  return (4 / 2) + '.0';
});
inexactSmall.run(100);

const big = new Benchmark('Big numbers');
const argStr = '1000000000000000000000000000000000000000000000';
const jsArg = jsNums.fromString(argStr);
const towerArg = tower.fromString(argStr);
big.add('js-numbers', () => {
  return jsNums.divide(jsArg, jsArg);
});
big.add('tower.js', () => {
  return tower.divide(towerArg, towerArg);
});
big.add('javascript', () => {
  const x = BigInt(argStr);
  return x / x;
});
big.run(100);
