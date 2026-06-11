# 在解决 Issues_001时发现的问题
## ==问题1：About组件抽离==
- About的内容是直接写在Page里的。
- 解决思路：将About的内容抽离到Components/About/AboutContent.astro中
#Architecture
# ==问题2：切换页面后列表刷新==
- 一些列表在切换页面后会被刷新位置（如Bookshelf、DevlogBinder）
- 解决思路：记录当前位置，在切换页面后再赋给它
#Transition 
## 问题3：==md文件的脚注跳转问题==
- 点击md文件的脚注小标，跳转会崩坏掉
- 解决思路：查明原因
#Transition 
## ==问题4：返回按钮修改样式==
- 现在的DeskLayout里的按钮虽然能用，但还是差点意思
- 解决思路：改成可以折叠的渐变返回按钮
#Layout
## ==问题5：跳转通道==
- 一些跳转没走navigation
- 解决思路：搜索跳转方法、修改
#Layout 
## ==问题6：加载问题==
- 本地加载报错、线上卡顿
- 解决思路：检测资源是否加载，避免重复加载
#Assets
# ==问题7：进入About时视角有些奇怪==
- 解决思路：改变一下锚点运动的动画曲线；
#Layout
## ==问题8：Binder界面标题问题==
- Binder界面太窄会导致标题换行，影响布局
- 解决思路：换成走马灯形式
#Layout
## ==问题9：Return按钮太不明显了==
- 解决思路：颜色变浅
#Layout