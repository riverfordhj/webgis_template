<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="value" placeholder="请选择" :loading="loading">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <Pivottable :pivotData="value" class="pivot-table" />
  </div>
</template>

<script>
  import Pivottable from '../../components/Pivottable/index'
  import { getAllProject } from "@/api/project.js"
  export default {
    name: '',
    components: {
      Pivottable
    },
    data() {
      return {
        options: [],
        value: '',
        loading: true
      }
    },
    mounted() {
      var self = this
      getAllProject().then( res => {
        console.log(res.data)
        res.data.map(d => {
          this.options.push({
            value: JSON.stringify(d.SpatialData),
            label: d.Name
          })
        })
        self.loading = false
      })
    }
  }
</script>

<style lang="" scoped>
  
</style>