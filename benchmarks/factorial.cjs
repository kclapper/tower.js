const assert = require("node:assert").strict;

const benchmark = require("./util.js").benchmark;

const jsNums = require('./js-numbers.js');
const tower = require('../dist/tower.js');

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

benchmark("js-numbers.js: factorial", 100, () => {
  jsNumsFactorial(1000);
});
benchmark("tower.js: factorial", 100, () => {
  towerFactorial(1000);
});
