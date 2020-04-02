export function arraySum(array) {
  return array.reduce((a, b) => a + b, 0);
}

export function arrayRoundRobin(array, newValue) {
  if (array.length < 1) {
    throw new RangeError("Cannot assign new value to zero length Array");
  }
  let rv = array.shift();
  array.push(newValue);
  return rv;
}

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
