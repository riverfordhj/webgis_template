<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="二维数据" min-width="200" align="center">
      <template slot-scope="scope">
        {{ scope.row.name | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="储存位置" width="240" align="center">
      <template slot-scope="scope">
        {{ scope.row.site}}
      </template>
    </el-table-column>
    <el-table-column label="LayerID" width="320" align="center">
      <template slot-scope="scope">
        {{ scope.row.id}}
      </template>
    </el-table-column>
    <el-table-column label="Status" width="100" align="center">
      <template slot-scope="scope">
        <el-tag :type="scope.row.status | statusFilter"> {{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getList } from '@/api/transaction'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // fetchList().then(response => {
      //   this.list = response.data.items.slice(0, 8)
      // })
      this.list = getList().data;
    }
  }
}
</script>
