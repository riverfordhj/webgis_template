<template>
  <el-card class="userCard">
    <el-form class="form" ref="userForm" :model="userForm" :rules="createRules" label-width="100px" label-position="left">
      <div class="title-container">
        <h3 class="title">创建用户</h3>
      </div>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username" type="text" auto-complete="on" style="" placeholder="请输入用户名"/>
      </el-form-item>  
      <el-form-item label="输入密码" prop="password">
        <el-input :type="passwordType" v-model="userForm.password" auto-complete="on" style="" placeholder="请输入密码"  />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPsd">
        <el-input :type="passwordType" v-model="userForm.confirmPsd" auto-complete="on" style="" placeholder="请确认密码"/>
      </el-form-item>
      <el-form-item label="用户组" prop="roles">
        <el-select style="width:100%" v-model="userForm.roles" multiple placeholder="请选择">
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>       
      <el-form-item>       
        <el-button type="warning" @click="clear" >清空信息</el-button>
        <el-button type="primary" @click="lazyCreate" :loading="loading" >创建用户</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { createUser } from "@/api/user";
import { throttle } from "@/utils/index";

export default {
  name: "",
  data() {
    const validateConfirmPsd = (rule, value, callback) => {
      if (value != this.userForm.password) {
        callback(new Error("密码不一致！"));
      } else {
        callback();
      }
    };
    return {
      userForm: {
        username: "",
        password: "",
        confirmPsd: "",
        roles: []
      },
      roleOptions: [
        {
          value: "0",
          label: "管理员"
        },
        {
          value: "1",
          label: "数据管理员"
        },
        {
          value: "2",
          label: "数据查询员"
        }
      ],
      district: false,
      createRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, message: "长度大于6个字符", trigger: "blur" }
        ],
        confirmPsd: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateConfirmPsd }
        ],
        roles: [{ required: true, trigger: "change", message: "角色不能为空" }]
      },
      passwordType: "password",
      loading: false,
      lazyCreateObj:throttle(this.create, 5000)
    };
  },
  methods: {
    clear() {
      this.userForm = {
        username: "",
        password: "",
        confirmPsd: "",
        roles: [],       
      };
    },
    create() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let roles = this.userForm.roles.reduce((total, role) => {
            return total + "," + role;
          });

          var data = {
            LoginName: this.userForm.username,
            Pwd: this.userForm.password,
            roles: roles
          };
          createUser(data)
            .then(res => {
              if (res.status == 200) {
                this.$message({
                  message: "创建成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: "创建失败",
                  type: "error"
                });
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    lazyCreate() {
      this.lazyCreateObj();
    }
  }
};
</script>

<style scoped>
.userCard {
  height: 500px;
  width: 420px;
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
/* .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  } */
</style>