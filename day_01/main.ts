import { evalResult } from '../utils.ts';

/* Day 01 - Part 01 */

function part_01(input: string[]): number {
  const left_list: number[] = [];
  const right_list: number[] = [];

  input.forEach((line) => {
    const [a, b] = line.split(/\s+/);

    left_list.push(Number(a));
    right_list.push(Number(b));
  });

  left_list.sort();
  right_list.sort();

  return left_list.reduce((total, left_number, index) => {
    const right_number = right_list[index];
    return total + Math.abs(left_number - right_number);
  }, 0);
}

evalResult(1, 1, part_01);

/* Day 01 - Part 02 */

function part_02(input: string[]): number {
  const left_list: number[] = [];
  const right_list: number[] = [];

  input.forEach((line) => {
    const [a, b] = line.split(/\s+/);

    left_list.push(Number(a));
    right_list.push(Number(b));
  });

  return left_list.reduce((total_score, left_number) => {
    const score =
      left_number *
      right_list.filter((right_number) => left_number === right_number).length;
    return total_score + score;
  }, 0);
}

evalResult(1, 2, part_02);
