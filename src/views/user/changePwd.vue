<template>
  <el-card class="psdCard">
    <el-form ref="psdForm" class="form" :model="psdForm" :rules="psdRules" label-width="100px" label-position="left">
      <div class="title-container">
        <h3 class="title">修改密码</h3>
      </div>
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input :type="passwordType" v-model="psdForm.oldPassword" auto-complete="on" style="" placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input :type="passwordType" v-model="psdForm.newPassword" auto-complete="on" style="" placeholder="请输入新密码" />        
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input :type="passwordType" v-model="psdForm.confirmPassword" auto-complete="on" style="" placeholder="请输入新密码" />        
      </el-form-item>
       <el-form-item>       
        <el-button type="warning" @click="clear">清空信息</el-button>
        <el-button type="primary" @click="change" :loading="loading">修改密码</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import { changePsd } from "@/api/user"
  import store from "../../store"

  export default {
    name: '',
    data() {
       const validateConfirmPsd = (rule, value, callback) => {
        if(value != this.psdForm.newPassword){
          callback(new Error('密码不一致！'))       
        }else{
          callback()
        }
      }
      return {
        psdForm:{
          oldPassword:"",
          newPassword:"",
          confirmPassword:""
        },
        psdRules:{
          oldPassword:[
            { required: true, message: '密码不能为空', trigger: 'blur' },  
          ],
          newPassword:[
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, message: '长度大于6个字符', trigger: 'blur' }         
          ],
          confirmPassword:[
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { required: true, trigger: 'blur',validator: validateConfirmPsd}
          ],         
        },
        loading:false,
        passwordType: 'password',
      }
    },
    methods:{
      clear(){
        this.psdForm = {
          oldPassword:"",
          newPassword:"",
          confirmPassword:""
        }
      },
      change(){
        this.$refs.psdForm.validate(valid=>{
          if(valid){
            this.loading = true;
             var data = {
              LoginName:store.getters.name,
              OldPwd:this.psdForm.oldPassword,
              NewPwd:this.psdForm.newPassword,
            }

            changePsd(data).then((result) => {
              if(result.status == 200){
                this.$message({
                  message:"修改成功",                
                  type:"success"
                })
              }else{
                 this.$message({
                  message:"修改失败",                
                  type:"error"
                })
              }
              this.loading = false
            }).catch((err) => {
              this.loading = false;
              console.log(err);
            });
          }else{
            console.log('修改失败!!')
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>
   .psdCard{
    height: 400px;
    width: 420px;
    margin: 0 auto;
    top: 50%;
    transform: translateY(+20%)
  }

  .form{
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 0 auto;
    top: 0
  }
  .title{
    font-size: 25px;
    color:gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
</style>