const TEST = false;
const USE_TEST_INPUT_FILE = false;
const TEST_INPUT = [
    '00100',
    '11110',
    '10110',
    '10111',
    '10101',
    '01111',
    '00111',
    '11100',
    '10000',
    '11001',
    '00010',
    '01010',
];

import fs from 'fs';

const NUM = import.meta.url.match(/[\/\\](\d+)(-\d+)?\.js$/)[1];

const inputStr = fs.readFileSync(`${NUM}/input${TEST && USE_TEST_INPUT_FILE ? "-test" : ''}.txt`, "utf-8");
const input = inputStr.split(inputStr.includes("\r\n") ? "\r\n" : "\n").filter(x => x);

const binStrings = TEST && !USE_TEST_INPUT_FILE ? TEST_INPUT : input;

var digits = binStrings[0].length;
var bitCounts = new Array(digits);
bitCounts.fill(0);

// 1, no parsing binaries, only counting
for (let binString of binStrings) {
    for (let i = 0; i < digits; i++) {
        let step = binString[i] === '0' ? -1 : 1;
        bitCounts[i] += step;
    }
}

var msbs = bitCounts.map(c => c >= 0 ? 1 : 0);
var gamma = msbs.reduceRight((prev, current, i) => prev + (current << (msbs.length - 1 - i)), 0);
var epsilon = (gamma ^ (~0)) & ((1 << msbs.length) - 1); // Invert gamma, select only last n bits

console.log("(no parsing) Ɣ*Ɛ = " + gamma * epsilon);

// 1, parsing binaries (imagine getting the data from an API or so)
const binaryInputs = [];
var maxLd = 0;
for (const str of binStrings) {
    let num = parseInt(str, 2);
    binaryInputs.push(num);

    let ld = Math.log2(num);
    maxLd = ld > maxLd ? ld : maxLd;
}

maxLd = Math.floor(maxLd);
var digits = maxLd + 1;

var msbs = getMsbs(binaryInputs, digits);
var gamma = msbs.reduceRight((prev, current, i) => prev + (current << (msbs.length - 1 - i)), 0);
var epsilon = (gamma ^ (~0)) & ((1 << msbs.length) - 1); // Invert gamma, select only last n bits

console.log("(parsing) Ɣ*Ɛ = " + gamma * epsilon);

function getBitCounts(numbers, digits) {
    let bitCounts = new Array(digits);
    bitCounts.fill(0);

    for (let num of numbers) {
        for (let i = 0; i < digits; i++) {
            let step = (num >> (digits - i - 1)) & 1 ? 1 : -1;
            bitCounts[i] += step;
        }
    }

    return bitCounts;
}

function getMsbs(numbers, digits) {
    return getBitCounts(numbers, digits).map(c => c >= 0 ? 1 : 0);
}

function getLsbs(numbers, digits) {
    return getBitCounts(numbers, digits).map(c => c >= 0 ? 0 : 1);
}

// 2
var oxygen = filterByBits(binaryInputs, digits, false);
console.log("Oxygen: " + oxygen)

var co2s = filterByBits(binaryInputs, digits, true);
console.log("CO²Scrubbing: " + co2s);

console.log("o * s " + oxygen * co2s);

function filterByBits(numbers, digits, useLsbs) {
    var filteredNumbers = numbers.slice();
    var value = -1;
    for (let i = 0; i < digits; i++) {
        var bits = useLsbs ? getLsbs(filteredNumbers, digits) : getMsbs(filteredNumbers, digits);
        let bit = bits[i];
        filteredNumbers = filterByBit(filteredNumbers, bit, i, digits);

        if (filteredNumbers.length <= 1) {
            value = filteredNumbers.length ? filteredNumbers[0] : -1;
            break;
        }
    }

    return value;
}

function filterByBit(numbers, value, index, digits) {
    value = value & 1; //only check last bit;
    return numbers.filter(num => (num >> (digits - index - 1) & 1) === value);
}