import { evalResult } from '../utils.ts';

const BLINK_COUNT = 25;

/* Day 11 - Part 01 */

function part_01(input: string[]): number {
  if (input[0] === '') return 0;

  let stones = input[0].split(' ').map((n) => Number(n));

  for (let blink = 0; blink < BLINK_COUNT; blink++) {
    const line: number[] = [];

    stones.forEach((stone) => {
      const digit_count = stone.toString().length;

      if (stone === 0) {
        line.push(1);
      } else if (digit_count % 2 === 0) {
        const half_divisor = Math.pow(10, digit_count / 2);
        line.push(Math.floor(stone / half_divisor));
        line.push(Math.floor(stone % half_divisor));
      } else {
        line.push(stone * 2024);
      }
    });

    stones = line;
  }

  return stones.length;
}

evalResult(11, 1, part_01);

/* Day 11 - Part 02 */

// function part_02(input: string[]): number {
//   return 0;
// }

// evalResult(11, 2, part_02);

/* Shared functions */
