import { evalResult } from '../utils.ts';

const WORD = 'XMAS';

/* Day 04 - Part 01 */

function part_01(grid: string[]): number {
  let xmas_count = 0;
  const row_count = grid.length;
  const col_count = grid[0].length;

  for (let row = 0; row < row_count; row++) {
    for (let col = 0; col < col_count; col++) {
      if (checkUp(grid, row, col)) xmas_count++;
      if (checkDown(grid, row, col)) xmas_count++;
      if (checkLeft(grid, row, col)) xmas_count++;
      if (checkRight(grid, row, col)) xmas_count++;

      if (checkTopLeft(grid, row, col)) xmas_count++;
      if (checkTopRight(grid, row, col)) xmas_count++;
      if (checkBottomLeft(grid, row, col)) xmas_count++;
      if (checkBottomRight(grid, row, col)) xmas_count++;
    }
  }

  return xmas_count;
}

evalResult(4, 1, part_01);

/* Day 04 - Part 02 */

function part_02(grid: string[]): number {
  let xmas_count = 0;
  const row_count = grid.length;
  const col_count = grid[0].length;

  for (let row = 0; row < row_count; row++) {
    for (let col = 0; col < col_count; col++) {
      if (grid[row][col] !== 'A') continue;

      if (checkXMas(grid, row, col)) xmas_count++;
    }
  }

  return xmas_count;
}

evalResult(4, 2, part_02, '_02');

/* Shared functions */

function checkUp(grid: string[], row: number, col: number): boolean {
  if (row < WORD.length - 1) return false;

  for (let i = 0; i < WORD.length; i++) {
    if (grid[row - i][col] !== WORD[i]) {
      return false;
    }
  }

  return true;
}

function checkDown(grid: string[], row: number, col: number): boolean {
  if (row > grid.length - WORD.length) return false;

  for (let i = 0; i < WORD.length; i++) {
    if (grid[row + i][col] !== WORD[i]) {
      return false;
    }
  }

  return true;
}

function checkLeft(grid: string[], row: number, col: number): boolean {
  if (col < WORD.length - 1) return false;

  for (let i = 0; i < WORD.length; i++) {
    if (grid[row][col - i] !== WORD[i]) {
      return false;
    }
  }

  return true;
}

function checkRight(grid: string[], row: number, col: number): boolean {
  if (col > grid[0].length - WORD.length) return false;

  for (let i = 0; i < WORD.length; i++) {
    if (grid[row][col + i] !== WORD[i]) {
      return false;
    }
  }

  return true;
}

function checkTopLeft(grid: string[], row: number, col: number): boolean {
  if (row < WORD.length - 1) return false;
  if (col < WORD.length - 1) return false;

  for (let i = 0; i < WORD.length; i++) {
    if (grid[row - i][col - i] !== WORD[i]) {
      return false;
    }
  }

  return true;
}

function checkTopRight(grid: string[], row: number, col: number): boolean {
  if (row < WORD.length - 1) return false;
  if (col > grid[0].length - WORD.length) return false;

  for (let i = 0; i < WORD.length; i++) {
    if (grid[row - i][col + i] !== WORD[i]) {
      return false;
    }
  }

  return true;
}

function checkBottomLeft(grid: string[], row: number, col: number): boolean {
  if (col < WORD.length - 1) return false;
  if (row > grid.length - WORD.length) return false;

  for (let i = 0; i < WORD.length; i++) {
    if (grid[row + i][col - i] !== WORD[i]) {
      return false;
    }
  }

  return true;
}

function checkBottomRight(grid: string[], row: number, col: number): boolean {
  if (row > grid.length - WORD.length) return false;
  if (col > grid[0].length - WORD.length) return false;

  for (let i = 0; i < WORD.length; i++) {
    if (grid[row + i][col + i] !== WORD[i]) {
      return false;
    }
  }

  return true;
}

function checkXMas(grid: string[], row: number, col: number): boolean {
  if (row === 0 || row === grid.length - 1) return false;
  if (col === 0 || col === grid[0].length - 1) return false;

  const topLeft = grid[row - 1][col - 1];
  const topRight = grid[row - 1][col + 1];
  const bottomLeft = grid[row + 1][col + 1];
  const bottomRight = grid[row + 1][col - 1];
  const pattern = topLeft + topRight + bottomLeft + bottomRight;

  return (
    pattern === 'MSSM' ||
    pattern === 'MMSS' ||
    pattern === 'SMMS' ||
    pattern === 'SSMM'
  );
}
