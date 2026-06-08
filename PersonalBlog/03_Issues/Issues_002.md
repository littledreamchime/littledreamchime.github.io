# 在解决 Issues_001时发现的问题
## 问题1：About组件抽离
- About的内容是直接写在Page里的。
- 解决思路：将About的内容抽离到Components/About/AboutContent.astro中
#Architecture
# 问题2：切换页面后列表刷新
- 一些列表在切换页面后会被刷新位置（如Bookshelf、DevlogBinder）
- 解决思路：记录当前位置，在切换页面后再赋给它
#Transition 
## 问题3：md文件的脚注跳转问题
- 点击md文件的脚注小标，跳转会崩坏掉
- 解决思路：查明原因
#Transition 

