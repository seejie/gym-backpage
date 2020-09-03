<template>
  <div class="public-no-form">
    <el-card class="box-card">
      <el-form :model="publicNoData"
               :rules="rules"
               ref="publicNoForm"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="APPID"
                  prop="appId">
          <el-col :span="8">
            <el-input v-model="publicNoData.appId"
                      placeholder="请填写绑定的微信公众号APPID" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="APPSECRET"
                  prop="appSecret">
          <el-col :span="8">
            <el-input v-model="publicNoData.appSecret"
                      placeholder="请填写绑定的微信公众号APPSECERT" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary"
                     @click="submitForm()">保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'publicNoConfig',
  data() {
    return {
      publicNoData: {
        appId: '',
        appSecret: ''
      },
      rules: {
        appId: [{required: true, message: '请填写绑定的微信公众号APPID', trigger: 'blur'}],
        channel_title_image: [{required: true, message: '请上传频道ICON', trigger: 'change'}],
      }
    }
  },
  methods: {
    submitForm() {

    },
    cancel() {

    }
  }
}
</script>

<style lang="scss" scoped>
.public-no-form {
  
}
</style>