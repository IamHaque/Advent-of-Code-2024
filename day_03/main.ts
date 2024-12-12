import { evalResult } from "../utils.ts";

/* Day 03 - Part 01 */

function part_01(input: string[]): number {
  const line = input.join("");

  const mul_regex = new RegExp("mul\\((\\d{1,3}),(\\d{1,3})\\)", "g");
  const mul = line.matchAll(mul_regex);

  const mul_result = Array.from(mul).map((item) =>
    Number(item[1]) * Number(item[2])
  ).reduce((sum, num) => sum + num, 0);

  return mul_result;
}

evalResult(
  3,
  1,
  part_01,
);

/* Day 03 - Part 02 */

function part_02(input: string[]): number {
  const line = input.join("");

  const mul_regex = new RegExp(
    "mul\\((\\d{1,3}),(\\d{1,3})\\)|don\\'t\\(\\)|do\\(\\)",
    "g",
  );
  const mul_match = Array.from(line.matchAll(mul_regex));

  let mul_result = 0;
  let can_multiply = true;

  mul_match.forEach(([operation, num1, num2]) => {
    if (operation === "don't()") {
      can_multiply = false;
    } else if (operation === "do()") {
      can_multiply = true;
    }

    if (can_multiply && operation.startsWith("mul")) {
      mul_result += Number(num1) * Number(num2);
    }
  });

  return mul_result;
}

evalResult(
  3,
  2,
  part_02,
);
