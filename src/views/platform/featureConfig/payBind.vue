<template>
  <!-- 支付绑定 -->
  <div class="public-no-form public-bind">
    <el-card class="box-card">
      <el-form :model="payData" :rules="rules" label-width="150px" class="demo-ruleForm">
        <el-form-item label="微信支付商户号MCHID" prop="mch_id">
          <el-input v-model="payData.mch_id" placeholder="请填写绑定的微信公众号APPID" clearable></el-input>
          <p
            class="tip"
          >开发者ID是公众号开发识别码，配合开发者密码可调用公众号的接口能力。请登录微信公众号后台，在“开发>基本配置>公众号开发信息 ”查看开发者ID(AppID)，并复制于此处。</p>
        </el-form-item>
        <el-form-item label="KEY" prop="mch_key">
          <el-input v-model="payData.mch_key" placeholder="请填写微信支付商户KEY" clearable></el-input>
          <p class="tip">请复到微信支付商户后台(账户设置->安全设置->API安全->API密钥->设置密钥))*</p>
        </el-form-item>
      
      
        <el-form-item label="apiclient_cert证书">
          <el-upload
            class="upload-demo"
            action="http://upload.qiniup.com/"
            :data="dataObj"
            :multiple="false"
            :show-file-list="true"
            :on-success="getApiclientCert"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
           
          <p class="tip"> 下载cert.zip 中的 apiclient_cert.pem 格式证书 </p>
      
        </el-form-item>

        <el-form-item label="apiclient_key证书">
          <el-upload
            class="upload-demo"
            action="http://upload.qiniup.com/"
            :data="dataObj"
            :multiple="false"
            :show-file-list="true"
            :on-success="getApiclientKey"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>

          <p class="tip">下载证书 cert.zip中的apiclient_key.pem 格式证书 </p>

        </el-form-item>



        <el-form-item label="pkcs12文件">
          <el-upload
            class="upload-demo"
            action="http://upload.qiniup.com/"
            :data="dataObj"
            :multiple="false"
            :show-file-list="true"
            :on-success="getRootca"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>

        <p class="tip">下载证书 cert.zip中的apiclient_cert.p12文件</p>

        </el-form-item>

        <el-form-item>
          <p class="tip">备注说明：由于绝大部分操作系统已内置了微信支付服务器证书的根CA证书, 2018年3月6日后, 不再提供CA证书文件（rootca.pem）下载</p>
        </el-form-item>

        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {
    getToken
  } from '@/api/qiniu'
export default {
  props: ['payData'],
  data() {
    return {
      rules: {
        mch_id: [
          {
            required: true,
            message: '请填写微信支付商户号MCHID',
            trigger: 'blur',
          },
        ],
        mch_key: [
          { required: true, message: "请填写微信支付商户KEY", trigger: "blur" }
        ],
        apiclient_cert: [
          { required: true, message: "请上传CERT证书", trigger: "change" }
        ]
      },
       dataObj: {
          token: '',
          key: ''
        }
    };
  },
  mounted() {},
  methods: {
    submitForm() {
      this.$ajax
        .post('/sys/unitwechatconfig/bindPayInfo', {
          ...this.payData,
        })
        .then(res => {
          this.$message.success('保存成功');
        })
        .catch(err => {
          console.log(err);
        });
    },
    getQiniuUrl(response,type){
      this.$ajax.get('/sys/sys_setting/queryQiniuyun').then((res) => {
        let url = res.resObject.qiniuyunUrl +'/'+response.key;
        switch(type){
          case 1:
            this.payData.apiclient_cert = url;
            break;
          case 2:
            this.payData.apiclient_key = url;
            break;
          case 3:
            this.payData.rootca = url;
            break;
        }
        }).catch((err) => {
          console.log(err)
        })
    },
    getApiclientCert(response, file, fileList) {
        this.getQiniuUrl(response,1)
      },
      getApiclientKey(response, file, fileList) {
        this.getQiniuUrl(response,2)
      },
      getRootca(response, file, fileList) {
        this.getQiniuUrl(response,3)
      },
      beforeUpload() {
        const _self = this;
        return new Promise((resolve, reject) => {
          getToken().then(response => {
            const key = response.resObject.secretKey
            const token = response.resObject.token
            _self.dataObj.token = token;
            _self.dataObj.key = key + (new Date()).getTime();
            resolve(true)
          }).catch(err => {
            console.log(err)
            reject(false)
          })
        })
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
