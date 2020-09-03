<template>
  <div class="group_popup">
    <el-dialog
      class="popup"
      title="等级设置"
      :visible="addGrade"
      @close="closePopup"
    >
      <div class="content">
        <el-form
          class="form"
          ref="form"
          :rules="rules"
          :model="form"
          label-width="80px"
        >
          <el-form-item label="等级名称" prop="name">
            <el-input v-model.trim="form.name" placeholder="等级名称，1-5个字" />
          </el-form-item>
          <el-form-item label="最低积分" prop="minPoints">
            <el-input v-model.number="form.minPoints" type="number" placeholder="请输入满足等级最低积分" />
          </el-form-item>
          <el-form-item label="最高积分" prop="maxPoints">
            <el-input v-model.number="form.maxPoints" type="number" placeholder="请输入满足等级最高积分,不填则无上限" />
          </el-form-item>
          <el-form-item label="优惠折扣" prop="discount">
            <el-input-number
              v-model="form.discount"
              :precision="2"
              :step="0.01"
              :min="0.1"
              :max="1"
            />
            <p class="discount_text">请输入0.1-1之间数字，不填则不享受折扣</p>
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
            @click="saveForm"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MemberGradeAPI from '../../model'

const memberGradeAPI = new MemberGradeAPI()

export default {
  props: {
    addGrade: Boolean,
    currentData: Object
  },

  data() {
    // 自定义表单规则: 最低积分不能高于最高积分
    const pointsRules = (rule, value, callback) => {
      if (this.form.minPoints > this.form.maxPoints && (this.form.maxPoints || this.form.maxPoints === 0)) {
        callback(new Error('最低积分不能高于最高积分'))
      } else if (this.form.minPoints === this.form.maxPoints) {
        callback(new Error('最低积分不能等于最高积分'))
      } else {
        callback()
      }
    }

    return {
      form: {
        name: null,
        minPoints: null,
        maxPoints: null,
        discount: null
      },
      rules: {
        name: [
          { required: true, message: '请输入名称！', trigger: 'blur' },
          { max: 5, message: '不能超过5个字', trigger: 'blur' }
        ],
        minPoints: [
          { required: true, message: '请输入最低积分！', trigger: 'blur' },
          { type: 'number', min: 0, message: '最低积分不能为负数！', trigger: 'blur' },
          { validator: pointsRules, trigger: 'blur' }
        ],
        maxPoints: [
          { validator: pointsRules, trigger: 'blur' }
        ],
      },
      loading: false
    }
  },

  watch: {
    currentData(val) {
      this.form.name = val.levelName
      this.form.minPoints = val.lowestJifen
      this.form.maxPoints = val.highestJifen === 999999999 ? null : val.highestJifen
      this.form.ruleExplain = val.ruleExplain
      this.form.discount = val.zhekou || 1
    }
  },

  methods: {
    /**
     * @description: 创建会员等级API
     * @param {Object} form: 某一条会员等级信息
     * @return:
     */
    createLevel(form) {
      this.loading = true
      memberGradeAPI.createLevel(form)
        .then(res => {
          this.loading = false
          this.closePopup()
          this.$emit('findLevelList')
        }).catch(() => {
          this.loading = false
        })
    },

    /**
     * @description: 编辑会员等级API
     * @param {Object} form: 某一条会员等级信息
     * @return:
     */
    updateLevel(form) {
      this.loading = true
      memberGradeAPI.updateLevel(form)
        .then(res => {
          this.loading = false
          this.closePopup()
          this.$emit('findLevelList')
        })
        .catch(() => {
          this.loading = false
        })
    },

    // 提交表单
    saveForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.maxPoints && this.form.maxPoints !== 0) {
            this.form.maxPoints = 999999999
          }
          const form = {
            highestJifen: this.form.maxPoints,
            levelName: this.form.name,
            lowestJifen: this.form.minPoints,
            ruleExplain: this.form.ruleExplain,
            zhekou: this.form.discount
          }
          // 判断是创建会员，还是编辑会员操作
          if (this.currentData.id) {
            this.updateLevel({ ...form, id: this.currentData.id })
          } else {
            this.createLevel(form)
          }
        } else {
          return false
        }
      })
    },

    // 关闭弹框
    closePopup() {
      this.$refs.form.resetFields()
      this.$emit('update:addGrade', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.group_popup {
  .popup {
    .content {
      display: flex;
      justify-content: center;
      .form {
        width: 400px;
        .discount_text {
          margin: 0px;
          font-size: 14px;
          color: #999999;
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