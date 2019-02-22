<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="name" label="名称" width="auto"></el-table-column>
    <el-table-column prop="xzq" label="行政区"></el-table-column>
    <el-table-column prop="type" label="类型"></el-table-column>
    <el-table-column prop="format" label="格式"></el-table-column>
    <el-table-column prop="date" label="日期"></el-table-column>
    <el-table-column prop="size" label="大小"></el-table-column>
    <el-table-column prop="version" label="版本"></el-table-column>
    <el-table-column prop="copy" label="份数"></el-table-column>
    <el-table-column prop="status" label="状态">
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.status === '有效' ? 'success' : scope.row.status === '过期' ? 'primary' : 'danger'"
          disable-transitions
        >{{scope.row.status}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
    <el-table-column prop="server" label="服务地址"></el-table-column>
    <el-table-column prop="download" label="下载地址"></el-table-column>
    <el-table-column prop="person" label="保存人员"></el-table-column>
    <el-table-column prop="phone" label="电话"></el-table-column>
    <el-table-column prop="note" label="备注"></el-table-column>
  </el-table>
</template>

  <script>
import { getMockData } from "@/api/tableTestData";//getTableTestData
export default {
  data() {
    return {
      tableData: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.tableData = getMockData().tableData;
      // getTableTestData().then(reponse => {
      //   debugger;
      //   this.tableData = reponse.data.tableData;
      // });
    }
  }
};
</script>