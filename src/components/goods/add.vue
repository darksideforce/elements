<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to='{ path: "/home"}'>首页</el-breadcrumb-item>
      <el-breadcrumb-item >商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to='{ path:"/goods"}'>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item >添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--警告提示-->
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <el-steps :space='200' :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title='基本信息'></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--tab栏区域-->
      <el-form :model="addForm" :rules="addFormRules"
       ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'"  v-model='activeIndex'
          :before-leave='beforeTabLeave' @tab-click='tabClicked'>
          <!--设置常规的商品数据-->
          <el-tab-pane label="基本信息" name='0'>
            <el-form-item label="商品名称：" prop='goods_name'>
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格：" prop='goods_price'>
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量：" prop='goods_weight'>
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量：" prop='goods_number'>
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop=''>
              <el-cascader expand-trigger="hover" :options="cateList" 
                  :props="cateProps" @change="handleChange"
                v-model="addForm.goods_cat"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!--设置选择商品的参数-->
          <el-tab-pane label="商品参数" name='1'>
            <!--循环获取表单的item项-->
            <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key='item.attr_id'>
              <el-checkbox-group  v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" 
                :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name='2'>
            <el-form-item :label="item.attr_name" v-for='item in onlyTableData' :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name='3'>
            <el-upload
              class="upload-demo"
              :action='uploadURL'
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture" :headers="headerObj" :on-success="handlesuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name='4' >
            <quill-editor v-model='addForm.goods_introduce'>
            </quill-editor>
            <el-button type="primary" class='btnAdd' @click='add'>添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览框-->
    <el-dialog title="图片预览" :visible.sync='previewVisible' width="70%" >
      <img :src="previewPath" class="previewClass">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data(){
    return{
      activeIndex:0,
      //添加商品的表单数据对象
      addForm:{
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        goods_cat:[],
        //图片的数组
        pics:[],
        //商品详情描述
        goods_introduce:'',
        //储存动态参数和静态参数用
        attrs:[],

      },
      //添加商品的表单验证规则对象
      addFormRules:{
        goods_name:[
        {required:true,message:'请输入商品名称',trigger:'blur'}
        ],goods_price:[
        {required:true,message:'请输入商品价格',trigger:'blur'}
        ],goods_weight:[
        {required:true,message:'请输入商品重量',trigger:'blur'}
        ],goods_number:[
        {required:true,message:'请输入商品数量',trigger:'blur'}
        ],goods_cat:[
          {required:true,message:'请选择分类',trigger:'blur'}
        ]
      },
      //存放当前分类数据
      cateList:[],
      //cascade规则
      cateProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
      },
      //存储动态参数列表数据
      manyTabData:[],
      //存储静态参数列表数据
      onlyTableData:[],
      //图片上传到的后台地址
      uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      //储存要大图预览的图片URL
      previewPath:[],
      previewVisible:false,
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    async getCateList(){
      const {data:res} = await this.$http.get(`categories`)
      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类数据失败')
      }
      this.cateList = res.data
      console.log(this.cateList)
    },
    //级联选择器选中项变化时触发的函数
    handleChange(){
      
    },
    //钩子函数
    beforeTabLeave(activeName,oldName){
      if(oldName === '0' && this.addForm.goods_cat.length !== 3){
        this.$message.error('请选择商品分类')
        return false
      }
    },
    //标签页被点击时，根据填写的商品分类来请求商品参数(默认是动态参数)
    async tabClicked(){
      //请求动态参数
      if(this.activeIndex === '1'){
        const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'many'}
        })
        if(res.meta.status !== 200){
          return this.$message.error('获取动态参数列表失败')
        }
        res.data.forEach(item=>{
          item.attr_vals = item.attr_vals.length === 0?[]:item.attr_vals.split(',')
        })
        console.log(res)
        this.manyTabData = res.data
      }
      //请求静态参数
      else if(this.activeIndex === '2'){
        const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'only'}
        })
        if(res.meta.status !== 200){
          return this.$message.error('获取静态列表失败')
        }
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    //预览事件
    handlePreview(file){
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    //移除图片时触发的事件
    handleRemove(file){
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x=>{
          x.pic === filePath
        }
      )
      this.addForm.pics.splice(i,1)

    },
    //成功上传后的事件
    handlesuccess(response){
      const picInfo = {pic:response.data.tmp_path}
      this.addForm.pics.push(picInfo)
    },
    //点击确认添加商品后的函数
    add(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error('请填写必要的表单')
        }
        //使用深拷贝来拷贝出一份用于提交给服务器的数据
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        //接下来对数组做处理
        this.manyTabData.forEach(item=>{
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join('')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item=>{
          const oldInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addForm.attrs.push(oldInfo)
        })
        form.attrs = this.addForm.attrs
        const{data:res} = await this.$http.post(`goods`,form)
        if(res.meta.status !== 201){
          console.log(res)
          return this.$message.error(res.meta.status)
          this.addForm.attrs = []
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }

  },
  computed:{
    cateId(){
      if(this.addForm.goods_cat.length === 3){
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
.el-checkbox{
  margin: 0 10px 0 0  !important;
}
.previewClass{
  width: 100%;
}
.btnAdd{
  margin-top: 20px;
}
</style>