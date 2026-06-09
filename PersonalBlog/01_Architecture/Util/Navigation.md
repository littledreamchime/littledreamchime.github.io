current View -> target View
所有的页面跳转都必须经过Navigation工具类

| Path     | View         | zoom     | showReturnBtn | parent |
| -------- | ------------ | -------- | ------------- | ------ |
| /        | Home         | none     | false         | none   |
| blog     | Blog         | computer | true          | Blog   |
| blog/    | BlogPaper    | computer | true          | Blog   |
| devlog   | Devlog       | none     | true          | Devlog |
| devlog/  | DevlogBinder | none     | true          | Devlog |
| devlog// | DevlogPaper  | none     | true          | Devlog |
| about    | About        | paper    | true          | About  |
逻辑：
``` cs
1. 获取 target view 字符
2. 当前在动画中（isAnimating=true），拦截点击
3. 等待所有普通hook完成
4. 更改currentView 
5. 等待所有Layouthook完成
6. 进行跳转
```
handle Animated Link Click：
将href跳转拦截成走navigation
```c
link.addEventListener('click', handleAnimatedLinkClick);
```