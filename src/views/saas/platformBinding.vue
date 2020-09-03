<template>
  <div class="dd-page platform-binding">
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="toogleTab">
        <el-tab-pane :label="tab.label" :name="tab.name" v-for="(tab, index) in tabs" :key="index">
          <el-form ref="form" :model="form1" label-width="150px" v-if="index == 0">
            <el-form-item label="APPID">
              <el-input v-model="form1.openplatformappid" placeholder="请填写开放平台APPID"></el-input>
              <p class="input-tip">开放平台APPID，登录已注册开放平台账户，官方提供的APPID</p>
            </el-form-item>
            <el-form-item label="APPSECRET">
              <el-input v-model="form1.appsecret" placeholder="请填写开放平台的APPSECERT"></el-input>
            </el-form-item>
            <el-form-item label="消息校验TOKEN">
              <el-input v-model="form1.messageCheckToken" placeholder="开放平台 消息校验签名"></el-input>
            </el-form-item>
            <el-form-item label="消息加解密Key">
              <el-input v-model="form1.addDecryptKey" placeholder="开放平台 消息加解密Key"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="info">取消</el-button>
              <el-button type="primary" @click="publicSave()">保存</el-button>
            </el-form-item>
          </el-form>
          <el-form ref="form" :model="form2" label-width="150px" v-if="index == 1">
            <el-form-item label="Accesskey">
              <el-input v-model="form2.qiniuyunAccessKey" placeholder="请填写七牛云的Accesskey"></el-input>
              <p class="input-tip">开放平台APPID，登录已注册开放平台账户，官方提供的APPID</p>
            </el-form-item>
            <el-form-item label="SecretKey">
              <el-input v-model="form2.qiniuyunSecretKey" placeholder="请填写七牛云的Secretkey"></el-input>
            </el-form-item>
            <el-form-item label="空间名称">
              <el-input
                v-model="form2.qiniuyunBucket"
                placeholder="请填写七牛云创建的空间名称， Bucket 识别符"
              ></el-input>
            </el-form-item>
            <el-form-item label="服务域名">
              <el-input v-model="form2.qiniuyunUrl" placeholder="请填写七牛云中已设置加速的域名(http://开头)"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="info">取消</el-button>
              <el-button type="primary" @click="qiniuSave()">保存</el-button>
            </el-form-item>
          </el-form>
          <el-form ref="form" :model="form3" label-width="150px" v-if="index == 2">
            <el-form-item label="AK">
              <el-input v-model="form3.ak" placeholder="请填写百度地图的AK开发者密钥"></el-input>
              <p class="tip">百度云提供，登陆已注册百度地图开放平台帐户，在“应用管理”中创建应用，获取AK</p>
            </el-form-item>
            <el-form-item label="sk私钥">
              <el-input v-model="form3.sk" placeholder="请填写百度地图开放平台的sk密钥"></el-input>
              <p class="tip">仅在该AK的验证方式是sn签名的验证方式时提供</p>
            </el-form-item>
            <el-form-item label="应用名称">
              <el-input v-model="form3.appName" placeholder="请填写百度地图开放平台创建的应用名称"></el-input>
            </el-form-item>
            <el-form-item label="应用编号">
              <el-input v-model="form3.appId" placeholder="请填写百度地图开放平台创建的应用编号"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="info">取消</el-button>
              <el-button type="primary" @click="mapSave()">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import ImgInclude from '@/components/CropImgInclue/index.vue';
export default {
  components: {
    ImgInclude,
  },
  data() {
    return {
      activeName: 'first',
      tabs: [
        {
          label: '开放平台绑定',
          name: 'first',
        },
        {
          label: '七牛云绑定',
          name: 'second',
        },
        {
          label: '地图绑定',
          name: 'third',
        },
      ],
      form1: {
        openplatformappid: '',
        appsecret: '',
        messageCheckToken: '',
        addDecryptKey: '',
        id: '',
      },
      form2: {
        qiniuyunAccessKey: '',
        qiniuyunSecretKey: '',
        qiniuyunBucket: '',
        qiniuyunUrl: '',
        id: '',
      },
      form3: {
        ak: '',
        sk: '',
        appName: '',
        appId: '',
        id: '',
      },
    };
  },
  mounted() {
    this.queryGongzhonghao();
  },
  methods: {
    /** 开放平台保存 */
    publicSave() {
      this.$ajax
        .post('/sys/sys_setting/bindKaifangpingtai', {
          id: this.form1.id,
          openplatformappid: this.form1.openplatformappid,
          appsecret: this.form1.appsecret,
          messageCheckToken: this.form1.messageCheckToken,
          addDecryptKey: this.form1.addDecryptKey,
        })
        .then(res => {
          this.$message.success('保存成功');
        })
        .catch(err => {
          console.log(err);
        });
    },
    /** 七牛保存 */
    qiniuSave() {
      let httpReg=/(http|https):\/\/([\w.]+\/?)\S*/;
      if (!httpReg.test(this.form2.qiniuyunUrl)) {
        this.$message.error('域名必须http开头');
        return;
      }
      this.$ajax
        .post('/sys/sys_setting/bindQiniuyun', {
          ...this.form2,
        })
        .then(res => {
          this.$message.success('保存成功');
        })
        .catch(err => {
          console.log(err);
        });
    },
    /** 地图保存 */
    mapSave() {
      this.$ajax
        .post('/sys/sys_setting/saveBaiduMapConfig', {
          ...this.form3,
        })
        .then(res => {
          this.$message.success('保存成功');
        })
        .catch(err => {
          console.log(err);
        });
    },
    /** 查询开放平台绑定信息 */
    queryGongzhonghao() {
      this.$ajax
        .get('/sys/sys_setting/queryKaifangpingtai')
        .then(res => {
          this.form1 = res.resObject || this.form1;
        })
        .catch(err => {
          console.log(err);
        });
    },
    /** 查询七牛云绑定信息 */
    queryQiniuyun() {
      this.$ajax
        .get('/sys/sys_setting/queryQiniuyun')
        .then(res => {
          this.form2 = res.resObject || this.form2;
        })
        .catch(err => {
          console.log(err);
        });
    },
    /** 查询地图信息 */
    queryMap() {
      this.$ajax
        .get('/sys/sys_setting/getBaiduMapConfig')
        .then(res => {
          this.form3 = res.resObject || this.form3;
        })
        .catch(err => {
          console.log(err);
        });
    },
    /* 切换tab */
    toogleTab(tab, event) {
      switch (tab.index) {
        case '0':
          this.queryGongzhonghao();
          break;
        case '1':
          this.queryQiniuyun();
          break;
        case '2':
          this.queryMap();
          break;
      }
    },
  },
};
</script>

<style lang="scss">
.platform-binding {
  .item {
    height: 200px !important;
  }
  .input-tip {
    height: 30px;
    color: #999;
    font-size: 12px;
    margin: 0px;
    padding: 0px;
  }

  .el-form-item__content {
    width: 400px;
  }

  .share-icon {
    .el-form-item__content {
      display: flex;
    }
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

  .img-tip {
    font-size: 12px;
    color: #999;
    margin-left: 10px;
  }
  .tip {
    font-size: 12px;
    color: #999;
    line-height: 14px;
    margin: 0px;
    margin-top: 12px;
  }
}
</style>
