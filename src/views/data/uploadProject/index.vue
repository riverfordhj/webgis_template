<!--
 * @Descripttion: 1
 * @version: 1
 * @Author: KanMing
 * @Date: 2019-09-29 11:14:11
 * @LastEditors: KanMing
 * @LastEditTime: 2019-09-29 15:48:34
 -->
<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column
        v-for="item of tableHeader"
        :key="item"
        :prop="item"
        :label="item"
        align="center"
        :width="flexColumnWidth(item)"
      />
      <el-table-column
        label="操作"
        align="center"
        width="120"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="uploadProject(row)">上传</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import axios from 'axios'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      demo: {
        irrigationName: null,
        irrigationID: null,
        provinces: null,
        city: null,
        counties: null,
        townships: null,
        area: null,
        volume: null,
        longitude: null,
        latitude: null,
        investmentAmount: null,
        id: null,
        scale: null,
        endTime: null,
        startTime: null,
        outcome: null,
        status: null,
        createTime: null,
        createUser: null,
        deleteMark: null,
        mappingScale: null,
        pid: null,
        participants: null,
        phoneNumber: null,
        summary: null,
        coordinateSystem: null,
        elevationReference: null,
        projectManager: null,
        imageResolution: null
      }
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      console.log(results)
      this.tableData = results
      this.tableHeader = header
    },
    flexColumnWidth(str) {
      return (str.length * 15) < 100 ? '100px' : (str.length * 15) + 'px'
    },
    uploadProject(row) {
      console.log(row)
      var _this = this
      var obj = {
        irrigationName: null,
        irrigationID: null,
        provinces: null,
        city: null,
        counties: null,
        townships: null,
        area: null,
        volume: null,
        longitude: null,
        latitude: null,
        investmentAmount: null,
        id: null,
        scale: null,
        endTime: null,
        startTime: null,
        outcome: null,
        status: null,
        createTime: null,
        createUser: null,
        deleteMark: null,
        mappingScale: null,
        pid: null,
        participants: null,
        phoneNumber: null,
        summary: null,
        coordinateSystem: null,
        elevationReference: null,
        projectManager: null,
        imageResolution: null
      }

      var res = Object.assign(obj, row)
      axios.post('http://172.16.7.50:8888/api/updatePrjName',
        res
      ).then(res => {
        if (res.status !== 200) {
          alert('上传失败')
        } else {
          _this.$message({
            message: '上传成功',
            type: 'success'
          });
        }
      }).catch((error) => {
        alert(error)
      });
    }
  }
}
</script>
