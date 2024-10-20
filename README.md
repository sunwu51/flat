<center>
    <h2>jtxt<h2>
    <p>A JavaScript syntax text processing tool, an awk alternative.</p>
    <p>使用JavaScript语法进行文本处理的工具，来替换awk</p>
</center>

```bash
$ jtxt 'var it = l.split("]")[2]; console.log(it)' gc.log
```

# Quick Start
Download binary from release or install with `cargo`

从release页下载或者直接用`cargo`安装
```bash
$ cargo install jtxt
```

Usage
```bash
$ jtxt -h
Processes lines of input with JavaScript

Usage: jtxt [OPTIONS] <function> [file]

Arguments:
  <function>  JavaScript code to process each line, l is the origin string
  [file]      Path to the input file. If not provided, reads from stdin.

Options:
  -b, --begin <begin>  JavaScript code to execute before processing any lines
  -e, --end <end>      JavaScript code to execute after processing all lines
  -h, --help           Print help
  -V, --version        Print version
```
Example with [1.txt](./1.txt)
```bash
# 1 filter the lines that only contains numbers from 1.txt
# 1 从1.txt中过滤全是数字的行
$ jtxt 'if (l.match(/^\d+$/)) console.log(l)' 1.txt
200
404
200

# 2 compute the character number of 1.txt (exclude the [\r]\n)
# 2 计算1.txt中的字符个数(除了换行符[\r]\n)
$ jtxt -b 'var s=0' 's += l.length' -e 'console.log(s)' 1.txt
144

# 3 filter the lines that contains `Request`, and process the time text, then analyze the distribution of quantity per hour
# 3 过滤含有Request的行，并将时间部分进行处理，分析每个小时的请求数量分布
$ jtxt 'if(l.indexOf("Request")>=0) console.log(l)' 1.txt \
    | jtxt -b 'var m={}' 'var k = "h" + new Date(l.substring(0,19)).getHours(); if(!m[k]) m[k]=0; m[k]++' -e 'console.log(m)' 1.txt
{
  "h13": 2,
  "h14": 1
}
```

Well, to simplify the command, you can also use the preset variable: `var ctx = {}, n1=0, n2=0, n3=0, s='', arr=[];`

你也可以用内置的变量来简化指令，这是几个内置变量和他们的默认值`var ctx = {}, n1=0, n2=0, n3=0, s='', arr=[];`

# Performance
The performance is about 4 times slower in `simple scenarios` compared to awk, because of using `deno_core` to interpret code. For example, count the character. But in the other hand, you get the JavaScript support.

简单场景下，例如字符计数，性能比`awk`差了4倍，这是因为使用了`deno_core`来解释运行，但反过来讲，你获得了JavaScript语法的支持。

![img](https://i.imgur.com/DydkAan.png)

`gc.log` is a jvm gc log 32M size.

![img](https://i.imgur.com/1HoVOLX.png)

In `complex scenarios`, the performance gap will narrow, and even reverse. For example, compute the gc count and gc time in every second, and finally return the top 1 item (the longest).

复杂场景下，性能差距会缩小甚至反超。例如计算每秒的gc总数量和gc总时间，最终返回最长的那一秒

```bash
$ jtxt 'var re=l.match(/(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d).*Real=([0-9\.]+)/); 
  if (re) { 
    if (!ctx[re[1]]) ctx[re[1]] = 0; 
    ctx[re[1]]+=parseFloat(re[2]) 
  }' -e 'for (var k in ctx)  { 
    if (ctx[k]>n1) { n1 = ctx[k]; n2 = k} 
  } 
  console.log(`最大时间: ${n2}, 最大值: ${n1}`)' gc.log

$ awk '{ if (match($0, /([0-9]{4}-[0-9]{2}-[0-9]{2})T([0-9]{2}:[0-9]{2}:[0-9]{2}).*Real=([0-9\.]+)/, arr)) {
        time = arr[1] "T" arr[2];
        value = arr[3];
        sum[time] += value;}
} END {
    max_value = 0;
    max_time = ""; 
    for (t in sum) {
        if (sum[t] > max_value) {
            max_value = sum[t];
            max_time = t; 
        }
    }
    print "最大值时间: " max_time ", 最大值: " max_value;
}' gc.log
```

![image](https://i.imgur.com/14sChtK.png)