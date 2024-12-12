import { evalResult } from "../utils.ts";

/* Day 07 - Part 01 */

function part_01(input: string[]): number {
  let calibration_result = 0;

  input.forEach((line) => {
    const [a, b] = line.split(": ");
    if (!b) return;

    let can_be_evaluated = false;
    const numbers = b.split(/\s+/);
    const test_value = Number(a);
    const operator_configurations = Math.pow(2, numbers.length - 1);
    const binaryLength = (operator_configurations - 1).toString(2).length;

    for (
      let configuration = 0;
      configuration < operator_configurations;
      configuration++
    ) {
      const operator_configuration = configuration.toString(2).padStart(
        binaryLength,
        "0",
      );

      const result = evaluateNumbers(numbers, operator_configuration);

      if (result === test_value) {
        can_be_evaluated = true;
        break;
      }
    }

    if (can_be_evaluated) calibration_result += test_value;
  });

  return calibration_result;
}

evalResult(
  7,
  1,
  part_01,
);

/* Day 07 - Part 02 */

// function part_02(input: string[]): number {
//   return 0;
// }

// evalResult(
//   7,
//   2,
//   part_02,
// );

/* Shared functions */

function evaluateNumbers(
  numbers: string[],
  operator_configuration: string,
): number {
  let result = Number(numbers[0]);

  for (let index = 1; index < numbers.length; index++) {
    if (operator_configuration[index - 1] === "0") {
      result += Number(numbers[index]);
    } else {
      result *= Number(numbers[index]);
    }
  }

  return result;
}
