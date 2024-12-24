import { evalResult } from '../utils.ts';

type Point = [number, number];

/* Day 18 - Part 01 */

function part_01(input: string[]): number {
  const corrupted_bytes = input.map(
    (line) => line.split(',').map((n) => Number(n)) as Point
  );

  if (corrupted_bytes[0].length < 2) return 0;

  const size = corrupted_bytes.length < 50 ? 7 : 71;
  const bytes = corrupted_bytes.slice(0, (size === 7 ? 12 : 1024) + 1);

  const grid = generateGrid(size, bytes);

  const start: Point = [0, 0];
  const end: Point = [size - 1, size - 1];

  const { path: path_map, reached_end } = BFS(grid, start, end);
  if (!reached_end) return 0;

  const path: Point[] = constructPath(start, end, path_map);

  return path.length - 1;
}

evalResult(18, 1, part_01);

/* Day 18 - Part 02 */

function part_02(input: string[]): string {
  const corrupted_bytes = input.map(
    (line) => line.split(',').map((n) => Number(n)) as Point
  );

  if (corrupted_bytes[0].length < 2) return '';

  const size = corrupted_bytes.length < 50 ? 7 : 71;

  const start: Point = [0, 0];
  const end: Point = [size - 1, size - 1];

  let last_byte = size === 7 ? 12 : 1024;

  const bytes = corrupted_bytes.slice(0, last_byte + 1);
  const grid = generateGrid(size, bytes);

  while (last_byte < corrupted_bytes.length) {
    const new_byte = corrupted_bytes[last_byte] as Point;
    bytes.push(new_byte);

    grid[new_byte[1]][new_byte[0]] = '#';

    const { reached_end } = BFS(grid, start, end);

    if (!reached_end) break;

    last_byte++;
  }

  return corrupted_bytes[last_byte].join(',');
}

evalResult(18, 2, part_02);

/* Shared functions */

function generateGrid(size: number, bytes: Point[]): string[][] {
  const grid = Array.from(Array(size)).map((_) =>
    Array.from(Array(size)).map((_) => '.')
  );

  bytes.forEach(([x, y]) => {
    grid[y][x] = '#';
  });

  return grid;
}

function BFS(
  grid: string[][],
  start: Point,
  end: Point
): { path: Map<string, Point>; reached_end: boolean } {
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

  let reached_end = false;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;

    if (r === end[0] && c === end[1]) {
      reached_end = true;
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

  return { path, reached_end };
}

function constructPath(
  start: Point,
  end: Point,
  path_map: Map<string, Point>
): Point[] {
  let current = end;
  const resultPath: Point[] = [end];

  while (Array.isArray(current)) {
    const [cr, cc] = current;
    if (cr === start[0] && cc === start[1]) break;

    current = path_map.get(`${cr},${cc}`)!;
    resultPath.push(current);
  }

  return resultPath;
}
