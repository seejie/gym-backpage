<template>
  <div class="search">
    <el-form
      class="form_inline"
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item class="form_item" label="用户名称:" prop='name'>
        <el-input
          v-model.trim="form.name"
          class="input"
          size="medium"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item class="form_item" label="注册时间:" prop='time'>
        <el-date-picker
          v-model="time"
          class="input"
          size="medium"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item class="form_item" label="地区筛选:" prop='selectedOptions'>
        <el-cascader
          v-model="selectedOptions"
          class="input"
          :options="options"
          size="medium"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item class="form_item" label="类型:" prop='jifenType'>
        <el-select
          v-model="form.jifenType"
          class="input"
          size="medium"
          placeholder="请选择"
        >
          <el-option label="积分消耗" :value="0" />
          <el-option label="积分获取" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item class="form_button">
        <el-button type="primary" size="medium" @click="search">搜索</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'

export default {
  data() {
    return {
      form: {
        name: null,
        type: null,
        startTime: null,
        endTime: null,
      },
      rules: {},
      time: [],
      selectedOptions: [],
      options: regionData,
    }
  },

  watch: {
    time(val) {
      this.form.startTime = val[0]
      this.form.endTime = val[1]
    }
  },

  methods: {
    /**
     * @description: 地区筛选选择器，区号转化成区名
     * @param {Array} val: 地区号数组
     * @return:
     */
    handleChange(val) {
      this.form.provinceId = val[0]
      this.form.cityId = val[1]
      this.form.areaId = val[2]
    },

    // 提交搜索
    search() {
      this.$emit('search', null, null, this.form)
    },

    // 重置表单
    resetForm() {
      this.time = []
      this.selectedOptions = []
      this.form.provinceId = null
      this.form.cityId = null
      this.form.areaId = null
      this.form.startTime = null
      this.form.endTime = null
      this.$refs.form.resetFields()
      this.$emit('search')
    },
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  justify-content: center;
  background-color: #f7f7f7;

  .form_inline {
    flex-wrap: wrap;
    margin-top: 20px;
    width: 1100px;
    .form_item {
      font-size: 12px;
      .input {
        width: 270px;
      }
    }

    .form_button {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>