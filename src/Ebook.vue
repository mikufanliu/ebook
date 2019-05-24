<template>
<div class="ebook">
    <title-bar ref="titleBar" @storeReadProgress="storeReadProgress" :bookProgress="bookProgress" :ifTitleAndMenuShow="ifTitleAndMenuShow" @openNewEpub="openNewEpub" :bookInfo="bookInfo"></title-bar>
    <div class="read-wrapper">
        <div id="read"></div>
        <div class="mask">
            <div class="left" @click="prevPage"></div>
            <div class="center" @click="toggleTitleAndMenu"></div>
            <div class="right" @click="nextPage"></div>
        </div>
    </div>
    <menu-bar :ifTitleAndMenuShow="ifTitleAndMenuShow" :fontSizeList="fontSizeList" :defaultFontSize="defaultFontSize" @setFontSize="setFontSize" :themeList="themeList" :defaultTheme="defaultTheme" @setTheme="setTheme" :bookAvailable="bookAvailable" @onProgressChange="onProgressChange" @jumpTo="jumpTo" :navigation="navigation" :bookProgress="bookProgress" ref="menuBar">
    </menu-bar>
</div>
</template>

<script>
// toggleTitleAndMenu
import TitleBar from '@/components/TitleBar'
import MenuBar from '@/components/MenuBar'
import ePub from 'epubjs'

const DOWNLOAD_URL1 = './static/book1.epub'
const DOWNLOAD_URL2 = './static/book2.epub'

export default {
    components: {
        TitleBar,
        MenuBar
    },
    data() {
        return {
            bookKey: 'deafault',
            book: null,
            bookInfo: {},
            ifTitleAndMenuShow: true,
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
                    name: '默认',
                    style: {
                        body: {
                            'color': '#000',
                            'background': '#fff'
                        }
                    }
                },
                {
                    name: '护眼',
                    style: {
                        body: {
                            'color': '#000',
                            'background': '#ceeaba'
                        }
                    }
                },
                {
                    name: '夜间',
                    style: {
                        body: {
                            'color': '#fff',
                            'background': '#000'
                        }
                    }
                },
                {
                    name: '纸张',
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
            bookProgress: 0,
            bookSrc: DOWNLOAD_URL1
        }
    },
    methods: {
        showProgress() {
            // console.log('change')
            let currentLocation = this.rendition.currentLocation()
            this.bookProgress = this.bookAvailable ? this.locations.percentageFromCfi(currentLocation.start.cfi) : 0
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
        hideTitleAndMenu() {
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
                    () => {
                        this.showProgress()
                    }
                )
            }
        },
        nextPage() {
            if (this.rendition) {
                this.rendition.next().then(
                    () => {
                        this.showProgress()
                    }
                )
            }
        },
        storeReadProgress() {
            let cfi = this.rendition.currentLocation().start.cfi
            this.bookCfi.setItem(this.bookKey, cfi).then(() => {
                console.log(this.bookKey + "'s read  progress is stored!")
            })
        },

        // 电子书的解析和渲染
        openNewEpub(value) {
            // 清除上一本书的状态
            this.bookAvailable = false
            this.$refs.menuBar.progress = 0

            let bookSrc = value[0]
            let bookKey = value[1]

            // 存储上一本的阅读进度，获取打开书的进度
            let cfi = this.rendition.currentLocation().start.cfi
            let currentCfi = null
            this.bookCfi.setItem(this.bookKey, cfi).then(() => {
                console.log(this.bookKey + " cfi is stored!")
                console.log(cfi)
                this.bookKey = bookKey
                this.bookCfi.getItem(this.bookKey).then(Cfi => {
                    console.log('get ' + this.bookKey + ' cfi')
                    currentCfi = Cfi
                    console.log('current cfi is ' + currentCfi)

                    if (this.book != null) {
                        this.book.destroy()
                    }
                    this.showEpub(bookSrc, currentCfi)
                })
            }).then(() => {

            })
        },

        showEpub(bookSrc, cfi) {
            console.log(bookSrc)
            // 生成Book对象
            this.book = new ePub(bookSrc, {
                restore: true
            })
            this.rendition = this.book.renderTo('read', {
                width: "100vw",
                height: "100vh",
                // 兼容iOS
                method: 'default'
            })

            // 得到书的封面和其他详细信息
            this.book.loaded.metadata.then(meta => {
                this.book.loaded.cover.then(cover => {
                    if (cover != null) {
                        this.book.archive.createUrl(cover).then(url => {
                            meta.cover = url
                            // console.log(meta)
                            this.bookInfo = meta
                        })
                    } else {
                        meta.cover = './static/logo.png'
                        this.bookInfo = meta
                    }
                })
            })

            // 通过Rendtion.display渲染电子书
            if (cfi != undefined && cfi != null) {
                console.log('ready to ' + cfi)
                this.rendition.display(cfi)
            } else {
                this.rendition.display()
            }
            // 获取Theme对象
            this.themes = this.rendition.themes
            // 设置默认字体
            this.setFontSize(this.defaultFontSize)
            // 注册主题
            this.registerTheme()
            // 设置默认主题
            this.setTheme(this.defaultTheme)
            // Book对象的钩子函数ready
            this.book.ready.then(() => {
                this.navigation = this.book.navigation
                // 生成Locations对象
                return this.book.locations.generate()
            }).then(result => {
                this.locations = this.book.locations
                // 标记电子书为解析完毕状态
                this.bookAvailable = true
                console.log('book available')
            }).then(() => {
                this.showProgress()
            })
        },

        handleScroll(e) {
            //如果侧栏没有展示就监听鼠标滚轮事件
            if (!this.$refs.menuBar.ifShowContent && !this.$refs.titleBar.showBookStore&&!this.$refs.titleBar.ifShowBookInfo) {
                e.deltaY > 0 ? this.nextPage() : this.prevPage()
            }
        }
    },

    mounted() {
        this.showEpub(this.bookSrc)
        // 监听鼠标滚轮事件
        // ie and Chrome
        window.addEventListener('mousewheel', this.handleScroll, false)
        // firefox
        window.addEventListener("DOMMouseScroll", this.handleScroll, false)
    }
}
</script>

<style lang="scss" scoped>
@import 'assets/styles/global';

.ebook {
    position: relative;
    // 隐藏侧边和底部的滚动条
    overflow-y: hidden;
    overflow-x: hidden;

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
