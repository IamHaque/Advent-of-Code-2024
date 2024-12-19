import { pad, coloredConsoleText } from './utils.ts';

// Get the day number from the command line arguments, default to 1 if not provided
const dayNumber = Deno.args[0] ? Number(Deno.args[0]) : 1;

// Validate the day number
if (isNaN(dayNumber) || dayNumber < 1) {
  console.error(
    coloredConsoleText(
      'Please provide a valid day number (e.g., 1, 2, 3, ...).',
      'RED'
    )
  );
  Deno.exit(1);
}

// Construct the script path for the specified day
const scriptPath = `./day_${pad(dayNumber)}/main.ts`;

try {
  // Create a new Deno command to run the script with read permissions
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-read', scriptPath],
  });

  // Execute the command and get the output
  const { code, stdout, stderr } = await command.output();

  // Check if the command executed successfully
  if (code === 0) {
    console.log(new TextDecoder().decode(stdout));
  } else {
    console.error(
      coloredConsoleText(
        `Error: Failed to execute the script for day ${dayNumber}.`,
        'RED'
      )
    );
    console.error(coloredConsoleText(new TextDecoder().decode(stderr), 'RED'));
    Deno.exit(1);
  }
} catch (error) {
  // Handle any unexpected errors
  console.error(
    `Unexpected error: ${
      error instanceof Error ? error.message : String(error)
    }`
  );
  Deno.exit(1);
}
