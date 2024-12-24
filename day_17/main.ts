import { evalResult } from '../utils.ts';

type Bit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type Program = Bit[];
type Register = number;
type Registers = [Register, Register, Register];

/* Day 17 - Part 01 */

function part_01(input: string[]): string {
  // Program: 0,1,5,4,3,0
  const output: number[] = [];
  const { program, registers } = parseInput(input);

  for (let i = 0; i < program.length - 1; i += 2) {
    const opcode = program[i];
    const operand = program[i + 1];
    const comboOperand = getComboOperand(registers, operand);

    if (opcode === 0) {
      registers[0] = Math.floor(registers[0] / Math.pow(2, comboOperand));
    } else if (opcode === 1) {
      registers[1] = registers[1] ^ operand;
    } else if (opcode === 2) {
      registers[1] = comboOperand % 8;
    } else if (opcode === 3) {
      i = registers[0] !== 0 ? operand - 2 : i;
    } else if (opcode === 4) {
      registers[1] = registers[1] ^ registers[2];
    } else if (opcode === 5) {
      output.push(comboOperand % 8);
    } else if (opcode === 6) {
      const division = registers[0] / Math.pow(2, comboOperand);
      registers[1] = Math.floor(division);
    } else if (opcode === 7) {
      const division = registers[0] / Math.pow(2, comboOperand);
      registers[2] = Math.floor(division);
    }
  }

  return output.join(',');
}

evalResult(17, 1, part_01);

/* Day 17 - Part 02 */

function part_02(input: string[]): number {
  return 0;
}

evalResult(17, 2, part_02);

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
