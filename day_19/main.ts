import { evalResult } from '../utils.ts';

/* Day 19 - Part 01 */

function part_01(input: string[]): number {
  const patterns = input.shift()!.split(', ');
  input.shift();

  if (input.length === 0) return 0;

  const memo = new Map<string, boolean>();
  const max_pattern_length = patterns.reduce(
    (max_length, pattern) =>
      pattern.length > max_length ? pattern.length : max_length,
    0
  );

  let possible_designs = 0;

  input.forEach((design) => {
    if (isDesignPossible(patterns, design, max_pattern_length, memo)) {
      possible_designs++;
    }
  });

  return possible_designs;
}

evalResult(19, 1, part_01);

/* Day 19 - Part 02 */

function part_02(input: string[]): number {
  const patterns = input.shift()!.split(', ');
  input.shift();

  if (input.length === 0) return 0;

  const memo = new Map<string, number>();
  const max_pattern_length = patterns.reduce(
    (max_length, pattern) =>
      pattern.length > max_length ? pattern.length : max_length,
    0
  );

  let all_designs = 0;

  input.forEach((design) => {
    all_designs += possibleDesignCount(
      patterns,
      design,
      max_pattern_length,
      memo
    );
  });

  return all_designs;
}

evalResult(19, 2, part_02);

/* Shared functions */

function isDesignPossible(
  patterns: string[],
  design: string,
  max_pattern_length: number,
  memo: Map<string, boolean>
): boolean {
  if (design === '') return true;
  if (memo.has(design)) return memo.get(design)!;

  const end = Math.min(design.length, max_pattern_length);

  for (let i = 1; i <= end; i++) {
    if (!patterns.includes(design.substring(0, i))) continue;

    if (
      isDesignPossible(patterns, design.substring(i), max_pattern_length, memo)
    ) {
      memo.set(design, true);
      return true;
    }
  }

  memo.set(design, false);
  return false;
}

function possibleDesignCount(
  patterns: string[],
  design: string,
  max_pattern_length: number,
  memo: Map<string, number>
): number {
  if (design === '') return 1;
  if (memo.has(design)) return memo.get(design)!;

  let count = 0;
  const end = Math.min(design.length, max_pattern_length);

  for (let i = 1; i <= end; i++) {
    if (!patterns.includes(design.substring(0, i))) continue;

    count += possibleDesignCount(
      patterns,
      design.substring(i),
      max_pattern_length,
      memo
    );
  }

  memo.set(design, count);
  return count;
}
