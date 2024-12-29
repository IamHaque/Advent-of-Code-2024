import { evalResult } from '../utils.ts';

type Formulas = Record<string, [string, string, string]>;

type Gate = Map<string, GateInput>;
type GateType = 'AND' | 'OR' | 'XOR';
type GateInput = [number | string, GateType, number | string, number?];

/* Day 24 - Part 01 */

function part_01(input: string[]): number {
  const { gates, output_gates } = parseInput(input);

  output_gates.forEach((_, gate_name) => {
    solveRecursively(gates, output_gates, gate_name);
  });

  return output_gates
    .keys()
    .toArray()
    .sort()
    .reduce(
      (num, k, i) => num + (output_gates.get(k)?.[3] ?? 0) * Math.pow(2, i),
      0
    );
}

evalResult(24, 1, part_01);

/* Day 24 - Part 02 */

function part_02(input: string[]): string {
  const formulas = parseSecondInput(input);

  const swaps: string[] = [];

  for (let i = 0; i < 4; i++) {
    const baseline = progress(formulas);

    let swapped = false;

    for (const x in formulas) {
      for (const y in formulas) {
        if (x === y) continue;

        // Swap formulas
        const temp = formulas[x];
        formulas[x] = formulas[y];
        formulas[y] = temp;

        if (progress(formulas) > baseline) {
          swapped = true;
          swaps.push(x, y);
          break;
        }

        // Revert swap
        formulas[y] = formulas[x];
        formulas[x] = temp;
      }

      if (swapped) break;
    }
  }

  return swaps.sort().join(',');
}

evalResult(24, 2, part_02, '_02');

/* Shared functions */

function parseInput(input: string[]): {
  gates: Gate;
  output_gates: Gate;
  x: number;
  y: number;
} {
  const gates: Gate = new Map();
  const output_gates: Gate = new Map();
  const wire_inputs = new Map<string, number>();

  input.forEach((line) => {
    if (!line) return;

    if (line.indexOf(': ') >= 0) {
      const [wire, value] = line.split(': ');
      wire_inputs.set(wire, Number(value));
    }

    if (line.indexOf(' -> ') >= 0) {
      const [gate_inputs, gate_output] = line.split(' -> ');
      const [wire_1, gate_type, wire_2] = gate_inputs.split(' ');

      const gate_input = [
        wire_inputs.get(wire_1) ?? wire_1,
        gate_type as GateType,
        wire_inputs.get(wire_2) ?? wire_2,
      ] as GateInput;

      if (gate_output.startsWith('z')) {
        output_gates.set(gate_output, gate_input);
      } else {
        gates.set(gate_output, gate_input);
      }
    }
  });

  const { x, y } = getInputNumbers(wire_inputs);
  return { gates, output_gates, x, y };
}

function getInputNumbers(wire_inputs: Map<string, number>): {
  x: number;
  y: number;
} {
  let x = 0;
  let y = 0;

  wire_inputs.forEach((value, wire) => {
    const bit = wire.substring(1, wire.length);

    if (wire.startsWith('x')) {
      x += value * Math.pow(2, Number(bit));
    } else {
      y += value * Math.pow(2, Number(bit));
    }
  });

  return { x, y };
}

function performOperation(n1: number, n2: number, op: GateType): number {
  if (op === 'AND') {
    return n1 & n2;
  } else if (op === 'OR') {
    return n1 | n2;
  } else {
    return n1 ^ n2;
  }
}

function solveRecursively(
  gates: Gate,
  output_gates: Gate,
  gate_name: string
): number {
  const gate = gates.get(gate_name) ?? output_gates.get(gate_name);

  if (typeof gate![0] === 'string') {
    gate![0] = solveRecursively(gates, output_gates, gate![0]);
  }

  if (typeof gate![2] === 'string') {
    gate![2] = solveRecursively(gates, output_gates, gate![2]);
  }

  if (gate![3] !== undefined) return gate![3];

  const result = performOperation(
    gate![0] as number,
    gate![2] as number,
    gate![1]
  );
  gate!.push(result);
  return result;
}

function parseSecondInput(input: string[]): Formulas {
  const formulas: Formulas = {};

  input.forEach((line) => {
    if (!line) return;
    if (!line.includes('->')) return;

    const [x, op, y, z] = line.replace(' -> ', ' ').split(' ');
    formulas[z] = [op, x, y];
  });

  return formulas;
}

function makeWire(char: string, num: number): string {
  return char + num.toString().padStart(2, '0');
}

function verifyZ(formulas: Formulas, wire: string, num: number): boolean {
  if (!(wire in formulas)) return false;
  const [op, x, y] = formulas[wire];
  if (op !== 'XOR') return false;
  if (num === 0) return [x, y].sort().join() === ['x00', 'y00'].sort().join();

  return (
    (verifyIntermediateXor(formulas, x, num) &&
      verifyCarryBit(formulas, y, num)) ||
    (verifyIntermediateXor(formulas, y, num) &&
      verifyCarryBit(formulas, x, num))
  );
}

function verifyIntermediateXor(
  formulas: Formulas,
  wire: string,
  num: number
): boolean {
  if (!(wire in formulas)) return false;
  const [op, x, y] = formulas[wire];
  if (op !== 'XOR') return false;
  return (
    [x, y].sort().join() ===
    [makeWire('x', num), makeWire('y', num)].sort().join()
  );
}

function verifyCarryBit(
  formulas: Formulas,
  wire: string,
  num: number
): boolean {
  if (!(wire in formulas)) return false;
  const [op, x, y] = formulas[wire];
  if (num === 1) {
    if (op !== 'AND') return false;
    return [x, y].sort().join() === ['x00', 'y00'].sort().join();
  }
  if (op !== 'OR') return false;

  return (
    (verifyDirectCarry(formulas, x, num - 1) &&
      verifyRecarry(formulas, y, num - 1)) ||
    (verifyDirectCarry(formulas, y, num - 1) &&
      verifyRecarry(formulas, x, num - 1))
  );
}

function verifyDirectCarry(
  formulas: Formulas,
  wire: string,
  num: number
): boolean {
  if (!(wire in formulas)) return false;
  const [op, x, y] = formulas[wire];
  if (op !== 'AND') return false;
  return (
    [x, y].sort().join() ===
    [makeWire('x', num), makeWire('y', num)].sort().join()
  );
}

function verifyRecarry(formulas: Formulas, wire: string, num: number): boolean {
  if (!(wire in formulas)) return false;
  const [op, x, y] = formulas[wire];
  if (op !== 'AND') return false;
  return (
    (verifyIntermediateXor(formulas, x, num) &&
      verifyCarryBit(formulas, y, num)) ||
    (verifyIntermediateXor(formulas, y, num) &&
      verifyCarryBit(formulas, x, num))
  );
}

function verify(formulas: Formulas, num: number): boolean {
  return verifyZ(formulas, makeWire('z', num), num);
}

function progress(formulas: Formulas): number {
  let i = 0;
  while (true) {
    if (!verify(formulas, i)) break;
    i++;
  }
  return i;
}
