// deno-lint-ignore-file ban-types

import { basename, dirname, resolve } from 'node:path';

// Define ANSI color codes for console text
const ANSI_COLORS = {
  RESET: '\x1b[0m',
  BLACK: '\x1b[30m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
  BRIGHT_BLACK: '\x1b[90m',
  BRIGHT_RED: '\x1b[91m',
  BRIGHT_GREEN: '\x1b[92m',
  BRIGHT_YELLOW: '\x1b[93m',
  BRIGHT_BLUE: '\x1b[94m',
  BRIGHT_MAGENTA: '\x1b[95m',
  BRIGHT_CYAN: '\x1b[96m',
  BRIGHT_WHITE: '\x1b[97m',
  BG_BLACK: '\x1b[40m',
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
  BG_YELLOW: '\x1b[43m',
  BG_BLUE: '\x1b[44m',
  BG_MAGENTA: '\x1b[45m',
  BG_CYAN: '\x1b[46m',
  BG_WHITE: '\x1b[47m',
  BG_BRIGHT_BLACK: '\x1b[100m',
  BG_BRIGHT_RED: '\x1b[101m',
  BG_BRIGHT_GREEN: '\x1b[102m',
  BG_BRIGHT_YELLOW: '\x1b[103m',
  BG_BRIGHT_BLUE: '\x1b[104m',
  BG_BRIGHT_MAGENTA: '\x1b[105m',
  BG_BRIGHT_CYAN: '\x1b[106m',
  BG_BRIGHT_WHITE: '\x1b[107m',
};

// Define ANSI color key type for console text
type ANSIColorKeys = keyof typeof ANSI_COLORS;

// Function to read and parse a file into an array of strings
const parseFile = (filepath: string): string[] => {
  const data = Deno.readTextFileSync(filepath);
  return data.trim().split(/\r\n|\r|\n/);
};

// Function to get the root directory of the project
const getProjectRoot = (): string => {
  const cwd = Deno.cwd();
  const currentFolder = basename(cwd);

  if (currentFolder.match(/^day_\d+$/)) {
    return dirname(cwd);
  }

  return cwd;
};

// Function to get the input data for a specific day and type
const getInput = (day: number, type: string): string[] => {
  const projectRoot = getProjectRoot();
  const filePath = resolve(projectRoot, `day_${pad(day)}/${type}.txt`);
  return parseFile(filePath);
};

// Function to display the result in a formatted manner
const showResult = (
  day: number,
  part: number,
  type: string,
  result: string,
  timeTaken: number
) => {
  const timeText = coloredConsoleText(
    `${timeTaken.toFixed(2)}ms`,
    (timeTaken > 100 ? 'RED' : 'BRIGHT_BLACK') as ANSIColorKeys
  );

  const dayText = coloredConsoleText(`Day ${pad(day)}`, 'MAGENTA');
  const partText = coloredConsoleText(`Part ${pad(part)}`, 'BLUE');

  const typeText = coloredConsoleText(capitalize(type), 'BRIGHT_BLACK');

  const resultText = coloredConsoleText(
    result,
    type === 'sample' ? 'RED' : 'GREEN'
  );

  console.log(
    `${timeText} \t|  ${dayText} - ${partText} - ${typeText} : ${resultText}`
  );
};

// Function to pad a number with leading zeros
export const pad = (number: number): string =>
  number.toString().padStart(2, '0');

// Function to capitalize the first letter of a word
const capitalize = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

// Function to colorize console text
export const coloredConsoleText = (
  text: string,
  ansi_color: ANSIColorKeys
): string => `${ANSI_COLORS[ansi_color]}${text}${ANSI_COLORS.RESET}`;

// Function to evaluate and display the result of a function for a specific day and part
export const evalResult = (
  day: number,
  part: number,
  fn: Function,
  sampleSuffix = ''
) => {
  // Measure the execution time of the function for a specific input type
  const measureExecution = (inputType: string): [string, number] => {
    const start = performance.now();
    const result = fn(getInput(day, inputType));
    const end = performance.now();

    return [result, end - start];
  };

  // Measure and display the result for the sample input
  const [sampleResult, sampleTime] = measureExecution('sample' + sampleSuffix);
  showResult(day, part, 'sample', sampleResult, sampleTime);

  // Measure and display the result for the actual input
  const [inputResult, inputTime] = measureExecution('input');
  showResult(day, part, 'input ', inputResult, inputTime);
};
