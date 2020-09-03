<template>
  <div class="search">
    <el-form
      class="form_inline"
      ref="form"
      inline
      :model="formInline"
      label-width="80px"
    >
      <el-form-item class="form_item" label="所在地区:">
        <el-cascader
          v-model="selectedOptions"
          class="input"
          :options="options"
          size="medium"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item class="form_item" label="系统来源:">
        <el-select
          v-model="formInline.system"
          class="input"
          size="medium"
          placeholder="请选择"
        >
          <el-option label="小程序" :value="0" />
          <el-option label="APP" :value="1" />
          <el-option label="公众号" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item class="form_item" label="渠道来源:">
        <el-select
          v-model="formInline.qudaoId"
          class="input"
          size="medium"
          placeholder="请选择"
        >
          <el-option label="区域一" :value="0" />
          <el-option label="区域二" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item class="form_item" label="查询时间:">
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
      <el-form-item class="form_button">
        <el-button type="primary" size="medium" @click="search">搜索</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { CodeToText, provinceAndCityDataPlus } from 'element-china-area-data'

export default {
  data() {
    return {
      formInline: {
        provinceName: null,
        cityName: null,
        areaName: null,
        system: null,
        qudaoId: null,
        startTime: null,
        endTime: null,
      },
      time: [],
      selectedOptions: [],
      options: provinceAndCityDataPlus,
    }
  },

  watch: {
    time(val) {
      this.formInline.startTime = val[0]
      this.formInline.endTime = val[1]
    }
  },

  methods: {
    /**
     * @description: 地区筛选选择器，区号转化成区名
     * @param {Array} val: 地区号数组
     * @return:
     */
    handleChange(val) {
      this.formInline.provinceName = CodeToText[val[0]]
      this.formInline.cityName = CodeToText[val[1]]
      this.formInline.areaName = CodeToText[val[2]]
    },

    // 提交搜索
    search() {
      this.$emit('search', null, null, this.formInline)
    },

    // 重置表单
    resetForm() {
      this.selectedOptions = []
      this.time = []
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