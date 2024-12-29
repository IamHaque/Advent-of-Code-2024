import { evalResult } from '../utils.ts';

/* Day 22 - Part 01 */

function part_01(input: string[]): number {
  let secrets_sum = 0;

  input.forEach((line) => {
    if (!line) return;

    const initial_secret = Number(line);

    let secret = initial_secret;
    for (let i = 0; i < 2000; i++) {
      secret = findNextSecret(secret);
    }

    secrets_sum += secret;
  });

  return secrets_sum;
}

evalResult(22, 1, part_01);

/* Day 22 - Part 02 */

function part_02(input: string[]): number {
  return 0;
}

evalResult(22, 2, part_02);

/* Shared functions */

function findNextSecret(secret: number): number {
  const mix = (a: number, b: number): number => a ^ b;
  const prune = (a: number): number => a & 0xffffff; // a % 16777216
  const mixAndPrune = (a: number, b: number): number => prune(mix(a, b));

  const step_1 = mixAndPrune(secret << 6, secret); // secret * 64
  const step_2 = mixAndPrune(Math.floor(step_1 >> 5), step_1); // step_1 / 32
  const step_3 = mixAndPrune(step_2 << 11, step_2); // step_2 * 2048

  return step_3;
}
