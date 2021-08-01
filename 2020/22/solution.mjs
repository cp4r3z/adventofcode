/**
 * https://adventofcode.com/2020/day/22
 */

import { multiLine } from '../../common/parser.mjs';
import inputArrMjs from './inputArr.mjs';
import tinputArrMjs from './tinputArr.mjs';
import trinputArrMjs from './trinputArr.mjs';

// Parse Input
//const inputFilePath = new URL('./input.txt', import.meta.url);
//const arrInput = multiLine.toStrArray(inputFilePath);

const input = tinputArrMjs;

function play(input) {
    let player1 = input.player1;
    let player2 = input.player2;

    while (player1.length > 0 && player2.length > 0) {
        const p1Turn = player1.shift();
        const p2Turn = player2.shift();

        if (p1Turn > p2Turn) {
            player1 = player1.concat([p1Turn, p2Turn]);
        } else {
            player2 = player2.concat([p2Turn, p1Turn]);
        }
    }

    const winner = (player1.length > player2.length) ? player1 : player2;
    return winner;
}

const winner = play(JSON.parse(JSON.stringify(input)));

let part1 = 0;

for (let i = 1; i <= winner.length; i++) {
    part1 += i * winner[winner.length - i];
}

console.log(`Year 2020 Day 22 Part 1 Solution: ${part1}`);

// returns object!
// Note: I'm not sure deckHashHistory is necessary...
function play2(input, deckHashHistory = []) {
    console.log('play');
    let player1 = input.player1;
    let player2 = input.player2;

    const playHistory = JSON.parse(JSON.stringify(deckHashHistory));

    while (player1.length > 0 && player2.length > 0) {
        const p1Turn = player1.shift();
        const p2Turn = player2.shift();

        const hash = deckHash({player1,player2});
        const alreadyPlayed = playHistory.includes(hash);
        if (alreadyPlayed) {
            console.log('infinite!');
            return {
                winner: 1,
                deck: {player1,player2}
            }
        }
        playHistory.push(hash);

        console.log('');
        console.log(`Player 1: ${player1.join(',')} Plays ${p1Turn} `);
        console.log(`Player 2: ${player2.join(',')} Plays ${p2Turn} `);

        const doSubGame = p1Turn <= player1.length &&
            p2Turn <= player2.length;

        if (doSubGame) {

            const inputSub = {
                player1: player1.slice(0, p1Turn),
                player2: player2.slice(0, p2Turn)
            };
            const hashsub = deckHash(inputSub);
            const alreadyPlayedsub = deckHashHistory.includes(hashsub);
            if (alreadyPlayedsub) {
                console.log('infinite!');
                return {
                    winner: 1,
                    deck: inputSub
                }
            }
            const newHistory = deckHashHistory.concat(hash);
            const subResult = play2(inputSub, newHistory);
            if (subResult.winner === 1) {
                player1 = player1.concat([p1Turn, p2Turn]);
            } else {
                player2 = player2.concat([p2Turn, p1Turn]);
            }
        } else {
            // Normal non-subgame
            if (p1Turn > p2Turn) {
                player1 = player1.concat([p1Turn, p2Turn]);
            } else {
                player2 = player2.concat([p2Turn, p1Turn]);
            }
        }

    }

    //const hash = deckHash({});

    return {
        winner: (player1.length > player2.length) ? 1 : 2,
        deck: (player1.length > player2.length) ? player1 : player2
    };
}

function deckHash(input) {
    let hash = '';
    let player1 = input.player1;
    let player2 = input.player2;
    player1.forEach(c => hash += `p1${c}`);
    player2.forEach(c => hash += `p2${c}`);
    return hash;
}

const input2 = inputArrMjs;

const winner2 = play2(JSON.parse(JSON.stringify(input2)));

let part2 = 0;

for (let i = 1; i <= winner2.deck.length; i++) {
    part2 += i * winner2.deck[winner2.deck.length - i];
}

console.log(`Year 2020 Day 22 Part 2 Solution: ${part2}`);