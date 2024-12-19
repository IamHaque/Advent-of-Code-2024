import { evalResult } from '../utils.ts';

/* Day 11 - Part 01 */

function part_01(input: string[]): number {
  if (input[0] === '') return 0;

  const blink_count = 25;
  let stones = input[0].split(' ').map((n) => Number(n));

  for (let blink = 0; blink < blink_count; blink++) {
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
  if (input[0] === '') return 0;

  let stones_count = 0;
  const blink_count = 75;
  const blink_map = new Map<string, number>();
  const stones = input[0].split(' ').map((n) => Number(n));

  for (const stone of stones) {
    const stone_count = blinkAtStoneRecursively(
      stone,
      0,
      blink_count,
      blink_map
    );
    stones_count += stone_count;
  }

  return stones_count;
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

function blinkAtStoneRecursively(
  stone: number,
  blink_count: number,
  blink_limit: number,
  blink_map: Map<string, number>
): number {
  const key = `${stone}-${blink_count}`;
  if (blink_map.has(key)) return blink_map.get(key)!;

  if (blink_count === blink_limit) return 1;

  let blink_result: number;
  const digit_count = stone.toString().length;

  if (stone === 0) {
    blink_result = blinkAtStoneRecursively(
      1,
      blink_count + 1,
      blink_limit,
      blink_map
    );
  } else if (digit_count % 2 === 0) {
    const half_divisor = Math.pow(10, digit_count / 2);
    const left_half = Math.floor(stone / half_divisor);
    const right_half = Math.floor(stone % half_divisor);

    blink_result =
      blinkAtStoneRecursively(
        left_half,
        blink_count + 1,
        blink_limit,
        blink_map
      ) +
      blinkAtStoneRecursively(
        right_half,
        blink_count + 1,
        blink_limit,
        blink_map
      );
  } else {
    blink_result = blinkAtStoneRecursively(
      stone * 2024,
      blink_count + 1,
      blink_limit,
      blink_map
    );
  }

  blink_map.set(key, blink_result);
  return blink_result;
}
