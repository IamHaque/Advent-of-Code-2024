import { evalResult } from '../utils.ts';

/* Day 23 - Part 01 */

function part_01(input: string[]): number {
  const network = getNetwork(input);

  const connections = new Set<string>();

  network.keys().forEach((source) => {
    getConnectionOfLength(network, source, 3).forEach((conn) => {
      if ((',' + conn).indexOf(',t') >= 0) connections.add(conn);
    });
  });

  return connections.size;
}

evalResult(23, 1, part_01);

/* Day 23 - Part 02 */

function part_02(input: string[]): number {
  return 0;
}

evalResult(23, 2, part_02);

/* Shared functions */

function getNetwork(input: string[]): Map<string, Set<string>> {
  const network = new Map<string, Set<string>>();

  input.forEach((line) => {
    if (!line) return;

    const [computer_1, computer_2] = line.split('-');

    if (!network.has(computer_1)) network.set(computer_1, new Set<string>());
    network.get(computer_1)!.add(computer_2);

    if (!network.has(computer_2)) network.set(computer_2, new Set<string>());
    network.get(computer_2)!.add(computer_1);
  });

  return network;
}

function getConnectionOfLength(
  network: Map<string, Set<string>>,
  startNode: string,
  length: number
): Set<string> {
  const cycles = new Set<string>();

  function dfs(node: string, path: string[]) {
    path.push(node);

    if (path.length === length + 1) {
      if (path[0] === path[path.length - 1]) {
        const sortedCycle = path.slice(0, -1).sort();
        cycles.add(sortedCycle.join());
      }

      return;
    }

    for (const neighbor of network.get(node) || []) {
      dfs(neighbor, [...path]);
    }
  }

  dfs(startNode, []);
  return cycles;
}
