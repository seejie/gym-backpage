<template>
  <div class="search">
    <el-form
      class="form_inline"
      ref="form"
      :inline="true"
      :model="formInline"
      label-width="80px"
    >
      <el-form-item class="form_item" label="搜索名称:" prop="nickName">
        <el-input
          v-model.trim="formInline.nickName"
          class="input"
          size="medium"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item class="form_item" label="系统来源:" prop="idfv">
        <el-select
          v-model="formInline.idfv"
          class="input"
          size="medium"
          placeholder="请选择"
        >
          <el-option label="小程序" value="0" />
          <el-option label="公众号" value="1" />
          <el-option label="APP" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item class="form_item" label="渠道来源:" prop="qudaoId">
        <el-select
          v-model="formInline.qudaoId"
          class="input"
          size="medium"
          placeholder="请选择"
        >
          <el-option label="免费" :value="0" />
          <el-option label="收费" :value="1" />
        </el-select>
      </el-form-item>
      <el-collapse-transition>
        <div v-show="show">
          <el-form-item class="form_item" label="地区筛选:" prop="selectedOptions">
            <el-cascader
              v-model="selectedOptions"
              class="input"
              :options="options"
              size="medium"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item class="form_item" label="注册时间:" prop="time">
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
          <el-form-item class="form_item" label="评论权限:" prop="gag">
            <el-select
              v-model="formInline.gag"
              class="input"
              size="medium"
              placeholder="请选择"
            >
              <el-option label="未禁言" :value="0" />
              <el-option label="禁言" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item class="form_item" label="消费金额:" prop="smallTotlePrice">
            <div class="mini_input_box">
              <el-input
                v-model.number="formInline.smallTotlePrice"
                class="mini_input"
                type="number"
                size="medium"
                placeholder="请输入最小值"
              />
              <el-input
                v-model.number="formInline.largeTotlePrice"
                class="mini_input"
                type="number"
                size="medium"
                placeholder="请输入最大值"
              />
            </div>
          </el-form-item>
          <el-form-item class="form_item" label="会员等级:" prop="levelId">
            <el-select
              v-model="formInline.levelId"
              class="input"
              size="medium"
              placeholder="请选择"
            >
              <el-option
                v-for="item in gradeList"
                :key="item.id"
                :label="item.levelName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-collapse-transition>
      <el-form-item class="form_button">
        <el-button type="primary" size="medium" @click="search">
          搜索
        </el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
        <div class="show_button">
          <div v-if="show" @click="show = false">
            <span>收起</span>
            <i class="el-icon-arrow-up" />
          </div>
          <div v-else @click="show = true">
            <span>展开</span>
            <i class="el-icon-arrow-down" />
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'

export default {
  props: {
    gradeList: Array,
    searchCondition: Object,
  },

  data() {
    return {
      formInline: {
        nickName: null,
        idfv: null,
        qudaoId: null,
        startTime: null,
        endTime: null,
        provinceName: null,
        cityName: null,
        areaName: null,
        gag: null,
        smallTotlePrice: null,
        largeTotlePrice: null,
        levelId: null,
      },
      time: [],
      selectedOptions: [],
      options: regionData,
      show: false,
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

    // 重置搜索
    resetForm() {
      this.selectedOptions = []
      this.time = []
      this.formInline.provinceName = null
      this.formInline.cityName = null
      this.formInline.areaName = null
      this.formInline.largeTotlePrice = null
      this.formInline.startTime = null
      this.formInline.endTime = null
      this.$refs.form.resetFields()
      this.$emit('search')
    },
  },
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
      .mini_input_box {
        display: flex;
        justify-content: space-between;
        width: 270px;
        .mini_input {
          width: 130px;
        }
      }
    }
    .form_button {
      display: flex;
      justify-content: flex-end;
      .show_button {
        display: inline-block;
        margin-left: 6px;
        font-size: 12px;
        color: #108ee9;
        cursor: pointer;
      }
    }
  }
}
</style>
