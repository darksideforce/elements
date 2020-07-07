import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/css/icon.css'
import axios from 'axios'

Vue.prototype.$http = axios
//配置全局默认URL
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  
  config.headers.Authorization = window.sessionStorage.getItem('item')
  return config
})

Vue.config.productionTip = false




new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
