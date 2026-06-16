# 在开发Blog页面时发现的问题

## 问题一：DeskItems的tooltip位移问题
- 第一次悬浮到Items上时，会发生tooltip从左上角飞入的问题
- 解决transition动画
#Layout 
## 问题二：文字重复问题
- Devlog从Page到Binder文字因为需要滚动会出现两个；
- 解决思路：在返回时立刻删除多余文字
#Layout 
## ==问题三：Blog的Page界面在宽屏下太窄了==
- 解决思路：适当增大宽度，
#Layout #Transition 
## 问题四：手机端的blog界面太小了
- 解决思路：如果在手机端，则将deskmain旋转90度。
#Layout 