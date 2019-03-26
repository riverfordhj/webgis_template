<template>
<div id="main">
  <div id="video">
  <video muted="muted"  autoplay preload loop="loop">
    <source src="../../assets/video/earth.mp4" type="video/mp4">
    您的浏览器不支持 HTML5 video 标签。
  </video>
</div>
<el-card id="form">
  <el-form>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">云南市水利勘测设计数据集成管理平台</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password" id="pwd">
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="密码"
          @keyup.enter.native="handleLogin" />
      </el-form-item>
      <!-- <el-form-item>
        
      </el-form-item> -->
      <el-form-item>
        <el-checkbox v-model="checked">记住密码</el-checkbox>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </el-form>
</el-card>
</div>


</template>

<script>
import { isvalidUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined,
      checked: true
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {
    this.getCookie();
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      const self = this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then(() => {
              if (self.checked == true) {
                debugger;
                //传入账号名，密码，和保存天数3个参数
                self.setCookie(self.loginForm.username, self.loginForm.password, 7);
              }else {
                //清空Cookie
                self.clearCookie();
              }
              this.loading = false;
              this.$router.push({ path: "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie =
        "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
    },
    //读取cookie
    getCookie: function() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("="); //再次切割
          //判断查找相对应的值
          if (arr2[0] == "userName") {
            this.loginForm.username = arr2[1]; //保存到保存数据的地方
          } else if (arr2[0] == "userPwd") {
            this.loginForm.password = arr2[1];
          }
        }
      }
    },
    //清除cookie
    clearCookie: function() {
      this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
    },
  }
};
</script>

<style scoped>
html,
body,
#main,
#video,
video {
  width: 100%;
  height: 100%;
  object-fit: fill;
  overflow: hidden;
}

#main {
  position: relative;
}

#form {
  position: absolute;
  right: 50px;
  top: 25%;
  width: 400px;
 
}

.title
{
 text-align: center;
}

#pwd{
  margin-bottom: 5px;
}
</style>


