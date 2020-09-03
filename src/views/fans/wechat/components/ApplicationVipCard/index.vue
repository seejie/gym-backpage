<template>
  <div class="application_merchant">
    <el-form
      class="form"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="会员卡标题：" prop="name">
        <el-input v-model.trim="form.name" placeholder="请填写会员卡标题，1-24字" />
      </el-form-item>
      <el-form-item label="库存总量：" prop="total">
        <el-input v-model.number="form.total" type="number" placeholder="输入库存数" />
      </el-form-item>
      <el-form-item class="form_background" label="卡券背景设置：">
        <template>
          <div class="radio_box">
            <el-radio v-model="form.background" label="color">使用背景色</el-radio>
            <el-radio v-model="form.background" label="img">使用背景图片</el-radio>
          </div>
          <el-color-picker v-if="form.background === 'color'" v-model="form.backgroundColor" />
          <el-upload
            v-if="form.background === 'img'" class="logo_uploader" action="https://jsonplaceholder.typicode.com/posts/">
            <div class="el_upload">
              <i class="el-icon-plus" />
            </div>
          </el-upload>
        </template>
      </el-form-item>
      <el-form-item label="使用须知：" prop="usageNotice">
        <el-input
          v-model.trim="form.usageNotice"
          type="textarea"
          placeholder="请填写使用须知，1-300字"
          :rows="5"
        />
      </el-form-item>
      <el-form-item label="权益说明：" prop="rightsExplanation">
        <el-input
          v-model.trim="form.rightsExplanation"
          type="textarea"
          placeholder="请填写说明，1-300字"
          :rows="5"
        />
      </el-form-item>
      <el-form-item label="商户服务">
        <el-checkbox-group v-model="form.service">
          <el-checkbox label="免费WIFI" />
          <el-checkbox label="可带宠物" />
          <el-checkbox label="免费停车" />
          <el-checkbox label="可外卖" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="自定义入口">
        <el-checkbox-group v-model="form.entrance" class="checkbox_box">
          <el-checkbox class="entrance_checkbox" label="积分" />
          <el-checkbox class="entrance_checkbox" label="折扣" />
          <el-checkbox class="entrance_checkbox" label="会员等级" />
          <div>
            <el-checkbox class="entrance_checkbox" label="余额" />
            <el-input
              v-model.trim="form.balanceUrl"
              class="checkbox_input"
              placeholder="请输入优惠券URL"
              size="medium"
            />
          </div>
          <div>
            <el-checkbox class="entrance_checkbox" label="优惠券" />
            <el-input
              v-model.trim="form.couponUrl"
              class="checkbox_input"
              placeholder="请输入优惠券URL"
              size="medium"
            />
          </div>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button class="button">取消</el-button>
        <el-button class="button" type="primary" @click="submitForm">提交审核</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: null,
        total: null,
        background: 'color',
        backgroundColor: '#409EFF',
        usageNotice: null,
        rightsExplanation: null,
        service: [],
        entrance: [],
        balanceUrl: null,
        couponUrl: null
      },
      rules: {
        name: [
          { required: true, message: '请输入名称！', trigger: 'blur' },
          { max: 24, message: '不能超过24个字', trigger: 'blur' }
        ],
        total: [
          { required: true, message: '请输入库存数！', trigger: 'blur' },
        ],
        usageNotice: [
          { required: true, message: '请输入使用须知！', trigger: 'blur' },
          { max: 300, message: '不能超过300个字', trigger: 'blur' }
        ],
        rightsExplanation: [
          { required: true, message: '请输入权益说明！', trigger: 'blur' },
          { max: 300, message: '不能超过300个字', trigger: 'blur' }
        ],
      },
    }
  },

  methods: {
    // 提交表单
    submitForm() {
      this.$emit('next')
    }
  }
}
</script>

<style lang="scss" scoped>
.application_merchant {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  .form {
    .max_width {
      width: 400px;
    }
    .form_background {
      .radio_box {
        width: 100%;
      }
      .el_upload {
        width: 40px;
        height: 40px;
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          border-color: #409EFF;
        }
      }
    }

    .checkbox_box {
      display: flex;
      flex-direction: column;
      .entrance_checkbox{
        width: 100px;
      }
      .checkbox_input {
        width: 300px;
      }
    }

    .button {
      margin-top: 20px;
      width: 200px;
    }
  }
}
</style>