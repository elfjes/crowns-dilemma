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
  getItem(index) {
    if (index > self.length) {
      throw new RangeError("Index out of range");
    }
    return this.contents[index];
  }
  setItem(index, value) {
    if (index > self.length) {
      throw new RangeError("Index out of range");
    }
    this.contents[index] = value;
  }
  rotate(newValue) {
    this.contents.push(newValue);
    return this.contents.shift();
  }
  get total() {
    return this.contents.reduce((a, b) => a + b, 0);
  }
}
