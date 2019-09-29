<!--
 * @Descripttion: 11
 * @version: 1
 * @Author: KanMing
 * @Date: 2019-09-28 15:54:54
 * @LastEditors: KanMing
 * @LastEditTime: 2019-09-28 20:55:06
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-input v-model="search" size="small" style="width:200px" placeholder="请输入需查询字段" />
      </div>
    </div>
    <div style="width:100%">
      <el-table v-loading="listLoading" :data="datas" border style="width:100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="LoginName" label="用户名" align="center"></el-table-column>
        <el-table-column prop="Gender" label="性别" align="center"></el-table-column>
        <el-table-column prop="Tel" label="电话" align="center"></el-table-column>
        <el-table-column prop="Roles" label="角色" align="center">
          <template slot-scope="{row}">
            <el-tag
              style="margin-right:10px"
              :key="index"
              :type="item | statusFilter"
              v-for="(item,index) in row.Roles"
            >{{item | roleStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="{row}">
            <el-button @click="handleEdit(row)" type="text" size="small">编辑</el-button>
            <el-button type="text" @click="resetPsd(row)" size="small">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <el-form ref="dataForm" :model="temp" :rules="rules" style="width: 100%" size="medium">
        <el-form-item label="用户名" prop="LoginName">
          <el-input v-model="temp.LoginName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="性别" prop="Gender">
          <el-select v-model="temp.Gender" placeholder="性别" style="width:100%">
            <el-option label="男" value="man"></el-option>
            <el-option label="女" value="woman"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="Tel">
          <el-input v-model="temp.Tel" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="角色" prop="Roles">
          <el-select multiple v-model="temp.Roles" placeholder="角色" style="width:100%">
            <el-option label="系统管理员" :value="1"></el-option>
            <el-option label="数据管理员" :value="2"></el-option>
            <el-option label="游客" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="confirmEdit" type="primary">确认修改</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="warnDialogVisible" width="30%">
      <span>确定重置密码？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warnDialogVisible = false">取 消</el-button>
        <el-button type="warning" @click="confirmResetPsd">确认重置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllUser, resetPsd, editUser } from '@/api/user.js'
export default {
  name: '',
  data() {
    var checkTel = (rule, value, callback) => {
      const TelReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      // if (!value) {
      //   return callback(new Error('邮箱不能为空'))
      // }
      setTimeout(() => {
        if (TelReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的电话格式'))
        }
      }, 100)    }
    return {
      search: '',
      listLoading: false,
      tableData: [],
      rules: {
        LoginName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        Tel: [{ validator: checkTel, trigger: "blur" }],
        Roles: [{ required: true, trigger: "blur" }],
      },
      temp: {
        Id: '',
        LoginName: '',
        Tel: '',
        Gender: '',
        Role: []
      },
      dialogVisible: false,
      title: '用户修改',
      warnDialogVisible: false,
      resetId: ''
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'info',
        3: 'warning'
      }
      return statusMap[status]
    },
    roleStatus(status) {
      const statusMap = {
        1: '系统管理员',
        2: '数据管理员',
        3: '游客'
      }
      return statusMap[status]
    }
  },
  computed: {
    datas: function () {
      const search = this.search;
      if (search) {
        return this.tableData.filter(dataNews => {
          return Object.keys(dataNews).some(key => {
            return String(dataNews[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      // console.log(this.tableData);
      // console.log(store.getters.roles);
      return this.tableData
    }
  },
  mounted() {
    this.getAllUser()
  },
  methods: {
    getAllUser() {
      var _this = this
      getAllUser().then(res => {
        _this.createtableData(res.data)
      }).catch(err => {
        alert(err)
      })
    },
    createtableData(arr) {
      var data = []
      arr.map(a => {
        console.log(a)
        var obj = {
          Id: a.Id,
          LoginName: a.LoginName,
          Tel: a.Tel,
          Gender: a.Gender,
          Roles: []
        }
        a.URM.map(u => {
          obj.Roles.push(u.RoleId)
        })
        data.push(obj)
      })
      this.tableData = data
    },
    handleEdit(row) {
      this.temp = {
        Id: row.Id,
        LoginName: row.LoginName,
        Tel: row.Tel,
        Gender: row.Gender,
        Roles: row.Roles
      }
      this.dialogVisible = true
    },
    confirmEdit() {
      var _this = this
      console.log(this.temp)
      editUser(this.temp).then(res => {
        if (res.status === 200) {
          _this.$message({
            message: '修改成功',
            type: 'success'
          });
          _this.getAllUser()
        }
      }).catch(err => {
        alert(err)
      })
    },
    resetPsd(row) {
      this.resetId = row.Id
      this.warnDialogVisible = true
    },
    confirmResetPsd() {
      var _this = this
      console.log(this.resetId)
      resetPsd(this.resetId).then(res => {
        if (res.status === 200) {
          _this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.warnDialogVisible = false

        }
      }).catch(err => {
        alert(err)
      })
    }
  }
}
</script>

<style lang="" scoped>
</style>