import { strict as assert } from 'node:assert';
import {
  bigExpt,
  benchmark,
  Benchmark
} from './util.js';
import * as tower from 'tower.js';
import jsNums from './js-numbers.cjs';

const trialCount = 100;

let baseStr = "100+89i";
let exp = 5000;
let jsNumsBase = jsNums.fromString(baseStr);
let towerBase = tower.fromString(baseStr);

const exactComplex = new Benchmark(`Exact complex expt(${baseStr}, ${exp})`)
exactComplex.add('js-numbers', () => {
  return jsNums.expt(jsNumsBase, exp);
});
exactComplex.add('tower.js', () => {
  return tower.expt(towerBase, exp);
});
exactComplex.run(trialCount);

let base = 1000;
exp = 5000;

const exactInteger = new Benchmark(`Large Exact integer expt(${base}, ${exp})`);
exactInteger.add('js-numbers', () => {
  return jsNums.expt(base, exp);
});
exactInteger.add('tower.js', () => {
  return tower.expt(base, exp);
});
exactInteger.add('bigint', () => {
  return tower.expt(BigInt(base), BigInt(exp));
});
exactInteger.run(100);

baseStr = "5.5";
let expStr = "5.5";
jsNumsBase = jsNums.fromString(baseStr);
let jsNumsExp = jsNums.fromString(expStr);
towerBase = tower.fromString(baseStr);
let towerExp = tower.fromString(expStr);
let jsBase = Number(baseStr);
let jsExp = Number(expStr);

const smallInexact = new Benchmark(`Small Inexact Base and Exp expt(${baseStr}, ${expStr})`)
smallInexact.add('js-numbers', () => {
  return jsNums.expt(jsNumsBase, jsNumsExp);
});
smallInexact.add('tower.js', () => {
  return tower.expt(towerBase, towerExp);
});
smallInexact.add('javascript', () => {
  return Math.pow(jsBase, jsExp);
});
smallInexact.run(100);

baseStr = "5.5";
exp = 10;
jsNumsBase = jsNums.fromString(baseStr);
towerBase = tower.fromString(baseStr);
jsBase = Number(baseStr);

const mixedPrecision = new Benchmark(`Mixed Precision expt(${baseStr}, ${exp})`)
mixedPrecision.add('js-numbers', () => {
  return jsNums.expt(jsNumsBase, exp);
});
mixedPrecision.add('tower.js', () => {
  return tower.expt(towerBase, exp);
});
mixedPrecision.add('javascript', () => {
  return Math.pow(jsBase, exp);
});
mixedPrecision.run(100);

