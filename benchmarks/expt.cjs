const assert = require("node:assert").strict;

//const Benchmark = require("benchmark");
//const tower = require('tower.js');

//let suite = new Benchmark.Suite('A Test Suite');
//
//suite.add('something', () => {
  //tower.expt(49, 5000);
//});
//suite.add('another', () => {
  //tower.log(982019);
//});
//suite.on('complete', () => {
  //console.log(suite);
//});
//suite.run();

const util = require("./util.cjs");
const benchmark = util.benchmark;
const bigExpt = util.bigExpt;

const jsNums = require('./js-numbers.cjs');
const tower = require('tower.js');

benchmark("js-numbers.js: exact complex expt", 100, () => {
  const complex = jsNums.fromString("100+89i");
  jsNums.expt(complex, 5000);
});
benchmark("tower.js: exact complex expt", 100, () => {
  const complex = tower.fromString("100+89i");
  tower.expt(complex, 5000);
});

const jsNumResult = jsNums.fromString("100+89i");
const towerResult = tower.fromString("100+89i");
console.log("Results match: ", jsNumResult.toString() === towerResult.toString());
console.log("\n");

benchmark("js-numbers.js: simple exact expt", 100, () => {
  jsNums.expt(49, 5000);
});
benchmark("tower.js: simple exact expt", 100, () => {
  tower.expt(49, 5000);
});
benchmark("native: simple exact expt", 100, () => {
  bigExpt(49n, 5000n);
});

console.log("Results match: ",
            jsNums.expt(49, 5000).toString() === tower.expt(49, 5000).toString()
            && tower.expt(49, 5000) === bigExpt(49n, 5000n));
console.log("\n");

let result = [];
benchmark("js-numbers.js: small inexact expt", 100, () => {
  const base = jsNums.fromString("5.5");
  const exp = jsNums.fromString("5.5");
  result.push(jsNums.expt(base, exp).toString());
});
benchmark("tower.js: small inexact expt", 100, () => {
  const base = tower.fromString("5.5");
  const exp = tower.fromString("5.5");
  result.push(tower.expt(base, exp).toString());
});
benchmark("native: small inexact expt", 100, () => {
  result.push(Math.pow(5.5, 5.5).toString());
});

console.log("Results match: ", result.reduce((acc, str, i, arr) => {
  if (i === 0) {
    return true;
  }
  return acc && arr[i].slice(0, -2) === arr[i - 1].slice(0, -2);
}))
console.log("\n");

result = [];
benchmark("js-numbers.js: inexact base, exact exp, expt", 100, () => {
  const base = jsNums.fromString("5.5");
  result.push(jsNums.expt(base, 10).toString());
});
benchmark("tower.js: inexact base, exact exp, expt", 100, () => {
  const base = tower.fromString("5.5");
  result.push(tower.expt(base, 10).toString());
});
benchmark("native: inexact base, exact exp, expt", 100, () => {
  result.push(Math.pow(5.5, 10).toString());
});

console.log("Results match: ", result.reduce((acc, str, i, arr) => {
  if (i === 0) {
    return true;
  }
  return acc && arr[i].slice(0, -2) === arr[i - 1].slice(0, -2);
}))
console.log("\n");
