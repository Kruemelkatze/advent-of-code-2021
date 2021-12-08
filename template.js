const TEST = false;
const USE_TEST_INPUT_FILE = false;
const TEST_INPUT = [];

import fs from 'fs';

const NUM = import.meta.url.match(/[\/\\](\d+)(-\d+)?\.js$/)[1];

const inputStr = fs.readFileSync(`${NUM}/input${TEST && USE_TEST_INPUT_FILE ? "-test" : ''}.txt`, "utf-8");
const input = inputStr.split(inputStr.includes("\r\n") ? "\r\n" : "\n");

const numbers = TEST && !USE_TEST_INPUT_FILE ? TEST_INPUT : input.filter(l => l).map(l => +l);