<template>
<transition name="slide-right">
    <div class="store">
        <div class="title-wrapper">
            <div class="icon-history icon" @click="toggleStore"></div>
            <div class="icon-floppy-disk icon" @click="clearBooks"></div>
        </div>
        <div class="book-store">
            <div class="book-item" v-for="(item,index) in books" :key="index">
                <img v-bind:src="item.cover" class="book-cover" @click="open(item)">
                <span class="book-name">{{item.title}}</span>
            </div>
            <div class="book-item">
                <span @click="addBook" class="icon-folder-plus"  ></span>
                <input  type="file" ref="inputFile" style="display:none" @change="inputNewEpub($event)">
                <span class="add-book">点击添加图书</span>
            </div>
        </div>
    </div>
</transition>
</template>

<script>
import ePub from 'epubjs'

export default {
    props: {
        // books: Array
    },
    data() {
        return {
            books: []
        }
    },
    created: function () {
        this.setBooks()
    },
    methods: {
        getBookMeta(value, key) {
            let book = ePub(value, {
                restore: true
            })
            book.loaded.metadata.then(meta => {
                meta.key = key
                book.loaded.cover.then(cover => {
                    if (cover != null) {
                        book.archive.createUrl(cover).then(url => {
                            meta.cover = url
                            // console.log(meta)
                            this.books.push(meta)
                        })
                    } else {
                        meta.cover = './static/logo.png'
                        // console.log(meta)
                        this.books.push(meta)
                    }
                })
            })
        },
        setBooks() {
            this.store.iterate((value, key, iterationNumber) => {
                this.getBookMeta(value, key)
            })
            console.log("set meta")
        },
        inputNewEpub(e) {
            // console.log("begin")
            let files = e.target.files
            if (!files.length) {
                console.log('No file selected!')
                return
            }
            let file = e.target.files[0]
            let reader = new FileReader()
            reader.readAsArrayBuffer(file)
            if (file.name.substr(file.name.indexOf(".")) != '.epub') {
                console.log(file.name + " is not an epub file!")
                this.$refs.inputFile.value = ''
                return
            }

            reader.onload = () => {
                // console.log("load book")
                let value = reader.result
                this.store.keys().then(keys => {
                    // console.log(keys)
                    if (keys.indexOf(file.name) == -1) {
                        this.store.setItem(file.name, value)
                        console.log("add a new book as ArryBuffer to database")
                        this.getBookMeta(value, file.name)
                    } else {
                        console.log("not a new book")
                    }
                    this.$refs.inputFile.value = ''
                })
            }
        },
        addBook(event) {
            this.$refs.inputFile.click()
        },

        clearBooks() {
            this.store.clear()
            this.books = []
            console.log(this.books)
        },
        toggleStore() {
            this.$emit('toggleStore')
        },
        open(item) {
            // console.log(bookKey)
            this.store.getItem(item.key).then(value => {
                // console.log(value)
                this.$emit('openNewEpub', value)
            }).then(this.toggleStore).then(()=>
            this.bookIfo = item
            )
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/global';

.store {
    top: 0;
    left: 0;
    z-index: 102;
    position: absolute;
    // display: flex;
    width: 100%;
    height: 100%;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    // flex-flow: column;

    .title-wrapper {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        height: 8%;
        background: white;
        justify-content: flex-end;

        .icon {
            @include center;
            flex: 0 0 px2rem(60);
        }
    }

    .book-store {
        display: flex;
        width: 100%;
        height: 92%;
        background: rgb(175, 191, 243);
        flex-flow: wrap;
        overflow: auto;
        @include center;

        .book-item {
            display: flex;
            flex-flow: column;
            // position:absolute;
            margin: px2rem(20) px2rem(20) px2rem(20) px2rem(20);
            // border: px2rem(1) solid #ccc;
            width: px2rem(150);
            height: px2rem(250);
            background: rgb(228, 224, 224);
            @include center;

            .book-cover {
                width: 100%;
                height: 90%;
                // background: #ccc;
            }

            .book-name {
                width: 100%;
                height: 10%;
                @include center;
                font-size: px2rem(8);
            }

            .icon-folder-plus {
                font-size: px2rem(70);
                // flex: 0 0 px2rem(180);
            }

            .add-book {
                font-size: px2rem(25);
            }
        }
    }
}
</style>
