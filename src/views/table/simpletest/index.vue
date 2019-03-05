<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="name" label="名称" align="center" width="auto"></el-table-column>
    <el-table-column prop="xzq" label="行政区" align="center"></el-table-column>
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
    <!-- <el-table-column prop="download" label="下载">
        <template slot-scope="scope">
          <el-dropdown @command="showPicture(scope.row)" >
            <span class="el-dropdown-link">
             download<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">word</el-dropdown-item>
              <el-dropdown-item command="b">PDF</el-dropdown-item>
              <el-dropdown-item command="c">Excel</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
    </el-table-column> -->
    <el-table-column prop="serverAddress" label="服务地址 / id" align="center"></el-table-column>
    <el-table-column prop="person" label="保存人员" align="center"></el-table-column>
    <el-table-column prop="phone" label="电话" align="center"></el-table-column>
    <el-table-column prop="download" label="数据下载" align="center">
      <template slot-scope="scope">
        <el-button @click="showProp(scope.row.prop)" type="img" size="small">点击下载</el-button>
      </template>
    </el-table-column>
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
    },

    showProp(prop) {
      console.log(prop);
    }

  }
};
</script>