// deno-lint-ignore-file ban-types no-unused-vars

import { basename, dirname, resolve } from 'node:path';

// Define ANSI color codes for console text
const ANSI_GRAY = [70, 75, 93]; // rgb(70, 75, 93)
const ANSI_BLACK = [0, 0, 0]; // rgb(0, 0, 0)
const ANSI_WHITE = [255, 255, 255]; // rgb(255, 255, 255)
const ANSI_RED = [240, 113, 120]; // rgb(240, 113, 120)
const ANSI_BLUE = [130, 170, 255]; // rgb(130, 170, 255)
const ANSI_GREEN = [195, 232, 141]; // rgb(195, 232, 141)
const ANSI_CYAN = [137, 221, 255]; // rgb(137, 221, 255)
const ANSI_YELLOW = [255, 203, 107]; // rgb(255, 203, 107)
const ANSI_MAGENTA = [199, 146, 234]; // rgb(199, 146, 234)

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
    timeTaken > 100 ? ANSI_RED : ANSI_GRAY
  );

  const dayText = coloredConsoleText(`Day ${pad(day)}`, ANSI_MAGENTA);
  const partText = coloredConsoleText(`Part ${pad(part)}`, ANSI_BLUE);

  const typeText = coloredConsoleText(capitalize(type), ANSI_GRAY);

  const resultText = coloredConsoleText(
    result,
    type === 'sample' ? ANSI_RED : ANSI_GREEN
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
const coloredConsoleText = (text: string, hex: number[]): string =>
  `\x1b[38;2;${hex[0]};${hex[1]};${hex[2]}m${text}\x1b[0m`;

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
