import { evalResult } from '../utils.ts';

type Plot = {
  area: number;
  plant: string;
  visited: boolean;
  checks: string[];
  region?: Record<Direction, [number, number][]> | null;
};
type Garden = Plot[][];
type Direction = (typeof DIRECTIONS_NAME)[number];

const DIRECTIONS_NAME = ['UP', 'RIGHT', 'DOWN', 'LEFT'] as const;
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
  let fencing_price = 0;
  const garden: Garden = input.map((row) =>
    row.split('').map((cell) => ({
      plant: cell,
      area: 0,
      checks: [],
      region: null,
      visited: false,
    }))
  );

  for (let row = 0; row < garden.length; row++) {
    for (let col = 0; col < garden[0].length; col++) {
      const plot = garden[row][col];
      if (plot.visited) continue;

      plot.region = {
        UP: [],
        RIGHT: [],
        DOWN: [],
        LEFT: [],
      };

      traversePlotEdges(garden, row, col, plot, plot);
      const { total_edges, adjacent_edges } = calculatePlotEdges(plot);

      fencing_price += plot.area * (total_edges - adjacent_edges);
    }
  }

  return fencing_price;
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

function traversePlotEdges(
  garden: Garden,
  row: number,
  col: number,
  initial_plot: Plot,
  current_plot: Plot
) {
  if (current_plot.visited) return 0;

  initial_plot.area += 1;
  current_plot.visited = true;

  for (let i = 0; i < DIRECTIONS.length; i++) {
    const direction = DIRECTIONS_NAME[i];
    const new_row = row + DIRECTIONS[i][0];
    const new_col = col + DIRECTIONS[i][1];

    if (
      new_row < 0 ||
      new_row >= garden.length ||
      new_col < 0 ||
      new_col >= garden[0].length
    ) {
      initial_plot.region![direction].push([new_row, new_col]);
      continue;
    }

    const next_plot = garden[new_row][new_col];

    if (next_plot.plant !== current_plot.plant) {
      initial_plot.region![direction].push([new_row, new_col]);
      continue;
    }

    traversePlotEdges(garden, new_row, new_col, initial_plot, next_plot);
  }
}

function calculatePlotEdges(plot: Plot) {
  let total_edges = 0;
  let adjacent_edges = 0;

  for (const direction in plot.region) {
    const points = plot.region[direction as Direction];
    total_edges += points.length;

    for (let i = 0; i < points.length - 1; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const [row1, col1] = points[i];
        const [row2, col2] = points[j];
        const rowDistance = Math.abs(row1 - row2);
        const colDistance = Math.abs(col1 - col2);

        if (
          (rowDistance === 1 && colDistance === 0) ||
          (rowDistance === 0 && colDistance === 1)
        ) {
          adjacent_edges++;
        }
      }
    }
  }
  return { total_edges, adjacent_edges };
}
