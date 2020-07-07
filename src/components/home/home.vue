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
      <el-aside width='200px'>
        <el-menu background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index='1'>
            <!--这里是一级菜单-->
            <template slot='title'>
              <i class='el-icon-location'></i>
              <span>导航1</span>
            </template>
            <!--这里是二级菜单-->
            <el-menu-item>
              <template slot='title'>
              <i class='el-icon-location'></i>
              <span>导航1</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右边内容主体-->
      <el-main>
          main
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods:{
    //退出
    back(){
      window.sessionStorage.clear()
      this.$router.push('/login')
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
}
.el-main{
  background-color: #EAEDF1;
}

</style>