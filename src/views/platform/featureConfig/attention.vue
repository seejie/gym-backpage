<template>
  <!-- 关注引导 -->
  <div class="attention">
    <el-card class="box-card">
      <el-form :model="attentionData" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="微信名称" prop="wxName">
          <el-input v-model="attentionData.wxName" placeholder="请填写微信公众号名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="关注提示" prop="guanzhuTips">
          <el-input v-model="attentionData.guanzhuTips" placeholder="请填写关注时的提示语" clearable></el-input>
        </el-form-item>

        <el-form-item label="功能开关">
          <el-switch v-model="attentionData.funcFlag" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>

        <el-form-item label="弹出模式" prop="popupMode" v-if="attentionData.funcFlag">
          <el-radio-group v-model="attentionData.popupMode" class="mode-choose">
            <el-radio :label="1">模式1</el-radio><br>
            <p>弹出绑定公众号二维码，若用户未关注本公众号，先弹出强制关注（请先到公众号绑定模块  设置绑定）</p>
            <el-radio :label="2">模式2</el-radio><br>
            <p><span>跳转地址</span><el-input v-model="attentionData.forwardUrl" placeholder="跳转链接，不填则不跳转"></el-input></p>
            <p>若用户未关注本公众号，访问后直接跳转至三方URL地址</p>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
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
    props: ['attentionData'],
    data() {
      return {
        rules: {
          wxName: [{
            required: true,
            message: "请填写微信公众号名称",
            trigger: "blur"
          }],
          guanzhuTips: [{
            required: true,
            message: "请填写关注时的提示语",
            trigger: "blur"
          }],
          qrcodeUrl: [{
            required: true,
            message: "请上传二维码",
            trigger: "change"
          }],
          popupMode:[{
            required: true,
            message: "请选择弹出模式",
            trigger: "change"
          }]
        }
      };
    },
    mounted() {

    },
    methods: {
      getQrcode(val) {
        this.attentionData.qrcode_url = val
      },
      submitForm() {
        let obj = {...this.attentionData};
        obj.funcFlag = obj.funcFlag ? 1 : 0;
        obj.qrcodeUrl = obj.qrcodeUrl ? obj.qrcodeUrl : ''
        this.$ajax
          .post("/platformsetting/functionsetting/guanzhuGuide/bindGuanzhuyindaoInfo", {
            ...obj,
            unitId:0
          })
          .then(res => {
            this.$message.success("提交成功");
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
  .attention {
    .el-form-item__content {
      width: 500px;
    }

    .upload-container {
      width: 50px;
      height: 50px;
      border: 1px solid #ccc;
    }

    .el-upload {
      height: 50px;
      line-height: 50px;
    }

    .tip {
      font-size: 12px;
      color: #999;
      width: 400px;
      line-height: 18px;
    }

    .img-tip {
      font-size: 12px;
      color: #999;
      margin-left: 10px;
    }
    .mode-choose{
      margin-top: 13px;
      p{
        height: 30px;
        font-size: 13px;
        color: #999;
        display: flex;
        align-items: center;
        & > span{
          display: block;
          width: 100px;
        }
      }
    }
  }

</style>
