import { sum, isAdult } from "../src/utils.js";

describe("utils", () => {
  describe("sum", () => {
    test("should add two numbers correctly", () => {
      expect(sum(2, 3)).toBe(5);
      expect(sum(-1, 1)).toBe(0);
      expect(sum(0, 0)).toBe(0);
    });

    test("should handle negative numbers", () => {
      expect(sum(-5, -3)).toBe(-8);
      expect(sum(-10, 5)).toBe(-5);
    });

    test("should handle decimal numbers", () => {
      expect(sum(1.5, 2.5)).toBe(4);
      expect(sum(0.1, 0.2)).toBeCloseTo(0.3);
    });
  });

  describe("isAdult", () => {
    test("should return true for adults", () => {
      /** @type {User} */
      const adult = { id: "1", name: "John", age: 25, isActive: true };
      expect(isAdult(adult)).toBe(true);
    });

    test("should return false for minors", () => {
      /** @type {User} */
      const minor = { id: "2", name: "Jane", age: 16, isActive: true };
      expect(isAdult(minor)).toBe(false);
    });

    test("should return true for exactly 18 years old", () => {
      /** @type {User} */
      const eighteenYearOld = { id: "3", name: "Bob", age: 18, isActive: true };
      expect(isAdult(eighteenYearOld)).toBe(true);
    });

    test("should handle edge cases", () => {
      /** @type {User} */
      const almostAdult = { id: "4", name: "Alice", age: 17, isActive: true };
      expect(isAdult(almostAdult)).toBe(false);

      /** @type {User} */
      const veryOld = { id: "5", name: "Elder", age: 100, isActive: false };
      expect(isAdult(veryOld)).toBe(true);
    });
  });
});
