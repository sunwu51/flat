const fs = require('fs');
const path = require('path');

// 文件路径
const filePath = path.join(__dirname, 'largefile.txt');

// 获取文件大小
function getFileSizeInBytes(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (err) {
    return 0; // 如果文件不存在，则大小为 0
  }
}

// 生成随机字符串，长度在 100 到 200 之间
function generateRandomString() {
  const length = Math.floor(Math.random() * 101) + 100; // 100 到 200
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 获取当前时间格式化为 [yyyy-mm-dd HH:mm:ss]
function getCurrentFormattedTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
}

// 主函数
function appendRandomStringsToFile() {
  const targetSize = 10 * 1024 * 1024 * 1024; // 10 GB

  while (getFileSizeInBytes(filePath) < targetSize) {
    const timeStamp = getCurrentFormattedTime();
    const randomString = generateRandomString();
    const line = `${timeStamp} ${randomString}\n`;
    fs.appendFileSync(filePath, line);
  }

  console.log('文件已达到 10 GB');
}

appendRandomStringsToFile();
