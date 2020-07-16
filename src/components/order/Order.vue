<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to='{ path: "/home"}'>首页</el-breadcrumb-item>
      <el-breadcrumb-item >订单管理</el-breadcrumb-item>
      <el-breadcrumb-item >订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot='append' icon='el-icon-search'>  </el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" ></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot='scoped'>
            <el-tag type='success' v-if='scoped.row.pay_status === "1"'>已付款</el-tag>
            <el-tag type='danger' v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot='scoped'>
            {{scoped.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template >
            <el-button size='mini' type='primary' icon="el-icon-edit" @click='changeLocation'></el-button>
            <el-button size='mini' type='success' icon="el-icon-location" @click='showProgress'></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页功能-->
      <el-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange' 
      :current-page="queryInfo.pagenum" :page-sizes="[5,10,15]" :page-size="queryInfo.pagesize"
      layout="total,sizes,prev,pager,next,jumper" :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框-->
    <el-dialog title='修改地址' :visible.sync="addressVisible" 
    width="50%" @close='addressClose'>
      <el-form :model="addressForm" :rules="addressRules" 
      ref="addressFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--物流进度对话框-->
    <el-dialog title='物流进度' :visible.sync="progressVisible" 
    width="50%" >
      <el-timeline>
        <el-timeline-item v-for="(item,index) in progressInfo" :key="index" :timestamp='item.ftime'>
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  data(){
    return{
      //查询对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      //存储所有数据的数组
      orderList:[],
      //总数
      total:0,
      addressVisible:false,
      //地址数据
      addressForm:{
        address1:[],
        address2:''
      },
      //地址验证规则
      addressRules:{
        address1:[{
          required:true,message:'请选择省市县',trigger:'blur'
        }],
        address2:[{
          required:true,message:'请填写详细地址',trigger:'blur'
        }],
      },
      //存储了城市的数据
      cityData:cityData,
      progressVisible:false,
      //存储了物流信息的数据
      progressInfo:[]
    }
  },
  created(){ 
    this.getorderList()
  },
  methods:{
    async getorderList(){
      const{data:res} = await this.$http.get(`orders`,{
        params:this.queryInfo
      })
      if(res.meta.status !== 200){
        return this.$message.error('获取列表失败！')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    //每页页数改变时触发的事件
    handleSizeChange(newsize){
      this.queryInfo.pagesize = newsize
      this.getorderList()
    },
    //改变页码时出发点的时间
    handleCurrentChange(newpage){
      this.queryInfo.pagenum = newpage
      this.getorderList()
    },
    //修改地址对话框
    changeLocation(){
      this.addressVisible = true
    },
    //修改地址对话框关闭时的操作。清空数组
    addressClose(){
      this.$refs.addressFormRef.resetFields()
    },
    async showProgress(){
      const {data:res} = await this.$http.get('/kuaidi/804909574412544580')
      if(res.meta.status !== 200){
        return this.$message.error('请求物流信息失败')
      }
      this.progressInfo = res.data
      console.log(this.progressInfo)
      this.progressVisible = true
    }
  }
}
</script>

<style lang='less' scoped>
.el-cascader{
  width: 100%;
}
</style>