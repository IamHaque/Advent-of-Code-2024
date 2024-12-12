import { evalResult } from "../utils.ts";

const OBSTACLE = "#";
const VISITED_PATH = "X";
const GUARD_DIRECTIONS = {
  "^": [-1, 0],
  ">": [0, 1],
  "v": [1, 0],
  "<": [0, -1],
} as const;

type GuardDirection = keyof typeof GUARD_DIRECTIONS;
type GuardDirectionVector = typeof GUARD_DIRECTIONS[GuardDirection];
type GuardPosition = [number, number, GuardDirection, GuardDirectionVector];

const GUARD_FACES = Object.keys(GUARD_DIRECTIONS) as GuardDirection[];

/* Day 06 - Part 01 */

function part_01(input: string[]): number {
  const map = input.map((row) => row.split(""));

  while (true) {
    const guard_pos = getGuardPosition(map);

    if (!guard_pos) break;

    if (!canGuardMove(map, guard_pos)) {
      if (isGuardOutside(map, guard_pos)) break;

      turnGuard(map, guard_pos);
    }

    if (canGuardMove(map, guard_pos)) moveGuard(map, guard_pos);
  }

  return getVisitedPathCount(map);
}

evalResult(
  6,
  1,
  part_01,
);

/* Day 06 - Part 02 */

// function part_02(input: string[]): number {
//   return 0;
// }

// evalResult(
//   6,
//   2,
//   part_02,
// );

/* Shared functions */

function getGuardPosition(map: string[][]): GuardPosition | undefined {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      const icon = map[row][col] as GuardDirection;

      if (GUARD_FACES.includes(icon)) {
        return [row, col, icon, GUARD_DIRECTIONS[icon]];
      }
    }
  }
}

function canGuardMove(map: string[][], guard_pos: GuardPosition): boolean {
  const [row, col, _, direction] = guard_pos;
  const next_position_row = row + direction[0];
  const next_position_col = col + direction[1];

  if (next_position_row < 0 || next_position_row >= map.length) return false;
  if (next_position_col < 0 || next_position_col >= map[0].length) return false;

  const icon = map[next_position_row][next_position_col];

  return icon !== OBSTACLE;
}

function isGuardOutside(map: string[][], guard_pos: GuardPosition): boolean {
  const [row, col, _, direction] = guard_pos;
  const next_position_row = row + direction[0];
  const next_position_col = col + direction[1];

  if (
    next_position_row < 0 || next_position_row >= map.length ||
    next_position_col < 0 || next_position_col >= map[0].length
  ) {
    map[row][col] = VISITED_PATH;
    return true;
  }

  return false;
}

function moveGuard(map: string[][], guard_pos: GuardPosition): void {
  const [row, col, guard_icon, direction] = guard_pos;
  const next_position_row = row + direction[0];
  const next_position_col = col + direction[1];

  map[row][col] = VISITED_PATH;
  map[next_position_row][next_position_col] = guard_icon;
}

function turnGuard(map: string[][], guard_pos: GuardPosition): void {
  const [row, col, guard_icon] = guard_pos;

  const rotated_direction_index = (GUARD_FACES.indexOf(guard_icon) + 1) %
    GUARD_FACES.length;
  const rotated_direction = GUARD_FACES[rotated_direction_index];

  guard_pos[2] = rotated_direction;
  guard_pos[3] = GUARD_DIRECTIONS[rotated_direction];

  map[row][col] = rotated_direction;
}

function getVisitedPathCount(map: string[][]): number {
  let visited_path_count = 0;

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      const icon = map[row][col];

      if (icon === VISITED_PATH) {
        visited_path_count++;
      }
    }
  }

  return visited_path_count;
}
