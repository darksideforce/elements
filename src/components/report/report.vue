<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right"> 
      <el-breadcrumb-item :to='{path:"/home"}'>首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <div id='main' style="width:1000px;height:500px;">

      </div>
    </el-card>
  </div>
</template>

<script>
//导入数据可视化工具
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data(){
    return{
      options:{
        title:{
          text:"用户来源"
        },
        //提示框
        tooltip:{
          //坐标轴触发
          trigger:'axis',
          //坐标轴指示器
          axisPointer:{
            //
            type:'cross',
            label:{
              backgroundColor:'#E9EEf3'
            }
          }
        },
        //坐标轴属性
        grid:{
          left:'5%',
          right:'4%',
          bottom:'6%',
          //是否包含坐标轴的刻度标签
          conatainLabel:true
        },
        xAxis:[{
          boundaryGap:false
        }],
        yAxis:[{
          type:'value'
        }]
      },
      //一个echarts数组的复刻
      echarts:{}
    }
  },
  created(){

  },
  async mounted(){
    const {data:res} = await this.$http.get('reports/type/1')
    if(res.meta.status !== 200){
      console.log(res)
      return this.$message.error('获取折线图数据失败')

    }
    //初始化一个echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    const result = _.merge(res.data,this.options)
    this.echarts = result 
    console.log(this.echarts)
    myChart.setOption(result)
  },
  methods:{}
}
</script>

<style>

</style>