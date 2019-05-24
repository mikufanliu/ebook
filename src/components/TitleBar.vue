<template>
<div class="title-bar">
    <transition name="slide-down">
        <div class="title-wrapper" v-show="ifTitleAndMenuShow">
            <div class="left">
                <span class="icon-books icon" @click="toggleStore"></span>
            </div>
            <div class="right">
                <div class="icon-wrapper">
                    <span class="icon-history icon" @click="storeReadProgress"></span>
                </div>
                <div class="icon-wrapper">
                    <span class="icon-file-text icon" @click="showBookInfo">
                </span>
                </div>
                <div class="icon-wrapper">
                    <span class="icon" :class="[isFullScreen?'icon-shrink':'icon-enlarge']"
                     @click="toggleFullScreen">
                </span>
                </div>
            </div>
        </div>
    </transition>
    <book-store @openNewEpub="openNewEpub" :bookProgress="bookProgress" v-show="showBookStore" @toggleStore="toggleStore"></book-store>
    <div class="content-mask" @click="showBookInfo" v-show="ifShowBookInfo">
    </div>
    <div class="info-content" v-show="ifShowBookInfo">
        <div class="book-cover">
            <img v-bind:src="this.bookInfo.cover"  class="cover">
        </div>
            <div class="meta-info">
                <div class="info-item" v-for="(item,index) in bookInfo" :key="index" v-show="index!='cover'&&item!='' &&item!=null">
                    <span class="index">{{index}}</span>
                    <span class="item">{{item}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import screenFull from 'screenfull'
import BookStore from '@/components/BookStore'
import ePub from 'epubjs'
import { Stream } from 'stream';

export default {
    components: {
        BookStore
    },
    data() {
        return {
            showBookStore: false,
            isFullScreen: false,
            ifShowBookInfo: false
        }
    },
    props: {

        bookInfo: Object,
        bookProgress: Number,
        ifTitleAndMenuShow: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        document.onkeydown = (e) => {
            console.log(e)
            var explorer = window.navigator.userAgent.toLowerCase();
            if (explorer.indexOf('chrome') > 0) { //webkit
                if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
                    this.isFullScreen = true
                } else {
                    this.isFullScreen = false
                }
            } else { //IE 9+  fireFox
                if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
                    this.isFullScreen = true
                } else {
                    this.isFullScreen = false
                }
            }
            // console.log('Am I fullscreen?', this.isFullScreen ? 'Yes' : 'No');
        }
        screenFull.on('change', () => {
            // console.log('Am I fullscreen?', screenFull.isFullscreen ? 'Yes' : 'No');
            this.isFullScreen = screenFull.isFullscreen
        });
    },
    methods: {
        storeReadProgress() {
            alert('您已成功保存阅读进度')
            this.$emit('storeReadProgress')
        },
        showBookInfo() {
            this.ifShowBookInfo = !this.ifShowBookInfo
            // console.log(this.bookInfo)
        },
        openNewEpub(value) {
            this.$emit('openNewEpub', value)
        },
        // 点击 显示/隐藏 书架
        toggleStore() {
            this.showBookStore = !this.showBookStore
        },
        // 点击切换全屏
        toggleFullScreen() {
            if (!screenFull.enabled) {
                this.$message({
                    message: 'Your browser does not work',
                    type: 'warning'
                })
                return false
            }
            screenFull.toggle()
        },
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/global";

.title-bar {
    .content-mask {
        position: absolute;
        z-index: 102;
        background: rgba(51, 51, 51, .8);
        width: 100%;
        height: 100%;
    }

    .info-content {
        position: absolute;
        z-index: 103;
        // display: flex;
        right: 0;
        background: linear-gradient(to top right, rgb(238, 220, 220), rgb(207, 228, 190));
        width: 80%;
        height: 100%;
        overflow: auto;

        .book-cover {
            width: 100%;
            height: 50%;
            // margin: px2rem(2) 0 px2rem(2) 0;
            @include center;

            .cover {
                width: px2rem(150);
                height: px2rem(240);
                box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, .15);
            }
        }

        .meta-info {
            background: white;
            border-radius: 0.5em;
            box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, .15);

            .info-item {

                &:not(:first-child) {
                    border-top: 1px solid #ccc;
                }

                display: flex;
                height: px2rem(40);
                width: 100%;
                font-size: px2rem(10);

                .index {
                    height: 100%;
                    width: 30%;
                    @include center;
                    border-right: 1px dashed #ccc;

                }

                .item {
                    height: 100%;
                    width: 70%;
                    @include center;
                }

            }
        }
    }

    .title-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 101;
        display: flex;
        width: 100%;
        height: px2rem(48);
        background:  rgb(232, 243, 232);
        box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, 0.15);

        .left {
            flex: 0 0 px2rem(60);
            @include center;
        }

        .right {
            flex: 1;
            display: flex;
            justify-content: flex-end;

            .icon-wrapper {
                @include center;
                flex: 0 0 px2rem(40);

                .icon-cart {
                    font-size: px2rem(20);
                }
            }
        }
    }
}
</style>
