# 在解决 Issues_001时发现的问题
## ==问题1：About组件抽离==
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
## 问题4：返回按钮修改样式
- 现在的DeskLayout里的按钮虽然能用，但还是差点意思
- 解决思路：改成可以折叠的渐变返回按钮
#Layout
## ==问题5：跳转通道==
- 一些跳转没走navigation
- 解决思路：搜索跳转方法、修改
#Layout 
