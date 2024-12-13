import { evalResult } from '../utils.ts';

/* Day 05 - Part 01 */

function part_01(input: string[]): number {
  const pages: Array<number[]> = [];
  const rules = new Map<number, number[]>();

  input.forEach((line) => {
    if (line.indexOf(',') >= 0) {
      pages.push(line.split(',').map((n) => Number(n)));
    }
    if (line.indexOf('|') >= 0) {
      const [a, b] = line.split('|').map((n) => Number(n));
      const current_b = rules.get(a) ?? [];

      rules.set(a, [...current_b, b]);
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

evalResult(5, 1, part_01);

/* Day 05 - Part 02 */

function part_02(input: string[]): number {
  const pages: Array<number[]> = [];
  const rules = new Map<number, number[]>();

  input.forEach((line) => {
    if (line.indexOf(',') >= 0) {
      pages.push(line.split(',').map((n) => Number(n)));
    }
    if (line.indexOf('|') >= 0) {
      const [a, b] = line.split('|').map((n) => Number(n));
      const current_b = rules.get(a) ?? [];

      rules.set(a, [...current_b, b]);
    }
  });

  let middle_page_sum = 0;

  pages.forEach((page) => {
    if (arePagesInOrder(page, rules)) return;

    reorderPages(page, rules);

    const middle_page = page[Math.floor(page.length / 2)];
    middle_page_sum += middle_page;
  });

  return middle_page_sum;
}

evalResult(5, 2, part_02);

/* Shared functions */

function arePagesInOrder(
  page: number[],
  rules: Map<number, number[]>
): boolean {
  for (let i = 0; i < page.length - 1; i++) {
    const curr_number = page[i];
    const rule_for_number = rules.get(curr_number);

    if (!Array.isArray(rule_for_number) || rule_for_number.length === 0) {
      return false;
    }

    for (let j = i + 1; j < page.length; j++) {
      const item = page[j];

      if (!rule_for_number.includes(item)) {
        return false;
      }
    }
  }

  return true;
}

function reorderPages(page: number[], rules: Map<number, number[]>): void {
  for (let i = 0; i < page.length - 1; i++) {
    const curr_number = page[i];
    const rule_for_number = rules.get(curr_number);

    for (let j = i + 1; j < page.length; j++) {
      const item = page[j];

      if (
        !Array.isArray(rule_for_number) ||
        rule_for_number.length === 0 ||
        !rule_for_number.includes(item)
      ) {
        page[i--] = item;
        page[j] = curr_number;
        break;
      }
    }
  }
}
