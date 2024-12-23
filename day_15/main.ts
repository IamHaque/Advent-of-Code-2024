import { evalResult } from '../utils.ts';

type Position = {
  row: number;
  col: number;
};
type WarehouseItem =
  | typeof BOX
  | typeof BOX_LEFT
  | typeof BOX_RIGHT
  | typeof WALL
  | typeof ROBOT
  | typeof FLOOR;
type Move = keyof typeof MOVES_LIST;

const BOX = 'O';
const WALL = '#';
const ROBOT = '@';
const FLOOR = '.';
const BOX_LEFT = '[';
const BOX_RIGHT = ']';

const MOVES_LIST = {
  '^': [-1, 0],
  '>': [0, 1],
  v: [1, 0],
  '<': [0, -1],
} as const;

const WIDE_ITEMS = {
  [WALL]: [WALL, WALL],
  [FLOOR]: [FLOOR, FLOOR],
  [ROBOT]: [ROBOT, FLOOR],
  [BOX]: [BOX_LEFT, BOX_RIGHT],
} as const;

/* Day 15 - Part 01 */

function part_01(input: string[]): number {
  const { moves, robot, warehouse } = parseInput(input);

  if (warehouse.length === 0) return 0;

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i] as Move;
    const move_offset = MOVES_LIST[move];
    const robot_position: Position = { row: robot.row, col: robot.col };

    moveRobot(warehouse, robot, robot_position, move_offset);
  }

  return getGpsSum(warehouse, BOX);
}

evalResult(15, 1, part_01);

/* Day 15 - Part 02 */

function part_02(input: string[]): number {
  const { moves, robot, warehouse } = parseInput(input, true);

  if (warehouse.length === 0) return 0;

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i] as Move;

    const move_offset = MOVES_LIST[move];
    const robot_position: Position = { row: robot.row, col: robot.col };

    if (move === '<' || move === '>') {
      moveRobot(warehouse, robot, robot_position, move_offset);
    }

    if (move === '^' || move === 'v') {
      const items_to_move = new Set<string>();
      if (
        canMoveUpDownInWideWarehouse(
          warehouse,
          items_to_move,
          robot_position,
          move_offset
        )
      ) {
        moveUpDownInWideWarehouse(warehouse, robot, items_to_move, move_offset);
      }
    }
  }

  return getGpsSum(warehouse, BOX_LEFT);
}

evalResult(15, 2, part_02);

/* Shared functions */

function parseInput(
  input: string[],
  isWide = false
): {
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

    const parsedWideLine = [];

    for (let col = 0; col < line.length; col++) {
      const item = line[col];

      if (item === ROBOT) {
        robot = { row: index, col: col * (isWide ? 2 : 1) };
      }

      if (isWide) {
        parsedWideLine.push(...WIDE_ITEMS[item as keyof typeof WIDE_ITEMS]);
      }
    }

    if (isWide) {
      warehouse.push(parsedWideLine as WarehouseItem[]);
    } else {
      warehouse.push(line.split('') as WarehouseItem[]);
    }
  });

  return {
    moves,
    robot,
    warehouse,
  };
}

function getGpsSum(warehouse: WarehouseItem[][], item: WarehouseItem): number {
  let gps_sum = 0;

  warehouse.forEach((row, row_index) => {
    row.forEach((col, col_index) => {
      if (col === item) {
        gps_sum += 100 * row_index + col_index;
      }
    });
  });

  return gps_sum;
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

function canMoveUpDownInWideWarehouse(
  warehouse: WarehouseItem[][],
  items_to_move: Set<string>,
  start_position: Position,
  move_offset: (typeof MOVES_LIST)[keyof typeof MOVES_LIST]
): boolean {
  const [r, c] = move_offset;
  const { row, col } = start_position;

  const curr_row = row + r;
  const curr_col = col + c;
  const curr_item = warehouse[curr_row][curr_col];

  const position_key = `${curr_row},${curr_col}`;
  if (!items_to_move.has(position_key)) items_to_move.add(position_key);

  if (curr_item === WALL) return false;
  if (curr_item === FLOOR) return true;

  const can_move_left = canMoveUpDownInWideWarehouse(
    warehouse,
    items_to_move,
    { row: curr_row, col: curr_col - (curr_item === BOX_RIGHT ? 1 : 0) },
    move_offset
  );

  const can_move_right = canMoveUpDownInWideWarehouse(
    warehouse,
    items_to_move,
    { row: curr_row, col: curr_col + (curr_item === BOX_LEFT ? 1 : 0) },
    move_offset
  );

  return can_move_left && can_move_right;
}

function moveUpDownInWideWarehouse(
  warehouse: WarehouseItem[][],
  robot: Position,
  items_to_move: Set<string>,
  move_offset: (typeof MOVES_LIST)[keyof typeof MOVES_LIST]
) {
  const sorted_items_to_move = Array.from(items_to_move)
    .map((item_key) => {
      const [r, c] = item_key.split(',');
      return { row: Number(r), col: Number(c) } as Position;
    })
    .sort((a, b) => (b.row - a.row) * move_offset[0]);

  for (const item of sorted_items_to_move) {
    const { row, col } = item;
    const prev_row = row - move_offset[0];

    const curr_item = warehouse[row][col];
    const prev_item = warehouse[prev_row][col];

    if (prev_item === ROBOT) {
      robot.row = row;
      robot.col = col;
    }

    warehouse[row][col] = prev_item;
    warehouse[prev_row][col] = curr_item;
  }
}
