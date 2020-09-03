<template>
  <!-- 公众号绑定 -->
  <div class="public-no-form public-bind">
    <el-card class="box-card">
      <el-form :model="publicData" :rules="rules" label-width="150px" class="demo-ruleForm">
        <el-form-item label="绑定状态">
          <p class="bind_flag">{{publicData.auth_status ? '已绑定' : '未绑定'}}</p>
        </el-form-item>
        <el-form-item label="APPID" prop="app_id">
          <el-input v-model="publicData.app_id" placeholder="请填写绑定的微信公众号APPID" clearable></el-input>
          <p class="tip">开发者ID是公众号开发识别码，配合开发者密码可调用公众号的接口能力。请登录微信公众号后台，在“开发>基本配置>公众号开发信息 ”查看开发者ID(AppID)，并复制于此处。</p>
        </el-form-item>
        <el-form-item label="APPSECRET" prop="appSecret">
          <el-input v-model="publicData.app_secret" placeholder="请填写绑定的微信公众号APPSECERT" clearable></el-input>
        </el-form-item>
        <el-form-item label="微信素材同步">
          <el-switch v-model="publicData.syn_flag" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="同步模式" prop="syn_model" v-if="publicData.syn_flag == 1">
          <el-radio-group v-model="publicData.syn_model">
            <el-radio :label="1">同步链接及标题</el-radio>
            <el-radio :label="2">同步正文详情</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="同步周期" prop="syn_cycle" v-if="publicData.syn_flag == 1">
          <el-radio-group v-model="publicData.syn_cycle">
            <el-radio :label="1">最近一周</el-radio>
            <el-radio :label="2">最近一个月</el-radio>
            <el-radio :label="3">最近半年</el-radio>
            <el-radio :label="4">最近一年</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自动发布" prop="auto_publish" v-if="publicData.syn_flag == 1">
          <el-switch v-model="publicData.auto_publish" :active-value="1" :inactive-value="0">
          </el-switch>
          <p class="tip">自动将同步的素材发布至默认频道 "已发布状态",关闭后，同步至默认频道 但为“待发布状态”</p>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm()">保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="微信授权：请确认管理员扫描成功后，关闭对话框" :visible.sync="dialogVisible" width="80%">
      <iframe :src="iframeSrc" frameborder="0" width="100%" height="500" @onload="loadFrame()"></iframe>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: ['publicData'],
    data() {
      return {
        rules: {
          app_id: [{
            required: true,
            message: "请填写绑定的微信公众号APPID",
            trigger: "blur"
          }],
          channel_title_image: [{
            required: true,
            message: "请上传频道ICON",
            trigger: "change"
          }],
          syn_model:[{
            required: true,
            message: "请选择同步模式",
            trigger: "change"
          }],
          syn_cycle:[{
            required: true,
            message: "请选择是否自动发布",
            trigger: "change"
          }],
          auto_publish:[{
            required: true,
            message: "请选择同步周期",
            trigger: "change"
          }]
        },
        dialogVisible: false,
        iframeSrc: '',
      };
    },
    mounted() {

    },
    methods: {
      submitForm() {
        if(this.publicData.syn_flag === null){
          this.publicData.syn_flag = 0;
        }
        if(this.publicData.auto_publish === null){
          this.publicData.auto_publish = 0;
        }
        this.$ajax
          .post("/sys/unitwechatconfig/bindGongzhonghao", {
            ...this.duplicateRemoval(this.publicData)
          })
          .then(res => {
            if (res.resObject) {

              this.iframeSrc = res.resObject;
              this.dialogVisible = true;

            } else {
              this.$message.error('授权地址为空')
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      cancel() {},

      loadFrame() {
        console.log('====')
        console.log(e)
      }

    },

    watch: {
      dialogVisible(value) {
        if(!value) {
          this.$emit('load-data')
        }
      }
    }
  };

</script>

<style lang="scss">
  .public-bind {
    .el-form-item__content {
      width: 500px;
    }

    .tip {
      font-size: 12px;
      color: #999;
      width: 400px;
      line-height: 18px;
    }
    .bind_flag{
      margin: 0px;

    }
  }

</style>
