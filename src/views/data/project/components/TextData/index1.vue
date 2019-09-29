<!--
 * @Descripttion: 
 * @version: 
 * @Author: KanMing
 * @Date: 2019-09-29 10:31:01
 * @LastEditors: KanMing
 * @LastEditTime: 2019-09-29 16:00:43
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tooltip class="item" effect="dark" content="上传文件" placement="top">
        <el-button
          v-permission="['spatialDataManager']"
          size="small"
          type="primary"
          @click="showFlieUploader"
        >上传文件</el-button>
      </el-tooltip>
      <!-- <el-button type="primary" >添加</el-button>
      <el-button type="danger" >删除</el-button>-->
      <el-input
        v-model="search"
        style="width: 200px;float:right;margin-bottom:10px"
        size="small"
        placeholder="请输入需查询字段"
      />
    </div>
    <el-table :data="datas" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column prop="fileName" label="名称" width="aoto" align="center"></el-table-column>
      <el-table-column prop="type" label="格式" align="center"></el-table-column>
      <el-table-column prop="size" label="大小(kb)" align="center"></el-table-column>
      <el-table-column prop="creationTime" label="创建日期" align="center"></el-table-column>
      <el-table-column prop="download" label="下载" align="center">
        <template slot-scope="scope">
          <el-button @click="downloadFile(scope.row)" size="small">点击下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-upload
        class="upload-css"
        :file-list="uploadFiles"
        ref="upload"
        :on-success="upLoadSuccess"
        :on-error="upLoadError"
        :action="uploadURL"
        :auto-upload="false"
        :multiple="true"
        :data="uploaderData"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
        >上传到服务器</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
// import { getPropertyData } from "@/api/table";
import { getDocsInfo } from "@/api/docs";
import permission from "@/directive/permission/index.js";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  props: {
    procjectName: {
      type: String,
      default: ""
    }
  },
  watch: {
    procjectName: function (val) {
      // debugger
      this.uploaderData = {
        projName: val
      }
      this.fetchData(val);
    }
  },
  data() {
    return {
      list: null,
      search: "",
      dialogVisible: false,
      uploadFiles: [],
      // uploadURL: "http://localhost:42449/api/file/UploadFiles",
      // uploadURL: "http://localhost:42449/api/docs/UploadFile",
      uploadURL: "http://172.16.7.55/YN_webapi/api/docs/UploadFile",
      uploaderData: {}
      // listLoading: true
    };
  },
  computed: {
    datas: function () {
      const search = this.search;
      if (search) {
        return this.list.filter(dataNews => {
          return Object.keys(dataNews).some(key => {
            return (
              String(dataNews[key])
                .toLowerCase()
                .indexOf(search) > -1
            );
          });
        });
      }
      // console.log(this.tableData);
      return this.list;
    }
  },
  created() {
    // this.fetchData();
  },
  directives: {
    permission
  },
  methods: {
    fetchData(val) {
      var _this = this;
      getDocsInfo(val)
        .then(res => {
          console.log(res.data);
          if (res.data.length != 0) {
            _this.list = res.data;
          } else {
            this.list = [];
          }
        })
        .catch(err => {
          console.log(err);
        });
      // this.list = getPropertyData().tableData;
      // this.listLoading = true;
      // getList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
    },

    downloadFile(row) {
      console.log(row);
      window.open(
        // `http://localhost:42449/api/docs/DownLoadFile?proj=${this.procjectName}&fileName=${row.fileName}`
        `http://172.16.7.55/YN_webapi/api/docs/DownLoadFile?proj=${this.procjectName}&fileName=${row.fileName}`
      );
      // var $form = $('<form method="GET"></form>');
      // $form.attr('action', '/download/papers/1');
      // $form.appendTo($('body'));
      // $form.submit()
    },
    showFlieUploader() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    //文件上传成功时的钩子
    upLoadSuccess() {
      this.$message({
        message: "上传成功",
        type: "success"
      });
      this.fetchData(this.procjectName)
    },
    //文件上传失败时的钩子
    upLoadError(err) {
      this.$message({
        message: err.message,
        type: "error"
      });
    }
  }
};
</script>
