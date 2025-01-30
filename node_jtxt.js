const fs = require('fs');
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

var begin_func = function(){}, end_func = function(){}, 
    process_func = new Function('l', 'ctx', logic);
if (options.begin) {
    begin_func = new Function('ctx', options.begin);
}
if (options.end) {
    end_func = new Function('ctx', options.end);
}

// 预定义全局变量
var ctx = {
    n1: 0, n2: 0, n3: 0, s: '', arr: []
};

// 处理文件或标准输入
const processStream = (stream) => {
  begin_func(ctx);
  const rl = readline.createInterface({
    input: stream,
    output: process.stdout,
    terminal: false,
    crlfDelay: Infinity // 适用于 \r\n 和 \n 换行符
  });

  rl.on('line', (line) => {
    try {
        process_func(line, ctx);
    } catch (error) {
        console.error('Error processing line:', error);
    }
  });

  rl.on('close', () => {
    // 执行结束逻辑
    end_func(ctx);
  });
};

// 判断处理文件还是标准输入
if (filename) {
  const fileStream = fs.createReadStream(filename);
  processStream(fileStream);
} else {
  processStream(process.stdin);
}