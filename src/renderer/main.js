import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from '../renderer/store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import db from './datastore'

Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
// Vue.prototype.$db = db

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

// window.onbeforeunload = (e) => {
//   console.log('I do not want to be closed')
//   e.returnValue = false // 相当于 `return false` ，但是不推荐使用
// }
