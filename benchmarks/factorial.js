import { strict as assert } from 'node:assert';
import {
  benchmark,
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

assert(jsNums.equals(jsNumsFactorial(100),
                     jsNums.fromString("93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000")));

function towerFactorial(n) {
  let result = 1;
  for (; n !== 0; n--) {
    result = tower.multiply(result, n);
  }
  return result;
}

assert(tower.equals(towerFactorial(100),
                     tower.fromString("93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000")));

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

let a = [];
for (let i = 1; i <= 1000; i++) {
  a.push(1);
}
const multiArity = new Benchmark('Multi-arity multiplication');
multiArity.add('js-numbers', () => {
  let result = a[0];
  for (let i = 1; i < a.length; i++) {
    result = jsNums.multiply(result, a[i]);
  }
  return result;
})
multiArity.add('tower.js', () => {
  return tower.multiply(...a);
});
multiArity.run(100);
