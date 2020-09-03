<template>
<!-- 小程序绑定 -->
  <div class="public-no-form public-bind">
    <el-card class="box-card">
      <el-form :model="routineData"
               :rules="rules"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="APPID"
                  prop="mini_app_id">
            <el-input v-model="routineData.mini_app_id"
                      placeholder="请填写小程序的APPID" clearable></el-input>
            <p class="tip">小程序APPID，登录已注册小程序账户，官方提供的APPID</p>
        </el-form-item>
        <el-form-item label="APPSECRET"
                  prop="appSecret">
            <el-input v-model="routineData.mini_app_secret"
                      placeholder="请填写小程序的APPSECERT" clearable></el-input>
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
  props:['routineData'],
  data() {
    return {
      rules: {
        mini_app_id: [
          {
            required: true,
            message: "请填写小程序APPID",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted(){

  },
  methods: {
    submitForm() {
      this.$ajax
        .post("/sys/unitwechatconfig/bindMingram", {
          ...this.routineData
        })
        .then(res => {
            this.$message.success(res.message)
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancel() {}
  }
};
</script>

<style lang="scss">
.public-bind {
  .el-form-item__content {
    width: 400px;
  }
  .tip {
    font-size: 12px;
    color: #999;
    width: 400px;
    line-height: 18px;
  }
}
</style>