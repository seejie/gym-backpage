<template>
  <div class="channel_form">
    <el-card class="box-card">
      <el-form :model="channelData"
               :rules="rules"
               ref="channelForm"
               label-width="100px"
               class="demo-ruleForm">
        <channel-main :channelData="channelData" ref="channelMain"></channel-main>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm()">提交
          </el-button>
          <el-button @click="preview()">预览</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import channelMain from "@/components/ChannelMgmt/index";
  import {saveChannel, getChannelCommonData} from "@/api/apiPlatformSetting"
  import {info,confirm} from '../../utils/ddHelper'

  export default {
    name: 'kecheng',
    props: {
      channelData: {
        type: Object
      }
    },
    data() {
      return {
        rules: {
          // channel_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          // //channel_sort: [{required: true, message: '请选择频道展示位置', trigger: 'change'}],
          // channel_title_image: [{required: true, message: '请上传频道ICON', trigger: 'change'}],
          // channel_img_url: [{required: true, message: '请上传分享图片', trigger: 'change'}],
          // share_title: [{required: true, message: '请输入分享标题', trigger: 'blur'}]
        }
      }
    },
    methods: {
      submitForm() {
        let self = this;
        self.$refs.channelForm.validate((valid) => {
          if (valid) {
            confirm(self,'确定提交吗？',()=>{
              saveChannel(
                getChannelCommonData(self.channelData)
              ).then(_ => {
                info(this, `${self.channelData.channel_name}频道修改成功`);
              })
            })
          } else {
            return false;
          }
        })
      },
      preview() {
        this.$refs.channelMain.isShowPreviewDialog = true;
      }
    },
    components: {channelMain}
  }
</script>
