<template>
  <div class="app-bind">
    <el-card class="box-card">
      <el-form :model="appData"
               :rules="rules"
               ref="publicNoForm"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="APPID"
                  prop="appId">
          <el-col :span="8">
            <el-input v-model="appData.appId"
                      placeholder="请填写绑定的微信公众号APPID" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="APPSECRET"
                  prop="appSecret">
          <el-col :span="8">
            <el-input v-model="appData.appSecret"
                      placeholder="请填写绑定的微信公众号APPSECERT" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="消息校验token"
                  prop="token">
          <el-col :span="8">
            <el-input v-model="appData.token"
                      placeholder="开放平台 消息校验签名" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="消息加解密Key"
                  prop="key">
          <el-col :span="8">
            <el-input v-model="appData.key"
                      placeholder="开放平台 消息加解密Key" clearable></el-input>
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
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'publicNoConfig',
  data() {
    return {
      appData: {
        appId: '',
        appSecret: '',
        token: '',
        key: ''
      },
      rules: {
        appId: [{required: true, message: 'APPID 必填项', trigger: 'blur'}],
        appSecret: [{required: true, message: 'APPSECERT 必填项', trigger: 'blur'}],
        token: [{required: true, message: 'token 必填项', trigger: 'blur'}],
        key: [{required: true, message: 'key 必填项', trigger: 'blur'}],
      }
    }
  },
  methods: {
    ...mapActions({
      bindOpenPlateform: 'saas/bindOpnPlat',
    }),
    submitForm() {
      this.bindOpenPlateform({
        ...this.appData
      })
      debugger
      /* this.$ajax.post('/sys/sys_setting/bindKaifangpingtai', this.appData).then((res) => {
        debugger
        if (res.resultCode == '0000') {
          this.$message.success("修改成功")
          this.editShow = false
          this.getLabelList()
        } else {
          this.$message.error("修改失败")
        }
      }).catch((err) => {
        console.log(err)
      }) */
    },
    cancel() {

    }
  }
}
</script>

<style lang="scss" scoped>
.app-bind {
  
}
</style>