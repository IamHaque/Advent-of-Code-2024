import { evalResult } from '../utils.ts';

/* Day 22 - Part 01 */

function part_01(input: string[]): number {
  let secrets_sum = 0;

  input.forEach((line) => {
    if (!line) return;

    let secret = Number(line);

    for (let i = 0; i < 2000; i++) {
      secret = nextSecret(secret);
    }

    secrets_sum += secret;
  });

  return secrets_sum;
}

evalResult(22, 1, part_01);

/* Day 22 - Part 02 */

function part_02(input: string[]): number {
  const buyers = input.map((line) => Number(line));
  const all_sequences = new Map<string, number>();

  buyers.forEach((initial) => {
    const seen = new Set<string>();
    const differences: number[] = [];

    let current = initial;
    let last_price = initial % 10;

    for (let i = 0; i < 2000; i++) {
      current = nextSecret(current);
      differences.push(last_price - (current % 10));
      last_price = current % 10;

      if (differences.length >= 4) {
        const sequence = differences.join(',');
        differences.shift();

        if (seen.has(sequence)) continue;
        seen.add(sequence);

        all_sequences.set(
          sequence,
          (all_sequences.get(sequence) || 0) + last_price
        );
      }
    }
  });

  return Math.max(...all_sequences.values());
}

evalResult(22, 2, part_02, '_02');

/* Shared functions */

function nextSecret(secret: number): number {
  const mix = (a: number, b: number): number => a ^ b;
  const prune = (a: number): number => a & 0xffffff;
  const mixAndPrune = (a: number, b: number): number => prune(mix(a, b));

  const step_1 = mixAndPrune(secret << 6, secret);
  const step_2 = mixAndPrune(Math.floor(step_1 >> 5), step_1);
  const step_3 = mixAndPrune(step_2 << 11, step_2);

  return step_3;
}
