import { ascend } from 'https://deno.land/x/collections@0.12.1/comparators.ts';
import { BinaryHeap } from 'https://deno.land/x/collections@0.12.1/binary_heap.ts';

import { evalResult } from '../utils.ts';

type Position = {
  row: number;
  col: number;
};

type Tile =
  | typeof START
  | typeof END
  | typeof WALL
  | typeof FLOOR
  | typeof VISITED;

const START = 'S';
const END = 'E';
const WALL = '#';
const FLOOR = '.';
const VISITED = 'X';

const STEP_COST = 1;
const TURN_COST = 1000;

/* Day 16 - Part 01 */

function part_01(input: string[]): number {
  if (!input || !input[0]) return 0;

  const { maze, start } = parseInput(input);

  const { bestCost } = dijkstraTraversal(maze, start);

  return bestCost;
}

evalResult(16, 1, part_01);

/* Day 16 - Part 02 */

function part_02(input: string[]): number {
  if (!input || !input[0]) return 0;

  const { maze, start } = parseInput(input);

  const { endStates, backtrack } = dijkstraTraversal(maze, start);

  return getUniqueTiles(endStates, backtrack);
}

evalResult(16, 2, part_02);

/* Shared functions */

function parseInput(input: string[]): {
  maze: Tile[][];
  start: Position;
} {
  let start: Position;

  const maze = input.map((line, line_index) => {
    if (line.indexOf(START) >= 0)
      start = { row: line_index, col: line.indexOf(START) };

    return line.split('').map((item) => item as Tile);
  });

  return { maze, start: start! };
}

function dijkstraTraversal(
  maze: Tile[][],
  start: Position
): {
  bestCost: number;
  endStates: Set<string>;
  backtrack: Map<string, Set<string>>;
} {
  const priorityQueue = new BinaryHeap<number[]>(ascend);

  let bestCost = Infinity;
  const lowestCost: Map<string, number> = new Map();

  const endStates: Set<string> = new Set();
  const backtrack: Map<string, Set<string>> = new Map();

  priorityQueue.push([0, start.row, start.col, 0, 1]);
  lowestCost.set(`${start.row},${start.col},0,1`, 0);

  while (!priorityQueue.isEmpty()) {
    const [cost, r, c, dr, dc] = priorityQueue.pop() ?? [];

    const currentKey = `${r},${c},${dr},${dc}`;
    if (cost > (lowestCost.get(currentKey) || Infinity)) continue;

    if (maze[r][c] === END) {
      if (cost > bestCost) break;

      bestCost = cost;
      endStates.add(currentKey);
    }

    const moves = [
      [cost + STEP_COST, r + dr, c + dc, dr, dc],
      [cost + TURN_COST, r, c, dc, -dr],
      [cost + TURN_COST, r, c, -dc, dr],
    ];

    for (const [newCost, nr, nc, ndr, ndc] of moves) {
      if (maze[nr][nc] === WALL) continue;

      const newKey = `${nr},${nc},${ndr},${ndc}`;
      const lowest = lowestCost.get(newKey) || Infinity;

      if (newCost > lowest) continue;

      if (newCost < lowest) {
        backtrack.set(newKey, new Set());
        lowestCost.set(newKey, newCost);
      }

      if (!backtrack.get(newKey)) {
        backtrack.set(newKey, new Set());
      }

      backtrack.get(newKey)!.add(currentKey);
      priorityQueue.push([newCost, nr, nc, ndr, ndc]);
    }
  }

  return { bestCost, endStates, backtrack };
}

function getUniqueTiles(
  endStates: Set<string>,
  backtrack: Map<string, Set<string>>
): number {
  const seen: Set<string> = new Set(endStates);
  const states: string[] = Array.from(endStates);

  while (states.length > 0) {
    const key = states.shift()!;
    const lastStates = backtrack.get(key) || new Set();

    for (const last of lastStates) {
      if (seen.has(last)) continue;
      seen.add(last);
      states.push(last);
    }
  }

  const uniqueTiles = new Set<string>();

  for (const state of seen) {
    const [r, c] = state.split(',').map(Number);
    uniqueTiles.add(`${r},${c}`);
  }

  return uniqueTiles.size;
}
