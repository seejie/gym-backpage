<template>
  <div class="channel_form">
    <el-card class="box-card">
      <el-form
        :model="channelData"
        :rules="rules"
        ref="channelForm"
        label-width="120px"
        label-position="left"
        class="demo-ruleForm"
      >
        <div class="form-title">热门路线</div>
        <el-form-item label="订阅数">
          <el-switch v-model="channelData.subscribeNum" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="栏目名称" prop="luxianName">
          <el-col :span="8">
            <el-input v-model="channelData.luxianName" placeholder="请输入名称" clearable></el-input>
          </el-col>
        </el-form-item>
        <div class="form-title">攻略达人</div>
        <el-form-item label="展示用户积分">
          <el-switch v-model="channelData.showUserCredits" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="栏目名称" prop="gonglueName">
          <el-col :span="8">
            <el-input v-model="channelData.gonglueName" placeholder="请输入名称" clearable></el-input>
          </el-col>
        </el-form-item>
        <div class="form-title">发布审核</div>
        <el-form-item label-width="15px">
          <el-radio-group v-model="channelData.checkMode">
            <el-radio :label="1">先发后审</el-radio>
            <el-radio :label="2">先审后发</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <audit-model-comp :channel-data="channelData"></audit-model-comp> -->
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <el-button @click="preview()">预览</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <preview
      @change-show="onChangeShow"
      :is-show-preview-dialog="isShowPreviewDialog"
      :preview_url="preview_url"
    ></preview>
  </div>
</template>
<script>
import { info, confirm } from '../../utils/ddHelper';
import preview from '@/components/ChannelMgmt/components/preview_dialog';
import channelData from '@/utils/channelData';
export default {
  name: 'gonglue',
  props: {},
  components: { preview },
  data() {
    return {
      rules: {
        luxianName: [
          {
            required: true,
            message: '请输入栏目名称',
            trigger: 'blur',
          },
        ],
        gonglueName: [
          {
            required: true,
            message: '请输入栏目名称',
            trigger: 'blur',
          },
        ],
      },
      preview_url: '',
      isShowPreviewDialog: false,
      channelData: {
        subscribeNum: false,
        luxianName: '',
        showUserCredits: false,
        checkMode: 1,
        gonglueName: 3,
        id: '',
      },
    };
  },
  watch: {},
  created() {
    this.getPageSetting();
    this.loadChannelInfo();
  },
  methods: {
    submitForm() {
      this.$refs.channelForm.validate(valid => {
        if (valid) {
          this.savePageSetting();
        }
      });
    },
    preview() {
      this.isShowPreviewDialog = true;
    },
    onChangeShow(show) {
      this.isShowPreviewDialog = show;
    },
    getPageSetting() {
      this.$ajax.get('/gonglue/getPageSet').then(res => {
        if (res.resCode == 200) {
          let data = res.resObject;
          this.channelData.subscribeNum = data.subscribeNum;
          this.channelData.luxianName = data.luxianName;
          this.channelData.showUserCredits = data.showUserCredits;
          this.channelData.checkMode = data.checkMode;
          this.channelData.gonglueName = data.gonglueName;
          this.channelData.id = data.id;
        }
      });
    },
    savePageSetting() {
      this.$ajax
        .post('/gonglue/savePageSet', this.channelData)
        .then(res => {
          if (res.resCode == 200) {
            info(this, `提交成功`);
            this.loadChannelInfo();
          }
        })
        .catch(error => {
          this.$message.error('提交失败', error);
        });
    },
    loadChannelInfo() {
      this.$ajax
        .get(
          `/platformsetting/channel/getChannelByUnitIdAndChannelType?channelType=${channelData.shequ.channelType}`,
          {}
        )
        .then(res => {
          if (res.resObject) {
            this.preview_url = res.resObject.previewUrl;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.form-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 60px;
}
/deep/ .el-form-item__label {
  padding-left: 15px;
}
</style>
