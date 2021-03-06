import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login/Login'
import home from '../components/home/home'
import welcome from '../components/welcome/welcome'
import user from '../components/user/user'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import Goods from '../components/goods/Goods'
import Add from '../components/goods/add'
import Order from '../components/order/Order'
import report from '../components/report/report'


Vue.use(VueRouter)

  const routes = [
  {
    path:'/',
    redirect: '/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:home,
    redirect:'/welcome',
    children:[{path:'/welcome' , component:welcome},
              {path:'/users' , component:user},
              {path:'/rights' , component:Rights},
              {path:'/Roles' , component:Roles},
              {path:'/Roles' , component:Roles},
              {path:'/Categories' , component:Cate},
              {path:'/params' , component:Params},
              {path:'/goods', component:Goods},
              {path:'/goods/add',component:Add},
              {path:'/orders',component:Order},
              {path:'/reports',component:report},
              ]
  }

]

const router = new VueRouter({
  routes
})
//导航
router.beforeEach((to,from,next)=>{
  if(to.path === '/login')return next()
    //如果访问的是首页，则直接放行
  const tokenstr = window.sessionStorage.getItem('token')
  if(!tokenstr){
    return next('/login')
  }
  next()
})
export default router
