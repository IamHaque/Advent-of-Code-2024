import { evalResult } from '../utils.ts';

type Position = {
  row: number;
  col: number;
  slope: string;
};

type Neighbors = Position[];

/* Day 10 - Part 01 */

function part_01(input: string[]): number {
  const map = input.map((line) => line.split(''));
  const trail_map = new Map<string, string[]>();

  map.forEach((row, row_index) => {
    row.forEach((_, col_index) => {
      if (row[col_index] !== '0') return;

      const position = {
        row: row_index,
        col: col_index,
        slope: row[col_index],
      } as Position;
      const position_key = getPositionKey(position);

      if (!trail_map.has(position_key)) trail_map.set(position_key, []);

      findTrail(map, trail_map, position, position);
    });
  });

  return Array.from(trail_map).reduce(
    (trail_sum, [_, trail_paths]) => trail_sum + trail_paths.length,
    0
  );
}

evalResult(10, 1, part_01);

/* Day 10 - Part 02 */

function part_02(input: string[]): number {
  const map = input.map((line) => line.split(''));
  const trail_map = new Map<string, number>();

  map.forEach((row, row_index) => {
    row.forEach((_, col_index) => {
      if (row[col_index] !== '0') return;

      const position = {
        row: row_index,
        col: col_index,
        slope: row[col_index],
      } as Position;

      findTrailRating(map, trail_map, position, position);
    });
  });

  return Array.from(trail_map).reduce(
    (trail_sum, [_, trail_rating]) => trail_sum + trail_rating,
    0
  );
}

evalResult(10, 2, part_02);

/* Shared functions */

function findTrailRating(
  map: string[][],
  trail_map: Map<string, number>,
  start_position: Position,
  position: Position
): void {
  if (position.slope === '9') {
    const start_position_key = getPositionKey(start_position);
    trail_map.set(
      start_position_key,
      (trail_map.get(start_position_key) ?? 0) + 1
    );
    return;
  }

  const neighbors = getNeighbors(map, position);

  for (let index = 0; index < neighbors.length; index++) {
    const neighbour = neighbors[index];

    if (neighbour.slope === '.') continue;
    if (Number(neighbour.slope) - Number(position.slope) !== 1) continue;

    findTrailRating(map, trail_map, start_position, neighbour);
  }
}

function findTrail(
  map: string[][],
  trail_map: Map<string, string[]>,
  start_position: Position,
  position: Position
): void {
  if (position.slope === '9') {
    const position_key = getPositionKey(position);
    const start_position_key = getPositionKey(start_position);

    if (!trail_map.get(start_position_key)!.includes(position_key))
      trail_map.get(start_position_key)!.push(position_key);

    return;
  }

  const neighbors = getNeighbors(map, position);

  for (let index = 0; index < neighbors.length; index++) {
    const neighbour = neighbors[index];

    if (neighbour.slope === '.') continue;
    if (Number(neighbour.slope) - Number(position.slope) !== 1) continue;

    findTrail(map, trail_map, start_position, neighbour);
  }
}

function getNeighbors(map: string[][], position: Position): Neighbors {
  const { row, col } = position;

  return [
    // UP
    {
      row: row - 1,
      col,
      slope: map?.[row - 1]?.[col] ?? '.',
    },
    // RIGHT
    {
      row,
      col: col + 1,
      slope: map?.[row]?.[col + 1] ?? '.',
    },
    // DOWN
    {
      row: row + 1,
      col,
      slope: map?.[row + 1]?.[col] ?? '.',
    },
    // LEFT
    {
      row,
      col: col - 1,
      slope: map?.[row]?.[col - 1] ?? '.',
    },
  ];
}

function getPositionKey(position: Position): string {
  return `${position.row},${position.col}`;
}
