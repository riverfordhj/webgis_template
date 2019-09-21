<template>
  <div>
    <el-dialog
      title="飞行路线"
      :visible.sync="dialogVisible"
      width="20%"
      :show-close="false"
      :modal="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <el-form
        class="form"
        ref="userForm"
        :model="propertyForm"
        label-width="50px"
        label-position="left"
      >
        <el-form-item label="名称" prop="username">
          <el-input
            v-model="propertyForm.name"
            type="text"
            auto-complete="on"
            style
            placeholder="请输入路线名称"
          />
        </el-form-item>
        <el-form-item label="描述" prop="password">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 3}"
            v-model="propertyForm.description"
            auto-complete="on"
            style
            placeholder="请输入路线描述信息"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm" style="width:100%">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      propertyForm: {
        name: "",
        description: "",
      },
      dialogVisible: false
    }
  },
  watch: {
    visible() {
      this.dialogVisible = true
    }
  },
  methods: {
    confirm() {
      this.$emit('setFlyProperty', this.propertyForm)
      // debugger
      this.close()
    },
    handleClose(done) {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    close() {
      // debugger
      this.propertyForm = {
        name: "",
        description: "",
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="" scoped>
</style>