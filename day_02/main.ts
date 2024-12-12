import { evalResult } from "../utils.ts";

/* Day 02 - Part 01 */

function part_01(reports: string[]): number {
  let safe_report_count = 0;

  reports.forEach((report) => {
    const levels = report.split(/\s+/);

    if (is_report_safe(levels)) {
      safe_report_count++;
    }
  });

  return safe_report_count;
}

evalResult(
  2,
  1,
  part_01,
);

/* Day 02 - Part 02 */

function part_02(reports: string[]): number {
  let safe_report_count = 0;

  reports.forEach((report) => {
    const levels = report.split(/\s+/);

    let is_safe = is_report_safe(levels);

    if (!is_safe) {
      for (let index = 0; index < levels.length; index++) {
        const new_levels = levels.slice(0, index).concat(
          levels.slice(index + 1),
        );
        is_safe = is_report_safe(new_levels);
        if (is_safe) break;
      }
    }

    if (is_safe) {
      safe_report_count++;
    }
  });

  return safe_report_count;
}

evalResult(
  2,
  2,
  part_02,
);

/* Shared functions */

function is_report_safe(levels: string[]): boolean {
  let is_increasing: boolean | undefined;

  for (let i = 0; i < levels.length - 1; i++) {
    const curr_level = Number(levels[i]);
    const next_level = Number(levels[i + 1]);

    const difference = Math.abs(next_level - curr_level);
    const direction = next_level >= curr_level ? "INC" : "DEC";

    if (is_increasing === undefined) {
      is_increasing = direction === "INC";
    }

    if (
      difference < 1 || difference > 3 ||
      is_increasing && direction !== "INC" ||
      !is_increasing && direction === "INC"
    ) {
      return false;
    }
  }

  return true;
}
