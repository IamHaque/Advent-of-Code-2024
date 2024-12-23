import { evalResult } from '../utils.ts';

type Memory = { id: number; size: number };

/* Day 09 - Part 01 */

function part_01(input: string[]): number {
  let checksum = 0;

  input.forEach((line) => {
    const memory = line.split('').map((n) => Number(n));
    const original_memory = Array.from(memory);
    const reordered_memory = new Map<number, Memory[]>();

    let left_sum = 0;
    const left_free_index = reorderFreeMemory(memory, reordered_memory);

    for (let index = 0; index < left_free_index; index++) {
      if (index > 0) left_sum += original_memory[index - 1];

      if (index % 2 === 0) {
        const id = Math.floor(index / 2);
        const size = memory[index];

        checksum += id * sumOfSeries(left_sum, left_sum + size - 1);
      } else if (reordered_memory.has(index)) {
        let left_sum_extra = 0;

        reordered_memory.get(index)!.forEach(({ id, size }) => {
          checksum +=
            id *
            sumOfSeries(
              left_sum + left_sum_extra,
              left_sum + left_sum_extra + size - 1
            );

          left_sum_extra += size;
        });
      }
    }
  });

  return checksum;
}

evalResult(9, 1, part_01);

/* Day 09 - Part 02 */

function part_02(input: string[]): number {
  let checksum = 0;

  input.forEach((line) => {
    const memory = line.split('').map((n) => Number(n));
    const original_memory = Array.from(memory);
    const reordered_memory = new Map<number, Memory[]>();

    reorderFreeMemoryChunk(memory, reordered_memory);

    let left_sum = 0;

    for (let index = 0; index < memory.length; index++) {
      if (index > 0) left_sum += original_memory[index - 1];

      if (index % 2 === 0) {
        const id = Math.floor(index / 2);
        const size = memory[index];
        const right_sum = left_sum + size - 1;

        if (id === 0 || size === 0) continue;

        const sum_of_series = sumOfSeries(left_sum, right_sum);
        checksum += id * sum_of_series;
      } else if (reordered_memory.has(index)) {
        let left_sum_extra = 0;
        const free_memory = reordered_memory.get(index);

        free_memory!.forEach(({ id, size }) => {
          if (id === -1 || id === 0 || size === 0) return;

          const sum_of_series = sumOfSeries(
            left_sum + left_sum_extra,
            left_sum + left_sum_extra + size - 1
          );

          checksum += id * sum_of_series;
          left_sum_extra += size;
        });
      }
    }
  });

  return checksum;
}

evalResult(9, 2, part_02);

/* Shared functions */

function reorderFreeMemoryChunk(
  memory: number[],
  reordered_memory: Map<number, Memory[]>
): void {
  const memory_length = memory.length;
  const right_file_index =
    memory_length % 2 !== 0 ? memory_length - 1 : memory_length - 2;

  let left_free_index = 1;

  while (left_free_index < memory_length) {
    if (memory[left_free_index] === 0) {
      left_free_index += 2;
      continue;
    }

    if (!reordered_memory.has(left_free_index)) {
      reordered_memory.set(left_free_index, [
        { id: -1, size: memory[left_free_index] },
      ]);
    }

    const free_memory = reordered_memory.get(left_free_index);
    const free_memory_data = free_memory?.find(
      (m) => m.id === -1 && m.size > 0
    );

    if (!free_memory_data) {
      left_free_index += 2;
      continue;
    }

    for (
      let file_index = right_file_index;
      file_index > left_free_index;
      file_index -= 2
    ) {
      if (
        memory[file_index] > 0 &&
        free_memory_data.size >= memory[file_index]
      ) {
        free_memory_data.size -= memory[file_index];
        free_memory!.push({
          id: Math.floor(file_index / 2),
          size: memory[file_index],
        });
        memory[file_index] = 0;
      }
    }

    left_free_index += 2;
  }
}

function reorderFreeMemory(
  memory: number[],
  reordered_memory: Map<number, Memory[]>
): number {
  const memory_length = memory.length;
  let left_free_index = 1;
  let right_file_index =
    memory_length % 2 !== 0 ? memory_length - 1 : memory_length - 2;
  let right_file_id = Math.floor(memory_length / 2);

  while (left_free_index < right_file_index) {
    if (memory[left_free_index] === 0) {
      left_free_index += 2;
      continue;
    }

    if (memory[right_file_index] === 0) {
      right_file_index -= 2;
      right_file_id--;
      continue;
    }

    if (memory[left_free_index] <= memory[right_file_index]) {
      if (!reordered_memory.has(left_free_index)) {
        reordered_memory.set(left_free_index, []);
      }
      reordered_memory.get(left_free_index)!.push({
        id: right_file_id,
        size: memory[left_free_index],
      });

      memory[right_file_index] -= memory[left_free_index];
      memory[left_free_index] = 0;

      left_free_index += 2;
    } else {
      if (!reordered_memory.has(left_free_index)) {
        reordered_memory.set(left_free_index, []);
      }
      reordered_memory.get(left_free_index)!.push({
        id: right_file_id,
        size: memory[right_file_index],
      });

      memory[left_free_index] -= memory[right_file_index];
      memory[right_file_index] = 0;

      right_file_index -= 2;
      right_file_id--;
    }
  }

  return left_free_index;
}

function sumOfSeries(start: number, end: number): number {
  const n = end - start + 1;
  const sum = n * (2 * start + n - 1);
  return sum / 2;
}
