import { evalResult } from '../utils.ts';

type Position = {
  row: number;
  col: number;
};
type WarehouseItem = 'O' | '#' | '@' | '.';

const BOX = 'O';
const WALL = '#';
const ROBOT = '@';
const FLOOR = '.';

const MOVES_LIST = {
  '^': [-1, 0],
  '>': [0, 1],
  v: [1, 0],
  '<': [0, -1],
} as const;

/* Day 15 - Part 01 */

function part_01(input: string[]): number {
  const { moves, robot, warehouse } = parseInput(input);

  if (warehouse.length === 0) return 0;

  for (const move of moves) {
    const move_offset = MOVES_LIST[move as keyof typeof MOVES_LIST];
    const robot_position: Position = { row: robot.row, col: robot.col };

    moveRobot(warehouse, robot, robot_position, move_offset);
  }

  let gps_sum = 0;

  warehouse.forEach((row, row_index) => {
    row.forEach((col, col_index) => {
      if (col === BOX) {
        gps_sum += 100 * row_index + col_index;
      }
    });
  });

  return gps_sum;
}

evalResult(15, 1, part_01);

/* Day 15 - Part 02 */

function part_02(input: string[]): number {
  return 0;
}

evalResult(15, 2, part_02);

/* Shared functions */

function parseInput(input: string[]): {
  moves: string;
  robot: Position;
  warehouse: WarehouseItem[][];
} {
  const warehouse: WarehouseItem[][] = [];

  let moves = '';
  let robot: Position = { row: 0, col: 0 };

  input.forEach((line, index) => {
    if (!line) return;

    if (!line.startsWith(WALL)) {
      moves += line;
      return;
    }

    warehouse.push(line.split('') as WarehouseItem[]);

    for (let col = 0; col < line.length; col++) {
      if (line[col] === ROBOT) {
        robot = { row: index, col };
      }
    }
  });

  return {
    moves,
    robot,
    warehouse,
  };
}

function moveRobot(
  warehouse: WarehouseItem[][],
  robot: Position,
  start_position: Position,
  move_offset: (typeof MOVES_LIST)[keyof typeof MOVES_LIST]
) {
  const [r, c] = move_offset;
  const { row, col } = start_position;

  let curr_row = row + r;
  let curr_col = col + c;
  let curr_item = warehouse[curr_row][curr_col];

  while (true) {
    if (curr_item === WALL) return;

    if (curr_item === FLOOR) break;

    curr_row += r;
    curr_col += c;
    curr_item = warehouse[curr_row][curr_col];
  }

  while (true) {
    if (curr_row === row && curr_col === col) return;

    const prev_row = curr_row - r;
    const prev_col = curr_col - c;

    curr_item = warehouse[curr_row][curr_col];
    const prev_item = warehouse[prev_row][prev_col];

    warehouse[curr_row][curr_col] = prev_item;
    warehouse[prev_row][prev_col] = curr_item;

    if (prev_item === ROBOT) {
      robot.row = curr_row;
      robot.col = curr_col;
    }

    curr_row = prev_row;
    curr_col = prev_col;
  }
}
