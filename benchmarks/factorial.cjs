const assert = require("node:assert").strict;

const benchmark = require("./util.cjs").benchmark;

const jsNums = require('./js-numbers.cjs');
const tower = require('tower.js');

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

let j, t;
benchmark("js-numbers.js: large factorial", 100, () => {
  j = jsNumsFactorial(1000);
});
benchmark("tower.js: large factorial", 100, () => {
  t = towerFactorial(1000);
});
console.log("Results match: ", j.toString() === t.toString());
console.log();

benchmark("js-numbers.js: small factorial", 100, () => {
  j = jsNumsFactorial(5);
});
benchmark("tower.js: small factorial", 100, () => {
  t = towerFactorial(5);
});
console.log("Results match: ", j.toString() === t.toString());
console.log();

let a = [];
for (let i = 1; i <= 1000; i++) {
  a.push(1);
}
benchmark("js-numbers.js: multi-arity multiply", 100, () => {
  j = a[0];
  for (let i = 1; i < a.length; i++) {
    j = jsNums.multiply(j, a[i]);
  }
});
benchmark("tower.js: multi-arity multiply", 100, () => {
  t = tower.multiply(...a);
});
console.log("Results match: ", j.toString() === t.toString());
console.log();
