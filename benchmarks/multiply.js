import { strict as assert } from 'node:assert';
import {
  Benchmark
} from './util.js';
import * as tower from 'tower.js';
import jsNums from './js-numbers.cjs';

function jsNumsFactorial(n) {
  let result = 1;
  for (; n !== 0; n--) {
    result = jsNums.multiply(result, n);
  }
  return result;
}

function towerFactorial(n) {
  let result = tower.fromString('1');
  for (; n !== 0; n--) {
    result = tower.multiply(result, tower.fromString(n.toString()));
  }
  return result;
}

const largeFac = new Benchmark("Large factorial");
largeFac.add('js-numbers', () => {
  return jsNumsFactorial(1000);
});
largeFac.add('tower.js', () => {
  return towerFactorial(1000);
});
largeFac.run(100)


const smallFac = new Benchmark('Small factorial');
smallFac.add('js-numbers', () => {
  return jsNumsFactorial(5);
});
smallFac.add('tower.js', () => {
  return towerFactorial(5);
});
smallFac.run(100);

const optimizedFac = new Benchmark('Optimized Small Factorial');
optimizedFac.add('js-numbers', () => {
  return jsNumsFactorial(5);
});
function optimizedTowerFac(n) {
  const nums = Array(n);
  for (let i = 0; i < n; i++) {
    nums[i] = tower.fromString((i + 1).toString());
  }
  return tower.multiply(...nums);
}
optimizedFac.add('tower.js', () => {
  return optimizedTowerFac(5);
});
optimizedFac.run(100);

let argStr = '2';
let jsNumsArg = jsNums.fromString(argStr);
let towerArg = tower.fromString(argStr);
const simpleExact = new Benchmark('2 x 2 = 4');
simpleExact.add('js-numbers', () => {
  return jsNums.multiply(jsNumsArg, jsNumsArg);
});
simpleExact.add('tower.js', () => {
  return tower.multiply(towerArg, towerArg);
});
simpleExact.run(100);

argStr = '2.5';
jsNumsArg = jsNums.fromString(argStr);
towerArg = tower.fromString(argStr);
const simpleInexact = new Benchmark('2.5 x 2.5 = 6.25');
simpleInexact.add('js-numbers', () => {
  return jsNums.multiply(jsNumsArg, jsNumsArg);
});
simpleInexact.add('tower.js', () => {
  return tower.multiply(towerArg, towerArg);
});
simpleInexact.run(100);
