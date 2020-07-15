<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to='{ path: "/home"}'>首页</el-breadcrumb-item>
      <el-breadcrumb-item >商品管理</el-breadcrumb-item>
      <el-breadcrumb-item >商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span='8'>
          <el-input placeholder="请输入内容" 
          v-model='queryInfo.query' clearable
          @clear="searchGoods">
            <el-button slot='append' icon='el-icon-search' @click='searchGoods'></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type='primary' @click='goAdd'>添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data='goodsList' border stripe>
        <el-table-column type='index' ></el-table-column>
        <el-table-column label='商品名称' prop='goods_name'> </el-table-column>
        <el-table-column label='商品价格' prop='goods_price' width="90px"> </el-table-column>
        <el-table-column label='商品重量' prop='goods_weight' width="70px"> </el-table-column>
        <el-table-column label='创建时间' prop='add_time' width="140px"> 
          <template v-slot='scope'>
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        
        <el-table-column label='操作'  width="130px"> 
          <template v-slot='scope'>
            <el-button type='primary' icon='el-icon-edit' size='mini' @click='editGoods(scope.row)'></el-button>
            <el-button type='danger' icon='el-icon-delete' size='mini' @click='removeGoods(scope.row.goods_id)'></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 7, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      //商品列表
      goodsList:[],
      //总页数
      total:0,
    }
  },
  created(){
    this.getGoodsList()
  },
  methods:{
    //根据分页获取对应的商品列表
    async getGoodsList(){
      const{data:res} = await this.$http.get(`goods`,{
        params:this.queryInfo
      })
      if(res.meta.status !== 200){
        return this.$message.error('请求失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
      return this.$message.success('请求成功')
    },
    //改变页码时的请求数据
    handleSizeChange(newsize){
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    //改变页数时的请求数据
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    //搜索数据
    searchGoods(){
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    //移除数据
    async removeGoods(id){
      const confirmResult = await this.$confirm(
        '此操作将永久移除本商品，是否继续？',
        '提示',
        {
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }
      ).catch(err=>err)
      if(confirmResult !== 'confirm'){
        return this.$message.info('已经取消删除')
      }
      const {data:res} = await this.$http.delete(`goods/${id}`)
      if(res.meta.status !== 200){
        return this.$message.error('删除失败')
      }
      this.getGoodsList()
      return this.$message.success('删除成功')
    },
    //点击进行跳转
    goAdd(){
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style>

</style>