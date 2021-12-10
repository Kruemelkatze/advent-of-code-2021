const TEST = false;
const USE_TEST_INPUT_FILE = true;
const TEST_INPUT = [];

import fs from 'fs';

const NUM = import.meta.url.match(/[\/\\](\d+)(-\d+)?\.js$/)[1];

const inputStr = fs.readFileSync(`${NUM}/input${TEST && USE_TEST_INPUT_FILE ? "-test" : ''}.txt`, "utf-8");
var input = inputStr.split(inputStr.includes("\r\n") ? "\r\n" : "\n");
input = TEST && !USE_TEST_INPUT_FILE ? TEST_INPUT : input;

var drawnNumbers = input[0].split(',').map(n => +n);

// 1
var boards = readBoards();
simulate(drawnNumbers, boards);

// 2
boards = readBoards(); // Could be done more efficiently, but meh.
simulateUntilTheVeryLast(drawnNumbers, boards)



// ~~~~~~~~~~~~~~~~~~~~~~~~~ READ ~~~~~~~~~~~~~~~~~~~~~~~~~
function readBoards() {
    var boards = [];
    var nextBoardIndex = 1;
    while (nextBoardIndex < input.length) {
        let [board, index] = readBoard(nextBoardIndex);
        if (board) {
            boards.push(board);
        }
        nextBoardIndex = index;
    }

    console.log(`Read ${boards.length} boards.`)

    return boards;
}

function readBoard(index) {
    var board = [];

    let numbersFound = false;

    for (; index < input.length; index++) {
        let line = input[index];
        if (line.length) {
            board.push(line.trim().split(/ +/).map(n => +n));
            numbersFound = true;
        } else if (numbersFound) {
            break;
        } else {
            continue;
        }
    }

    if (board.length === 0) {
        return [null, input.length];
    }

    return [board, index];
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~ 1: Simulate ~~~~~~~~~~~~~~~~~~~~~~~~~
function simulateUntilTheVeryLast(numbers, boards) {
    for (let i = 0; i < numbers.length; i++) {
        console.log(`Running round ${i + 1} (${numbers[i]}) with ${boards.length} boards...`);

        let finishedBoards = callNumberFinishingMultiple(numbers[i], boards);
        if (!finishedBoards.length)
            continue;

        if (boards.length > 1) {
            boards = boards.filter(b => !finishedBoards.some(fb => fb == b));
        } else {
            let points = calculateBoardState(boards[0]);
            console.log(`Board #? finished last with ${points} points, result: ${points * numbers[i]}`);
            return;
        }
    }
}

function simulate(numbers, boards) {
    for (let i = 0; i < numbers.length; i++) {
        console.log(`Running round ${i + 1} (${numbers[i]})...`);

        let result = callNumber(numbers[i], boards);
        if (result) {
            let [board, points] = result;
            console.log(`Finished board #${board} with ${points} points, result: ${points * numbers[i]}`);
            return;
        }
    }
}

function callNumber(number, boards) {
    for (let i = 0; i < boards.length; i++) {
        let board = boards[i];

        let changed = callNumberOnBoard(number, board);
        let result = changed && testBoard(board);
        if (result) {
            return [i, result];
        }
    }

    return false;
}

function callNumberFinishingMultiple(number, boards) {
    var finishedBoards = [];
    for (let i = 0; i < boards.length; i++) {
        let board = boards[i];

        let changed = callNumberOnBoard(number, board);
        let result = changed && testBoard(board);
        if (result) {
            finishedBoards.push(board);
        }
    }

    return finishedBoards;
}

function callNumberOnBoard(number, board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === number) {
                board[row][col] = null;
                return true;
            }
        }
    }

    return false;
}

function testBoard(board) {
    let colCompletions = new Array(board[0].length);
    colCompletions.fill(0);

    for (let row = 0; row < board.length; row++) {
        let rowCompletion = 0;
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] == null) {
                colCompletions[col]++;
                rowCompletion++;
            }
        }

        if (rowCompletion === colCompletions.length) {
            return calculateBoardState(board);
        }
    }

    if (colCompletions.some(c => c === board[0].length)) {
        return calculateBoardState(board);
    }

    return false;
}

function calculateBoardState(board) {
    let sum = 0;
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] != null) {
                sum += board[row][col];
            }
        }
    }

    return sum;
}

function printBoard(board) {
    for (let row of board) {
        console.dir(row);
    }

    console.log("");
}
