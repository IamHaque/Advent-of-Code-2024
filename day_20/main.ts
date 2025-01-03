import { evalResult } from '../utils.ts';

type Point = [number, number];

const DIRECTIONS = [
  [-1, 0], // UP
  [0, 1], // RIGHT
  [1, 0], // DOWN
  [0, -1], // LEFT
];

/* Day 20 - Part 01 */

function part_01(input: string[]): number {
  const { grid, end, start } = parseInput(input);
  if (!start || !end) return 0;

  const path = bfs(grid, start, end);
  if (path.length === 0) return 0;

  return getCheatsCount(path, 2);
}

evalResult(20, 1, part_01);

/* Day 20 - Part 02 */

function part_02(input: string[]): number {
  const { grid, end, start } = parseInput(input);
  if (!start || !end) return 0;

  const path = bfs(grid, start, end);
  if (path.length === 0) return 0;

  return getCheatsCount(path, 20);
}

evalResult(20, 2, part_02);

/* Shared functions */

function parseInput(input: string[]): {
  grid: string[][];
  end: Point | undefined;
  start: Point | undefined;
} {
  let end: Point | undefined;
  let start: Point | undefined;

  const grid = input.map((line, row) => {
    if (line.indexOf('E') >= 0) end = [row, line.indexOf('E')];
    if (line.indexOf('S') >= 0) start = [row, line.indexOf('S')];
    return line.split('');
  });

  return {
    grid,
    end,
    start,
  };
}

function bfs(grid: string[][], start: Point, end: Point): Point[] {
  const rows = grid.length;
  const cols = grid[0].length;

  const visited = new Set<string>();
  const queue: Point[][] = [];
  queue.push([start]);
  visited.add(`${start[0]},${start[1]}`);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const [r, c] = path[path.length - 1];

    if (r === end[0] && c === end[1]) {
      return path;
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;

      if (
        nr < 0 ||
        nr >= rows ||
        nc < 0 ||
        nc >= cols ||
        grid[nr][nc] === '#' ||
        visited.has(`${nr},${nc}`)
      )
        continue;

      const new_path = Array.from(path);
      new_path.push([nr, nc]);
      queue.push(new_path);
      visited.add(`${nr},${nc}`);
    }
  }

  return [];
}

function getCheatsCount(path: Point[], max_cheat_duration: number): number {
  let cheats_count = 0;
  const min_cheat_time = 100;

  for (let i = 0; i < path.length - 1; i++) {
    const [r, c] = path[i];

    for (let j = i + min_cheat_time; j < path.length; j++) {
      const [nr, nc] = path[j];
      const v = Math.abs(nr - r);
      const h = Math.abs(nc - c);

      const cheats_duration = v + h;
      const time_saved = j - i - cheats_duration;

      if (cheats_duration > max_cheat_duration) continue;
      if (time_saved < min_cheat_time) continue;

      cheats_count++;
    }
  }

  return cheats_count;
}
