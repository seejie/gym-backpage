<template>
  <!-- 功能配置 -->
  <div class="dd-page">
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane
          :label="tab.label"
          :name="tab.name+''"
          v-for="(tab,index) in tabs"
          :key="index"
        >
          <publicBind @load-data="loadData" v-if="activeName == '1'" :publicData="publicData"></publicBind>
          <payBind v-if="activeName == '2'" :payData="payData"></payBind>
          <routine v-if="activeName == '3'" :routineData="routineData"></routine>
          <noteTemplate
            v-if="activeName == '4'"
            :noteTemplateData="noteTemplateData"
            :childTemplateData="templateData"
          ></noteTemplate>
          <liveBind v-if="activeName == '5'" :liveData="liveData"></liveBind>
          <attention v-if="activeName == '6'" :attentionData="attentionData"></attention>
          <styleCustomization v-if="activeName == '7'" :styleData="styleData"></styleCustomization>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import publicBind from "./publicBind"; /** 公众号绑定 */
import payBind from "./payBind"; /** 支付绑定 */
import routine from "./routine"; /** 小程序绑定 */
import noteTemplate from "./noteTemplate"; /** 短信模版 */
import liveBind from "./liveBind"; /** 直播绑定 */
import attention from "./attention"; /** 关注引导 */
import styleCustomization from "./styleCustomization"; /** 风格自定义 */
export default {
  data() {
    return {
      activeName: "1",
      tabs: [
        {
          label: "公众号绑定",
          name: "1"
        },
        {
          label: "支付绑定",
          name: "2"
        },
        {
          label: "小程序绑定",
          name: "3"
        },
        {
          label: "短信模版",
          name: "4"
        },
        {
          label: "直播绑定",
          name: "5"
        },
        {
          label: "关注引导",
          name: "6"
        },
        {
          label: "风格自定义",
          name: "7"
        }
      ],
      attentionData: {
        wxName: "",
        guanzhuTips: "",
        qrcodeUrl: "",
        funcFlag: true,
        popupMode: "",
        forwardUrl: ""
      },
      payData: {
        id: "",
        mch_id: "",
        mch_key: "",
        apiclient_cert: "",
        apiclient_key: "",
        rootca: ""
      },
      routineData: {
        id: "",
        mini_app_id: "",
        mini_app_secret: ""
      },
      noteTemplateData: {
        id:'',
          unitId:'',
          smsAccessKeyId:'',
          smsAccessKeySecret:''
      },
      liveData:{
        serviceProvider:"",
        appid:"",
        appName:"",
        secretId:"",
        secretKey:"",
        pushDomain:"",
        playDomain:"",
        untiThiefKey:"",
        auth_status:0
      },
      publicData: {
        app_id: "",
        app_secret: "",
        syn_model: "",
        syn_cycle: "",
        auto_publish: "",
        syn_flag: ""
      },
      styleData: {
        sys_name: "",
        share_title: "",
        share_icon: "",
        sys_logo: "",
        index_logo: ""
      },
      templateData: []
    };
  },
  components: {
    publicBind,
    payBind,
    noteTemplate,
    attention,
    liveBind,
    styleCustomization,
    routine
  },
  mounted() {
    this.loadData();
  },
  watch: {
    activeName(newVal, oldVal) {
      if (newVal == 4) {

      }
    }
  },
  methods: {
    loadData() {
      this.$ajax
        .get("/sys/unitwechatconfig/getUnitWxConfigInfo")
        .then(res => {
          if (res.resObject) {
            let obj = res.resObject;
            // this.attentionData = {
            //   id: obj.id,
            //   wxName: obj.wxName,
            //   guanzhuTips: obj.guanzhuTips,
            //   qrcodeUrl: obj.qrcodeUrl,
            //   funcFlag: obj.funcFlag ? true : false,
            //   popupMode: obj.popupMode,
            //   forwardUrl: obj.forwardUrl || ""
            // };
            this.routineData = {
              id: obj.id,
              mini_app_id: obj.miniAppId,
              mini_app_secret: obj.miniAppSecret
            },
            this.payData = {
                id: obj.id,
                mch_id: obj.mchId,
                mch_key: obj.mchKey,
                apiclient_cert: obj.apiclientCert,
                apiclient_key: obj.apiclientKey,
                rootca: obj.rootca
              };
            this.publicData = {
              app_id: obj.appId,
              app_secret: obj.appSecret,
              syn_model: obj.synModel,
              syn_cycle: obj.synCycle,
              auto_publish: obj.autoPublish || 0,
              syn_flag: obj.synFlag || 0,
              auth_status: obj.authStatus || 0
            };
          }
        })
        .catch(err => {
          console.log(err);
        });
        this.$ajax
        .get("/platformsetting/functionsetting/customizeStyle/getDefalutStyleInfo")
        .then(res => {
          this.styleData = {...res.resObject};
        })
        this.$ajax
        .get("/platformsetting/functionsetting/smsbinding/getSmsTemplate")
        .then(res => {
          this.noteTemplateData = {...res.resObject};
        })
        this.$ajax
        .get("/platformsetting/functionsetting/guanzhuGuide/getGuanzhuyindaoInfo")
        .then(res => {
          this.attentionData = {...res.resObject};
        })
        this.$ajax
          .get("/platformsetting/sms/searchSmsTemplateList")
          .then(res => {
            if (res.resObject) {
              this.templateData = res.resObject || [];
            }
          })
          .catch(err => {
            console.log(err);
          });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
