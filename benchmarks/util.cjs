const bigExpt = require('../dist/util.js').bigExpt;

const Benchmark = require("benchmark");

function benchmark(name, jsNumThunk, towerThunk, nativeThunk) {
  let suite = new Benchmark.Suite(name);
  suite.add('js-numbers.js', jsNumThunk);
  suite.add('tower.js', towerThunk);
  suite.add('javascript', nativeThunk);
}

// function benchmark(name, trials, thunk) {
//   if (trials < 1) {
//     throw new Error("Must run at least 1 trial");
//   }
//
//   console.log(`${name}\n--------------------`)
//   let trialTimes = [];
//   for (let n = 1; n <= trials; n++) {
//     let start = performance.now();
//     thunk();
//     trialTimes.push(performance.now() - start);
//   }
//
//   let total = trialTimes.reduce((acc, n) => acc + n);
//   let average = total / trials;
//
//   console.log(`Total time: ${total}`);
//   console.log(`Average trial time: ${average}`)
//
//   console.log("")
// }

module.exports = {
  benchmark: benchmark,
  bigExpt: bigExpt
}
