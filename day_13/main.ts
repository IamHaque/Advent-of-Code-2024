import { evalResult } from '../utils.ts';

type Machine = {
  'Button A'?: [number, number];
  'Button B'?: [number, number];
  Prize?: [number, number];
};

const GAME_LIMIT = 100;
const COORD_REGEX = new RegExp(/([a-zA-Z\s]+):\sX[+=](\d+),\sY[+=](\d+)/);

/* Day 13 - Part 01 */

function part_01(input: string[]): number {
  let tokens_spent = 0;
  const machines = parseInput(input);

  machines.forEach((machine) => {
    for (let i = 0; i < GAME_LIMIT; i++) {
      const button_a_X = machine['Button A']![0] * i;
      const button_a_Y = machine['Button A']![1] * i;

      const remaining_X = machine.Prize![0] - button_a_X;
      const remaining_Y = machine.Prize![1] - button_a_Y;

      const button_b_X = machine['Button B']![0];
      const button_b_Y = machine['Button B']![1];

      if (
        remaining_X % button_b_X === 0 &&
        remaining_Y % button_b_Y === 0 &&
        remaining_X / button_b_X === remaining_Y / button_b_Y
      ) {
        tokens_spent += 3 * i + remaining_X / button_b_X;
        break;
      }
    }
  });

  return tokens_spent;
}

evalResult(13, 1, part_01);

/* Day 13 - Part 02 */

function part_02(input: string[]): number {
  let tokens_spent = 0;
  const machines = parseInput(input);

  machines.forEach((machine) => {
    const [button_a_X, button_a_Y] = machine['Button A']!;
    const [button_b_X, button_b_Y] = machine['Button B']!;

    const prize_X = machine['Prize']![0] + 10000000000000;
    const prize_Y = machine['Prize']![1] + 10000000000000;

    // S = (Px - Bx . T) / Ax
    // T = (Ax . Py - Ay . Px) / (Ax . By - Ay . Bx)

    const button_b_count =
      (button_a_X * prize_Y - button_a_Y * prize_X) /
      (button_a_X * button_b_Y - button_a_Y * button_b_X);

    if (button_b_count % 1 !== 0) return;

    const button_a_count = (prize_X - button_b_X * button_b_count) / button_a_X;

    if (button_a_count % 1 !== 0) return;

    tokens_spent += 3 * button_a_count + button_b_count;
  });

  return tokens_spent;
}

evalResult(13, 2, part_02);

/* Shared functions */

function parseInput(input: string[]): Machine[] {
  const machines: Machine[] = [];

  input.forEach((line, index) => {
    if (!line) return;

    const line_match = line.match(COORD_REGEX);
    if (!line_match) return;

    const [_, type, x, y] = line_match;
    const machine_index = Math.floor(index / 4);

    if (!machines[machine_index]) machines.push({});
    machines[machine_index][type as keyof Machine] = [Number(x), Number(y)];
  });

  return machines;
}
