import { Field, IntField, NumberField, Schema } from "@/validation";

describe("Schema", () => {
  let schema = new Schema({
    field: new Field({ default: "default" })
  });
  test("returns defined field when loading", () => {
    expect(schema.load({ field: 123 })).toEqual({ field: 123 });
  });
  test("skips extra fields", () => {
    expect(schema.load({ extra: 123 }).extra).toBeUndefined();
  });

  test("sets default", () => {
    expect(schema.load({})).toEqual({ field: "default" });
  });
});

describe("IntField", () => {
  let field = new IntField({
    minVal: 200,
    maxVal: 300,
    default: 250
  });
  test("converts string input to integer", () => {
    expect(field.load("230")).toBe(230);
  });
  test("sets minimum value", () => {
    expect(field.load(123)).toBe(200);
  });
  test("sets maximum value", () => {
    expect(field.load(456)).toBe(300);
  });
  test("sets default", () => {
    expect(field.load(undefined)).toBe(250);
  });
});

describe("NumberField", () => {
  let field = new NumberField({
    minVal: 2.5,
    maxVal: 5.6,
    default: 4.2
  });
  test("converts string input to number", () => {
    expect(field.load("3.2")).toBe(3.2);
  });
  test("sets minimum value", () => {
    expect(field.load(1)).toBe(2.5);
  });
  test("sets maximum value", () => {
    expect(field.load(6)).toBe(5.6);
  });
  test("sets default", () => {
    expect(field.load(undefined)).toBe(4.2);
  });
});
