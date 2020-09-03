<template>
  <div class="channel_form">
    <el-card class="box-card">
      <el-form :model="form"
               :rules="rules"
               ref="channelForm"
               label-width="120px"
               class="demo-ruleForm">
        <h4 style="color: #333">话题（活动）设置</h4>
        <el-form-item label="模块开关">
        <el-switch v-model="form.interactionSwitch" :active-value="1"
                   :inactive-value="0" :width="60"></el-switch>
        </el-form-item>
        <el-form-item label="栏目名称" prop="interactionColumnName">
          <el-col :span="8">
            <el-input v-model="form.interactionColumnName"
                      maxlength="5"
                      placeholder="请输入名称" clearable></el-input>
          </el-col>
        </el-form-item>

        <h4 style="color: #333">发布审核</h4>
        <el-form-item label="审核模式" prop="audit_model">
          <el-radio-group v-model="form.publishVerifyPolicy">
            <el-radio :label="0">先发后审</el-radio>
            <el-radio :label="1">先审后发</el-radio>
          </el-radio-group>

          <!-- <div class="channel-text-desc">默认先发后审，先审后发是指户发布完需后台审核通过方能显示</div> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm()">提交
          </el-button>
          <el-button @click="preview()">预览</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <preview @change-show="onChangeShow" :is-show-preview-dialog="isShowPreviewDialog" :preview_url="preview_url"></preview>
  </div>
</template>
<script>
  import {addCirclePageSetting, modifyCirclePageSetting} from "@/api/apiPlatformSetting"
  import {info, confirm} from '../../utils/ddHelper'
  import preview from '@/components/ChannelMgmt/components/preview_dialog'
  import channelData from "@/utils/channelData";

  export default {
    name: 'quanzi',
    props: {
      channelData: {
        type: Object
      }
    },
    data() {
      return {
        rules: {
          interactionColumnName: [{required: true, message: '请输入栏目名称', trigger: 'blur'}],
          // channel_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          // //channel_sort: [{required: true, message: '请选择频道展示位置', trigger: 'change'}],
          // channel_title_image: [{required: true, message: '请上传频道ICON', trigger: 'change'}],
          // channel_img_url: [{required: true, message: '请上传分享图片', trigger: 'change'}],
          // share_title: [{required: true, message: '请输入分享标题', trigger: 'blur'}],
          // audit_model: [{required: true, message: '请选择审核模式', trigger: 'change'}]
        },

        form: {
          interactionSwitch: 0,
          interactionColumnName: '',
          publishVerifyPolicy: 0
        },

        pageSetting: {},
        preview_url: "",
        isShowPreviewDialog: false
      }
    },

    created() {
      this.getPageSetting()
      this.loadChannelInfo()
    },

    methods: {
      getPageSetting() {
        this.$ajax
          .get("/circle/pagesetting/getPageSetting", {})
          .then(res => {
            if (res.resObject) {

              this.pageSetting = res.resObject

              const {
                interactionSwitch,
                interactionColumnName,
                publishVerifyPolicy
              } = res.resObject

              this.form = {
                interactionSwitch,
                interactionColumnName,
                publishVerifyPolicy
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      },

      loadChannelInfo() {
        this.$ajax
          .get(`/platformsetting/channel/getChannelByUnitIdAndChannelType?channelType=${channelData.friendsCircle.channelType}`, {})
          .then(res => {
            if (res.resObject) {

              this.preview_url = res.resObject.previewUrl
            }
          })
          .catch(err => {
            console.log(err);
          });
      },

      submitForm() {
        let self = this;
        self.$refs.channelForm.validate((valid) => {
          if (valid) {

            confirm(self, '确定提交吗？', () => {
              if(this.pageSetting && this.pageSetting.id) {
                modifyCirclePageSetting({
                  ...this.form,
                  id: this.pageSetting.id
                }).then(_ => {
                  info(this, `提交成功`);
                })
              } else {
                addCirclePageSetting({
                  ...this.form
                }).then(_ => {
                  info(this, `提交成功`);
                })
              }
            })
          } else {
            return false;
          }
        })
      },
      preview(){
        this.isShowPreviewDialog = true
      },
      onChangeShow(show) {
        this.isShowPreviewDialog = show
      },
    },
    components: {
      preview
    }
  }
</script>
