<template>
<div class="ebook">
    <title-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"></title-bar>
    <div class="read-wrapper">
        <div id="read"></div>
        <div class="mask">
            <div class="left" @click="prevPage"></div>
            <div class="center" @click="toggleTitleAndMenu"></div>
            <div class="right" @click="nextPage"></div>
        </div>
    </div>
    <menu-bar  :ifTitleAndMenuShow="ifTitleAndMenuShow" 
                            :fontSizeList="fontSizeList" :defaultFontSize="defaultFontSize" @setFontSize="setFontSize"
                            :themeList="themeList"
                            :defaultTheme="defaultTheme"
                            @setTheme="setTheme"
                            :bookAvailable="bookAvailable"
                            @onProgressChange="onProgressChange"
                            @jumpTo="jumpTo"
                            :navigation="navigation"
                            :bookProgress="bookProgress"
                            ref="menuBar">
     </menu-bar>
</div>
</template>

<script>
import TitleBar from '@/components/TitleBar'
import MenuBar from '@/components/MenuBar'
import Epub from 'epubjs'
const DOWNLOAD_URL = '/static/book1.epub'
global.ePub = Epub
export default {
    components: {
        TitleBar,
        MenuBar
    },
    data() {
        return {
            ifTitleAndMenuShow: false,
            fontSizeList: [{
                    fontSize: 12
                },
                {
                    fontSize: 14
                },
                {
                    fontSize: 16
                },
                {
                    fontSize: 18
                },
                {
                    fontSize: 20
                },
                {
                    fontSize: 22
                },
                {
                    fontSize: 24
                }
            ],
            defaultFontSize: 16,
            themeList: [{
                    name: 'default',
                    style: {
                        body: {
                            'color': '#000',
                            'background': '#fff'
                        }
                    }
                },
                {
                    name: 'eye',
                    style: {
                        body: {
                            'color': '#000',
                            'background': '#ceeaba'
                        }
                    }
                },
                {
                    name: 'night',
                    style: {
                        body: {
                            'color': '#fff',
                            'background': '#000'
                        }
                    }
                },
                {
                    name: 'gold',
                    style: {
                        body: {
                            'color': '#000',
                            'background': 'rgba(241, 236, 226)'
                        }
                    }
                }
            ],
            defaultTheme: 0,
            bookAvailable: false,
            navigation: {},
            bookProgress: 0
        }
    },
    methods: {
        showProgress() {
            const currentLocation = this.rendition.currentLocation()
            this.bookProgress = this.bookAvailable ? this.locations.percentageFromCfi(currentLocation.start.cfi):0
            this.bookProgress = Math.round(this.bookProgress * 100)
        },
        //跳转到指定的链接
        jumpTo(href) {
            this.rendition.display(href).then(
                () => {
                    this.showProgress()
                }
            )
            this.hideTitleAndMenu()
        },
        hideTitleAndMenu(){
            this.ifTitleAndMenuShow = false
            this.$refs.menuBar.hideSetting()
            this.$refs.menuBar.hideContent()
        },
        onProgressChange(progress) {
            const percentage = progress / 100
            const location = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0
            this.rendition.display(location)
        },
        setTheme(index) {
         this.themes.select(this.themeList[index].name)
         this.defaultTheme = index
        },
        registerTheme() {
            this.themeList.forEach(theme => {
                this.themes.register(theme.name, theme.style)
            })
        },
        setFontSize(fontSize) {
            this.defaultFontSize = fontSize
            if (this.themes) {
                this.themes.fontSize(fontSize + 'px')
            }
        },
        toggleTitleAndMenu() {
            this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow
            if (!this.ifTitleAndMenuShow) {
                this.$refs.menuBar.hideSetting()
            }
        },
        prevPage() {
            if (this.rendition) {
                this.rendition.prev().then(
                    () =>{
                        this.showProgress()
                    }
                )

            }
        },
        nextPage() {
            if (this.rendition) {
                this.rendition.next().then(
                    () =>{
                        this.showProgress()
                    }
                )
            }
        },
        // 电子书的解析和渲染
        showEpub() {
            // 生成Rendition
            this.book = new Epub(DOWNLOAD_URL)
            this.rendition = this.book.renderTo(
                'read', {
                    width: "100vw",
                    height: "100vh"
                })
            this.rendition.display()
            // 获取theme对象
            this.themes = this.rendition.themes
            // 默认字体设置
            this.setFontSize(this.defaultFontSize)
            // 主题设置
            this.registerTheme()
            this.setTheme(this.defaultTheme)
            // 进度的获取
            this.book.ready.then(() => {
                // 获取导航栏
                this.navigation = this.book.navigation
                return  this.book.locations.generate()
            }).then(() => {
                this.locations = this.book.locations
                this.bookAvailable = true
            })
        },
        handleScroll (e) {
            //如果侧栏没有展示就监听鼠标滚轮事件
            if(!this.$refs.menuBar.ifShowContent && (document.getElementsByClassName("mask").length == 1)){
                e.deltaY>0 ? this.nextPage() : this.prevPage()}
        }
    },
    mounted() {
        this.showEpub()
        // 监听鼠标滚轮事件
        // ie and Chrome
        window.addEventListener('mousewheel',this.handleScroll,false)
        // firefox
        window.addEventListener("DOMMouseScroll",this.handleScroll,false)
    }
}
</script>

<style lang="scss" scoped>
@import 'assets/styles/global';

.ebook {
    position: relative;
	// 隐藏侧边和底部的滚动条
 	overflow-y:hidden;
  	overflow-x:hidden;
    .read-wrapper {
        .mask {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 100;
            width: 100%;
            height: 100%;
            display: flex;

            .left {
                flex: 0 0 px2rem(100);
            }

            .center {
                flex: 1;
            }

            .right {
                flex: 0 0 px2rem(100);
            }
        }
    }
}
</style>
