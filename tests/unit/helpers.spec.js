import { assignOptionsOrDefaults, Buckets, Remainder } from "@/helpers";

describe("Buckets", () => {
  test("new buckets is filled with 0", () => {
    let buckets = new Buckets(3);
    expect(buckets.length).toEqual(3);
    expect(buckets.getItem(0)).toEqual(0);
    expect(buckets.total).toEqual(0);
  });

  test("rotating buckets pushes item to the end", () => {
    let buckets = new Buckets(1);
    buckets.rotate(12);
    expect(buckets.getItem(0)).toEqual(12);
  });
  test("rotating buckets pushes returns first item", () => {
    let buckets = new Buckets(1);
    buckets.rotate(12);
    let out = buckets.rotate(13);

    expect(out).toEqual(12);
  });
  test("can set and get specific item", () => {
    let buckets = new Buckets(2);
    buckets.setItem(1, 12);

    expect(buckets.getItem(1)).toEqual(12);
  });
});

describe("Remainder", () => {
  test("can add value to remainder and get new floored value", () => {
    let remainder = new Remainder(0.3);
    let out = remainder.processValue(0.8);
    expect(remainder.remainder).toBeCloseTo(0.1, 8);
    expect(out).toEqual(1);
  });
});

describe("assignOptionsOrDefaults", () => {
  let obj;
  beforeEach(() => {
    obj = {};
  });
  test("assigns default parameter when not given", () => {
    assignOptionsOrDefaults(obj, {}, { default: 123 });
    expect(obj.default).toBe(123);
  });
  test("overwrites default parameter when given", () => {
    assignOptionsOrDefaults(obj, { default: 456 }, { default: 123 });
    expect(obj.default).toBe(456);
  });
  test("ignores extra parameters", () => {
    assignOptionsOrDefaults(obj, { default: 456 }, {});
    expect(obj.default).toBeUndefined();
  });
});
