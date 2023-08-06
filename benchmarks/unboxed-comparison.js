import {
  bigExpt,
  Benchmark
} from './util.js';
import {
  expt
} from 'tower.js';
import jsNums from './js-numbers.cjs';

const benchmark = new Benchmark("Unboxed Representation Comparison");

benchmark.add("number", () => {
  return Math.pow(2, 50);
});
benchmark.add('bigint', () => {
  return bigExpt(2n, 50n);
});
benchmark.add('tower.js', () => {
  return expt(2, 50);
});
benchmark.add('js-numbers', () => {
  return jsNums.expt(2, 50);
});

benchmark.run(100)
