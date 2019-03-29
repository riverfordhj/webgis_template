<template>
  <el-card class="card">
    <el-form class="form" ref="findPwdForm" :model="findPwdForm" :rules="createRules" label-position="left">
      <div class="title-container">
        <h3 class="title">找回密码</h3>
      </div>
      <el-form-item prop="email">
        <el-input v-model="findPwdForm.email" type="text" auto-complete="on" style="" placeholder="请输入邮箱"/>
      </el-form-item>  
      <el-form-item prop="checkcode">
        <el-input v-model="findPwdForm.checkcode" type="text" auto-complete="on" style="" placeholder="请输入验证码"/>
      </el-form-item>  
      <el-form-item>
        <div class="identifybox">
          <div>
            <check-code :identifyCode="identifyCode" :contentWidth="170" />
          </div>
          <el-button @click="refreshCode" type='text' class="textbtn">看不清，换一张</el-button>
        </div>
      </el-form-item> 
      <el-form-item>
        <el-button type="primary" @click="confirm" style="width:100%;">确认</el-button>
      </el-form-item>  
    </el-form>
  </el-card>
</template>

<script>
  import CheckCode from '@/components/CheckCode';

  

  export default {
    name: '',
    data() {
      const validateVerifycode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        } else if (value !== this.identifyCode) {
          console.log('validateVerifycode:', value)
          callback(new Error('验证码不正确!'))
        } else {
          callback()
        }
      };

      return {
        identifyCodes: '1234567890',       
        identifyCode: '',       
        findPwdForm:{
          email:'',
          checkcode:undefined
        },    
        createRules: {
          email: [
            { required: true, message: "邮箱不能为空", trigger: "blur" },
            { type: 'email', message: "请输出正确的邮箱", trigger: "blur" }
          ],
          checkcode: [
            { required: true, trigger: 'blur', validator: validateVerifycode }
          ]
        }
      }
    },
    components:{
      CheckCode
    },
    mounted() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    methods:{
      confirm(){
        this.$refs.findPwdForm.validate(valid => {
          if (valid) {
            console.log("申请修改");
          }
        })
        
      },
      refreshCode() {
        this.identifyCode = ''
        this.makeCode(this.identifyCodes, 4)
      },
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
            this.randomNum(0, this.identifyCodes.length)
          ]
        }
      }
    }
  }
</script>

<style scoped>
  .card {
    height: 400px;
    width: 400px;
    margin: 0 auto;
    top: 50%;
    transform: translateY(+20%);
  }

  .form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 0 auto;
    top: 0;
  }
  .title {
    font-size: 25px;
    color: gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .identifybox{
    display: flex;
    justify-content: space-between;
    margin-top:7px;
  }
  .iconstyle{
    color:#409EFF;
  }
</style>