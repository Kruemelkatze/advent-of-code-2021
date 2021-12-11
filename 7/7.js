const TEST = false;
const USE_TEST_INPUT_FILE = false;
const TEST_INPUT = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14];

import fs from 'fs';

const NUM = import.meta.url.match(/[\/\\](\d+)(-\d+)?\.js$/)[1];

const inputStr = fs.readFileSync(`${NUM}/input${TEST && USE_TEST_INPUT_FILE ? "-test" : ''}.txt`, "utf-8");
const input = inputStr.split(",");

const numbers = TEST && !USE_TEST_INPUT_FILE ? TEST_INPUT : input.map(l => +l);

// 1:
var median = calculateMedian(numbers);
var fuelExpenditure = calculateSumDistance(median, numbers);
console.log(`1: pos=${median}, fuel expenditure=${fuelExpenditure}`);

// 2:
var mean = calculateMean(numbers); // Just approximately
var [bestPos, bestPosCost] = findBestTarget(mean, numbers);
console.log(`2: pos=${bestPos}, fuel expenditure=${bestPosCost}`);


// ~~~~~~~~~~~~~~~~~~~~~~~~~ Functions ~~~~~~~~~~~~~~~~~~~~~~~~~

function calculateMedian(numbers) {
    if (numbers.length === 0)
        throw new Error("No inputs");

    numbers.sort((a, b) => a - b);

    let half = Math.floor(numbers.length / 2);

    if (numbers.length % 2)
        return numbers[half];

    return (numbers[half - 1] + numbers[half]) / 2.0;
}

function calculateMean(numbers) {
    return Math.round(numbers.reduce((p, c) => p + c) / numbers.length);
}

function calculateSumDistance(target, numbers) {
    return numbers.reduce((sum, c) => Math.abs(c - target) + sum, 0);
}

function calcTotalFuelExpenditure(target, numbers) {
    return numbers.reduce((sum, c) => calcSingleFuelExpenditure(c, target) + sum, 0)
}

function calcSingleFuelExpenditure(a, b) {
    var n = Math.abs(a - b);

    // Thank you, carl
    return (n * n + n) / 2;
}

function findBestTarget(approxTarget, numbers) {
    // Tage approx, search in both direction until a local minimum is reached. take minimum out of both minima
    let approxTargetCost = calcTotalFuelExpenditure(approxTarget, numbers);
    let [leftMin, leftMinCost] = findLocalMinimumInDirection(approxTarget, approxTargetCost, -1, numbers);
    let [rightMin, rightMinCost] = findLocalMinimumInDirection(approxTarget, approxTargetCost, 1, numbers);

    if (leftMinCost < rightMinCost) {
        return [leftMin, leftMinCost];
    } else {
        return [rightMin, rightMinCost];
    }
}

function findLocalMinimumInDirection(start, startCost, direction, numbers) {
    let prev = start;
    let prevCost = startCost;

    while (true) {
        let current = prev + direction;
        let currentCost = calcTotalFuelExpenditure(current, numbers);

        if (currentCost > prevCost) {
            return [prev, prevCost];
        }

        prev = current;
        prevCost = currentCost;
    }
}