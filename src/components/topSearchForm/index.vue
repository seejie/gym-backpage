<template>
  <div class="wrapper">
    <el-form :inline="true"
             ref="formData"
             :model="formData"
             label-width="80px"
             label-position="right"
             class="demo-form-inline">
      <el-form-item prop="title"
                    v-for="(item,index) in formItems"
                    :key="index"
                    :label="item.label">
        <el-input v-if="item.type === 'text'"
                  v-model="formData[item.model]"
                  :placeholder="item.placeholder"></el-input>
        <el-select v-else-if="item.type === 'select'"
                   v-model="formData[item.model]"
                   clearable
                   :placeholder="item.placeholder">
          <el-option :label="list.label"
                     v-for="(list,indexs) in item.options"
                     :key="indexs"
                     :value="list.value"></el-option>
        </el-select>
        <el-cascader v-model="formData[item.model]"
                     v-else-if="item.type === 'link'"
                     :options="item.options"
                     clearable
                     @change="handleChange"></el-cascader>
        <el-date-picker v-else-if="item.type === 'datetimerange'"
                        v-model="formData[item.model]"
                        type="datetimerange"
                        value-format='yyyy-MM-DD HH:mm:ss'
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button type="primary"
                   style="margin-left:45%;"
                   @click="search">搜索</el-button>
        <el-button @click="resetForm('formData')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      defaul: () => {

      }
    },
    formItems: {
      type: Array,
      defaul: () => []
    },
  },
  data () {
    return {
    }
  },
  mounted () { },
  methods: {
    search () {
      this.$emit('search')
    },
    resetForm (name) {
      this.$emit('reset')
    },
    handleChange (val) {
      this.$emit('handleChange', val)
    }
  },
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  .el-form {
    width: 100%;
    /deep/ .el-form-item {
      width: 33%;
      margin-right: 0;
      .el-form-item__content {
        width: calc(100% - 80px);
        /deep/ .el-select,
        .el-cascader,
        .el-date-editor {
          width: 100%;
        }
      }
    }
  }
}
</style>