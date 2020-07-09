<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right"> 
        <el-breadcrumb-item :to='{path:"/home"}'>首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--添加角色列表按钮-->
      <el-row>
        <el-col>
          <el-button type='primary' @click='dialogVisible=true'>添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data='rolelist' border stripe>
        <!--展开列-->
        <el-table-column type='expand'>
          <template v-slot='scoped'>
            <el-row v-for='(item1,li) in scoped.row.children' :key='item1.id'
              :class="['bdbottom',li === 0?'bdtop':'','vcenter']"
            >
              <!--一级权限-->
              <el-col :span='5'>
                <el-tag
                closable @close='removeRightById(scoped.row,item1.id)'
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二级权限-->
              <el-col :span='19' >  
                  <el-row v-for="(item2,i2) in item1.children" :key='item2.id'
                    :class="[i2 === 0?'':'bdtop','vcenter']"
                  >
                    <el-col :span='6'>
                      <el-tag type='success'
                      closable @close='removeRightById(scoped.row,item2.id)'
                      >{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col >
                    <el-col :span='18'>
                      <el-tag type='warning' v-for="(item3) in item2.children" :key='item3.id' closable @close='removeRightById(scoped.row,item3.id)'>
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type='index'> </el-table-column>
        <el-table-column label='角色名称' prop='roleName'> </el-table-column>
        <el-table-column label='角色描述' prop='roleDesc'> </el-table-column>
        <el-table-column label='操作' width='300px'> 
          <template v-slot='scoped'>
            <el-button size='mini' type='primary' icon='el-icon-edit'  @click='editopen(scoped.row.id)'>编辑</el-button>
            <el-button size='mini' type='danger' icon='el-icon-delete' @click='deleteRole(scoped.row.id)'>删除</el-button>
            <el-button size='mini' type='warning' icon='el-icon-setting' @click='showSetRightDialog(scoped.row)'>分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close = 'addDialogClosed'
      >
      <!--内容主体区-->
      <el-form :model="addForm"  ref='addFormRef' lable-width='70px'>
        <el-form-item label='角色名称' >
          <el-input v-model='addForm.roleName' ></el-input>
        </el-form-item>
        <el-form-item label='角色描述' >
          <el-input v-model='addForm.roleDesc' ></el-input>
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
      <el-form :model='editForm' 
      ref='editFormRef'
      lable-width='70px'>
        <el-form-item label='角色名称' >
          <el-input v-model='editForm.roleName' ></el-input>
        </el-form-item>
        <el-form-item label='角色描述' >
          <el-input v-model='editForm.roleDesc' ></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click='editdialogVisible=false'>取 消</el-button>
        <el-button @click='editUserInfo'>确 定</el-button>
      </span>
    </el-dialog>
    <!--修改权限的对话框--> 
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialog"
      width="50%"
      @close='setRightDialogClosed'
      >
      <!--内容主体区-->
      <el-tree :data='rightList' :props='treeProps' show-checkbox
      node-key='id' default-expand-all :default-checked-keys="defKeys"
      ref='treeRef'
      >
      </el-tree>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click='setRightDialog=false'>取 消</el-button>
        <el-button @click='allotRights'>确 定</el-button>
      </span>
    </el-dialog> 
  </div>
  
</template>

<script>
export default {
  data(){
    return{
      //所有角色列表数据
      rolelist:[],
      //控制添加用户对话框的显示
      dialogVisible:false,
      //控制修改用户对话框的显示
      editdialogVisible:false,
      //添加用户时的本地对象
      addForm:{
        roleName:'',
        roleDesc:''
      },
      //修改用户时的本地对象
      editForm:{
      },
      //修改权限对话框的控制
      setRightDialog:false,
      //收集所有的权限id
      rightList:[],
      //树模式的匹配范本
      treeProps:{
        label:'authName',
        children:'children'
      },
      //保存默认选中状态的数组
      defKeys:[],
      //保存修改用户权限时的ID,储存在本地
      roleID:'',
    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    //请求用户列表数据
    async getRolesList(){
      const {data} = await this.$http.get('roles')
      if(data.meta.status !== 200){
        return this.$message.error('获取权限列表失败')
      }
      this.rolelist = data.data
    },
    //关闭时调用的函数
    addDialogClosed(){
      this.getRolesList()
    },
    //添加新用户时的调用事件
    addUser(){
      this.$refs.addFormRef.validate(valid=>{
        if(!valid){
            return this.$message.error('用户信息请填写完整')
        }
        console.log(this.addForm)
        this.$http.post('roles',this.addForm).then(res=>{
            const {data} = res
            if(data.meta.status !== 201){
              this.$message.error('没注册成功')
            }
            if(data.meta.status ==201){
              this.$message.success('添加成功')
            this.dialogVisible = false
            this.getRolesList()
            }
          })
      })
    },
    async editopen(id){
      const {data} = await this.$http.get('roles/'+id)
      console.log(data)
      this.editForm = data.data
      console.log(this.editForm)
      //请求完毕后打开对话框
      this.editdialogVisible=true;
    },
    //确认修改用户，并发起请求的事件
    editUserInfo(id){
      this.$refs.editFormRef.validate(valid=>{
        if(!valid){
          return this.$message.error('请填写好信息')
        }
        this.$http.put('roles/'+this.editForm.roleId,{roleName:this.editForm.roleName,roleDesc:this.editForm.roleDesc}).then(res=>{
          const {data} = res
          console.log(data)
          if(data.meta.status !== 200){
            return this.$message.error('请求失败')
          }
          this.editdialogVisible = false;
          this.getRolesList()
          return this.$message.success('更新用户信息成功')
        })
      })
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    //删除用户的请求和操作
    async deleteRole(id){
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
        const {data} = await this.$http.delete('roles/' +id)
        if(data.meta.status !== 200){
          return this.$message.error('没有删除成功')
        }
        this.getRolesList()
        return this.$message.success('删除成功')
      }
    },
    //移除角色权限的操作
    async removeRightById(role,rightId){
      const confirmResult = await this.$confirm(
        '此操作将永久移除本权限，是否继续？',
        '提示',
        {
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }
      ).catch(err=>err)
      if(confirmResult !== 'confirm'){
        return this.$message.info('取消了删除')
      }
      const {data}= await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(data.meta.status !== 200){
        return this.$message.info('删除失败')
      }
      if(data.meta.status == 200){
        role.children = data.data
        //活用请求数据后的返回值，动态的更新页面
      }
    },
    //点击打开分配权限的对话框
    async showSetRightDialog(role){ 
      console.log(role)
      this.roleID = role.id
      //以树状结构请求数据
      const{data} = await this.$http.get('rights/tree')
      if(data.meta.status !== 200){
        return this.$message.info('请求失败')
      }
      //把获取到的权限数据保存到data中
      this.rightList = data.data
      this.getleafKeys(role,this.defKeys)
      this.setRightDialog = true
    },
    //通过递归的形式来获取角色下所有三级权限的ID，并保存到defKeys数组中
    getleafKeys(node,arr){
      //如果当前 node 节点不包含children属性，则是三级节点。进而把id存入数组中
      if(!node.children){
        return arr.push(node.id)
      }
      //再次调用自身，形成递归
      node.children.forEach((item)=>{
        this.getleafKeys(item,arr)
      })
    },
    //关闭时清空id数组
    setRightDialogClosed(){
      this.defKeys = []
    },
    //确认修改权限后的请求。
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idstr = keys.join(',')
      const{data} = await this.$http.post(`roles/${this.roleID}/rights`,{rids:idstr})
      if(data.meta.status !== 200){
        return this.$message.error(data.meta.msg)
      }
      this.getRolesList()
      this.setRightDialog = false
      return this.$message.success(data.meta.msg)
    }
  }
}
</script>

<style lang='less' scoped>
.el-tag{
  margin:7px;
}
.bdtop{
  border-top:1px solid #eee;
}
.bdbottom{
  border-bottom:1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>