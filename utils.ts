// deno-lint-ignore-file ban-types

const ANSI_CYAN = [137, 221, 255];
const ANSI_GREEN = [195, 232, 141];
const ANSI_YELLOW = [255, 203, 107];

const parseFile = (filepath: string): string[] => {
  const data = Deno.readTextFileSync(filepath);
  return data.trim().split(/\r\n|\r|\n/);
};

const getInput = (day: number, type: string): string[] => {
  return parseFile(`./day_${pad(day)}/${type}.txt`);
};

const showResult = (
  day: number,
  part: number,
  type: string,
  result: string,
) => {
  const dayText = coloredConsoleText(pad(day), ANSI_YELLOW);
  const partText = coloredConsoleText(pad(part), ANSI_YELLOW);
  const resultText = coloredConsoleText(
    result,
    type === "sample" ? ANSI_CYAN : ANSI_GREEN,
  );

  console.log(
    `Day ${dayText} - Part ${partText} - ${capitalize(type)} : ${resultText}`,
  );
};

export const pad = (number: number): string =>
  number.toString().padStart(2, "0");

const capitalize = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

const coloredConsoleText = (
  text: string,
  hex: number[],
): string => `\x1b[38;2;${hex[0]};${hex[1]};${hex[2]}m${text}\x1b[0m`;

export const evalResult = (
  day: number,
  part: number,
  fn: Function,
  sampleSuffix = "",
) => {
  showResult(
    day,
    part,
    "sample",
    fn(getInput(day, "sample" + sampleSuffix)),
  );
  showResult(
    day,
    part,
    "input ",
    fn(getInput(day, "input")),
  );
};
