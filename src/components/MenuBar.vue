<template>
<div class="menu-bar">
    <transition name="slide-up">
        <div class="menu-wrapper" :class="{'hide-box-shadow':ifSettingShow || !ifTitleAndMenuShow}" v-show="ifTitleAndMenuShow">
            <div class="icon-wrapper">
                <span class="icon-menu icon" @click="showNav()"></span>
            </div>
            <div class="icon-wrapper">
                <span class="icon-progress icon" @click="showSetting(2)"></span>
            </div>
            <div class="icon-wrapper">
                <span class="icon-bright icon" @click="showSetting(1)"></span>
            </div>
            <div class="icon-wrapper">
                <span class="icon-a icon" @click="showSetting(0)">A</span>
            </div>
        </div>
    </transition>
    <transition name="slide-up">
        <div class="setting-wrapper" v-show=" ifSettingShow">
            <div class="setting-font-size" v-if="showTag === 0">
                <div class="preview" :style="{fontSize: fontSizeList[0].fontSize + 'px'}">A</div>
                <div class="select">
                    <div class="select-wrapper" v-for="(item,index) in fontSizeList" :key="index" @click="setFontSize(item.fontSize)">
                        <div class="line"></div>
                        <div class="point-wrapper">
                            <div class="point" v-show="defaultFontSize === item.fontSize">
                                <div class="small-point"></div>
                            </div>
                        </div>
                        <div class="line"></div>
                    </div>
                </div>
                <div class="preview" :style="{fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px'}">A</div>
            </div>
            <div class="setting-theme" v-else-if="showTag === 1">
                <div class="setting-theme-item" v-for="(item,index) in themeList" :key="index" @click="setTheme(index)">
                    <div class="preview" :style="{background: item.style.body.background}" :class="{'no-border': item.style.body.background !== '#fff'}"></div>
                    <div class="text" :class="{'selected': index=== defaultTheme}">{{item.name}}</div>
                </div>
            </div>
            <div class="setting-progress" v-else-if="showTag === 2">
                <div class="progress-wrapper">
                    <input type="range" class="progress"
                        max="100"
                        min="0"
                        step="1"
                        @change="onProgressChange($event.target.value)"
                        v-model="progress"
                        :disabled="!bookAvailable"
                        :style="{backgroundSize: progress + '% 100%'}"
                        ref="progress">
                    </div>
                    <div class="text-wrapper">
                        <span>{{bookAvailable? progress + "%" : '加载中'}}</span>
                    </div>
                </div>
            </div>
    </transition>
    <content-view :ifShowContent="ifShowContent" v-show="ifShowContent" :navigation="navigation" :bookAvailable="bookAvailable" @jumpTo="jumpTo">
    </content-view>
    <transition name="fade">
        <div class="content-mask" v-show="ifShowContent" @click="hideContent">
        </div>
    </transition>
</div>
</template>

<script>
import ContentView from '@/components/Content'
export default {
    //对引入组件进行注册 
    components: {
        ContentView
    },
    props: {
        ifTitleAndMenuShow: {
            type: Boolean,
            default: false
        },
        fontSizeList: Array,
        defaultFontSize: Number,
        themeList: Array,
        defaultTheme: Number,
        bookAvailable: {
            type: Boolean,
            default: false
        },
        navigation: Object,
        bookProgress: Number
    },
    data() {
        return {
            ifSettingShow: false,
            showTag: 0,
            progress: 0,
            ifShowContent: false
        }
    },
    watch: {
        // 监听bookProgress的改变，动态赋值给progress
        bookProgress: function () {
            this.progress = this.bookProgress
        },
    },
    methods: {
        // 提供目录是否展示信息给父组件
        returnISCT() {
            return this.ifShowContent
        },
        showNav() {
            this.ifShowContent = !this.ifShowContent,
                this.ifSettingShow = false
        },
        //隐藏目录
        hideContent() {
            this.ifShowContent = false
        },
        // 调用父组件的跳转目录
        jumpTo(target) {
            this.$emit('jumpTo', target)
        },
        // 拖动进度条后松开触发事件，跳转到指定位置
        onProgressChange(progress) {
            this.$emit('onProgressChange', progress)
        },
        setTheme(index) {
            this.$emit('setTheme', index)
        },
        setFontSize(fontSize) {
            this.$emit('setFontSize', fontSize)
        },
        showSetting(tag) {
            if (this.showTag === tag) {
                this.ifSettingShow = !this.ifSettingShow
            } else {
                this.ifSettingShow = true,
                    this.showTag = tag
            }
        },
        hideSetting() {
            this.ifSettingShow = false
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/global';

.menu-bar {

    .menu-wrapper {
        &.hide-box-shadow {
            box-shadow: none
        }

        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 101;
        display: flex;
        width: 100%;
        height: px2rem(48);
        background: white;
        box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);

        .icon-wrapper {
            flex: 1;
            @include center;

            .icon-progress {
                font-size: px2rem(25);
            }

            .icon-bright {
                font-size: px2rem(20);
            }
        }
    }

    .setting-wrapper {
        position: absolute;
        bottom: px2rem(48);
        left: 0;
        width: 100%;
        height: px2rem(60);
        z-index: 101;
        background: white;
        box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);

        .setting-font-size {
            display: flex;
            height: 100%;

            .preview {
                flex: 0 0 px2rem(40);
                @include center;

            }

            .select {
                display: flex;
                flex: 1;

                .select-wrapper {
                    flex: 1;
                    display: flex;
                    align-items: center;

                    &:first-child {
                        .line {
                            &:first-child {
                                border-top: none;
                            }
                        }
                    }

                    &:last-child {
                        .line {
                            &:last-child {
                                border-top: none;
                            }
                        }
                    }

                    .line {
                        flex: 1;
                        height: 0;
                        border-top: px2rem(1) solid #ccc;

                    }

                    .point-wrapper {
                        position: relative;
                        flex: 0 0 0;
                        width: 0;
                        height: px2rem(7);
                        border-left: px2rem(1) solid #ccc;

                        .point {
                            position: absolute;
                            top: px2rem(-8);
                            left: px2rem(-10);
                            width: px2rem(20);
                            height: px2rem(20);
                            border-radius: 50%;
                            background: white;
                            border: px2rem(1) solid #ccc;
                            box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, .15);
                            @include center;

                            .small-point {
                                width: px2rem(5);
                                height: px2rem(5);
                                border-radius: 50%;
                                background: black;
                            }
                        }
                    }
                }
            }
        }

        .setting-theme {
            height: 100%;
            display: flex;

            .setting-theme-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: px2rem(5);
                box-sizing: border-box;

                .preview {
                    flex: 1;
                    border: px2rem(1) solid #ccc;
                    box-sizing: border-box;

                    &.no-border {
                        border: none;
                    }
                }

                .text {
                    flex: 0 0 px2rem(20);
                    font-size: px2rem(16);
                    color: #ccc;
                    @include center;

                    &.selected {
                        color: #333
                    }
                }
            }
        }

        .setting-progress {
            position: relative;
            width: 100%;
            height: 100%;

            .progress-wrapper {
                height: 80%;
                width: 100%;
                padding: 0 px2rem(30);
                box-sizing: border-box;
                @include center;

                .progress {
                    width: 100%;
                    -webkit-appearance: none;
                    height: px2rem(2);
                    border-radius: 10%;
                    background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
                    background-size: 0 100%;

                    &:focus {
                        outline: none;
                    }

                    &::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        width: px2rem(20);
                        height: px2rem(20);
                        border-radius: 50%;
                        background: white;
                        box-shadow: 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, .15);
                        border: px2rem(1) solid #ddd;
                    }
                }

            }

            .text-wrapper {
                position: absolute;
                bottom: px2rem(1);
                width: 100%;
                color: #666;
                font-size: px2rem(12);
                @include center;
            }
        }
    }

    .content-mask {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 101;
        display: flex;
        width: 100%;
        height: 100%;
        background: rgba(51, 51, 51, .8);
    }
}
</style>
