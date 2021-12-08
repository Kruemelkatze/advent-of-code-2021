const TEST = false;
const TEST_INPUT = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263];

import fs from 'fs';

// could be done via readline, but requires more code to be transformed into an array =)
const inputStr = fs.readFileSync("1/input.txt", "utf-8");
const input = inputStr.split(inputStr.includes("\r\n") ? "\r\n" : "\n");

const numbers = TEST ? TEST_INPUT : input.filter(l => l).map(l => +l);

// 1-1
var increases = numbers.reduce(
    ({ prevNumber, incCount }, currentNumber) =>
        ({ prevNumber: currentNumber, incCount: incCount + (currentNumber > prevNumber ? 1 : 0) }),
    { prevNumber: Number.MIN_SAFE_INTEGER, incCount: -1 }
).incCount;

console.log(increases + " increases");

// 1-2
var prevGroupValue = null;
var groupIncreases = 0;
for (let i = 0; i < numbers.length - 2; i++) {
    let groupValue = numbers[i] + numbers[i + 1] + numbers[i + 2];
    if (prevGroupValue != null && groupValue > prevGroupValue) {
        groupIncreases++;
    }

    prevGroupValue = groupValue;
}

console.log(groupIncreases + " group increases");
