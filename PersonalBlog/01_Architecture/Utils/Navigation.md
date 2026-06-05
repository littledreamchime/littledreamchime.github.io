current View -> target View
所有的页面跳转都必须经过Navigation工具类

| Path     | View         |
| -------- | ------------ |
| /        | Home         |
| blog     | Blog         |
| blog/    | BlogPaper    |
| devlog   | Devlog       |
| devlog/  | DevlogBinder |
| devlog// | DevlogPaper  |
| about    | About        |
逻辑：
``` cs
1. 获取 target view 字符
2. 等待所有promise (store.ts) 完成 
3. 获取需要等待的时间
4. 经过等待时间后，进行跳转
```
