<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to='{ path: "/home"}'>首页</el-breadcrumb-item>
      <el-breadcrumb-item >商品管理</el-breadcrumb-item>
      <el-breadcrumb-item >商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary' @click='showAddDialog'>添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table class='treetable' :data='cateList' :columns='columns' :selection-type='false' :expand-type='false' show-index index-text='#'  border>
        <!--是否有效-->
        <template v-slot:isok='scoped'>
          <i class='el-icon-success'
          v-if='scoped.row.cat_deleted === false'
          ></i>
          <i class='el-icon-error'
          v-else></i>
        </template>
        <!--层级-->
        <template v-slot:order='scoped'>
          <el-tag size='mini'
            v-if='scoped.row.cat_level === 0'
          >一级</el-tag>
          <el-tag type='success' size='mini'
          v-if='scoped.row.cat_level === 1'
          >二级</el-tag>
          <el-tag type='warning' size='mini'
          v-if='scoped.row.cat_level === 2'
          >三级</el-tag>
        </template>
        <template v-slot:opt='scoped'>
          <el-button type='primary' icon='el-icon-edit' size='mini' @click='editGoods(scoped.row)'>编辑</el-button>
          <el-button type='danger' icon='el-icon-delete' size='mini' @click='removeCarrt(scoped.row.cat_id)'>删除</el-button>
        </template>
      </tree-table>
      <!--分页区域-->
      <el-pagination @size-change='handleSizeChange'
      @current-change='handleCurrentChange' 
        :current-page='queryInfo.pagenum' :page-sizes='[3,6,9,12]'
        :page-size="queryInfo.pagesize" layout="total,sizes,prev,pager,next,jumper" :total='total'
    > 

      </el-pagination>
    </el-card> 
    <!--添加分类的对话框-->
    <el-dialog
      title="分配角色"
      :visible.sync="addNewcate"
      width="50%"
      @close = 'addCateDialogClosed'
      >
      <!--内容主体区-->
      <div>
        <el-form :model='addCate' :rules='addCateFormRules'
        ref='addCateForm'
        lable-width='100px'>
          <el-form-item label='分类名称' prop='cat_name'>
            <el-input v-model='addCate.cat_name'></el-input>
          </el-form-item>
          <el-form-item label='父级分类'>
            <el-cascader  :options='parentNodeList'
              :props='cascaderProp' @change='parentCataChanged'
              v-model="selectKeys"
              :clearable="true"
            >

            </el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click='addNewcate=false'>取 消</el-button>
        <el-button @click='addcateButton'>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="setCartDia"
      width="50%"
      >
      <!--内容主体区-->
      <el-form :model="setCat" :rules='setCatForm' ref='setCatForm' lable-width='70px'>
          <el-form-item label="分类名" prop="catname">
            <el-input v-model='setCat.catname'></el-input>
          </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click='setCartDia=false'>取 消</el-button>
        <el-button @click='setCartName' type="primary">确 定</el-button>
      </span>
    </el-dialog>  
  </div>
</template>

<script>
export default {
  data(){
    return{
      //发起请求商品总类时的params
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5,
      },
      //储存所有商品分类的list
      cateList:[],
      //储存商品总量
      total:0,
      //储存树状图的列config
      columns:[
        {
          label:'分类',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          type:'template',
          template:'isok'
        },
        {
          label:'排序',
          type:'template',
          template:'order'
        },
        {
          label:'操作',
          type:'template',
          template:'opt'
        }
      ],
      addNewcate:false,
      //将要添加的分类数据表对象
      addCate:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      //添加分类对象的验证规则对象
      addCateFormRules:{
        cat_name:[
          {required:true,message:'请输入分类名称',trigger:'blur'}
        ]
      },
      setCatForm:{
        catname:[
        {required:true,message:'请输入分类名称',trigger:'blur'}
        ]
      },
      //储存父级分类的数组
      parentNodeList:[],
      //指定级联选择器config  
      cascaderProp:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly:'true',
        expandTrigger:'hover'
      },
      //储存选中的父级元素
      selectKeys:[],
      //修改分类名对话框的开启关闭
      setCartDia:false,
      setCat:{
        cat_id:0,
        catname:'',
      }
    }
  },
  created(){
    this.getCartList()
  },
  methods:{
    //请求所有分类的数据
    async getCartList(){
      const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类失败')
      }
      
      this.cateList = res.data.result
      this.total = res.data.total
    },
    //页码改变时的请求
    handleSizeChange(newsize){
      this.queryInfo.pagesize = newsize
      this.getCartList()
    },
    //监听pagenum改变
    handleCurrentChange(newpgae){
      this.queryInfo.pagenum = newpgae
      this.getCartList()
    },
    //修改时发送
    editGoods(data){
      this.setCat.catname = data.cat_name
      this.setCat.cat_id =data.cat_id
      this.setCartDia = true
    },
    //打开添加分类框
    showAddDialog(){
      this.getParentCateList()
      this.addNewcate = true
    },
    async getParentCateList(){
      const {data:res} = await this.$http.get('categories',{params:{type:2}})
      if(res.meta.status !== 200){
        return this.$message.error('获取父级列表失败')
      }
      this.parentNodeList = res.data
    },
    //为树结构循环值
    parentCataChanged(){
      if(this.selectKeys.length > 0){
        //为选中的id赋值，因为服务器端只需要一项pid和level值即可，所以我们只需要拿到selectkey的最后一项即可
        this.addCate.cat_pid = this.selectKeys[this.selectKeys.length -1]
        this.addCate.cat_level = this.selectKeys.length
        return 0
      }
      //没选中的情况下，进行重置
      else{
        this.addCate.cat_pid = 0
        this.addCate.cat_level = 0
      }
    },
    //关闭提交分类对话框的触发函数
    addCateDialogClosed(){
      //重置
      this.$refs.addCateForm.resetFields()
      this.selectKeys = []
      this.addCate.cat_pid = 0
      this.addCate.cat_level = 0
    },
    addcateButton(){
      this.$refs.addCateForm.validate(async valid => {
        if(!valid) return
        const {data:res} = await this.$http.post('categories',this.addCate)
        if(res.meta.status !== 201){
          return this.$message.error('')
        }
        this.$message.success('添加分类成功')
        this.getCartList()
        this.addNewcate = false
      })
    },
    //根据id进行删除
    async removeCarrt(id){
      //弹框进行删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err=>{
        return err
      })
      //当用户确认删除，返回的是confirm，当用户取消，返回的是cancel。都是字符串格式
      if(confirmResult !=='confirm'){
        return this.$message.info('已经取消删除')
      }
      if(confirmResult == 'confirm'){
        const {data} = await this.$http.delete('categories/' +id)
        if(data.meta.status !== 200){
          return this.$message.error('没有删除成功')
        }
        this.getCartList()
        return this.$message.success('删除成功')
      }
    },
    async setCartName(){
      this.$refs.setCatForm.validate( async valid=>{
        if(!valid){
          return
        }
        const {data:res} = await  await this.$http.put('categories/' + this.setCat.cat_id,{
          cat_name:this.setCat.catname
        })
        if(res.meta.status !== 200){
          return this.$message.error('没有编辑成功')
        }
        this.getCartList()
        this.setCartDia = false
        return this.$message.success('编辑成功')
      })

    }
  }
}
</script>

<style lang='less' scoped>
  .treetable{
    margin-top: 15px;
  }
  .el-cascader{
    width: 100%;
  }
</style>