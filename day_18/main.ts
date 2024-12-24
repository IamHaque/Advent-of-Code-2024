import { evalResult } from '../utils.ts';

type Point = [number, number];

/* Day 18 - Part 01 */

function part_01(input: string[]): number {
  const grid = parseInput(input);

  const size = grid.length;
  const start: Point = [0, 0];
  const end: Point = [size - 1, size - 1];

  const path_map: Map<string, Point> = BFS(grid, start, end);

  const path: Point[] = constructPath(start, end, path_map);

  return path.length - 1;
}

evalResult(18, 1, part_01);

/* Day 18 - Part 02 */

function part_02(input: string[]): number {
  return 0;
}

evalResult(18, 2, part_02);

/* Shared functions */

function parseInput(input: string[]): string[][] {
  const size = input.length < 50 ? 7 : 71;
  let line_limit = size === 7 ? 12 : 1024;

  const grid = Array.from(Array(size)).map((_) =>
    Array.from(Array(size)).map((_) => '.')
  );

  for (const line of input) {
    line_limit--;
    if (!line) continue;
    if (line_limit < 0) break;

    const [x, y] = line.split(',').map((n) => Number(n));
    grid[y][x] = '#';
  }

  return grid;
}

function BFS(grid: string[][], start: Point, end: Point): Map<string, Point> {
  const visited = new Set<string>();
  const queue = new Array<Point>();
  const path = new Map<string, Point>();

  queue.push(start);
  visited.add(`${start[0]},${start[1]}`);

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;

    if (r === end[0] && c === end[1]) {
      break;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (
        nr < 0 ||
        nr >= grid.length ||
        nc < 0 ||
        nc >= grid[0].length ||
        grid[nr][nc] === '#' ||
        visited.has(`${nr},${nc}`)
      )
        continue;

      queue.push([nr, nc]);
      visited.add(`${nr},${nc}`);
      path.set(`${nr},${nc}`, [r, c]);
    }
  }

  return path;
}

function constructPath(
  start: Point,
  end: Point,
  path_map: Map<string, Point>
): Point[] {
  let current = end;
  const resultPath: Point[] = [end];

  while (true) {
    const [cr, cc] = current;
    if (cr === start[0] && cc === start[1]) break;

    current = path_map.get(`${cr},${cc}`)!;
    resultPath.push(current);
  }

  return resultPath;
}
