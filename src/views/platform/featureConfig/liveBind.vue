<!--直播绑定-->
<template>
<div class="public-no-form public-bind">
    <el-card class="box-card">
      <el-form ref="liveData" :model="liveData" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="绑定状态">
          <p class="bind_flag">{{liveData.auth_status ? '已绑定' : '未绑定'}}</p>
        </el-form-item>
        <el-form-item label="服务商" prop="serviceProvider">
          <el-select v-model="liveData.serviceProvider" placeholder="请选择">
            <el-option
              v-for="item in serviceProviderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="APPID">
          <el-input v-model="liveData.appid" placeholder="请填写绑定的APPID ，具体参考平台，若无不填" clearable></el-input>
        </el-form-item>
        <el-form-item label="APPNAME">
          <el-input v-model="liveData.appName" placeholder="默认为Live，可填入自定义" clearable></el-input>
        </el-form-item>
        <el-form-item label="SECRETID">
          <el-input v-model="liveData.secretId" placeholder="请填写绑定的SECERTID,具体参考平台，若无不填" clearable></el-input>
        </el-form-item>
        <el-form-item label="SECRETKEY">
          <el-input v-model="liveData.secretKey" placeholder="请填写绑定的SECERTKEY，具体参考平台，若无不填" clearable></el-input>
        </el-form-item>
        <el-form-item label="主推流域名" prop="pushDomain">
          <el-input v-model="liveData.pushDomain" placeholder="请填写在三方直播平台设置的推流域名，具体参考平台" clearable></el-input>
        </el-form-item>
        <el-form-item label="播放域名" prop="playDomain">
          <el-input v-model="liveData.playDomain" placeholder="请填写在三方直播平台设置的直播域名，具体参考平台" clearable></el-input>
        </el-form-item>
        <el-form-item label="防盗链鉴权Key">
          <el-input v-model="liveData.untiThiefKey" placeholder="请填写在三方直播平台提供的防盗链鉴权KEY，选填" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <div>推荐使用腾讯云直播服务</div>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm()">保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['liveData'],
  data(){
    return {
      serviceProviderOptions:[
        {
          value:"1",
          label:"腾讯云"
        }
      ],
      rules: {
          serviceProvider: [{
            required: true,
            message: "请选择服务商",
            trigger: "change"
          }],
          pushDomain: [{
            required: true,
            message: "请输入主推流域名",
            trigger: "blur"
          }],
          playDomain: [{
            required: true,
            message: "请输入播放域名",
            trigger: "blur"
          }]
        },
    }
  },
  methods:{
    cancel(){},
    submitForm(){
      this.$refs.liveData.validate(valid => {
        if (valid) {
          this.$ajax
          .post("/course/live/setLiveCourseSetting", this.liveData )
          .then(res => {
            if (res.resObject) {
              this.$message.success('绑定成功');
            }
          })
          .catch(err => {
            console.log(err);
          });
        } else {
          this.$message.error('请输入必填信息');
        }
      });
    }
  }
}
</script>

<style>

</style>
