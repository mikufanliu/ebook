<template>
<transition name="slide-down">
    <div class="title-wrapper" v-show="ifTitleAndMenuShow">
        <div class="left">
            <span class="icon-back icon"></span>
        </div>
        <div class="right">
            <div class="icon-wrapper">
                <span @click="addBook" class="icon-add icon"  >+</span>
                <input type="file" ref="inputFile" id="id" style="display:none" @change="preview($event,1)">
            </div>
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
            </div>
        </div>
</transition>
</template>

<script>
import localForage from 'localforage'

export default {
    props: {
        book: Object,
        ifTitleAndMenuShow: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        preview(e) {
            let files = e.target.files
            if (!files.length) {
                return
            }
            let file = e.target.files[0]
            console.log(file.name + '  test')
            let reader = new FileReader()

            reader.onload = e => {
                let content = e.target.result
                // this.book = ePub({
                //     bookPath: content,
                //     restore: false
                 console.log("load epub")
                this.$emit('openNewEpub', content)
            }
                // })

                // this.localForage = localForage.createInstance({
                //     name: this.dbName
                // })
                // localForage.setItem(file.name, content, function () {
                //     console.log('input done  ' + files.name)
                // })

                // this.$emit('openNewEpub', content)
                // console.log('ok')
            // }
            reader.readAsArrayBuffer(file)
        },

        addBook(event) {
            this.$refs.inputFile.click()
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/global";

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

            .icon-add {
                font-size: px2rem(25);
            }

            .icon-cart {
                font-size: px2rem(20);
            }
        }
    }
}
</style>
