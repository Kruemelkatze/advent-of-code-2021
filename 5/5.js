const TEST = false;
const USE_TEST_INPUT_FILE = true;
const TEST_INPUT = [];

import fs from 'fs';

const NUM = import.meta.url.match(/[\/\\](\d+)(-\d+)?\.js$/)[1];

const inputStr = fs.readFileSync(`${NUM}/input${TEST && USE_TEST_INPUT_FILE ? "-test" : ''}.txt`, "utf-8");
const input = inputStr.split(inputStr.includes("\r\n") ? "\r\n" : "\n");

const lineStrings = TEST && !USE_TEST_INPUT_FILE ? TEST_INPUT : input.filter(l => l);
const lines = parseLines(lineStrings);
const aaLines = filterAxisAlignedLines(lines);

// 1
var sparseMatrix = new Map();
var spikes = addAALinesToMatrix(aaLines, sparseMatrix);
//debugPrintMatrix(sparseMatrix, 0, 0, 9, 9);
console.log("1: " + spikes);

// 2
var sparseMatrix = new Map();
var spikes = addAllLinesToMatrix(lines, sparseMatrix);
console.log("2: " + spikes);
//debugPrintMatrix(sparseMatrix, 0, 0, 9, 9);


// ~~~~~~~~~~~~~~~~~~~~~~~~~ FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~


function parseLines(lineStrings) {
    return lineStrings.map(parseLine);
}

function parseLine(lineString) {
    var split = lineString.split(" -> ");
    let [x1, y1] = split[0].split(",").map(c => +c);
    let [x2, y2] = split[1].split(",").map(c => +c);

    return [x1, y1, x2, y2];
}

function debugPrintMatrix(matrix, minX, minY, maxX, maxY) {
    for (let x = minX; x <= maxX; x++) {
        let row = matrix.get(x) || new Map();
        let rowStr = "";

        for (let y = minY; y <= maxY; y++) {
            let entry = row.get(y) || '.';
            rowStr += entry;
        }

        console.log(rowStr);
    }
}

function incEntry(matrix, x, y) {
    let col = matrix.get(x);
    if (!col) {
        col = new Map();
        col.set(y, 1);
        matrix.set(x, col);
        return;
    }

    let entry = col.get(y) || 0;

    entry++;
    col.set(y, entry);

    return entry;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~ 1 ~~~~~~~~~~~~~~~~~~~~~~~~~

function filterAxisAlignedLines(lines) {
    return lines.filter(([x1, y1, x2, y2]) => (x1 === x2 || y1 === y2));
}

function addAALinesToMatrix(lines, matrix) {
    let spikes = 0;
    for (let line of lines) {
        spikes += addAALineToMatrix(line, matrix);
    }

    return spikes;
}

function addAALineToMatrix(line, matrix) {
    var addedSpikes = 0;

    let [x1, y1, x2, y2] = line;

    let [sx, lx] = x1 < x2 ? [x1, x2] : [x2, x1];
    let [sy, ly] = y1 < y2 ? [y1, y2] : [y2, y1];

    for (let x = sx; x <= lx; x++) {
        let col = matrix.get(x);
        if (!col) {
            col = new Map();
            matrix.set(x, col);
        }

        for (let y = sy; y <= ly; y++) {
            let entry = col.get(y) || 0;
            entry++;
            col.set(y, entry);

            if (entry === 2) {
                addedSpikes++;
            }
        }
    }

    return addedSpikes;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~ 2 ~~~~~~~~~~~~~~~~~~~~~~~~~
function addAllLinesToMatrix(lines, matrix) {
    let spikes = 0;
    for (let line of lines) {
        spikes += addLineToMatrix(line, matrix);
    }

    return spikes;
}

function addLineToMatrix(line, matrix) {
    //console.log("");
    //console.dir(line)

    var addedSpikes = 0;
    let [x1, y1, x2, y2] = line;

    let dx = Math.sign(x2 - x1);
    let dy = Math.sign(y2 - y1);

    let x = x1;
    let y = y1;

    let firstEntry = incEntry(matrix, x, y);
    if (firstEntry === 2) {
        addedSpikes++;
    }

    //console.log(`${x},${y}`)

    while (x != x2 || y != y2) {
        if (isInRange(x, x1, x2)) {
            x += dx;
        }

        if (isInRange(y, y1, y2)) {
            y += dy;
        }

        let entry = incEntry(matrix, x, y);
        if (entry === 2) {
            addedSpikes++;
        }

        //console.log(`${x},${y}`)
    }

    return addedSpikes;
}

function isInRange(val, b1, b2) {
    return b1 < b2 ? val < b2 : val > b2;
}

