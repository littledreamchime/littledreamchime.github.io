# 梳理文档时发现的问题
### 问题1：加载问题
- 跳转的时候需要加载，网速不好的话会卡很长时间。
- 解决思路：提前在Welcome界面预加载所有组件。
#Assets
## ==问题2：跳转时间混乱==
- 跳转的时间管理非常混乱，都已经分不清哪个事件是由谁控制的了。
- 解决思路：找到散落在各处的时间变量，统一管理。
#Transition
## ==问题3：跳转时层级关系错乱==
- 跳转的时候层级关系会混乱，导致视觉不连贯；
- 解决思路：在跳转时也给所有组件指定index。
#Transition #Layout 
## ==问题4：书架打开后Header遮挡下部界面问题==
- Header在一些情况下，特别是宽屏，会遮挡书架的子元素；
- 解决思路：为书架的子界面定制css
#Layout
## ==问题5：书架子界面布局太奇怪==
- DevlogBinder界面在手机端太小；DevlogPage界面的字体和界面太过诡异
- 解决思路：为手机版适配DevlogBinder，让DevlogBinder超出父物体；在电脑端，让DevlogPage右边显示Binder，DevlogPage适当边窄；在手机端，让DevlogPage的标题在下滑后隐藏，在上划后出现。
#Layout 
## ==问题6： 书架的Page界面是直接写在..slug界面中的==
- 解决思路：抽离BookPage组件到Component
#Architecture
## ==问题7：Components结构混乱==
- 解决思路：分为Devlog、Main、Blog、About模块
#Architecture 
## ==问题8：书架子界面overlay分离问题==
- 书架的子界面overlay重复写了几次
- 解决思路：抽离overlay组件到Component
#Architecture

解决顺序：7 -> 6 -> 8 -> 2 -> 3 -> 4 -> 5 -> 1