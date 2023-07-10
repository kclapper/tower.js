import { strict as assert } from 'node:assert';
import {
  bigExpt,
  Benchmark
} from './util.js';
import * as tower from 'tower.js';
import jsNums from './js-numbers.cjs';

const trialCount = 100;

let baseStr = "100+89i";
let expStr = "5000";
let jsNumsBase = jsNums.fromString(baseStr);
let jsNumsExp = jsNums.fromString(expStr);
let towerBase = tower.fromString(baseStr);
let towerExp = tower.fromString(expStr);

const exactComplex = new Benchmark(`Exact complex, expt(${baseStr}, ${expStr})`)
exactComplex.add('js-numbers', () => {
  return jsNums.expt(jsNumsBase, jsNumsExp);
});
exactComplex.add('tower.js', () => {
  return tower.expt(towerBase, towerExp);
});
exactComplex.run(trialCount);

baseStr = "1000";
expStr = "5000";
jsNumsBase = jsNums.fromString(baseStr);
jsNumsExp = jsNums.fromString(expStr);
towerBase = tower.fromString(baseStr);
towerExp = tower.fromString(expStr);

const exactInteger = new Benchmark(`Large Exact integer, expt(${baseStr}, ${expStr})`);
exactInteger.add('js-numbers', () => {
  return jsNums.expt(jsNumsBase, jsNumsExp);
});
exactInteger.add('tower.js', () => {
  return tower.expt(towerBase, towerExp);
});
exactInteger.run(trialCount);

baseStr = "2";
expStr = "30";
jsNumsBase = jsNums.fromString(baseStr);
jsNumsExp = jsNums.fromString(expStr);
towerBase = tower.fromString(baseStr);
towerExp = tower.fromString(expStr);
let jsBase = Number(baseStr);
let jsExp = Number(expStr);

const smallExact = new Benchmark(`Small Exact Base and Exp, expt(${baseStr}, ${expStr})`)
smallExact.add('js-numbers', () => {
  return jsNums.expt(jsNumsBase, jsNumsExp);
});
smallExact.add('tower.js', () => {
  return tower.expt(towerBase, towerExp);
});
smallExact.add('javascript', () => {
  return Math.pow(jsBase, jsExp);
});
smallExact.run(trialCount);

baseStr = "5.5";
expStr = "5.5";
jsNumsBase = jsNums.fromString(baseStr);
jsNumsExp = jsNums.fromString(expStr);
towerBase = tower.fromString(baseStr);
towerExp = tower.fromString(expStr);
jsBase = Number(baseStr);
jsExp = Number(expStr);

const smallInexact = new Benchmark(`Small Inexact Base and Exp, expt(${baseStr}, ${expStr})`)
smallInexact.add('js-numbers', () => {
  return jsNums.expt(jsNumsBase, jsNumsExp);
});
smallInexact.add('tower.js', () => {
  return tower.expt(towerBase, towerExp);
});
smallInexact.add('javascript', () => {
  return Math.pow(jsBase, jsExp);
});
smallInexact.run(trialCount);

baseStr = "5.5";
expStr = "10";
jsNumsBase = jsNums.fromString(baseStr);
jsNumsExp = jsNums.fromString(expStr);
towerBase = tower.fromString(baseStr);
towerExp = tower.fromString(expStr);
jsBase = Number(baseStr);
jsExp = Number(expStr);

const mixedPrecision = new Benchmark(`Mixed Precision, expt(${baseStr}, ${expStr})`)
mixedPrecision.add('js-numbers', () => {
  return jsNums.expt(jsNumsBase, jsNumsExp);
});
mixedPrecision.add('tower.js', () => {
  return tower.expt(towerBase, towerExp);
});
mixedPrecision.add('javascript', () => {
  return Math.pow(jsBase, jsExp);
});
mixedPrecision.run(trialCount);
