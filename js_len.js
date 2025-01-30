const fs = require('fs');
const readline = require('readline');

async function calculateTotalLineLength(filePath) {
  // 创建文件流
  const fileStream = fs.createReadStream(filePath);

  // 使用 readline 模块逐行读取文件
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity // 适用于 \r\n 和 \n 换行符
  });

  let totalLength = 0;

  // 逐行读取文件
  for await (const line of rl) {
    totalLength += line.length;
  }

  return totalLength;
}

// 使用异步函数来执行
(async function() {
  try {
    const filePath = './largefile.txt'; // 替换为你的文件路径
    const totalLength = await calculateTotalLineLength(filePath);
    console.log(`Total length of all lines: ${totalLength}`);
  } catch (err) {
    console.error('Error reading file:', err);
  }
})();