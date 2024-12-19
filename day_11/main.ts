import { evalResult } from '../utils.ts';

const BLINK_COUNT = 25;

/* Day 11 - Part 01 */

function part_01(input: string[]): number {
  if (input[0] === '') return 0;

  let stones = input[0].split(' ').map((n) => Number(n));

  for (let blink = 0; blink < BLINK_COUNT; blink++) {
    const line: number[] = [];

    for (const stone of stones) {
      const blink_result = blinkAtStone(stone);
      line.push(...blink_result);
    }

    stones = line;
  }

  return stones.length;
}

evalResult(11, 1, part_01);

/* Day 11 - Part 02 */

function part_02(input: string[]): number {
  return 0;
}

evalResult(11, 2, part_02);

/* Shared functions */

function blinkAtStone(stone: number): number[] {
  if (stone === 0) return [1];

  const digit_count = stone.toString().length;
  if (digit_count % 2 === 0) {
    const half_divisor = Math.pow(10, digit_count / 2);
    return [Math.floor(stone / half_divisor), Math.floor(stone % half_divisor)];
  }

  return [stone * 2024];
}
