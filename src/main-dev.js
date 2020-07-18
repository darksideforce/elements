import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/css/icon.css'
import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' 

Vue.prototype.$http = axios
//配置全局默认URL
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//拦截器
axios.interceptors.request.use(config=>{
  //进度条优化展示
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须return
  return config
})
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})
Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

//全局过滤器的创建
Vue.filter('dateFormat',function(originVal){
  const data = new Date(originVal)
  const y = data.getFullYear()
  const m = (data.getMonth() + 1 + '').padStart(2,'0 ')
  const d = (data.getDate() +1 + '').padStart(2,'0')
  const h = (data.getHours() +1 +'').padStart(2,'0')
  const min = (data.getMinutes() +1 +'').padStart(2,'0')
  const sec = (data.getSeconds() +1 +'').padStart(2,'0')
  return `${y}-${m}-${d}-${h}:${min}:${sec}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
