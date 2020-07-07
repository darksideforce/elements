<template>
  <div>
    <el-button type='info' @click='back'>
      退出
    </el-button>
  </div>
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

<style>

</style>