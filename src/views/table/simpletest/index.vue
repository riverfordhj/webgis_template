<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table>
</template>

  <script>
import { getData } from "@/api/tableTestData";
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
      this.tableData = getData().tableData;
    //   debugger;
    }
  }
};
</script>