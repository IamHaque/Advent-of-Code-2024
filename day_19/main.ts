import { evalResult } from '../utils.ts';

/* Day 19 - Part 01 */

function part_01(input: string[]): number {
  const patterns = input.shift()!.split(', ');
  input.shift();

  if (input.length === 0) return 0;

  let possible_designs = 0;

  input.forEach((design) => {
    if (isDesignPossible(patterns, design)) {
      possible_designs++;
    }
  });

  return possible_designs;
}

evalResult(19, 1, part_01);

/* Day 19 - Part 02 */

function part_02(input: string[]): number {
  return 0;
}

evalResult(19, 2, part_02);

/* Shared functions */

function isDesignPossible(patterns: string[], design: string): boolean {
  if (patterns.length === 0) return false;

  if (design.length === 0) return true;
  if (design.length === 1) return patterns.includes(design);

  for (const pattern of patterns) {
    if (!design.startsWith(pattern)) continue;

    if (isDesignPossible(patterns, design.substring(pattern.length))) {
      return true;
    }
  }

  return false;
}
