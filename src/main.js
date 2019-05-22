// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueAxios from 'vue-axios'
import axios from 'axios'
import localForage from 'localforage'

import '@/assets/styles/icon.css'
import '@/assets/styles/global.scss'

Vue.use(vueAxios, axios)
Vue.config.productionTip = false

// 声明数据库存储图书
const store = localForage.createInstance({
    name: 'bookDB'
})

Vue.prototype.store = store

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
