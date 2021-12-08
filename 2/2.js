const TEST = false;
const USE_TEST_INPUT_FILE = false;
const TEST_INPUT = [
    'forward 5',
    'down 5',
    'forward 8',
    'up 3',
    'down 8',
    'forward 2',
];

import fs from 'fs';

const NUM = import.meta.url.match(/[\/\\](\d+)(-\d+)?\.js$/)[1];

const inputStr = fs.readFileSync(`${NUM}/input${TEST && USE_TEST_INPUT_FILE ? "-test" : ''}.txt`, "utf-8");
const input = inputStr.split(inputStr.includes("\r\n") ? "\r\n" : "\n");

const commands = TEST && !USE_TEST_INPUT_FILE ? TEST_INPUT : input;

// 1
var d = 0;
var x = 0;
for (let cmd of commands) {
    let action = cmd[0];
    let val = +cmd.substring(cmd.indexOf(" ") + 1);

    switch (action) {
        case 'f':
            x += val;
            break;
        case 'd':
            d += val;
            break;
        case 'u':
            d -= val
            break;
    }
}

console.log(`1: (${x},${d}) ... ${x * d}`)

// 2
var d = 0;
var x = 0;
var aim = 0;
for (let cmd of commands) {
    let action = cmd[0];
    let val = +cmd.substring(cmd.indexOf(" ") + 1);

    switch (action) {
        case 'f':
            x += val;
            d += val * aim;
            break;
        case 'd':
            aim += val;
            break;
        case 'u':
            aim -= val
            break;
    }
}

console.log(`2: (${x},${d}) ... ${x * d}`)