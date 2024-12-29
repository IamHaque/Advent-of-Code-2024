import { evalResult } from '../utils.ts';

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

function part_02(input: string[]): number {
  return 0;
}

evalResult(24, 2, part_02);

/* Shared functions */

function parseInput(input: string[]): {
  gates: Gate;
  output_gates: Gate;
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

  return { gates, output_gates };
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
