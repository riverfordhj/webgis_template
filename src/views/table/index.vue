<template>
  <div class="app-container">
    <el-table
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column prop="name" label="名称" width="aoto" align="center"></el-table-column>
      <el-table-column prop="type" label="类型" align="center"></el-table-column>
      <el-table-column prop="format" label="格式" align="center"></el-table-column>
      <el-table-column prop="date" label="日期" align="center"></el-table-column>
      <el-table-column prop="size" label="大小" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === '有效' ? 'success' : scope.row.status === '过期' ? 'primary' : 'danger'"
            disable-transitions
          >{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="person" label="保存人员" align="center"></el-table-column>
      <el-table-column prop="phone" label="电话" align="center"></el-table-column>
      <el-table-column prop="check" label="查看" align="center">
        <template slot-scope="scope">
          <el-button @click="handleCheck(scope.row.index)" size="small">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="download" label="下载" align="center">
        <template slot-scope="scope">
          <el-button @click="handleCheck(scope.row.index)" size="small">点击下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getPropertyData } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      // listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.list = getPropertyData().tableData;
      // this.listLoading = true;
      // getList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
    },

    handleCheck(index){
        console.log(index);
    }

  }
}
</script>
