import { pad } from './utils.ts';

const dayNumber = Deno.args[0] ? Number(Deno.args[0]) : 1;

if (isNaN(dayNumber) || dayNumber < 1) {
  console.error('Please provide a valid day number (e.g., 1, 2, 3, ...).');
  Deno.exit(1);
}

const scriptPath = `./day_${pad(dayNumber)}/main.ts`;

try {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-read', scriptPath],
  });

  const { code, stdout, stderr } = await command.output();

  if (code === 0) {
    console.log(new TextDecoder().decode(stdout));
  } else {
    console.error(`Error: Failed to execute the script for day ${dayNumber}.`);
    console.error(new TextDecoder().decode(stderr));
    Deno.exit(1);
  }
} catch (error) {
  console.error(
    `Unexpected error: ${
      error instanceof Error ? error.message : String(error)
    }`
  );
  Deno.exit(1);
}
