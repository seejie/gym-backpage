<template>
  <div class="group_popup">
    <el-dialog
      class="popup"
      title="积分设置"
      :visible="addRule"
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
          <el-form-item label="额度设置" prop="jifenLimit">
            <el-input v-model.number="form.jifenLimit" type="number" placeholder="请填写积分额度" />
          </el-form-item>
          <el-form-item>
            <span>若为负数，则扣减积分</span>
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
import MemberIntegralAPI from '../../model'

const memberIntegralAPI = new MemberIntegralAPI()

export default {
  props: {
    addRule: Boolean,
    currentData: Object
  },

  data() {
    return {
      form: {
        jifenLimit: null,
      },
      rules: {
        jifenLimit: [
          { required: true, message: '请输入积分额度！', trigger: 'blur' },
        ],
      },
      loading: false
    }
  },

  watch: {
    currentData(val) {
      if (this.addRule) {
        this.form = val
      }
    }
  },

  methods: {
    /**
     * @description: 编辑积分规则API
     * @param {Int} id 积分id
     * @param {Int} jifenLimit 积分额度
     * @return:
     */
    updateJifenRule({ id, jifenLimit }) {
      this.loading = true
      memberIntegralAPI.updateJifenRule({
        id,
        jifenLimit
      }).then(res => {
        this.loading = false
        this.closePopup()
        this.$emit('findJifenRuleList')
      }).catch(() => {
        this.loading = false
      })
    },

    // 提交表单
    saveForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.updateJifenRule({ id: this.currentData.id, jifenLimit: this.form.jifenLimit })
        } else {
          return false
        }
      })
    },

    // 关闭弹框
    closePopup() {
      this.$refs.form.resetFields()
      this.$emit('update:addRule', false)
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