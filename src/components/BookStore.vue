<template>
<transition name="slide-right">
    <div class="store">
        <div class="mask" @click="hideAbout" v-show="ifShowAbout">
        </div>
        <div class="about" v-show="ifShowAbout">
            <div class="info-item">
                <span class="logo icon-bin"></span>
                <span class="text" @click="clearBooks">清空书架</span>
            </div>
            <div class="info-item">
                <span class="logo icon-yelp"></span>
                <span class="text"><a  href="https://baike.baidu.com/item/ePub/9924958?fr=aladdin">关于epub</a></span>
            </div>
            <div class="info-item">
                <span class="logo icon-github"></span>
                <span class="text"><a href="https://github.com/mikufanliu/ebook">开源地址</a></span>
            </div>

        </div>
        <div class="title-wrapper">
            <div class="left">
                <span class="icon-person icon" @click="showAbout"></span>
            </div>
            <div class="center">
                <span class="text">EPUB Reader</span>
            </div>
            <div class="right">
                <span class="icon-arrow-right icon" @click="toggleStore"></span>
                <!-- <span class="icon-floppy-disk icon" @click="clearBooks"></span> -->
            </div>
        </div>
        <div class="book-store">
            <div class="book-item" v-for="(item,index) in books" :key="index" @mouseenter="showDelete(index)" @mouseleave="hideDelete(index)">
                <div class="cover">
                    <span class="icon-cross delete" @click="deleteBook(item)" v-show="item.ifShowDelete"></span>
                    <img v-bind:src="item.cover" class="book-cover" @click="open(item)">
                </div>
                    <span class="book-name">{{item.title}}</span>
                </div>
                <div class="book-item">
                    <div @click="addBook" class="icon-folder-plus"></div>
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
            ifShowAbout: false,
            books: []
        }
    },
    created: function () {
        this.setBooks()
    },
    methods: {
        hideAbout() {
            this.ifShowAbout = false
        },
        showAbout() {
            this.ifShowAbout = !this.ifShowAbout
        },
        hideDelete(index) {
            this.books[index].ifShowDelete = false
        },
        showDelete(index) {
            this.books[index].ifShowDelete = true
        },
        deleteBook(item) {
            this.store.removeItem(item.key).then(() => {
                // 当值被移除后，此处代码运行
                console.log('Book is deleted!')
                this.books.pop(item)
            })
        },
        getBookMeta(value, key) {
            let book = ePub(value, {
                restore: true
            })
            book.loaded.metadata.then(meta => {
                meta.key = key
                meta.ifShowDelete = false
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
            // console.log("set meta")
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
            this.bookCfi.clear()
            this.books = []
            console.log('cleaned!')
        },
        toggleStore() {
            this.$emit('toggleStore')
        },
        open(item) {
            // console.log(bookKey)
            this.store.getItem(item.key).then(value => {
                // console.log(item.key)
                this.$emit('openNewEpub', [value, item.key])
            }).then(this.toggleStore)
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
    font-family: ubuntu, sans-serif;

    // flex-flow: column;
    .mask {
        position: absolute;
        z-index: 102;
        // background: rgba(51, 51, 51, .8);
        width: 100%;
        height: 100%;
    }

    .about {
        z-index: 103;
        position: absolute;
        width: 50%;
        height: 27%;
        left: 0;
        top: 8%;
        // background: rgb(232, 243, 232);
        padding: px2rem(8) px2rem(3);

        .info-item {
            display: flex;
            height: px2rem(48);
            width: 100%;
            background: white;
            margin-bottom: px2rem(2);
            border-radius: 0.4em;
            box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, .15);

            a {
                text-decoration: none;
                color: #333;
            }

            a:focus {
                outline-style: none;
                -moz-outline-style: none;
            }

            .logo {
                width: 20%;
                height: 100%;
                @include center;
                border-right: px2rem(1) solid #ccc;
            }

            .text {
                width: 80%;
                height: 100%;
                @include center;
                font-size: px2rem(25);
            }
        }
    }

    .title-wrapper {
        position: relative;
        display: flex;
        width: 100%;
        height: 8%;
        background: rgb(232, 243, 232);
        border-bottom: 1px solid #333;

        .left {
            @include center;
            flex: 0 0 px2rem(60);
        }

        .center {
            flex: 1;
            @include center;
            font-size: px2rem(30);
        }

        .right {
            @include center;
            flex: 0 0 px2rem(60);
        }
    }

    .book-store {
        position: relative;
        display: flex;
        width: 100%;
        height: 92%;
        background: linear-gradient(rgb(232, 243, 232), rgb(175, 191, 243));
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
            background: rgb(255, 255, 255);
            @include center;
            position: relative;
            box-shadow: 0 px2rem(9) px2rem(10) rgba(0, 0, 0, .15);

            .cover {
                width: 100%;
                height: 90%;
                // background: blue;

                .delete {
                    color: rgb(253, 206, 206);
                    position: absolute;
                    display: block;
                    top: -10px;
                    right: 0;
                    font-size: px2rem(25);
                }

                .delete:hover {
                    top: -15px;
                    font-size: px2rem(40);
                    color: rgb(250, 0, 0);
                }

                .book-cover {
                    width: 100%;
                    height: 100%;
                }
            }

            .book-name {
                width: 100%;
                height: 10%;
                font-size: px2rem(8);
                @include center;
            }

            .icon-folder-plus {
                @include center;
                width: 100%;
                height: 100%;
                font-size: px2rem(70);
            }

            .add-book {
                font-size: px2rem(15);
            }
        }
    }
}
</style>
