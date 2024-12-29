import { evalResult } from '../utils.ts';
import { memoize, combinations } from '../tools.ts';

type KeypadKey = keyof typeof NUMERIC_KEYPAD | keyof typeof DIRECTIONAL_KEYPAD;
type KeypadValue =
  | (typeof NUMERIC_KEYPAD)[keyof typeof NUMERIC_KEYPAD]
  | (typeof DIRECTIONAL_KEYPAD)[keyof typeof DIRECTIONAL_KEYPAD];
type Keypad = Record<KeypadKey, KeypadValue>;

const NUMERIC_KEYPAD = {
  '7': [0, 0],
  '8': [0, 1],
  '9': [0, 2],
  '4': [1, 0],
  '5': [1, 1],
  '6': [1, 2],
  '1': [2, 0],
  '2': [2, 1],
  '3': [2, 2],
  '0': [3, 1],
  A: [3, 2],
} as const;

const DIRECTIONAL_KEYPAD = {
  '^': [0, 1],
  A: [0, 2],
  '<': [1, 0],
  v: [1, 1],
  '>': [1, 2],
} as const;

const DIRECTIONS: Record<string, [number, number]> = {
  '>': [0, 1],
  v: [1, 0],
  '<': [0, -1],
  '^': [-1, 0],
} as const;

const memoizedGetCost = memoize(getCost, 200);
const memoizedGenerateWays = memoize(generateWays, 200);

/* Day 21 - Part 01 */

function part_01(input: string[]): number {
  let complexity = 0;

  for (const line of input) {
    if (!line) continue;

    const cost = getCodeCost(line, 2);
    const number = parseInt(line.slice(0, -1), 10);

    complexity += cost * number;
  }

  return complexity;
}

evalResult(21, 1, part_01);

/* Day 21 - Part 02 */

function part_02(input: string[]): number {
  let complexity = 0;

  for (const line of input) {
    if (!line) continue;

    const cost = getCodeCost(line, 25);
    const number = parseInt(line.slice(0, -1), 10);

    complexity += cost * number;
  }

  return complexity;
}

evalResult(21, 2, part_02);

/* Shared functions */

function getCodeCost(code: string, depth: number): number {
  const fullCode = 'A' + code;
  let cost = 0;

  for (let i = 0; i < fullCode.length - 1; i++) {
    cost += memoizedGetCost(
      fullCode[i] as KeypadKey,
      fullCode[i + 1] as KeypadKey,
      false,
      depth
    );
  }

  return cost;
}

function getCost(
  a: KeypadKey,
  b: KeypadKey,
  isDirectionKeypad: boolean,
  depth: number = 0
): number {
  if (depth === 0) {
    return Math.min(
      ...memoizedGenerateWays(a, b, isDirectionKeypad).map((way) => way.length)
    );
  }

  const ways = memoizedGenerateWays(a, b, isDirectionKeypad);
  let bestCost = Infinity;
  for (const seq of ways) {
    const fullSeq = 'A' + seq;
    let cost = 0;
    for (let i = 0; i < fullSeq.length - 1; i++) {
      cost += memoizedGetCost(
        fullSeq[i] as KeypadKey,
        fullSeq[i + 1] as KeypadKey,
        true,
        depth - 1
      );
    }
    bestCost = Math.min(bestCost, cost);
  }

  return bestCost;
}

function generateWays(
  a: KeypadKey,
  b: KeypadKey,
  isDirectionKeypad: boolean
): string[] {
  const keypad = (
    isDirectionKeypad ? DIRECTIONAL_KEYPAD : NUMERIC_KEYPAD
  ) as Keypad;
  const curLoc = keypad[a];
  const nextLoc = keypad[b];
  const di = nextLoc[0] - curLoc[0];
  const dj = nextLoc[1] - curLoc[1];

  const moves: [string, number][] = [];
  if (di > 0) moves.push(['v', di]);
  else if (di < 0) moves.push(['^', -di]);
  if (dj > 0) moves.push(['>', dj]);
  else if (dj < 0) moves.push(['<', -dj]);

  while (moves.length < 2) moves.push(['', 0]);

  const rawCombos = Array.from(
    new Set(
      combinations(moves[0][1] + moves[1][1], moves[0][1]).map((indices) => {
        const combo = Array(moves[0][1] + moves[1][1]).fill(moves[1][0]);
        for (const i of indices) {
          combo[i] = moves[0][0];
        }
        return combo.join('') + 'A';
      })
    )
  );

  const combos: string[] = [];
  for (const combo of rawCombos) {
    let [ci, cj] = curLoc;
    let isValid = true;
    for (const c of combo.slice(0, -1)) {
      const [dI, dJ] = DIRECTIONS[c] || [0, 0];
      ci += dI;
      cj += dJ;
      if (!Object.values(keypad).some(([x, y]) => x === ci && y === cj)) {
        isValid = false;
        break;
      }
    }
    if (isValid) combos.push(combo);
  }

  return combos;
}
