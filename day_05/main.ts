import { evalResult } from "../utils.ts";

/* Day 05 - Part 01 */

function part_01(input: string[]): number {
  const rules: string[] = [];
  const pages: Array<number[]> = [];

  input.forEach((line) => {
    if (line.indexOf(",") >= 0) {
      pages.push(line.split(",").map((n) => Number(n)));
    }
    if (line.indexOf("|") >= 0) {
      rules.push(line.trim());
    }
  });

  let middle_page_sum = 0;

  pages.forEach((page) => {
    if (!arePagesInOrder(page, rules)) return;

    const middle_page = page[Math.floor(page.length / 2)];
    middle_page_sum += middle_page;
  });

  return middle_page_sum;
}

evalResult(
  5,
  1,
  part_01,
);

/* Day 05 - Part 02 */

function part_02(input: string[]): number {
  return 0;
}

evalResult(
  5,
  2,
  part_02,
);

/* Shared functions */

function arePagesInOrder(page: number[], rules: string[]): boolean {
  for (let i = 0; i < page.length - 1; i++) {
    const curr_number = page[i];

    for (let j = i + 1; j < page.length; j++) {
      const next_number = page[j];
      const rule = `${curr_number}|${next_number}`;

      if (!rules.includes(rule)) return false;
    }
  }

  return true;
}
