// Install node modules ( npm i )

// Run this in a terminal
// > node 2019\13\gamepad.js

// Or configure your debug console to use TTY


let lastKey = '';

const express = require("express");
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.get("/key", (req, res) => {
    if (req.query.reset) {
        lastKey = '';
        res.json({
            status: "key reset"
        })
    } else {
        res.json({"key": lastKey});
    }
});

// Not really needed
app.patch("/key", (req, res) => {
    if (!req.body || !req.body.key) throw new Error('no key');
    lastKey = req.body.key;
    res.json({
        status: `key set to: ${req.body.key}`
    });
});


app.listen(3333, () => {
    console.log("Server running on port 3333");
});

const readline = require('readline');

// https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    // console.log(str);
    // console.log(key);
    if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
        console.log('game over man, game over!');
        process.exit(0);
    }
    switch (key.name) {
        case 'up':
            console.log('up');
            lastKey = 'up';
            break;
        case 'down':
            console.log('down');
            lastKey = 'down';
            break;
        case 'left':
            console.log('left');
            lastKey = 'left';
            break;
        case 'right':
            console.log('right');
            lastKey = 'right';
            break;
        default:
            console.log('other key');
    }
});
