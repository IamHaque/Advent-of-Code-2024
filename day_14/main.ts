import { evalResult } from '../utils.ts';

type Robot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const TIME_LIMIT = 100;

/* Day 14 - Part 01 */

function part_01(input: string[]): number {
  const WIDTH = input.length > 12 ? 101 : 11;
  const HEIGHT = input.length > 12 ? 103 : 7;
  const QUADRANT_X = Math.floor(WIDTH / 2);
  const QUADRANT_Y = Math.floor(HEIGHT / 2);

  const robots: Robot[] = input.map(extractRobotData);
  const quadrant_robots = [0, 0, 0, 0];

  for (let second = 0; second < TIME_LIMIT; second++) {
    robots.forEach((robot) => {
      const new_x = (robot.x + robot.vx) % WIDTH;
      const new_y = (robot.y + robot.vy) % HEIGHT;

      robot.x = checkAndTeleportRobot(new_x, WIDTH);
      robot.y = checkAndTeleportRobot(new_y, HEIGHT);
    });
  }

  robots.forEach((robot) => {
    const { x, y } = robot;
    if (x < QUADRANT_X && y < QUADRANT_Y) quadrant_robots[0]++;
    else if (x > QUADRANT_X && y < QUADRANT_Y) quadrant_robots[1]++;
    else if (x < QUADRANT_X && y > QUADRANT_Y) quadrant_robots[2]++;
    else if (x > QUADRANT_X && y > QUADRANT_Y) quadrant_robots[3]++;
  });

  return quadrant_robots.reduce((acc, val) => (val > 0 ? acc * val : acc), 1);
}

evalResult(14, 1, part_01);

/* Day 14 - Part 02 */

function part_02(input: string[]): number {
  const WIDTH = input.length > 12 ? 101 : 11;
  const HEIGHT = input.length > 12 ? 103 : 7;

  let second = 0;
  const robots: Robot[] = input.map(extractRobotData);

  for (; second < TIME_LIMIT * TIME_LIMIT; second++) {
    const robots_counts = {
      vertical: new Map<number, number>(),
      horizontal: new Map<number, number>(),
    };

    robots.forEach((robot) => {
      const new_x = (robot.x + robot.vx) % WIDTH;
      const new_y = (robot.y + robot.vy) % HEIGHT;

      robot.x = checkAndTeleportRobot(new_x, WIDTH);
      robot.y = checkAndTeleportRobot(new_y, HEIGHT);

      robots_counts.vertical.set(
        robot.x,
        (robots_counts.vertical.get(robot.x) ?? 0) + 1
      );
      robots_counts.horizontal.set(
        robot.y,
        (robots_counts.horizontal.get(robot.y) ?? 0) + 1
      );
    });

    const sortedVerticalCounts = Array.from(
      robots_counts.vertical.entries()
    ).sort((a, b) => b[1] - a[1]);

    const sortedHorizontalCounts = Array.from(
      robots_counts.horizontal.entries()
    ).sort((a, b) => b[1] - a[1]);

    const v1 = sortedVerticalCounts[0][1];
    const v2 = sortedVerticalCounts[1][1];
    const h1 = sortedHorizontalCounts[1][1];
    const h2 = sortedHorizontalCounts[0][1];

    if (v1 > 30 && v2 > 30 && h1 > 30 && h2 > 30) {
      second++;
      break;
    }
  }

  return second;
}

evalResult(14, 2, part_02);

/* Shared functions */

function extractRobotData(line: string): Robot {
  const [position, velocity] = line.split(' ');
  const [x, y] = position.substring(2).split(',');
  const [vx, vy] = velocity.substring(2).split(',');

  return {
    x: Number(x),
    y: Number(y),
    vx: Number(vx),
    vy: Number(vy),
  } as Robot;
}

function checkAndTeleportRobot(position: number, limit: number): number {
  let new_position = position % limit;

  if (new_position < 0) new_position = limit + new_position;
  if (new_position > limit) new_position = new_position - limit;

  return new_position;
}
