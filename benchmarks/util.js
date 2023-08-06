export class Benchmark {
  constructor(name, argStrs=[]) {
    this.name = name;
    this.argStrs = argStrs;
    this.cases = [];
  }

  add(name, thunk, argFormatter=(x) => x) {
    this.cases.push({name: name,
                     thunk: thunk,
                     argFormatter: argFormatter});
  }

  run(trials) {
    if (trials < 1) {
      throw new Error("Must run at least 1 trial");
    }

    if (global.gc === undefined) {
      throw new Error("Must run benchmarks with: node --expose-gc");
    }

    // Collect benchmark data
    for (const current of this.cases) {
      global.gc(); // Start with a fresh bowl.

      let result = {};

      result['value'] = current.thunk();

      result['times'] = [];
      for (let i = 0; i < trials; i++) {
        let start = performance.now();
        current.thunk();
        result.times.push(performance.now() - start);
      }

      result.total = result.times.reduce((acc, n) => acc + n);
      result.average = result.total / trials;

      current.result = result;
    }

    // Check that all of the results match.
    let resultsMatch = true;
    let lastValue = this.cases[0].result.value;
    let currentValue;
    for (let i = 1; i < this.cases.length; i++) {
      currentValue = this.cases[i].result.value;

      if (currentValue === undefined) {
        throw new Error(`No result returned for benchmark case ${this.cases[i].name}`);
      }

      resultsMatch &&= currentValue.toString() === lastValue.toString();

      lastValue = currentValue;
    }

    // Print results
    console.log(this.name);
    console.log('-'.repeat(80));

    for (const current of this.cases) {
      console.log(`${current.name}: \t${current.result.average} ms/trial \t(${current.result.total} total)`)
    }

    console.log(`Results match: ${resultsMatch}`);

    console.log("")
  }

  printResults() {
    for (const current of this.cases) {
      console.log(current.name);
      console.log(current.result.value.toString());
    }
  }
}

export function bigExpt(n, k) {
  if (Number.isSafeInteger(Number(n)) && Number.isSafeInteger(Number(k))) {
    const result = Math.pow(Number(n), Number(k));
    if (Number.isSafeInteger(result)) {
      return BigInt(result);
    }
  }

  let acc = 1n;
  while (k !== 0n) {
    if (k % 2n === 0n) {
      n = n * n;
      k = k / 2n;
    } else {
      acc = acc * n;
      k = k - 1n;
    }
  }
  return acc;
}

