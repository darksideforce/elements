<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right"> 
      <el-breadcrumb-item :to='{path:"/home"}'>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span='8'>
          <el-input placeholder="请输入内容" 
          v-model='queryinfo.query'
          clearable
          @clear ='getUserList'
          >
            <el-button slot="append" icon='el-icon-search' @click='getUserList'> 
            </el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type="primary" @click='dialogVisible=true'>添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data='userlist' border stripe> 
        <el-table-column label='姓名' prop='username'></el-table-column>
        <el-table-column label='邮箱' prop='email'></el-table-column>
        <el-table-column label='电话' prop='mobile'></el-table-column>
        <el-table-column label='角色' prop='role_name'></el-table-column>
        <el-table-column label='状态' prop='mg_state' width='200px'>
          <template v-slot='scoped'>
            <el-switch v-model='scoped.row.mg_state' @change='userStateChanged(scoped.row)'></el-switch>
          </template>
        </el-table-column>
        <el-table-column label='操作' >
          <template v-slot='scoped'>
            <!--更改按钮-->
            <el-button type='primary' icon='el-icon-edit' size='mini'
              @click='showEditDialog(scoped.row.id)'
            ></el-button>
            <!--删除按钮-->
            <el-button type='danger' icon='el-icon-delete' size='mini' @click='reomoveUserById(scoped.row.id)'></el-button>
            <!--分配角色按钮-->
            <el-tooltip effect='dark' content='分配角色' placement='top' :enterable="false" >
            <el-button type='warning' icon='el-icon-setting' size='mini' @click='distributeRole(scoped.row)'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区-->
      <el-pagination @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total='total'>
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close = 'addDialogClosed'
      >
      <!--内容主体区-->
      <el-form :model="addForm" :rules='addFormRules' ref='addFormRef' lable-width='70px'>
          <el-form-item label="用户名" prop="username">
            <el-input v-model='addForm.username'></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model='addForm.password'></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model='addForm.email'></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model='addForm.mobile'></el-input>
          </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click='dialogVisible=false'>取 消</el-button>
        <el-button @click='addUser' type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisible"
      width="50%"
      @close='editDialogClosed'
      >
      <!--内容主体区-->
      <el-form :model='editForm' :rules='editFormRules'
      ref='editFormRef'
      lable-width='70px'>
        <el-form-item label='用户名'>
          <el-input v-model='editForm.username' disabled></el-input>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input v-model='editForm.email' ></el-input>
        </el-form-item>
        <el-form-item label='手机号码' prop='mobile'>
          <el-input v-model='editForm.mobile' ></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click='editdialogVisible=false'>取 消</el-button>
        <el-button @click='editUserInfo'>确 定</el-button>
      </span>
    </el-dialog>
    <!--分配角色的对话框-->
    <el-dialog
      title="分配角色"
      :visible.sync="distributeRoledialog"
      width="50%"
      >
      <!--内容主体区-->
      <div>
        <p>当前的用户：{{distribute.username}}</p>
        <p>当前的角色名：{{distribute.role_name}}</p>
        <p>分配新角色
          <el-select v-model='selectedRoleId' placeholder="请选择">
            <el-option v-for='item in roleList' :key='item.id' :label='item.roleName' :value='item.id'>
            </el-option>
          </el-select>
        </p>
      </div>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click='distributeRoledialog=false'>取 消</el-button>
        <el-button @click='rolechoosen'>确 定</el-button>
      </span>
    </el-dialog>   
  </div>
</template>

<script>
export default {
  data(){
    // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }

    return{
      //请求用户信息列表时的params
      queryinfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      userlist:[],
      total:0,
      //控制用户对话框的隐藏和显示
      dialogVisible:false,
      //控制修改用户对话框的隐藏和显示
      editdialogVisible:false,
      //添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:"",
        mobild:'',
      },
      //添加表单的验证规则对象
      addFormRules:{
        username:[{required:true,message:'请输入用户名',trigger:'blur'},
        { min:3,max:10,message:'用户的长度在3~10个字符之间',trigger:'blur'}
        ],
        password:[{required:true,message:'请输入密码',trigger:'blur'},
        { min:6,max:15,message:'密码的长度在6-15个字符之间',trigger:'blur'}
        ],
        email:[{required:true,message:'请输入邮箱',trigger:'blur'},
        {validator:checkEmail,trigger:'blur'}],
        mobile:[{required:true,message:'请输入手机号',trigger:'blur'},
        {validator:checkMobile,trigger:'blur'}
        ],
      },
      editFormRules:{
        email:[{required:true,message:'请输入邮箱',trigger:'blur'},
        {validator:checkEmail,trigger:'blur'}],
        mobile:[{required:true,message:'请输入手机号',trigger:'blur'},
        {validator:checkMobile,trigger:'blur'}
        ]
      },
      //修改用户信息时，暂存在本地的用户信息数据
      editForm:{},
      //控制分配角色对话框的开关
      distributeRoledialog:false,
      //储存一下分配角色对话框中的数据
      distribute:{},
      //储存一下请求到的总角色列表
      roleList:[],
      //储存选择分配好的角色列表
      selectedRoleId:''
    }
  }
  ,
  created(){
    this.getUserList()
  },
  methods:{
    //请求用户列表的数据
    async getUserList(){
      const {data} = await this.$http.get('users',{params:this.queryinfo})
      this.userlist = data.data.users
      this.total = data.data.total
    },
    //列表自带的事件 用户更改每页数据
    handleSizeChange(val){
      this.queryinfo.pagesize = val;
      this.getUserList()
    },
    //列表自带的事件，用于更改页码
    handleCurrentChange(val){
      this.queryinfo.pagenum = val
      this.getUserList()
    },
    //发起网络请求
    async userStateChanged(userinfo){
      const {data} = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(data)
      if(data.meta.status !== 200){
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    //关闭时重置form表单
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //添加用户事件
    addUser(){
      this.$refs.addFormRef.validate(valid=>{
        if(!valid){
            return this.$message.error('报错了')
        }
        this.$http.post('users',this.addForm).then(res=>{
            const {data} = res
            if(data.meta.status !== 201){
              this.$message.error('没注册成功')
            }
            this.$message.success('添加成功')
            this.dialogVisible = false
            this.getUserList()
          })
      })
    },
    //根据id来请求对应数据
    async showEditDialog(id){
      //通过v-slot获取组件内的值
      const {data} = await this.$http.get('users/'+id)
      this.editForm = data.data
      //请求完毕后打开对话框
      this.editdialogVisible=true;
      
    },
    //重置更改用户信息对话框内的数据
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息的请求操作
    editUserInfo(){
      this.$refs.editFormRef.validate(valid=>{
        if(!valid){
          return this.$message.error('请填写好信息')
        }
        this.$http.put('users/'+ this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile}).then(res=>{
          const{data} = res
          if(data.meta.status !== 200){
            return this.$message.error('请求失败')
          }
          this.editdialogVisible = false;
          this.getUserList()
          return this.$message.success('更新用户信息成功')
        })
      })
    },
    //根据id进行删除
    async reomoveUserById(id){
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
        const {data} = await this.$http.delete('users/' +id)
        if(data.meta.status !== 200){
          return this.$message.error('没有删除成功')
        }
        this.getUserList()
        return this.$message.success('删除成功')
      }
    },
    async distributeRole(userinfo){
      this.distribute = userinfo
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.distributeRoledialog = true
      this.roleList = res.data 
    },
    async rolechoosen(){
      if(!this.selectedRoleId){
        return this.$message.error('请选择角色')
      }
      const {data:res} = await this.$http.put(`users/${this.distribute.id}/role`,{rid:this.selectedRoleId})
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.getUserList()
      this.distributeRoledialog = false
      return this.$message.success(res.meta.msg)
    }

  }
}
</script>

<style lang='less' scoped>


</style>