import { Buckets } from "../../src/helpers";

describe("helpers.js", () => {
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
