<!--
 * @Descripttion: 1
 * @version: 1
 * @Author: KanMing
 * @Date: 2019-09-28 10:25:00
 * @LastEditors: KanMing
 * @LastEditTime: 2019-09-28 16:17:15
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
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="用户名" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="groupId" label="等级" align="center"></el-table-column>
        <el-table-column prop="groupName" label="区域" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="{row}">
            <el-button @click="handleEdit(row)" type="text" size="small">编辑</el-button>
            <el-button type="text" @click="resetPsd(row)" size="small">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        :label-position="labelPosition"
        style="width: 100%"
        size="medium"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="等级" prop="groupId">
          <el-input v-model="temp.groupId" placeholder="请输入用户等级" />
        </el-form-item>
        <el-form-item label="区域" prop="groupName">
          <el-input v-model="temp.groupName" placeholder="请输入用户区域" />
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
        <el-button type="warning" @click="confirmReset">确认重置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: '',
  data() {
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {
      search: "",
      tableData: [],
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],
        groupId: [{ required: true, message: "请输入用户等级", trigger: "blur" }],
        groupName: [{ required: true, message: "请输入用户区域", trigger: "blur" }],
      },
      listLoading: false,
      labelPosition: 'right',
      temp: {
        name: '',
        email: '',
        groupId: '',
        groupName: ''
      },
      title: '',
      dialogVisible: false,
      warnDialogVisible: false,
      userByReset: ''
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
    this.getUsers()
  },
  methods: {
    getUsers() {
      var _this = this
      axios.post('http://172.16.7.50:8888/api/getLogin', {
      }).then(res => {
        console.log(res)
        _this.tableData = res.data.data
      }).catch(err => {
        alert(err)
      })
    },
    handleEdit(row) {
      this.temp = {
        name: row.name,
        email: row.email,
        groupId: row.groupId,
        groupName: row.groupName
      }
      this.title = '编辑用户信息'
      this.dialogVisible = true
    },
    confirmEdit() {
      var _this = this
      axios.post('http://172.16.7.50:8888/api/editorUser',
        this.temp
      ).then(res => {
        if (res.status !== 200) {
          alert('修改失败')
        } else {
          _this.$message({
            message: '修改成功',
            type: 'success'
          });
          _this.dialogVisible = false
          _this.getUsers()
        }
      }).catch(err => {
        alert(err)
      })
    },
    resetPsd(row) {
      this.userByReset = row.name
      this.warnDialogVisible = true
    },
    confirmReset() {
      axios.post('http://172.16.7.50:8888/api/updatePasswd', {
        data: {
          'name': this.userByReset
        }
      }).then(res => {
        console.log(res)
        alert('reset S!')
      }).catch(err => {
        alert(err)
      })
    }
  }
}
</script>

<style lang="" scoped>
</style>