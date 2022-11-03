function sum(a: number, b: number): number {
  return a + b;
}

test("add 1+1=2", () => {
  expect(sum(1, 2)).toBe(3);
});
