<template>
  <div class="uploadArea">
    <el-upload
      show-file-list
      drag
      :action=url
      accept=".xlsx">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="downloadExcel">下载模板文件</el-button> -->
      </span>
  </div>    
</template>

<script>
  export default {
    name: '',
    data() {
      return {
        loading: false,
        url1:"http://localhost:42449/api/project/UploadProjectExcel",
        url:"http://202.114.148.160/webapi_role/api/project/UploadProjectExcel",
      }
    },
    methods:{

    }
  }
</script>

<style scoped>
  .uploadArea{
    width: 600px;
    height: 800px;
    margin: 0 auto;
    text-align: center;
  }
</style>