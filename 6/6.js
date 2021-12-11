const TEST = false;
const USE_TEST_INPUT_FILE = false;
const TEST_INPUT = [3, 4, 3, 1, 2];

import fs from 'fs';

const NUM = import.meta.url.match(/[\/\\](\d+)(-\d+)?\.js$/)[1];

const inputStr = fs.readFileSync(`${NUM}/input${TEST && USE_TEST_INPUT_FILE ? "-test" : ''}.txt`, "utf-8");
const input = inputStr.split(',');

const numbers = TEST && !USE_TEST_INPUT_FILE ? TEST_INPUT : input.filter(l => l).map(l => +l);

console.dir(numbers)

var slots = new Array(9);
slots.fill(0);
fillInitialSlots(slots, numbers);

// 1 & 2
console.dir("Day 0 " + JSON.stringify(slots));
const RUNS = 256;
for (let i = 0; i < RUNS; i++) {
    slots = simulate(slots);
    console.dir(`Day ${i + 1} ${JSON.stringify(slots)}`);
}
console.dir("Total: " + countFish(slots));


function fillInitialSlots(slots, numbers) {
    let groups = new Map();
    for (let n of numbers) {
        groups.set(n, (groups.get(n) || 0) + 1);
    }

    groups.forEach((cnt, num) => slots[num] = cnt);
}

function simulate(slots, newSlots = null) {
    if (!newSlots) {
        newSlots = new Array(slots.length);
        newSlots.fill(0);
    }

    for (let i = 1; i < slots.length; i++) {
        newSlots[i - 1] = slots[i];
    }

    newSlots[6] += slots[0]; // Reset existing
    newSlots[8] += slots[0]; // Create new

    return newSlots;
}

function countFish(slots) {
    return slots.reduce((p, c) => p + c);
}