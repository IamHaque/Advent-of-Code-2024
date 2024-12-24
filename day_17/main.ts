import { evalResult } from '../utils.ts';

type Bit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type Program = Bit[];
type Register = number;
type Registers = [Register, Register, Register];

/* Day 17 - Part 01 */

function part_01(input: string[]): string {
  const { program, registers } = parseInput(input);

  const output = executeProgram(program, registers);

  return output.join(',');
}

evalResult(17, 1, part_01);

/* Day 17 - Part 02 */

function part_02(input: string[]): number {
  const { program } = parseInput(input);

  if (program.length === 0) return 0;

  const target_value = reduceProgram(program.join(','));

  return target_value * 8;
}

evalResult(17, 2, part_02, '_02');

/* Shared functions */

function parseInput(input: string[]): {
  program: Program;
  registers: Registers;
} {
  let program: Program = [];
  const registers: Registers = [0, 0, 0];

  input.forEach((line) => {
    if (line.indexOf('A: ') >= 0) registers[0] = Number(line.split('A: ')[1]);
    if (line.indexOf('B: ') >= 0) registers[1] = Number(line.split('B: ')[1]);
    if (line.indexOf('C: ') >= 0) registers[2] = Number(line.split('C: ')[1]);

    if (line.indexOf('Program: ') >= 0)
      program = line
        .split('Program: ')[1]
        .split(',')
        .map((n) => Number(n) as Bit);
  });

  return { program, registers };
}

function getComboOperand(registers: Registers, operand: Bit): number {
  if (operand >= 0 && operand <= 3) return operand;
  if (operand === 4) return registers[0];
  if (operand === 5) return registers[1];
  if (operand === 6) return registers[2];
  return 0;
}

function reduceProgram(program: string) {
  return program
    .split(',')
    .reduce(
      (acc, b, i) => (Number(b) === 0 ? acc : acc + Math.pow(8, i) * Number(b)),
      0
    );
}

function executeProgram(program: Program, registers: Registers): number[] {
  let pointer = 0;
  const output: number[] = [];

  while (pointer < program.length) {
    const opcode = program[pointer];
    const operand = program[pointer + 1];
    const comboOperand = getComboOperand(registers, operand);

    if (opcode === 0) {
      registers[0] = registers[0] >>> comboOperand;
    } else if (opcode === 1) {
      registers[1] = registers[1] ^ operand;
    } else if (opcode === 2) {
      registers[1] = comboOperand % 8;
    } else if (opcode === 3) {
      if (registers[0] !== 0) {
        pointer = operand;
        continue;
      }
    } else if (opcode === 4) {
      registers[1] = registers[1] ^ registers[2];
    } else if (opcode === 5) {
      output.push(comboOperand % 8);
    } else if (opcode === 6) {
      registers[1] = registers[0] >>> comboOperand;
    } else if (opcode === 7) {
      registers[2] = registers[0] >>> comboOperand;
    }

    pointer += 2;
  }

  return output;
}
