import { evalResult } from '../utils.ts';

type Plot = { plant: string; area: number; checks: string[]; visited: boolean };
type Garden = Plot[][];

const DIRECTIONS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

/* Day 12 - Part 01 */

function part_01(input: string[]): number {
  let fencing_price = 0;
  const garden: Garden = input.map((row) =>
    row
      .split('')
      .map((cell) => ({ plant: cell, area: 0, checks: [], visited: false }))
  );

  for (let row = 0; row < garden.length; row++) {
    for (let col = 0; col < garden[0].length; col++) {
      const plot = garden[row][col];
      if (plot.visited) continue;
      const region_perimeter = traversePlot(garden, row, col, plot, plot);

      fencing_price += plot.area * region_perimeter;
    }
  }

  return fencing_price;
}

evalResult(12, 1, part_01);

/* Day 12 - Part 02 */

function part_02(input: string[]): number {
  return 0;
}

evalResult(12, 2, part_02);

/* Shared functions */

function traversePlot(
  garden: Garden,
  row: number,
  col: number,
  initial_plot: Plot,
  current_plot: Plot
): number {
  if (current_plot.visited) return 0;

  let perimeter = 0;
  initial_plot.area += 1;
  current_plot.visited = true;

  for (const direction of DIRECTIONS) {
    const new_row = row + direction[0];
    const new_col = col + direction[1];

    if (
      new_row < 0 ||
      new_row >= garden.length ||
      new_col < 0 ||
      new_col >= garden[0].length
    ) {
      perimeter++;
      continue;
    }

    const next_plot = garden[new_row][new_col];
    const check = `${row},${col} -> ${new_row},${new_col}`;

    if (current_plot.checks.includes(check)) continue;
    current_plot.checks.push(check);

    if (next_plot.plant !== current_plot.plant) {
      perimeter++;
    } else {
      perimeter += traversePlot(
        garden,
        new_row,
        new_col,
        initial_plot,
        next_plot
      );
    }
  }

  return perimeter;
}
