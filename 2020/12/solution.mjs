/**
 * https://adventofcode.com/2020/day/12
 */

import { multiLine } from '../../common/parser.mjs';
import Orientation from '../../common/orientation.mjs';

// Parse Input
const inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);
const commands = arrInput.map(mapLineToCommand);

let position = { x: 0, y: 0 };
const direction = new Orientation();

commands.forEach(command => {
    if (['E', 'S', 'W', 'N', 'F'].includes(command.action)) {
        let card = command.action;
        if (command.action === 'F') card = direction.current;

        const move = direction.convertCardinalTo2D(card);
        position.x += move.x * command.value;
        position.y += move.y * command.value;
    } else if (['L', 'R'].includes(command.action)) {
        const repeat = command.value / 90;
        for (let i = 0; i < repeat; i++) {
            direction.turn(command.action);
        }
    } else {
        throw new Error('Invalid Action');
    }
});

const manhattanDistance = Math.abs(position.x) + Math.abs(position.y);
console.log(`Year 2020 Day 12 Part 1 Solution: ${manhattanDistance}`);

function mapLineToCommand(line) {
    const reCommand = /([A-Z]{1})(\d+)$/; // No need to declare this each time, but oh well.
    const reCommandResult = reCommand.exec(line);
    return {
        action: reCommandResult[1],
        value: parseInt(reCommandResult[2], 10)
    };
}

// End Process (gracefully)
process.exit(0);