<template>
<div class="title-bar">
    <transition name="slide-down">
        <div class="title-wrapper" v-show="ifTitleAndMenuShow">
            <div class="left">
                <span class="icon-books icon" @click="toggleStore"></span>
            </div>
            <div class="right">
                <!-- <div class="icon-wrapper">
                    <span @click="addBook" class="icon-folder-plus icon"  ></span>
                    <input type="file" ref="inputFile" style="display:none" @change="inputNewEpub($event)">
            </div> -->
                    <div class="icon-wrapper">
                        <span class="icon-cart icon"></span>
                    </div>
                    <div class="icon-wrapper">
                        <span class="icon-person icon"></span>
                    </div>
                    <div class="icon-wrapper">
                        <span class="icon-more icon">
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
    <book-store @openNewEpub="openNewEpub"
 v-show="showBookStore" @toggleStore="toggleStore"></book-store>
</div>
</template>

<script>
import screenFull from 'screenfull'
import BookStore from '@/components/BookStore'
import ePub from 'epubjs'

export default {
    components: {
        BookStore
    },
    data() {
        return {
            showBookStore: true,
            isFullScreen: false,
        }
    },
    props: {
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
        openNewEpub(value){
            this.$emit('openNewEpub',value)
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
    .title-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 101;
        display: flex;
        width: 100%;
        height: px2rem(48);
        background: red;
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
