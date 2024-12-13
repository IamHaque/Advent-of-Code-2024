import { evalResult } from '../utils.ts';

const PATH = '.';

type Position = {
  row: number;
  col: number;
};

type PositionAndKey = Position & {
  key: string;
};

/* Day 08 - Part 01 */

function part_01(input: string[]): number {
  const map = input.map((line) => line.split(''));
  const antennas = new Map<string, Position[]>();
  const antinodes = new Set<string>();

  map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === PATH) return;
      if (!antennas.has(cell)) antennas.set(cell, []);
      antennas.get(cell)!.push({ row: rowIndex, col: colIndex });
    });
  });

  antennas.forEach((positions) => {
    const paths: string[] = getUniquePaths(positions);

    paths.map((path) => {
      const [A, B] = getPositionsFromPath(path);

      getAntinodesInDir(map, antinodes, A, B, 'prev');
      getAntinodesInDir(map, antinodes, A, B, 'next');
    });
  });

  return antinodes.size;
}

evalResult(8, 1, part_01);

/* Day 08 - Part 02 */

function part_02(input: string[]): number {
  const map = input.map((line) => line.split(''));
  const antennas = new Map<string, Position[]>();
  const antinodes = new Set<string>();

  map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === PATH) return;

      if (!antennas.has(cell)) antennas.set(cell, []);
      antennas.get(cell)!.push({ row: rowIndex, col: colIndex });

      const cell_key = `${rowIndex},${colIndex}`;
      if (!antinodes.has(cell_key)) antinodes.add(cell_key);
    });
  });

  antennas.forEach((positions) => {
    const paths: string[] = getUniquePaths(positions);

    paths.map((path) => {
      const [A, B] = getPositionsFromPath(path);

      getAntinodesInDir(map, antinodes, A, B, 'prev', false);
      getAntinodesInDir(map, antinodes, A, B, 'next', false);
    });
  });

  return antinodes.size;
}

evalResult(8, 2, part_02);

/* Shared functions */

function getUniquePaths(positions: Position[]): string[] {
  const paths: string[] = [];

  if (positions.length < 1) return paths;

  for (let i = 0; i < positions.length - 1; i++) {
    const curr_position = positions[i];
    const curr_position_key = `${curr_position.row},${curr_position.col}`;

    for (let j = i + 1; j < positions.length; j++) {
      const next_position = positions[j];
      const next_position_key = `${next_position.row},${next_position.col}`;

      const key = `${curr_position_key}-${next_position_key}`;
      const key_reversed = `${next_position_key}-${curr_position_key}`;

      if (!paths.includes(key) && !paths.includes(key_reversed)) {
        paths.push(key);
      }
    }
  }

  return paths;
}

function getPositionsFromPath(path: string): [PositionAndKey, PositionAndKey] {
  const [pos_1, pos_2] = path.split('-');

  const [x_1, y_1] = pos_1.split(',').map((n) => Number(n));
  const [x_2, y_2] = pos_2.split(',').map((n) => Number(n));

  const A: PositionAndKey = { row: x_1, col: y_1, key: `${x_1},${y_1}` };
  const B: PositionAndKey = { row: x_2, col: y_2, key: `${x_2},${y_2}` };

  return [A, B];
}

function getAntinodesInDir(
  map: string[][],
  antinodes: Set<string>,
  pos_1: PositionAndKey,
  pos_2: PositionAndKey,
  direction: 'prev' | 'next',
  get_once = true
): void {
  const new_pos = findEquidistantPoint(
    pos_1,
    pos_2,
    direction === 'prev' ? pos_1 : pos_2
  );

  if (!isInsideBounds(map, new_pos)) return;

  if (!antinodes.has(new_pos.key)) antinodes.add(new_pos.key);

  if (get_once) return;

  if (direction === 'prev') {
    getAntinodesInDir(map, antinodes, new_pos, pos_1, direction, get_once);
  } else {
    getAntinodesInDir(map, antinodes, pos_2, new_pos, direction, get_once);
  }
}

function findEquidistantPoint(
  A: PositionAndKey,
  B: PositionAndKey,
  M: PositionAndKey
): PositionAndKey {
  const row = 2 * M.row - (A === M ? B.row : A.row);
  const col = 2 * M.col - (A === M ? B.col : A.col);

  return {
    key: `${row},${col}`,
    row,
    col,
  };
}

function isInsideBounds(map: string[][], position: PositionAndKey): boolean {
  return (
    position.row >= 0 &&
    position.col >= 0 &&
    position.row < map.length &&
    position.col < map[0].length
  );
}
