export function integrate(func, start, stop, steps = 50) {
  let dx = (stop - start) / steps;
  let x;
  let integral = 0;

  for (let step = 0; step < steps; step++) {
    x = dx * (step + 0.5);
    integral += dx * func(x);
  }
  return integral;
}

export class Buckets {
  constructor(length) {
    if (length < 1) {
      throw new RangeError("Buckets length must be at least 1");
    }
    this.length = length;
    this.contents = new Array(length).fill(0);
  }
  pull() {
    return this.contents.shift();
  }
  push(newValue) {
    this.contents.push(newValue);
  }
  getItem(index) {
    if (index > this.length) {
      throw new RangeError("Index out of range");
    }
    return this.contents[index];
  }
  setItem(index, value) {
    if (index > this.length) {
      throw new RangeError("Index out of range");
    }
    this.contents[index] = value;
  }
  rotate(newValue) {
    this.push(newValue);
    return this.pull();
  }
  get total() {
    return this.contents.reduce((a, b) => a + b, 0);
  }
  get latest() {
    return this.contents[this.contents.length - 1];
  }
}

export class Remainder {
  constructor(initialValue = 0) {
    this.remainder = initialValue;
  }
  processValue(value) {
    value += this.remainder;
    let rv = Math.floor(value);
    this.remainder = value - rv;
    return rv;
  }
}

export function getNestedValue(dottedKey, obj) {
  let keys = dottedKey.split(".");
  let out = obj;
  let key;
  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    if (out[key] === undefined) {
      return undefined;
    }
    out = out[key];
  }
  return out;
}
