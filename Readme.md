### ping小工具
---
1. 导入url.txt
2. 计时栏填入倒计时时间，点击定时开始倒计时
3. 倒计时为0 时自动执行脚本。
4. 结果会实时打印在文本。
5. 点击导出会将结果导出至指定文件，以csv格式保存。

---
> 注意点：
    要在运行结束后才能导出。

### 使用方法：
1. npm install
2. npm start

### 生成可执行文件
1. 修改package.json中的
```js
    "package": "electron-packager . --overwrite --platform=win32 --arch=ia32 --out=out --icon=./icon.ico"
```
2. 执行命令
```bash
npm run-script package
```