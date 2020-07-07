<template>
  <div class='login_container'>
    <div class="login_box">
      <div class="avatar">
        <img src="../../assets/logo.png" alt="">
      </div>
      <!--用户登陆界面 -->
      <el-form label-width='0px' class='login' :model = 'loginForm'
        :rules="loginFormRules"
        ref='loginForm'
      >
        <el-form-item  prop="username">
          <el-input prefix-icon="iconfont icon-user1" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon='iconfont icon-password' 
          v-model='loginForm.password'
          type='password'> </el-input>
        </el-form-item>
        <el-form-item class='btnbox'>
          <el-button type='primary' @click='login'>登录</el-button>
          <el-button type='info' @click='reset'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      loginForm:{
        username:'admin',
        password:'123456'
      },
      //表单的验证规则对象
      loginFormRules:{
        //验证用户名是否合法
        username:[
          {required: true, message:'请输入用户名', trigger:'blur'},
          {min:3 ,max:10 , message:'长度在3到10个字符', trigger:'blur'}
        ],
        //验证密码是否合法
        password:[
          {required: true, message:'请输入登录密码', trigger:'blur'},
          {min:6 ,max:15 , message:'长度在6到15个字符', trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    reset(){
      this.$refs.loginForm.resetFields()
    },

    //登录的网络请求
    login(){
      this.$refs.loginForm.validate( valid=>{
        if(!valid) return;
        //axios请求
        this.$http.post('login',this.loginForm).then(res=>{
          const {data} = res
          if(data.meta.status !==200){
            return this.$message.error('登录失败')
          }
          else{
            this.$message.success('登录成功')
            console.log(data.data.token)
            window.sessionStorage.setItem('token',data.data.token)
            this.$router.push('/home')
            
            
          }
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login_container{
  background-color: #2b4b6b;
  height:100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  .avatar{
    height:130px ;
    width:130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding:10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      width:100%;
      height:100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btnbox{
  display: flex;
  justify-content: flex-end;
}
</style>>

