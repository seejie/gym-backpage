<template>
  <div class="edit_popup">
    <el-dialog
      class="popup"
      title="编辑用户"
      :visible="editUserShow"
      @close="closePopup"
    >
      <div class="content">
        <el-form
          class="form"
          ref="form"
          :inline="true"
          :rules="rules"
          :model="form"
          label-width="80px"
        >
          <div class="form_flex">
            <el-form-item class="form_item" label="用户名">
              <span>{{ currentData.nickName }}</span>
            </el-form-item>
            <el-form-item class="form_item" label="用户头像">
              <el-avatar :src="currentData.headUrl" />
            </el-form-item>
            <el-form-item class="form_item" label="系统来源">
              <span>{{ currentData.idfv }}</span>
            </el-form-item>
            <el-form-item class="form_item" label="渠道来源">
              <span>{{ currentData.qudaoName }}</span>
            </el-form-item>
            <el-form-item class="form_item" label="手机号">
              <span>{{ currentData.mobile }}</span>
            </el-form-item>
            <el-form-item class="form_item" label="微信昵称">
              <span>{{ currentData.mobile }}</span>
            </el-form-item>
            <el-form-item class="form_item" label="生日" prop="birthday">
              <el-date-picker
                v-model="form.birthday"
                class="input"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item class="form_item" label="性别" prop="sex">
              <el-select
                v-model="form.sex"
                class="input"
                size="medium"
                placeholder="请选择"
              >
                <el-option label="男" :value="1" />
                <el-option label="女" :value="2" />
                <el-option label="未知" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item class="form_item" label="电子邮箱" prop="email">
              <el-input v-model.trim="form.email" class="input" />
            </el-form-item>
            <el-form-item class="form_item" label="身份证" prop="IdCard">
              <el-input v-model.trim="form.IdCard" class="input" />
            </el-form-item>
          </div>
          <el-form-item label="联系地址" prop="selectedOptions">
            <div class="selectedOptions">
              <el-cascader
                v-model="selectedOptions"
                class="input_long"
                :options="options"
                size="medium"
                @change="handleChange"
              />
              <el-input v-model.trim="form.address" class="input_long address" placeholder="详细地址" />
            </div>
          </el-form-item>
          <el-form-item label="所在单位" prop="com">
            <el-input v-model.trim="form.com" class="input_long" placeholder="所在单位" />
          </el-form-item>
          <el-form-item label="个人介绍" prop="introduced">
            <el-input
              v-model.trim="form.introduced"
              class="input_long"
              type="textarea"
              :rows="4"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="foot">
        <div class="button_box">
          <el-button class="button" size="small" @click="closePopup">取消</el-button>
          <el-button
            class="button"
            type="primary"
            size="small"
            :loading="loading"
            @click="editStatus(form)"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'
import MemberGradeAPI from '../../../grade/model'
import { MemberSearchAPI } from '../../model'

const memberGradeAPI = new MemberGradeAPI()
const memberSearchAPI = new MemberSearchAPI()

export default {
  props: {
    editUserShow: Boolean,
    currentData: Object
  },

  data() {
    return {
      form: {
        id: null,
        birthday: null,
        sex: null,
        email: null,
        IdCard: null,
        provinceName: null,
        cityName: null,
        areaName: null,
        address: null,
        com: null,
        introduced: null,
      },
      selectedOptions: [],
      options: regionData,
      gradeList: [],
      rules: {},
      loading: false
    }
  },

  watch: {
    currentData(val) {
      this.form.id = val.id
      this.form.birthday = val.birthday
      this.form.sex = val.sex
      this.form.email = val.email
      this.form.IdCard = val.IdCard
      this.form.provinceName = val.provinceName
      this.form.cityName = val.cityName
      this.form.areaName = val.areaName
      this.form.address = val.address
      this.form.com = val.com
      this.form.introduced = val.introduced
    }
  },

  mounted() {
    memberGradeAPI.findLevelList().then(res => {
      this.gradeList = res
    })
  },

  methods: {
    // 地区号转化成地区名称
    handleChange(val) {
      this.form.provinceName = CodeToText[val[0]]
      this.form.cityName = CodeToText[val[1]]
      this.form.areaName = CodeToText[val[2]]
    },

    /**
     * @description: 修改会员状态API
     * @param {Object} data: 某一条会员的信息
     * @return:
     */
    editStatus(data) {
      this.loading = true
      memberSearchAPI.editStatus(data).then(res => {
        this.loading = false
        this.closePopup()
      }).catch(() => {
        this.loading = false
      })
    },

    // 关闭弹框
    closePopup() {
      this.$refs.form.resetFields()
      this.$emit('refreshData')
      this.$emit('update:editUserShow', false)
    },
  }
}
</script>

<style lang="scss" scoped>
.edit_popup {
  .popup {
    .content {
      display: flex;
      justify-content: center;
      .form {
        display: flex;
        flex-direction: column;
        width: 650px;
        height: 400px;
        overflow-y: auto;
        .form_flex {
          display: flex;
          flex-wrap: wrap;
          .form_item {
            width: 300px;
          }
        }
        .address {
          display: block;
          margin-top: 10px;
        }
        .input {
          width: 200px;
        }
        .input_long {
          width: 300px;
        }
      }
    }

    .foot {
      .button_box {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>