const path = require('path');
const fs = require('fs');
const solc = require('solc');

//Creates route to compile.js
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');

//To read file
const source = fs.readFileSync(lotteryPath,'utf8');

//To compile
module.exports = solc.compile(source, 1).contracts[':Lottery']; 