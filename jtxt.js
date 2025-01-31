#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { program } = require('commander');

// 定义命令行选项
program
  .version('1.0.0')
  .argument('<logic>', '处理逻辑的 JavaScript 代码')
  .argument('[filename]', '要读取的文件名', null)
  .option('-b, --begin <code>', '初始化的逻辑代码')
  .option('-e, --end <code>', '结束后的逻辑代码')
  .parse(process.argv);

// 解析命令行参数
const options = program.opts();
const logic = program.args[0];
const filename = program.args[1];

var beginFunc = function(){}, endFunc = function(){}, 
    processFunc = new Function('l', 'ctx', 'print', logic);
if (options.begin) {
    beginFunc = new Function('ctx', 'print', options.begin);
}
if (options.end) {
    endFunc = new Function('ctx', 'print', options.end);
}

// 预定义全局变量
var ctx = {
    n1: 0, n2: 0, n3: 0, s: '', arr: []
};
var print = console.log;

// 处理文件或标准输入
const processStream = (stream) => {
  beginFunc(ctx, print);
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity // 适用于 \r\n 和 \n 换行符
  });

  rl.on('line', (line) => {
    try {
        processFunc(line, ctx, print);
    } catch (error) {
        console.error('Error processing line:', error);
    }
  });

  rl.on('close', () => {
    // 执行结束逻辑
    endFunc(ctx, print);
  });
};

// 判断处理文件还是标准输入
if (filename) {
  try {
    const filePath = path.resolve(filename);
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (err) => {
      console.error(`Error reading file: ${err.message}`);
      process.exit(1);
    });
    processStream(fileStream);
  } catch (err) {
    console.error(`Error processing file path: ${err.message}`);
    process.exit(1);
  }
} else {
  processStream(process.stdin);
}
