<template>
  <el-container class='home-container'>
    <!--头部区域 -->
    <el-header class='header' >
      <div>
        <img src="../../assets/img/黑马.jpg" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type='info' @click='back'>
      退出
      </el-button>
    </el-header>
    <el-container>
      <!--侧边栏-->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class='toggle-button' @click='collapseclick'>|||</div>
        <el-menu background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="iscollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu :index="item.id+ '' "
            v-for='item in menulist'
            :key='item.id'
          >
            <!--这里是一级菜单-->
            <template slot='title'>
                <i :class='iconObj[item.id]'></i>
                <span>{{item.authName}}</span>
            </template>
            <!--这里是二级菜单-->
            <el-menu-item
              :index="'/'+subitem.path "
              v-for='subitem in item.children'
              :key='subitem.id'
              @click="saveNavstate('/'+subitem.path)"
            >
            <!--这里是二级菜单模板区-->
              <template slot='title'>
              <i class='el-icon-menu'></i>
              <span>{{subitem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右边内容主体-->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      menulist:[],
      iconObj:{
        '125':'iconfont icon-user1',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },
      iscollapse:false,
      activePath:''
    }
  },
  created(){
    this.getMentlist()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods:{
    //退出
    back(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取数据的方法
    getMentlist(){
      this.$http.get('menus').then(res=>{
        const {data} = res
        if(data.meta.status!==200){
          return this.$message.error('请求失败')
        }
        if(data.meta.status == 200){
          this.$message.success('请求成功')
          this.menulist = data.data
        }
      })
    },
    //改变缩放
    collapseclick(){
      this.iscollapse = !this.iscollapse
    },
    //储存index，高亮效果的动态切换
    saveNavstate(activepath){
      window.sessionStorage.setItem('activePath',activepath)
      this.activePath = activepath
    }

  }


}
</script>

<style lang='less' scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color:#373d41 ;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  color: #fff;
  div{
    height: 100%;
    display: flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
    img{
      height:100%
    }
  }
}

.el-aside{
  background-color: #333744;
  
  .el-menu{
    border-right: none;
    
  }
}
.el-main{
  background-color: #EAEDF1;
}
.iconfont{
  margin-right:10px;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}
.el-submenu{
  text-align: none;
}
</style>