<template>
  <div class="notice_popup">
    <el-dialog
      class="popup"
      title="新建群发"
      :visible="noticeShow"
      @close="closePopup"
    >
      <div class="content">
        <el-form
          class="form"
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="群发标题" prop="title">
            <el-input v-model.trim="form.title" placeholder="请填写标题，30字以内" />
          </el-form-item>
          <el-form-item label="群发内容" prop="content">
            <el-input
              v-model="form.content"
              class="content"
              type="textarea"
              placeholder="请填写正文，300字以内"
              :rows="10"
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
            @click="send"
          >
            发布
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    noticeShow: Boolean,
  },

  data() {
    return {
      form: {
        title: null,
        content: null,
      },
      rules: {
        title: [
          { required: true, message: '请输入标题！', trigger: 'blur' },
          { max: 30, message: '不能超过30个字', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入正文！', trigger: 'blur' },
          { max: 300, message: '不能超过300个字', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },

  methods: {
    // 关闭弹框
    closePopup() {
      this.$refs.form.resetFields()
      this.$emit('update:noticeShow', false)
    },

    // 提交表单
    send() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.closePopup()
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.notice_popup  {
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