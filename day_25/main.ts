import { evalResult } from '../utils.ts';

type PinHeight = number[];
type Schematic = string[][];

/* Day 25 - Part 01 */

function part_01(input: string[]): number {
  const { locks, keys } = getLocksAndKeys(input);

  let valid_pairs = 0;

  for (const key of keys) {
    for (const lock of locks) {
      let does_overlap = false;

      for (let c = 0; c < key.length; c++) {
        if (key[c] + lock[c] > 5) {
          does_overlap = true;
          break;
        }
      }

      if (!does_overlap) {
        valid_pairs++;
      }
    }
  }

  return valid_pairs;
}

evalResult(25, 1, part_01);

/* Shared functions */

function getLocksAndKeys(input: string[]): {
  locks: PinHeight[];
  keys: PinHeight[];
} {
  input.push('');

  const keys: PinHeight[] = [];
  const locks: PinHeight[] = [];
  let schematic: Schematic = [];

  input.forEach((line) => {
    if (!line && schematic.length > 0) {
      const pin_heights = convertSchematicToPinHeight(schematic);

      if (schematic[0][0] === '#') locks.push(pin_heights);
      else if (schematic[0][0] === '.') keys.push(pin_heights);

      schematic = [];
      return;
    }

    schematic.push(line.split(''));
  });

  return { locks, keys };
}

function convertSchematicToPinHeight(schematic: Schematic): number[] {
  const rows = schematic.length;
  const cols = schematic[0].length;
  const pin_heights: number[] = Array(cols).fill(-1);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (schematic[r][c] === '#') pin_heights[c] += 1;
    }
  }

  return pin_heights;
}
