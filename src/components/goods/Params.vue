<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to='{ path: "/home"}'>首页</el-breadcrumb-item>
      <el-breadcrumb-item >商品管理</el-breadcrumb-item>
      <el-breadcrumb-item >参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数!" type='warning' :closable="false" show-icon>
      </el-alert>
      <el-row class='cat_opt'>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader  :options="cateList"
          :props='cateProps' v-model='selectCateKeys' @change='handleChange'></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click='tabpaneClick'>
        <el-tab-pane label='动态参数' name='many'>
          <el-button type='primary'
          size='mini' :disabled="isBtnDisabled"
          @click='addDialog=true'
          >添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data='manyTabData' border stripe>
            <!--展开列 -->
            <el-table-column type='expand'>
              <template v-slot='scope'> 
                  <el-tag v-for="(item , i ) in scope.row.attr_vals" 
                  :key="i" closable
                  @close='handleClose(i,scope.row)'>
                    {{item}}
                  </el-tag>
                  <!--输入的文本框-->
                  <el-input class='input-new-tag' v-if='scope.row.inputvisible' v-model='scope.row.inputValue' 
                  ref='saveTaginput' size="small" 
                  @keyup.enter.native='handleInputConfirm(scope.row)'
                  @blur='handleInputConfirm(scope.row)'
                  > 
                  </el-input>
                  <el-button class='button-new-tag' v-else size='small' @click='showinput(scope.row)'>
                  + new Tag
                  </el-button>
              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type='index'></el-table-column>
            <el-table-column label='参数名称' prop='attr_name'></el-table-column>
            <el-table-column label='操作' >
              <template v-slot='scoped'>
                <el-button size='mini' type='primary' 
                icon='el-icon-edit' @click='showEditdialog(scoped.row.attr_id)'> </el-button>
                <el-button size='mini' type='danger' icon='el-icon-delete' @click='removeProperty(scoped.row.attr_id)'> </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label='静态属性' name='only'>
          <el-button type='primary' size='mini' 
          :disabled="isBtnDisabled" @click='addDialog=true'>添加属性</el-button>
          <!--静态属性表格-->
          <el-table :data='onlyTabData' border stripe>
            
            <!--展开列 -->
            <el-table-column type='expand'>
              <template v-slot='scope'> 
                  <el-tag v-for="(item , i ) in scope.row.attr_vals" :key="i" closable
                  @close='handleClose(i,scope.row)'
                  >
                    {{item}}
                  </el-tag>
                  <!--输入的文本框-->
                  <el-input class='input-new-tag' v-if='scope.row.inputvisible' v-model='scope.row.inputValue' 
                  ref='saveTaginput' size="small" 
                  @keyup.enter.native='handleInputConfirm(scope.row)'
                  @blur='handleInputConfirm(scope.row)'
                  > 
                  </el-input>
                  <el-button class='button-new-tag' v-else size='small' @click='showinput(scope.row)'>
                   + new Tag
                  </el-button>
              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type='index'></el-table-column>
            <el-table-column label='属性名称' prop='attr_name'></el-table-column>
            <el-table-column label='操作' >
              <template v-slot='scoped'>
                <el-button size='mini' type='primary' 
                icon='el-icon-edit' @click='showEditdialog(scoped.row.attr_id)'> </el-button>
                <el-button size='mini' type='danger' icon='el-icon-delete' @click='removeProperty(scoped.row.attr_id)'> </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialog"
      width="50%"
      @close='addDialogClosed'
      >
      <el-form :model='addForm' :rules='addFormRules' 
      ref='addFormRef' label-widt='100px'
      
      >
        <el-form-item :label='titleText' prop='attr_name'>
            <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click='addDialog=false'>取 消</el-button>
        <el-button @click='addParams'>确 定</el-button>
      </span>
    </el-dialog>
    <!--修改属性和参数的对话框-->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialog"
      width="50%"
      @close='editDialogClosed'
      >
      <el-form :model='editForm' :rules='editFormRules' 
      ref='editFormRef' label-widt='100px'
      >
        <el-form-item :label='titleText' prop='attr_name'>
            <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click='editDialog=false'>取 消</el-button>
        <el-button @click='editParams'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      //储存用数组
      cateList:[],
      //cascader的config
      cateProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger:"hover"
      },
      //储存级联选择器的选择
      selectCateKeys:[],
      //储存选择了哪个标签页
      activeName:'many',
      //储存对应标签页的数据
      manyTabData:[],
      onlyTabData:[],
      //控制对话框的开启与否
      addDialog:false,
      addForm:{},
      addFormRules:{
        attr_name:[{
          required:true,message:"请输入参数名称",trigger:'blur'
        }]
      },
      //控制修改属性对话框的开关
      editDialog:false,
      //修改属性储存的属性
      editForm:{},
      //修改属性表单的验证推向
      editFormRules:{
        attr_name:[{
          required:true,message:"请输入参数名称",trigger:'blur'
        }]
      },
    }
  },
  created(){
    this.getcateList()
  },
  computed:{
    //控制按钮是否可以点击的布尔值
    isBtnDisabled(){
      if(this.selectCateKeys.length !== 3){
        return true
      }
      return false
    },
    //当前选中的三级id
    cateId(){
      if(this.selectCateKeys.length === 3){
        return this.selectCateKeys[2]
      }
      return null
    },
    titleText(){
      if(this.activeName === 'many'){
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods:{
    async getcateList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status !== 200 ){
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
    },
    //选择商品分类时，发送请求
    handleChange(){
      this.getParamsData()
    },
    
    tabpaneClick(){
      this.getParamsData()
    },
    //请求所有分类属性的数据，进行判断并分类储存
    async getParamsData(){
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
        params:{sel:this.activeName}
      })
      if(res.meta.status !== 200 ){
        return this.$message.error('请先选择分类')
      }
      res.data.forEach(item =>{
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputvisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      //判断当前选择的是哪个标签页
      if(this.activeName === 'many'){
        this.manyTabData = res.data
      }
      if(this.activeName === 'only'){
        this.onlyTabData = res.data
      }
    },
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //进行请求添加属性的操作
    addParams(){
      this.$refs.addFormRef.validate( async valid=>{
        if(!valid){
          return 
        }
        const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName
        })
        if(res.meta.status !== 201){
          return this.$message.error('未能添加成功')
        }
        this.$message.success('添加成功')
        this.addDialog = false
        this.getParamsData()
      })
    },
    //展开修改属性对话框,并查询当前参数的信息
    async showEditdialog(id){
      const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{
        params:{attr_sel:this.activeName}
      })
      if(res.meta.status !== 200){
          return this.$message.error('获取参数信息失败')
        }
      this.editForm = res.data
      console.log(res)
      this.editDialog = true

    },
    //点击确定提交更改以后的请求
    editParams(){
      this.$refs.editFormRef.validate( async valid=>{
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
        {attr_name:this.editForm.attr_name , attr_sel:this.activeName}
        )
        console.log(res)
        if(res.meta.status !== 200){
          return this.$message.error(res.meta.msg)
        }
        this.editForm = res.data
        this.getParamsData()
        this.$message.success('修改成功！')
        this.editDialog = false
      })
    },
    //关闭对话框以后的操作
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    //删除属性操作
    async removeProperty(id){
      console.log(1)
      const confirmResult = await this.$confirm('此操作将永久删除该属性，是否继续？','提示',{
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
        const {data} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
        if(data.meta.status !== 200){
          return this.$message.error('没有删除成功')
        }
        this.getParamsData()
        return this.$message.success('删除成功')
      }
    },
    //点击开始输入框
    async handleInputConfirm(input){
      if(input.inputValue.trim().length === 0){
        input.inputValue = ''
        input.inputvisible = false
        return 
      }
      input.attr_vals.push(input.inputValue.trim())
      input.inputValue = ''
      input.inputvisible = false
      //发送请求。添加新tag
      this.saveAttrVals(input)
    },
    //点击tag切换成输入框以后的触发事件
    showinput(input){
      input.inputvisible = true
      //让文本自动获得焦点
      this.$nextTick(_=>{
        this.$refs.saveTaginput.$refs.input.focus()
      })
    },
    //删除添加的选项卡操作
    handleClose(i,input){
      input.attr_vals.splice(i,1)
      this.saveAttrVals(input)
    },
    //抽离的请求attr_vals的操作
    async saveAttrVals(input){
      const{data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${input.attr_id}`,{
        attr_name:input.attr_name,
        attr_sel:input.attr_sel,
        attr_vals:input.attr_vals.join(' '),
      })
      if(res.meta.status !== 200){
        return this.$message.error('修改参数项失败')
      }
      return this.$message.success('修改参数项成功')
    }
  }

}
</script>

<style lang='less' scoped>
.cat_opt{
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.el-input{
  width:120px
}
</style>